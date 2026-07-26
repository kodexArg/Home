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
* A Cloudflare Vectorize index (cosine metric) runs on Cloudflare's global edge network, holding the KodexBar corpus.
* Access is granted via zero-trust native binding `env.VECTOR_INDEX`.
* **Dimension count is fixed at creation and is a property of the embedding model.** The legacy `kodex-vector-index` was created at 384 dimensions for `@cf/baai/bge-small-en-v1.5`; KodexBar uses the multilingual `@cf/baai/bge-m3`, which requires a new index at that model's dimension count. Vectorize indexes cannot be migrated in place — changing the embedding model means creating a new index and reindexing the corpus. See [ADR 10](adr-10-kodexbar-architecture.md).

### 2. Development (`bun run dev`)
* `bunx wrangler` emulates binding declarations from [wrangler.jsonc](file:///home/kodex/kodexArg/Home/wrangler.jsonc).
* **There is no offline fallback.** The deterministic keyword matcher that used to cover a missing Vectorize connection was removed with the multi-tier router; KodexBar has a single retrieval path. Vectorize has no local emulation, so `wrangler.jsonc` sets `remote: true` on both `AI` and `VECTOR_INDEX` and development exercises the real index. Without connectivity, `/api/ask` returns the out-of-scope reply for every query — which is correct behaviour, not a degraded mode to paper over.
