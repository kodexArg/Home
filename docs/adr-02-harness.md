# ADR 02: Harness Architecture & PRD / Directives Linkage

* **Status:** Accepted (Open for extension)
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

The **Harness** represents the authoritative security, validation, and execution guardrail for `kodexArg/Home`. It ensures that human interaction occurs exclusively through the official UI, prevents API scraping or denial-of-wallet attacks, and guarantees strict alignment between specification documents and execution rules.

## Core Directives

### 1. Importance of `PRD.md` as Single Source of Truth (SSOT)
[PRD.md](file:///home/kodex/kodexArg/Home/docs/PRD.md) serves as the primary product contract. No feature, routing behavior, or edge capability may be introduced into production without being specified in `PRD.md`. The harness enforces that code implementations reflect the PRD guidelines without scope creep.

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
