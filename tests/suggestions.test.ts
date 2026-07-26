import { describe, expect, it } from 'bun:test';
import {
	MAX_CANDIDATES,
	OPENING_SUGGESTION,
	SUGGESTIONS,
	candidatesFor,
	resolveSuggestion
} from '../src/lib/kodexbar/suggestions';
import { allChunks, getChunk } from '../src/lib/kodexbar/packs';
import { SUPPORTED_LANGUAGES } from '../src/lib/ui/language';
import type { CorpusChunk } from '../src/lib/kodexbar/types';

const chunk = (localId: string, lang = 'es'): CorpusChunk =>
	getChunk(`cv:${localId}:${lang}`)!;

describe('suggestion registry integrity', () => {
	it('opens with a real question in every language', () => {
		for (const lang of SUPPORTED_LANGUAGES) {
			expect(OPENING_SUGGESTION[lang]).toBeTruthy();
			expect(OPENING_SUGGESTION[lang]).toInclude('?');
		}
	});

	it('mirrors every id across both languages', () => {
		const es = SUGGESTIONS.filter((s) => s.lang === 'es').map((s) => s.id);
		const en = SUGGESTIONS.filter((s) => s.lang === 'en').map((s) => s.id);
		expect(new Set(es)).toEqual(new Set(en));
	});

	it('keeps ids unique within a language', () => {
		for (const lang of SUPPORTED_LANGUAGES) {
			const ids = SUGGESTIONS.filter((s) => s.lang === lang).map((s) => s.id);
			expect(new Set(ids).size).toBe(ids.length);
		}
	});

	it('phrases every suggestion as a question', () => {
		for (const s of SUGGESTIONS) {
			expect(s.text.trim().endsWith('?')).toBe(true);
		}
	});

	it('resolves every `after` id to a real chunk in some registered pack', () => {
		const localIdsByLanguage = new Set(
			allChunks().map((chunk) => `${chunk.id.split(':')[1]}:${chunk.lang}`)
		);
		const dangling: string[] = [];
		for (const s of SUGGESTIONS) {
			for (const ref of s.after) {
				if (!localIdsByLanguage.has(`${ref}:${s.lang}`)) dangling.push(`${s.lang}/${s.id} -> ${ref}`);
			}
		}
		expect(dangling).toEqual([]);
	});

	it('gives every suggestion at least one trigger', () => {
		for (const s of SUGGESTIONS) {
			expect(s.after.length).toBeGreaterThan(0);
		}
	});
});

describe('candidatesFor', () => {
	it('returns nothing when no chunk was retrieved', () => {
		expect(candidatesFor([], 'es')).toEqual([]);
	});

	it('offers follow-ups the retrieved context points at', () => {
		const ids = candidatesFor([chunk('perfil')], 'es').map((s) => s.id);
		expect(ids.length).toBeGreaterThan(0);
		expect(ids).toContain('contacto');
	});

	it('stays in the requested language', () => {
		for (const s of candidatesFor([chunk('perfil', 'en')], 'en')) {
			expect(s.lang).toBe('en');
		}
	});

	it('never proposes a question the retrieved context already answered', () => {
		const ids = candidatesFor([chunk('contacto')], 'es').map((s) => s.id);
		expect(ids).not.toContain('contacto');
	});

	it(`caps the list at ${MAX_CANDIDATES}`, () => {
		const many = ['perfil', 'contacto', 'exp-alvs', 'skill-backend', 'skill-cloud-devops', 'skill-ia-agentes']
			.map((id) => chunk(id));
		expect(candidatesFor(many, 'es').length).toBeLessThanOrEqual(MAX_CANDIDATES);
	});

	it('orders by how much of the context supports the follow-up', () => {
		const weights = candidatesFor(
			['perfil', 'exp-alvs', 'skill-cloud-devops'].map((id) => chunk(id)),
			'es'
		).map((s) => s.after.filter((a) => ['perfil', 'exp-alvs', 'skill-cloud-devops'].includes(a)).length);

		expect(weights).toEqual([...weights].sort((a, b) => b - a));
	});
});

describe('resolveSuggestion', () => {
	const candidates = candidatesFor([chunk('perfil')], 'es');

	it('returns the text for an offered id', () => {
		const target = candidates[1] ?? candidates[0];
		expect(resolveSuggestion(target.id, candidates)).toBe(target.text);
	});

	it('falls back to the strongest candidate for an unknown id', () => {
		expect(resolveSuggestion('not-a-real-id', candidates)).toBe(candidates[0].text);
		expect(resolveSuggestion('', candidates)).toBe(candidates[0].text);
		expect(resolveSuggestion(undefined, candidates)).toBe(candidates[0].text);
		expect(resolveSuggestion(42, candidates)).toBe(candidates[0].text);
	});

	it('tolerates surrounding whitespace in the id', () => {
		expect(resolveSuggestion(`  ${candidates[0].id} `, candidates)).toBe(candidates[0].text);
	});

	it('returns undefined when nothing was offered', () => {
		expect(resolveSuggestion('contacto', [])).toBeUndefined();
	});

	it('can only ever return authored text', () => {
		const authored = new Set(SUGGESTIONS.map((s) => s.text));
		for (const id of ['contacto', 'bogus', '', '../../etc/passwd', '<script>']) {
			const resolved = resolveSuggestion(id, candidates);
			if (resolved !== undefined) expect(authored.has(resolved)).toBe(true);
		}
	});
});
