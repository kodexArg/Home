---
id: "syv-frontend"
title: "SyV frontend — Astro static site for the Subordinación y Valor universe"
visibility: public
importance: normal
source_repo: "syv-frontend"
org: "kodexArg"
default_branch: "main"
primary_language: "Astro"
repo_kind: "application"
status: "active"
related: ["syv-docs"]
tags: ["astro", "cloudflare-workers", "static-site", "syv", "subordinacion-y-valor", "game-universe", "canon", "bun", "wrangler", "presentation-orange", "spanish"]
problems_solved:
  - "The Subordinación y Valor (SyV) game universe needs a dedicated public web presence — a branded landing and documentation surface separate from the kodexArg Home apex site."
  - "Canon-review and agent-team handoff reports must be published in a readable, on-brand format without standing up a CMS, wiki engine, or full documentation platform."
  - "SyV public pages should deploy to the edge with minimal operational overhead: static HTML/CSS, Cloudflare Workers assets, and a workflow that can pull the syv-docs corpus submodule when CI is re-enabled."
technologies:
  - "Astro 6"
  - "@astrojs/cloudflare (static output adapter)"
  - "Cloudflare Workers (asset hosting + custom domain route)"
  - "Cloudflare KV (SESSION binding — adapter requirement)"
  - "Bun"
  - "Wrangler 4"
  - "Mermaid 11 (client-side CDN import on canon report page)"
  - "Presentation Orange / SyV design tokens (Nunito + DM Mono)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# SyV frontend

> **Problem thesis (required):** kodexArg's **Subordinación y Valor** (SyV) universe — a Spanish-language game-world with a large markdown corpus maintained in the sibling `syv-docs` repository — needs its own lightweight public web front door. This repo is that front door: a static Astro site deployed to Cloudflare Workers that presents a branded landing page, themed 404 handling, and at least one long-form **canon report** page summarizing agent-driven corpus corrections. It deliberately avoids CMS complexity, server-side rendering, APIs, and chat — it is a publish-and-forget documentation shell for universe identity and operator handoffs.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-frontend` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Static Astro site publishing the Subordinación y Valor universe — landing, canon status reports, and edge-hosted assets on the SyV production host. |
| Audience | SyV worldbuilders and operators (Gabriel / kodexArg), agent teams producing canon-review reports, future players or readers discovering the universe, and developers maintaining the Cloudflare deployment. |

## 2. Problems it solves

### P1 — No dedicated public surface for the SyV universe

- **Who hurts:** Operators of the SyV project who maintain lore in `syv-docs` but need a **web identity** distinct from the kodexArg Home apex site; visitors who should discover SyV as its own branded universe rather than a subsection of a personal homepage.
- **Pain today:** A markdown corpus alone is not a public entry point. Without a small frontend, canon work stays invisible to anyone who does not clone repositories or read raw files. A full wiki (Obsidian Publish, MkDocs, etc.) adds moving parts SyV does not yet need.
- **How this repo answers:** Provides a minimal three-page static site: a hero landing (`src/pages/index.astro`) with lowercase typographic branding and a single nav link to the canon report; a themed 404 (`src/pages/404.astro`) wired through Cloudflare `not_found_handling`; and a long-form report page at `/syv/` (`src/pages/syv/index.astro`) that presents agent-team canon corrections in card-based sections with status chips and a client-rendered Mermaid flowchart.
- **Out of scope:** Full corpus browsing, search, wikilink resolution, interactive maps, game client, user accounts, or RAG/chat (those live elsewhere in kodexArg, e.g. Home's KodexBar for cross-org questions).

### P2 — Publishing canon-review handoffs in operator-readable form

- **Who hurts:** The operator receiving agent-team output after a canon pass — e.g. five resolved inconsistencies, two open decisions, orphan character fixes — who needs a **single scrollable report** rather than parsing git diffs across `syv-docs`.
- **Pain today:** Agent teams close canon rounds with structured findings (dates, character merges, typo fixes, MOC backlink repairs) that are hard to skim from commit logs alone. Operators need explicit "resolved vs pending" status and decision prompts.
- **How this repo answers:** The `/syv/` page is a hand-crafted report template: kicker labels, numbered sections, good/alt cards, chip badges (`ok`, `work`, `stop`), and a Mermaid diagram illustrating the canon-review pipeline (lead → canon/personajes/narrativa → judge → closed or doubts). Content is embedded directly in the Astro page (not fetched from the submodule at build time in the current tree), making it a deliberate publish step when a canon round closes.
- **Out of scope:** Automated report generation from `syv-docs` detectors, live sync with corpus state, or multi-report archives (only one report page exists today; future reports would add pages or a build step).

### P3 — Low-maintenance edge hosting for a tiny static footprint

- **Who hurts:** Operators who want SyV on a dedicated custom domain without managing VMs, containers, or a Node server in production.
- **Pain today:** Even small sites accumulate hosting choices; SyV needs static files at the edge with correct 404 behavior and session KV compatibility for the Astro Cloudflare adapter.
- **How this repo answers:** `output: 'static'` in `astro.config.mjs` with `@astrojs/cloudflare` adapter; `wrangler.jsonc` defines the Worker name, custom-domain route, `SESSION` KV binding, asset 404 handling, and observability. Build output is deployed via `bun run deploy` (`astro build && wrangler deploy`). The project was renamed from `syv-astro` to `syv-frontend` while keeping the same production host (per `CHANGELOG.md`).
- **Out of scope:** Multi-environment staging, preview deployments, D1/R2/Vectorize bindings, SSR/API routes, or active CI (the GitHub Actions workflow file exists but is **disabled** — see §10).

## 3. Product / idea

SyV frontend is a **static Astro 6 site** with a shared `Base.astro` layout, global Presentation Orange CSS (`src/styles/global.css`), and page-level scoped styles. The mental model is **build-time HTML + edge asset delivery** — no server routes, no islands framework beyond inline client scripts.

The site speaks Spanish in user-facing copy (titles, 404 text, canon report prose). Typography uses Nunito (sans) and DM Mono (kickers, chips, nav links) loaded from Google Fonts. The visual language — dark ink backgrounds (`--ink-1000` through `--ink-600`), cream text, orange accent (`--orange-500`), sage/teal semantic chips — matches the broader kodexArg Presentation Orange / SyV aesthetic used on Home.

The `syv-docs` git submodule (`/.gitmodules`) points at `kodexArg/syv-docs` and is checked out recursively in the (disabled) deploy workflow, signaling intent to co-locate or eventually build from the corpus. In a shallow clone without submodule init, `syv-docs/` is an empty directory — the live site content today is entirely in `src/pages/`.

### 3.1 North-star use cases

1. **Visitor discovery** — Land on `/`, read "subordinación y valor", follow the nav link to the canon report.
2. **Operator handoff** — After an agent canon pass on `syv-docs`, publish or update `/syv/` with resolved items, open decisions, and next steps; operator reads chips and cards instead of git history.
3. **Broken link recovery** — Any unknown path serves the themed 404 with return-to-home link (Cloudflare `assets.not_found_handling: 404-page`).

### 3.2 Non-goals

- No README or constitution in-repo (operators rely on kodexArg conventions and `CHANGELOG.md`).
- No `.claude/` agent scaffolding in this repository (unlike larger kodexArg apps).
- No API, auth, database, or search.
- No automated corpus-to-site pipeline yet — report content is authored in Astro source.
- CI deploy is intentionally disabled (`deploy.yml.disabled`); manual or external deploy expected until re-enabled.

## 4. Technology stack

Derived from manifests and source structure only; lockfile not quoted.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node ≥ 22.12.0 (engines); Bun for install/scripts | `package.json` |
| Frontend | Astro 6, static output | `package.json`, `astro.config.mjs` |
| Edge adapter | `@astrojs/cloudflare` | `package.json`, `astro.config.mjs` |
| Deploy CLI | Wrangler 4 | `package.json`, `wrangler.jsonc` |
| Styling | Vanilla CSS custom properties, scoped page `<style>` blocks | `src/styles/global.css`, page `.astro` files |
| Diagrams | Mermaid 11 ESM import in client `<script type="module">` | `src/pages/syv/index.astro` |
| Data | None (static) | — |
| Infra / deploy | Cloudflare Workers + assets + custom domain route; KV `SESSION` | `wrangler.jsonc` |
| CI | GitHub Actions (disabled) | `.github/workflows/deploy.yml.disabled` |
| Corpus (external) | `syv-docs` git submodule | `.gitmodules` |
| Tests | None evident | — |

### 4.1 Notable dependencies (curated)

- `astro` (^6.4.7) — SSG framework; all pages are `.astro` files with optional client scripts.
- `@astrojs/cloudflare` (^13.7.0) — Adapts static build for Workers asset serving; requires `SESSION` KV namespace per adapter sessions support.
- `wrangler` (^4) — Deploy and local preview against Cloudflare.
- Mermaid (CDN ESM, not in `package.json`) — Client-only flowchart on the canon report page; loaded dynamically to avoid SSR parsing issues noted in source comments.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `src/pages/index.astro` — Universe landing hero.
  - `src/pages/404.astro` — Themed not-found page.
  - `src/pages/syv/index.astro` — Canon closure report (long-form).
- **Layouts:** `src/layouts/Base.astro` — HTML shell, meta, favicon link, global CSS import.
- **Styles:** `src/styles/global.css` — Design tokens, typography, cards, chips, diagram container, responsive breakpoints.
- **Static assets:** `public/favicon.svg` — On-brand chevron icon (orange on dark).
- **Configuration:** `astro.config.mjs` (static + Cloudflare adapter + `site` canonical), `wrangler.jsonc` (Worker name, routes, KV, assets, observability).
- **Package / lock:** `package.json`, `bun.lock` — Bun-managed deps (not ingested).
- **Submodule mount:** `syv-docs/` — Git submodule root for `kodexArg/syv-docs` (empty without `git submodule update`).
- **CI:** `.github/workflows/deploy.yml.disabled` — Bun install, recursive submodules, `bun run deploy` with Cloudflare secrets (workflow inactive).
- **Changelog:** `CHANGELOG.md` — Rename history, 404 fix, favicon fix.
- **Docs vaults:** No `docs/`, `.docs/`, `ADR*`, or root `README*` present.
- **Agent scaffolding:** No `.claude/`, `.agents/`, or `SKILL.md` trees found.
- **Generated / vendor:** `dist/`, `.astro/`, `node_modules/`, `.wrangler/` are gitignored and not scanned.

## 6. Configuration & contracts (no secrets)

### Environment and bindings

- **`.dev.vars` / `.env` / `.env.*`** — Gitignored; not read. Wrangler local secrets would live here for deploy credentials.
- **`SESSION` KV namespace** — Required binding name in `wrangler.jsonc` for `@astrojs/cloudflare` adapter sessions; namespace id is pinned in config (infrastructure id, not quoted here).
- **`site` in `astro.config.mjs`** — Canonical site URL for Astro (production SyV host).
- **`routes`** — Single custom-domain pattern for the SyV production host.
- **`assets.not_found_handling`** — Set to `404-page` so Cloudflare serves `404.astro` output for missing paths.
- **`observability.enabled`** — Cloudflare Workers observability on.
- **`compatibility_flags`** — `nodejs_compat`, `global_fetch_strictly_public`.

### CI secrets (names only, from disabled workflow)

- `CLOUDFLARE_API_TOKEN` — Deploy authentication (GitHub secret).
- `CLOUDFLARE_ACCOUNT_ID` — Target account (value in workflow env; not reproduced here).

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no application API routes**. It is a **static site** served as Cloudflare Worker assets. Documented HTTP surface:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | SyV universe landing hero | none |
| `GET` | `/syv/` | Canon closure report (tanda de canon) | none |
| `GET` | `/favicon.svg` | Site favicon | none |
| `GET` | `*` (unmatched) | Themed 404 page via asset not-found handling | none |

No `POST`, `PUT`, or API handlers exist under `src/pages/`. No OpenAPI, no Workers `fetch` handler source in this repo.

### 6.2 Other interfaces

- **npm/bun scripts:** `dev` (astro dev), `build` (astro build), `preview` (astro preview), `deploy` (build + wrangler deploy).
- **Git submodule:** `syv-docs` — external corpus repository; interface is git submodule checkout, not runtime API.
- **Mermaid client script:** Inline module on `/syv/` fetches Mermaid ESM from a public CDN and renders into `#diagram-container`.

## 7. Data & persistence

- **No application database, KV reads, or server-side state** in the static page layer. The `SESSION` KV binding exists for adapter compatibility but the current pages do not implement session-backed features.
- **Content persistence** lives in git: Astro source for published pages; long-term lore in the `syv-docs` submodule (separate repo).
- **Topology:** Build-time static generation → `dist/` (gitignored) → Cloudflare Workers assets at the edge. No origin server, no Postgres/D1/R2 in this repo.

## 8. Docs & agent memory (required scan)

Scanned paths and findings:

1. **Root `README*`** — **Not present.** No root readme; identity comes from GitHub description, `CHANGELOG.md`, and page content.
2. **`docs/**` and `.docs/**`** — **Not present.**
3. **ADR / PRD / constitution** — **Not present.**
4. **`.claude/**` and agent skill trees** — **Not present** (confirmed via tree search).
5. **`CHANGELOG.md`** — Documents project rename (`syv-astro` → `syv-frontend`), Cloudflare 404 handling fix, favicon and 404 page additions.
6. **`.gitmodules`** — Declares `syv-docs` submodule dependency on `kodexArg/syv-docs`.
7. **`src/pages/syv/index.astro`** — Embeds the June 2026 canon report: five resolved corpus issues (foundational date, century typo, Shipibo-Conibo population split, 27 orphan character backlinks, Walter narrative consolidation) and two operator decisions (two Marías merge vs separate; Lisa character sheet).
8. **`.github/workflows/deploy.yml.disabled`** — Documents intended CI: checkout with recursive submodules, Bun setup, frozen lockfile install, deploy with Cloudflare credentials.

Evidence bullets (paths only):

- `CHANGELOG.md` — release and rename history.
- `.gitmodules` — submodule contract.
- `src/pages/index.astro` — landing copy and nav.
- `src/pages/syv/index.astro` — canon report content and Mermaid pipeline diagram.
- `.github/workflows/deploy.yml.disabled` — deploy procedure (inactive).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; summary contains no clone URLs as product links.
- **Auth model:** None — all pages are anonymous static HTML.
- **Secrets:** `.env*`, `.dev.vars`, and credential files are gitignored; this summary contains no tokens, API keys, PEM material, or connection strings. Cloudflare account and KV ids from config/workflow are infrastructure identifiers omitted from body text.
- **Third-party load:** Canon page loads Mermaid from a public CDN at runtime (`securityLevel: 'loose'` in Mermaid init) — acceptable for a static diagram but worth noting for CSP hardening if added later.
- **No user data collection** evident in source (no analytics scripts, forms, or cookies in `Base.astro`).

## 10. Operational picture

### Local development

```bash
bun install
bun run dev      # astro dev — local dev server
bun run build    # static build to dist/
bun run preview  # preview production build
```

Node ≥ 22.12.0 required per `package.json` engines.

### Deployment

- **Intended:** `bun run deploy` → `astro build && wrangler deploy` with Cloudflare API token and account id.
- **CI:** `.github/workflows/deploy.yml.disabled` — workflow exists but filename suffix means it does **not** run on push to `main`. Operators likely deploy manually or via another pipeline until re-enabled.
- **Submodule:** Production CI design checks out `syv-docs` recursively before build; current site pages do not appear to consume submodule files at build time.
- **Hardware constraints:** None — edge Workers deployment.

## 11. Open questions / unknowns

- **Why is CI disabled?** `deploy.yml.disabled` suggests deliberate pause; reason not documented in-repo.
- **Submodule integration:** `syv-docs/` is declared but empty in shallow clone; unclear whether future builds will generate pages from corpus markdown or remain hand-authored Astro.
- **Report archive:** Only one canon report page exists; no routing pattern for historical reports.
- **SESSION KV usage:** Binding is configured; no session features visible in current static pages — may be adapter boilerplate only.
- **Relationship to Home:** Home's corpus mentions SyV as a future knowledge pack; this repo is the dedicated SyV host, not integrated with KodexBar RAG.
- **No tests, lint config, or README** — onboarding relies on kodexArg conventions and sibling repo knowledge.
