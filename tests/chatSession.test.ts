import { describe, expect, it } from 'bun:test';
import {
	ChatSession,
	createChatSession,
	isSubmittable,
	type ChatLanguage,
	type KodexBarPort
} from '../src/lib/chat/chatSession';
import type { KodexAnswer } from '../src/lib/kodexbar/types';
import { getDestination } from '../src/lib/kodexbar/destinations';

function createRecordingStubBackend(answer: Partial<KodexAnswer> = {}) {
	const calls: Array<{ query: string; language: ChatLanguage }> = [];
	const port: KodexBarPort = {
		async ask(query, language) {
			calls.push({ query, language });
			return {
				text: 'respuesta',
				links: [],
				language,
				matched: true,
				...answer
			};
		}
	};
	return { port, calls };
}

function createSessionWithControllableClock(
	options: Partial<Parameters<typeof createChatSession>[0]> = {}
) {
	let clock = 100_000;
	const session = new ChatSession({
		now: () => clock,
		delay: async () => {},
		...options
	});
	return { session, advance: (ms: number) => (clock += ms) };
}

describe('isSubmittable', () => {
	it('rejects empty and whitespace-only input', () => {
		expect(isSubmittable('')).toBe(false);
		expect(isSubmittable('   ')).toBe(false);
		expect(isSubmittable('\n\t')).toBe(false);
	});

	it('accepts anything with content', () => {
		expect(isSubmittable('cv')).toBe(true);
		expect(isSubmittable('  cv  ')).toBe(true);
	});
});

describe('submit', () => {
	it('appends the user line and the answer line', async () => {
		const { port } = createRecordingStubBackend({ text: 'Es experto en Django.' });
		const { session } = createSessionWithControllableClock({ backend: port });

		expect(await session.submit('¿sabe django?')).toBe('answered');

		const history = session.history;
		expect(history).toHaveLength(2);
		expect(history[0]).toEqual({ role: 'user', text: '¿sabe django?' });
		expect(history[1]).toMatchObject({
			role: 'assistant',
			kind: 'answer',
			text: 'Es experto en Django.',
			matched: true
		});
	});

	it('trims the query before sending it', async () => {
		const { port, calls } = createRecordingStubBackend();
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('   cv   ');
		expect(calls[0].query).toBe('cv');
	});

	it('ignores an empty submit without touching history', async () => {
		const { port, calls } = createRecordingStubBackend();
		const { session } = createSessionWithControllableClock({ backend: port });

		expect(await session.submit('   ')).toBe('ignored');
		expect(session.history).toHaveLength(0);
		expect(calls).toHaveLength(0);
	});

	it('carries the links through verbatim', async () => {
		const cv = getDestination('cv')!;
		const { port } = createRecordingStubBackend({ links: [cv] });
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('cv');
		const line = session.history[1] as { links: typeof cv[] };
		expect(line.links).toHaveLength(1);
		expect(line.links[0].url).toBe(cv.url);
	});

	it('sends the active language', async () => {
		const { port, calls } = createRecordingStubBackend();
		const { session } = createSessionWithControllableClock({ backend: port, language: 'en' });

		await session.submit('cv');
		expect(calls[0].language).toBe('en');
	});
});

describe('cooldown', () => {
	it('blocks a second submit inside the window', async () => {
		const { port, calls } = createRecordingStubBackend();
		const { session } = createSessionWithControllableClock({ backend: port, cooldownMs: 3000 });

		await session.submit('primera');
		expect(await session.submit('segunda')).toBe('cooldown');

		expect(calls).toHaveLength(1);
		expect(session.history[3]).toMatchObject({ kind: 'status' });
		expect((session.history[3] as { text: string }).text).toInclude('3s');
	});

	it('allows a submit once the window has passed', async () => {
		const { port, calls } = createRecordingStubBackend();
		const { session, advance } = createSessionWithControllableClock({ backend: port, cooldownMs: 3000 });

		await session.submit('primera');
		advance(3001);
		expect(await session.submit('segunda')).toBe('answered');
		expect(calls).toHaveLength(2);
	});

	it('reports the remaining time', async () => {
		const { port } = createRecordingStubBackend();
		const { session, advance } = createSessionWithControllableClock({ backend: port, cooldownMs: 3000 });

		await session.submit('primera');
		expect(session.cooldownRemainingMs()).toBe(3000);
		advance(1200);
		expect(session.cooldownRemainingMs()).toBe(1800);
		advance(5000);
		expect(session.cooldownRemainingMs()).toBe(0);
	});
});

describe('failures', () => {
	it('shows a status line when the backend throws', async () => {
		const errors: unknown[] = [];
		const { session } = createSessionWithControllableClock({
			backend: {
				async ask() {
					throw new Error('network down');
				}
			},
			onError: (e) => errors.push(e)
		});

		await session.submit('cv');

		expect(errors).toHaveLength(1);
		expect(session.history[1]).toMatchObject({ kind: 'status' });
		expect(session.isThinking).toBe(false);
	});

	it('clears the thinking flag on both paths', async () => {
		const { port } = createRecordingStubBackend();
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('cv');
		expect(session.isThinking).toBe(false);
	});
});

describe('language', () => {
	it('toggles and emits', () => {
		const snapshots: string[] = [];
		const { session } = createSessionWithControllableClock({
			language: 'es',
			onChange: (s) => snapshots.push(s.language)
		});

		expect(session.toggleLanguage()).toBe('en');
		expect(session.language).toBe('en');
		expect(snapshots).toContain('en');
	});

	it('does not emit when the language is unchanged', () => {
		let emissions = 0;
		const { session } = createSessionWithControllableClock({ language: 'es', onChange: () => emissions++ });

		session.setLanguage('es');
		expect(emissions).toBe(0);
	});

	it('uses the language in effect at submit time for the cooldown notice', async () => {
		const { port } = createRecordingStubBackend();
		const { session } = createSessionWithControllableClock({ backend: port, language: 'en', cooldownMs: 3000 });

		await session.submit('first');
		await session.submit('second');

		expect((session.history[3] as { text: string }).text).toInclude('Wait');
	});
});

describe('snapshot', () => {
	it('returns a copy of history, not the live array', async () => {
		const { port } = createRecordingStubBackend();
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('cv');
		const snap = session.snapshot();
		snap.history.push({ role: 'user', text: 'inyectada' });

		expect(session.history).toHaveLength(2);
	});
});

describe('follow-up suggestions', () => {
	it('starts with nothing to propose', () => {
		const { session } = createSessionWithControllableClock();
		expect(session.snapshot().suggestion).toBe('');
	});

	it('adopts the suggestion the answer carried', async () => {
		const { port } = createRecordingStubBackend({ suggestion: '¿Cómo puedo contactarlo?' });
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('quién es');
		expect(session.snapshot().suggestion).toBe('¿Cómo puedo contactarlo?');
	});

	it('drops a repeated suggestion from the stateless server instead of showing the same placeholder twice', async () => {
		const { port } = createRecordingStubBackend({ suggestion: '¿Cómo puedo contactarlo?' });
		const { session, advance } = createSessionWithControllableClock({ backend: port });

		await session.submit('quién es');
		advance(5000);
		await session.submit('otra cosa');

		expect(session.snapshot().suggestion).toBe('');
	});

	it('clears the suggestion when an answer carries none', async () => {
		const { port } = createRecordingStubBackend({ suggestion: '¿Qué es Coveris?' });
		const { session, advance } = createSessionWithControllableClock({ backend: port });
		await session.submit('primera');
		expect(session.snapshot().suggestion).toBe('¿Qué es Coveris?');

		const bare = createRecordingStubBackend({ suggestion: undefined });
		const { session: second } = createSessionWithControllableClock({ backend: bare.port });
		await second.submit('primera');
		expect(second.snapshot().suggestion).toBe('');
		advance(0);
	});

	it('ignores whitespace-only suggestions', async () => {
		const { port } = createRecordingStubBackend({ suggestion: '   ' });
		const { session } = createSessionWithControllableClock({ backend: port });
		await session.submit('algo');
		expect(session.snapshot().suggestion).toBe('');
	});

	it('leaves the suggestion untouched on a cooldown rejection', async () => {
		const { port } = createRecordingStubBackend({ suggestion: '¿Qué es Coveris?' });
		const { session } = createSessionWithControllableClock({ backend: port, cooldownMs: 3000 });

		await session.submit('primera');
		await session.submit('demasiado rápido');

		expect(session.snapshot().suggestion).toBe('¿Qué es Coveris?');
	});
});

describe('the link offer', () => {
	it('carries the question in place of the links', async () => {
		const { port } = createRecordingStubBackend({ text: 'kodexArg es la marca.', offer: true });
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('quién es kodexArg');

		expect(session.history[1]).toMatchObject({
			kind: 'answer',
			links: [],
			offerPrompt: '¿Ver los links?'
		});
	});

	it('asks in the language of the exchange', async () => {
		const { port } = createRecordingStubBackend({ offer: true });
		const { session } = createSessionWithControllableClock({ backend: port, language: 'en' });

		await session.submit("who's kodexArg");

		expect(session.history[1]).toMatchObject({ offerPrompt: 'Show links?' });
	});

	it('leaves the prompt empty on an ordinary answer', async () => {
		const { port } = createRecordingStubBackend({ links: [getDestination('cv')!] });
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('su cv');

		expect(session.history[1]).toMatchObject({ offerPrompt: '' });
	});

	it('proposes nothing while the offer stands, since the resting placeholder already reads as the answer', async () => {
		const { port } = createRecordingStubBackend({ offer: true, suggestion: '¿Qué es Coveris?' });
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('quién es kodexArg');

		expect(session.snapshot().suggestion).toBe('');
	});

	it('clears a proposal it was already showing', async () => {
		const first = createRecordingStubBackend({ suggestion: '¿Qué es Coveris?' });
		const { session, advance } = createSessionWithControllableClock({ backend: first.port });
		await session.submit('primera');
		expect(session.snapshot().suggestion).toBe('¿Qué es Coveris?');

		const offering = createRecordingStubBackend({ offer: true });
		const { session: second } = createSessionWithControllableClock({ backend: offering.port });
		await second.submit('primera');
		expect(second.snapshot().suggestion).toBe('');
		advance(0);
	});

	it('takes the follow-up back up once the offer resolves', async () => {
		const { port } = createRecordingStubBackend({ suggestion: '¿Qué es Coveris?' });
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('sí');

		expect(session.snapshot().suggestion).toBe('¿Qué es Coveris?');
	});

	it('renders the revealed links as an ordinary answer', async () => {
		const { port } = createRecordingStubBackend({
			text: 'Ahí van.',
			links: [getDestination('cv')!, getDestination('github')!]
		});
		const { session } = createSessionWithControllableClock({ backend: port });

		await session.submit('sí');

		expect(session.history[1]).toMatchObject({
			kind: 'answer',
			text: 'Ahí van.',
			offerPrompt: ''
		});
		expect((session.history[1] as { links: unknown[] }).links).toHaveLength(2);
	});
});
