import type { CorpusChunk } from './types';
import type { SupportedLanguage } from '../ui/language';
import { getChunk, expandRelated, minScoreFor } from './packs';

export const EMBEDDING_MODEL = '@cf/baai/bge-m3';

export const DEFAULT_TOP_K = 5;

export interface RetrievalHit {
	chunk: CorpusChunk;
	score: number;
}

export interface RetrievalResult {
	chunks: CorpusChunk[];
	hits: RetrievalHit[];
	topScore?: number;
	passed: boolean;
}

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

function emptyResult(topScore?: number): RetrievalResult {
	return { chunks: [], hits: [], topScore, passed: false };
}

function resolveHitsAboveGate(matches: VectorizeMatch[]): { hits: RetrievalHit[]; topScore?: number } {
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

	return { hits, topScore };
}

export async function retrieve(
	env: Env,
	query: string,
	lang: SupportedLanguage,
	topK = DEFAULT_TOP_K
): Promise<RetrievalResult> {
	if (!env?.AI || !env?.VECTOR_INDEX) {
		console.warn('[kodexbar] AI or VECTOR_INDEX binding missing; retrieval disabled.');
		return emptyResult();
	}

	const vector = await embed(env, query);
	if (!vector) return emptyResult();

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
		return emptyResult();
	}

	if (matches.length === 0) return emptyResult();

	const { hits, topScore } = resolveHitsAboveGate(matches);
	if (hits.length === 0) return emptyResult(topScore);

	hits.sort((a, b) => b.score - a.score);

	return {
		hits,
		chunks: expandRelated(hits.map((h) => h.chunk), lang),
		topScore,
		passed: true
	};
}
