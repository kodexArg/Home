import type { KodexAnswer, LinkDestination } from './types';
import type { SupportedLanguage } from '../ui/language';
import { getDestination, resolveLinkIds } from './destinations';
import { getPack } from './packs';
import { retrieve, type RetrievalResult } from './retrieval';
import { buildSystemPrompt, buildUserPrompt, FAILURE, OUT_OF_SCOPE } from './systemPrompt';
import { parseModelJson, scrubAnswerText } from './scrub';

/**
 * The answering pipeline (adr-10).
 *
 * Deliberately separate from the endpoint so the whole flow is testable with a
 * fake `Env` and no network. The endpoint owns HTTP concerns — parsing, rate
 * limiting, status codes — and nothing else.
 */

/**
 * Generation model. Swapping this is a quality/latency tradeoff and needs no
 * ADR amendment; swapping the *embedding* model does (adr-10).
 */
export const GENERATION_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';

/** Short ceiling: the contract is one paragraph, so long generations are waste. */
export const MAX_OUTPUT_TOKENS = 320;

/** Low but non-zero — deterministic enough to be predictable, not robotic. */
export const TEMPERATURE = 0.3;

/**
 * Destination ids the model may cite, derived from the retrieved context.
 *
 * Only ids reachable from the chunks actually in the prompt are offered. This
 * keeps the prompt small and, more importantly, means the model is never shown
 * links unrelated to what it was given — it cannot cite the CV while answering
 * about Raspberry Pi.
 */
export function allowedLinksFor(chunks: readonly { related: string[] }[]): LinkDestination[] {
	const ids: string[] = [];
	for (const chunk of chunks) {
		for (const ref of chunk.related) {
			if (getDestination(ref)) ids.push(ref);
		}
	}
	return resolveLinkIds(ids);
}

/** Assemble the final object. Kept in one place so every exit path is shaped alike. */
function toAnswer(
	text: string,
	links: LinkDestination[],
	language: SupportedLanguage,
	matched: boolean,
	score?: number
): KodexAnswer {
	return { text, links, language, matched, score };
}

export interface AnswerOptions {
	/** Injected for tests; defaults to the real retrieval path. */
	retriever?: typeof retrieve;
}

/**
 * Answer a query.
 *
 * Never throws and never returns model-authored prose unvalidated: every path
 * ends in either scrubbed model text, a fixed decline, or a fixed failure line.
 */
export async function answerQuery(
	env: Env,
	query: string,
	lang: SupportedLanguage,
	options: AnswerOptions = {}
): Promise<KodexAnswer> {
	const retriever = options.retriever ?? retrieve;

	let retrieval: RetrievalResult;
	try {
		retrieval = await retriever(env, query, lang);
	} catch (err) {
		console.error('[kodexbar] retrieval threw:', err);
		return toAnswer(FAILURE[lang], [], lang, false);
	}

	// The gate. Below threshold the model is never called — adr-09 §2.
	if (!retrieval.passed || retrieval.chunks.length === 0) {
		return toAnswer(OUT_OF_SCOPE[lang], [], lang, false, retrieval.topScore);
	}

	if (!env?.AI) {
		console.warn('[kodexbar] AI binding missing at generation time.');
		return toAnswer(FAILURE[lang], [], lang, false, retrieval.topScore);
	}

	const packFragments = [...new Set(retrieval.chunks.map((c) => c.pack))]
		.map((id) => getPack(id)?.systemPromptFragment)
		.filter((f): f is string => Boolean(f));

	const allowedLinks = allowedLinksFor(retrieval.chunks);

	let raw: string | undefined;
	try {
		const result = await env.AI.run(GENERATION_MODEL, {
			messages: [
				{
					role: 'system',
					content: buildSystemPrompt({ lang, packFragments, chunks: retrieval.chunks, allowedLinks })
				},
				{ role: 'user', content: buildUserPrompt(query, lang) }
			],
			max_tokens: MAX_OUTPUT_TOKENS,
			temperature: TEMPERATURE
		});
		raw = result?.response;
	} catch (err) {
		console.error('[kodexbar] generation failed:', err);
		return toAnswer(FAILURE[lang], [], lang, false, retrieval.topScore);
	}

	const parsed = parseModelJson(raw);
	if (!parsed) {
		// Unparseable output is discarded, never rendered raw — adr-09 §1.
		console.warn('[kodexbar] model returned unparseable output.');
		return toAnswer(FAILURE[lang], [], lang, false, retrieval.topScore);
	}

	const text = scrubAnswerText(parsed.text);
	if (!text) {
		return toAnswer(FAILURE[lang], [], lang, false, retrieval.topScore);
	}

	// Ids are resolved against the allowlist, then intersected with what was
	// actually offered: a model that names a real-but-unoffered destination
	// gets it dropped too.
	const offered = new Set(allowedLinks.map((d) => d.id));
	const links = resolveLinkIds(parsed.linkIds).filter((d) => offered.has(d.id));

	return toAnswer(text, links, lang, true, retrieval.topScore);
}
