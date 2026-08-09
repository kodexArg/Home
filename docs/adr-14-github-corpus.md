# ADR 14: GitHub corpus packs (`gh-public` / `gh-private`)

* **Status:** Accepted
* **Date:** 2026-08-08
* **Author:** kodexArg
* **Related:** [ADR 13](adr-13-repo-layout.md), [ADR 09](adr-09-kodexbar-security.md), [ADR 12](adr-12-kodexbar-link-consent.md)
* **Tracks later:** [#14](https://github.com/kodexArg/Home/issues/14) Google login gate for `gh-private` (not implemented yet)

---

## Context & Problem Statement

KodexBar must answer from kodexArg GitHub documentation (all `*.md`, including hidden `.docs/`), public and private, without shipping source code into the index. Links must stay allowlisted. Anonymous auth gating of private packs is deferred (#14); until then both packs are retrievable.

## Decision Outcome

### Packs

| Pack | Visibility default | Link offer |
|------|-------------------|------------|
| `gh-public` | `public` | May `related` a GitHub destination → consent offer ([ADR 12](adr-12-kodexbar-link-consent.md)) |
| `gh-private` | `private` | No GitHub destination in `related`; describe only |

### Chunk frontmatter (English keys)

```yaml
id: string
title: string
visibility: public | private
importance: high | normal | low
source_repo: string          # repo name, not a URL
related: string[]            # destination or chunk ids
tags: string[]
```

Bodies: no URL / domain / email literals (same corpus integrity tests).

### Language

Every chunk is authored under both `es/` and `en/`. `/api/ask` uses the **page language switch** from the request body — never Accept-Language detection for retrieval.

### Ingest

Source of truth: one verbose summary per repo under `github-public-repos/` and `github-private-repos/` (not a dump of every `*.md` in each clone).

`bun run corpus:ingest-github` reads those summaries, scrubs URL/domain/email literals, splits into embeddable chunks (cap **6** per repo, ~1400 chars each), writes `corpus/gh-*`, and regenerates `destinations.github.ts` for public repos missing from the manual allowlist.

**Vectorize id budget (harness):** each upserted id is `pack:localId:lang` and MUST be ≤ **64 bytes** ([ADR 02](adr-02-harness.md) extension 2026-08-09). Ingest builds short `localId` values (`slug≤32`-`index`-`hash8`) so `gh-private:…:es` never exceeds the limit.

Then `corpus:compile` writes runtime packs and `bun run index:corpus` (with `bun run dev` + remote Vectorize) upserts embeddings. Auth gating of `gh-private` is [#14](https://github.com/kodexArg/Home/issues/14).

### Project-link boolean offer

When an answer carries allowlisted **repo** destinations, KodexBar withholds them and uses the project-link consent phrase (reuse KV offer + consent classifier). No separate router.

### Auth

Out of scope here. See #14. Ship open: private docs are queryable without login until that lands.
