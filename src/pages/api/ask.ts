import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import type { KodexAnswer } from '../../lib/kodexbar/types';
import type { SupportedLanguage } from '../../lib/ui/language';
import { answerQuery } from '../../lib/kodexbar/answer';
import { resolveLinkIds } from '../../lib/kodexbar/destinations';
import { FAILURE, OUT_OF_SCOPE } from '../../lib/kodexbar/systemPrompt';
import { checkRateLimit, clientIdFrom } from '../../lib/kodexbar/rateLimit';
import { CONSENT_REPLY, classifyConsent } from '../../lib/kodexbar/consent';
import { offerKeyFor, putOffer, takeOffer } from '../../lib/kodexbar/offers';

export const prerender = false;

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

function rateLimitedReplyFor(lang: SupportedLanguage): string {
	return lang === 'es'
		? 'Estás yendo un poco rápido. Esperá unos segundos y volvé a preguntar.'
		: "You're going a bit fast. Wait a few seconds and ask again.";
}

async function resolvePendingOfferReply(
	pending: Awaited<ReturnType<typeof takeOffer>>,
	env: Env,
	query: string,
	lang: SupportedLanguage
): Promise<Response | null> {
	if (!pending) return null;

	const intent = await classifyConsent(env, query, lang, pending.proposedRequest);

	if (intent === 'yes') {
		return json({
			text: CONSENT_REPLY.yes[lang],
			links: resolveLinkIds(pending.ids),
			language: lang,
			matched: true,
			suggestion: pending.suggestion
		});
	}

	if (intent === 'no') {
		return json({
			text: CONSENT_REPLY.no[lang],
			links: [],
			language: lang,
			matched: true,
			suggestion: pending.suggestion
		});
	}

	return null;
}

export const POST: APIRoute = async ({ request }) => {
	let lang: SupportedLanguage = 'es';

	try {
		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return fixed(FAILURE[lang], lang, { status: 400 });
		}

		const payload = body as
			| { query?: unknown; language?: unknown; conversation?: unknown }
			| null;
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
			return fixed(rateLimitedReplyFor(lang), lang, {
				status: 429,
				headers: { 'Retry-After': String(limit.retryAfter) }
			});
		}

		const offerKey = offerKeyFor(clientIdFrom(request), payload?.conversation);

		const pending = await takeOffer(env, offerKey);
		const pendingOfferReply = await resolvePendingOfferReply(pending, env, query, lang);
		if (pendingOfferReply) return pendingOfferReply;

		const answer = await answerQuery(env, query, lang);

		if (answer.links.length > 0) {
			const stored = await putOffer(env, offerKey, {
				ids: answer.links.map((link) => link.id),
				proposedRequest: answer.suggestion,
				suggestion: answer.followUp,
				language: lang
			});

			if (stored) {
				return json({ ...answer, links: [], followUp: undefined, offer: true });
			}
		}

		return json(answer);
	} catch (err) {
		console.error('[kodexbar] /api/ask failed:', err);
		return fixed(FAILURE[lang], lang, { status: 500 });
	}
};
