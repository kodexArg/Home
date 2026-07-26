# ADR 03: Backend Architecture (Development & Production)

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

`kodexArg/Home` requires a lightweight, serverless edge backend capable of serving static pages, executing API routes, and interfacing with Cloudflare edge services (Workers AI, Vectorize DB) with minimum latency and zero server management overhead.

## Decision Outcome & Architecture

### 1. Production Backend Environment
* **Platform:** Cloudflare Pages / Cloudflare Workers (`@astrojs/cloudflare` adapter).
* **Target Deployment:** `https://home.kodexarg.com` deployed via GitHub Actions CI/CD.
* **Execution Mode:** Hybrid / Server-side rendering (`output: "static"` with `prerender = false` on dynamic API endpoints like `/api/ask`).
* **Bindings Access:** Native Cloudflare Worker `locals.runtime.env` exposing `env.AI` and `env.VECTOR_INDEX`.

### 2. Development Backend Environment
* **Tooling:** **Bun** + Vite + Wrangler (`bun run dev`).
* **Local Binding Simulation:** `bunx wrangler` handles Cloudflare environment compatibility flags (`nodejs_compat`) and connects to remote/local Cloudflare bindings (`AI`, `VECTOR_INDEX`).
* **Package Manager Standard:** `bun` only. `npm`, `npx`, and `yarn` are explicitly prohibited per `AGENTS.md`.

### 3. API Contract & Answering Endpoint
`src/pages/api/ask.ts` parses the request, embeds the query with Cloudflare Workers AI (`@cf/baai/bge-m3`), queries Cloudflare Vectorize, applies the retrieval gate, and — only when the gate opens — calls the generation model and returns a structured `KodexAnswer` JSON payload. Full pipeline in [ADR 10](adr-10-kodexbar-architecture.md).
