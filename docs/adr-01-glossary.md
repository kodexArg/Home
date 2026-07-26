# ADR 01: Nomenclature & Domain Glossary

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

To prevent ambiguity, domain overlap, or inconsistent naming across components, knowledge packs, documentation, and Cloudflare configuration, this document records the official domain nomenclature for the `kodexArg/Home` repository.

> **Retired 2026-07-26.** `AdaptiveRouter`, `RouterStrategy`, `WindowAiStrategy`, `CloudflareVectorizeStrategy`, `RuleBasedStrategy`, `RouteResult`, `RouterAction` and `RouteDestination` belonged to the multi-tier router replaced by KodexBar. They are gone from the codebase; see [ADR 10](adr-10-kodexbar-architecture.md). Do not reintroduce these names.

## Glossary & Standard Nomenclature

| Term | Definition & Scope | Usage / Context |
| :--- | :--- | :--- |
| **`kodexArg`** | The overarching personal brand, organization, and primary domain namespace (`kodexarg.com`). | Brand / Org identity |
| **`SyV`** | **Subordinación y Valor** — The official warm orange, Pip-Boy typewriter design system. | Component styling, CSS tokens |
| **`Presentation Orange`** | Color theme palette variant featuring warm amber, candle orange (`--orange-500`), cream, and dark ink tones. | CSS variables, design system |
| **`KodexBar`** | The assistant behind the homepage input box: single-tier retrieval-augmented answering over Cloudflare Workers AI + Vectorize. Answers questions about Gabriel Cavedal and hands out links. Not a router. | `src/lib/kodexbar/`, `src/pages/api/ask.ts` |
| **`LinkDestination`** | A place KodexBar may send a visitor. Membership rule: **public and live**. The only source of URLs in the system. | `src/lib/kodexbar/destinations.ts` |
| **`KnowledgePack`** | A pluggable body of knowledge (chunks + system prompt fragment + retrieval threshold). The open/closed seam: a new subject area is a new pack, not an engine change. | `src/lib/kodexbar/types.ts` |
| **`CorpusChunk`** | One retrievable unit of context. `related` holds destination and chunk ids — this is the knowledge graph. | `src/lib/kodexbar/types.ts` |
| **`RawModelAnswer`** | What the LLM is contractually required to return: `{ text, linkIds }`. Carries **ids, never URLs** — see ADR 09 §1. | `src/lib/kodexbar/types.ts` |
| **`KodexAnswer`** | The validated reply rendered by the UI: one plain paragraph plus resolved `LinkDestination[]`. | `src/lib/kodexbar/types.ts` |
| **`Harness`** | Edge-level security layer enforcing cooldowns, origin validation, session capabilities, and zero-trust bindings. | Cloudflare Worker runtime / API routes |
| **`Pip-Boy Input`** | The typewriter style text field component ([SyvInput.svelte](file:///home/kodex/kodexArg/Home/src/components/SyvInput.svelte)) featuring platen baseline rule and cell grid on focus. | UI input box |

## Decision Outcome

All codebase identifiers, component properties, API responses, and documentation MUST strictly conform to the definitions in this glossary.
