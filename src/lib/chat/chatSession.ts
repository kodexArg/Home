import type { KodexAnswer, LinkDestination } from '../kodexbar/types';
import { DEFAULT_LANGUAGE, type SupportedLanguage } from '../ui/language';

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

export interface AnswerLine {
	role: 'assistant';
	kind: 'answer';
	text: string;
	links: LinkDestination[];
	matched: boolean;
}

export type ChatLine = UserLine | StatusLine | AnswerLine;

export interface KodexBarPort {
	ask(query: string, language: ChatLanguage): Promise<KodexAnswer>;
}

export type SubmitOutcome = 'ignored' | 'cooldown' | 'answered';

export interface ChatSessionSnapshot {
	history: ChatLine[];
	isThinking: boolean;
	language: ChatLanguage;
	cooldownRemainingMs: number;
	suggestion: string;
}

export interface ChatSessionOptions {
	backend?: KodexBarPort;
	now?: () => number;
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

export function isSubmittable(query: string): boolean {
	return query.trim().length > 0;
}

const defaultDelay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function randomConversationId(): string {
	return `c${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

const TAB_SCOPED_CONVERSATION_ID = ((): string => {
	const uuid = globalThis.crypto?.randomUUID?.();
	return uuid ?? randomConversationId();
})();

const defaultBackend: KodexBarPort = {
	async ask(query, language) {
		const response = await fetch('/api/ask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, language, conversation: TAB_SCOPED_CONVERSATION_ID })
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
			suggestion: typeof data.suggestion === 'string' ? data.suggestion : undefined,
			offer: Boolean(data.offer)
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
	private readonly suggestionsAlreadyShownToVisitor = new Set<string>();

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

	private adoptSuggestionIfFreshAndUnseen(suggestion: string | undefined): void {
		const next = suggestion?.trim() ?? '';
		if (!next || this.suggestionsAlreadyShownToVisitor.has(next)) {
			this.currentSuggestion = '';
			return;
		}
		this.suggestionsAlreadyShownToVisitor.add(next);
		this.currentSuggestion = next;
	}

	private adoptLinkRequestWithoutRecordingIt(request: string | undefined): void {
		this.currentSuggestion = request?.trim() ?? '';
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

			if (answer.offer) {
				this.adoptLinkRequestWithoutRecordingIt(answer.suggestion);
			} else {
				this.adoptSuggestionIfFreshAndUnseen(answer.suggestion);
			}

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
