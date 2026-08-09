/**
 * Cloudflare Access (Zero Trust) + Google IdP — Eurotrip pattern, Home scope.
 *
 * Active only when both CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD are set.
 * Until then whoami stays anonymous and the public apex is unchanged (ADR 13).
 */

export interface AccessIdentity {
	email: string;
	name: string | null;
	picture: string | null;
}

export function accessConfigured(env: {
	CF_ACCESS_TEAM_DOMAIN?: string;
	CF_ACCESS_AUD?: string;
}): boolean {
	return Boolean(env.CF_ACCESS_TEAM_DOMAIN && env.CF_ACCESS_AUD);
}

interface Jwk {
	kid: string;
	kty: string;
	n: string;
	e: string;
	alg?: string;
}

const certsCache = new Map<string, { keys: Jwk[]; fetchedAt: number }>();
const CERTS_TTL_MS = 60 * 60 * 1000;

async function getKeys(teamDomain: string): Promise<Jwk[]> {
	const cached = certsCache.get(teamDomain);
	if (cached && Date.now() - cached.fetchedAt < CERTS_TTL_MS) return cached.keys;
	const url = `https://${teamDomain}/cdn-cgi/access/certs`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`certs fetch failed: ${res.status}`);
	const json = (await res.json()) as { keys: Jwk[] };
	certsCache.set(teamDomain, { keys: json.keys, fetchedAt: Date.now() });
	return json.keys;
}

function b64urlToUint8(s: string): Uint8Array {
	const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
	const b64 = (s + '='.repeat(pad)).replace(/-/g, '+').replace(/_/g, '/');
	const bin = atob(b64);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

function displayNameFrom(payload: {
	email: string;
	name?: string;
	given_name?: string;
}): string | null {
	const raw = payload.name?.trim() || payload.given_name?.trim();
	if (raw) return raw;
	const local = payload.email.split('@')[0]?.trim();
	return local || null;
}

/**
 * Verify a Cloudflare Access JWT assertion and return the identity, or null.
 * Checks RS256 signature against the team JWKS, aud, and exp.
 */
export async function verifyAccessJwt(
	assertion: string,
	teamDomain: string,
	expectedAud: string
): Promise<AccessIdentity | null> {
	try {
		const [h, p, s] = assertion.split('.');
		if (!h || !p || !s) return null;
		const header = JSON.parse(new TextDecoder().decode(b64urlToUint8(h))) as {
			kid: string;
			alg: string;
		};
		const payload = JSON.parse(new TextDecoder().decode(b64urlToUint8(p))) as {
			email?: string;
			name?: string;
			given_name?: string;
			picture?: string;
			aud?: string | string[];
			exp?: number;
		};

		if (header.alg !== 'RS256') return null;
		const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
		if (!auds.includes(expectedAud)) return null;
		if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
		if (!payload.email) return null;

		const jwk = (await getKeys(teamDomain)).find((k) => k.kid === header.kid);
		if (!jwk) return null;

		const key = await crypto.subtle.importKey(
			'jwk',
			{ kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
			{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
			false,
			['verify']
		);
		const data = new TextEncoder().encode(`${h}.${p}`);
		const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToUint8(s), data);
		if (!ok) return null;

		const email = payload.email.trim().toLowerCase();
		const picture =
			typeof payload.picture === 'string' && payload.picture.startsWith('https://')
				? payload.picture
				: null;
		return {
			email,
			name: displayNameFrom({ ...payload, email }),
			picture
		};
	} catch {
		return null;
	}
}
