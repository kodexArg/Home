<script>
	let {
		label = undefined,
		placeholder = '¿Sí?',
		value = $bindable(''),
		onCommit = () => {},
		invalid = false,
		hint = undefined,
		autogrow = false,
		acceptOnTab = '',
		sendLabel = 'Enviar'
	} = $props();

	let inputEl = $state();

	let hasSomethingToSend = $derived(value.trim() !== '');

	function keepTheCaretWhereItWas(e) {
		e.preventDefault();
	}

	function send() {
		if (!hasSomethingToSend) return;
		onCommit(value);
	}

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
	<div class="syv-field__control">
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
			class:syv-input--room-for-send={hasSomethingToSend}
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
			class:syv-input--room-for-send={hasSomethingToSend}
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
	{#if hasSomethingToSend}
		<button
			type="button"
			class="syv-send"
			aria-label={sendLabel}
			title={sendLabel}
			onmousedown={keepTheCaretWhereItWas}
			onclick={send}
		>
			<svg
				class="syv-send__enter"
				width="26"
				height="26"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
				focusable="false"
			>
				<path
					d="M19 5v7a3 3 0 0 1-3 3H6"
					stroke="currentColor"
					stroke-width="2.85"
					stroke-linecap="square"
					stroke-linejoin="miter"
				/>
				<path
					d="M10 11 5 15l5 4"
					stroke="currentColor"
					stroke-width="2.85"
					stroke-linecap="square"
					stroke-linejoin="miter"
				/>
			</svg>
		</button>
	{/if}
	</div>
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

	.syv-field__control {
		position: relative;
		width: 100%;
	}

	.syv-send {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 2.625rem;
		padding: 0;
		margin: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		appearance: none;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--orange-500);
		font: inherit;
		cursor: pointer;
		z-index: 2;
		-webkit-tap-highlight-color: transparent;
		animation: syv-send-in 420ms ease-out both;
	}

	.syv-send__enter {
		display: block;
		opacity: 0.9;
		/* Engraved / sunk into the phosphor wash */
		filter:
			drop-shadow(0 1px 0 rgba(255, 138, 66, 0.22))
			drop-shadow(0 -0.75px 0 rgba(0, 0, 0, 0.78));
		pointer-events: none;
	}

	.syv-send:hover .syv-send__enter,
	.syv-send:focus-visible .syv-send__enter {
		opacity: 0.95;
	}

	.syv-send:active .syv-send__enter {
		opacity: 1;
		transform: translateY(0.5px);
	}

	.syv-send:hover,
	.syv-send:focus,
	.syv-send:focus-visible,
	.syv-send:active {
		outline: none;
		border: 0;
		background: transparent;
		box-shadow: none;
		color: var(--orange-500);
	}

	@keyframes syv-send-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.syv-send {
			animation: none;
		}
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
		--syv-send-wash: transparent;
		background-image:
			linear-gradient(var(--syv-input-ribbon-color), var(--syv-input-ribbon-color)),
			repeating-linear-gradient(90deg, transparent 0 calc(1ch - 1.5px), var(--syv-input-cell-grid-color) calc(1ch - 1.5px) 1ch),
			linear-gradient(
				to left,
				var(--syv-send-wash) 0%,
				var(--syv-send-wash) 5%,
				color-mix(in srgb, var(--syv-send-wash) 55%, transparent) 14%,
				transparent 26%
			);
		background-repeat: no-repeat, repeat-x, no-repeat;
		background-size: calc(100% - 42px) 1.5px, 1ch 100%, 100% 100%;
		background-position: 21px calc(100% - 12px), 21px 0, 0 0;
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

	.syv-input--room-for-send {
		padding-right: 2.75rem;
		/* Same hue as franjas, a bit brighter so the wash reads as ready-to-send. */
		--syv-send-wash: rgba(255, 106, 26, 0.2);
	}

	.syv-field__control:has(.syv-send:hover) .syv-input--room-for-send,
	.syv-field__control:has(.syv-send:focus-visible) .syv-input--room-for-send {
		--syv-send-wash: rgba(255, 106, 26, 0.26);
		background-image:
			linear-gradient(var(--syv-input-ribbon-color), var(--syv-input-ribbon-color)),
			repeating-linear-gradient(90deg, transparent 0 calc(1ch - 1.5px), var(--syv-input-cell-grid-color) calc(1ch - 1.5px) 1ch),
			linear-gradient(
				to left,
				var(--syv-send-wash) 0%,
				var(--syv-send-wash) 7%,
				color-mix(in srgb, var(--syv-send-wash) 60%, transparent) 17%,
				transparent 29%
			);
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
