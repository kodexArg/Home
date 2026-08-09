import { describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateCorpusLayout } from '../scripts/corpus-layout';

const CORPUS_ROOT = join(import.meta.dir, '..', 'corpus');

describe('corpus format (markdown SSOT)', () => {
	it('accepts the committed corpus layout and frontmatter', () => {
		const offenders = validateCorpusLayout(CORPUS_ROOT);
		expect(offenders).toEqual([]);
	});

	it('flags stray files, bad names, and incomplete frontmatter', () => {
		const root = mkdtempSync(join(tmpdir(), 'kodex-corpus-'));
		mkdirSync(join(root, 'demo', 'es'), { recursive: true });
		mkdirSync(join(root, 'demo', 'en'), { recursive: true });
		mkdirSync(join(root, 'demo', 'fr'), { recursive: true });
		writeFileSync(join(root, 'NOTES.txt'), 'nope');
		writeFileSync(
			join(root, 'demo', '_pack.md'),
			`---\nid: demo\ndescription: "Demo pack"\nminScore: 0.5\n---\n\nFragment for the demo pack system prompt.\n`
		);
		writeFileSync(join(root, 'demo', 'extra.md'), 'stray at pack root');
		writeFileSync(join(root, 'demo', 'es', 'note.txt'), 'wrong extension');
		writeFileSync(
			join(root, 'demo', 'es', 'good-note.md'),
			`---\nid: other-id\ntitle: "Mismatch"\nrelated: []\ntags: []\n---\n\n${'x'.repeat(50)}\n`
		);
		writeFileSync(
			join(root, 'demo', 'es', 'short.md'),
			`---\nid: short\ntitle: "Too short"\nrelated: []\ntags: []\n---\n\ntiny\n`
		);
		writeFileSync(
			join(root, 'demo', 'en', 'short.md'),
			`---\nid: short\ntitle: "Too short"\nrelated: []\ntags: []\n---\n\n${'y'.repeat(50)}\n`
		);

		const offenders = validateCorpusLayout(root);
		expect(offenders.some((e) => e.includes('NOTES.txt'))).toBe(true);
		expect(offenders.some((e) => e.includes('extra.md'))).toBe(true);
		expect(offenders.some((e) => e.includes('fr/'))).toBe(true);
		expect(offenders.some((e) => e.includes('note.txt'))).toBe(true);
		expect(offenders.some((e) => e.includes('filename must be other-id.md'))).toBe(true);
		expect(offenders.some((e) => e.includes('body shorter than 40'))).toBe(true);
		expect(offenders.some((e) => e.includes('missing under en/'))).toBe(true);
	});
});
