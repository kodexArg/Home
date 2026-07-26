/**
 * Language preference — headless, persisted, document-synced.
 *
 * Single source of truth for the UI language: which one is active, how it is
 * discovered on a first visit (stored choice → browser preference → default),
 * how it is persisted, and how it is mirrored onto `<html lang>`.
 *
 * Every environment dependency (localStorage, navigator, document) is injected
 * with a safe fallback, so this module has NO hard DOM access and is unit
 * testable without a browser. Svelte components subscribe and only render.
 */

export type SupportedLanguage = 'es' | 'en';

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['es', 'en'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'es';
export const LANGUAGE_STORAGE_KEY = 'kodexarg:language';

/** Short code shown in the segmented control + the language's own endonym. */
export const LANGUAGE_LABELS: Record<SupportedLanguage, { code: string; name: string }> = {
	es: { code: 'ES', name: 'Español' },
	en: { code: 'EN', name: 'English' }
};

/** Accessible name of the whole control, in the currently active language. */
export const LANGUAGE_GROUP_LABEL: Record<SupportedLanguage, string> = {
	es: 'Idioma de la consola',
	en: 'Console language'
};

/** The slice of the Storage API this module needs. */
export interface LanguageStorage {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

export interface LanguageStoreOptions {
	/** Persistence sink. Pass null to disable persistence. Defaults to localStorage when available. */
	storage?: LanguageStorage | null;
	/** BCP-47 tags in preference order. Defaults to navigator.languages. */
	navigatorLanguages?: readonly string[];
	/** Mirrors the active language onto the document. Defaults to `<html lang>`. */
	applyLanguage?: (language: SupportedLanguage) => void;
}

export type LanguageListener = (language: SupportedLanguage) => void;

function isSupported(value: string): value is SupportedLanguage {
	return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

/**
 * Reduces a BCP-47 tag to a supported language, or null when unsupported.
 * `es-AR` → `es`, `EN-us` → `en`, `fr` → null.
 */
export function normalizeLanguage(value: string | null | undefined): SupportedLanguage | null {
	if (!value) return null;
	const primary = value.trim().toLowerCase().split(/[-_]/)[0];
	if (!primary) return null;
	return isSupported(primary) ? primary : null;
}

/**
 * Resolves the language to start with: an explicit stored choice wins, then the
 * first browser preference we support, then DEFAULT_LANGUAGE.
 */
export function detectLanguage(sources: {
	stored?: string | null;
	navigatorLanguages?: readonly string[];
} = {}): SupportedLanguage {
	const stored = normalizeLanguage(sources.stored);
	if (stored) return stored;

	for (const tag of sources.navigatorLanguages ?? []) {
		const preferred = normalizeLanguage(tag);
		if (preferred) return preferred;
	}

	return DEFAULT_LANGUAGE;
}

/** localStorage access itself throws in some privacy modes, hence the try. */
function defaultStorage(): LanguageStorage | null {
	try {
		return typeof localStorage === 'undefined' ? null : localStorage;
	} catch {
		return null;
	}
}

function defaultNavigatorLanguages(): readonly string[] {
	if (typeof navigator === 'undefined') return [];
	if (navigator.languages?.length) return navigator.languages;
	return navigator.language ? [navigator.language] : [];
}

function defaultApplyLanguage(language: SupportedLanguage): void {
	if (typeof document === 'undefined') return;
	document.documentElement.lang = language;
}

/**
 * Observable language preference.
 *
 * Detection runs once in the constructor and is NOT written back to storage —
 * only an explicit `set()`/`toggle()` persists, so a browser-derived default
 * never masquerades as a user choice.
 */
export class LanguageStore {
	private readonly storage: LanguageStorage | null;
	private readonly applyLanguage: (language: SupportedLanguage) => void;
	private readonly listeners = new Set<LanguageListener>();
	private current: SupportedLanguage;

	constructor(options: LanguageStoreOptions = {}) {
		this.storage = options.storage === undefined ? defaultStorage() : options.storage;
		this.applyLanguage = options.applyLanguage ?? defaultApplyLanguage;

		this.current = detectLanguage({
			stored: this.read(),
			navigatorLanguages: options.navigatorLanguages ?? defaultNavigatorLanguages()
		});

		this.applyLanguage(this.current);
	}

	get language(): SupportedLanguage {
		return this.current;
	}

	set(language: SupportedLanguage): void {
		if (!isSupported(language) || language === this.current) return;
		this.current = language;
		this.write(language);
		this.applyLanguage(language);
		for (const listener of this.listeners) listener(language);
	}

	toggle(): SupportedLanguage {
		this.set(this.current === 'es' ? 'en' : 'es');
		return this.current;
	}

	/** Subscribes and immediately pushes the current value. Returns the unsubscribe. */
	subscribe(listener: LanguageListener): () => void {
		this.listeners.add(listener);
		listener(this.current);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private read(): string | null {
		try {
			return this.storage?.getItem(LANGUAGE_STORAGE_KEY) ?? null;
		} catch {
			return null;
		}
	}

	private write(language: SupportedLanguage): void {
		try {
			this.storage?.setItem(LANGUAGE_STORAGE_KEY, language);
		} catch {
			// Full or blocked storage must not break the toggle.
		}
	}
}

let sharedStore: LanguageStore | null = null;

/**
 * The process-wide store every island shares. Created lazily so importing a
 * constant (e.g. DEFAULT_LANGUAGE in a layout) never touches browser globals.
 */
export function getLanguageStore(): LanguageStore {
	sharedStore ??= new LanguageStore();
	return sharedStore;
}
