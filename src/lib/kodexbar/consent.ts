import type { SupportedLanguage } from '../ui/language';
import { GENERATION_MODEL } from './answer';

export type ConsentIntent = 'yes' | 'no' | 'other';

export const CONSENT_REPLY: Record<'yes' | 'no', Record<SupportedLanguage, string>> = {
	yes: {
		es: 'Ahí van.',
		en: 'Here you go.'
	},
	no: {
		es: 'Listo, los dejo acá por si cambiás de idea.',
		en: 'Alright — they stay here in case you change your mind.'
	}
};

export function normalise(query: string): string {
	return query
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’]/g, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
		.replace(/\s+/g, ' ');
}

const YES = new Set([
	'si', 'sii', 'siii', 'si si', 'sisi', 'sip', 'sipi', 'si claro', 'claro', 'claro que si',
	'claro si', 'dale', 'dale si', 'si dale', 'dale dale', 'dale gracias', 'si por favor',
	'por favor', 'porfa', 'porfis', 'obvio', 'obvio si', 'obvio que si', 'bueno', 'ok', 'oka',
	'okey', 'vale', 'va', 'de una', 'adelante', 'por que no', 'mostrame', 'mostramelos',
	'mostralos', 'mostra', 'mostra los links', 'mostrame los links', 'muestrame', 'muestramelos',
	'muestralos', 'ver', 'quiero ver', 'quiero verlos', 'me interesa', 'me interesan',
	'pasamelos', 'pasame los links', 'tiralos',
	'y', 'yes', 'yes please', 'yes show me', 'yeah', 'yep', 'yup', 'sure', 'sure thing', 'okay',
	'please', 'go ahead', 'show', 'show me', 'show them', 'show the links', 'show me the links',
	'why not', 'sounds good', 'absolutely', 'of course', 'definitely', 'do it', 'lets see',
	'id like that', 'i want them', 'gimme', 'hit me'
]);

const NO = new Set([
	'no', 'nop', 'nope', 'nah', 'no gracias', 'ahora no', 'no por ahora', 'mas tarde', 'despues',
	'paso', 'no hace falta', 'no quiero', 'mejor no', 'esta bien asi', 'asi esta bien',
	'no thanks', 'no thank you', 'not now', 'later', 'maybe later', 'im good', 'no need',
	'not really', 'skip', 'pass', 'its fine', 'thats fine'
]);

export function classifyLexically(query: string): ConsentIntent | null {
	const text = normalise(query);
	if (!text) return null;
	if (YES.has(text)) return 'yes';
	if (NO.has(text)) return 'no';
	return null;
}

const CLASSIFIER_PROMPT = `You classify one short reply and nothing else.

The visitor was just asked whether they want to see some links. Decide what their reply means and answer with exactly ONE word:

YES - they accept, agree, or ask to be shown the links. Any language, however phrased.
NO - they decline or say not now.
OTHER - anything else, including a new question or an unrelated remark.

Answer with the single word only: YES, NO or OTHER. No punctuation, no explanation.`;

const CLASSIFIER_MAX_TOKENS = 4;
const CLASSIFIER_TEMPERATURE = 0;

export async function classifyConsent(
	env: Env,
	query: string,
	_lang: SupportedLanguage
): Promise<ConsentIntent> {
	const lexical = classifyLexically(query);
	if (lexical) return lexical;

	if (!env?.AI) return 'other';

	let raw: string | undefined;
	try {
		const result = await env.AI.run(GENERATION_MODEL, {
			messages: [
				{ role: 'system', content: CLASSIFIER_PROMPT },
				{ role: 'user', content: `Reply: ${query}` }
			],
			max_tokens: CLASSIFIER_MAX_TOKENS,
			temperature: CLASSIFIER_TEMPERATURE
		});
		raw = result?.response;
	} catch (err) {
		console.error('[kodexbar] consent classification failed:', err);
		return 'other';
	}

	return parseIntent(raw);
}

export function parseIntent(raw: unknown): ConsentIntent {
	if (typeof raw !== 'string') return 'other';
	const match = /\b(yes|no|other)\b/i.exec(raw);
	if (!match) return 'other';
	const word = match[1].toLowerCase();
	return word === 'yes' ? 'yes' : word === 'no' ? 'no' : 'other';
}
