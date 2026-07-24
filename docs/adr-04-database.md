# ADR 04: Database Architecture (Development & Production)

* **Status:** Accepted
* **Date:** 2026-07-24
* **Author:** kodexArg

---

## Context & Problem Statement

To support semantic vector routing for repository destinations, session management, and potential relational state without managing external database servers, `kodexArg/Home` leverages Cloudflare's native edge data storage suite.

## Database Technologies & Usage

| Database Technology | Type / Role | Configuration Binding | Usage in Project |
| :--- | :--- | :--- | :--- |
| **Cloudflare Vectorize** | Vector Database (Cosine similarity search) | `binding: "VECTOR_INDEX"` (`index_name: "kodex-vector-index"`) | Stores 384-dim vector embeddings of kodexArg destinations for semantic intent routing. |
| **Cloudflare D1** | Serverless SQL (SQLite at the edge) | *Available on demand* | Relational data storage for structured records if required. |
| **Cloudflare KV** | Key-Value Store | `binding: "SESSION"` (`id: "<namespace-id>"`) | Low-latency storage for user sessions, rate limiting, and temporary cache. Requires an `id` field in `wrangler.jsonc`. |
| **Cloudflare Hyperdrive** | Low-latency PostgreSQL accelerator | *Available on demand* | High-speed connection pool to external PostgreSQL instances if integrated. |

## Development vs Production Differences

### 1. Production (`https://home.kodexarg.com`)
* Cloudflare Vectorize index `kodex-vector-index` (384 dimensions, cosine metric) runs on Cloudflare's global edge network.
* Access is granted via zero-trust native binding `env.VECTOR_INDEX`.

### 2. Development (`bun run dev`)
* `bunx wrangler` emulates binding declarations from [wrangler.jsonc](file:///home/kodex/kodexArg/Home/wrangler.jsonc).
* Local fallback logic in `RuleBasedStrategy` ensures that developers can test routing even without an active internet connection to remote Vectorize resources.
