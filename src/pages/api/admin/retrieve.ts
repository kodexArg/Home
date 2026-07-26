import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import type { SupportedLanguage } from '../../../lib/ui/language';
import { retrieve } from '../../../lib/kodexbar/retrieval';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	if (!import.meta.env.DEV) {
		return new Response('Not found', { status: 404 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 });
	}

	const payload = body as { query?: unknown; language?: unknown } | null;
	const query = typeof payload?.query === 'string' ? payload.query.trim() : '';
	const language: SupportedLanguage = payload?.language === 'en' ? 'en' : 'es';

	if (!query) {
		return Response.json({ ok: false, error: 'Missing "query".' }, { status: 400 });
	}

	const result = await retrieve(env, query, language);

	return Response.json({
		ok: true,
		passed: result.passed,
		topScore: result.topScore ?? null,
		chunks: result.chunks.map((chunk) => ({
			id: chunk.id,
			pack: chunk.pack,
			title: chunk.title,
			text: chunk.text
		}))
	});
};
