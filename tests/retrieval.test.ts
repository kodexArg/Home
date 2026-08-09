import { describe, expect, it } from 'bun:test';
import { getChunk, minScoreFor } from '../src/kodexbar/packs';
import { DEFAULT_TOP_K, EMBEDDING_MODEL, embed, retrieve } from '../src/kodexbar/retrieval';

const CV_ES = 'cv:perfil:es';
const CV_EN = 'cv:perfil:en';
const IDENTITY_ES = 'identity:nombre-legal:es';

function vectorOf(n = 3): number[] {
	return Array.from({ length: n }, (_, i) => i + 0.1);
}

function envWith(opts: {
	ai?: Env['AI'] | null;
	index?: Env['VECTOR_INDEX'] | null;
}): Env {
	const env: Env = {};
	if (opts.ai !== null && opts.ai !== undefined) env.AI = opts.ai;
	if (opts.index !== null && opts.index !== undefined) env.VECTOR_INDEX = opts.index;
	return env;
}

function aiReturning(data: number[][] | null | undefined, throwOnRun = false): Env['AI'] {
	return {
		async run(model: string, inputs: Record<string, unknown>) {
			expect(model).toBe(EMBEDDING_MODEL);
			expect(inputs).toEqual({ text: [expect.any(String)] });
			if (throwOnRun) throw new Error('embedding boom');
			return { data: data as number[][] } as any;
		}
	};
}

function indexReturning(
	matches: VectorizeMatch[],
	onQuery?: (vector: number[], options: VectorizeQueryOptions | undefined) => void,
	throwOnQuery = false
): Env['VECTOR_INDEX'] {
	return {
		async query(vector, options) {
			onQuery?.(vector, options);
			if (throwOnQuery) throw new Error('vectorize boom');
			return { matches };
		},
		async insert() {
			return {};
		},
		async upsert() {
			return {};
		}
	};
}

describe('embed', () => {
	it('returns null when the AI binding is missing', async () => {
		expect(await embed({} as Env, 'hola')).toBeNull();
	});

	it('returns the first embedding vector', async () => {
		const vector = vectorOf(4);
		const out = await embed(envWith({ ai: aiReturning([vector]) }), 'hola');
		expect(out).toEqual(vector);
	});

	it('returns null when the model yields an empty or missing vector', async () => {
		expect(await embed(envWith({ ai: aiReturning([[]]) }), 'hola')).toBeNull();
		expect(await embed(envWith({ ai: aiReturning([undefined as any]) }), 'hola')).toBeNull();
		expect(await embed(envWith({ ai: aiReturning(null) }), 'hola')).toBeNull();
	});

	it('returns null when the embedding model throws', async () => {
		expect(await embed(envWith({ ai: aiReturning([vectorOf()], true) }), 'hola')).toBeNull();
	});
});

describe('retrieve', () => {
	it('fails closed when AI or VECTOR_INDEX is missing', async () => {
		expect(await retrieve(envWith({ ai: null, index: null }), 'q', 'es')).toEqual({
			chunks: [],
			hits: [],
			passed: false
		});
		expect(
			await retrieve(envWith({ ai: aiReturning([vectorOf()]), index: null }), 'q', 'es')
		).toEqual({ chunks: [], hits: [], passed: false });
	});

	it('fails closed when embedding returns null', async () => {
		const result = await retrieve(
			envWith({
				ai: aiReturning(null),
				index: indexReturning([{ id: CV_ES, score: 0.99 }])
			}),
			'q',
			'es'
		);
		expect(result.passed).toBe(false);
		expect(result.chunks).toEqual([]);
	});

	it('fails closed when Vectorize throws', async () => {
		const result = await retrieve(
			envWith({
				ai: aiReturning([vectorOf()]),
				index: indexReturning([], undefined, true)
			}),
			'q',
			'es'
		);
		expect(result.passed).toBe(false);
	});

	it('fails closed when Vectorize returns no matches', async () => {
		const result = await retrieve(
			envWith({
				ai: aiReturning([vectorOf()]),
				index: indexReturning([])
			}),
			'q',
			'es'
		);
		expect(result.passed).toBe(false);
		expect(result.topScore).toBeUndefined();
	});

	it('passes the language filter and default topK to Vectorize', async () => {
		let seen: { vector: number[]; options?: VectorizeQueryOptions } | undefined;
		const vector = vectorOf();
		await retrieve(
			envWith({
				ai: aiReturning([vector]),
				index: indexReturning([], (v, options) => {
					seen = { vector: v, options };
				})
			}),
			'perfil',
			'en',
			7
		);
		expect(seen?.vector).toEqual(vector);
		expect(seen?.options).toEqual({
			topK: 7,
			returnMetadata: true,
			filter: { lang: 'en' }
		});
	});

	it('defaults topK when the caller omits it', async () => {
		let topK: number | undefined;
		await retrieve(
			envWith({
				ai: aiReturning([vectorOf()]),
				index: indexReturning([], (_v, options) => {
					topK = options?.topK;
				})
			}),
			'q',
			'es'
		);
		expect(topK).toBe(DEFAULT_TOP_K);
	});

	it('skips stale index ids and scores below the pack gate, keeping topScore', async () => {
		const belowGate = minScoreFor('cv') - 0.01;
		const result = await retrieve(
			envWith({
				ai: aiReturning([vectorOf()]),
				index: indexReturning([
					{ id: 'cv:does-not-exist:es', score: 0.99 },
					{ id: CV_ES, score: belowGate }
				])
			}),
			'q',
			'es'
		);
		expect(result.passed).toBe(false);
		expect(result.hits).toEqual([]);
		expect(result.topScore).toBe(0.99);
	});

	it('keeps hits above the gate, sorts by score, expands related, and marks passed', async () => {
		const chunk = getChunk(CV_ES)!;
		const score = Math.max(minScoreFor('cv') + 0.1, 0.7);
		const lower = score - 0.05;
		const result = await retrieve(
			envWith({
				ai: aiReturning([vectorOf()]),
				index: indexReturning([
					{ id: CV_ES, score: lower },
					{ id: CV_ES, score }
				])
			}),
			'quién es',
			'es'
		);

		expect(result.passed).toBe(true);
		expect(result.topScore).toBe(score);
		expect(result.hits[0]?.chunk.id).toBe(CV_ES);
		expect(result.hits[0]?.score).toBe(score);
		expect(result.chunks[0]?.id).toBe(chunk.id);
		expect(result.chunks.length).toBeGreaterThanOrEqual(1);
		for (const related of chunk.related) {
			const relatedId = `cv:${related}:es`;
			if (getChunk(relatedId)) {
				expect(result.chunks.some((c) => c.id === relatedId)).toBe(true);
			}
		}
	});

	it('applies the stricter identity pack gate', async () => {
		const under = minScoreFor('identity') - 0.01;
		const over = minScoreFor('identity') + 0.01;
		const closed = await retrieve(
			envWith({
				ai: aiReturning([vectorOf()]),
				index: indexReturning([{ id: IDENTITY_ES, score: under }])
			}),
			'nombre',
			'es'
		);
		expect(closed.passed).toBe(false);

		const open = await retrieve(
			envWith({
				ai: aiReturning([vectorOf()]),
				index: indexReturning([{ id: IDENTITY_ES, score: over }])
			}),
			'nombre',
			'es'
		);
		expect(open.passed).toBe(true);
		expect(open.hits[0]?.chunk.id).toBe(IDENTITY_ES);
	});

	it('does not mix languages when expanding related', async () => {
		const score = minScoreFor('cv') + 0.2;
		const result = await retrieve(
			envWith({
				ai: aiReturning([vectorOf()]),
				index: indexReturning([{ id: CV_EN, score }])
			}),
			'profile',
			'en'
		);
		expect(result.passed).toBe(true);
		expect(result.chunks.every((c) => c.lang === 'en')).toBe(true);
		expect(result.chunks.some((c) => c.id === CV_ES)).toBe(false);
	});
});
