/** ADR 13 — dual entry: me.kodexarg.com + kodexarg.com/me */

export const CANONICAL_ME_ORIGIN = 'https://kodexarg.com';
export const CANONICAL_ME_PATH = '/me';
export const CANONICAL_ME_URL = `${CANONICAL_ME_ORIGIN}${CANONICAL_ME_PATH}`;
export const ME_HOST = 'me.kodexarg.com';

const APEX_ALIASES = new Set(['www.kodexarg.com', 'home.kodexarg.com']);

export function truncateDisplayName(name: string, maxChars = 6): string {
	const trimmed = name.trim();
	if (trimmed.length <= maxChars) return trimmed;
	return `${trimmed.slice(0, maxChars)}…`;
}

/**
 * If this request should bounce to the canonical /me URL, return that absolute URL.
 * Otherwise return null (caller continues).
 */
export function redirectToCanonicalMe(url: URL): string | null {
	const host = url.hostname.toLowerCase();
	const path = url.pathname;

	if (host === ME_HOST) {
		const target = new URL(CANONICAL_ME_URL);
		target.search = url.search;
		return target.toString();
	}

	if (APEX_ALIASES.has(host) && (path === '/me' || path.startsWith('/me/'))) {
		const target = new URL(CANONICAL_ME_URL);
		target.search = url.search;
		return target.toString();
	}

	return null;
}
