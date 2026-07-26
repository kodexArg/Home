# ADR 08: Environment Variables & Security Bindings Architecture

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

Managing API credentials, database connections, and model parameters securely is critical to prevent credential leaks, API abuse, and key exposure in public repositories.

## Decision Outcome & Rules

### 1. Zero Hardcoded Secrets Policy
* NO secret keys, API tokens, passwords, or credentials may ever be committed to git or stored in client-side code.
* All external service communication MUST use zero-trust native Cloudflare environment bindings wherever possible.

### 2. Native Cloudflare Environment Bindings
Cloudflare Workers AI and Cloudflare Vectorize run via native IPC bindings declared in [wrangler.jsonc](file:///home/kodex/kodexArg/Home/wrangler.jsonc):

```jsonc
{
  "ai": {
    "binding": "AI",
    "remote": true
  },
  "vectorize": [
    {
      "binding": "VECTOR_INDEX",
      "index_name": "kodexbar-corpus",
      "remote": true
    }
  ]
}
```

Because these operate directly over Cloudflare's internal hypervisor, **no API tokens or headers are passed or stored** — including for `bun run index:corpus`, which writes to the real index from `bun run dev`. Both bindings carry `remote: true` because Vectorize has no local emulation; see [ADR 04 §2](adr-04-database.md) for why that is required rather than optional, and [ADR 10](adr-10-kodexbar-architecture.md) for why the index is fixed-dimension and cannot be migrated in place.

### 3. TypeScript Type Safety ([src/env.d.ts](file:///home/kodex/kodexArg/Home/src/env.d.ts))
Runtime environment types are bound to `App.Locals.runtime.env` so Astro API endpoints safely dereference `env.AI` and `env.VECTOR_INDEX` with full editor completion and build validation.

### 4. Local Development vs Production Secret Isolation
* Environment variables for local development are loaded via `.env` (gitignored).
* Production environment secrets are stored in Cloudflare Pages / GitHub Actions Secrets and injected at deployment time.
