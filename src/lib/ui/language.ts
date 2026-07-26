export type SupportedLanguage = 'es' | 'en';

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['es', 'en'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'es';
export const LANGUAGE_STORAGE_KEY = 'kodexarg:language';

export const LANGUAGE_LABELS: Record<SupportedLanguage, { code: string; name: string }> = {
	es: { code: 'ES', name: 'Español' },
	en: { code: 'EN', name: 'English' }
};

export const LANGUAGE_GROUP_LABEL: Record<SupportedLanguage, string> = {
	es: 'Idioma de la consola',
	en: 'Console language'
};

export interface LanguageStorage {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

export interface LanguageStoreOptions {
	storage?: LanguageStorage | null;
	navigatorLanguages?: readonly string[];
	applyLanguage?: (language: SupportedLanguage) => void;
}

export type LanguageListener = (language: SupportedLanguage) => void;

function isSupported(value: string): value is SupportedLanguage {
	return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function normalizeLanguage(value: string | null | undefined): SupportedLanguage | null {
	if (!value) return null;
	const primary = value.trim().toLowerCase().split(/[-_]/)[0];
	if (!primary) return null;
	return isSupported(primary) ? primary : null;
}

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

function defaultStorageTolerantOfPrivacyModeThrows(): LanguageStorage | null {
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

export class LanguageStore {
	private readonly storage: LanguageStorage | null;
	private readonly applyLanguage: (language: SupportedLanguage) => void;
	private readonly listeners = new Set<LanguageListener>();
	private current: SupportedLanguage;

	constructor(options: LanguageStoreOptions = {}) {
		this.storage =
			options.storage === undefined ? defaultStorageTolerantOfPrivacyModeThrows() : options.storage;
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
			return;
		}
	}
}

let sharedStore: LanguageStore | null = null;

export function getLanguageStore(): LanguageStore {
	sharedStore ??= new LanguageStore();
	return sharedStore;
}
