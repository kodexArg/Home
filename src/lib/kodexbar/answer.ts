import type { KodexAnswer, LinkDestination } from './types';
import type { SupportedLanguage } from '../ui/language';
import { getDestination, resolveLinkIds } from './destinations';
import { getPack } from './packs';
import { retrieve, type RetrievalResult } from './retrieval';
import { buildSystemPrompt, buildUserPrompt, FAILURE, OUT_OF_SCOPE } from './systemPrompt';
import { parseModelJson, scrubAnswerText, scrubPlaceholderText } from './scrub';
import {
	OPENING_SUGGESTION,
	candidatesFor,
	linkRequestFor,
	resolveSuggestion,
	type Suggestion
} from './suggestions';

export const GENERATION_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';
export const MAX_OUTPUT_TOKENS = 320;
export const TEMPERATURE = 0.3;

export function allowedLinksFor(chunks: readonly { related: string[] }[]): LinkDestination[] {
	const ids: string[] = [];
	for (const chunk of chunks) {
		for (const ref of chunk.related) {
			if (getDestination(ref)) ids.push(ref);
		}
	}
	return resolveLinkIds(ids);
}

function toAnswer(
	text: string,
	links: LinkDestination[],
	language: SupportedLanguage,
	matched: boolean,
	score?: number,
	suggestion?: string,
	followUp?: string
): KodexAnswer {
	return { text, links, language, matched, score, suggestion, followUp };
}

export interface AnswerOptions {
	retriever?: typeof retrieve;
}

function retrievalGatePassed(retrieval: RetrievalResult): boolean {
	return retrieval.passed && retrieval.chunks.length > 0;
}

function packFragmentsFor(retrieval: RetrievalResult): string[] {
	return [...new Set(retrieval.chunks.map((c) => c.pack))]
		.map((id) => getPack(id)?.systemPromptFragment)
		.filter((f): f is string => Boolean(f));
}

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

	if (!retrievalGatePassed(retrieval)) {
		return toAnswer(
			OUT_OF_SCOPE[lang],
			[],
			lang,
			false,
			retrieval.topScore,
			OPENING_SUGGESTION[lang]
		);
	}

	if (!env?.AI) {
		console.warn('[kodexbar] AI binding missing at generation time.');
		return toAnswer(FAILURE[lang], [], lang, false, retrieval.topScore);
	}

	const packFragments = packFragmentsFor(retrieval);
	const allowedLinks = allowedLinksFor(retrieval.chunks);
	const suggestions = candidatesFor(retrieval.chunks, lang);

	let raw: string | undefined;
	try {
		const result = await env.AI.run(GENERATION_MODEL, {
			messages: [
				{
					role: 'system',
					content: buildSystemPrompt({
						lang,
						packFragments,
						chunks: retrieval.chunks,
						allowedLinks,
						suggestions
					})
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
		console.warn('[kodexbar] model returned unparseable output.');
		return toAnswer(FAILURE[lang], [], lang, false, retrieval.topScore);
	}

	const text = scrubAnswerText(parsed.text);
	if (!text) {
		return toAnswer(FAILURE[lang], [], lang, false, retrieval.topScore);
	}

	const offeredLinkIds = new Set(allowedLinks.map((d) => d.id));
	const links = resolveLinkIds(parsed.linkIds).filter((d) => offeredLinkIds.has(d.id));

	const authoredFallback = resolveSuggestion(parsed.nextId, suggestions) ?? OPENING_SUGGESTION[lang];

	return toAnswer(
		text,
		links,
		lang,
		true,
		retrieval.topScore,
		placeholderFor(parsed.ask, parsed.next, links, authoredFallback, lang),
		authoredFallback
	);
}

function placeholderFor(
	draftedLinkRequest: string | undefined,
	draftedNextQuestion: string | undefined,
	links: readonly LinkDestination[],
	authoredFallback: string,
	lang: SupportedLanguage
): string {
	if (links.length > 0) {
		return scrubPlaceholderText(draftedLinkRequest) || linkRequestFor(links, lang);
	}
	return scrubPlaceholderText(draftedNextQuestion) || authoredFallback;
}
