import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import type { KodexAnswer } from '../../lib/kodexbar/types';
import type { SupportedLanguage } from '../../lib/ui/language';
import { answerQuery } from '../../lib/kodexbar/answer';
import { FAILURE, OUT_OF_SCOPE } from '../../lib/kodexbar/systemPrompt';
import { checkRateLimit, clientIdFrom } from '../../lib/kodexbar/rateLimit';

export const prerender = false;

/**
 * POST /api/ask — the single KodexBar endpoint.
 *
 * HTTP concerns only: validate, rate limit, delegate, serialise. The pipeline
 * lives in `answerQuery` so it can be tested without a request (adr-10).
 */

/** Anything longer is not a question, it is a payload. */
const MAX_QUERY_CHARS = 500;

function json(body: KodexAnswer, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		...init,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store',
			...(init?.headers ?? {})
		}
	});
}

function fixed(text: string, lang: SupportedLanguage, init?: ResponseInit): Response {
	return json({ text, links: [], language: lang, matched: false }, init);
}

export const POST: APIRoute = async ({ request }) => {
	// Language is resolved first so every error path can answer in it.
	let lang: SupportedLanguage = 'es';

	try {
		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return fixed(FAILURE[lang], lang, { status: 400 });
		}

		const payload = body as { query?: unknown; language?: unknown } | null;
		lang = payload?.language === 'en' ? 'en' : 'es';

		const query = typeof payload?.query === 'string' ? payload.query.trim() : '';
		if (!query) {
			return fixed(OUT_OF_SCOPE[lang], lang, { status: 400 });
		}
		if (query.length > MAX_QUERY_CHARS) {
			return fixed(OUT_OF_SCOPE[lang], lang, { status: 413 });
		}

		const limit = await checkRateLimit(env, clientIdFrom(request));
		if (!limit.allowed) {
			const text =
				lang === 'es'
					? 'Estás yendo un poco rápido. Esperá unos segundos y volvé a preguntar.'
					: "You're going a bit fast. Wait a few seconds and ask again.";
			return fixed(text, lang, {
				status: 429,
				headers: { 'Retry-After': String(limit.retryAfter) }
			});
		}

		return json(await answerQuery(env, query, lang));
	} catch (err) {
		// answerQuery does not throw; reaching here means something upstream did.
		console.error('[kodexbar] /api/ask failed:', err);
		return fixed(FAILURE[lang], lang, { status: 500 });
	}
};
