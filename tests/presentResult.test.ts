import { describe, expect, test } from 'bun:test';
import { presentResult } from '../src/lib/router/presentResult';
import type { RouteResult } from '../src/lib/router/types';

const payflow = {
	id: 'payflow',
	name: 'Payflow - Financial Gateway',
	url: 'https://payflow.kodexarg.com',
	description: 'Production financial gateway and payment routing service for kodexArg ecosystem.',
	keywords: ['payflow']
};

const signage = {
	id: 'kdx-pi-signage',
	name: 'kdx-pi-signage - Digital Signage Looper',
	url: 'https://github.com/kodexArg/kdx-pi-signage',
	description: 'Autonomous digital-signage video looper for Raspberry Pi.',
	keywords: ['signage']
};

describe('presentResult', () => {
	test('Action result yields affirmative opener, exact name, exact url, and description', () => {
		const result: RouteResult = {
			outcome: 'Action',
			destination: payflow,
			explanation: 'matched',
			strategyName: 'RuleBasedStrategy',
			score: 0.98,
			language: 'es'
		};

		const presented = presentResult(result);

		expect(presented.outcome).toBe('action');
		expect(presented.opener).toBe('Sí, claro,');
		expect(presented.name).toBe(payflow.name);
		expect(presented.url).toBe(payflow.url);
		expect(presented.description).toBe(payflow.description);
	});

	test('Confirm result yields tentative wording and does not read as a confirmed answer', () => {
		const result: RouteResult = {
			outcome: 'Confirm',
			options: [signage],
			explanation: 'ambiguous',
			strategyName: 'RuleBasedStrategy',
			score: 0.7,
			language: 'es'
		};

		const presented = presentResult(result);

		expect(presented.outcome).toBe('confirm');
		expect(presented.opener).not.toContain('Sí, claro');
		expect(presented.opener.toLowerCase()).toContain('creo');
		expect(presented.closer).toBeDefined();
		expect(presented.name).toBe(signage.name);
		expect(presented.url).toBe(signage.url);
		expect(presented.description).toBe(signage.description);
	});

	test('NO_MATCH yields no URL at all', () => {
		const result: RouteResult = {
			outcome: 'NO_MATCH',
			explanation: 'no match found',
			strategyName: 'RuleBasedStrategy',
			language: 'es'
		};

		const presented = presentResult(result);

		expect(presented.outcome).toBe('no_match');
		expect(presented.url).toBeUndefined();
		expect(presented.name).toBeUndefined();
	});

	test('language "en" yields English wording', () => {
		const result: RouteResult = {
			outcome: 'Action',
			destination: payflow,
			explanation: 'matched',
			strategyName: 'RuleBasedStrategy',
			language: 'en'
		};

		const presented = presentResult(result);
		expect(presented.opener).toBe('Sure, here you go,');
	});

	test('default/absent language yields Spanish', () => {
		const result: RouteResult = {
			outcome: 'Action',
			destination: payflow,
			explanation: 'matched',
			strategyName: 'RuleBasedStrategy'
		};

		const presented = presentResult(result);
		expect(presented.opener).toBe('Sí, claro,');
	});

	test('the returned URL is always the destination\'s own url', () => {
		const actionResult: RouteResult = {
			outcome: 'Action',
			destination: payflow,
			explanation: 'matched',
			strategyName: 'RuleBasedStrategy',
			language: 'es'
		};
		const confirmResult: RouteResult = {
			outcome: 'Confirm',
			options: [signage],
			explanation: 'ambiguous',
			strategyName: 'RuleBasedStrategy',
			language: 'es'
		};

		expect(presentResult(actionResult).url).toBe(payflow.url);
		expect(presentResult(confirmResult).url).toBe(signage.url);
	});
});
