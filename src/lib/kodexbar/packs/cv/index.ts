import type { KnowledgePack } from '../../types';
import { CV_CHUNKS_ES } from './chunks.es';
import { CV_CHUNKS_EN } from './chunks.en';

export const CV_PACK: KnowledgePack = {
	id: 'cv',
	description: 'Gabriel Cavedal: profile, contact, experience, skills, projects, education.',

	systemPromptFragment: `Sos KodexBar, el asistente de kodexArg. Respondés sobre Gabriel Cavedal
		(kodexArg): su perfil profesional, experiencia, habilidades, proyectos, formación y cómo
		contactarlo. Hablás de él en tercera persona; no sos él. Si el contexto menciona que un
		proyecto es privado o no tiene link público, decilo con naturalidad en vez de inventar una
		URL. Nunca afirmes nada que no esté en el contexto provisto.`,

	minScore: 0.45,

	chunks: [...CV_CHUNKS_ES, ...CV_CHUNKS_EN]
};
