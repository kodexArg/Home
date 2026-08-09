import type { KnowledgePack } from '../../types';
import { PLATZI_CHUNKS_ES } from './chunks.es';
import { PLATZI_CHUNKS_EN } from './chunks.en';

export const PLATZI_PACK: KnowledgePack = {
	id: "platzi",
	description: "Gabriel Cavedal completed Platzi courses: what each diploma covered and what he learned.",
	systemPromptFragment: `Estas son notas autorizadas sobre cursos de Platzi que Gabriel Cavedal completó con diploma. Hablás de él en tercera persona.

Usá solo el CONTEXTO recuperado; no inventes cursos, temas ni certificados. Si el contexto no alcanza, decilo con naturalidad.

No mezcles esto con datos civiles de identidad.

Podés enlazar el destino platzi cuando el contexto lo cite en related.`,
	minScore: 0.48,
	chunks: [...PLATZI_CHUNKS_ES, ...PLATZI_CHUNKS_EN]
};
