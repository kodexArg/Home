<script>
	/*
	 * LanguageToggle — segmented ES | EN control.
	 *
	 * Presentation only: renders the language it is given and reports the one the
	 * visitor picked. Persistence, browser-preference seeding and `<html lang>`
	 * sync all live in ../lib/ui/language.ts.
	 *
	 * ARIA: the options are mutually exclusive, so this is a radiogroup of radios
	 * with a roving tabindex — one tab stop for the group, arrows move between
	 * options. Each option carries its own `lang` plus its endonym as accessible
	 * name ("Español" / "English"), so a screen reader announces it in that
	 * language and reports which one is checked.
	 */
	import { LANGUAGE_GROUP_LABEL, LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from '../lib/ui/language';

	let { language = 'es', onSelect = () => {} } = $props();

	const options = SUPPORTED_LANGUAGES.map((value) => ({ value, ...LANGUAGE_LABELS[value] }));
	const optionEls = [];

	let groupLabel = $derived(LANGUAGE_GROUP_LABEL[language] ?? LANGUAGE_GROUP_LABEL.es);

	function select(value) {
		if (value !== language) onSelect(value);
	}

	function focusIndex(index) {
		select(options[index].value);
		optionEls[index]?.focus();
	}

	function handleKeyDown(event, index) {
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
				event.preventDefault();
				focusIndex((index + 1) % options.length);
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				event.preventDefault();
				focusIndex((index - 1 + options.length) % options.length);
				break;
			case 'Home':
				event.preventDefault();
				focusIndex(0);
				break;
			case 'End':
				event.preventDefault();
				focusIndex(options.length - 1);
				break;
		}
	}
</script>

<div class="lang-toggle">
	<span class="lang-toggle__icon" aria-hidden="true">
		<svg
			width="13"
			height="13"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
			focusable="false"
		>
			<circle cx="12" cy="12" r="9"></circle>
			<path d="M3 12h18"></path>
			<path d="M12 3a15 15 0 0 1 3.6 9 15 15 0 0 1-3.6 9 15 15 0 0 1-3.6-9 15 15 0 0 1 3.6-9z"></path>
		</svg>
	</span>

	<div class="lang-toggle__options" role="radiogroup" aria-label={groupLabel}>
		{#each options as option, index (option.value)}
			{#if index > 0}
				<span class="lang-toggle__sep" aria-hidden="true">|</span>
			{/if}
			<button
				type="button"
				role="radio"
				class="lang-toggle__option"
				class:is-active={option.value === language}
				aria-checked={option.value === language ? 'true' : 'false'}
				aria-label={option.name}
				tabindex={option.value === language ? 0 : -1}
				lang={option.value}
				bind:this={optionEls[index]}
				onclick={() => select(option.value)}
				onkeydown={(event) => handleKeyDown(event, index)}
			>
				{option.code}
			</button>
		{/each}
	</div>
</div>

<style>
	.lang-toggle {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: rgba(18, 16, 12, 0.75);
		border: 1px solid var(--ink-600);
		border-radius: 4px;
		padding: 3px 8px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--warm-300);
	}

	.lang-toggle__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--warm-400);
		user-select: none;
		pointer-events: none;
	}

	.lang-toggle__options {
		display: inline-flex;
		align-items: center;
		gap: 2px;
	}

	.lang-toggle__sep {
		color: var(--ink-600);
		user-select: none;
	}

	.lang-toggle__option {
		background: transparent;
		border: 0;
		border-radius: 3px;
		padding: 2px 7px;
		font-family: inherit;
		font-size: inherit;
		letter-spacing: 0.08em;
		color: var(--warm-300);
		cursor: pointer;
		transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
	}

	.lang-toggle__option:hover {
		color: var(--orange-300);
	}

	.lang-toggle__option.is-active {
		background: rgba(255, 106, 26, 0.14);
		color: var(--orange-300);
		box-shadow: inset 0 0 0 1px rgba(255, 106, 26, 0.35);
	}

	.lang-toggle__option:focus-visible {
		outline: 1px solid var(--orange-500);
		outline-offset: 1px;
	}

	@media (prefers-reduced-motion: reduce) {
		.lang-toggle__option {
			transition: none;
		}
	}
</style>
