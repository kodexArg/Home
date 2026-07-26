/**
 * Output shaping — the code half of adr-09 §4.
 *
 * The system prompt asks the model for one plain paragraph with no links. This
 * module *guarantees* it. A prompt is a request; post-processing is a control.
 * Every rule here must hold even when the model ignores its instructions
 * entirely, so nothing in this file may assume well-formed input.
 */

/** Hard ceiling on a rendered reply. Roughly a comfortable spoken paragraph. */
export const MAX_ANSWER_CHARS = 600;

const URL_LIKE = [
	// Bare or protocol-prefixed URLs, and mailto:.
	/\b(?:https?:\/\/|www\.)[^\s<>()[\]{}'"]+/gi,
	/\bmailto:[^\s<>()[\]{}'"]+/gi,
	// Bare domains: anything.tld, including the ones we actually own. Links
	// belong in `links[]`; prose never carries them.
	/\b[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}\b/gi,
	// Email addresses.
	/\b[^\s@<>()[\]{}]+@[^\s@<>()[\]{}]+\.[a-z]{2,}\b/gi
];

/**
 * Reduce arbitrary model output to a single plain-text paragraph.
 *
 * Order matters: fenced code is removed before inline backticks, and links are
 * unwrapped to their label before URL stripping so `[CV](https://…)` degrades
 * to `CV` rather than vanishing.
 */
export function scrubAnswerText(raw: unknown): string {
	if (typeof raw !== 'string') return '';

	let text = raw;

	// Fenced code blocks, then inline code.
	text = text.replace(/```[\s\S]*?```/g, ' ');
	text = text.replace(/`([^`]*)`/g, '$1');

	// Markdown links and images -> their label.
	text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
	text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

	// Headings, blockquotes, list markers, horizontal rules — line-anchored.
	text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '');
	text = text.replace(/^\s{0,3}>\s?/gm, '');
	text = text.replace(/^\s{0,3}(?:[-*+]|\d+[.)])\s+/gm, '');
	text = text.replace(/^\s{0,3}(?:[-*_]\s*){3,}$/gm, ' ');

	// Emphasis markers. Applied after list markers so a leading "* " is already gone.
	text = text.replace(/(\*\*|__|\*|_|~~)/g, '');

	// Anything URL-shaped. Runs last so unwrapped Markdown targets are caught too.
	for (const pattern of URL_LIKE) {
		text = text.replace(pattern, ' ');
	}

	// Collapse to a single line and normalise whitespace.
	text = text.replace(/\s+/g, ' ').trim();

	// Tidy punctuation left dangling by the removals above.
	text = text.replace(/\s+([,.;:!?])/g, '$1');
	text = text.replace(/\(\s*\)/g, '');
	text = text.replace(/\s{2,}/g, ' ').trim();

	return truncateAtBoundary(text, MAX_ANSWER_CHARS);
}

/**
 * Cut to `max` characters without slicing a word in half.
 *
 * Prefers the last sentence end, falls back to the last space, and appends an
 * ellipsis only when it actually cut something.
 */
function truncateAtBoundary(text: string, max: number): string {
	if (text.length <= max) return text;

	const window = text.slice(0, max);
	const lastSentence = Math.max(
		window.lastIndexOf('. '),
		window.lastIndexOf('! '),
		window.lastIndexOf('? ')
	);
	if (lastSentence > max * 0.6) return window.slice(0, lastSentence + 1);

	const lastSpace = window.lastIndexOf(' ');
	return (lastSpace > 0 ? window.slice(0, lastSpace) : window).trimEnd() + '…';
}

/**
 * Parse the model's JSON reply.
 *
 * Small models wrap JSON in prose or fences even when told not to, so this
 * extracts the first balanced object rather than trusting `JSON.parse` on the
 * whole string. Returns null when nothing usable is present — the caller
 * decides what to do, and MUST NOT fall back to rendering the raw text.
 */
export function parseModelJson(
	raw: unknown
): { text: string; linkIds: string[]; nextId?: string } | null {
	if (typeof raw !== 'string') return null;

	const cleaned = raw.replace(/```(?:json)?/gi, '').trim();
	const start = cleaned.indexOf('{');
	if (start === -1) return null;

	// Walk to the matching brace so trailing prose does not break the parse.
	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let i = start; i < cleaned.length; i++) {
		const ch = cleaned[i];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (ch === '\\') {
			escaped = true;
			continue;
		}
		if (ch === '"') inString = !inString;
		if (inString) continue;
		if (ch === '{') depth++;
		if (ch === '}') {
			depth--;
			if (depth === 0) {
				try {
					const parsed = JSON.parse(cleaned.slice(start, i + 1));
					return {
						text: typeof parsed?.text === 'string' ? parsed.text : '',
						linkIds: Array.isArray(parsed?.linkIds)
							? parsed.linkIds.filter((v: unknown): v is string => typeof v === 'string')
							: [],
						// Kept raw: it is an id, and the only thing done with it is a
						// lookup against the candidates the model was offered.
						nextId: typeof parsed?.nextId === 'string' ? parsed.nextId : undefined
					};
				} catch {
					return null;
				}
			}
		}
	}

	return null;
}
