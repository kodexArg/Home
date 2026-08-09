import { describe, expect, it } from 'bun:test';
import {
	MAX_REQUESTS_PER_WINDOW,
	WINDOW_SECONDS,
	checkRateLimit,
	clientIdFrom
} from '../src/kodexbar/rateLimit';

function fakeKv(seed: Record<string, string> = {}) {
	const store = new Map(Object.entries(seed));
	const puts: Array<{ key: string; value: string; ttl?: number }> = [];

	return {
		store,
		puts,
		binding: {
			async get(key: string) {
				return store.get(key) ?? null;
			},
			async put(key: string, value: string, options?: { expirationTtl?: number }) {
				store.set(key, value);
				puts.push({ key, value, ttl: options?.expirationTtl });
			},
			async delete(key: string) {
				store.delete(key);
			}
		}
	};
}

const envWith = (kv?: ReturnType<typeof fakeKv>) =>
	(kv ? { SESSION: kv.binding } : {}) as unknown as Env;

describe('clientIdFrom', () => {
	it('prefers CF-Connecting-IP', () => {
		const request = new Request('https://example.com', {
			headers: {
				'CF-Connecting-IP': '203.0.113.1',
				'X-Forwarded-For': '198.51.100.1, 203.0.113.9'
			}
		});
		expect(clientIdFrom(request)).toBe('203.0.113.1');
	});

	it('falls back to the first X-Forwarded-For hop', () => {
		const request = new Request('https://example.com', {
			headers: { 'X-Forwarded-For': ' 198.51.100.2 , 203.0.113.9' }
		});
		expect(clientIdFrom(request)).toBe('198.51.100.2');
	});

	it('uses local when no forwarding headers are present', () => {
		expect(clientIdFrom(new Request('https://example.com'))).toBe('local');
	});
});

describe('checkRateLimit', () => {
	it('allows when SESSION is missing or the client id is empty', async () => {
		expect(await checkRateLimit({} as Env, '1.2.3.4')).toEqual({
			allowed: true,
			retryAfter: 0
		});
		expect(await checkRateLimit(envWith(fakeKv()), '')).toEqual({
			allowed: true,
			retryAfter: 0
		});
	});

	it('increments the window counter and sets a TTL', async () => {
		const kv = fakeKv();
		const result = await checkRateLimit(envWith(kv), '9.9.9.9');
		expect(result).toEqual({ allowed: true, retryAfter: 0 });
		expect(kv.puts).toHaveLength(1);
		expect(kv.puts[0].key).toMatch(/^rl:9\.9\.9\.9:\d+$/);
		expect(kv.puts[0].value).toBe('1');
		expect(kv.puts[0].ttl).toBe(WINDOW_SECONDS * 2);
	});

	it('blocks once the window is full and reports retryAfter within the window', async () => {
		const windowId = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
		const kv = fakeKv({ [`rl:1.1.1.1:${windowId}`]: String(MAX_REQUESTS_PER_WINDOW) });
		const result = await checkRateLimit(envWith(kv), '1.1.1.1');
		expect(result.allowed).toBe(false);
		expect(result.retryAfter).toBeGreaterThan(0);
		expect(result.retryAfter).toBeLessThanOrEqual(WINDOW_SECONDS);
		expect(kv.puts).toHaveLength(0);
	});

	it('allows and fails open when KV throws', async () => {
		const env = {
			SESSION: {
				async get() {
					throw new Error('kv down');
				},
				async put() {
					throw new Error('kv down');
				}
			}
		} as unknown as Env;

		expect(await checkRateLimit(env, '2.2.2.2')).toEqual({
			allowed: true,
			retryAfter: 0
		});
	});
});
