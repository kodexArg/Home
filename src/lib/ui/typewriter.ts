/**
 * Pure typewriter engine.
 *
 * Given a target string and a config (including an injected RNG), produces a
 * deterministic sequence of steps describing how the text should be "typed"
 * character by character, including occasional simulated typos.
 *
 * This module has NO timers and NO DOM access — it is pure data generation,
 * which is what makes it unit-testable without faking timers or a browser.
 * A separate rendering layer (Svelte action / component) is responsible for
 * walking the step list and scheduling it with real timers.
 */

export type TypewriterStep =
	| { kind: 'type'; char: string; delayMs: number }
	| { kind: 'typo'; char: string; delayMs: number }
	| { kind: 'backspace'; delayMs: number }
	| { kind: 'pause'; delayMs: number };

export interface TypewriterConfig {
	/** Delay in ms before/after typing a single character. Fast by default. */
	charDelayMs?: number;
	/** Extra pause in ms inserted at word boundaries (after whitespace). */
	wordPauseMs?: number;
	/** Probability (0..1) that any given eligible character is typo'd. */
	typoProbability?: number;
	/** How long (ms) the "typo" is left on screen before being backspaced. */
	typoHesitationMs?: number;
	/** Injected RNG, defaults to Math.random. Pass a seeded generator for deterministic tests. */
	random?: () => number;
}

export const DEFAULT_CHAR_DELAY_MS = 18;
export const DEFAULT_WORD_PAUSE_MS = 40;
export const DEFAULT_TYPO_PROBABILITY = 0.005;
export const DEFAULT_TYPO_HESITATION_MS = 1000;

/**
 * Adjacent-key map for a standard QWERTY layout (lowercase letters only).
 * Used so simulated typos look like plausible fat-finger slips rather than
 * a random letter from anywhere in the alphabet.
 */
const QWERTY_ADJACENCY: Record<string, string[]> = {
	a: ['q', 'w', 's', 'z'],
	b: ['v', 'g', 'h', 'n'],
	c: ['x', 'd', 'f', 'v'],
	d: ['s', 'e', 'r', 'f', 'c', 'x'],
	e: ['w', 's', 'd', 'r'],
	f: ['d', 'r', 't', 'g', 'v', 'c'],
	g: ['f', 't', 'y', 'h', 'b', 'v'],
	h: ['g', 'y', 'u', 'j', 'n', 'b'],
	i: ['u', 'j', 'k', 'o'],
	j: ['h', 'u', 'i', 'k', 'n', 'm'],
	k: ['j', 'i', 'o', 'l', 'm'],
	l: ['k', 'o', 'p'],
	m: ['n', 'j', 'k'],
	n: ['b', 'h', 'j', 'm'],
	o: ['i', 'k', 'l', 'p'],
	p: ['o', 'l'],
	q: ['w', 'a'],
	r: ['e', 'd', 'f', 't'],
	s: ['a', 'w', 'e', 'd', 'x', 'z'],
	t: ['r', 'f', 'g', 'y'],
	u: ['y', 'h', 'j', 'i'],
	v: ['c', 'f', 'g', 'b'],
	w: ['q', 'a', 's', 'e'],
	x: ['z', 's', 'd', 'c'],
	y: ['t', 'g', 'h', 'u'],
	z: ['a', 's', 'x']
};

/**
 * Picks a plausible wrong character for `char` from its QWERTY neighbours,
 * preserving case. Returns null if `char` has no known neighbours (digits,
 * punctuation, non-Latin characters, ...) — in that case the caller should
 * simply skip the typo for this character rather than fabricate a nonsense
 * substitution.
 */
function pickTypoChar(char: string, random: () => number): string | null {
	const lower = char.toLowerCase();
	const options = QWERTY_ADJACENCY[lower];
	if (!options || options.length === 0) return null;
	const idx = Math.floor(random() * options.length) % options.length;
	const picked = options[idx];
	return char === lower ? picked : picked.toUpperCase();
}

const WHITESPACE_RE = /\s/;

/**
 * Generates the full deterministic step sequence for typing `text`.
 *
 * Placement rules for typos:
 * - never on a whitespace character
 * - never on the last character of a word (i.e. a char immediately followed
 *   by whitespace or the end of the string) — backspacing right before a
 *   pause reads as broken rather than as a natural slip
 */
export function generateTypewriterSteps(
	text: string,
	config: TypewriterConfig = {}
): TypewriterStep[] {
	const {
		charDelayMs = DEFAULT_CHAR_DELAY_MS,
		wordPauseMs = DEFAULT_WORD_PAUSE_MS,
		typoProbability = DEFAULT_TYPO_PROBABILITY,
		typoHesitationMs = DEFAULT_TYPO_HESITATION_MS,
		random = Math.random
	} = config;

	const steps: TypewriterStep[] = [];
	// Array.from splits on Unicode code points, avoiding broken surrogate pairs.
	const chars = Array.from(text);

	for (let i = 0; i < chars.length; i++) {
		const char = chars[i];
		const isWhitespace = WHITESPACE_RE.test(char);
		const isLastChar = i === chars.length - 1;
		const endsWord = isLastChar || WHITESPACE_RE.test(chars[i + 1]);
		const eligibleForTypo = !isWhitespace && !endsWord;

		if (eligibleForTypo && random() < typoProbability) {
			const typoChar = pickTypoChar(char, random);
			if (typoChar) {
				steps.push({ kind: 'typo', char: typoChar, delayMs: charDelayMs });
				steps.push({ kind: 'pause', delayMs: typoHesitationMs });
				steps.push({ kind: 'backspace', delayMs: charDelayMs });
			}
		}

		steps.push({ kind: 'type', char, delayMs: charDelayMs });

		if (isWhitespace) {
			steps.push({ kind: 'pause', delayMs: wordPauseMs });
		}
	}

	return steps;
}

/**
 * Replays a step sequence into the final visible string. Useful for tests
 * and as the reference implementation the renderer's incremental logic
 * must match.
 */
export function applyTypewriterSteps(steps: TypewriterStep[]): string {
	let out = '';
	for (const step of steps) {
		if (step.kind === 'type' || step.kind === 'typo') {
			out += step.char;
		} else if (step.kind === 'backspace') {
			out = out.slice(0, -1);
		}
	}
	return out;
}

/** Total simulated time (ms) a step sequence takes to fully play out. */
export function totalTypewriterDurationMs(steps: TypewriterStep[]): number {
	return steps.reduce((sum, step) => sum + step.delayMs, 0);
}
