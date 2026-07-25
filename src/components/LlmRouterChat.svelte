<script>
	import SyvInput from './SyvInput.svelte';
	import { globalAdaptiveRouter } from '../lib/router/adaptiveRouter';
	import { presentResult } from '../lib/router/presentResult';

	let { cvHref = 'https://cv.kodexarg.com' } = $props();

	// Chat state
	let history = $state([]);
	let currentInput = $state('');
	let isRouting = $state(false);

	// Language flag: 'es' (default) | 'en' (Global mode)
	let language = $state('es');
	let placeholder = $derived(language === 'es' ? '¿Sí?' : 'Yes?');

	function toggleLanguage() {
		language = language === 'es' ? 'en' : 'es';
	}

	let lastQueryTimestamp = $state(0);

	async function commitQuery(query) {
		const trimmed = query.trim();
		if (!trimmed) return;

		// 3-second cooldown check
		const now = Date.now();
		const elapsed = now - lastQueryTimestamp;
		if (elapsed < 3000) {
			const remainingSec = Math.ceil((3000 - elapsed) / 1000);
			history = [
				...history,
				{ role: 'user', text: trimmed },
				{
					role: 'assistant',
					kind: 'status',
					text: language === 'es'
						? `⏱️ Por favor espera ${remainingSec}s antes de enviar otra consulta (cooldown de 3s).`
						: `⏱️ Please wait ${remainingSec}s before sending another query (3s cooldown).`
				}
			];
			currentInput = '';
			return;
		}

		lastQueryTimestamp = Date.now();

		// 1. Add user message
		history = [...history, { role: 'user', text: trimmed }];
		currentInput = '';
		isRouting = true;

		try {
			// 2. Perform closed-action router execution with active language
			const routeResult = await globalAdaptiveRouter.route(trimmed, { language });

			// Simulated typing/routing delay
			await new Promise((res) => setTimeout(res, 200));

			if (routeResult.outcome === 'Action' && routeResult.action?.kind === 'navigate' && routeResult.destination) {
				const presented = presentResult(routeResult);

				history = [
					...history,
					{
						role: 'assistant',
						kind: 'navigate',
						opener: presented.opener,
						abstract: presented.description,
						destination: routeResult.destination,
						score: routeResult.score,
						strategyName: routeResult.strategyName
					}
				];
			} else if (routeResult.outcome === 'Confirm' || routeResult.action?.kind === 'confirm') {
				const presented = presentResult(routeResult);

				const optionsList = routeResult.options || (routeResult.destination ? [routeResult.destination] : []);

				history = [
					...history,
					{
						role: 'assistant',
						kind: 'confirm',
						opener: presented.opener,
						abstract: presented.description,
						closer: presented.closer,
						destination: routeResult.destination || optionsList[0],
						options: optionsList,
						score: routeResult.score,
						strategyName: routeResult.strategyName
					}
				];
			} else {
				const presented = presentResult(routeResult);

				history = [
					...history,
					{
						role: 'assistant',
						kind: 'status',
						text: presented.opener
					}
				];
			}
		} catch (e) {
			console.error('Routing error:', e);
			history = [
				...history,
				{
					role: 'assistant',
					kind: 'status',
					text: language === 'es'
						? 'Ocurrió un error procesando la consulta. Intente nuevamente.'
						: 'An error occurred while processing your request. Please try again.'
				}
			];
		} finally {
			isRouting = false;
		}
	}
</script>

<div class="chat-container" role="region" aria-label="Consola de chat kodexArg">
	<!-- Top Bar with Language Flag Toggle -->
	<div class="top-controls">
		<button
			type="button"
			class="lang-btn"
			onclick={toggleLanguage}
			title="Cambiar idioma (Español / English)"
		>
			<span class="lang-icon">🌐</span>
			<span class="lang-text">{language === 'es' ? 'ES (¿Sí?)' : 'EN (Yes?)'}</span>
		</button>
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

	.lang-btn {
		background: rgba(18, 16, 12, 0.75);
		border: 1px solid var(--ink-600);
		color: var(--warm-300);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		padding: 4px 10px;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 6px;
		transition: all 0.2s ease;
	}

	.lang-btn:hover {
		border-color: var(--orange-500);
		color: var(--orange-300);
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
