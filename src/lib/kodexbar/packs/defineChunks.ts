import type { CorpusChunk } from '../types';
import type { SupportedLanguage } from '../../ui/language';

/**
 * Authoring shape for a chunk. Pack authors write these; `defineChunks`
 * stamps the pack id, the language and the globally-unique composite id so
 * those three can never drift out of sync by hand.
 */
export interface ChunkDef {
	/** Unique within (pack, lang). Stable — it is half of the Vectorize key. */
	id: string;
	title: string;
	/** Prose handed to the LLM verbatim. Write it as a complete thought. */
	text: string;
	/** Destination ids and chunk ids this chunk is evidence for. */
	related?: string[];
	tags?: string[];
}

/**
 * Build the chunks of one pack in one language.
 *
 * Chunk ids are `${pack}:${localId}:${lang}` — see adr-10. Keeping the
 * composition here means a pack author never types an id twice, and the
 * indexer can derive the Vectorize key without a lookup table.
 */
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
