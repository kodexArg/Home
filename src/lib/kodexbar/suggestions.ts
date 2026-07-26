import type { CorpusChunk } from './types';
import type { SupportedLanguage } from '../ui/language';

/**
 * Suggested next questions — the placeholder's content.
 *
 * The input's placeholder proposes the question a visitor is most likely to
 * want next, and TAB types it in. Because TAB puts the text one keystroke away
 * from being submitted as the visitor's own query, the suggestion is UI chrome
 * in the sense of adr-09 §4: it is never model-authored free text.
 *
 * Instead this follows the same shape as links (adr-10): the prompt offers the
 * model a short list of authored candidates, the model returns an *id*, and the
 * server resolves it here. A hallucinated id resolves to nothing and the
 * deterministic first candidate is used, so the placeholder can only ever show
 * a question written in this file.
 */

/** Shown before the first exchange, when there is no context to go on. */
export const OPENING_SUGGESTION: Record<SupportedLanguage, string> = {
	es: '¿Quién es kodexArg?',
	en: "Who's kodexArg?"
};

export interface Suggestion {
	id: string;
	lang: SupportedLanguage;
	/** The question, rendered verbatim as the placeholder. */
	text: string;
	/**
	 * Local chunk ids (no pack/lang prefix) whose answer leads naturally here.
	 * A suggestion is a candidate when the retrieved set intersects this list.
	 */
	after: string[];
}

/** Most candidates the model is ever shown. Keeps the prompt small. */
export const MAX_CANDIDATES = 4;

/**
 * Authored candidates, mirrored across languages by id.
 *
 * `after` is hand-picked rather than derived from `related`: the chunk graph
 * answers "what is the evidence for this claim", which is a different question
 * from "what would a visitor ask next".
 */
const ES: Omit<Suggestion, 'lang'>[] = [
	{
		id: 'contacto',
		text: '¿Cómo puedo contactarlo?',
		after: [
			'perfil', 'disponibilidad', 'exp-alvs', 'skill-backend', 'skill-cloud-devops',
			'skill-ia-agentes', 'skill-liderazgo', 'proj-coveris-aws', 'kodexarg-org'
		]
	},
	{
		id: 'disponible',
		text: '¿Está disponible para trabajar?',
		after: ['perfil', 'contacto', 'exp-alvs', 'skill-liderazgo', 'kodexbar-funcion']
	},
	{
		id: 'stack',
		text: '¿En qué tecnologías trabaja?',
		after: ['perfil', 'contacto', 'kodexbar-funcion', 'kodexarg-org', 'educacion']
	},
	{
		id: 'aws',
		text: '¿Qué experiencia tiene en AWS?',
		after: ['perfil', 'skill-backend', 'skill-linux', 'skill-infra-iot', 'exp-alvs', 'proj-alvs-cloud']
	},
	{
		id: 'ia',
		text: '¿Qué hace con IA y agentes?',
		after: ['perfil', 'skill-qa-metodo', 'skill-fullstack', 'kodexbar-funcion', 'proj-home-kodexbar']
	},
	{
		id: 'proyectos',
		text: '¿Qué proyectos tiene publicados?',
		after: ['perfil', 'kodexarg-org', 'skill-ia-agentes', 'skill-cloud-devops', 'repos-tools']
	},
	{
		id: 'trayectoria',
		text: '¿Dónde trabajó antes?',
		after: ['perfil', 'exp-alvs', 'contacto', 'skill-liderazgo']
	},
	{
		id: 'calidad',
		text: '¿Cómo asegura la calidad del código?',
		after: ['skill-ia-agentes', 'skill-backend', 'skill-fullstack', 'proj-coveris-metodo']
	},
	{
		id: 'formacion',
		text: '¿Qué formación tiene?',
		after: ['perfil', 'exp-casino-mendoza', 'skill-linux', 'idiomas']
	},
	{
		id: 'coveris',
		text: '¿Qué es Coveris?',
		after: ['skill-qa-metodo', 'skill-cloud-devops', 'skill-liderazgo', 'skill-backend']
	},
	{
		id: 'kodexbar',
		text: '¿Para qué sirve KodexBar?',
		after: ['kodexarg-org', 'proj-home-kodexbar', 'proj-design-system']
	}
];

const EN: Omit<Suggestion, 'lang'>[] = [
	{ id: 'contacto', text: 'How can I reach him?', after: ES[0].after },
	{ id: 'disponible', text: 'Is he available for work?', after: ES[1].after },
	{ id: 'stack', text: 'What technologies does he work with?', after: ES[2].after },
	{ id: 'aws', text: 'What is his AWS experience?', after: ES[3].after },
	{ id: 'ia', text: 'What does he do with AI and agents?', after: ES[4].after },
	{ id: 'proyectos', text: 'What projects has he published?', after: ES[5].after },
	{ id: 'trayectoria', text: 'Where did he work before?', after: ES[6].after },
	{ id: 'calidad', text: 'How does he keep code quality up?', after: ES[7].after },
	{ id: 'formacion', text: 'What is his background?', after: ES[8].after },
	{ id: 'coveris', text: 'What is Coveris?', after: ES[9].after },
	{ id: 'kodexbar', text: 'What is KodexBar for?', after: ES[10].after }
];

export const SUGGESTIONS: readonly Suggestion[] = [
	...ES.map((s) => ({ ...s, lang: 'es' as const })),
	...EN.map((s) => ({ ...s, lang: 'en' as const }))
];

/** Strip `pack:local:lang` down to `local`. */
function localIdOf(chunkId: string): string {
	return chunkId.split(':')[1] ?? '';
}

/**
 * Candidate follow-ups for a retrieved context, best-effort ordered.
 *
 * Ordering is by how many retrieved chunks point at the suggestion, so the
 * follow-up the context supports most strongly comes first — which is also the
 * deterministic fallback when the model declines to choose.
 */
export function candidatesFor(
	chunks: readonly CorpusChunk[],
	lang: SupportedLanguage
): Suggestion[] {
	const present = new Set(chunks.map((c) => localIdOf(c.id)));
	if (present.size === 0) return [];

	return SUGGESTIONS.filter((s) => s.lang === lang)
		.map((s) => ({ suggestion: s, weight: s.after.filter((id) => present.has(id)).length }))
		.filter((entry) => entry.weight > 0)
		// Never propose the question the visitor effectively just had answered.
		.filter((entry) => !present.has(entry.suggestion.id))
		.sort((a, b) => b.weight - a.weight)
		.slice(0, MAX_CANDIDATES)
		.map((entry) => entry.suggestion);
}

/**
 * Resolve a model-emitted suggestion id against the candidates it was offered.
 *
 * Returns the first candidate when the id is missing or unknown: the feature
 * degrades to deterministic instead of degrading to empty.
 */
export function resolveSuggestion(
	id: unknown,
	candidates: readonly Suggestion[]
): string | undefined {
	if (candidates.length === 0) return undefined;
	if (typeof id === 'string') {
		const picked = candidates.find((c) => c.id === id.trim());
		if (picked) return picked.text;
	}
	return candidates[0].text;
}
