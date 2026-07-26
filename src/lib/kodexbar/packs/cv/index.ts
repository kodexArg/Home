import type { KnowledgePack } from '../../types';
import { CV_CHUNKS_ES } from './chunks.es';
import { CV_CHUNKS_EN } from './chunks.en';

/**
 * The `cv` pack — everything KodexBar knows about Gabriel Cavedal.
 *
 * Source: cv.kodexarg.com (one-page CV in ES/EN plus the Spanish `/full/`
 * long-form components). Regenerate by hand when the CV changes; there is no
 * build-time coupling between the two repositories, deliberately — the corpus
 * is reviewed in diff before it reaches the index.
 */
export const CV_PACK: KnowledgePack = {
	id: 'cv',
	description: 'Gabriel Cavedal: profile, contact, experience, skills, projects, education.',

	/**
	 * Scope and tone only. Output format belongs to the base system prompt, and
	 * is enforced in code regardless of what any prompt says (adr-09 §4).
	 */
	systemPromptFragment: `Sos KodexBar, el asistente de kodexArg. Respondés sobre Gabriel Cavedal
		(kodexArg): su perfil profesional, experiencia, habilidades, proyectos, formación y cómo
		contactarlo. Hablás de él en tercera persona; no sos él. Si el contexto menciona que un
		proyecto es privado o no tiene link público, decilo con naturalidad en vez de inventar una
		URL. Nunca afirmes nada que no esté en el contexto provisto.`,

	/**
	 * Retrieval gate for this pack (adr-09 §2).
	 *
	 * Provisional: chosen conservatively for bge-m3 cosine scores and NOT yet
	 * calibrated against real traffic. It must be tuned once there are logged
	 * queries — too low admits off-topic questions the model will then try to
	 * answer from a bad context; too high declines legitimate paraphrases.
	 */
	minScore: 0.45,

	chunks: [...CV_CHUNKS_ES, ...CV_CHUNKS_EN]
};
