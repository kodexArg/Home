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
	import { OPENING_SUGGESTION } from '../lib/kodexbar/suggestions';

	// The language preference is owned by the shared store (persisted + mirrored
	// onto <html lang>); the session is kept in sync from it.
	const languageStore = getLanguageStore();

	// View state: mirrors of the session snapshot + what is currently typed.
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

	// subscribe() pushes the current value immediately, so this also seeds the
	// session for a visitor whose stored/browser language is not the default.
	$effect(() => languageStore.subscribe((next) => session.setLanguage(next)));

	// The question TAB will type in. Before the first exchange there is no context
	// to reason from, so it is the fixed opener; afterwards it is whatever the
	// answer proposed, which is authored text resolved server-side from an id.
	let proposal = $derived(history.length === 0 ? OPENING_SUGGESTION[language] : suggestion);

	// With no proposal the field returns to the original neutral prompt.
	let placeholder = $derived(proposal || (language === 'es' ? '¿Sí?' : 'Yes?'));

	// TAB is invisible, so it needs saying — but only while it would do something.
	// The moment anything is typed the proposal is unreachable, so the line goes
	// with it: it fades in, and disappears without a transition.
	let showTabHint = $derived(Boolean(proposal) && currentInput.trim() === '');
	let tabHintLabel = $derived(language === 'es' ? 'TAB para completar' : 'TAB to complete');

	let thinkingLabel = $derived(language === 'es' ? 'pensando...' : 'thinking...');

	// The typewriter is a first-impression effect, not a per-message one: only
	// the opening answer types itself out. Replaying it on every reply turns a
	// flourish into a delay the visitor has to sit through.
	let firstAnswerIndex = $derived(history.findIndex((l) => l.kind === 'answer'));

	// Links must never appear before the sentence they belong to. The typed
	// line therefore withholds its chips until Typewriter says it is finished;
	// every other line has nothing to wait for.
	let typedLineDone = $state(false);

	function linksVisible(index) {
		return index !== firstAnswerIndex || typedLineDone;
	}

	// The language control is a pre-conversation affordance. Once the visitor
	// has asked something they have already chosen, so it gets out of the way.
	let showLanguageToggle = $derived(history.length === 0);

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
								<Typewriter text={line.text} ondone={() => (typedLineDone = true)} />
							{:else}
								{line.text}
							{/if}
						</span>
						{#if line.links.length > 0 && linksVisible(i)}
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

	<!-- Sits between the log and the input, and only before the first query. -->
	{#if showLanguageToggle}
		<div class="bottom-controls">
			<LanguageToggle {language} onSelect={(next) => languageStore.set(next)} />
		</div>
	{/if}

	<!-- Pip-Boy SyV Input Bar -->
	<div class="input-bar-wrapper">
		{#if showTabHint}
			<span class="tab-hint">{tabHintLabel}</span>
		{/if}
		<SyvInput
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

		/* A FIXED height, not max-height. The mask below is expressed in
		   percentages, so the box it applies to has to be a stable slice of the
		   viewport — otherwise a two-turn conversation shrinks the box and the
		   gradient lands on lines that are still near the bottom of the page.
		   With justify-content:flex-end the content hugs the input regardless. */
		height: calc(100vh - 180px);
		overflow-y: auto;

		/* Old turns dissolve on the way up. Fully legible across the bottom
		   half; fades from the midpoint and gone by the top quarter. */
		-webkit-mask-image: linear-gradient(to top, #000 0%, #000 50%, transparent 75%);
		mask-image: linear-gradient(to top, #000 0%, #000 50%, transparent 75%);

		/* A visible track fights the dissolve. */
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

	/* Sits above the field, at the edge of legibility. It is a whisper about a
	   key, not a label — it should be findable when looked for and unnoticed
	   otherwise. Fades in only; removal is instant, because the affordance it
	   describes is already gone by then. */
	.tab-hint {
		display: block;
		font-family: var(--font-mono);
		font-size: 9.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--warm-400);
		opacity: 0.28;
		padding-left: 0.8125rem;
		margin-bottom: 0.3rem;
		user-select: none;
		pointer-events: none;
		animation: hint-in 1.4s var(--ease-candle, ease-out) both;
	}

	@keyframes hint-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.28;
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
			bottom: 1rem;
		}
	}
</style>
