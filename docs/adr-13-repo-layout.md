# ADR 13: In-Repo Layout — Site, KodexBar, Corpus

* **Status:** Accepted
* **Date:** 2026-08-08
* **Author:** kodexArg
* **Related:** [ADR 07](adr-07-componentization.md), [ADR 10](adr-10-kodexbar-architecture.md), [ADR 11](adr-11-obsidian-vault.md)

---

## Context & Problem Statement

KodexBar's retrieval engine, the homepage UI, and the knowledge content lived under one mental folder (`src/lib/kodexbar/` mixed with site helpers). As the corpus grows (CV detail, project docs, arbitrary notes), that mix makes the Astro site look like an accidental monorepo for the brain.

We need three clear responsibilities **in this same repository**, without splitting remotes and without breaking Astro's file-based routing.

## Decision Drivers

* Astro 7 compliance: `src/pages/` and `src/layouts/` stay where the framework expects them ([ADR 05](adr-05-frontend.md), [ADR 07](adr-07-componentization.md)).
* One Cloudflare Worker deploy; bindings stay on this app ([ADR 03](adr-03-backend.md), [ADR 08](adr-08-environment-variables.md)).
* Corpus authoring must be markdown-friendly; runtime must stay typed chunks + Vectorize ([ADR 10](adr-10-kodexbar-architecture.md), [ADR 09](adr-09-kodexbar-security.md)).
* KISS / YAGNI: folders and import rules first; no second Worker, no separate git remotes.

## Considered Options

* **Option A:** Nested `src/surface/pages/` — rejected; fights Astro routing.
* **Option B:** Separate repos for site / engine / corpus — deferred; ops cost without a second consumer.
* **Option C:** Three zones in one repo — chosen.

## Decision Outcome

Chosen option: **three in-repo zones**.

```
corpus/                 # KodexCorpus — markdown SSOT (not imported by the Worker)
src/pages/              # Astro routes + thin API adapters
src/layouts/            # Astro shells
src/components/         # Site UI (Svelte 5)
src/lib/chat|ui/        # Site helpers only (no RAG)
src/kodexbar/           # Application logic (TS pure; no .svelte)
scripts/                # corpus-compile, index-corpus, eval
docs/                   # ADRs / PRD (Obsidian vault — not RAG fodder)
```

### Zone contracts

| Zone | Name | May import | Must not |
|------|------|------------|----------|
| Site | kodexarg surface | `components`, `lib/chat`, `lib/ui` | `kodexbar/retrieval`, packs, Vectorize |
| Engine | KodexBar | `src/kodexbar/**`, CF bindings via API adapters | `.svelte`, `chatSession` |
| Corpus | KodexCorpus | nothing at runtime | be `fs`-read on each `/api/ask` |

### Data flow

```
corpus/**/*.md
  → bun run corpus:compile
  → src/kodexbar/packs/**   (generated / maintained runtime modules)
  → bun run index:corpus
  → Vectorize

Visitor → components → POST /api/ask → kodexbar → AI + Vectorize + KV
```

`src/pages/api/*.ts` are **HTTP adapters only**. Business rules live in `src/kodexbar/`.

### Markdown chunk schema

Each knowledge unit under `corpus/<pack>/<lang>/`:

```yaml
---
id: local-id
title: Human title
related: [destination-or-chunk-id, …]
tags: [… ]
---

Body text handed to the LLM when retrieved. No URL, domain, or email literals
(same rule as packs tests / ADR 09).
```

Pack metadata in `corpus/<pack>/_pack.md`:

```yaml
---
id: cv
description: …
minScore: 0.45
---

systemPromptFragment prose…
```

`docs/` remains the product ADR vault ([ADR 11](adr-11-obsidian-vault.md)). It is **not** the RAG corpus.

### Migration stance

1. **Layout + engine path** (`src/kodexbar/`) land with this ADR.
2. **`corpus/` + `corpus:compile`** land so markdown is the authoring SSOT; compiled packs remain what the Worker bundles.
3. Existing TypeScript chunk modules are migrated into `corpus/` and regenerated — content parity is mandatory; hand-editing generated pack chunk files after compile is forbidden.

## Positive Consequences

* Astro-compliant site layout.
* Clear review boundary for PRs (UI vs engine vs content).
* Room for `repos` / `notes` packs without bloating components.
* Same security properties: trusted compiled text only reaches the model ([ADR 09 §3](adr-09-kodexbar-security.md)).

## Negative Consequences / Trade-offs

* Two-step publish for content: edit markdown → compile → reindex.
* Generated pack files must stay committed (or built in CI before deploy) because Workers cannot read `corpus/` from disk at request time.

## Compliance & Validation

* Import direction enforced by review checklist and tests that keep resolving packs from `src/kodexbar/packs`.
* `bun test` corpus integrity rules still apply to compiled chunks (no URLs in text, `related` resolves, ES/EN coverage).
* Any PR that adds a third zone or moves `src/pages/` requires amending this ADR.
