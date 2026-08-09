# ADR 02: Harness Architecture & PRD / Directives Linkage

* **Status:** Accepted (Open for extension)
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

The **Harness** represents the authoritative security, validation, and execution guardrail for `kodexArg/Home`. It ensures that human interaction occurs exclusively through the official UI, prevents API scraping or denial-of-wallet attacks, and guarantees strict alignment between specification documents and execution rules.

## Core Directives

### 1. Importance of `PRD.md` as Single Source of Truth (SSOT)
[PRD.md](PRD.md) serves as the primary product contract. No feature, routing behavior, or edge capability may be introduced into production without being specified in `PRD.md`. The harness enforces that code implementations reflect the PRD guidelines without scope creep.

---

## Edge Harness Capabilities & Security Rules

1. **Origin-Bound Endpoint Execution**: API routes (e.g. `/api/ask`) validate request headers and run strictly within the Cloudflare Pages/Worker environment.
2. **Server-Side Cooldown Enforcement**: Rate limits and cooldown intervals are enforced authoritatively on the edge (never solely on the client). The client-side cooldown is a UX affordance, not a control — see [ADR 09 §7](adr-09-kodexbar-security.md).
3. **Closed-Link Dispatch**: The backend never reflects arbitrary client-supplied URLs, and the LLM cannot emit one: it returns destination **ids**, resolved server-side against the allowlist. Model prose is permitted; model URLs are structurally impossible — see [ADR 09 §1](adr-09-kodexbar-security.md).
4. **Zero-Trust Environment Bindings**: Cloudflare Workers AI (`env.AI`) and Vectorize (`env.VECTOR_INDEX`) run via native internal bindings, eliminating external API tokens.

---

## Open / Closed Principle for Harness Expansion

This ADR remains **Open for Extension** under the Open/Closed Principle. As new harness requirements (such as bot signals, Turnstile challenges, proof-of-human tokens, or enhanced fingerprinting) are designed, they must be appended to this document below.

### Harness Rule Extensions (Append Below)

* *[Extension 2026-07-24]*: Native Cloudflare Workers AI & Vectorize bindings attached to edge runtime via `wrangler.jsonc`.
* *[Retired 2026-07-26]*: The `outcome: 'Action'` / `NO_MATCH` edge-response validation extension recorded here belonged to the multi-tier router replaced by KodexBar (see [ADR 09](adr-09-kodexbar-security.md), [ADR 10](adr-10-kodexbar-architecture.md)). That enumeration no longer exists in the codebase; the rule has no referent and is retired rather than amended.
* *[Extension 2026-08-08]*: In-repo zone split — site / `src/kodexbar` / `corpus` — per [ADR 13](adr-13-repo-layout.md). Harness review paths for KodexBar now include `src/kodexbar/` and `corpus/`.
* *[Extension 2026-08-09]*: GitHub RAG ingest + Vectorize id budget — see also [ADR 14](adr-14-github-corpus.md).
  * **Authoring SSOT for org repos:** one verbose summary markdown per repo under `github-public-repos/` and `github-private-repos/` (not a dump of every `*.md` in each clone).
  * **Ingest:** `bun run corpus:ingest-github` → scrub URL/domain/email literals → split embeddable chunks (target ~1400 chars, **max 6 per repo**) → `corpus/gh-public|gh-private/{es,en}/` → regenerate `src/kodexbar/destinations.github.ts` for public repos missing from the manual allowlist → `bun run corpus:compile` → `bun run index:corpus` (DEV-only admin endpoint + remote Vectorize).
  * **Vectorize vector `id` hard limit:** Cloudflare Vectorize rejects ids longer than **64 bytes**. Runtime chunk ids are `pack:localId:lang` (`defineChunks`). Therefore `localId` MUST leave room for the longest pack prefix (`gh-private` = 11) + 2 colons + lang (2) ⇒ **localId ≤ 49 bytes**. Ingest `chunkId` MUST enforce this; integrity/reindex MUST fail closed on longer ids.
  * **Split of concerns (harness invariant):** Vectorize stores embeddings + `{pack,lang}` metadata only; chunk **text** lives in compiled Worker packs. Retrieval resolves `match.id` via `getChunk` — never from Vectorize metadata.
* *[Extension 2026-08-09b]*: Generation against `@cf/zai-org/glm-4.7-flash` MUST pass `reasoning_effort: null` and `chat_template_kwargs.enable_thinking: false`. With thinking left on, Workers AI often returns OpenAI-shaped `choices[0].message` with `content: null` (tokens spent in `reasoning`) and KodexBar fails closed. Response text is read from legacy `result.response` **or** `choices[0].message.content`.
* *[Extension 2026-08-09c]*: Interests pack `interests` — [ADR 15](adr-15-interests-pack.md). Loose authorized personal-interest notes under `corpus/interests/{es,en}/`. Gate **`minScore: 0.52`**. Additive authoring: new `.md` → `corpus:compile` → `index:corpus`. No career or civil-identity facts. No URL/domain/email in bodies. Template: `templates/interests-note.TEMPLATE.md`. Harness review path includes `corpus/interests/`.
* *[Extension 2026-08-09d]*: Platzi pack `platzi` — [ADR 16](adr-16-platzi-pack.md). Per-diploma “what he learned” notes under `corpus/platzi/{es,en}/`. Gate **`minScore: 0.48`**. Membership = public diplomas on the student profile. Enrich from public course pages when found; otherwise title-level inference. No URL/domain/email in bodies. Template: `templates/platzi-course.TEMPLATE.md`. Harness review path includes `corpus/platzi/`.
