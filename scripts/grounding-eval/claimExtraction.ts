export type FabricationProneClaimType = 'year' | 'figure' | 'properNoun';

export interface FabricationProneClaim {
	type: FabricationProneClaimType;
	token: string;
}

const FOUR_DIGIT_YEAR_PATTERN = /\b(?:19|20)\d{2}\b/g;
const STANDALONE_NUMERIC_FIGURE_PATTERN = /\b\d+(?:[.,]\d+)?%?\b/g;
const CAPITALIZED_WORD_PATTERN = /[A-ZÁÉÍÓÚÑ][A-Za-zÀ-ÿ0-9+#.]*/g;

const SENTENCE_INITIAL_FUNCTION_WORDS_BY_LANGUAGE: Record<'es' | 'en', Set<string>> = {
	es: new Set([
		'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'es', 'son', 'fue', 'fueron',
		'esta', 'estan', 'esto', 'eso', 'esa', 'ese', 'estos', 'estas', 'tambien', 'ademas',
		'y', 'o', 'pero', 'sin', 'con', 'su', 'sus', 'se', 'no', 'si', 'cuando', 'donde',
		'porque', 'mientras', 'durante', 'desde', 'hasta', 'entre', 'sobre', 'para', 'por',
		'que', 'quien', 'quienes', 'cual', 'cuales', 'como', 'trabaja', 'disena', 'diseno',
		'construyo', 'lidera', 'mantiene', 'ofrece', 'vive', 'habla', 'tiene', 'actualmente',
		'recientemente', 'ella'
	]),
	en: new Set([
		'the', 'a', 'an', 'he', 'she', 'it', 'they', 'this', 'that', 'these', 'those', 'his',
		'her', 'also', 'and', 'or', 'but', 'with', 'without', 'since', 'from', 'to', 'in',
		'on', 'at', 'for', 'by', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'currently',
		'works', 'leads', 'designs', 'builds', 'maintains', 'offers', 'lives', 'speaks',
		'there', 'where', 'when', 'what', 'who', 'which', 'how', 'yes', 'no'
	])
};

const COMBINING_DIACRITICAL_MARKS_PATTERN = new RegExp('[\\u0300-\\u036f]', 'g');

function foldToPlainLowercase(word: string): string {
	return word
		.normalize('NFD')
		.replace(COMBINING_DIACRITICAL_MARKS_PATTERN, '')
		.toLowerCase();
}

function isSentenceInitialFunctionWord(word: string, language: 'es' | 'en'): boolean {
	return SENTENCE_INITIAL_FUNCTION_WORDS_BY_LANGUAGE[language].has(foldToPlainLowercase(word));
}

function extractYearClaims(answerText: string): FabricationProneClaim[] {
	const matches = answerText.match(FOUR_DIGIT_YEAR_PATTERN) ?? [];
	return matches.map((token) => ({ type: 'year', token }));
}

function extractFigureClaims(answerText: string, yearTokens: readonly string[]): FabricationProneClaim[] {
	const matches = answerText.match(STANDALONE_NUMERIC_FIGURE_PATTERN) ?? [];
	const yearTokenSet = new Set(yearTokens);
	return matches
		.filter((token) => !yearTokenSet.has(token))
		.map((token) => ({ type: 'figure', token }));
}

function extractProperNounClaims(
	answerText: string,
	language: 'es' | 'en'
): FabricationProneClaim[] {
	const matches = answerText.match(CAPITALIZED_WORD_PATTERN) ?? [];
	const seen = new Set<string>();
	const claims: FabricationProneClaim[] = [];

	for (const token of matches) {
		if (/^\d+$/.test(token)) continue;
		if (token.length < 2) continue;
		if (isSentenceInitialFunctionWord(token, language)) continue;

		const dedupeKey = foldToPlainLowercase(token);
		if (seen.has(dedupeKey)) continue;
		seen.add(dedupeKey);

		claims.push({ type: 'properNoun', token });
	}

	return claims;
}

export function extractFabricationProneClaims(
	answerText: string,
	language: 'es' | 'en'
): FabricationProneClaim[] {
	const yearClaims = extractYearClaims(answerText);
	const figureClaims = extractFigureClaims(
		answerText,
		yearClaims.map((claim) => claim.token)
	);
	const properNounClaims = extractProperNounClaims(answerText, language);

	return [...yearClaims, ...figureClaims, ...properNounClaims];
}
