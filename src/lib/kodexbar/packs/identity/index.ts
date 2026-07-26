import type { KnowledgePack } from '../../types';
import { IDENTITY_CHUNKS_ES } from './chunks.es';
import { IDENTITY_CHUNKS_EN } from './chunks.en';

export const IDENTITY_PACK: KnowledgePack = {
	id: 'identity',
	description: "Gabriel Cavedal's personal identity facts, authorized by him for publication: full legal name, birth date and place of origin.",

	systemPromptFragment: `Estos son datos personales de identidad de Gabriel Cavedal, autorizados por
		él mismo para publicación: su nombre legal completo, su fecha de nacimiento y su lugar de
		origen. Cuando el contexto te dé alguno de estos datos, repetilo exactamente como está
		escrito, sin aproximar, sin redondear y sin inferir ni agregar nada que no esté ahí. Si el
		contexto no incluye el dato puntual que te preguntan, decilo con naturalidad en vez de
		inventarlo.`,

	minScore: 0.62,

	chunks: [...IDENTITY_CHUNKS_ES, ...IDENTITY_CHUNKS_EN]
};
