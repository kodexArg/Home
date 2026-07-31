<script>
	import SyvInput from './SyvInput.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
	import Typewriter from './Typewriter.svelte';
	import { createChatSession, isSubmittable } from '../lib/chat/chatSession';
	import { getLanguageStore } from '../lib/ui/language';
	import { OPENING_SUGGESTION } from '../lib/kodexbar/suggestions';

	const languageStore = getLanguageStore();

	let history = $state([]);
	let isThinking = $state(false);
	let language = $state(languageStore.language);
	let currentInput = $state('');
	let suggestion = $state('');

	const session = createChatSession({
		language: languageStore.language,
		onChange: (snapshot) => {
			history = snapshot.history;
			isThinking = snapshot.isThinking;
			language = snapshot.language;
			suggestion = snapshot.suggestion;
		}
	});

	$effect(() => languageStore.subscribe((next) => session.setLanguage(next)));

	function deriveTabProposal(conversationHistory, activeLanguage, latestSuggestion) {
		return conversationHistory.length === 0 ? OPENING_SUGGESTION[activeLanguage] : latestSuggestion;
	}

	function deriveRestingPlaceholder(activeLanguage) {
		return activeLanguage === 'es' ? '¿Sí?' : 'Yes?';
	}

	let proposal = $derived(deriveTabProposal(history, language, suggestion));

	let placeholder = $derived(proposal || deriveRestingPlaceholder(language));

	let showTabHint = $derived(Boolean(proposal) && currentInput.trim() === '');

	function hintLabelFor(activeLanguage) {
		return activeLanguage === 'es' ? 'TAB o CLICK' : 'TAB or CLICK';
	}

	let tabHintLabel = $derived(hintLabelFor(language));

	let inputRef;

	let thinkingLabel = $derived(language === 'es' ? 'pensando...' : 'thinking...');

	let openingAnswerIndex = $derived(history.findIndex((l) => l.kind === 'answer'));

	let openingAnswerTypewriterDone = $state(false);

	function extrasVisibleForLine(index) {
		return index !== openingAnswerIndex || openingAnswerTypewriterDone;
	}

	let showLanguageToggle = $derived(history.length === 0);

	function commitQuery(query) {
		if (!isSubmittable(query)) return;
		currentInput = '';
		void session.submit(query);
	}

	function isHttpUrl(url) {
		return url.startsWith('http');
	}

	function hostOf(url) {
		return isHttpUrl(url) ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : url;
	}

	function isMailtoContactLink(link) {
		return link.kind === 'contact' && link.url.startsWith('mailto:');
	}

	function linkTargetFor(link) {
		return isMailtoContactLink(link) ? undefined : '_blank';
	}
</script>

<div class="chat-container" role="region" aria-label="KodexBar">
	<div class="stack" role="log" aria-live="polite" aria-label="Historial de mensajes">
		{#each history as line, i (i)}
			<div class="line committed {line.role}">
				{#if line.role === 'user'}
					<span class="prompt">› </span>
					<span class="user-text">{line.text}</span>
				{:else if line.kind === 'answer'}
					<div class="answer-block">
						<span class="bot-text">
							{#if i === openingAnswerIndex}
								<Typewriter text={line.text} ondone={() => (openingAnswerTypewriterDone = true)} />
							{:else}
								{line.text}
							{/if}
						</span>
						{#if line.links.length > 0 && extrasVisibleForLine(i)}
							<div class="links">
								{#each line.links as link (link.id)}
									<span class="link-container">
										<span class="link-icon-inert-outside-anchor" aria-hidden="true">
											<svg
												width="13"
												height="13"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2.2"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
												<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
											</svg>
										</span>
										<a
											class="who"
											href={link.url}
											target={linkTargetFor(link)}
											rel="noopener noreferrer"
										>
											{link.name} ({hostOf(link.url)})
										</a>
									</span>
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<span class="bot-text status-text">{line.text}</span>
				{/if}
			</div>
		{/each}

		{#if isThinking}
			<div class="line committed system">
				<span class="prompt">› </span>
				<span class="thinking-text">{thinkingLabel}</span>
			</div>
		{/if}
	</div>

	{#if showLanguageToggle}
		<div class="bottom-controls">
			<LanguageToggle {language} onSelect={(next) => languageStore.set(next)} />
		</div>
	{/if}

	<div class="input-bar-wrapper">
		{#if showTabHint}
			<button
				type="button"
				class="tab-hint"
				onclick={() => inputRef?.acceptSuggestionFromOutside()}
			>
				{tabHintLabel}
			</button>
		{/if}
		<SyvInput
			bind:this={inputRef}
			label={undefined}
			{placeholder}
			acceptOnTab={proposal}
			bind:value={currentInput}
			onCommit={commitQuery}
			autogrow
		/>
	</div>
</div>

<style>
	.chat-container {
		position: absolute;
		left: 1.5rem;
		right: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
		max-width: 720px;
		margin: 0 auto;
		z-index: 2;
		font-family: var(--font-mono);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 0.75rem;
		max-height: calc(100dvh - 3rem);
	}

	.bottom-controls {
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}

	.stack {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		gap: 0.75rem;
		padding-right: 0.5rem;

		--kodexbar-stack-grown-conversation-ceiling: 42dvh;
		max-height: var(--kodexbar-stack-grown-conversation-ceiling);
		min-height: 0;
		overflow-y: auto;

		--kodexbar-scrollback-fade-start: 50%;
		--kodexbar-scrollback-fade-end: 75%;
		-webkit-mask-image: linear-gradient(
			to top,
			#000 0%,
			#000 var(--kodexbar-scrollback-fade-start),
			transparent var(--kodexbar-scrollback-fade-end)
		);
		mask-image: linear-gradient(
			to top,
			#000 0%,
			#000 var(--kodexbar-scrollback-fade-start),
			transparent var(--kodexbar-scrollback-fade-end)
		);

		scrollbar-width: none;
	}

	.stack::-webkit-scrollbar {
		display: none;
	}

	.line {
		line-height: 1.5;
		font-size: 0.88rem;
		white-space: pre-wrap;
		word-break: break-word;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		width: 100%;
	}

	.committed {
		animation: rise var(--t-slow, 0.45s) var(--ease-candle, ease-out) both;
	}

	.user {
		color: var(--cream-100);
	}

	.line.user {
		padding-top: 1.6rem;
	}

	.line.user:first-child {
		padding-top: 0;
	}

	.prompt {
		color: var(--orange-500);
		font-weight: bold;
	}

	.bot-text {
		color: var(--warm-300);
	}

	.system {
		color: var(--ink-600);
		font-size: 0.78rem;
	}

	.status-text {
		color: var(--warm-400);
		font-size: 0.82rem;
	}

	.thinking-text {
		color: var(--orange-300);
		animation: pulse 1s infinite alternate;
	}

	.answer-block {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		width: 100%;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}


	.link-container {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.link-icon-inert-outside-anchor {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--orange-400);
		user-select: none;
		pointer-events: none;
	}

	.who {
		color: var(--cream-100);
		text-decoration: none;
		border-bottom: 1px dashed var(--orange-400);
		transition: color var(--t-slow, 0.2s) var(--ease-candle, ease);
		cursor: pointer;
		user-select: text;
	}

	.who:hover,
	.who:focus-visible {
		color: var(--orange-300);
		border-bottom-style: solid;
		outline: none;
	}

	.input-bar-wrapper {
		width: 100%;
	}

	.tab-hint {
		display: inline-block;
		appearance: none;
		border: 0;
		background: none;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		text-align: left;
		cursor: pointer;
		color: var(--orange-400);
		--kodexbar-tab-hint-whisper-opacity: 0.92;
		opacity: var(--kodexbar-tab-hint-whisper-opacity);
		padding: 0.45rem 1.21875rem 0.35rem;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		animation:
			hint-in 1.4s var(--ease-candle, ease-out) both,
			ember-breath 4.2s ease-in-out 1.4s infinite alternate;
	}

	.tab-hint:hover,
	.tab-hint:focus-visible {
		color: var(--orange-300);
		outline: none;
	}

	.tab-hint:active {
		color: var(--cream-100);
	}

	@keyframes ember-breath {
		from {
			text-shadow: 0 0 9px rgba(255, 138, 66, 0.4);
		}
		to {
			text-shadow: 0 0 0 rgba(255, 138, 66, 0);
		}
	}

	@keyframes hint-in {
		from {
			opacity: 0;
		}
		to {
			opacity: var(--kodexbar-tab-hint-whisper-opacity);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tab-hint {
			animation: none;
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(0.6em);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes pulse {
		from {
			opacity: 0.5;
		}
		to {
			opacity: 1;
		}
	}

	@media (max-width: 600px) {
		.chat-container {
			left: 1rem;
			right: 1rem;
			max-height: calc(100dvh - 2rem);
		}
	}
</style>
