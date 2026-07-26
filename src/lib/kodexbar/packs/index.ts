import type { CorpusChunk, KnowledgePack } from '../types';
import type { SupportedLanguage } from '../../ui/language';
import { CV_PACK } from './cv';

/**
 * The pack registry — KodexBar's open/closed seam (adr-10).
 *
 * Adding a knowledge domain means adding a pack here and re-running
 * `bun run index:corpus`. Retrieval, /api/ask and the UI stay untouched: they
 * only ever deal in packs and chunks, never in domain vocabulary.
 *
 * Adding a pack whose content is not authored by kodexArg requires an ADR
 * amendment — chunk text is trusted input (adr-09 §3).
 */
export const PACKS: readonly KnowledgePack[] = [CV_PACK];

const BY_ID = new Map(PACKS.map((p) => [p.id, p]));

export function getPack(id: string): KnowledgePack | undefined {
	return BY_ID.get(id);
}

/** Every chunk across every registered pack. Used by the indexer. */
export function allChunks(): CorpusChunk[] {
	return PACKS.flatMap((p) => p.chunks);
}

const CHUNKS_BY_ID = new Map(allChunks().map((c) => [c.id, c]));

export function getChunk(id: string): CorpusChunk | undefined {
	return CHUNKS_BY_ID.get(id);
}

/**
 * Retrieval gate threshold for a chunk's owning pack.
 *
 * Falls back to 1.1 — an impossible cosine score — when the pack is unknown,
 * so an orphaned chunk left in the index after a pack is removed can never
 * pass the gate. Failing closed is the only safe direction here.
 */
export function minScoreFor(packId: string): number {
	return BY_ID.get(packId)?.minScore ?? 1.1;
}

/**
 * Expand a set of retrieved chunks with the chunks they cite.
 *
 * `related` mixes destination ids and chunk ids; only the latter resolve here,
 * and the rest are handled by `resolveLinkIds()`. Expansion is one hop deep on
 * purpose: it pulls the evidence behind a claim without dragging the whole
 * graph into the prompt.
 */
export function expandRelated(chunks: readonly CorpusChunk[], lang: SupportedLanguage): CorpusChunk[] {
	const out = [...chunks];
	const seen = new Set(chunks.map((c) => c.id));

	for (const chunk of chunks) {
		for (const ref of chunk.related) {
			// `related` stores bare local ids; compose the addressable form.
			const id = `${chunk.pack}:${ref}:${lang}`;
			if (seen.has(id)) continue;
			const linked = CHUNKS_BY_ID.get(id);
			if (linked) {
				seen.add(id);
				out.push(linked);
			}
		}
	}

	return out;
}
