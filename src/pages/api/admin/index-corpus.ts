import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { allChunks } from '../../../lib/kodexbar/packs';
import { EMBEDDING_MODEL } from '../../../lib/kodexbar/retrieval';

export const prerender = false;

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
