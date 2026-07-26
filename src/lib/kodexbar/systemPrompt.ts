import type { CorpusChunk, LinkDestination } from './types';
import type { SupportedLanguage } from '../ui/language';
import type { Suggestion } from './suggestions';
import { MAX_ANSWER_CHARS } from './scrub';

/**
 * Prompt composition.
 *
 * The base prompt owns the output contract; packs contribute scope and tone
 * (adr-10). Nothing here is a security boundary on its own — every rule stated
 * below is independently enforced in code (adr-09 §1, §4). The prompt exists to
 * make the model's first attempt correct, not to be the thing that stops it.
 *
 * The self-reference rule is the one place where that split is uneven, so it is
 * worth being precise about what is guaranteed and what is merely asked:
 *
 *   - As a LINK it cannot happen. The `home` destination was deleted, so no id
 *     resolves to this origin, and destinations.test.ts fails if one is added.
 *   - As a DOMAIN in prose it cannot happen. `scrubAnswerText()` deletes
 *     anything domain-shaped, which covers all three of our own hostnames.
 *   - As WORDS ("andá a la home") it is prompt-only. There is no way to strip
 *     that without mangling legitimate prose, so this is genuinely best-effort.
 */

/** Fixed reply when the retrieval gate closes. Never model-authored. */
export const OUT_OF_SCOPE: Record<SupportedLanguage, string> = {
	es: 'No tengo información sobre eso. Puedo contarte sobre Gabriel Cavedal, su experiencia, sus proyectos y cómo contactarlo.',
	en: "I don't have information about that. I can tell you about Gabriel Cavedal, his experience, his projects and how to reach him."
};

/** Fixed reply when the model fails or returns unusable output. */
export const FAILURE: Record<SupportedLanguage, string> = {
	es: 'Se me complicó procesar eso. Probá de nuevo en un momento.',
	en: 'I had trouble processing that. Please try again in a moment.'
};

const FORMAT_RULES: Record<SupportedLanguage, string> = {
	es: `FORMATO DE SALIDA — obligatorio, siempre igual:
- Respondé SOLO con un objeto JSON: {"text": "...", "linkIds": ["id"], "nextId": "id"}
- "text": UN solo párrafo de texto plano, breve, máximo ${MAX_ANSWER_CHARS} caracteres.
- Sin markdown, sin títulos, sin viñetas, sin negritas, sin saltos de línea.
- NUNCA escribas URLs, dominios ni direcciones de correo dentro de "text".
- NUNCA te refieras a este sitio: el visitante ya está acá. Está prohibido
  mencionar o linkear kodexarg.com, www.kodexarg.com y home.kodexarg.com — las
  tres son esta misma página, aunque home parezca un subdominio aparte. Tampoco
  lo mandes "a la home" ni "a la página principal" con palabras.
  Los demás subdominios SÍ valen como referencia y son bienvenidos: el CV, la
  documentación, el design system, los proyectos. Esos son otros lugares.
- Los links van solo en "linkIds", usando los ids permitidos que se listan abajo.
  Se muestran solos, debajo de tu texto, así que no hace falta anunciarlos.
- La frase tiene que quedar COMPLETA sin el dato del link. Nunca la termines
  apuntando a un valor que no podés escribir. Mal: "Su correo es". Bien:
  "Podés escribirle por mail" con "linkIds": ["email"].
- Si ningún link corresponde, devolvé "linkIds": [].
- "nextId": el id de la pregunta que este visitante querría hacer después,
  elegido de PREGUNTAS SUGERIDAS. Es solo un id; no escribas la pregunta en
  "text". Si ninguna encaja, devolvé "nextId": "".
- Tono de chat: directo y natural, como una respuesta hablada.`,
	en: `OUTPUT FORMAT — mandatory, always identical:
- Reply with ONLY a JSON object: {"text": "...", "linkIds": ["id"], "nextId": "id"}
- "text": ONE short plain-text paragraph, at most ${MAX_ANSWER_CHARS} characters.
- No markdown, no headings, no bullets, no bold, no line breaks.
- NEVER write URLs, domains or email addresses inside "text".
- NEVER refer to this site: the visitor is already on it. Mentioning or linking
  kodexarg.com, www.kodexarg.com and home.kodexarg.com is forbidden — all three
  are this same page, even though home looks like a separate subdomain. Do not
  send them "to the home page" in words either.
  Other subdomains ARE fine to reference and are welcome: the CV, the docs, the
  design system, the projects. Those are somewhere else.
- Links go only in "linkIds", using the allowed ids listed below. They render on
  their own beneath your text, so there is no need to announce them.
- The sentence must stand COMPLETE without the linked value. Never end it
  pointing at something you cannot write. Bad: "His email is". Good: "You can
  reach him by email" with "linkIds": ["email"].
- If no link applies, return "linkIds": [].
- "nextId": the id of the question this visitor would most likely ask next,
  chosen from SUGGESTED QUESTIONS. It is an id only; never write the question
  itself into "text". If none fits, return "nextId": "".
- Chat tone: direct and natural, like a spoken answer.`
};

const GROUNDING_RULES: Record<SupportedLanguage, string> = {
	es: `REGLAS:
- Respondé únicamente con lo que dice el CONTEXTO. No completes con conocimiento propio.
- Si el contexto no alcanza para responder, decilo con naturalidad y ofrecé lo que sí sabés.
- No inventes fechas, cifras, empresas, tecnologías ni links.`,
	en: `RULES:
- Answer only from the CONTEXT below. Do not fill gaps with your own knowledge.
- If the context is insufficient, say so naturally and offer what you do know.
- Never invent dates, figures, companies, technologies or links.`
};

const SECTION_LABELS: Record<
	SupportedLanguage,
	{ links: string; context: string; question: string; suggestions: string }
> = {
	es: {
		links: 'IDS DE LINK PERMITIDOS',
		context: 'CONTEXTO',
		question: 'PREGUNTA DEL VISITANTE',
		suggestions: 'PREGUNTAS SUGERIDAS'
	},
	en: {
		links: 'ALLOWED LINK IDS',
		context: 'CONTEXT',
		question: "VISITOR'S QUESTION",
		suggestions: 'SUGGESTED QUESTIONS'
	}
};

export interface PromptInput {
	lang: SupportedLanguage;
	/** Scope/tone fragments from the packs that contributed chunks. */
	packFragments: readonly string[];
	chunks: readonly CorpusChunk[];
	/** The only ids the model is permitted to emit. */
	allowedLinks: readonly LinkDestination[];
	/** Follow-up candidates; the model picks one by id. May be empty. */
	suggestions?: readonly Suggestion[];
}

/** Build the system prompt. The visitor's query is NOT part of it. */
export function buildSystemPrompt(input: PromptInput): string {
	const labels = SECTION_LABELS[input.lang];

	const linkList = input.allowedLinks.length
		? input.allowedLinks.map((d) => `- ${d.id}: ${d.name}`).join('\n')
		: input.lang === 'es'
			? '(ninguno — devolvé "linkIds": [])'
			: '(none — return "linkIds": [])';

	const context = input.chunks.map((c) => `[${c.title}]\n${c.text}`).join('\n\n');

	const sections = [
		input.packFragments.join('\n\n'),
		GROUNDING_RULES[input.lang],
		FORMAT_RULES[input.lang],
		`${labels.links}:\n${linkList}`
	];

	// Omitted entirely when there is nothing to choose from, so the model is not
	// invited to invent an id against an empty list.
	if (input.suggestions?.length) {
		const list = input.suggestions.map((s) => `- ${s.id}: ${s.text}`).join('\n');
		sections.push(`${labels.suggestions}:\n${list}`);
	}

	sections.push(`${labels.context}:\n${context}`);

	return sections.join('\n\n');
}

/**
 * Build the user turn.
 *
 * The visitor's text is confined to this message and never reaches the system
 * prompt, the corpus or the index (adr-09 §3). Keeping the boundary at the
 * message level is what lets the system prompt stay fully trusted.
 */
export function buildUserPrompt(query: string, lang: SupportedLanguage): string {
	return `${SECTION_LABELS[lang].question}: ${query}`;
}
