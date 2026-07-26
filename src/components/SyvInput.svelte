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
		requestAnimationFrame(() => {
			if (!inputEl) return;
			inputEl.focus();
			const end = inputEl.value.length;
			inputEl.setSelectionRange(end, end);
		});
	}

	function acceptSuggestion() {
		value = acceptOnTab;
		moveCaretToEndSoAcceptedTextReadsAsFreshlyTyped();
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
		gap: 6px;
		width: 100%;
	}

	.syv-field__label {
		font-family: var(--font-mono);
		font-size: 11px;
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
		font-size: 15px;
		letter-spacing: 0;
		color: var(--cream-100);
		font-variant-ligatures: none;
		cursor: text;
		text-shadow: 0.5px 0.6px 0.4px rgba(8, 7, 5, 0.7), -0.2px -0.15px 0 rgba(243, 238, 228, 0.18);
		border: 0;
		border-radius: 6px;
		padding: 11px 14px 12px;
		padding-left: 0.8125rem;
		width: 100%;
		box-sizing: border-box;
		line-height: 1.5;
		background-color: rgba(255, 255, 255, 0.02);
		--syv-input-baseline-rule-color: var(--ink-600);
		background-image: linear-gradient(var(--syv-input-baseline-rule-color), var(--syv-input-baseline-rule-color));
		background-repeat: no-repeat;
		background-size: calc(100% - 28px) 1.5px;
		background-position: 14px calc(100% - 8px);
		caret-color: var(--orange-500);
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
		color: var(--warm-400);
		font-style: normal;
		letter-spacing: 0.04em;
		text-shadow: none;
		text-indent: -0.09375rem;
	}

	.syv-input:hover {
		background-color: rgba(255, 255, 255, 0.04);
	}

	.syv-input:focus {
		outline: none;
		background-color: rgba(255, 106, 26, 0.05);
		--syv-input-focus-ribbon-color: var(--orange-500);
		--syv-input-focus-cell-grid-color: rgba(255, 106, 26, 0.08);
		background-image:
			linear-gradient(var(--syv-input-focus-ribbon-color), var(--syv-input-focus-ribbon-color)),
			repeating-linear-gradient(90deg, transparent 0 calc(1ch - 1px), var(--syv-input-focus-cell-grid-color) calc(1ch - 1px) 1ch);
		background-repeat: no-repeat, repeat-x;
		background-size: calc(100% - 28px) 1.5px, 1ch 100%;
		background-position: 14px calc(100% - 8px), 14px 0;
		box-shadow: inset 0 -10px 16px -12px var(--orange-glow);
	}

	.syv-input--grow {
		display: block;
		resize: none;
		overflow-y: auto;
		min-height: calc(1.5em + 23px);
		max-height: 30vh;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.syv-input--bad {
		background-image: linear-gradient(#d9694e, #d9694e);
	}

	.syv-input--bad:focus {
		background-color: rgba(217, 105, 78, 0.06);
		background-image:
			linear-gradient(#d9694e, #d9694e),
			repeating-linear-gradient(90deg, transparent 0 calc(1ch - 1px), rgba(217, 105, 78, 0.10) calc(1ch - 1px) 1ch);
		box-shadow: inset 0 -10px 16px -12px rgba(217, 105, 78, 0.5);
	}

	.syv-field__hint {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--warm-400);
	}

	.syv-field__hint--bad {
		color: #d9694e;
	}
</style>
