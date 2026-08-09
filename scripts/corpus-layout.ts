/**
 * KodexCorpus layout + frontmatter gate (ADR 13 / 14).
 * Compile only loads `*.md` under es|en — this module fails closed on stray paths.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const CORPUS_LANGS = ['es', 'en'] as const;
export type CorpusLang = (typeof CORPUS_LANGS)[number];

const CHUNK_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PACK_ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const GH_PACKS = new Set(['gh-public', 'gh-private']);

export interface FrontmatterParse {
	data: Record<string, unknown>;
	body: string;
}

export function parseFrontmatter(raw: string): FrontmatterParse {
	const trimmed = raw.replace(/^\uFEFF/, '');
	if (!trimmed.startsWith('---')) {
		throw new Error('missing frontmatter');
	}
	const end = trimmed.indexOf('\n---', 3);
	if (end < 0) throw new Error('unterminated frontmatter');
	const yaml = trimmed.slice(4, end).trim();
	const body = trimmed.slice(end + 4).replace(/^\n/, '').trim();
	const data: Record<string, unknown> = {};
	for (const line of yaml.split('\n')) {
		const m = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.*)$/);
		if (!m) continue;
		const key = m[1]!;
		const value = m[2]!.trim();
		if (value === '[]') {
			data[key] = [];
			continue;
		}
		if (value.startsWith('[') && value.endsWith(']')) {
			data[key] = JSON.parse(value.replace(/'/g, '"'));
			continue;
		}
		if (/^-?\d+(\.\d+)?$/.test(value)) {
			data[key] = Number(value);
			continue;
		}
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			data[key] = JSON.parse(value.includes('"') ? value : value.replace(/^'|'$/g, '"'));
			continue;
		}
		data[key] = value;
	}
	return { data, body };
}

const BODY_LEAK = [
	/\bhttps?:\/\/\S+/i,
	/\bmailto:\S+/i,
	/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
	/\b[a-z0-9-]+\.(?:com|org|net|io|dev|ar)\b/i
];

function listEntries(dir: string): { name: string; isDir: boolean; isFile: boolean }[] {
	return readdirSync(dir, { withFileTypes: true }).map((d) => ({
		name: d.name,
		isDir: d.isDirectory(),
		isFile: d.isFile()
	}));
}

function validateChunkFile(packId: string, absPath: string, relPath: string): string[] {
	const errors: string[] = [];
	const name = absPath.split('/').pop()!;
	if (!name.endsWith('.md')) {
		errors.push(`${relPath}: only .md chunk files allowed`);
		return errors;
	}
	// Authoring scaffolds live under templates/, never under corpus/<pack>/<lang>/.
	if (name.startsWith('.') || name === '_pack.md' || /\.TEMPLATE\.md$/i.test(name)) {
		errors.push(`${relPath}: forbidden chunk filename`);
		return errors;
	}

	let data: Record<string, unknown>;
	let body: string;
	try {
		const parsed = parseFrontmatter(readFileSync(absPath, 'utf8'));
		data = parsed.data;
		body = parsed.body;
	} catch (err) {
		errors.push(`${relPath}: ${err instanceof Error ? err.message : String(err)}`);
		return errors;
	}

	const id = typeof data.id === 'string' ? data.id.trim() : '';
	const title = typeof data.title === 'string' ? data.title.trim() : '';
	if (!id) errors.push(`${relPath}: missing id`);
	else if (!CHUNK_ID.test(id)) errors.push(`${relPath}: id must be kebab-case slug (${id})`);
	else if (`${id}.md` !== name) errors.push(`${relPath}: filename must be ${id}.md`);

	if (!title) errors.push(`${relPath}: missing title`);
	if (!Array.isArray(data.related)) errors.push(`${relPath}: related must be a JSON array`);
	if (!Array.isArray(data.tags)) errors.push(`${relPath}: tags must be a JSON array`);
	if (body.length < 40) errors.push(`${relPath}: body shorter than 40 characters`);

	for (const pattern of BODY_LEAK) {
		const found = body.match(pattern);
		if (found) errors.push(`${relPath}: body leaks "${found[0]}"`);
	}

	if (data.visibility !== undefined && data.visibility !== 'public' && data.visibility !== 'private') {
		errors.push(`${relPath}: visibility must be public|private`);
	}
	if (
		data.importance !== undefined &&
		data.importance !== 'high' &&
		data.importance !== 'normal' &&
		data.importance !== 'low'
	) {
		errors.push(`${relPath}: importance must be high|normal|low`);
	}

	if (GH_PACKS.has(packId)) {
		if (data.visibility !== 'public' && data.visibility !== 'private') {
			errors.push(`${relPath}: gh packs require visibility`);
		}
		if (
			data.importance !== 'high' &&
			data.importance !== 'normal' &&
			data.importance !== 'low'
		) {
			errors.push(`${relPath}: gh packs require importance`);
		}
		if (typeof data.source_repo !== 'string' || !data.source_repo.trim()) {
			errors.push(`${relPath}: gh packs require source_repo (repo name, not URL)`);
		} else if (/[\/\s]/.test(data.source_repo) || /^https?:/i.test(data.source_repo)) {
			errors.push(`${relPath}: source_repo must be a bare repo name`);
		}
	}

	return errors;
}

function validatePack(corpusRoot: string, packId: string): string[] {
	const errors: string[] = [];
	const packDir = join(corpusRoot, packId);
	if (!PACK_ID.test(packId)) {
		errors.push(`${packId}/: pack folder name must be kebab-case`);
	}

	const entries = listEntries(packDir);
	const allowedDirs = new Set<string>(CORPUS_LANGS);
	for (const entry of entries) {
		if (entry.name.startsWith('.')) {
			errors.push(`${packId}/${entry.name}: hidden paths are not allowed in packs`);
			continue;
		}
		if (entry.isFile) {
			if (entry.name !== '_pack.md') {
				errors.push(`${packId}/${entry.name}: only _pack.md is allowed at pack root`);
			}
			continue;
		}
		if (entry.isDir) {
			if (!allowedDirs.has(entry.name)) {
				errors.push(`${packId}/${entry.name}/: only es/ and en/ language dirs allowed`);
			}
			continue;
		}
		errors.push(`${packId}/${entry.name}: unexpected entry type`);
	}

	const packMetaPath = join(packDir, '_pack.md');
	try {
		statSync(packMetaPath);
	} catch {
		errors.push(`${packId}/: missing _pack.md`);
		return errors;
	}

	try {
		const { data, body } = parseFrontmatter(readFileSync(packMetaPath, 'utf8'));
		const id = String(data.id ?? '');
		if (id !== packId) errors.push(`${packId}/_pack.md: id must equal folder name`);
		if (!String(data.description ?? '').trim()) errors.push(`${packId}/_pack.md: missing description`);
		const minScore = Number(data.minScore);
		if (!Number.isFinite(minScore) || minScore <= 0 || minScore >= 1) {
			errors.push(`${packId}/_pack.md: minScore must be in (0, 1)`);
		}
		if (body.trim().length < 20) errors.push(`${packId}/_pack.md: fragment body too short`);
	} catch (err) {
		errors.push(`${packId}/_pack.md: ${err instanceof Error ? err.message : String(err)}`);
	}

	const idsByLang: Record<string, Set<string>> = {};
	for (const lang of CORPUS_LANGS) {
		const langDir = join(packDir, lang);
		idsByLang[lang] = new Set();
		let langEntries: ReturnType<typeof listEntries>;
		try {
			langEntries = listEntries(langDir);
		} catch {
			errors.push(`${packId}/: missing ${lang}/`);
			continue;
		}
		for (const entry of langEntries) {
			const rel = `${packId}/${lang}/${entry.name}`;
			if (entry.isDir) {
				errors.push(`${rel}/: nested directories are not allowed`);
				continue;
			}
			if (!entry.isFile) {
				errors.push(`${rel}: unexpected entry`);
				continue;
			}
			const abs = join(langDir, entry.name);
			const fileErrors = validateChunkFile(packId, abs, rel);
			errors.push(...fileErrors);
			if (entry.name.endsWith('.md') && !fileErrors.some((e) => e.includes('missing id'))) {
				try {
					const { data } = parseFrontmatter(readFileSync(abs, 'utf8'));
					if (typeof data.id === 'string' && data.id.trim()) idsByLang[lang]!.add(data.id.trim());
				} catch {
					/* already reported */
				}
			}
		}
	}

	const es = idsByLang.es ?? new Set();
	const en = idsByLang.en ?? new Set();
	if (es.size === 0 && en.size === 0) {
		errors.push(`${packId}/: no chunks in es/ or en/`);
	} else {
		for (const id of es) {
			if (!en.has(id)) errors.push(`${packId}/: chunk id "${id}" missing under en/`);
		}
		for (const id of en) {
			if (!es.has(id)) errors.push(`${packId}/: chunk id "${id}" missing under es/`);
		}
	}

	return errors;
}

/** Returns human-readable offenders. Empty = corpus layout is clean. */
export function validateCorpusLayout(corpusRoot: string): string[] {
	const errors: string[] = [];
	const top = listEntries(corpusRoot);
	for (const entry of top) {
		const rel = relative(corpusRoot, join(corpusRoot, entry.name)) || entry.name;
		if (entry.name.startsWith('.')) {
			errors.push(`${rel}: hidden paths are not allowed under corpus/`);
			continue;
		}
		if (entry.isFile) {
			if (entry.name !== 'README.md') {
				errors.push(`${rel}: only README.md is allowed at corpus root`);
			}
			continue;
		}
		if (!entry.isDir) {
			errors.push(`${rel}: unexpected entry`);
			continue;
		}
		errors.push(...validatePack(corpusRoot, entry.name));
	}
	return errors;
}
