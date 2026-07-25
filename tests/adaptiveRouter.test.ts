import { describe, expect, test } from 'bun:test';
import { AdaptiveRouter } from '../src/lib/router/adaptiveRouter';
import type { RouterStrategy, RouteResult, RouterOptions } from '../src/lib/router/types';

function makeStrategy(name: string, behavior: 'noMatch' | 'action' | 'throw'): RouterStrategy {
	return {
		name,
		isSupported: async () => true,
		route: async (_query: string, _options?: RouterOptions): Promise<RouteResult> => {
			if (behavior === 'throw') {
				throw new Error(`${name} exploded`);
			}
			if (behavior === 'noMatch') {
				return {
					outcome: 'NO_MATCH',
					explanation: `${name} found no matching target`,
					strategyName: name
				};
			}
			return {
				outcome: 'Action',
				action: { kind: 'navigate', target: 'https://example.com', label: 'Example' },
				explanation: `${name} matched`,
				strategyName: name
			};
		}
	};
}

describe('AdaptiveRouter cascade fallthrough', () => {
	test('first strategy NO_MATCH, second returns Action -> route() returns the second strategy Action', async () => {
		const first = makeStrategy('First', 'noMatch');
		const second = makeStrategy('Second', 'action');
		const router = new AdaptiveRouter([first, second]);

		const result = await router.route('anything');

		expect(result.outcome).toBe('Action');
		expect(result.strategyName).toBe('Second');
	});

	test('first strategy throws -> a later strategy result is returned (regression guard)', async () => {
		const first = makeStrategy('Thrower', 'throw');
		const second = makeStrategy('Second', 'action');
		const router = new AdaptiveRouter([first, second]);

		const result = await router.route('anything');

		expect(result.outcome).toBe('Action');
		expect(result.strategyName).toBe('Second');
	});

	test('every strategy NO_MATCH -> the LAST result is returned unmodified', async () => {
		const first = makeStrategy('First', 'noMatch');
		const second = makeStrategy('Second', 'noMatch');
		const third = makeStrategy('Third', 'noMatch');
		const router = new AdaptiveRouter([first, second, third]);

		const result = await router.route('anything');

		expect(result.outcome).toBe('NO_MATCH');
		expect(result.strategyName).toBe('Third');
		expect(result.explanation).toBe('Third found no matching target');
	});

	test('default strategy list no longer contains any strategy whose name includes "WebLLM"', async () => {
		const router = new AdaptiveRouter();
		const names = router.getStrategies().map((s) => s.name);
		expect(names.some((n) => n.includes('WebLLM'))).toBe(false);
	});
});
