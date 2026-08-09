import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PACKS } from '../src/kodexbar/packs';
import {
	GABRIEL_CAVEDAL_BIRTH_DAY,
	GABRIEL_CAVEDAL_BIRTH_MONTH,
	GABRIEL_CAVEDAL_BIRTH_YEAR,
	computeGabrielCavedalAgeInYears
} from '../src/kodexbar/packs/identity/age';

const ROOT = join(import.meta.dir, '..', 'corpus');
const ageNow = String(computeGabrielCavedalAgeInYears());

function yamlList(values: readonly string[]): string {
	if (values.length === 0) return '[]';
	return `[${values.map((v) => JSON.stringify(v)).join(', ')}]`;
}

function toBody(text: string): string {
	return text
		.replaceAll(ageNow, '{{AGE_YEARS}}')
		.replace(/\s+/g, ' ')
		.trim();
}

function writePackMeta(
	packId: string,
	description: string,
	minScore: number,
	fragment: string
): void {
	const dir = join(ROOT, packId);
	mkdirSync(dir, { recursive: true });
	const body = fragment.replace(/\s+/g, ' ').trim();
	const md = `---
id: ${packId}
description: ${JSON.stringify(description)}
minScore: ${minScore}
---

${body}
`;
	writeFileSync(join(dir, '_pack.md'), md);
}

function writeChunk(
	packId: string,
	lang: string,
	localId: string,
	title: string,
	text: string,
	related: readonly string[],
	tags: readonly string[]
): void {
	const dir = join(ROOT, packId, lang);
	mkdirSync(dir, { recursive: true });
	const md = `---
id: ${localId}
title: ${JSON.stringify(title)}
related: ${yamlList(related)}
tags: ${yamlList(tags)}
---

${toBody(text)}
`;
	writeFileSync(join(dir, `${localId}.md`), md);
}

mkdirSync(ROOT, { recursive: true });
writeFileSync(
	join(ROOT, 'README.md'),
	`# KodexCorpus

Markdown authoring SSOT for KodexBar knowledge packs ([ADR 13](../docs/adr-13-repo-layout.md)).

\`\`\`
bun run corpus:compile   # → src/kodexbar/packs/
bun run index:corpus     # → Vectorize (needs bun run dev)
\`\`\`

Chunk bodies must not contain URL, domain, or email literals. Use \`related\` for destination ids.
Identity age uses the placeholder \`{{AGE_YEARS}}\` (resolved at compile time from birth date ${GABRIEL_CAVEDAL_BIRTH_YEAR}-${GABRIEL_CAVEDAL_BIRTH_MONTH}-${GABRIEL_CAVEDAL_BIRTH_DAY}).
`
);

for (const pack of PACKS) {
	writePackMeta(pack.id, pack.description, pack.minScore, pack.systemPromptFragment);
	for (const chunk of pack.chunks) {
		const localId = chunk.id.split(':')[1]!;
		writeChunk(pack.id, chunk.lang, localId, chunk.title, chunk.text, chunk.related, chunk.tags);
	}
}

console.log(`✓ exported ${PACKS.length} packs into ${ROOT}`);
