# kodexArg / Home

The entry point to Gabriel Cavedal's identity online. A single minimal input box at [kodexarg.com](https://kodexarg.com) — no nav, no card grid — that answers, in Spanish or English, who he is, what he has done, what he can do, and points to where the rest lives: the CV, the GitHub organization, the docs, the design system.

The assistant behind the box is **KodexBar**: a single-tier retrieval-augmented generator running entirely inside a Cloudflare Worker. A visitor's query is embedded, matched against a committed corpus in Cloudflare Vectorize, and — only if it scores above a per-topic threshold — answered by a small LLM grounded in the retrieved text. Off-topic queries never reach a model. See [`docs/PRD.md`](docs/PRD.md) for the product spec, [`docs/adr-10-kodexbar-architecture.md`](docs/adr-10-kodexbar-architecture.md) for the architecture, and [`docs/adr-09-kodexbar-security.md`](docs/adr-09-kodexbar-security.md) for why the model can answer in free prose without being able to hallucinate a link.

## Stack

Astro 7 + Svelte 5 islands, deployed as a Cloudflare Worker (`@astrojs/cloudflare`). Embeddings via `@cf/baai/bge-m3`, generation via `@cf/meta/llama-3.1-8b-instruct-fp8`, both Cloudflare Workers AI. Retrieval via Cloudflare Vectorize (`kodexbar-corpus`). Rate limiting and pending link offers via Cloudflare KV (`SESSION`). **Bun** is the only supported package manager and script runner — do not use `npm`, `npx` or `yarn`.

## Running it locally

```
bun install
bun run dev
```

This starts `astro dev` at `http://localhost:4321`. Both Cloudflare bindings (`AI`, `VECTOR_INDEX`) are declared with `remote: true` in [`wrangler.jsonc`](wrangler.jsonc), so a local dev server talks to the real Workers AI and the real Vectorize index — there is no offline emulation for Vectorize, and no fallback path when it is unreachable. See [`docs/adr-04-database.md`](docs/adr-04-database.md) for why that is deliberate.

Other commands:

```
bun run build     # astro build — production Worker + static assets in dist/
bun run preview   # astro preview
bun test          # bun test — runs everything in tests/
```

## Adding corpus content

KodexBar's knowledge lives in **knowledge packs** — plain TypeScript, no database migration — under [`src/lib/kodexbar/packs/`](src/lib/kodexbar/packs/). Each pack bundles a system-prompt fragment, a per-pack retrieval threshold (`minScore`), and a list of chunks (`id`, `lang`, `title`, `text`, `related`, `tags`). `related` links a chunk to the destination ids and other chunk ids that back it up — that graph is what lets one query surface a claim, its evidence, and the right link together.

To add or edit content:

1. Edit or add chunks in a pack under `src/lib/kodexbar/packs/`, or register a new pack in `src/lib/kodexbar/packs/index.ts`.
2. Start a dev server: `bun run dev`.
3. Reindex: `bun run index:corpus`.

The reindex script drives a dev-only endpoint (`/api/admin/index-corpus`, 404 outside `astro dev`) that embeds every chunk and upserts it into Vectorize. It is idempotent for edited chunks (stable ids), but does not remove chunks deleted from a pack — recreate the index if a pack shrinks and the removal must actually take effect.

Adding a knowledge domain that is not authored by Gabriel Cavedal (third-party content, scraped material, user submissions) is an architectural change, not an ordinary content edit — see [`docs/adr-09-kodexbar-security.md` §3](docs/adr-09-kodexbar-security.md).

Every link KodexBar can hand out is listed in [`src/lib/kodexbar/destinations.ts`](src/lib/kodexbar/destinations.ts), the only source of URLs in the system. Membership rule: public and live, verified before adding.

## Deployment

Deployment is automated: GitHub Actions runs on every push to `main` (`.github/workflows/deploy.yml`) — install, test, build, then `bunx wrangler deploy`. There is no manual `wrangler deploy` path for production. The Worker serves `kodexarg.com` (the apex, primary), with `www.kodexarg.com` and `home.kodexarg.com` as aliases pointing at the same deployment.

## Documentation

`docs/` is an Obsidian vault, not a folder of loose Markdown — the ADRs and the PRD are meant to be read there, with the vault config committed and versioned (see [`docs/adr-11-obsidian-vault.md`](docs/adr-11-obsidian-vault.md)). Start at [`docs/PRD.md`](docs/PRD.md), then the ADRs for how and why.
