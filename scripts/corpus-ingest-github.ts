/**
 * Ingest kodexArg GitHub repo summaries into gh-public / gh-private corpus packs.
 *
 * Source of truth: one verbose markdown per repo under
 *   github-public-repos/{ExactRepoName}.md
 *   github-private-repos/{ExactRepoName}.md
 *
 * Bodies are scrubbed (no URL / domain / email literals) and split into
 * embeddable chunks. Public repos may related→ GitHub destinations; private never.
 *
 * Usage: bun run corpus:ingest-github && bun run corpus:compile
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LinkDestination } from '../src/kodexbar/types';

const ORG = 'kodexArg';
const ROOT = join(import.meta.dir, '..');
const CORPUS_ROOT = join(ROOT, 'corpus');
const DEST_OUT = join(ROOT, 'src', 'kodexbar', 'destinations.github.ts');
const PUBLIC_DIR = join(ROOT, 'github-public-repos');
const PRIVATE_DIR = join(ROOT, 'github-private-repos');

const TARGET_CHARS = 1_400;
const MIN_CHARS = 80;
/** Keep Worker + Vectorize lean: identity/problems/stack sections first. */
const MAX_CHUNKS_PER_REPO = 6;

/** Manual destinations.ts repo URLs → ids (do not import DESTINATIONS; that pulls generated github list). */
const MANUAL_REPO_DEST_IDS: ReadonlyMap<string, string> = new Map(
	[
		['engram', 'engram'],
		['openclaw', 'openclaw'],
		['odysseus', 'odysseus'],
		['python-telegram-bot-mcp', 'python-telegram-bot-mcp'],
		['dj-indoor-monitor', 'dj-indoor-monitor'],
		['welpdesk', 'welpdesk'],
		['kdx-pi-signage', 'kdx-pi-signage'],
		['kdx-pi-signage-2', 'kdx-pi-signage-2'],
		['rpi-door-access-rfid', 'rpi-door-access-rfid'],
		['raspberry-pi-temperature-to-telegram', 'raspberry-pi-temperature-to-telegram'],
		['camera-alert-to-telegram', 'camera-alert-to-telegram'],
		['kdx-pi-cam', 'kdx-pi-cam'],
		['template-angular-21-csr-primeng', 'template-angular-21-csr-primeng'],
		['astro-drf-aws', 'astro-drf-aws'],
		['dj-apprunner-template', 'dj-apprunner-template'],
		['n8n-apprunner', 'n8n-apprunner'],
		['lambda-update-route53', 'lambda-update-route53'],
		['blocky', 'blocky'],
		['cf-ng-eurotrip2026', 'cf-ng-eurotrip2026'],
		['comfyui-1', 'comfyui-1'],
		['cowsay', 'cowsay'],
		['data-engineer-handbook', 'data-engineer-handbook'],
		['klaude-cursors', 'klaude-cursors'],
		['qa-reports', 'qa-reports'],
		['figus', 'figus'],
		['alvs-capacitacion', 'alvs-capacitacion'],
		['astro-cv', 'astro-cv']
	].map(([repo, id]) => [repo.toLowerCase(), id] as const)
);

interface SummaryDoc {
	repo: string;
	title: string;
	visibility: 'public' | 'private';
	importance: 'high' | 'normal' | 'low';
	body: string;
	description: string;
}

function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

/**
 * Local chunk id only — runtime Vectorize id is `pack:localId:lang` (≤ 64 bytes).
 * Longest pack prefix: `gh-private` (11) + 2 colons + lang (2) ⇒ localId ≤ 49.
 * Shape: `{slug≤32}-{index}-{hash8}` (max ~44).
 */
function chunkId(repo: string, index: number, title: string): string {
	const hash = createHash('sha1').update(`${repo}\0${index}\0${title}`).digest('hex').slice(0, 8);
	const base = slugify(repo).slice(0, 32) || 'repo';
	const id = `${base}-${index}-${hash}`;
	if (id.length > 49) {
		throw new Error(`local chunk id too long for Vectorize budget: ${id} (${id.length})`);
	}
	return id;
}

function scrubBody(text: string): string {
	return text
		.replace(/\bhttps?:\/\/\S+/gi, '')
		.replace(/\bmailto:\S+/gi, '')
		.replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, '')
		.replace(/\b[a-z0-9-]+\.(?:com|org|net|io|dev|ar)\b/gi, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/!\[[^\]]*\]\([^)]+\)/g, '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]+`/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
	const trimmed = raw.replace(/^\uFEFF/, '');
	if (!trimmed.startsWith('---')) {
		throw new Error('missing frontmatter');
	}
	const end = trimmed.indexOf('\n---', 3);
	if (end < 0) throw new Error('unterminated frontmatter');
	const yaml = trimmed.slice(4, end).trim();
	const body = trimmed.slice(end + 4).replace(/^\n/, '').trim();
	const data: Record<string, string> = {};
	for (const line of yaml.split('\n')) {
		const m = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.*)$/);
		if (!m) continue;
		const key = m[1]!;
		let value = m[2]!.trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			try {
				value = JSON.parse(value.includes('"') ? value : value.replace(/^'|'$/g, '"'));
			} catch {
				value = value.slice(1, -1);
			}
		}
		data[key] = String(value);
	}
	return { data, body };
}

function splitChunks(titleBase: string, body: string): { title: string; text: string }[] {
	const cleaned = scrubBody(body);
	if (cleaned.length < MIN_CHARS) return [];

	const sections = body.split(/\n(?=#{1,3}\s+)/);
	const out: { title: string; text: string }[] = [];

	for (const section of sections) {
		const lines = section.split('\n');
		const heading = lines[0]?.match(/^#{1,3}\s+(.+)$/)?.[1]?.trim();
		const raw = scrubBody(section);
		if (raw.length < MIN_CHARS) continue;

		let rest = raw;
		let part = 0;
		while (rest.length > 0) {
			let slice = rest.slice(0, TARGET_CHARS);
			if (rest.length > TARGET_CHARS) {
				const cut = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf(' '));
				if (cut > TARGET_CHARS * 0.5) slice = slice.slice(0, cut + 1);
			}
			const text = slice.trim();
			if (text.length >= MIN_CHARS) {
				const title =
					part === 0
						? `${titleBase}${heading ? ` — ${heading}` : ''}`.slice(0, 160)
						: `${titleBase}${heading ? ` — ${heading}` : ''} (${part + 1})`.slice(0, 160);
				out.push({ title, text });
				part += 1;
			}
			rest = rest.slice(slice.length).trim();
			if (part > 8) break;
		}
	}

	if (out.length === 0 && cleaned.length >= MIN_CHARS) {
		out.push({ title: titleBase.slice(0, 160), text: cleaned.slice(0, TARGET_CHARS) });
	}
	return out.slice(0, MAX_CHUNKS_PER_REPO);
}

function yamlList(values: readonly string[]): string {
	if (values.length === 0) return '[]';
	return `[${values.map((v) => JSON.stringify(v)).join(', ')}]`;
}

function writeChunkFile(
	pack: string,
	lang: 'es' | 'en',
	id: string,
	title: string,
	text: string,
	related: string[],
	tags: string[],
	visibility: 'public' | 'private',
	importance: 'high' | 'normal' | 'low',
	sourceRepo: string
): void {
	const dir = join(CORPUS_ROOT, pack, lang);
	mkdirSync(dir, { recursive: true });
	const md = `---
id: ${id}
title: ${JSON.stringify(title)}
visibility: ${visibility}
importance: ${importance}
source_repo: ${JSON.stringify(sourceRepo)}
related: ${yamlList(related)}
tags: ${yamlList(tags)}
---

${text}
`;
	writeFileSync(join(dir, `${id}.md`), md);
}

function existingDestinationIdByRepo(repo: string): string | undefined {
	return MANUAL_REPO_DEST_IDS.get(repo.toLowerCase());
}

function destinationIdFor(repo: string): string {
	return existingDestinationIdByRepo(repo) ?? `gh-${slugify(repo)}`;
}

function readSummary(path: string, visibility: 'public' | 'private'): SummaryDoc {
	const raw = readFileSync(path, 'utf8');
	const { data, body } = parseFrontmatter(raw);
	const fileRepo = path.split('/').pop()!.replace(/\.md$/i, '');
	const repo = (data.source_repo || data.id || fileRepo).trim();
	const title = (data.title || repo).trim();
	const importance =
		data.importance === 'high' || data.importance === 'low' ? data.importance : 'normal';
	const fmVis = data.visibility === 'private' ? 'private' : data.visibility === 'public' ? 'public' : visibility;
	if (fmVis !== visibility) {
		console.warn(`  warn ${fileRepo}: frontmatter visibility=${fmVis} vs folder=${visibility}`);
	}
	const firstPara = body
		.split(/\n\n+/)
		.map((p) => scrubBody(p))
		.find((p) => p.length > 40);
	return {
		repo,
		title,
		visibility,
		importance,
		body,
		description: firstPara?.slice(0, 280) || `kodexArg GitHub repository ${repo}.`
	};
}

function listSummaries(dir: string, visibility: 'public' | 'private'): SummaryDoc[] {
	const names = readdirSync(dir)
		.filter((n) => n.endsWith('.md') && n.toLowerCase() !== 'readme.md')
		.sort((a, b) => a.localeCompare(b));
	return names.map((name) => readSummary(join(dir, name), visibility));
}

function resetPackLangDirs(): void {
	for (const pack of ['gh-public', 'gh-private']) {
		for (const lang of ['es', 'en']) {
			const dir = join(CORPUS_ROOT, pack, lang);
			rmSync(dir, { recursive: true, force: true });
			mkdirSync(dir, { recursive: true });
		}
	}
}

function emitDestinations(generated: LinkDestination[]): void {
	const body = `import type { LinkDestination } from './types';

export const GITHUB_DESTINATIONS: LinkDestination[] = ${JSON.stringify(generated, null, 2)};
`;
	writeFileSync(DEST_OUT, body);
}

function ingestSummary(
	doc: SummaryDoc,
	generated: LinkDestination[]
): { chunks: number } {
	const pack = doc.visibility === 'private' ? 'gh-private' : 'gh-public';
	const destId = destinationIdFor(doc.repo);
	const related = doc.visibility === 'private' ? [] : [destId];

	if (doc.visibility === 'public' && !existingDestinationIdByRepo(doc.repo)) {
		if (!generated.some((d) => d.id === destId)) {
			generated.push({
				id: destId,
				kind: 'repo',
				name: `${doc.repo} (GitHub)`,
				url: `https://github.com/${ORG}/${doc.repo}`,
				description: doc.description,
				keywords: [
					doc.repo.toLowerCase(),
					'github',
					'repo',
					'repositorio',
					slugify(doc.repo)
				]
			});
		}
	}

	const pieces = splitChunks(doc.title, doc.body);
	const usedIds = new Set<string>();
	let chunks = 0;

	for (const [index, piece] of pieces.entries()) {
		const id = chunkId(doc.repo, index, piece.title);
		if (usedIds.has(id)) continue;
		usedIds.add(id);
		const tags = [
			doc.repo.toLowerCase(),
			'github',
			doc.visibility,
			doc.importance,
			'summary'
		];
		for (const lang of ['es', 'en'] as const) {
			writeChunkFile(
				pack,
				lang,
				id,
				piece.title,
				piece.text,
				related,
				tags,
				doc.visibility,
				doc.importance,
				doc.repo
			);
		}
		chunks += 1;
	}

	return { chunks };
}

const publicDocs = listSummaries(PUBLIC_DIR, 'public');
const privateDocs = listSummaries(PRIVATE_DIR, 'private');
console.log(`→ ingesting ${publicDocs.length} public + ${privateDocs.length} private summaries`);

resetPackLangDirs();

const generated: LinkDestination[] = [];
let totalChunks = 0;

for (const doc of [...publicDocs, ...privateDocs]) {
	process.stdout.write(`→ ${doc.repo} (${doc.visibility})… `);
	const result = ingestSummary(doc, generated);
	totalChunks += result.chunks;
	console.log(`${result.chunks} chunks`);
}

emitDestinations(generated);
console.log(`✓ ${totalChunks} chunk ids (×2 langs) from ${publicDocs.length + privateDocs.length} summaries`);
console.log(`✓ wrote ${DEST_OUT} (${generated.length} new destinations)`);
console.log('  next: bun run corpus:compile');
