import { describe, expect, it } from 'bun:test';
import {
	CANONICAL_ME_URL,
	ME_HOST,
	redirectToCanonicalMe,
	truncateDisplayName
} from '../src/lib/auth/identitySurface';
import { accessConfigured } from '../src/lib/access';

describe('truncateDisplayName', () => {
	it('keeps short names intact', () => {
		expect(truncateDisplayName('Ana')).toBe('Ana');
		expect(truncateDisplayName('Gabriel')).toBe('Gabriel'.slice(0, 6) + '…');
	});

	it('defaults to six characters plus ellipsis', () => {
		expect(truncateDisplayName('kodexArg')).toBe('kodexA…');
	});
});

describe('redirectToCanonicalMe', () => {
	it('redirects the me host to the canonical apex path', () => {
		expect(redirectToCanonicalMe(new URL('https://me.kodexarg.com/'))).toBe(CANONICAL_ME_URL);
		expect(redirectToCanonicalMe(new URL('https://me.kodexarg.com/anything?x=1'))).toBe(
			`${CANONICAL_ME_URL}?x=1`
		);
		expect(ME_HOST).toBe('me.kodexarg.com');
	});

	it('redirects www and home /me aliases to the apex', () => {
		expect(redirectToCanonicalMe(new URL('https://www.kodexarg.com/me'))).toBe(CANONICAL_ME_URL);
		expect(redirectToCanonicalMe(new URL('https://home.kodexarg.com/me?n=1'))).toBe(
			`${CANONICAL_ME_URL}?n=1`
		);
	});

	it('leaves the apex homepage and /me alone', () => {
		expect(redirectToCanonicalMe(new URL('https://kodexarg.com/'))).toBeNull();
		expect(redirectToCanonicalMe(new URL('https://kodexarg.com/me'))).toBeNull();
		expect(redirectToCanonicalMe(new URL('https://www.kodexarg.com/'))).toBeNull();
	});
});

describe('accessConfigured', () => {
	it('is dormant until both Access secrets exist', () => {
		expect(accessConfigured({})).toBe(false);
		expect(accessConfigured({ CF_ACCESS_TEAM_DOMAIN: 'kodexarg.cloudflareaccess.com' })).toBe(
			false
		);
		expect(
			accessConfigured({
				CF_ACCESS_TEAM_DOMAIN: 'kodexarg.cloudflareaccess.com',
				CF_ACCESS_AUD: 'aud-value'
			})
		).toBe(true);
	});
});
