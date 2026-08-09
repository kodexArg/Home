# kodexArg / Home

The entry point to Gabriel Cavedal's identity online. A single minimal input box at [kodexarg.com](https://kodexarg.com) — no nav, no card grid — that answers, in Spanish or English, who he is, what he has done, what he can do, and points to where the rest lives: the CV, the GitHub organization, the docs, the design system.

The assistant behind the box is **KodexBar**: a single-tier retrieval-augmented generator running entirely inside a Cloudflare Worker. A visitor's query is embedded, matched against a committed corpus in Cloudflare Vectorize, and — only if it scores above a per-topic threshold — answered by a small LLM grounded in the retrieved text. Off-topic queries never reach a model. See [`docs/PRD.md`](docs/PRD.md) for the product spec, [`docs/adr-10-kodexbar-architecture.md`](docs/adr-10-kodexbar-architecture.md) for the RAG architecture, [`docs/adr-13-repo-layout.md`](docs/adr-13-repo-layout.md) for the in-repo zone split, and [`docs/adr-09-kodexbar-security.md`](docs/adr-09-kodexbar-security.md) for why the model can answer in free prose without being able to hallucinate a link.

## Stack

Astro 7 + Svelte 5 islands, deployed as a Cloudflare Worker (`@astrojs/cloudflare`). Embeddings via `@cf/baai/bge-m3`, generation via `@cf/zai-org/glm-4.7-flash`, both Cloudflare Workers AI. Retrieval via Cloudflare Vectorize (`kodexbar-corpus`). Rate limiting and pending link offers via Cloudflare KV (`SESSION`). **Bun** is the only supported package manager and script runner — do not use `npm`, `npx` or `yarn`.

## Repo layout (three zones)

| Zone | Path | Role |
|------|------|------|
| Site | `src/pages/`, `src/layouts/`, `src/components/`, `src/lib/chat`, `src/lib/ui` | Astro + Svelte surface |
| Engine | `src/kodexbar/` | RAG application logic (no `.svelte`) |
| Corpus | `corpus/` | Markdown authoring SSOT → compile → packs |

API routes under `src/pages/api/` are thin adapters. Details: [`docs/adr-13-repo-layout.md`](docs/adr-13-repo-layout.md).

## Running it locally

```
bun install
bun run dev
```

This starts `astro dev` at `http://localhost:4321`. Both Cloudflare bindings (`AI`, `VECTOR_INDEX`) are declared with `remote: true` in [`wrangler.jsonc`](wrangler.jsonc), so a local dev server talks to the real Workers AI and the real Vectorize index — there is no offline emulation for Vectorize, and no fallback path when it is unreachable. See [`docs/adr-04-database.md`](docs/adr-04-database.md) for why that is deliberate.

Other commands:

```
bun run build            # astro build — production Worker + static assets in dist/
bun run preview          # astro preview
bun test                 # bun test — runs everything in tests/
bun run corpus:compile   # corpus/*.md → src/kodexbar/packs/
bun run index:corpus     # upsert compiled packs into Vectorize (needs bun run dev)
```

## Adding corpus content

Knowledge is authored as markdown under [`corpus/`](corpus/). Each pack has `_pack.md` (id, description, `minScore`, system-prompt fragment) and per-language chunk files with frontmatter (`id`, `title`, `related`, `tags`) plus body text. `related` links a chunk to destination ids and other chunk ids — that graph is what lets one query surface a claim, its evidence, and the right link together.

To add or edit content:

1. Edit or add markdown under `corpus/<pack>/<lang>/` (and `_pack.md` when registering a pack).
2. `bun run corpus:compile` — writes runtime modules under `src/kodexbar/packs/`.
3. Start a dev server: `bun run dev`.
4. Reindex: `bun run index:corpus`.

Do not hand-edit generated chunk modules after compile. The reindex script drives a dev-only endpoint (`/api/admin/index-corpus`, 404 outside `astro dev`) that embeds every chunk and upserts it into Vectorize. It is idempotent for edited chunks (stable ids), but does not remove chunks deleted from a pack — recreate the index if a pack shrinks and the removal must actually take effect.

Adding a knowledge domain that is not authored by Gabriel Cavedal (third-party content, scraped material, user submissions) is an architectural change, not an ordinary content edit — see [`docs/adr-09-kodexbar-security.md` §3](docs/adr-09-kodexbar-security.md).

Every link KodexBar can hand out is listed in [`src/kodexbar/destinations.ts`](src/kodexbar/destinations.ts), the only source of URLs in the system. Membership rule: public and live, verified before adding.

## Deployment

Deployment is automated: GitHub Actions runs on every push to `main` (`.github/workflows/deploy.yml`) — install, test, build, then `bunx wrangler deploy`. There is no manual `wrangler deploy` path for production. The Worker serves `kodexarg.com` (the apex, primary), with `www.kodexarg.com` and `home.kodexarg.com` as aliases pointing at the same deployment.

## Documentation

`docs/` is an Obsidian vault for ADRs and the PRD — not the RAG corpus (see [`docs/adr-11-obsidian-vault.md`](docs/adr-11-obsidian-vault.md) and [`docs/adr-13-repo-layout.md`](docs/adr-13-repo-layout.md)). Start at [`docs/PRD.md`](docs/PRD.md), then the ADRs for how and why.
