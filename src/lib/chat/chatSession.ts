import { globalAdaptiveRouter } from '../router/adaptiveRouter';
import { presentResult } from '../router/presentResult';
import type { RouteDestination, RouteResult, RouterOptions } from '../router/types';
import { DEFAULT_LANGUAGE, type SupportedLanguage } from '../ui/language';

/**
 * Headless chat session — owns the conversation state and the submit flow.
 *
 * This module contains NO framework and NO DOM code: it is plain TypeScript so
 * it can be unit-tested without Svelte and without a browser. The Svelte
 * component is a pure presentation layer that drives `submit()` and renders
 * `snapshot()`.
 *
 * adr-09 note: line objects only ever carry a `destination`/`options` taken
 * verbatim from a `RouteResult`, so a rendered URL can only ever originate
 * from a `RouteDestination.url`. Prose comes from `presentResult()` (fixed
 * copy) or from the fixed copy table below — never from user input.
 */

/** Alias of the shared UI language type so the two can never drift apart. */
export type ChatLanguage = SupportedLanguage;

export interface UserLine {
	role: 'user';
	text: string;
}

export interface StatusLine {
	role: 'assistant';
	kind: 'status';
	text: string;
}

export interface NavigateLine {
	role: 'assistant';
	kind: 'navigate';
	opener: string;
	abstract?: string;
	destination: RouteDestination;
	score?: number;
	strategyName: string;
}

export interface ConfirmLine {
	role: 'assistant';
	kind: 'confirm';
	opener: string;
	abstract?: string;
	closer?: string;
	destination?: RouteDestination;
	options: RouteDestination[];
	score?: number;
	strategyName: string;
}

export type ChatLine = UserLine | StatusLine | NavigateLine | ConfirmLine;

/** Minimal port of the router the session depends on. */
export interface ChatRouterPort {
	route(query: string, options?: RouterOptions): Promise<RouteResult>;
}

export type SubmitOutcome = 'ignored' | 'cooldown' | 'routed';

export interface ChatSessionSnapshot {
	history: ChatLine[];
	isRouting: boolean;
	language: ChatLanguage;
	/** Milliseconds left on the cooldown gate; 0 when a submit is accepted. */
	cooldownRemainingMs: number;
}

export interface ChatSessionOptions {
	/** Router used to resolve queries. Defaults to the global adaptive router. */
	router?: ChatRouterPort;
	/** Clock source. Injected so the cooldown is testable without waiting. */
	now?: () => number;
	/** Delay function used for the cosmetic routing pause. Injected for tests. */
	delay?: (ms: number) => Promise<void>;
	/** Cooldown window between accepted submits. */
	cooldownMs?: number;
	/** Cosmetic "typing" pause applied after the router answers. */
	responseDelayMs?: number;
	/** Initial language. */
	language?: ChatLanguage;
	/** Called after every state mutation with a fresh snapshot. */
	onChange?: (snapshot: ChatSessionSnapshot) => void;
	/** Error sink, defaults to console.error. */
	onError?: (error: unknown) => void;
}

const COPY = {
	es: {
		cooldown: (seconds: number) =>
			`⏱️ Por favor espera ${seconds}s antes de enviar otra consulta (cooldown de 3s).`,
		failure: 'Ocurrió un error procesando la consulta. Intente nuevamente.'
	},
	en: {
		cooldown: (seconds: number) =>
			`⏱️ Please wait ${seconds}s before sending another query (3s cooldown).`,
		failure: 'An error occurred while processing your request. Please try again.'
	}
} as const;

export const DEFAULT_COOLDOWN_MS = 3000;
export const DEFAULT_RESPONSE_DELAY_MS = 200;

/**
 * True when a query is worth sending. Exposed so the view can decide whether
 * to clear its input box without re-implementing the rule.
 */
export function isSubmittable(query: string): boolean {
	return query.trim().length > 0;
}

const defaultDelay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export class ChatSession {
	private readonly router: ChatRouterPort;
	private readonly now: () => number;
	private readonly delay: (ms: number) => Promise<void>;
	private readonly cooldownMs: number;
	private readonly responseDelayMs: number;
	private readonly onChange?: (snapshot: ChatSessionSnapshot) => void;
	private readonly onError: (error: unknown) => void;

	private lines: ChatLine[] = [];
	private routing = false;
	private lang: ChatLanguage;
	private lastAcceptedAt = 0;

	constructor(options: ChatSessionOptions = {}) {
		this.router = options.router ?? globalAdaptiveRouter;
		this.now = options.now ?? Date.now;
		this.delay = options.delay ?? defaultDelay;
		this.cooldownMs = options.cooldownMs ?? DEFAULT_COOLDOWN_MS;
		this.responseDelayMs = options.responseDelayMs ?? DEFAULT_RESPONSE_DELAY_MS;
		this.lang = options.language ?? DEFAULT_LANGUAGE;
		this.onChange = options.onChange;
		this.onError = options.onError ?? ((error) => console.error('Routing error:', error));
	}

	get history(): readonly ChatLine[] {
		return this.lines;
	}

	get isRouting(): boolean {
		return this.routing;
	}

	get language(): ChatLanguage {
		return this.lang;
	}

	/** Milliseconds still to wait before a submit would be accepted. */
	cooldownRemainingMs(): number {
		const elapsed = this.now() - this.lastAcceptedAt;
		return elapsed < this.cooldownMs ? this.cooldownMs - elapsed : 0;
	}

	snapshot(): ChatSessionSnapshot {
		return {
			history: [...this.lines],
			isRouting: this.routing,
			language: this.lang,
			cooldownRemainingMs: this.cooldownRemainingMs()
		};
	}

	setLanguage(language: ChatLanguage): void {
		if (this.lang === language) return;
		this.lang = language;
		this.emit();
	}

	toggleLanguage(): ChatLanguage {
		this.setLanguage(this.lang === 'es' ? 'en' : 'es');
		return this.lang;
	}

	async submit(query: string): Promise<SubmitOutcome> {
		const trimmed = query.trim();
		if (!trimmed) return 'ignored';

		const remaining = this.cooldownRemainingMs();
		if (remaining > 0) {
			const remainingSec = Math.ceil(remaining / 1000);
			this.append(
				{ role: 'user', text: trimmed },
				{ role: 'assistant', kind: 'status', text: COPY[this.lang].cooldown(remainingSec) }
			);
			return 'cooldown';
		}

		this.lastAcceptedAt = this.now();
		this.append({ role: 'user', text: trimmed });
		this.setRouting(true);

		try {
			const result = await this.router.route(trimmed, { language: this.lang });

			// Cosmetic typing/routing pause.
			await this.delay(this.responseDelayMs);

			this.append(...this.linesFor(result));
		} catch (error) {
			this.onError(error);
			this.append({ role: 'assistant', kind: 'status', text: COPY[this.lang].failure });
		} finally {
			this.setRouting(false);
		}

		return 'routed';
	}

	/** Maps a RouteResult onto the renderable lines. Formatting stays in presentResult(). */
	private linesFor(result: RouteResult): ChatLine[] {
		const presented = presentResult(result);

		if (result.outcome === 'Action' && result.action?.kind === 'navigate' && result.destination) {
			return [
				{
					role: 'assistant',
					kind: 'navigate',
					opener: presented.opener,
					abstract: presented.description,
					destination: result.destination,
					score: result.score,
					strategyName: result.strategyName
				}
			];
		}

		if (result.outcome === 'Confirm' || result.action?.kind === 'confirm') {
			const optionsList = result.options || (result.destination ? [result.destination] : []);
			return [
				{
					role: 'assistant',
					kind: 'confirm',
					opener: presented.opener,
					abstract: presented.description,
					closer: presented.closer,
					destination: result.destination || optionsList[0],
					options: optionsList,
					score: result.score,
					strategyName: result.strategyName
				}
			];
		}

		return [{ role: 'assistant', kind: 'status', text: presented.opener }];
	}

	private append(...lines: ChatLine[]): void {
		this.lines = [...this.lines, ...lines];
		this.emit();
	}

	private setRouting(value: boolean): void {
		this.routing = value;
		this.emit();
	}

	private emit(): void {
		this.onChange?.(this.snapshot());
	}
}

export function createChatSession(options: ChatSessionOptions = {}): ChatSession {
	return new ChatSession(options);
}
