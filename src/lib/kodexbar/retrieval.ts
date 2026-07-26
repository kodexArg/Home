import type { CorpusChunk } from './types';
import type { SupportedLanguage } from '../ui/language';
import { getChunk, expandRelated, minScoreFor } from './packs';

/**
 * Retrieval — the deterministic half of KodexBar.
 *
 * Everything here is embeddings, cosine similarity and a threshold. No model
 * decides what context an answer is built from; see adr-10.
 */

/** Multilingual. NOT interchangeable with bge-small-en-v1.5 — see adr-10. */
export const EMBEDDING_MODEL = '@cf/baai/bge-m3';

export const DEFAULT_TOP_K = 5;

export interface RetrievalHit {
	chunk: CorpusChunk;
	score: number;
}

export interface RetrievalResult {
	/** Chunks to put in the prompt: the hits that passed, plus their evidence. */
	chunks: CorpusChunk[];
	/** Hits that cleared their pack's gate, best first. */
	hits: RetrievalHit[];
	/** Best score seen, gate-passing or not. Undefined when nothing matched. */
	topScore?: number;
	/** False when nothing cleared the gate — the caller MUST NOT call the LLM. */
	passed: boolean;
}

/** Embed one string. Returns null when the binding is absent or misbehaves. */
export async function embed(env: Env, text: string): Promise<number[] | null> {
	if (!env?.AI) return null;
	try {
		const result = await env.AI.run(EMBEDDING_MODEL, { text: [text] });
		const vector = result?.data?.[0];
		return Array.isArray(vector) && vector.length > 0 ? vector : null;
	} catch (err) {
		console.error('[kodexbar] embedding failed:', err);
		return null;
	}
}

/**
 * Retrieve context for a query.
 *
 * Fails closed: any missing binding, transport error or empty result yields
 * `passed: false`, which the endpoint turns into the fixed out-of-scope reply.
 * There is no fallback retrieval path — the keyword matcher that used to cover
 * this case was removed with the multi-tier router (adr-04, adr-10).
 */
export async function retrieve(
	env: Env,
	query: string,
	lang: SupportedLanguage,
	topK = DEFAULT_TOP_K
): Promise<RetrievalResult> {
	const empty: RetrievalResult = { chunks: [], hits: [], passed: false };

	if (!env?.AI || !env?.VECTOR_INDEX) {
		console.warn('[kodexbar] AI or VECTOR_INDEX binding missing; retrieval disabled.');
		return empty;
	}

	const vector = await embed(env, query);
	if (!vector) return empty;

	let matches: VectorizeMatch[];
	try {
		const search = await env.VECTOR_INDEX.query(vector, {
			topK,
			returnMetadata: true,
			filter: { lang }
		});
		matches = search?.matches ?? [];
	} catch (err) {
		console.error('[kodexbar] Vectorize query failed:', err);
		return empty;
	}

	if (matches.length === 0) return empty;

	// Resolve ids back to committed chunks. An id in the index with no chunk in
	// the repository is stale (a pack changed without a reindex) and is dropped:
	// the index is a search structure, never a source of content.
	const hits: RetrievalHit[] = [];
	let topScore: number | undefined;

	for (const match of matches) {
		if (topScore === undefined || match.score > topScore) topScore = match.score;

		const chunk = getChunk(match.id);
		if (!chunk) {
			console.warn(`[kodexbar] stale index entry "${match.id}" — reindex needed.`);
			continue;
		}
		if (match.score < minScoreFor(chunk.pack)) continue;

		hits.push({ chunk, score: match.score });
	}

	if (hits.length === 0) return { ...empty, topScore };

	hits.sort((a, b) => b.score - a.score);

	return {
		hits,
		chunks: expandRelated(hits.map((h) => h.chunk), lang),
		topScore,
		passed: true
	};
}
