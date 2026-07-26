import type { KodexAnswer, LinkDestination } from '../kodexbar/types';
import { DEFAULT_LANGUAGE, type SupportedLanguage } from '../ui/language';

/**
 * Headless chat session — owns the conversation state and the submit flow.
 *
 * No framework and no DOM code: plain TypeScript, unit-testable without Svelte
 * and without a browser. The Svelte component is a pure presentation layer that
 * drives `submit()` and renders `snapshot()`.
 *
 * adr-09 note: an `AnswerLine` only ever carries `links` taken verbatim from a
 * `KodexAnswer`, whose entries the server resolved against the destination
 * allowlist. `text` is server-scrubbed plain text and MUST be rendered as text,
 * never as HTML or Markdown.
 */

export type ChatLanguage = SupportedLanguage;

export interface UserLine {
	role: 'user';
	text: string;
}

/** Client-side notices: cooldown, transport failure. Never model output. */
export interface StatusLine {
	role: 'assistant';
	kind: 'status';
	text: string;
}

/** A reply from KodexBar: one paragraph, plus zero or more allowlisted links. */
export interface AnswerLine {
	role: 'assistant';
	kind: 'answer';
	text: string;
	links: LinkDestination[];
	/** False when the retrieval gate declined the query. */
	matched: boolean;
}

export type ChatLine = UserLine | StatusLine | AnswerLine;

/** Minimal port of the backend the session depends on. Injected in tests. */
export interface KodexBarPort {
	ask(query: string, language: ChatLanguage): Promise<KodexAnswer>;
}

export type SubmitOutcome = 'ignored' | 'cooldown' | 'answered';

export interface ChatSessionSnapshot {
	history: ChatLine[];
	isThinking: boolean;
	language: ChatLanguage;
	/** Milliseconds left on the cooldown gate; 0 when a submit is accepted. */
	cooldownRemainingMs: number;
	/**
	 * Follow-up question to propose in the input placeholder, or '' when there
	 * is nothing fresh to suggest. Always authored text from the server's
	 * registry — safe to render, and safe to type into the field on TAB.
	 */
	suggestion: string;
}

export interface ChatSessionOptions {
	/** Backend used to answer queries. Defaults to POSTing /api/ask. */
	backend?: KodexBarPort;
	/** Clock source. Injected so the cooldown is testable without waiting. */
	now?: () => number;
	/** Delay function used for the cosmetic pause. Injected for tests. */
	delay?: (ms: number) => Promise<void>;
	cooldownMs?: number;
	responseDelayMs?: number;
	language?: ChatLanguage;
	onChange?: (snapshot: ChatSessionSnapshot) => void;
	onError?: (error: unknown) => void;
}

const COPY = {
	es: {
		cooldown: (seconds: number) => `Esperá ${seconds}s antes de enviar otra consulta.`,
		failure: 'No pude conectarme. Probá de nuevo en un momento.'
	},
	en: {
		cooldown: (seconds: number) => `Wait ${seconds}s before sending another query.`,
		failure: "I couldn't connect. Please try again in a moment."
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

/**
 * Default backend: POST /api/ask.
 *
 * A non-OK response still carries a well-formed `KodexAnswer` body — the
 * endpoint guarantees that on every path — so 429 and 4xx render as ordinary
 * assistant lines rather than as errors. Only a transport failure or an
 * unparseable body throws.
 */
const defaultBackend: KodexBarPort = {
	async ask(query, language) {
		const response = await fetch('/api/ask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, language })
		});

		const data = (await response.json()) as KodexAnswer;
		if (typeof data?.text !== 'string') {
			throw new Error('Malformed response from /api/ask');
		}

		return {
			text: data.text,
			links: Array.isArray(data.links) ? data.links : [],
			language: data.language ?? language,
			matched: Boolean(data.matched),
			score: data.score,
			suggestion: typeof data.suggestion === 'string' ? data.suggestion : undefined
		};
	}
};

export class ChatSession {
	private readonly backend: KodexBarPort;
	private readonly now: () => number;
	private readonly delay: (ms: number) => Promise<void>;
	private readonly cooldownMs: number;
	private readonly responseDelayMs: number;
	private readonly onChange?: (snapshot: ChatSessionSnapshot) => void;
	private readonly onError: (error: unknown) => void;

	private lines: ChatLine[] = [];
	private thinking = false;
	private lang: ChatLanguage;
	private lastAcceptedAt = 0;
	private currentSuggestion = '';
	/**
	 * Suggestions already put in front of this visitor.
	 *
	 * The server is stateless, so it cannot know what it has proposed before and
	 * will happily return the same follow-up twice. Repeating a placeholder the
	 * visitor has already seen (or already asked) reads as the thing being
	 * broken, so a repeat is dropped rather than shown again.
	 */
	private readonly offeredSuggestions = new Set<string>();

	constructor(options: ChatSessionOptions = {}) {
		this.backend = options.backend ?? defaultBackend;
		this.now = options.now ?? Date.now;
		this.delay = options.delay ?? defaultDelay;
		this.cooldownMs = options.cooldownMs ?? DEFAULT_COOLDOWN_MS;
		this.responseDelayMs = options.responseDelayMs ?? DEFAULT_RESPONSE_DELAY_MS;
		this.lang = options.language ?? DEFAULT_LANGUAGE;
		this.onChange = options.onChange;
		this.onError = options.onError ?? ((error) => console.error('KodexBar error:', error));
	}

	get history(): readonly ChatLine[] {
		return this.lines;
	}

	get isThinking(): boolean {
		return this.thinking;
	}

	get language(): ChatLanguage {
		return this.lang;
	}

	cooldownRemainingMs(): number {
		const elapsed = this.now() - this.lastAcceptedAt;
		return elapsed < this.cooldownMs ? this.cooldownMs - elapsed : 0;
	}

	snapshot(): ChatSessionSnapshot {
		return {
			history: [...this.lines],
			isThinking: this.thinking,
			language: this.lang,
			cooldownRemainingMs: this.cooldownRemainingMs(),
			suggestion: this.currentSuggestion
		};
	}

	/**
	 * Take the server's follow-up if it is worth showing.
	 *
	 * Clears the current suggestion whenever there is nothing fresh, so the view
	 * falls back to its resting placeholder instead of holding a stale question.
	 */
	private adoptSuggestion(suggestion: string | undefined): void {
		const next = suggestion?.trim() ?? '';
		if (!next || this.offeredSuggestions.has(next)) {
			this.currentSuggestion = '';
			return;
		}
		this.offeredSuggestions.add(next);
		this.currentSuggestion = next;
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
		this.setThinking(true);

		try {
			const answer = await this.backend.ask(trimmed, this.lang);
			await this.delay(this.responseDelayMs);
			this.adoptSuggestion(answer.suggestion);
			this.append({
				role: 'assistant',
				kind: 'answer',
				text: answer.text,
				links: answer.links,
				matched: answer.matched
			});
		} catch (error) {
			this.onError(error);
			this.append({ role: 'assistant', kind: 'status', text: COPY[this.lang].failure });
		} finally {
			this.setThinking(false);
		}

		return 'answered';
	}

	private append(...lines: ChatLine[]): void {
		this.lines = [...this.lines, ...lines];
		this.emit();
	}

	private setThinking(value: boolean): void {
		this.thinking = value;
		this.emit();
	}

	private emit(): void {
		this.onChange?.(this.snapshot());
	}
}

export function createChatSession(options: ChatSessionOptions = {}): ChatSession {
	return new ChatSession(options);
}
