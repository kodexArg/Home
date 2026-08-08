import { describe, expect, it } from 'bun:test';
import { GENERATION_MODEL } from '../src/kodexbar/answer';
import { CONSENT_REPLY } from '../src/kodexbar/consent';
import { offerKeyFor } from '../src/kodexbar/offers';
import { EMBEDDING_MODEL } from '../src/kodexbar/retrieval';
import { FAILURE, OUT_OF_SCOPE } from '../src/kodexbar/systemPrompt';
import { MAX_REQUESTS_PER_WINDOW, WINDOW_SECONDS } from '../src/kodexbar/rateLimit';
import { handleAsk } from '../src/kodexbar/askHandler';

const CV_HIT = 'cv:perfil:es';
const VECTOR = [0.1, 0.2, 0.3];

function fakeKv(seed: Record<string, string> = {}) {
	const store = new Map(Object.entries(seed));
	return {
		store,
		binding: {
			async get(key: string) {
				return store.get(key) ?? null;
			},
			async put(key: string, value: string) {
				store.set(key, value);
			},
			async delete(key: string) {
				store.delete(key);
			}
		}
	};
}

function pipelineEnv(opts: {
	kv?: ReturnType<typeof fakeKv>;
	generation?: string;
	hitScore?: number;
	throwOnGenerate?: boolean;
} = {}): Env {
	const hitScore = opts.hitScore ?? 0.8;
	const generation =
		opts.generation ?? '{"text":"Gabriel es el fundador de kodexArg.","linkIds":["cv"]}';

	return {
		SESSION: opts.kv?.binding,
		AI: {
			async run(model: string) {
				if (model === EMBEDDING_MODEL) {
					return { data: [VECTOR] } as any;
				}
				if (opts.throwOnGenerate) throw new Error('gen boom');
				expect(model).toBe(GENERATION_MODEL);
				return { response: generation } as any;
			}
		},
		VECTOR_INDEX: {
			async query() {
				return { matches: [{ id: CV_HIT, score: hitScore }] };
			},
			async insert() {
				return {};
			},
			async upsert() {
				return {};
			}
		}
	} as Env;
}

function post(body: unknown, headers: Record<string, string> = {}): Request {
	return new Request('https://home.kodexarg.com/api/ask', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...headers },
		body: typeof body === 'string' ? body : JSON.stringify(body)
	});
}

async function read(response: Response) {
	return {
		status: response.status,
		headers: response.headers,
		body: (await response.json()) as Record<string, unknown>
	};
}

describe('handleAsk validation', () => {
	it('rejects invalid JSON with the fixed failure line', async () => {
		const { status, body } = await read(await handleAsk(post('{'), pipelineEnv()));
		expect(status).toBe(400);
		expect(body.text).toBe(FAILURE.es);
		expect(body.matched).toBe(false);
	});

	it('rejects an empty query as out of scope', async () => {
		const { status, body } = await read(
			await handleAsk(post({ query: '   ', language: 'en' }), pipelineEnv())
		);
		expect(status).toBe(400);
		expect(body.text).toBe(OUT_OF_SCOPE.en);
		expect(body.language).toBe('en');
	});

	it('rejects an over-long query with 413', async () => {
		const { status, body } = await read(
			await handleAsk(post({ query: 'x'.repeat(501), language: 'es' }), pipelineEnv())
		);
		expect(status).toBe(413);
		expect(body.text).toBe(OUT_OF_SCOPE.es);
	});
});

describe('handleAsk rate limiting', () => {
	it('returns 429 with Retry-After when the window is full', async () => {
		const windowId = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
		const kv = fakeKv({
			[`rl:203.0.113.9:${windowId}`]: String(MAX_REQUESTS_PER_WINDOW)
		});
		const { status, body, headers } = await read(
			await handleAsk(
				post({ query: 'quién es', language: 'es' }, { 'CF-Connecting-IP': '203.0.113.9' }),
				pipelineEnv({ kv })
			)
		);
		expect(status).toBe(429);
		expect(String(body.text)).toInclude('rápido');
		expect(headers.get('Retry-After')).toBeTruthy();
	});

	it('rate-limits in English when requested', async () => {
		const windowId = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
		const kv = fakeKv({
			[`rl:203.0.113.8:${windowId}`]: String(MAX_REQUESTS_PER_WINDOW)
		});
		const { body } = await read(
			await handleAsk(
				post({ query: 'who', language: 'en' }, { 'CF-Connecting-IP': '203.0.113.8' }),
				pipelineEnv({ kv })
			)
		);
		expect(String(body.text)).toInclude('fast');
	});
});

describe('handleAsk happy path and offers', () => {
	it('parks links behind consent and returns offer:true with empty links', async () => {
		const kv = fakeKv();
		const { status, body } = await read(
			await handleAsk(
				post(
					{ query: 'quién es gabriel', language: 'es', conversation: 'tab-1' },
					{ 'CF-Connecting-IP': '198.51.100.1' }
				),
				pipelineEnv({ kv })
			)
		);

		expect(status).toBe(200);
		expect(body.matched).toBe(true);
		expect(body.offer).toBe(true);
		expect(body.links).toEqual([]);
		expect(String(body.text)).toInclude('kodexArg');

		const key = offerKeyFor('198.51.100.1', 'tab-1');
		expect(kv.store.has(key)).toBe(true);
		const parked = JSON.parse(kv.store.get(key)!);
		expect(parked.ids).toContain('cv');
		expect(parked.language).toBe('es');
	});

	it('hands links over immediately when SESSION cannot store the offer', async () => {
		const { body } = await read(
			await handleAsk(
				post({ query: 'quién es', language: 'es' }),
				pipelineEnv({ kv: undefined })
			)
		);
		expect(body.offer).toBeFalsy();
		expect((body.links as { id: string }[]).map((l) => l.id)).toContain('cv');
	});

	it('returns out of scope when retrieval misses', async () => {
		const env = pipelineEnv({ hitScore: 0.01 });
		const { body } = await read(await handleAsk(post({ query: 'capital de francia' }), env));
		expect(body.matched).toBe(false);
		expect(body.text).toBe(OUT_OF_SCOPE.es);
	});
});

describe('handleAsk pending consent', () => {
	function parkedEnv(proposedRequest: string) {
		const kv = fakeKv({
			[offerKeyFor('10.0.0.1', 'c1')]: JSON.stringify({
				ids: ['cv'],
				proposedRequest,
				suggestion: '¿Querés ver sus proyectos?',
				language: 'es'
			})
		});
		return { kv, env: pipelineEnv({ kv }) };
	}

	it('reveals links on a lexical yes that matches the proposed request', async () => {
		const proposed = 'sí, mandame los links';
		const { env } = parkedEnv(proposed);
		const { body } = await read(
			await handleAsk(
				post(
					{ query: proposed, language: 'es', conversation: 'c1' },
					{ 'CF-Connecting-IP': '10.0.0.1' }
				),
				env
			)
		);
		expect(body.text).toBe(CONSENT_REPLY.yes.es);
		expect((body.links as { id: string }[]).map((l) => l.id)).toEqual(['cv']);
		expect(body.suggestion).toBe('¿Querés ver sus proyectos?');
	});

	it('withholds links on a lexical no', async () => {
		const proposed = 'sí, mandame los links';
		const { env } = parkedEnv(proposed);
		const { body } = await read(
			await handleAsk(
				post(
					{ query: 'no', language: 'es', conversation: 'c1' },
					{ 'CF-Connecting-IP': '10.0.0.1' }
				),
				env
			)
		);
		expect(body.text).toBe(CONSENT_REPLY.no.es);
		expect(body.links).toEqual([]);
	});

	it('falls through to a normal answer when consent is other', async () => {
		const proposed = 'sí, mandame los links';
		const { env } = parkedEnv(proposed);
		const { body } = await read(
			await handleAsk(
				post(
					{ query: 'cuéntame sobre su experiencia en casinos', language: 'es', conversation: 'c1' },
					{ 'CF-Connecting-IP': '10.0.0.1' }
				),
				env
			)
		);
		expect(body.text).not.toBe(CONSENT_REPLY.yes.es);
		expect(body.text).not.toBe(CONSENT_REPLY.no.es);
		expect(body.offer).toBe(true);
	});
});

describe('handleAsk failure surface', () => {
	it('returns 500 with the fixed failure line when response serialisation throws', async () => {
		const request = post({ query: 'quién es' });
		const original = JSON.stringify;
		let shouldThrow = true;
		JSON.stringify = ((value: unknown, ...rest: unknown[]) => {
			if (shouldThrow) {
				shouldThrow = false;
				throw new Error('stringify boom');
			}
			return original(value as any, ...(rest as [any, any]));
		}) as typeof JSON.stringify;

		try {
			const response = await handleAsk(request, pipelineEnv());
			expect(response.status).toBe(500);
			const body = (await response.json()) as { text: string; matched: boolean };
			expect(body.text).toBe(FAILURE.es);
			expect(body.matched).toBe(false);
		} finally {
			JSON.stringify = original;
		}
	});
});
