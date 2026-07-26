import { describe, expect, it } from 'bun:test';
import { PACKS, allChunks, expandRelated, getChunk, getPack, minScoreFor } from '../src/lib/kodexbar/packs';
import { getDestination } from '../src/lib/kodexbar/destinations';
import { SUPPORTED_LANGUAGES } from '../src/lib/ui/language';

const chunks = allChunks();

describe('corpus integrity', () => {
	it('registers at least one pack', () => {
		expect(PACKS.length).toBeGreaterThan(0);
	});

	it('gives every chunk a globally unique id', () => {
		const ids = chunks.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('composes ids as pack:local:lang', () => {
		for (const chunk of chunks) {
			const parts = chunk.id.split(':');
			expect(parts.length).toBe(3);
			expect(parts[0]).toBe(chunk.pack);
			expect(parts[2]).toBe(chunk.lang);
		}
	});

	it('only uses supported languages', () => {
		for (const chunk of chunks) {
			expect(SUPPORTED_LANGUAGES).toContain(chunk.lang);
		}
	});

	it('gives every chunk non-empty title and text', () => {
		for (const chunk of chunks) {
			expect(chunk.title.trim().length).toBeGreaterThan(0);
			expect(chunk.text.length).toBeGreaterThan(40);
		}
	});

	it('normalises whitespace in chunk text', () => {
		for (const chunk of chunks) {
			expect(chunk.text).not.toInclude('\n');
			expect(chunk.text).not.toInclude('  ');
		}
	});

	it('contains no URL, domain or email literal in chunk text', () => {
		const offenders: string[] = [];
		const patterns = [
			/\bhttps?:\/\/\S+/i,
			/\bmailto:\S+/i,
			/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
			/\b[a-z0-9-]+\.(?:com|org|net|io|dev|ar)\b/i
		];

		for (const chunk of chunks) {
			for (const pattern of patterns) {
				const found = chunk.text.match(pattern);
				if (found) offenders.push(`${chunk.id}: "${found[0]}"`);
			}
		}

		expect(offenders).toEqual([]);
	});

	it('resolves every related reference to a destination or a sibling chunk', () => {
		const dangling: string[] = [];
		for (const chunk of chunks) {
			for (const ref of chunk.related) {
				const asChunk = getChunk(`${chunk.pack}:${ref}:${chunk.lang}`);
				if (!getDestination(ref) && !asChunk) dangling.push(`${chunk.id} -> ${ref}`);
			}
		}
		expect(dangling).toEqual([]);
	});

	it('covers both languages in the cv pack', () => {
		const byLang = chunks.reduce<Record<string, number>>((acc, c) => {
			acc[c.lang] = (acc[c.lang] ?? 0) + 1;
			return acc;
		}, {});
		expect(byLang.es).toBeGreaterThan(0);
		expect(byLang.en).toBeGreaterThan(0);
	});

	it('answers the questions the product promises', () => {
		const es = chunks.filter((c) => c.lang === 'es');
		expect(es.some((c) => c.tags.includes('mail') || c.tags.includes('correo'))).toBe(true);
		expect(es.some((c) => c.tags.includes('aws'))).toBe(true);
		expect(es.some((c) => c.tags.includes('django'))).toBe(true);
		expect(es.some((c) => c.related.includes('github'))).toBe(true);
	});

	it('can describe itself and its purpose in every language', () => {
		for (const lang of SUPPORTED_LANGUAGES) {
			const chunk = getChunk(`cv:kodexbar-funcion:${lang}`);
			expect(chunk).toBeDefined();
			expect(chunk!.related).toContain('email');
			expect(getDestination('email')).toBeDefined();
		}
	});
});

describe('gate thresholds', () => {
	it('returns the pack threshold for a registered pack', () => {
		const pack = PACKS[0];
		expect(minScoreFor(pack.id)).toBe(pack.minScore);
		expect(minScoreFor(pack.id)).toBeGreaterThan(0);
		expect(minScoreFor(pack.id)).toBeLessThan(1);
	});

	it('fails closed for an unknown pack', () => {
		expect(minScoreFor('does-not-exist')).toBeGreaterThan(1);
	});
});

describe('expandRelated', () => {
	it('pulls in sibling chunks named by related', () => {
		const seed = getChunk('cv:skill-cloud-devops:es');
		expect(seed).toBeDefined();

		const expanded = expandRelated([seed!], 'es');
		const ids = expanded.map((c) => c.id);

		expect(ids).toContain('cv:skill-cloud-devops:es');
		expect(ids).toContain('cv:proj-alvs-cloud:es');
		expect(expanded.length).toBeGreaterThan(1);
	});

	it('stays in the requested language', () => {
		const seed = getChunk('cv:skill-backend:en');
		for (const chunk of expandRelated([seed!], 'en')) {
			expect(chunk.lang).toBe('en');
		}
	});

	it('does not duplicate the seed', () => {
		const seed = getChunk('cv:contacto:es');
		const expanded = expandRelated([seed!], 'es');
		expect(new Set(expanded.map((c) => c.id)).size).toBe(expanded.length);
	});

	it('expands only one hop', () => {
		const seed = getChunk('cv:skill-backend:es')!;
		const expanded = expandRelated([seed], 'es');
		const direct = new Set([seed.id, ...seed.related.map((r) => `cv:${r}:es`)]);
		for (const chunk of expanded) {
			expect(direct.has(chunk.id)).toBe(true);
		}
	});

	it('returns the input unchanged when nothing is related', () => {
		const seed = getChunk('cv:idiomas:es')!;
		expect(expandRelated([seed], 'es').map((c) => c.id)).toEqual([seed.id]);
	});
});

describe('getPack', () => {
	it('finds a registered pack and misses an unknown one', () => {
		expect(getPack('cv')?.id).toBe('cv');
		expect(getPack('nope')).toBeUndefined();
	});

	it('gives every pack a system prompt fragment', () => {
		for (const pack of PACKS) {
			expect(pack.systemPromptFragment.trim().length).toBeGreaterThan(0);
		}
	});
});
