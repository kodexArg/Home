<script>
	let {
		label = undefined,
		placeholder = '¿Sí?',
		value = $bindable(''),
		onCommit = () => {},
		invalid = false,
		hint = undefined,
		autogrow = false,
		acceptOnTab = ''
	} = $props();

	let inputEl;

	function tabCanBeSafelyBorrowedForSuggestion(proposal, currentValue) {
		return Boolean(proposal) && currentValue.trim() === '';
	}

	let canAcceptSuggestion = $derived(tabCanBeSafelyBorrowedForSuggestion(acceptOnTab, value));

	$effect(() => {
		value;
		if (!autogrow || !inputEl) return;
		inputEl.style.height = 'auto';
		inputEl.style.height = `${inputEl.scrollHeight}px`;
	});

	function moveCaretToEndSoAcceptedTextReadsAsFreshlyTyped() {
		if (!inputEl) return;
		inputEl.focus();
		requestAnimationFrame(() => {
			if (!inputEl) return;
			const end = inputEl.value.length;
			inputEl.setSelectionRange(end, end);
		});
	}

	function acceptSuggestion() {
		value = acceptOnTab;
		moveCaretToEndSoAcceptedTextReadsAsFreshlyTyped();
	}

	export function focusFromOutside() {
		inputEl?.focus();
	}

	export function acceptSuggestionFromOutside() {
		if (!canAcceptSuggestion) return;
		acceptSuggestion();
	}

	function isBackwardTabNavigation(e) {
		return e.key === 'Tab' && e.shiftKey;
	}

	function isSoftNewlineInGrowingField(e) {
		return e.key === 'Enter' && autogrow && e.shiftKey;
	}

	function handleKeyDown(e) {
		if (e.key === 'Tab' && !isBackwardTabNavigation(e) && canAcceptSuggestion) {
			e.preventDefault();
			acceptSuggestion();
			return;
		}

		if (e.key === 'Enter' && !isSoftNewlineInGrowingField(e)) {
			e.preventDefault();
			if (onCommit) {
				onCommit(value);
			}
		}
	}
</script>

<div class="syv-field">
	{#if label}
		<label class="syv-field__label" for="syv-pipboy-input">{label}</label>
	{/if}
	{#if autogrow}
		<textarea
			id="syv-pipboy-input"
			bind:this={inputEl}
			bind:value={value}
			rows="1"
			{placeholder}
			onkeydown={handleKeyDown}
			class="syv-input syv-input--grow"
			class:syv-input--bad={invalid}
			aria-label={label || placeholder || 'Escribe tu mensaje'}
			aria-invalid={invalid ? 'true' : undefined}
			aria-describedby={hint ? 'syv-pipboy-hint' : undefined}
			autocomplete="off"
			autocapitalize="off"
			autocorrect="off"
			spellcheck="false"
			maxlength={2048}
		></textarea>
	{:else}
		<input
			id="syv-pipboy-input"
			bind:this={inputEl}
			bind:value={value}
			type="text"
			{placeholder}
			onkeydown={handleKeyDown}
			class="syv-input"
			class:syv-input--bad={invalid}
			aria-label={label || placeholder || 'Escribe tu mensaje'}
			aria-invalid={invalid ? 'true' : undefined}
			aria-describedby={hint ? 'syv-pipboy-hint' : undefined}
			autocomplete="off"
			autocapitalize="off"
			autocorrect="off"
			spellcheck="false"
			maxlength={2048}
		/>
	{/if}
	{#if hint}
		<span class="syv-field__hint" class:syv-field__hint--bad={invalid}>{hint}</span>
	{/if}
</div>

<style>
	.syv-field {
		display: flex;
		flex-direction: column;
		gap: 9px;
		width: 100%;
	}

	.syv-field__label {
		font-family: var(--font-mono);
		font-size: 16.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--warm-300);
	}

	.syv-field__label::before {
		content: '› ';
		color: var(--orange-500);
		font-weight: bold;
	}

	.syv-input {
		font-family: var(--font-mono);
		font-size: 22.5px;
		letter-spacing: 0;
		color: var(--cream-100);
		font-variant-ligatures: none;
		cursor: text;
		text-shadow: 0.75px 0.9px 0.6px rgba(8, 7, 5, 0.7), -0.3px -0.225px 0 rgba(243, 238, 228, 0.18);
		border: 0;
		border-radius: 9px;
		padding: 16.5px 21px 18px;
		padding-left: 1.21875rem;
		width: 100%;
		box-sizing: border-box;
		line-height: 1.5;
		background-color: rgba(255, 106, 26, 0.04);
		--syv-input-ribbon-color: var(--orange-500);
		--syv-input-cell-grid-color: rgba(255, 106, 26, 0.075);
		background-image:
			linear-gradient(var(--syv-input-ribbon-color), var(--syv-input-ribbon-color)),
			repeating-linear-gradient(90deg, transparent 0 calc(1ch - 1.5px), var(--syv-input-cell-grid-color) calc(1ch - 1.5px) 1ch);
		background-repeat: no-repeat, repeat-x;
		background-size: calc(100% - 42px) 1.5px, 1ch 100%;
		background-position: 21px calc(100% - 12px), 21px 0;
		caret-color: var(--orange-500);
		box-shadow: inset 0 -18px 26px -18px var(--orange-glow);
		transition:
			box-shadow 160ms cubic-bezier(0.16, 1, 0.3, 1),
			background-color 320ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.syv-input::selection {
		background: rgba(255, 106, 26, 0.35);
		color: var(--cream-100);
		text-shadow: none;
	}

	.syv-input::placeholder {
		color: var(--warm-300);
		font-style: normal;
		letter-spacing: 0.04em;
		text-shadow: none;
		text-indent: -0.09375rem;
	}

	.syv-input:hover,
	.syv-input:focus {
		outline: none;
		--syv-input-cell-grid-color: rgba(255, 106, 26, 0.11);
		box-shadow:
			inset 0 -18px 26px -18px var(--orange-glow),
			0 0 18px -7px rgba(255, 106, 26, 0.22);
	}

	.syv-input--grow {
		display: block;
		resize: none;
		overflow-y: auto;
		min-height: calc(1.5em + 34.5px);
		max-height: 30vh;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.syv-input--bad {
		--syv-input-ribbon-color: #d9694e;
		--syv-input-cell-grid-color: rgba(217, 105, 78, 0.1);
		background-color: rgba(217, 105, 78, 0.05);
		box-shadow: inset 0 -18px 26px -18px rgba(217, 105, 78, 0.45);
	}

	.syv-input--bad:hover,
	.syv-input--bad:focus {
		--syv-input-cell-grid-color: rgba(217, 105, 78, 0.16);
		box-shadow:
			inset 0 -24px 32px -16px rgba(217, 105, 78, 0.5),
			0 0 21px -6px rgba(217, 105, 78, 0.32);
	}

	.syv-field__hint {
		font-family: var(--font-mono);
		font-size: 16.5px;
		color: var(--warm-400);
	}

	.syv-field__hint--bad {
		color: #d9694e;
	}
</style>
