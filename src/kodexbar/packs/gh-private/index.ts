import type { KnowledgePack } from '../../types';
import { GH_PRIVATE_CHUNKS_ES } from './chunks.es';
import { GH_PRIVATE_CHUNKS_EN } from './chunks.en';

export const GH_PRIVATE_PACK: KnowledgePack = {
	id: "gh-private",
	description: "Markdown documentation from private kodexArg GitHub repositories",
	systemPromptFragment: `Respuestas sobre repositorios privados de kodexArg en GitHub. Describí solo con el
contexto recuperado. No ofrezcas ni inventes URLs de GitHub para repos privados.`,
	minScore: 0.48,
	chunks: [...GH_PRIVATE_CHUNKS_ES, ...GH_PRIVATE_CHUNKS_EN]
};
