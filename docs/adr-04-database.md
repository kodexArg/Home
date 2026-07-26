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
| **Cloudflare Vectorize** | Vector Database (Cosine similarity search) | `binding: "VECTOR_INDEX"` (`index_name: "kodexbar-corpus"`) | Stores `bge-m3` embeddings of the KodexBar corpus, queried with a per-pack score gate and `filter: { lang }`. |
| **Cloudflare KV** | Key-Value Store | `binding: "SESSION"` (`id: "<namespace-id>"`) | Server-side rate limiting (adr-09 §7) and pending link offers (adr-09 §8). Requires an `id` field in `wrangler.jsonc`. |

No other Cloudflare database service is bound. D1 and Hyperdrive are not part of this architecture; if a future need arises it is a new ADR, not an assumed extension of this one.

## Development vs Production Differences

### 1. Production (`https://kodexarg.com`)
* A Cloudflare Vectorize index (cosine metric, index `kodexbar-corpus`) runs on Cloudflare's global edge network, holding the KodexBar corpus.
* Access is granted via zero-trust native binding `env.VECTOR_INDEX`.
* **Dimension count is fixed at creation and is a property of the embedding model — Vectorize indexes cannot be migrated in place.** The legacy `kodex-vector-index` was created at 384 dimensions for `@cf/baai/bge-small-en-v1.5`. KodexBar embeds with the multilingual `@cf/baai/bge-m3` instead, whose dimension count differs, so it lives in a new index (`kodexbar-corpus`) created at `bge-m3`'s dimension count. **Changing the embedding model at any future point means creating another new index and reindexing the corpus — never an in-place edit.** See [ADR 10](adr-10-kodexbar-architecture.md).
* One-time index setup, using the dimension count `bun run index:corpus` reports:
  ```
  bunx wrangler vectorize create kodexbar-corpus --dimensions=<N> --metric=cosine
  bunx wrangler vectorize create-metadata-index kodexbar-corpus --property-name=lang --type=string
  ```
  The metadata index on `lang` is what makes `filter: { lang }` work at query time.

### 2. Development (`bun run dev`)
* `bunx wrangler` emulates binding declarations from [wrangler.jsonc](file:///home/kodex/kodexArg/Home/wrangler.jsonc).
* **`wrangler.jsonc` sets `remote: true` on both `AI` and `VECTOR_INDEX`, and this is deliberate, not a leftover.** Vectorize has no local emulation — without `remote: true`, `astro dev` would query an empty local stub and every answer would degrade to the out-of-scope reply. There is no fallback matcher any more (the deterministic keyword matcher belonged to the retired multi-tier router); KodexBar has a single retrieval path, so dev must exercise the real index. `remote: true` is also what lets `bun run index:corpus` write to the real index from a dev server with no API token — see `src/pages/api/admin/index-corpus.ts`.
* **There is no offline fallback.** Without connectivity, `/api/ask` returns the out-of-scope reply for every query — which is correct behaviour, not a degraded mode to paper over.
