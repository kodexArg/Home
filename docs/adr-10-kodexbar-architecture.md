# ADR 10: KodexBar — Single-Tier RAG Architecture & Knowledge Packs

* **Status:** Accepted
* **Date:** 2026-07-26
* **Author:** kodexArg
* **Supersedes:** ADR 10 "LLM Connection Strategy & Multi-Tier Routing Infrastructure" (2026-07-24)

---

## Context & Problem Statement

The superseded ADR 10 defined a three-tier cascade — Chrome `window.ai` / Gemini Nano, then Cloudflare Vectorize, then a deterministic keyword matcher — whose job was to resolve a query to one of ~33 links.

Two things made that architecture wrong for where the product is going.

**The cascade produced inconsistent behaviour by browser.** Tier 1 required Chrome Built-in AI, which most visitors do not have. Tier 1 also had no calibrated score, so it could never emit `'Confirm'`; the same query answered differently depending on the visitor's browser. Tier 3 answered by substring matching, which cannot understand a question phrased in natural language.

**The product is no longer a router.** KodexBar must answer questions about Gabriel Cavedal — his CV, skills, projects, how to reach him — *and* hand out links. Answering requires retrieved context and a model that writes; no keyword matcher does that, and no per-browser tier can do it consistently.

A third consideration decided the shape: this is the first of several knowledge domains. Subordinación y Valor and others follow. The architecture must absorb a new body of knowledge without touching the engine.

## Decision

**One tier.** One embedding model, one vector index, one small LLM, one fixed system prompt, running entirely in the Cloudflare Worker. No client-side inference. No fallback cascade.

```
Visitor query (ES | EN)
      │
      ▼
POST /api/ask ─── rate limit (KV SESSION) ── reject empty / over-length
      │
      ▼
Embed query ...................... @cf/baai/bge-m3        (Workers AI)
      │
      ▼
Vectorize query .................. VECTOR_INDEX, topK 5, filter by lang
      │
      ├── top score < pack.minScore ──► fixed out-of-scope reply
      │                                 { matched: false }   LLM NOT CALLED
      ▼
Expand chunk.related ............. pull linked evidence chunks
      │
      ▼
Compose prompt ................... base system prompt
      │                            + contributing packs' fragments
      │                            + retrieved chunks
      ▼
Generate ......................... @cf/meta/llama-3.1-8b-instruct-fp8
      │                            → { text, linkIds[], nextId? }
      ▼
Resolve + scrub .................. resolveLinkIds() vs DESTINATIONS
      │                            resolveSuggestion() vs this turn's candidates
      │                            strip formatting & URL-shaped text
      ▼
KodexAnswer { text, links[], language, matched, suggestion? }
```

`nextId` follows the same shape as `linkIds`: the model picks an id from a short authored list (the placeholder's follow-up candidates, `src/lib/kodexbar/suggestions.ts`), the server resolves it, and an unknown id falls back to the strongest deterministic candidate rather than to model text. See [ADR 09 §9](adr-09-kodexbar-security.md). The system prompt additionally forbids the model from mentioning or linking `kodexarg.com` / `www.kodexarg.com` / `home.kodexarg.com` — the visitor asking is already on one of them (ADR 09 §10).

Retrieval is deterministic: cosine similarity and a fixed threshold. The LLM only writes the final paragraph, over context the server chose. Where the answer *comes from* is not a model decision.

## Model Selection

Verified against the live Workers AI catalog (`bunx wrangler ai models`, 2026-07-26).

### Embeddings — `@cf/baai/bge-m3`

The superseded architecture used `@cf/baai/bge-small-en-v1.5`. That is an **English-only** model, and the primary audience queries in Spanish. It was the single largest quality defect in the old Tier 2 and it was silent — the model returns a vector for Spanish input, just a poor one.

`@cf/baai/bge-m3` is multilingual and is the only multilingual general-purpose embedding model in the catalog (`@cf/pfnet/plamo-embedding-1b` is Japanese; the remaining `bge-*` and `embeddinggemma` options are English or unsuitable).

**Operational consequence:** `bge-m3` does not share `bge-small-en-v1.5`'s 384 dimensions. Vectorize indexes are fixed-dimension and cannot be migrated. The existing `kodex-vector-index` MUST be replaced by a new index created with `bge-m3`'s dimension count, taken from the model card at creation time and recorded in `wrangler.jsonc`. Changing the embedding model at any future point means creating a new index and reindexing — never an in-place edit.

### Generation — `@cf/meta/llama-3.1-8b-instruct-fp8`

Requirements: small and fast (this sits in front of a homepage input box), acceptable Spanish, and reliable at emitting a small fixed JSON object.

`llama-3.1-8b-instruct-fp8` is the default. Its output is one short paragraph over supplied context — a task well within an 8B model — and its JSON adherence at this size is adequate given that malformed output is caught by validation rather than trusted.

Evaluated alternates, to be reconsidered if Spanish quality proves insufficient against real queries: `@cf/zai-org/glm-4.7-flash` (explicitly multilingual and fast) and `@cf/mistralai/mistral-small-3.1-24b-instruct` (stronger, slower, costlier). The choice is a **quality/latency tradeoff, not an architectural one**: swapping the generation model requires no index change and no schema change, and does not require an ADR amendment. Swapping the *embedding* model does.

### Removed: client-side inference

Chrome Built-in AI (`window.ai` / Gemini Nano) is removed entirely, along with `WindowAiStrategy`. It is not merely unused — it is incompatible with this design:

* The corpus lives server-side. Letting a client model write the answer would require shipping the retrieved chunks to the browser, making the corpus enumerable by iterating queries against the endpoint.
* Availability is browser-dependent, which reintroduces the inconsistency this ADR exists to remove.

## Knowledge Packs — the extension seam

The corpus is a set of `KnowledgePack`s ([types.ts](file:///srv/dev/kodexArg/Home/src/lib/kodexbar/types.ts)):

```ts
interface KnowledgePack {
  id: string
  description: string
  systemPromptFragment: string   // scope and tone only
  minScore: number               // per-pack retrieval gate
  chunks: CorpusChunk[]
}

interface CorpusChunk {
  id: string          // `${pack}:${localId}:${lang}`
  pack: string
  lang: 'es' | 'en'
  title: string
  text: string        // handed to the LLM verbatim
  related: string[]   // destination ids and chunk ids — this is the graph
  tags: string[]
}
```

**The engine knows packs and chunks. It does not know what a "skill", a "project" or a "character sheet" is.** Domain vocabulary lives in chunk text, `tags` and `related` — never in retrieval code, never in `/api/ask`, never in the UI.

Adding a knowledge domain is therefore: author the pack, register it, reindex. No engine change, no schema change, no ADR amendment. Adding a pack whose content is **not authored by kodexArg** does require an amendment — see [ADR 09 §3](adr-09-kodexbar-security.md), which rests on chunk text being trusted.

`related` carries the graph. A skill chunk names the projects that evidence it, so "does he know Django?" retrieves the skill, follows the edge to the project chunks, and offers the corresponding public destinations — one vector query, not two.

`minScore` is per-pack because pack density varies: a tightly written pack can afford a stricter gate than a sparse one. The gate is also the scope control (ADR 09 §2) — a query that matches nothing in any registered pack never reaches the model.

### Reindexing — operational notes

`bun run index:corpus` (`scripts/index-corpus.ts`) does not talk to Workers AI or Vectorize directly — both are Worker bindings, unavailable in a plain Bun process. Instead it POSTs to the dev-only `/api/admin/index-corpus` endpoint on a running `bun run dev` server, which holds the real bindings. Two consequences of that shape:

* The script sends an explicit `Origin` header matching the dev server's own URL. Astro's CSRF protection rejects any non-GET request whose `Origin` does not match the host, and Bun's `fetch()` sends no `Origin` by default — without this the endpoint would answer 403 before the route ever ran.
* The endpoint is gated to `import.meta.env.DEV` (404 outside a dev build), which is what lets it skip an API token: it is unreachable in production, so it is not an attack surface and not a denial-of-wallet lever there.

The endpoint embeds each chunk's `title` and `text` together (not `text` alone) — the title often carries the subject the body only implies — in batches of 25, because both Workers AI and Vectorize reject very large single calls. It **upserts**, not inserts or replaces: chunk ids are stable, so re-running after an edit is idempotent. It does **not** remove chunks deleted from a pack — retrieval defensively drops stale index ids it can no longer resolve to a chunk (`retrieve()` in `retrieval.ts`), but a pack that has lost chunks needs the index recreated to be truly clean, not just reindexed.

### Initial packs

| Pack | Content | Links |
|---|---|---|
| `cv` | Profile, experience, skills, projects, education, contact, QA/method — extracted from `cv.kodexarg.com`, ES and EN | Yes, via `related` |
| *(future)* `syv` | Subordinación y Valor | TBD |

## Links vs. answers — one embedding, two lookups

KodexBar must serve both "take me to the CV" and "what does he know about AWS?". These are **not** separated by an intent classifier. The query is embedded once and compared against both the destination catalog and the chunk corpus; the relative scores decide the shape of the reply.

A high destination score with low corpus scores yields a link with minimal prose. A high corpus score yields a paragraph, with any `related` destinations offered as citations rather than as the answer. There is no classification step to get wrong, and the behaviour degrades smoothly between the two cases.

Private work (Coveris, `syv-mcp-tools`, SROA, the Grupo ALVS platforms) exists in the corpus but has no destination. KodexBar describes it and offers no link. This is intended, and is why `DESTINATIONS` membership is "public and live" rather than "everything he built".

## Consequences

**Gained:** consistent behaviour for every visitor regardless of browser; genuine natural-language understanding in both languages; a corpus that grows without engine changes; hallucinated links made structurally impossible (ADR 09 §1).

**Given up:** the zero-cost, zero-latency client path. Every query now costs one embedding, and every in-scope query additionally costs one completion. The retrieval gate is what keeps out-of-scope traffic to embedding-only cost, and KV rate limiting bounds the rest.

**Accepted for now:** the Spanish corpus is richer than the English one, because the source CV's long-form content (`/full/`) exists only in Spanish. English answers are correspondingly thinner. Reaching parity is a content task, not an architectural one.

## Files

| Concern | Location |
|---|---|
| Types, pack contract | `src/lib/kodexbar/types.ts` |
| Link allowlist + `resolveLinkIds()` | `src/lib/kodexbar/destinations.ts` |
| Corpus packs | `src/lib/kodexbar/packs/` |
| Retrieval + embedding | `src/lib/kodexbar/retrieval.ts` |
| Answering pipeline | `src/lib/kodexbar/answer.ts` |
| System prompt | `src/lib/kodexbar/systemPrompt.ts` |
| Output scrub + JSON parsing | `src/lib/kodexbar/scrub.ts` |
| Follow-up suggestions (`nextId`) | `src/lib/kodexbar/suggestions.ts` |
| Rate limiting | `src/lib/kodexbar/rateLimit.ts` |
| Link offer + consent handshake | `src/lib/kodexbar/offers.ts`, `src/lib/kodexbar/consent.ts` |
| Endpoint | `src/pages/api/ask.ts` |
| Dev-only indexing endpoint | `src/pages/api/admin/index-corpus.ts` |
| Indexing script (drives the endpoint above) | `scripts/index-corpus.ts` |
| UI | `src/components/KodexBar.svelte`, `src/lib/chat/chatSession.ts` |
