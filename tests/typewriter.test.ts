import { describe, expect, test } from 'bun:test';
import {
	generateTypewriterSteps,
	applyTypewriterSteps,
	DEFAULT_WORD_PAUSE_MS,
	DEFAULT_TYPO_HESITATION_MS
} from '../src/lib/ui/typewriter';

/** Deterministic seeded PRNG (mulberry32) for reproducible test runs. */
function mulberry32(seed: number): () => number {
	let s = seed;
	return function random() {
		s |= 0;
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Returns a fixed sequence of values, one per call. Throws if exhausted. */
function queueRandom(values: number[]): () => number {
	let i = 0;
	return () => {
		if (i >= values.length) {
			throw new Error('queueRandom exhausted');
		}
		return values[i++];
	};
}

describe('generateTypewriterSteps', () => {
	test('with an RNG that never triggers a typo, steps spell exactly the input text', () => {
		const text = 'the quick brown fox';
		const random = () => 0.99; // always above default typoProbability (0.01)
		const steps = generateTypewriterSteps(text, { random });

		expect(steps.some((s) => s.kind === 'typo')).toBe(false);
		expect(applyTypewriterSteps(steps)).toBe(text);
	});

	test('with an RNG forcing a typo, sequence has wrong char -> pause -> backspace -> correct char, and final text is unchanged', () => {
		const text = 'cat dog';
		// eligible-for-typo indices in "cat dog": 0 ('c'), 1 ('a'), 4 ('d'), 5 ('o')
		// force a typo on the very first eligible char (index 0, 'c'), never again after.
		const random = queueRandom([
			0, // index 0 typo-check: triggers (< 0.01)
			0.5, // index 0 adjacency pick
			0.99, // index 1 typo-check: no
			0.99, // index 4 typo-check: no
			0.99 // index 5 typo-check: no
		]);
		const steps = generateTypewriterSteps(text, { random });

		const typoIndex = steps.findIndex((s) => s.kind === 'typo');
		expect(typoIndex).toBeGreaterThanOrEqual(0);

		const typoStep = steps[typoIndex];
		const pauseStep = steps[typoIndex + 1];
		const backspaceStep = steps[typoIndex + 2];
		const correctStep = steps[typoIndex + 3];

		expect(typoStep.kind).toBe('typo');
		if (typoStep.kind === 'typo') {
			expect(typoStep.char).not.toBe('c');
		}
		expect(pauseStep.kind).toBe('pause');
		if (pauseStep.kind === 'pause') {
			expect(pauseStep.delayMs).toBe(DEFAULT_TYPO_HESITATION_MS);
		}
		expect(backspaceStep.kind).toBe('backspace');
		expect(correctStep.kind).toBe('type');
		if (correctStep.kind === 'type') {
			expect(correctStep.char).toBe('c');
		}

		expect(applyTypewriterSteps(steps)).toBe(text);
	});

	test('word-boundary pauses appear between words', () => {
		const text = 'one two three';
		const random = () => 0.99; // no typos, isolate word-boundary behaviour
		const steps = generateTypewriterSteps(text, { random });

		const wordPauses = steps.filter(
			(s) => s.kind === 'pause' && s.delayMs === DEFAULT_WORD_PAUSE_MS
		);
		// "one two three" has 2 spaces -> 2 word-boundary pauses
		expect(wordPauses.length).toBe(2);
	});

	test('never calls Math.random when an RNG is injected', () => {
		const originalRandom = Math.random;
		let callCount = 0;
		Math.random = () => {
			callCount++;
			return originalRandom();
		};
		try {
			const seeded = mulberry32(42);
			generateTypewriterSteps('some reasonably long sentence to type out fully', {
				random: seeded
			});
			expect(callCount).toBe(0);
		} finally {
			Math.random = originalRandom;
		}
	});

	test('final rendered text always equals the input, across several seeded runs', () => {
		const text =
			'The quick brown fox jumps over the lazy dog, again and again, testing typos and pauses.';
		const seeds = [1, 2, 3, 42, 1337, 999999, 7];

		for (const seed of seeds) {
			const random = mulberry32(seed);
			const steps = generateTypewriterSteps(text, { random, typoProbability: 0.05 });
			expect(applyTypewriterSteps(steps)).toBe(text);
		}
	});
});
