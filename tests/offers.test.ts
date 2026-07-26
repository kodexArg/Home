import { describe, expect, it } from 'bun:test';
import { OFFER_TTL_SECONDS, offerKeyFor, putOffer, takeOffer } from '../src/lib/kodexbar/offers';

function fakeKv(seed: Record<string, string> = {}) {
	const store = new Map(Object.entries(seed));
	const puts: Array<{ key: string; ttl?: number }> = [];

	return {
		store,
		puts,
		binding: {
			async get(key: string) {
				return store.get(key) ?? null;
			},
			async put(key: string, value: string, options?: { expirationTtl?: number }) {
				store.set(key, value);
				puts.push({ key, ttl: options?.expirationTtl });
			},
			async delete(key: string) {
				store.delete(key);
			}
		}
	};
}

const envWith = (kv: ReturnType<typeof fakeKv>) => ({ SESSION: kv.binding }) as unknown as Env;

describe('offerKeyFor', () => {
	it('scopes an offer to both the caller and the tab', () => {
		expect(offerKeyFor('1.2.3.4', 'abc-123')).toBe('offer:1.2.3.4:abc-123');
	});

	it('strips anything that is not key-safe and caps the length', () => {
		expect(offerKeyFor('ip', 'AB/../*x')).toBe('offer:ip:abx');
		expect(offerKeyFor('ip', 'a'.repeat(200))).toBe(`offer:ip:${'a'.repeat(64)}`);
	});

	it('falls back to a fixed scope when the client sends none', () => {
		expect(offerKeyFor('ip', undefined)).toBe('offer:ip:default');
		expect(offerKeyFor('ip', 42)).toBe('offer:ip:default');
		expect(offerKeyFor('ip', '///')).toBe('offer:ip:default');
	});
});

describe('putOffer', () => {
	it('stores the ids under a TTL and reports success', async () => {
		const kv = fakeKv();

		const stored = await putOffer(envWith(kv), 'offer:k', { ids: ['cv'], language: 'es' });

		expect(stored).toBe(true);
		expect(kv.puts[0].ttl).toBe(OFFER_TTL_SECONDS);
	});

	it('reports failure with no binding, so the caller hands the links over immediately', async () => {
		expect(await putOffer({} as Env, 'offer:k', { ids: ['cv'], language: 'es' })).toBe(false);
	});

	it('reports failure when KV throws', async () => {
		const env = {
			SESSION: {
				async put() {
					throw new Error('kv down');
				}
			}
		} as unknown as Env;

		expect(await putOffer(env, 'offer:k', { ids: ['cv'], language: 'es' })).toBe(false);
	});

	it('refuses to store an empty offer', async () => {
		const kv = fakeKv();
		expect(await putOffer(envWith(kv), 'offer:k', { ids: [], language: 'es' })).toBe(false);
		expect(kv.store.size).toBe(0);
	});
});

describe('takeOffer', () => {
	it('returns the parked offer and consumes it so a later yes cannot reveal it again', async () => {
		const kv = fakeKv();
		const env = envWith(kv);
		await putOffer(env, 'offer:k', { ids: ['cv', 'github'], suggestion: '¿Y?', language: 'en' });

		const first = await takeOffer(env, 'offer:k');
		expect(first).toEqual({ ids: ['cv', 'github'], suggestion: '¿Y?', language: 'en' });

		expect(await takeOffer(env, 'offer:k')).toBeNull();
	});

	it('returns null when nothing is parked', async () => {
		expect(await takeOffer(envWith(fakeKv()), 'offer:k')).toBeNull();
	});

	it('returns null with no binding', async () => {
		expect(await takeOffer({} as Env, 'offer:k')).toBeNull();
	});

	it('drops junk rather than trusting it', async () => {
		const env = envWith(fakeKv({ 'offer:a': 'not json', 'offer:b': '{"ids":[1,2]}' }));

		expect(await takeOffer(env, 'offer:a')).toBeNull();
		expect(await takeOffer(env, 'offer:b')).toBeNull();
	});

	it('keeps only string ids and defaults the language', async () => {
		const env = envWith(fakeKv({ 'offer:k': '{"ids":["cv",7]}' }));

		expect(await takeOffer(env, 'offer:k')).toEqual({
			ids: ['cv'],
			suggestion: undefined,
			language: 'es'
		});
	});
});
