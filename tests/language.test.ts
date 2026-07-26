import { describe, it, expect } from 'bun:test';
import {
	DEFAULT_LANGUAGE,
	LANGUAGE_GROUP_LABEL,
	LANGUAGE_LABELS,
	LANGUAGE_STORAGE_KEY,
	LanguageStore,
	SUPPORTED_LANGUAGES,
	detectLanguage,
	normalizeLanguage
} from '../src/lib/ui/language';
import type { LanguageStorage, SupportedLanguage } from '../src/lib/ui/language';

/** In-memory Storage double that records writes. */
function makeStorage(initial: Record<string, string> = {}) {
	const data = new Map(Object.entries(initial));
	const writes: Array<[string, string]> = [];
	const storage: LanguageStorage = {
		getItem: (key) => data.get(key) ?? null,
		setItem: (key, value) => {
			writes.push([key, value]);
			data.set(key, value);
		}
	};
	return { storage, data, writes };
}

/** Document double: captures what would land on <html lang>. */
function makeDocument() {
	const applied: SupportedLanguage[] = [];
	return { applied, applyLanguage: (language: SupportedLanguage) => applied.push(language) };
}

function store(options: Partial<ConstructorParameters<typeof LanguageStore>[0]> = {}) {
	const doc = makeDocument();
	const s = new LanguageStore({
		storage: null,
		navigatorLanguages: [],
		applyLanguage: doc.applyLanguage,
		...options
	});
	return { s, doc };
}

describe('normalizeLanguage', () => {
	it('accepts supported primary subtags regardless of case or region', () => {
		expect(normalizeLanguage('es')).toBe('es');
		expect(normalizeLanguage('es-AR')).toBe('es');
		expect(normalizeLanguage('EN-us')).toBe('en');
		expect(normalizeLanguage('  en_GB  ')).toBe('en');
	});

	it('rejects unsupported and empty values', () => {
		expect(normalizeLanguage('fr-FR')).toBeNull();
		expect(normalizeLanguage('pt')).toBeNull();
		expect(normalizeLanguage('')).toBeNull();
		expect(normalizeLanguage('   ')).toBeNull();
		expect(normalizeLanguage(null)).toBeNull();
		expect(normalizeLanguage(undefined)).toBeNull();
	});
});

describe('detectLanguage', () => {
	it('prefers a stored choice over the browser preference', () => {
		expect(detectLanguage({ stored: 'en', navigatorLanguages: ['es-AR'] })).toBe('en');
	});

	it('falls back to the first supported browser preference', () => {
		expect(detectLanguage({ navigatorLanguages: ['fr-FR', 'en-GB', 'es'] })).toBe('en');
	});

	it('ignores an unsupported stored value', () => {
		expect(detectLanguage({ stored: 'de', navigatorLanguages: ['en'] })).toBe('en');
	});

	it('falls back to the default when nothing is known', () => {
		expect(detectLanguage()).toBe(DEFAULT_LANGUAGE);
		expect(detectLanguage({ stored: null, navigatorLanguages: ['ja', 'ko'] })).toBe(DEFAULT_LANGUAGE);
	});
});

describe('LanguageStore', () => {
	it('seeds from the stored choice and stamps the document on construction', () => {
		const { storage } = makeStorage({ [LANGUAGE_STORAGE_KEY]: 'en' });
		const { s, doc } = store({ storage });

		expect(s.language).toBe('en');
		expect(doc.applied).toEqual(['en']);
	});

	it('seeds from the browser preference when nothing is stored, without persisting it', () => {
		const { storage, writes } = makeStorage();
		const { s } = store({ storage, navigatorLanguages: ['en-US'] });

		expect(s.language).toBe('en');
		expect(writes).toEqual([]);
	});

	it('persists an explicit choice and mirrors it onto the document', () => {
		const { storage, writes, data } = makeStorage();
		const { s, doc } = store({ storage });

		s.set('en');

		expect(s.language).toBe('en');
		expect(writes).toEqual([[LANGUAGE_STORAGE_KEY, 'en']]);
		expect(data.get(LANGUAGE_STORAGE_KEY)).toBe('en');
		expect(doc.applied).toEqual(['es', 'en']);
	});

	it('survives a reload by reading back what it wrote', () => {
		const { storage } = makeStorage();
		const first = store({ storage });
		first.s.set('en');

		const second = store({ storage, navigatorLanguages: ['es-AR'] });

		expect(second.s.language).toBe('en');
	});

	it('toggles between the two languages', () => {
		const { s } = store();

		expect(s.language).toBe('es');
		expect(s.toggle()).toBe('en');
		expect(s.toggle()).toBe('es');
	});

	it('ignores a no-op set and an unsupported value', () => {
		const { storage, writes } = makeStorage();
		const { s, doc } = store({ storage });
		const seen: SupportedLanguage[] = [];
		s.subscribe((language) => seen.push(language));

		s.set('es');
		s.set('de' as SupportedLanguage);

		expect(s.language).toBe('es');
		expect(writes).toEqual([]);
		expect(doc.applied).toEqual(['es']);
		expect(seen).toEqual(['es']); // only the immediate subscribe push
	});

	it('pushes the current value on subscribe, then every change, until unsubscribed', () => {
		const { s } = store();
		const seen: SupportedLanguage[] = [];

		const unsubscribe = s.subscribe((language) => seen.push(language));
		s.set('en');
		unsubscribe();
		s.set('es');

		expect(seen).toEqual(['es', 'en']);
		expect(s.language).toBe('es');
	});

	it('keeps working when storage is unavailable or throws', () => {
		const hostile: LanguageStorage = {
			getItem: () => {
				throw new Error('blocked');
			},
			setItem: () => {
				throw new Error('quota');
			}
		};
		const { s } = store({ storage: hostile, navigatorLanguages: ['en'] });

		expect(s.language).toBe('en');
		expect(s.toggle()).toBe('es');

		const withoutStorage = store({ storage: null });
		expect(withoutStorage.s.toggle()).toBe('en');
	});
});

describe('language copy', () => {
	it('covers every supported language', () => {
		for (const language of SUPPORTED_LANGUAGES) {
			expect(LANGUAGE_LABELS[language].code).toBeTruthy();
			expect(LANGUAGE_LABELS[language].name).toBeTruthy();
			expect(LANGUAGE_GROUP_LABEL[language]).toBeTruthy();
		}
	});

	it('never leaks the input placeholder into the control labels', () => {
		const labels = SUPPORTED_LANGUAGES.flatMap((language) => [
			LANGUAGE_LABELS[language].code,
			LANGUAGE_LABELS[language].name,
			LANGUAGE_GROUP_LABEL[language]
		]);

		for (const label of labels) {
			expect(label).not.toContain('¿Sí?');
			expect(label).not.toContain('Yes?');
		}
	});
});
