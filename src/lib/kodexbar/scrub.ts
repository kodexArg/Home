export const MAX_ANSWER_CHARS = 900;
export const MAX_PLACEHOLDER_CHARS = 90;

const BARE_OR_PROTOCOL_URL = /\b(?:https?:\/\/|www\.)[^\s<>()[\]{}'"]+/gi;
const MAILTO_LINK = /\bmailto:[^\s<>()[\]{}'"]+/gi;
const BARE_DOMAIN = /\b[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+\.[a-z]{2,}\b/gi;
const EMAIL_ADDRESS = /\b[^\s@<>()[\]{}]+@[^\s@<>()[\]{}]+\.[a-z]{2,}\b/gi;

const URL_LIKE = [BARE_OR_PROTOCOL_URL, MAILTO_LINK, BARE_DOMAIN, EMAIL_ADDRESS];

function stripFencedAndInlineCode(text: string): string {
	return text.replace(/```[\s\S]*?```/g, ' ').replace(/`([^`]*)`/g, '$1');
}

function unwrapMarkdownLinksAndImages(text: string): string {
	return text
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
}

function stripLineAnchoredMarkdown(text: string): string {
	return text
		.replace(/^\s{0,3}#{1,6}\s+/gm, '')
		.replace(/^\s{0,3}>\s?/gm, '')
		.replace(/^\s{0,3}(?:[-*+]|\d+[.)])\s+/gm, '')
		.replace(/^\s{0,3}(?:[-*_]\s*){3,}$/gm, ' ');
}

function stripEmphasisMarkers(text: string): string {
	return text.replace(/(\*\*|__|\*|_|~~)/g, '');
}

function stripUrlLikeSpans(text: string): string {
	let result = text;
	for (const pattern of URL_LIKE) {
		result = result.replace(pattern, ' ');
	}
	return result;
}

function collapseToSingleLine(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}

function tidyDanglingPunctuation(text: string): string {
	return text
		.replace(/\s+([,.;:!?])/g, '$1')
		.replace(/\(\s*\)/g, '')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

export function scrubAnswerText(raw: unknown): string {
	if (typeof raw !== 'string') return '';

	let text = raw;
	text = stripFencedAndInlineCode(text);
	text = unwrapMarkdownLinksAndImages(text);
	text = stripLineAnchoredMarkdown(text);
	text = stripEmphasisMarkers(text);
	text = stripUrlLikeSpans(text);
	text = collapseToSingleLine(text);
	text = tidyDanglingPunctuation(text);

	return truncateAtBoundary(text, MAX_ANSWER_CHARS);
}

const SURROUNDING_QUOTES = /^["'“”‘’`]+|["'“”‘’`]+$/g;

export function scrubPlaceholderText(raw: unknown): string {
	if (typeof raw !== 'string') return '';

	let text = raw;
	text = stripFencedAndInlineCode(text);
	text = unwrapMarkdownLinksAndImages(text);
	text = stripLineAnchoredMarkdown(text);
	text = stripEmphasisMarkers(text);
	text = stripUrlLikeSpans(text);
	text = collapseToSingleLine(text);
	text = tidyDanglingPunctuation(text);
	text = text.replace(SURROUNDING_QUOTES, '').trim();

	return text.length > MAX_PLACEHOLDER_CHARS ? '' : text;
}

const SENTENCE_END_MARKS = ['. ', '! ', '? '];
const MIN_SENTENCE_END_POSITION_RATIO = 0.6;

function lastSentenceEndWithin(window: string): number {
	return Math.max(...SENTENCE_END_MARKS.map((mark) => window.lastIndexOf(mark)));
}

function truncateAtBoundary(text: string, max: number): string {
	if (text.length <= max) return text;

	const window = text.slice(0, max);
	const lastSentenceEnd = lastSentenceEndWithin(window);
	if (lastSentenceEnd > max * MIN_SENTENCE_END_POSITION_RATIO) {
		return window.slice(0, lastSentenceEnd + 1);
	}

	const lastSpace = window.lastIndexOf(' ');
	return (lastSpace > 0 ? window.slice(0, lastSpace) : window).trimEnd() + '…';
}

export function parseModelJson(
	raw: unknown
): { text: string; linkIds: string[]; nextId?: string; next?: string; ask?: string } | null {
	if (typeof raw !== 'string') return null;

	const cleaned = raw.replace(/```(?:json)?/gi, '').trim();
	const start = cleaned.indexOf('{');
	if (start === -1) return null;

	const end = indexOfMatchingBrace(cleaned, start);
	if (end === -1) return null;

	try {
		const parsed = JSON.parse(cleaned.slice(start, end + 1));
		return {
			text: typeof parsed?.text === 'string' ? parsed.text : '',
			linkIds: Array.isArray(parsed?.linkIds)
				? parsed.linkIds.filter((v: unknown): v is string => typeof v === 'string')
				: [],
			nextId: typeof parsed?.nextId === 'string' ? parsed.nextId : undefined,
			next: typeof parsed?.next === 'string' ? parsed.next : undefined,
			ask: typeof parsed?.ask === 'string' ? parsed.ask : undefined
		};
	} catch {
		return null;
	}
}

function indexOfMatchingBrace(text: string, openBraceIndex: number): number {
	let depth = 0;
	let insideString = false;
	let previousCharWasEscape = false;

	for (let i = openBraceIndex; i < text.length; i++) {
		const ch = text[i];
		if (previousCharWasEscape) {
			previousCharWasEscape = false;
			continue;
		}
		if (ch === '\\') {
			previousCharWasEscape = true;
			continue;
		}
		if (ch === '"') insideString = !insideString;
		if (insideString) continue;
		if (ch === '{') depth++;
		if (ch === '}') {
			depth--;
			if (depth === 0) return i;
		}
	}

	return -1;
}
