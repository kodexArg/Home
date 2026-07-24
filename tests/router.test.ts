import { describe, expect, test } from 'bun:test';
import { KODEX_DESTINATIONS } from '../src/lib/router/destinations';
import { RuleBasedStrategy } from '../src/lib/router/strategies/ruleBasedStrategy';

describe('kodexArg Router & Destinations Verification', () => {
	const router = new RuleBasedStrategy();

	test('KODEX_DESTINATIONS contains core and live service entries', () => {
		expect(KODEX_DESTINATIONS.length).toBeGreaterThan(25);

		const payflow = KODEX_DESTINATIONS.find((d) => d.id === 'payflow');
		expect(payflow).toBeDefined();
		expect(payflow?.url).toBe('https://payflow.kodexarg.com');

		const helpdesk = KODEX_DESTINATIONS.find((d) => d.id === 'welpdesk');
		expect(helpdesk).toBeDefined();
		expect(helpdesk?.url).toBe('https://helpdesk.kodexarg.com');

		const kcbd = KODEX_DESTINATIONS.find((d) => d.id === 'kcbd-monitor');
		expect(kcbd).toBeDefined();
		expect(kcbd?.url).toBe('https://kcbd.kodexarg.com');
	});

	test('≥85% Certainty score produces direct Action navigate outcome', async () => {
		const res = await router.route('payflow', { language: 'es' });
		expect(res.outcome).toBe('Action');
		expect(res.action?.kind).toBe('navigate');
		expect(res.destination?.id).toBe('payflow');
		expect(res.score).toBeGreaterThanOrEqual(0.85);
	});

	test('50% - 85% Certainty score produces Confirm outcome with candidate options in Spanish', async () => {
		const res = await router.route('signage', { language: 'es' });
		expect(res.outcome).toBe('Confirm');
		expect(res.action?.kind).toBe('confirm');
		expect(res.action?.promptMessage).toContain('¿Sí?');
		expect(res.action?.promptMessage).toContain('certeza moderada');
		expect(res.options?.length).toBeGreaterThan(0);
	});

	test('50% - 85% Certainty score in English produces English prompt (Yes?)', async () => {
		const res = await router.route('signage', { language: 'en' });
		expect(res.outcome).toBe('Confirm');
		expect(res.action?.promptMessage).toContain('Yes?');
		expect(res.action?.promptMessage).toContain('moderate certainty');
	});

	test('<50% Certainty produces NO_MATCH outcome with polite explanation', async () => {
		const res = await router.route('nonexistentunknownterm123456', { language: 'es' });
		expect(res.outcome).toBe('NO_MATCH');
		expect(res.explanation).toContain('50%');
	});
});
