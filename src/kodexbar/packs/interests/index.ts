import type { KnowledgePack } from '../../types';
import { INTERESTS_CHUNKS_ES } from './chunks.es';
import { INTERESTS_CHUNKS_EN } from './chunks.en';

export const INTERESTS_PACK: KnowledgePack = {
	id: "interests",
	description: "Gabriel Cavedal personal interests and loose life notes authorized for publication (hobbies, tastes, non-career context).",
	systemPromptFragment: `Estas son notas sueltas de intereses personales de Gabriel Cavedal, autorizadas por él para publicación: gustos, hobbies y contexto de vida que no son CV ni datos civiles de identidad. Hablás de él en tercera persona. Usá solo el CONTEXTO recuperado; no inventes gustos, hábitos ni aficiones. Si el contexto no alcanza, decilo con naturalidad. No mezcles esto con experiencia laboral ni con nombre legal / fecha de nacimiento salvo que el contexto lo traiga explícito.`,
	minScore: 0.52,
	chunks: [...INTERESTS_CHUNKS_ES, ...INTERESTS_CHUNKS_EN]
};
