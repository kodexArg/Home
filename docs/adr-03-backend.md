# ADR 03: Backend Architecture (Development & Production)

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

`kodexArg/Home` requires a lightweight, serverless edge backend capable of serving static pages, executing API routes, and interfacing with Cloudflare edge services (Workers AI, Vectorize DB) with minimum latency and zero server management overhead.

## Decision Outcome & Architecture

### 1. Production Backend Environment
* **Platform:** Cloudflare Workers (`@astrojs/cloudflare` adapter).
* **Target Deployment:** `https://kodexarg.com`, aliased at `www.kodexarg.com` and `home.kodexarg.com`, deployed via GitHub Actions CI/CD.
* **Execution Mode:** Hybrid. Astro's default `output: "static"` prerenders `src/pages/index.astro`; API routes (`/api/ask`, the dev-only `/api/admin/index-corpus`) opt out per-file with `export const prerender = false` and run on request.
* **Bindings Access:** Routes import `env` directly from `cloudflare:workers` and read `env.AI`, `env.VECTOR_INDEX` and `env.SESSION`. Types for these bindings are declared in [env.d.ts](../src/env.d.ts).

### 2. Development Backend Environment
* **Tooling:** **Bun** + Vite + Wrangler (`bun run dev`).
* **Local Binding Simulation:** `bunx wrangler` handles Cloudflare environment compatibility flags (`nodejs_compat`) and connects to remote/local Cloudflare bindings (`AI`, `VECTOR_INDEX`).
* **Package Manager Standard:** `bun` only. `npm`, `npx`, and `yarn` are explicitly prohibited per `AGENTS.md`.

### 3. API Contract & Answering Endpoint
`src/pages/api/ask.ts` is a **thin HTTP adapter**: parse body, rate-limit, resolve pending link offers, call `answerQuery` from `src/kodexbar/`, shape the JSON response. Embedding, Vectorize, the retrieval gate and generation live in the KodexBar module — not in the route file. Full pipeline in [ADR 10](adr-10-kodexbar-architecture.md). In-repo zone split in [ADR 13](adr-13-repo-layout.md).
