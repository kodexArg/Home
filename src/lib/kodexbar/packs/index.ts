import type { CorpusChunk, KnowledgePack } from '../types';
import type { SupportedLanguage } from '../../ui/language';
import { CV_PACK } from './cv';
import { IDENTITY_PACK } from './identity';

export const PACKS: readonly KnowledgePack[] = [CV_PACK, IDENTITY_PACK];

const BY_ID = new Map(PACKS.map((p) => [p.id, p]));

export function getPack(id: string): KnowledgePack | undefined {
	return BY_ID.get(id);
}

export function allChunks(): CorpusChunk[] {
	return PACKS.flatMap((p) => p.chunks);
}

const CHUNKS_BY_ID = new Map(allChunks().map((c) => [c.id, c]));

export function getChunk(id: string): CorpusChunk | undefined {
	return CHUNKS_BY_ID.get(id);
}

export function minScoreFor(packId: string): number {
	return BY_ID.get(packId)?.minScore ?? 1.1;
}

export function expandRelated(chunks: readonly CorpusChunk[], lang: SupportedLanguage): CorpusChunk[] {
	const out = [...chunks];
	const seen = new Set(chunks.map((c) => c.id));

	for (const chunk of chunks) {
		for (const ref of chunk.related) {
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
