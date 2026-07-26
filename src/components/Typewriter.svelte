<script>
	/*
	 * Typewriter — plays the pure engine from lib/ui/typewriter.ts against a
	 * live timer, rendering assistant text char-by-char with word pauses and
	 * occasional simulated typos.
	 *
	 * Implemented as a component (not a `use:` action) because it owns two
	 * pieces of rendered DOM that must stay in sync — the animated,
	 * aria-hidden text and the visually-hidden full-text sibling for screen
	 * readers — which a single-node action cannot express as cleanly.
	 */
	import {
		generateTypewriterSteps,
		DEFAULT_CHAR_DELAY_MS,
		DEFAULT_WORD_PAUSE_MS,
		DEFAULT_TYPO_PROBABILITY,
		DEFAULT_TYPO_HESITATION_MS
	} from '../lib/ui/typewriter';

	let {
		text = '',
		charDelayMs = DEFAULT_CHAR_DELAY_MS,
		wordPauseMs = DEFAULT_WORD_PAUSE_MS,
		typoProbability = DEFAULT_TYPO_PROBABILITY,
		typoHesitationMs = DEFAULT_TYPO_HESITATION_MS,
		random = Math.random,
		/*
		 * Fired once the full text is on screen — including immediately under
		 * reduced motion, where there is no animation to wait for. Callers use
		 * it to hold back anything that must not appear before the sentence is
		 * finished (the link chips).
		 */
		ondone = () => {}
	} = $props();

	let visible = $state('');
	let timerId = null;

	/*
	 * The text this instance has already typed out.
	 *
	 * Deliberately a plain `let`, not `$state`: it must not be reactive, or
	 * writing it would re-trigger the very effect that reads it.
	 *
	 * Without this guard the animation restarts whenever the effect below
	 * re-runs, and the effect re-runs on parent re-renders it has no business
	 * caring about — appending a new chat line retyped the first answer from
	 * scratch. A typewriter is idempotent for a given string: it types it once.
	 */
	let played = null;

	function prefersReducedMotion() {
		return (
			typeof window !== 'undefined' &&
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	function clearTimer() {
		if (timerId !== null) {
			clearTimeout(timerId);
			timerId = null;
		}
	}

	function play(target) {
		clearTimer();

		if (prefersReducedMotion()) {
			// Non-negotiable: reduced motion means the full text appears instantly.
			visible = target;
			ondone();
			return;
		}

		const steps = generateTypewriterSteps(target, {
			charDelayMs,
			wordPauseMs,
			typoProbability,
			typoHesitationMs,
			random
		});

		visible = '';
		let i = 0;

		function step() {
			if (i >= steps.length) {
				timerId = null;
				ondone();
				return;
			}
			const s = steps[i];
			i++;
			if (s.kind === 'type' || s.kind === 'typo') {
				visible += s.char;
			} else if (s.kind === 'backspace') {
				visible = visible.slice(0, -1);
			}
			// 'pause' steps consume the delay without changing visible text.
			timerId = setTimeout(step, s.delayMs);
		}

		timerId = setTimeout(step, 0);
	}

	$effect(() => {
		// Same string as last time? Nothing to do — leave the finished text alone.
		if (played === text) return;
		played = text;
		play(text);
		return () => clearTimer();
	});
</script>

<span class="typewriter">
	<span class="typewriter__animated" aria-hidden="true">{visible}</span>
	<span class="typewriter__full sr-only">{text}</span>
</span>

<style>
	.typewriter__animated {
		white-space: pre-wrap;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
