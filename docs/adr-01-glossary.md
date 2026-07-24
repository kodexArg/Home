# ADR 01: Nomenclature & Domain Glossary

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

To prevent ambiguity, domain overlap, or inconsistent naming across components, router strategies, documentation, and Cloudflare configuration, this document records the official domain nomenclature for the `kodexArg/Home` repository.

## Glossary & Standard Nomenclature

| Term | Definition & Scope | Usage / Context |
| :--- | :--- | :--- |
| **`kodexArg`** | The overarching personal brand, organization, and primary domain namespace (`kodexarg.com`). | Brand / Org identity |
| **`SyV`** | **Subordinación y Valor** — The official warm orange, Pip-Boy typewriter design system. | Component styling, CSS tokens |
| **`Presentation Orange`** | Color theme palette variant featuring warm amber, candle orange (`--orange-500`), cream, and dark ink tones. | CSS variables, design system |
| **`AdaptiveRouter`** | Client/Edge strategy manager that dynamically evaluates available routing engines. | `src/lib/router/adaptiveRouter.ts` |
| **`RouterStrategy`** | Interface implemented by concrete routing strategies (`WindowAiStrategy`, `WebLlmStrategy`, `CloudflareVectorizeStrategy`, `RuleBasedStrategy`). | `src/lib/router/types.ts` |
| **`RouteDestination`** | Object representing a verified public target repository or subdomain (e.g. `cv.kodexarg.com`). | `src/lib/router/destinations.ts` |
| **`RouteResult`** | Typed outcome returned by a router strategy (`outcome: 'Action' \| 'NO_MATCH' \| 'Escalate'`). | `src/lib/router/types.ts` |
| **`RouterAction`** | Closed action payload emitted by the router containing `kind: 'navigate' \| 'confirm' \| 'status'`. | `src/lib/router/types.ts` |
| **`Harness`** | Edge-level security layer enforcing cooldowns, origin validation, session capabilities, and zero-trust bindings. | Cloudflare Worker runtime / API routes |
| **`Pip-Boy Input`** | The typewriter style text field component ([SyvInput.svelte](file:///home/kodex/kodexArg/Home/src/components/SyvInput.svelte)) featuring platen baseline rule and cell grid on focus. | UI input box |

## Decision Outcome

All codebase identifiers, component properties, API responses, and documentation MUST strictly conform to the definitions in this glossary.
