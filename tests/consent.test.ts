import { describe, expect, it } from 'bun:test';
import {
	CONSENT_REPLY,
	classifyConsent,
	classifyLexically,
	normalise,
	parseIntent
} from '../src/lib/kodexbar/consent';

function envReturning(response: unknown, onRun?: () => void): Env {
	return {
		AI: {
			async run() {
				onRun?.();
				return { data: [], response } as any;
			}
		}
	} as Env;
}

describe('normalise', () => {
	it('folds accents, case and punctuation', () => {
		expect(normalise('¡Sí!')).toBe('si');
		expect(normalise('  DALE...  ')).toBe('dale');
		expect(normalise('Mostrámelos')).toBe('mostramelos');
	});

	it('joins across an apostrophe instead of splitting on it', () => {
		expect(normalise("let's see")).toBe('lets see');
	});

	it('returns empty for input with no letters', () => {
		expect(normalise('  ?? ')).toBe('');
	});
});

describe('the lexicon', () => {
	it('recognises bare affirmatives in both languages', () => {
		for (const reply of ['sí', 'Sí', 'dale', 'claro', 'adelante', 'yes', 'sure', 'go ahead']) {
			expect(classifyLexically(reply)).toBe('yes');
		}
	});

	it('recognises bare refusals', () => {
		for (const reply of ['no', 'no gracias', 'ahora no', 'no thanks', 'maybe later']) {
			expect(classifyLexically(reply)).toBe('no');
		}
	});

	it('matches the whole reply, never a prefix, so an affirmative-sounding question still reaches the pipeline', () => {
		expect(classifyLexically('yes but what is his AWS experience?')).toBeNull();
		expect(classifyLexically('no sé qué hace con Django')).toBeNull();
	});

	it('defers anything it does not know verbatim', () => {
		expect(classifyLexically('me encantaría verlos')).toBeNull();
		expect(classifyLexically('¿en qué tecnologías trabaja?')).toBeNull();
	});
});

describe('classifyConsent', () => {
	it('never calls the model for a reply the lexicon knows', async () => {
		let called = false;
		const env = envReturning('OTHER', () => {
			called = true;
		});

		expect(await classifyConsent(env, 'dale', 'es')).toBe('yes');
		expect(called).toBe(false);
	});

	it('asks the model for anything the lexicon does not recognise verbatim', async () => {
		let called = false;
		const env = envReturning('YES', () => {
			called = true;
		});

		expect(await classifyConsent(env, 'me encantaría verlos', 'es')).toBe('yes');
		expect(called).toBe(true);
	});

	it('falls back to other when the model is unreachable', async () => {
		expect(await classifyConsent({} as Env, 'me encantaría verlos', 'es')).toBe('other');
	});

	it('falls back to other when the model throws', async () => {
		const env = {
			AI: {
				async run() {
					throw new Error('boom');
				}
			}
		} as unknown as Env;

		expect(await classifyConsent(env, 'me encantaría verlos', 'es')).toBe('other');
	});
});

describe('parseIntent', () => {
	it('reads the verdict out of a chatty reply', () => {
		expect(parseIntent('YES')).toBe('yes');
		expect(parseIntent(' yes.')).toBe('yes');
		expect(parseIntent('The answer is NO')).toBe('no');
		expect(parseIntent('OTHER')).toBe('other');
	});

	it('does not read a verdict out of a longer word', () => {
		expect(parseIntent('nothing')).toBe('other');
		expect(parseIntent('yesterday')).toBe('other');
	});

	it('treats anything unusable as other', () => {
		expect(parseIntent('')).toBe('other');
		expect(parseIntent(undefined)).toBe('other');
		expect(parseIntent(42)).toBe('other');
	});
});

describe('the fixed replies', () => {
	it('exist in both languages and carry no link-shaped text', () => {
		for (const intent of ['yes', 'no'] as const) {
			for (const lang of ['es', 'en'] as const) {
				const text = CONSENT_REPLY[intent][lang];
				expect(text.length).toBeGreaterThan(0);
				expect(text).not.toMatch(/https?:|www\.|@/);
			}
		}
	});
});
