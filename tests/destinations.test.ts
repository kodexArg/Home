import { describe, expect, it } from 'bun:test';
import { DESTINATIONS, getDestination, resolveLinkIds } from '../src/lib/kodexbar/destinations';

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
		const dead = ['payflow.kodexarg.com', 'helpdesk.kodexarg.com', 'kcbd.kodexarg.com'];
		for (const host of dead) {
			expect(DESTINATIONS.some((d) => d.url.includes(host))).toBe(false);
		}
	});

	it('contains no repository known to be private', () => {
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

describe('self-referential destinations', () => {
	const OWN_ORIGINS = ['kodexarg.com', 'www.kodexarg.com', 'home.kodexarg.com'];

	it('does not offer a link back to the site the answer is rendered on', () => {
		const offenders = DESTINATIONS.filter((d) => {
			const host = d.url.replace(/^https?:\/\//, '').replace(/[/?#].*$/, '').toLowerCase();
			return OWN_ORIGINS.includes(host);
		}).map((d) => `${d.id} -> ${d.url}`);

		expect(offenders).toEqual([]);
	});
});

describe('resolveLinkIds', () => {
	it('resolves known ids in order', () => {
		expect(resolveLinkIds(['github', 'cv']).map((d) => d.id)).toEqual(['github', 'cv']);
	});

	it('drops unknown ids silently', () => {
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
