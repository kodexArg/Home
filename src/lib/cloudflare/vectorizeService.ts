import type { RouteDestination } from '../router/types';
import { KODEX_DESTINATIONS } from '../router/destinations';

export interface VectorSearchResult {
	destination: RouteDestination;
	score: number;
}

/**
 * Perform vector search using Cloudflare Workers AI + Cloudflare Vectorize.
 * Uses native environment bindings (env.AI and env.VECTOR_INDEX) with zero hardcoded API keys.
 */
export async function queryCloudflareVectorize(
	env: Env,
	queryText: string,
	topK = 3
): Promise<VectorSearchResult[]> {
	if (!env?.AI || !env?.VECTOR_INDEX) {
		console.warn('[CloudflareVectorize] AI or VECTOR_INDEX bindings are not present in current runtime context.');
		return [];
	}

	try {
		// 1. Generate 384-dimensional embedding using Cloudflare Workers AI
		const embeddingResult = await env.AI.run('@cf/baai/bge-small-en-v1.5', {
			text: [queryText]
		});

		const vector = embeddingResult.data[0];
		if (!vector) return [];

		// 2. Perform cosine similarity query against Cloudflare Vectorize index
		const search = await env.VECTOR_INDEX.query(vector, {
			topK,
			returnMetadata: true
		});

		if (search.matches && search.matches.length > 0) {
			const results: VectorSearchResult[] = [];
			for (const match of search.matches) {
				const destId = (match.metadata?.destinationId as string) || match.id;
				const dest = KODEX_DESTINATIONS.find((d) => d.id === destId);
				if (dest && !results.some((r) => r.destination.id === dest.id)) {
					results.push({
						destination: dest,
						score: match.score
					});
				}
			}
			return results;
		}
	} catch (err) {
		console.error('[CloudflareVectorize] Error querying Vectorize:', err);
	}

	return [];
}

