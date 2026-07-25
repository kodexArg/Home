import { describe, it, expect } from 'bun:test';
import { createChatSession, isSubmittable } from '../src/lib/chat/chatSession';
import type { ChatRouterPort } from '../src/lib/chat/chatSession';
import type { RouteDestination, RouteResult } from '../src/lib/router/types';

const CV: RouteDestination = {
	id: 'cv',
	name: 'CV',
	url: 'https://cv.kodexarg.com',
	description: 'Curriculum',
	keywords: ['cv']
};

function actionResult(): RouteResult {
	return {
		outcome: 'Action',
		action: { kind: 'navigate', destination: CV },
		destination: CV,
		score: 0.98,
		explanation: 'exact',
		strategyName: 'TestStrategy',
		language: 'es'
	};
}

/** Router double that records calls. */
function makeRouter(result: RouteResult = actionResult()) {
	const calls: string[] = [];
	const router: ChatRouterPort = {
		async route(query) {
			calls.push(query);
			return result;
		}
	};
	return { router, calls };
}

/** Clock starting far from 0 so the very first submit is outside the cooldown. */
function makeClock(start = 1_000_000) {
	let t = start;
	return {
		now: () => t,
		advance: (ms: number) => {
			t += ms;
		}
	};
}

const noDelay = async () => {};

function session(overrides: Parameters<typeof createChatSession>[0] = {}) {
	const clock = makeClock();
	const { router, calls } = makeRouter();
	const s = createChatSession({
		router,
		now: clock.now,
		delay: noDelay,
		onError: () => {},
		...overrides
	});
	return { s, clock, calls };
}

describe('ChatSession', () => {
	it('appends the user turn and then the assistant turn, in order', async () => {
		const { s } = session();

		await s.submit('cv');

		expect(s.history.length).toBe(2);
		expect(s.history[0]).toEqual({ role: 'user', text: 'cv' });
		expect(s.history[1]!.role).toBe('assistant');
		expect((s.history[1] as { kind: string }).kind).toBe('navigate');
		expect(s.isRouting).toBe(false);
	});

	it('blocks a second submit inside the cooldown window and yields the cooldown message', async () => {
		const clock = makeClock();
		const { router } = makeRouter();
		const s = createChatSession({ router, now: clock.now, delay: noDelay });

		await s.submit('cv');
		clock.advance(1000);
		const outcome = await s.submit('again');

		expect(outcome).toBe('cooldown');
		expect(s.history.length).toBe(4);
		expect(s.history[2]).toEqual({ role: 'user', text: 'again' });
		expect(s.history[3]).toEqual({
			role: 'assistant',
			kind: 'status',
			text: '⏱️ Por favor espera 2s antes de enviar otra consulta (cooldown de 3s).'
		});
	});

	it('accepts a submit again after the cooldown elapses', async () => {
		const clock = makeClock();
		const { router, calls } = makeRouter();
		const s = createChatSession({ router, now: clock.now, delay: noDelay });

		await s.submit('cv');
		clock.advance(3000);
		const outcome = await s.submit('cv again');

		expect(outcome).toBe('routed');
		expect(calls).toEqual(['cv', 'cv again']);
		expect(s.cooldownRemainingMs()).toBe(3000);
	});

	it('ignores empty and whitespace-only queries', async () => {
		const { s, calls } = session();

		expect(await s.submit('')).toBe('ignored');
		expect(await s.submit('   \n\t ')).toBe('ignored');
		expect(s.history.length).toBe(0);
		expect(calls).toEqual([]);
		expect(isSubmittable('  ')).toBe(false);
		expect(isSubmittable(' hi ')).toBe(true);
	});

	it('survives a throwing router without corrupting history or sticking isRouting', async () => {
		const clock = makeClock();
		const errors: unknown[] = [];
		const s = createChatSession({
			router: {
				async route() {
					throw new Error('boom');
				}
			},
			now: clock.now,
			delay: noDelay,
			onError: (e) => errors.push(e)
		});

		await s.submit('cv');

		expect(s.isRouting).toBe(false);
		expect(errors.length).toBe(1);
		expect(s.history.length).toBe(2);
		expect(s.history[0]).toEqual({ role: 'user', text: 'cv' });
		expect(s.history[1]).toEqual({
			role: 'assistant',
			kind: 'status',
			text: 'Ocurrió un error procesando la consulta. Intente nuevamente.'
		});
	});

	it('asks the router exactly once per accepted submit', async () => {
		const clock = makeClock();
		const { router, calls } = makeRouter();
		const s = createChatSession({ router, now: clock.now, delay: noDelay });

		await s.submit('one');
		await s.submit('blocked by cooldown');
		clock.advance(3000);
		await s.submit('two');

		expect(calls).toEqual(['one', 'two']);
	});

	it('routes with the active language and the language toggle flips it', async () => {
		const calls: Array<{ query: string; language?: string }> = [];
		const clock = makeClock();
		const s = createChatSession({
			router: {
				async route(query, options) {
					calls.push({ query, language: options?.language });
					return actionResult();
				}
			},
			now: clock.now,
			delay: noDelay
		});

		await s.submit('cv');
		expect(s.toggleLanguage()).toBe('en');
		clock.advance(3000);
		await s.submit('cv');

		expect(calls).toEqual([
			{ query: 'cv', language: 'es' },
			{ query: 'cv', language: 'en' }
		]);
	});

	it('notifies subscribers on every state change', async () => {
		const clock = makeClock();
		const { router } = makeRouter();
		const seen: boolean[] = [];
		const s = createChatSession({
			router,
			now: clock.now,
			delay: noDelay,
			onChange: (snap) => seen.push(snap.isRouting)
		});

		await s.submit('cv');

		expect(seen).toEqual([false, true, true, false]);
		expect(s.snapshot().history.length).toBe(2);
	});
});
