<script>
	/*
	 * LlmRouterChat — presentation only.
	 *
	 * All conversation logic (history, 3s cooldown, routing, RouteResult
	 * interpretation) lives in ../lib/chat/chatSession.ts. This component just
	 * drives session.submit() and renders the lines it publishes.
	 */
	import SyvInput from './SyvInput.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
	import { createChatSession, isSubmittable } from '../lib/chat/chatSession';
	import { getLanguageStore } from '../lib/ui/language';

	let { cvHref = 'https://cv.kodexarg.com' } = $props();

	// The language preference is owned by the shared store (persisted + mirrored
	// onto <html lang>); the session is kept in sync from it.
	const languageStore = getLanguageStore();

	// View state: mirrors of the session snapshot + what is currently typed.
	let history = $state([]);
	let isRouting = $state(false);
	let language = $state(languageStore.language);
	let currentInput = $state('');

	const session = createChatSession({
		language: languageStore.language,
		onChange: (snapshot) => {
			history = snapshot.history;
			isRouting = snapshot.isRouting;
			language = snapshot.language;
		}
	});

	// subscribe() pushes the current value immediately, so this also seeds the
	// session for a visitor whose stored/browser language is not the default.
	$effect(() => languageStore.subscribe((next) => session.setLanguage(next)));

	let placeholder = $derived(language === 'es' ? '¿Sí?' : 'Yes?');

	function commitQuery(query) {
		if (!isSubmittable(query)) return;
		currentInput = '';
		void session.submit(query);
	}
</script>

<div class="chat-container" role="region" aria-label="Consola de chat kodexArg">
	<!-- Top bar with the segmented ES | EN language control -->
	<div class="top-controls">
		<LanguageToggle {language} onSelect={(next) => languageStore.set(next)} />
	</div>

	<!-- Terminal Scrollback Stack -->
	<div class="stack" role="log" aria-live="polite" aria-label="Historial de mensajes">
		{#each history as line, i (i)}
			<div class="line committed {line.role}">
				{#if line.role === 'user'}
					<span class="prompt">› </span>
					<span class="user-text">{line.text}</span>
				{:else if line.kind === 'navigate' && line.destination}
					<div class="navigate-block">
						<span class="bot-text opener-text">{line.opener}</span>
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
								href={line.destination.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								{line.destination.name} ({line.destination.url.replace(/^https?:\/\//, '')})
							</a>
						</span>
						{#if line.abstract}
							<span class="bot-text abstract-text">{line.abstract}</span>
						{/if}
					</div>
				{:else if line.kind === 'confirm' && line.options}
					<div class="confirm-block">
						<span class="bot-text prompt-msg">{line.opener}</span>
						{#if line.destination}
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
									href={line.destination.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									{line.destination.name} ({line.destination.url.replace(/^https?:\/\//, '')})
								</a>
							</span>
						{/if}
						{#if line.abstract}
							<span class="bot-text abstract-text">{line.abstract}</span>
						{/if}
						{#if line.options.length > 1}
							<div class="options-grid">
								{#each line.options as opt}
									<a
										class="opt-card"
										href={opt.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span class="opt-title">› {opt.name}</span>
										<span class="opt-desc">{opt.description}</span>
									</a>
								{/each}
							</div>
						{/if}
						{#if line.closer}
							<span class="bot-text closer-text">{line.closer}</span>
						{/if}
					</div>
				{:else}
					<span class="bot-text">{line.text}</span>
				{/if}
			</div>
		{/each}

		{#if isRouting}
			<div class="line committed system routing">
				<span class="prompt">› </span>
				<span class="routing-text">
					{language === 'es' ? 'evaluando certezas y enrutando...' : 'evaluating certainty & routing...'}
				</span>
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

	.top-controls {
		display: flex;
		justify-content: flex-end;
		width: 100%;
	}

	.stack {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		max-height: calc(100vh - 200px);
		overflow-y: auto;
		gap: 0.75rem;
		padding-right: 0.5rem;
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

	.routing-text {
		color: var(--orange-300);
		animation: pulse 1s infinite alternate;
	}

	.navigate-block {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		width: 100%;
	}

	.opener-text {
		font-weight: 500;
	}

	.abstract-text {
		font-size: 0.8rem;
		color: var(--warm-400);
	}

	.link-container {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

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
	}

	.who:hover,
	.who:focus-visible {
		color: var(--orange-300);
		border-bottom-style: solid;
		outline: none;
	}

	.confirm-block {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		background: rgba(255, 106, 26, 0.04);
		border: 1px dashed rgba(255, 106, 26, 0.25);
		border-radius: 6px;
		padding: 0.75rem;
	}

	.prompt-msg {
		font-weight: 500;
		color: var(--cream-100);
	}

	.closer-text {
		font-size: 0.8rem;
		font-style: italic;
		color: var(--warm-400);
	}

	.options-grid {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.opt-card {
		display: flex;
		flex-direction: column;
		padding: 6px 10px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
		text-decoration: none;
		border-left: 2px solid var(--orange-500);
		transition: background 0.2s ease, transform 0.2s ease;
	}

	.opt-card:hover {
		background: rgba(255, 106, 26, 0.15);
		transform: translateX(3px);
	}

	.opt-title {
		color: var(--orange-400);
		font-size: 0.84rem;
		font-weight: 600;
	}

	.opt-desc {
		color: var(--warm-400);
		font-size: 0.76rem;
		margin-top: 2px;
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
