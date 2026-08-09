/**
 * Reflow corpus markdown bodies for RAG readability without changing meaning.
 *
 * Rules:
 * - Never touch YAML frontmatter keys/values.
 * - Prefer ## over # for titles (model confusion).
 * - Blank line before blockquote lines (`>`).
 * - Unflatten glued GitHub-summary templates (P-fields, tables, section prose).
 * - Skip `_pack.md` (system prompt fragments) and `corpus/README.md`.
 *
 * Usage: bun run scripts/corpus-reflow-markdown.ts [--check]
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const CORPUS_ROOT = join(import.meta.dir, '..', 'corpus');
const CHECK = process.argv.includes('--check');

const P_FIELD_MARKERS = [
	'Who hurts',
	'Pain today',
	'How this repo answers',
	'Out of scope'
] as const;

const SECTION_HEADINGS = [
	'## 1. Identity',
	'## 2. Problems it solves',
	'## 3. Product / idea',
	'### 3.1 North-star use cases',
	'### 3.2 Non-goals',
	'## 4. Technology stack',
	'### 4.1 Notable dependencies (curated)',
	'## 5. Repository map (abstraction)',
	'## 6. Configuration & contracts (no secrets)',
	'### 6.1 HTTP / API endpoints (when applicable)',
	'### 6.2 Other interfaces',
	'## 7. Data & persistence',
	'## 8. Docs & agent memory (required scan)',
	'## 9. Security & privacy notes (summary-time)',
	'## 10. Operational picture',
	'## 11. Open questions / unknowns'
] as const;

function splitFrontmatter(raw: string): { fm: string; body: string } | null {
	const trimmed = raw.replace(/^\uFEFF/, '');
	if (!trimmed.startsWith('---')) return null;
	const end = trimmed.indexOf('\n---', 3);
	if (end < 0) return null;
	const fm = trimmed.slice(0, end + 4); // includes closing ---
	const body = trimmed.slice(end + 4).replace(/^\n+/, '');
	return { fm, body };
}

function splitGluedTable(segment: string): string {
	const s = segment.trim();
	if (!s.startsWith('|')) return segment;

	const sepMatch = s.match(/\|(?:\s*:?-{3,}:?\s*\|){2,}/);
	const ncol = sepMatch
		? sepMatch[0]!.split('|').filter((part) => part.length > 0).length
		: 2;
	if (ncol < 2 || ncol > 8) return segment;

	const cell = '[^|]*';
	const oneRow = new RegExp('^' + (`\\|${cell}`).repeat(ncol) + '\\|');
	const rows: string[] = [];
	let rest = s;
	while (rest.length > 0) {
		rest = rest.replace(/^\s+/, '');
		if (!rest) break;
		const m = rest.match(oneRow);
		if (!m) {
			return rows.length >= 2 ? `${rows.join('\n')}\n${rest}` : segment;
		}
		rows.push(m[0]!);
		rest = rest.slice(m[0]!.length);
	}
	return rows.length >= 2 ? rows.join('\n') : segment;
}

function splitNumberedItems(text: string): string {
	return text.replace(/(?<!^)(?<![\n])\s+(\d+)\.\s+/g, '\n$1. ').trim();
}

function splitBulletItems(text: string): string {
	// " - item" glued after heading/prose, but not inside words
	return text.replace(/(?<!^)(?<![\n])\s+-\s+/g, '\n- ').trim();
}

function ensureBlankBeforeBlockquotes(body: string): string {
	const lines = body.split('\n');
	const out: string[] = [];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]!;
		const prev = out.length ? out[out.length - 1]! : '';
		if (line.startsWith('>') && prev.trim() !== '' && !prev.startsWith('>')) {
			out.push('');
		}
		out.push(line);
	}
	return out.join('\n');
}

function reflowGithubBody(body: string): string {
	let b = body.replace(/\r\n/g, '\n').replace(/^\n+/, '').trimEnd();

	// # Title → ## Title (do not touch ### or ##)
	if (/^# [^#]/.test(b)) {
		b = b.replace(/^# /, '## ');
	}

	// Empty title before thesis: "## > **Problem" → "> **Problem"
	b = b.replace(/^##\s+>/, '>');

	// "## Title > **Problem thesis" → heading + blank + quote
	b = b.replace(/^(#{2,6}[^\n]*?)\s+>/, '$1\n\n>');

	// Glued P-fields: "### P1 — Name - **Who hurts:** …"
	for (const marker of P_FIELD_MARKERS) {
		b = b.replaceAll(` - **${marker}:**`, `\n- **${marker}:**`);
	}
	b = b.replace(/^(### P\d+ — .+?)(\n- \*\*)/m, '$1\n$2');

	// Known section headings glued to remainder (same line or following lines)
	for (const heading of SECTION_HEADINGS) {
		if (!b.startsWith(heading)) continue;
		const afterHeading = b.slice(heading.length);
		const remainder = afterHeading.replace(/^\s+/, '');
		if (!remainder) break;

		if (remainder.startsWith('|')) {
			b = `${heading}\n\n${splitGluedTable(remainder)}`;
		} else if (heading.includes('North-star use cases')) {
			b = `${heading}\n\n${splitNumberedItems(remainder)}`;
		} else if (heading.includes('Non-goals') || heading.includes('Notable dependencies')) {
			b = `${heading}\n\n${splitBulletItems(remainder)}`;
		} else if (remainder.includes('| Layer |') || remainder.includes('| Method |') || remainder.includes('| Field |')) {
			const pipeAt = remainder.indexOf('|');
			if (pipeAt < 0) {
				b = `${heading}\n\n${remainder}`;
			} else if (pipeAt === 0) {
				b = `${heading}\n\n${splitGluedTable(remainder)}`;
			} else {
				const prose = remainder.slice(0, pipeAt).trim();
				const table = splitGluedTable(remainder.slice(pipeAt));
				b = prose ? `${heading}\n\n${prose}\n\n${table}` : `${heading}\n\n${table}`;
			}
		} else {
			b = `${heading}\n\n${remainder}`;
		}
		break;
	}

	// Any remaining glued table on a "## heading | …" first line
	b = b.replace(/^(#{2,6} [^\n|]+?)\s+(\|(?:[^|\n]+\|){2,})$/m, (_m, h: string, table: string) => {
		return `${h}\n\n${splitGluedTable(table)}`;
	});

	// Orphan glued tables on their own line (partial prior pass)
	b = b
		.split('\n')
		.map((line) => {
			const trimmed = line.trim();
			if (
				trimmed.startsWith('|') &&
				trimmed.includes('|-------') &&
				trimmed.length > 80
			) {
				return splitGluedTable(trimmed);
			}
			return line;
		})
		.join('\n');

	b = ensureBlankBeforeBlockquotes(b);
	b = b.replace(/\n{3,}/g, '\n\n');
	return b.trimEnd() + '\n';
}

function reflowGenericBody(body: string): string {
	let b = body.replace(/\r\n/g, '\n').replace(/^\n+/, '').trimEnd();

	if (/^# [^#]/.test(b)) {
		b = b.replace(/^# /, '## ');
	}
	b = b.replace(/^##\s+>/, '>');
	b = b.replace(/^(#{2,6}[^\n]*?)\s+>/, '$1\n\n>');
	b = ensureBlankBeforeBlockquotes(b);
	b = b.replace(/\n{3,}/g, '\n\n');
	return b.trimEnd() + '\n';
}

function shouldSkip(rel: string): boolean {
	if (rel === 'README.md') return true;
	if (rel.endsWith('/_pack.md') || rel === '_pack.md') return true;
	return false;
}

function listCorpusMarkdown(): string[] {
	const out: string[] = [];
	const walk = (dir: string) => {
		for (const name of readdirSync(dir)) {
			const p = join(dir, name);
			const st = statSync(p);
			if (st.isDirectory()) walk(p);
			else if (name.endsWith('.md')) out.push(p);
		}
	};
	walk(CORPUS_ROOT);
	return out.sort();
}

function reflowFile(abs: string): { changed: boolean; before: string; after: string } {
	const rel = relative(CORPUS_ROOT, abs).replaceAll('\\', '/');
	const raw = readFileSync(abs, 'utf8');
	if (shouldSkip(rel)) {
		return { changed: false, before: raw, after: raw };
	}

	const parts = splitFrontmatter(raw);
	if (!parts) {
		// no frontmatter (should not happen for pack notes)
		const after = reflowGenericBody(raw);
		return { changed: after !== raw, before: raw, after };
	}

	const pack = rel.split('/')[0] ?? '';
	const nextBody =
		pack === 'gh-public' || pack === 'gh-private'
			? reflowGithubBody(parts.body)
			: reflowGenericBody(parts.body);

	// Preserve single leading newline after --- (authoring convention)
	const after = `${parts.fm}\n${nextBody}`;
	return { changed: after !== raw, before: raw, after };
}

function main() {
	const files = listCorpusMarkdown();
	let changed = 0;
	let scanned = 0;
	const samples: string[] = [];

	for (const abs of files) {
		const rel = relative(CORPUS_ROOT, abs).replaceAll('\\', '/');
		if (shouldSkip(rel)) continue;
		scanned++;
		const result = reflowFile(abs);
		if (!result.changed) continue;
		changed++;
		if (samples.length < 12) samples.push(rel);
		if (!CHECK) writeFileSync(abs, result.after, 'utf8');
	}

	console.log(
		JSON.stringify(
			{
				mode: CHECK ? 'check' : 'write',
				scanned,
				changed,
				samples
			},
			null,
			2
		)
	);

	if (CHECK && changed > 0) {
		process.exit(1);
	}
}

main();
