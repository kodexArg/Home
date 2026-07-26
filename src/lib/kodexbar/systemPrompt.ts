import type { CorpusChunk, LinkDestination } from './types';
import type { SupportedLanguage } from '../ui/language';
import type { Suggestion } from './suggestions';
import { MAX_ANSWER_CHARS, MAX_PLACEHOLDER_CHARS } from './scrub';

export const OUT_OF_SCOPE: Record<SupportedLanguage, string> = {
	es: 'No tengo información sobre eso. Puedo contarte sobre Gabriel Cavedal, su experiencia, sus proyectos y cómo contactarlo.',
	en: "I don't have information about that. I can tell you about Gabriel Cavedal, his experience, his projects and how to reach him."
};

export const FAILURE: Record<SupportedLanguage, string> = {
	es: 'Se me complicó procesar eso. Probá de nuevo en un momento.',
	en: 'I had trouble processing that. Please try again in a moment.'
};

const FORMAT_RULES: Record<SupportedLanguage, string> = {
	es: `FORMATO DE SALIDA — obligatorio, siempre igual:
- Respondé SOLO con un objeto JSON: {"text": "...", "linkIds": ["id"], "nextId": "id", "next": "...", "ask": "..."}
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
  NO se muestran en este turno: el visitante los recibe recién si los pide.
  No los anuncies, no los menciones, no digas que están abajo.
- La frase tiene que quedar COMPLETA sin el dato del link. Nunca la termines
  apuntando a un valor que no podés escribir. Mal: "Su correo es". Bien:
  "Podés escribirle por mail" con "linkIds": ["email"].
- Si ningún link corresponde, devolvé "linkIds": [].
- "ask": cómo pediría el visitante los links que devolviste en "linkIds",
  escrito en primera persona y nombrando qué son. Ejemplos: "Mostrame el link
  al CV", "Mostrame su GitHub", "Pasame el mail". Si "linkIds" quedó vacío,
  devolvé "ask": "".
- "next": la PREGUNTA que este visitante querría hacer después, encadenada con
  lo que acabás de contestar. Después de contar quién es, "¿Cuáles son sus
  proyectos actuales?"; después de hablar de AWS, "¿Qué hizo con Django?".
- "ask" y "next" van a aparecer escritos en el campo de texto del visitante,
  listos para enviarse tal cual: máximo ${MAX_PLACEHOLDER_CHARS} caracteres,
  una sola línea, sin comillas. Nunca los escribas dentro de "text".
- "nextId": el id de PREGUNTAS SUGERIDAS más cercano a tu "next", como respaldo.
  Si ninguno encaja, devolvé "nextId": "".
- Tono de chat: directo y natural, como una respuesta hablada.`,
	en: `OUTPUT FORMAT — mandatory, always identical:
- Reply with ONLY a JSON object: {"text": "...", "linkIds": ["id"], "nextId": "id", "next": "...", "ask": "..."}
- "text": ONE short plain-text paragraph, at most ${MAX_ANSWER_CHARS} characters.
- No markdown, no headings, no bullets, no bold, no line breaks.
- NEVER write URLs, domains or email addresses inside "text".
- NEVER refer to this site: the visitor is already on it. Mentioning or linking
  kodexarg.com, www.kodexarg.com and home.kodexarg.com is forbidden — all three
  are this same page, even though home looks like a separate subdomain. Do not
  send them "to the home page" in words either.
  Other subdomains ARE fine to reference and are welcome: the CV, the docs, the
  design system, the projects. Those are somewhere else.
- Links go only in "linkIds", using the allowed ids listed below.
  They do NOT render on this turn: the visitor gets them only if they ask.
  Do not announce them, do not mention them, do not say they are below.
- The sentence must stand COMPLETE without the linked value. Never end it
  pointing at something you cannot write. Bad: "His email is". Good: "You can
  reach him by email" with "linkIds": ["email"].
- If no link applies, return "linkIds": [].
- "ask": how the visitor would ask for the links you returned in "linkIds",
  written in the first person and naming what they are. Examples: "Show me the
  link to his CV", "Show me his GitHub", "Give me his email". If "linkIds" came
  out empty, return "ask": "".
- "next": the QUESTION this visitor would most likely ask next, chained to what
  you just answered. After saying who he is, "What are his current projects?";
  after talking about AWS, "What has he built with Django?".
- "ask" and "next" will appear written in the visitor's input box, ready to send
  as they stand: at most ${MAX_PLACEHOLDER_CHARS} characters, one line, no
  quotes. Never write either of them inside "text".
- "nextId": the id from SUGGESTED QUESTIONS closest to your "next", as a
  fallback. If none fits, return "nextId": "".
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
	packFragments: readonly string[];
	chunks: readonly CorpusChunk[];
	allowedLinks: readonly LinkDestination[];
	suggestions?: readonly Suggestion[];
}

function formatAllowedLinkList(input: PromptInput): string {
	if (input.allowedLinks.length) {
		return input.allowedLinks.map((d) => `- ${d.id}: ${d.name}`).join('\n');
	}
	return input.lang === 'es' ? '(ninguno — devolvé "linkIds": [])' : '(none — return "linkIds": [])';
}

function formatContext(chunks: readonly CorpusChunk[]): string {
	return chunks.map((c) => `[${c.title}]\n${c.text}`).join('\n\n');
}

export function buildSystemPrompt(input: PromptInput): string {
	const labels = SECTION_LABELS[input.lang];

	const sections = [
		input.packFragments.join('\n\n'),
		GROUNDING_RULES[input.lang],
		FORMAT_RULES[input.lang],
		`${labels.links}:\n${formatAllowedLinkList(input)}`
	];

	if (input.suggestions?.length) {
		const list = input.suggestions.map((s) => `- ${s.id}: ${s.text}`).join('\n');
		sections.push(`${labels.suggestions}:\n${list}`);
	}

	sections.push(`${labels.context}:\n${formatContext(input.chunks)}`);

	return sections.join('\n\n');
}

export function buildUserPrompt(query: string, lang: SupportedLanguage): string {
	return `${SECTION_LABELS[lang].question}: ${query}`;
}
