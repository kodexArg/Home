/**
 * KodexBar core types.
 *
 * KodexBar is a single-tier assistant: one embedding model, one vector index,
 * one small LLM, one fixed system prompt. There is no strategy cascade and no
 * client-side model — see adr-10.
 *
 * The design constraint that shapes everything here: the LLM never emits a
 * URL. It answers with prose plus a list of destination *ids*, and the server
 * resolves those ids against DESTINATIONS. A hallucinated id resolves to
 * nothing and is dropped, so a rendered href can only ever originate from a
 * LinkDestination.url declared in this repository.
 */

import type { SupportedLanguage } from '../ui/language';

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

/**
 * What kind of thing a destination points at. Drives rendering (a mailto chip
 * is not a repo chip) and lets the retrieval layer prefer, say, contact links
 * for contact questions.
 */
export type DestinationKind = 'site' | 'repo' | 'contact';

/**
 * A place KodexBar is allowed to send a visitor.
 *
 * Membership rule: a destination is something a visitor can actually open —
 * public and live. Private repositories and third-party production systems
 * (Grupo ALVS platforms, client work) are corpus content, not destinations:
 * KodexBar can talk about them, but has no link to offer.
 */
export interface LinkDestination {
	id: string;
	kind: DestinationKind;
	name: string;
	url: string;
	description: string;
	keywords: string[];
}

// ---------------------------------------------------------------------------
// Knowledge packs
// ---------------------------------------------------------------------------

/**
 * One retrievable unit of context.
 *
 * `related` holds destination ids and/or other chunk ids: this is the graph.
 * A skill chunk points at the projects that demonstrate it, so answering
 * "does he know Django?" can pull the evidence and the links in one hop
 * instead of a second vector search.
 */
export interface CorpusChunk {
	/** Globally unique across packs: `${pack}:${localId}:${lang}`. */
	id: string;
	/** Owning pack id — also the Vectorize metadata filter key. */
	pack: string;
	lang: SupportedLanguage;
	/** Short human label, used in logs and in the prompt as a section header. */
	title: string;
	/** The text handed to the LLM verbatim. */
	text: string;
	/** Destination ids and chunk ids this chunk is evidence for. */
	related: string[];
	/** Free-form retrieval terms; curated, not generated. */
	tags: string[];
}

/**
 * A pluggable body of knowledge.
 *
 * This is the open/closed seam. Adding a new subject area (Subordinación y
 * Valor, a product manual, anything) means adding a pack and re-indexing —
 * no change to retrieval, to /api/ask, or to the UI. The engine never learns
 * what a "skill" or a "character sheet" is; it only knows packs and chunks.
 */
export interface KnowledgePack {
	id: string;
	/** One line, for operators. Not sent to the model. */
	description: string;
	/**
	 * Appended to the base system prompt when this pack contributes chunks.
	 * Keep it to scope and tone; the base prompt owns the output format.
	 */
	systemPromptFragment: string;
	/**
	 * Minimum cosine score for this pack's chunks to be considered relevant.
	 * Per-pack because a dense, well-written pack can afford a stricter gate
	 * than a sparse one.
	 */
	minScore: number;
	chunks: CorpusChunk[];
}

// ---------------------------------------------------------------------------
// Answers
// ---------------------------------------------------------------------------

/** What the LLM is contractually required to return. Validated before use. */
export interface RawModelAnswer {
	text: string;
	linkIds: string[];
	/** Id of a suggested follow-up question, resolved against the candidates. */
	nextId?: string;
}

/** What /api/ask returns and the UI renders. */
export interface KodexAnswer {
	/** One paragraph, plain text. Formatting is stripped server-side. */
	text: string;
	/** Resolved from RawModelAnswer.linkIds; unknown ids are dropped. */
	links: LinkDestination[];
	language: SupportedLanguage;
	/**
	 * False when the retrieval gate closed and the fixed out-of-scope reply
	 * was returned without calling the LLM.
	 */
	matched: boolean;
	/** Top cosine score seen, for debugging. Never rendered. */
	score?: number;
	/**
	 * A follow-up question to offer as the input's placeholder, taken verbatim
	 * from the authored registry in suggestions.ts — never model-authored text.
	 * Absent when the context supports no candidate.
	 */
	suggestion?: string;
}
