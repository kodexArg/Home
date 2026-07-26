<script>
	/*
	 * KodexBar — presentation only.
	 *
	 * All conversation logic (history, cooldown, backend call, answer shape)
	 * lives in ../lib/chat/chatSession.ts. This component drives session.submit()
	 * and renders the lines it publishes.
	 *
	 * adr-09: `line.text` is server-scrubbed plain text and is rendered as text,
	 * never with {@html}. Every href comes from `line.links`, whose entries the
	 * server resolved against the destination allowlist — the model emits ids,
	 * never URLs.
	 */
	import SyvInput from './SyvInput.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
	import Typewriter from './Typewriter.svelte';
	import { createChatSession, isSubmittable } from '../lib/chat/chatSession';
	import { getLanguageStore } from '../lib/ui/language';

	// The language preference is owned by the shared store (persisted + mirrored
	// onto <html lang>); the session is kept in sync from it.
	const languageStore = getLanguageStore();

	// View state: mirrors of the session snapshot + what is currently typed.
	let history = $state([]);
	let isThinking = $state(false);
	let language = $state(languageStore.language);
	let currentInput = $state('');

	const session = createChatSession({
		language: languageStore.language,
		onChange: (snapshot) => {
			history = snapshot.history;
			isThinking = snapshot.isThinking;
			language = snapshot.language;
		}
	});

	// subscribe() pushes the current value immediately, so this also seeds the
	// session for a visitor whose stored/browser language is not the default.
	$effect(() => languageStore.subscribe((next) => session.setLanguage(next)));

	let placeholder = $derived(language === 'es' ? '¿Sí?' : 'Yes?');
	let thinkingLabel = $derived(language === 'es' ? 'pensando...' : 'thinking...');

	// The typewriter is a first-impression effect, not a per-message one: only
	// the opening answer types itself out. Replaying it on every reply turns a
	// flourish into a delay the visitor has to sit through.
	let firstAnswerIndex = $derived(history.findIndex((l) => l.kind === 'answer'));

	function commitQuery(query) {
		if (!isSubmittable(query)) return;
		currentInput = '';
		void session.submit(query);
	}

	function hostOf(url) {
		// mailto: and other non-http schemes have no host worth showing.
		return url.startsWith('http') ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : url;
	}
</script>

<!-- The language control is pinned to the viewport, not stacked above the log.
     Inside the column it rode on top of the scrollback and was pushed off the
     top of the screen as soon as the conversation grew past a couple of turns. -->
<div class="top-controls">
	<LanguageToggle {language} onSelect={(next) => languageStore.set(next)} />
</div>

<div class="chat-container" role="region" aria-label="KodexBar">
	<!-- Terminal Scrollback Stack -->
	<div class="stack" role="log" aria-live="polite" aria-label="Historial de mensajes">
		{#each history as line, i (i)}
			<div class="line committed {line.role}">
				{#if line.role === 'user'}
					<span class="prompt">› </span>
					<span class="user-text">{line.text}</span>
				{:else if line.kind === 'answer'}
					<div class="answer-block">
						<span class="bot-text">
							{#if i === firstAnswerIndex}
								<Typewriter text={line.text} />
							{:else}
								{line.text}
							{/if}
						</span>
						{#if line.links.length > 0}
							<div class="links">
								{#each line.links as link (link.id)}
									<span class="link-container">
										<span class="link-icon" aria-hidden="true">
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
											target={link.kind === 'contact' && link.url.startsWith('mailto:') ? undefined : '_blank'}
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

	<!-- Pip-Boy SyV Input Bar -->
	<div class="input-bar-wrapper">
		<SyvInput
			label={undefined}
			{placeholder}
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
		bottom: 1.5rem;
		right: 1.5rem;
		max-width: 720px;
		margin: 0 auto;
		z-index: 2;
		font-family: var(--font-mono);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Pinned to the viewport so it survives a long conversation. */
	.top-controls {
		position: fixed;
		top: 1.4rem;
		right: 1.8rem;
		z-index: 4;
		display: flex;
		justify-content: flex-end;
	}

	.stack {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		max-height: calc(100vh - 180px);
		overflow-y: auto;
		gap: 0.75rem;
		padding-right: 0.5rem;

		/* Old turns dissolve upward instead of piling up. The newest exchange —
		   the only one that matters — stays fully legible at the bottom; anything
		   past the midpoint fades out and is gone by the top of the log. */
		-webkit-mask-image: linear-gradient(
			to top,
			#000 0%,
			#000 48%,
			rgba(0, 0, 0, 0.45) 72%,
			rgba(0, 0, 0, 0.12) 88%,
			transparent 100%
		);
		mask-image: linear-gradient(
			to top,
			#000 0%,
			#000 48%,
			rgba(0, 0, 0, 0.45) 72%,
			rgba(0, 0, 0, 0.12) 88%,
			transparent 100%
		);

		/* The mask hides the scrollbar's usefulness anyway, and a visible track
		   fights the dissolve. */
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

	/* Each query opens a new exchange, so it carries the breathing room that
	   separates one turn from the previous answer. The first line needs none. */
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

	/* One paragraph, then its citations. Never a card grid. */
	.answer-block {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
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

	/* Icon sits outside the <a> and is inert — adr-09 §6 (click-jacking). */
	.link-icon {
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
			bottom: 1rem;
		}
	}
</style>
