import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { allChunks } from '../../../lib/kodexbar/packs';
import { EMBEDDING_MODEL } from '../../../lib/kodexbar/retrieval';

export const prerender = false;

/**
 * POST /api/admin/index-corpus — rebuild the Vectorize index from the packs.
 *
 * **Development only.** It returns 404 outside `astro dev`, so it is not an
 * attack surface and not a denial-of-wallet lever in production.
 *
 * Running it from dev still writes to the real index: `wrangler.jsonc` sets
 * `remote: true` on both bindings because Vectorize has no local emulation.
 * That is what makes a dev-only indexer sufficient — and it is why this route
 * needs no API token, keeping the zero-secrets property of adr-02/adr-03.
 *
 * Upsert (not insert) is deliberate: chunk ids are stable, so re-running is
 * idempotent for changed content. It does NOT remove chunks deleted from a
 * pack — retrieval drops stale ids defensively, but a pack that loses chunks
 * needs the index recreated to be truly clean.
 */

/** Workers AI and Vectorize both dislike very large single calls. */
const BATCH_SIZE = 25;

export const POST: APIRoute = async () => {
	if (!import.meta.env.DEV) {
		return new Response('Not found', { status: 404 });
	}

	if (!env?.AI || !env?.VECTOR_INDEX) {
		return Response.json(
			{ ok: false, error: 'AI or VECTOR_INDEX binding unavailable. Check wrangler.jsonc remote bindings.' },
			{ status: 503 }
		);
	}

	const chunks = allChunks();
	if (chunks.length === 0) {
		return Response.json({ ok: false, error: 'No chunks registered.' }, { status: 400 });
	}

	const started = Date.now();
	let dimensions = 0;
	let upserted = 0;

	try {
		for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
			const batch = chunks.slice(i, i + BATCH_SIZE);

			// Embed the title alongside the text: the title carries the subject
			// ("Cómo contactarlo") which the body often only implies.
			const embedded = await env.AI.run(EMBEDDING_MODEL, {
				text: batch.map((c) => `${c.title}\n${c.text}`)
			});

			const vectors = embedded?.data ?? [];
			if (vectors.length !== batch.length) {
				throw new Error(`embedding count mismatch: got ${vectors.length}, expected ${batch.length}`);
			}

			dimensions ||= vectors[0]?.length ?? 0;

			await env.VECTOR_INDEX.upsert(
				batch.map((chunk, n) => ({
					id: chunk.id,
					values: vectors[n],
					// Metadata carries only what retrieval filters on. Chunk text is
					// NOT stored here: content comes from the repository, never from
					// the index (see retrieval.ts).
					metadata: { pack: chunk.pack, lang: chunk.lang }
				}))
			);

			upserted += batch.length;
		}
	} catch (err) {
		return Response.json(
			{ ok: false, upserted, dimensions, error: err instanceof Error ? err.message : String(err) },
			{ status: 500 }
		);
	}

	return Response.json({
		ok: true,
		upserted,
		dimensions,
		model: EMBEDDING_MODEL,
		elapsedMs: Date.now() - started,
		note: 'Vectorize is eventually consistent; allow a few seconds before querying.'
	});
};
