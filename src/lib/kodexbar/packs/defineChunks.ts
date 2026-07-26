import type { CorpusChunk } from '../types';
import type { SupportedLanguage } from '../../ui/language';

export interface ChunkDef {
	id: string;
	title: string;
	text: string;
	related?: string[];
	tags?: string[];
}

export function defineChunks(
	pack: string,
	lang: SupportedLanguage,
	defs: readonly ChunkDef[]
): CorpusChunk[] {
	const seen = new Set<string>();
	return defs.map((def) => {
		if (seen.has(def.id)) {
			throw new Error(`[${pack}:${lang}] duplicate chunk id "${def.id}"`);
		}
		seen.add(def.id);
		return {
			id: `${pack}:${def.id}:${lang}`,
			pack,
			lang,
			title: def.title,
			text: def.text.trim().replace(/\s+/g, ' '),
			related: def.related ?? [],
			tags: def.tags ?? []
		};
	});
}
