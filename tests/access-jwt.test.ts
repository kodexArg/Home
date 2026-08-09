import { afterEach, describe, expect, it, mock } from 'bun:test';
import {
	accessAssertionFromRequest,
	accessConfigured,
	parseCookie,
	verifyAccessJwt
} from '../src/lib/access';

function b64url(bytes: ArrayBuffer | Uint8Array): string {
	const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
	let bin = '';
	for (const b of u8) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function b64urlJson(value: unknown): string {
	return b64url(new TextEncoder().encode(JSON.stringify(value)));
}

async function generateRs256Pair(): Promise<{
	privateKey: CryptoKey;
	jwk: { kid: string; kty: string; n: string; e: string; alg: string };
}> {
	const { privateKey, publicKey } = await crypto.subtle.generateKey(
		{
			name: 'RSASSA-PKCS1-v1_5',
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: 'SHA-256'
		},
		true,
		['sign', 'verify']
	);
	const exported = (await crypto.subtle.exportKey('jwk', publicKey)) as JsonWebKey;
	return {
		privateKey,
		jwk: {
			kid: 'test-kid',
			kty: exported.kty!,
			n: exported.n!,
			e: exported.e!,
			alg: 'RS256'
		}
	};
}

async function signJwt(
	privateKey: CryptoKey,
	header: Record<string, unknown>,
	payload: Record<string, unknown>
): Promise<string> {
	const h = b64urlJson(header);
	const p = b64urlJson(payload);
	const data = new TextEncoder().encode(`${h}.${p}`);
	const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, data);
	return `${h}.${p}.${b64url(sig)}`;
}

const AUD = 'home-aud';
let fetchMock: ReturnType<typeof mock> | null = null;

afterEach(() => {
	if (fetchMock) {
		fetchMock.mockRestore();
		fetchMock = null;
	}
});

function mockCerts(teamDomain: string, keys: unknown[], status = 200): void {
	fetchMock = mock(async (input: RequestInfo | URL) => {
		const url = String(input);
		expect(url).toBe(`https://${teamDomain}/cdn-cgi/access/certs`);
		return new Response(JSON.stringify({ keys }), { status });
	});
	globalThis.fetch = fetchMock as unknown as typeof fetch;
}

describe('accessConfigured', () => {
	it('is dormant until both Access secrets exist', () => {
		expect(accessConfigured({})).toBe(false);
		expect(accessConfigured({ CF_ACCESS_TEAM_DOMAIN: 'kodexarg.cloudflareaccess.com' })).toBe(
			false
		);
		expect(accessConfigured({ CF_ACCESS_AUD: 'aud-only' })).toBe(false);
		expect(
			accessConfigured({
				CF_ACCESS_TEAM_DOMAIN: 'kodexarg.cloudflareaccess.com',
				CF_ACCESS_AUD: 'aud-value'
			})
		).toBe(true);
	});
});

describe('accessAssertionFromRequest', () => {
	it('reads the Access header first', () => {
		const request = new Request('https://home.kodexarg.com/api/auth/whoami', {
			headers: {
				'Cf-Access-Jwt-Assertion': 'header-jwt',
				Cookie: 'CF_Authorization=cookie-jwt'
			}
		});
		expect(accessAssertionFromRequest(request)).toBe('header-jwt');
	});

	it('falls back to CF_Authorization so apex whoami sees a /me session', () => {
		const request = new Request('https://home.kodexarg.com/api/auth/whoami', {
			headers: { Cookie: 'other=1; CF_Authorization=cookie%2Djwt; trail=x' }
		});
		expect(accessAssertionFromRequest(request)).toBe('cookie-jwt');
		expect(parseCookie(null, 'CF_Authorization')).toBeNull();
		expect(parseCookie('a=b', 'CF_Authorization')).toBeNull();
	});
});

describe('verifyAccessJwt', () => {
	it('returns null for a malformed assertion', async () => {
		expect(await verifyAccessJwt('not-a-jwt', 'team.example', AUD)).toBeNull();
		expect(await verifyAccessJwt('a.b', 'team.example', AUD)).toBeNull();
	});

	it('rejects non-RS256 headers without fetching certs', async () => {
		const assertion = [
			b64urlJson({ kid: 'x', alg: 'HS256' }),
			b64urlJson({ email: 'a@b.co', aud: AUD, exp: Math.floor(Date.now() / 1000) + 60 }),
			'c2ln'
		].join('.');
		expect(await verifyAccessJwt(assertion, 'no-fetch.example', AUD)).toBeNull();
	});

	it('rejects wrong audience, expired tokens, and missing email', async () => {
		const { privateKey } = await generateRs256Pair();
		const header = { kid: 'test-kid', alg: 'RS256' };
		const base = Math.floor(Date.now() / 1000);

		const wrongAud = await signJwt(privateKey, header, {
			email: 'g@example.com',
			aud: 'other',
			exp: base + 60
		});
		expect(await verifyAccessJwt(wrongAud, 'aud.example', AUD)).toBeNull();

		const expired = await signJwt(privateKey, header, {
			email: 'g@example.com',
			aud: AUD,
			exp: base - 10
		});
		expect(await verifyAccessJwt(expired, 'exp.example', AUD)).toBeNull();

		const noEmail = await signJwt(privateKey, header, {
			aud: [AUD],
			exp: base + 60
		});
		expect(await verifyAccessJwt(noEmail, 'email.example', AUD)).toBeNull();
	});

	it('returns null when JWKS has no matching kid after a forced refetch', async () => {
		const { privateKey } = await generateRs256Pair();
		const team = 'kid-miss.example';
		let calls = 0;
		fetchMock = mock(async () => {
			calls += 1;
			return new Response(
				JSON.stringify({
					keys: [{ kid: 'other', kty: 'RSA', n: 'x', e: 'AQAB', alg: 'RS256' }]
				}),
				{ status: 200 }
			);
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		const jwt = await signJwt(
			privateKey,
			{ kid: 'test-kid', alg: 'RS256' },
			{
				email: 'g@example.com',
				aud: AUD,
				exp: Math.floor(Date.now() / 1000) + 120
			}
		);
		expect(await verifyAccessJwt(jwt, team, AUD)).toBeNull();
		expect(calls).toBe(2);
	});

	it('refetches JWKS once when a rotated kid misses the cache', async () => {
		const { privateKey, jwk } = await generateRs256Pair();
		const team = 'rotate.example';
		let calls = 0;
		fetchMock = mock(async () => {
			calls += 1;
			const keys = calls === 1 ? [{ ...jwk, kid: 'stale-kid' }] : [jwk];
			return new Response(JSON.stringify({ keys }), { status: 200 });
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		const jwt = await signJwt(
			privateKey,
			{ kid: 'test-kid', alg: 'RS256' },
			{
				email: 'rot@example.com',
				aud: AUD,
				exp: Math.floor(Date.now() / 1000) + 120
			}
		);
		expect(await verifyAccessJwt(jwt, team, AUD)).toEqual({
			email: 'rot@example.com',
			name: 'rot',
			picture: null
		});
		expect(calls).toBe(2);
	});

	it('returns null when certs fetch fails', async () => {
		const { privateKey } = await generateRs256Pair();
		const team = 'certs-fail.example';
		mockCerts(team, [], 503);
		const jwt = await signJwt(
			privateKey,
			{ kid: 'test-kid', alg: 'RS256' },
			{
				email: 'g@example.com',
				aud: AUD,
				exp: Math.floor(Date.now() / 1000) + 120
			}
		);
		expect(await verifyAccessJwt(jwt, team, AUD)).toBeNull();
	});

	it('returns null when the signature does not verify', async () => {
		const a = await generateRs256Pair();
		const b = await generateRs256Pair();
		const team = 'bad-sig.example';
		mockCerts(team, [b.jwk]);
		const jwt = await signJwt(
			a.privateKey,
			{ kid: 'test-kid', alg: 'RS256' },
			{
				email: 'g@example.com',
				aud: AUD,
				exp: Math.floor(Date.now() / 1000) + 120
			}
		);
		expect(await verifyAccessJwt(jwt, team, AUD)).toBeNull();
	});

	it('verifies a valid assertion and normalises identity fields', async () => {
		const { privateKey, jwk } = await generateRs256Pair();
		const team = 'ok.example';
		mockCerts(team, [jwk]);
		const jwt = await signJwt(
			privateKey,
			{ kid: 'test-kid', alg: 'RS256' },
			{
				email: '  Gabriel@Example.COM ',
				name: '  Gabriel Cavedal  ',
				picture: 'https://lh3.googleusercontent.com/a/photo',
				aud: [AUD],
				exp: Math.floor(Date.now() / 1000) + 300
			}
		);
		expect(await verifyAccessJwt(jwt, team, AUD)).toEqual({
			email: 'gabriel@example.com',
			name: 'Gabriel Cavedal',
			picture: 'https://lh3.googleusercontent.com/a/photo'
		});
	});

	it('falls back to given_name, then email local-part, and drops non-https pictures', async () => {
		const { privateKey, jwk } = await generateRs256Pair();
		const team = 'name.example';
		mockCerts(team, [jwk]);
		const exp = Math.floor(Date.now() / 1000) + 300;

		const withGiven = await signJwt(
			privateKey,
			{ kid: 'test-kid', alg: 'RS256' },
			{
				email: 'ana@example.com',
				given_name: 'Ana',
				picture: 'http://insecure.example/p.png',
				aud: AUD,
				exp
			}
		);
		expect(await verifyAccessJwt(withGiven, team, AUD)).toEqual({
			email: 'ana@example.com',
			name: 'Ana',
			picture: null
		});

		const localOnly = await signJwt(
			privateKey,
			{ kid: 'test-kid', alg: 'RS256' },
			{ email: 'solo@example.com', aud: AUD, exp }
		);
		expect(await verifyAccessJwt(localOnly, team, AUD)).toEqual({
			email: 'solo@example.com',
			name: 'solo',
			picture: null
		});
	});

	it('reuses cached JWKS for the same team domain', async () => {
		const { privateKey, jwk } = await generateRs256Pair();
		const team = 'cache.example';
		let calls = 0;
		fetchMock = mock(async () => {
			calls += 1;
			return new Response(JSON.stringify({ keys: [jwk] }), { status: 200 });
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		const mk = () =>
			signJwt(
				privateKey,
				{ kid: 'test-kid', alg: 'RS256' },
				{
					email: 'c@example.com',
					aud: AUD,
					exp: Math.floor(Date.now() / 1000) + 120
				}
			);

		expect(await verifyAccessJwt(await mk(), team, AUD)).not.toBeNull();
		expect(await verifyAccessJwt(await mk(), team, AUD)).not.toBeNull();
		expect(calls).toBe(1);
	});
});
