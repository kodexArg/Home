import { describe, expect, it } from 'bun:test';
import { DESTINATIONS, getDestination, resolveLinkIds } from '../src/lib/kodexbar/destinations';

/**
 * The allowlist is the only source of URLs in KodexBar (adr-09 §1, §5).
 * These tests guard its integrity and the resolution step that makes a
 * hallucinated link unrepresentable rather than merely unlikely.
 */
describe('DESTINATIONS', () => {
	it('has unique ids', () => {
		const ids = DESTINATIONS.map((d) => d.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('only contains https or mailto URLs', () => {
		for (const dest of DESTINATIONS) {
			expect(dest.url).toMatch(/^(https:\/\/|mailto:)/);
		}
	});

	it('contains no domain known to be dead', () => {
		// These three were served as live links until 2026-07-26 and do not
		// resolve. Regression guard for the "public and live" rule (adr-09 §5).
		const dead = ['payflow.kodexarg.com', 'helpdesk.kodexarg.com', 'kcbd.kodexarg.com'];
		for (const host of dead) {
			expect(DESTINATIONS.some((d) => d.url.includes(host))).toBe(false);
		}
	});

	it('contains no repository known to be private', () => {
		// Referenced by the CV but 404 on GitHub; they belong in the corpus, not here.
		const priv = ['kdx-ng-coveris', 'syv-mcp-tools', 'mcp-singleton-terminal-py'];
		for (const repo of priv) {
			expect(DESTINATIONS.some((d) => d.url.includes(repo))).toBe(false);
		}
	});

	it('exposes a contact destination for the email address', () => {
		const email = getDestination('email');
		expect(email?.kind).toBe('contact');
		expect(email?.url).toBe('mailto:gcavedal@gmail.com');
	});

	it('gives every destination non-empty keywords', () => {
		for (const dest of DESTINATIONS) {
			expect(dest.keywords.length).toBeGreaterThan(0);
			expect(dest.name.length).toBeGreaterThan(0);
		}
	});
});

describe('resolveLinkIds', () => {
	it('resolves known ids in order', () => {
		expect(resolveLinkIds(['github', 'cv']).map((d) => d.id)).toEqual(['github', 'cv']);
	});

	it('drops unknown ids silently', () => {
		// The guard that makes a hallucinated link impossible — adr-09 §1.
		expect(resolveLinkIds(['cv', 'no-existe', 'email']).map((d) => d.id)).toEqual(['cv', 'email']);
	});

	it('drops every id when the model invents all of them', () => {
		expect(resolveLinkIds(['inventado-1', 'inventado-2'])).toEqual([]);
	});

	it('collapses duplicates', () => {
		expect(resolveLinkIds(['cv', 'cv', 'cv']).map((d) => d.id)).toEqual(['cv']);
	});

	it('never returns a URL that is not a committed literal', () => {
		const urls = new Set(DESTINATIONS.map((d) => d.url));
		for (const dest of resolveLinkIds(DESTINATIONS.map((d) => d.id))) {
			expect(urls.has(dest.url)).toBe(true);
		}
	});

	it('handles an empty list', () => {
		expect(resolveLinkIds([])).toEqual([]);
	});
});
