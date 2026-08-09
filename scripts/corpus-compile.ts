import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CORPUS_LANGS, parseFrontmatter, validateCorpusLayout } from './corpus-layout';

const CORPUS_ROOT = join(import.meta.dir, '..', 'corpus');
const PACKS_ROOT = join(import.meta.dir, '..', 'src', 'kodexbar', 'packs');
const LANGS = CORPUS_LANGS;

interface PackMeta {
	id: string;
	description: string;
	minScore: number;
	fragment: string;
}

interface ChunkDoc {
	id: string;
	title: string;
	related: string[];
	tags: string[];
	body: string;
	needsAge: boolean;
	visibility: 'public' | 'private';
	importance: 'high' | 'normal' | 'low';
	sourceRepo?: string;
}

function listPackIds(): string[] {
	return readdirSync(CORPUS_ROOT, { withFileTypes: true })
		.filter((d) => d.isDirectory())
		.map((d) => d.name)
		.sort();
}

function readPackMeta(packId: string): PackMeta {
	const raw = readFileSync(join(CORPUS_ROOT, packId, '_pack.md'), 'utf8');
	const { data, body } = parseFrontmatter(raw);
	const id = String(data.id ?? '');
	if (id !== packId) throw new Error(`${packId}/_pack.md id mismatch: ${id}`);
	const description = String(data.description ?? '');
	const minScore = Number(data.minScore);
	if (!description || !Number.isFinite(minScore)) {
		throw new Error(`${packId}/_pack.md missing description or minScore`);
	}
	return { id, description, minScore, fragment: body };
}

function readChunks(packId: string, lang: string): ChunkDoc[] {
	const dir = join(CORPUS_ROOT, packId, lang);
	let names: string[];
	try {
		names = readdirSync(dir).filter((n) => n.endsWith('.md')).sort();
	} catch {
		return [];
	}
	return names.map((name) => {
		const raw = readFileSync(join(dir, name), 'utf8');
		const { data, body } = parseFrontmatter(raw);
		const id = String(data.id ?? '');
		const title = String(data.title ?? '');
		const related = Array.isArray(data.related) ? data.related.map(String) : [];
		const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
		if (!id || !title || body.length < 40) {
			throw new Error(`${packId}/${lang}/${name} incomplete`);
		}
		if (`${id}.md` !== name) {
			throw new Error(`${packId}/${lang}/${name} filename must be ${id}.md`);
		}
		const needsAge = body.includes('{{AGE_YEARS}}');
		const visibility = data.visibility === 'private' ? 'private' : 'public';
		const importance =
			data.importance === 'high' || data.importance === 'low' ? data.importance : 'normal';
		const sourceRepo =
			typeof data.source_repo === 'string' && data.source_repo.trim()
				? data.source_repo.trim()
				: undefined;
		return { id, title, related, tags, body, needsAge, visibility, importance, sourceRepo };
	});
}

function escTemplate(text: string): string {
	return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function emitChunkModule(packId: string, lang: string, chunks: ChunkDoc[]): string {
	const constName = `${packId.toUpperCase().replace(/-/g, '_')}_CHUNKS_${lang.toUpperCase()}`;
	const needsAge = chunks.some((c) => c.needsAge);
	const ageImport = needsAge
		? `import { computeGabrielCavedalAgeInYears } from './age';\n`
		: '';
	const defs = chunks
		.map((c) => {
			const body = c.needsAge
				? escTemplate(c.body).replaceAll('{{AGE_YEARS}}', '${computeGabrielCavedalAgeInYears()}')
				: escTemplate(c.body);
			const related = JSON.stringify(c.related);
			const tags = JSON.stringify(c.tags);
			const sourceRepo = c.sourceRepo
				? `\n\t\tsourceRepo: ${JSON.stringify(c.sourceRepo)},`
				: '';
			return `\t{
\t\tid: ${JSON.stringify(c.id)},
\t\ttitle: ${JSON.stringify(c.title)},
\t\ttext: \`${body}\`,
\t\trelated: ${related},
\t\ttags: ${tags},
\t\tvisibility: ${JSON.stringify(c.visibility)},
\t\timportance: ${JSON.stringify(c.importance)},${sourceRepo}
\t}`;
		})
		.join(',\n');

	return `import { defineChunks, type ChunkDef } from '../defineChunks';
${ageImport}
const DEFS: ChunkDef[] = [
${defs}
];

export const ${constName} = defineChunks(${JSON.stringify(packId)}, ${JSON.stringify(lang)}, DEFS);
`;
}

function emitPackIndex(pack: PackMeta, hasEs: boolean, hasEn: boolean): string {
	const constBase = pack.id.toUpperCase().replace(/-/g, '_');
	const imports: string[] = [`import type { KnowledgePack } from '../../types';`];
	const spreads: string[] = [];
	if (hasEs) {
		imports.push(`import { ${constBase}_CHUNKS_ES } from './chunks.es';`);
		spreads.push(`...${constBase}_CHUNKS_ES`);
	}
	if (hasEn) {
		imports.push(`import { ${constBase}_CHUNKS_EN } from './chunks.en';`);
		spreads.push(`...${constBase}_CHUNKS_EN`);
	}
	const fragment = escTemplate(pack.fragment);
	return `${imports.join('\n')}

export const ${constBase}_PACK: KnowledgePack = {
\tid: ${JSON.stringify(pack.id)},
\tdescription: ${JSON.stringify(pack.description)},
\tsystemPromptFragment: \`${fragment}\`,
\tminScore: ${pack.minScore},
\tchunks: [${spreads.join(', ')}]
};
`;
}

function emitPacksRegistry(packIds: string[]): string {
	const consts = packIds.map((id) => id.toUpperCase().replace(/-/g, '_'));
	const imports = packIds
		.map((id, i) => `import { ${consts[i]}_PACK } from './${id}';`)
		.join('\n');
	const list = consts.map((c) => `${c}_PACK`).join(', ');
	return `import type { CorpusChunk, KnowledgePack } from '../types';
import type { SupportedLanguage } from '../../lib/ui/language';
${imports}

export const PACKS: readonly KnowledgePack[] = [${list}];

const BY_ID = new Map(PACKS.map((p) => [p.id, p]));

export function getPack(id: string): KnowledgePack | undefined {
\treturn BY_ID.get(id);
}

export function allChunks(): CorpusChunk[] {
\treturn PACKS.flatMap((p) => p.chunks);
}

const CHUNKS_BY_ID = new Map(allChunks().map((c) => [c.id, c]));

export function getChunk(id: string): CorpusChunk | undefined {
\treturn CHUNKS_BY_ID.get(id);
}

export function minScoreFor(packId: string): number {
\treturn BY_ID.get(packId)?.minScore ?? 1.1;
}

export function expandRelated(chunks: readonly CorpusChunk[], lang: SupportedLanguage): CorpusChunk[] {
\tconst out = [...chunks];
\tconst seen = new Set(chunks.map((c) => c.id));

\tfor (const chunk of chunks) {
\t\tfor (const ref of chunk.related) {
\t\t\tconst id = \`\${chunk.pack}:\${ref}:\${lang}\`;
\t\t\tif (seen.has(id)) continue;
\t\t\tconst linked = CHUNKS_BY_ID.get(id);
\t\t\tif (linked) {
\t\t\t\tseen.add(id);
\t\t\t\tout.push(linked);
\t\t\t}
\t\t}
\t}

\treturn out;
}
`;
}

const layoutErrors = validateCorpusLayout(CORPUS_ROOT);
if (layoutErrors.length > 0) {
	console.error('✗ corpus layout/format errors:');
	for (const err of layoutErrors) console.error(`  - ${err}`);
	process.exit(1);
}

const packIds = listPackIds();
if (packIds.length === 0) {
	console.error('✗ no packs under corpus/');
	process.exit(1);
}

const registryIds: string[] = [];

for (const packId of packIds) {
	const meta = readPackMeta(packId);
	const outDir = join(PACKS_ROOT, packId);
	mkdirSync(outDir, { recursive: true });

	let hasEs = false;
	let hasEn = false;
	for (const lang of LANGS) {
		const chunks = readChunks(packId, lang);
		if (chunks.length === 0) continue;
		if (lang === 'es') hasEs = true;
		else hasEn = true;
		writeFileSync(join(outDir, `chunks.${lang}.ts`), emitChunkModule(packId, lang, chunks));
	}
	if (!hasEs && !hasEn) throw new Error(`pack ${packId} has no chunks`);
	writeFileSync(join(outDir, 'index.ts'), emitPackIndex(meta, hasEs, hasEn));
	registryIds.push(packId);
	console.log(`✓ ${packId}: es=${hasEs} en=${hasEn}`);
}

writeFileSync(join(PACKS_ROOT, 'index.ts'), emitPacksRegistry(registryIds));
console.log(`✓ wrote ${join(PACKS_ROOT, 'index.ts')}`);
