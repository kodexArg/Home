import type { KnowledgePack } from '../../types';
import { GH_PUBLIC_CHUNKS_ES } from './chunks.es';
import { GH_PUBLIC_CHUNKS_EN } from './chunks.en';

export const GH_PUBLIC_PACK: KnowledgePack = {
	id: "gh-public",
	description: "Markdown documentation from public kodexArg GitHub repositories",
	systemPromptFragment: `Respuestas sobre repositorios públicos de kodexArg en GitHub. Usá solo el contexto
recuperado. Si hay un destination id de repo en los links permitidos, el servidor
ofrece el link con consentimiento; vos no inventes URLs.`,
	minScore: 0.48,
	chunks: [...GH_PUBLIC_CHUNKS_ES, ...GH_PUBLIC_CHUNKS_EN]
};
