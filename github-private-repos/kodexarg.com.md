---
id: "kodexarg.com"
title: "kodexarg.com — personal liminal home site"
visibility: private
importance: high
source_repo: "kodexarg.com"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "active"
related: []
tags: ["astro", "svelte", "cloudflare-workers", "bun", "static-site", "personal-site", "islands", "design-system", "syv", "rpg-docs"]
problems_solved:
  - "Provides a minimal-JS personal home presence with a curated liminal aesthetic instead of a heavy marketing site or bloated SPA."
  - "Establishes a modern, maintained deploy target on Cloudflare Workers with static assets rather than legacy Pages patterns."
  - "Keeps vendored design components synchronized with a separate design-system source of truth while hosting static RPG design documentation."
technologies:
  - "Astro 6"
  - "Svelte 5 (runes)"
  - "Cloudflare Workers (static assets)"
  - "Bun"
  - "TypeScript"
  - "Wrangler 4"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# kodexarg.com

> **Problem thesis (required):** This repository is the kodexArg personal home site — a deliberately sparse, full-viewport canvas that ships almost no JavaScript by default, uses Svelte islands only where interactivity is justified, and deploys to Cloudflare Workers with static assets. It solves the need for a fast, agent-maintainable personal landing page with a terminal-style console, generative atmosphere, and links into sibling properties (CV, design system), while also hosting static design documents for the Subordinación y Valor (SyV) tabletop RPG character-creation system.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/kodexarg.com` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Personal liminal home: Astro static pages + Svelte 5 islands on Cloudflare Workers, bun-only toolchain, candlelit dark aesthetic. |
| Audience | kodexArg (owner), coding agents maintaining the site, visitors to the live home, and internal readers of SyV RPG design docs hosted as static pages. |

## 2. Problems it solves

### P1 — Personal home without SPA bloat

- **Who hurts:** A solo operator who wants a distinctive personal presence on the web without shipping a heavy client bundle or maintaining a CMS.
- **Pain today:** Typical personal sites either look generic (template blogs) or require large JavaScript frameworks for small interactive touches. Rebuilds also tend to accumulate legacy patterns (Svelte 4, Pages-based deploys) that agents and humans must untangle later.
- **How this repo answers:** Astro 6 file-based routing keeps pages as zero-JS `.astro` by default. Only `Aurora.svelte` (generative background) and `Terminal.svelte` (typeable console) hydrate via explicit `client:only="svelte"` directives. The home is a fixed `100dvh` canvas with no scroll — wordmark header, warm aurora atmosphere, bottom-left terminal with a seeded CV link and echo-only typing. ADR 0001 locks Svelte 5 runes and bans Svelte 4 patterns.
- **Out of scope:** Blog engine, CMS, authentication, user accounts, server-side business logic, or a general-purpose component library (that lives in the separate design repo).

### P2 — Deliberate Cloudflare Workers deploy model

- **Who hurts:** Operators deploying static sites to Cloudflare who need a forward-looking platform choice and a CI-owned pipeline.
- **Pain today:** Cloudflare Pages is in maintenance mode relative to Workers-first static asset serving. Hand-maintained `wrangler` `main` entries drift from what the Astro Cloudflare adapter generates at build time.
- **How this repo answers:** ADR 0002 commits to Workers with static assets via `@astrojs/cloudflare`. Root `wrangler.jsonc` stays minimal (no `main`) per ADR 0004; the adapter emits `dist/client/wrangler.json` and a deploy redirect. Push to `main` triggers Cloudflare Workers Builds CI, which auto-deploys worker `kodexarg-com` with custom-domain routes configured in `wrangler.jsonc`. A `SESSION` KV namespace binding is provisioned for future session support.
- **Out of scope:** Multi-environment staging matrices, D1/R2 data layers, or on-demand SSR (possible later but not current architecture).

### P3 — Design-system sync and RPG doc hosting

- **Who hurts:** An operator running multiple related web properties who must keep branding consistent and publish internal game-design specs alongside the public face.
- **Pain today:** Copy-pasting components between repos causes drift; RPG design docs scattered in notes are hard for agents and collaborators to reference.
- **How this repo answers:** `Wordmark.svelte` is vendored from the `design.kodexarg.com` repo (SSOT) with explicit agent instructions to propagate changes bidirectionally. Global CSS tokens in `src/styles/global.css` note lineage from the design system. Two scrollable static doc pages under `src/pages/syv/` publish SyV character-creation phases (GDDR-01) and API user stories — design specifications for a separate character-kit service, not live API code in this repo.
- **Out of scope:** Implementing the SyV Character Kit API, battle engine, or lore CMS — those are documented consumers/endpoints only.

## 3. Product / idea

The mental model is **static-first personal site + selective islands + Workers edge hosting**. After clone and `bun install`, `bun run dev` serves the site in the real workerd runtime (Astro 6 behavior). `bun run build` prerenders pages to `dist/` with client assets under `dist/client/`. Deploy is either manual `bun run deploy` (build + wrangler) or automatic on push to `main` via Workers Builds.

The home (`src/pages/index.astro`) composes:

1. **`Base.astro` layout** — HTML shell, meta, favicon, imports `global.css`, mounts `Aurora` behind page content.
2. **Header wordmark** — `Wordmark.svelte` in `static` mode (no blinking cursor, selectable, `width: max-content` so it does not block the terminal).
3. **Main terminal** — `Terminal.svelte` pinned bottom-left: seeds history with a CV link (`¿quién es kodexArg?`), accepts typed input that echoes on Enter like a real console (not a command interpreter), respects `prefers-reduced-motion`.

Removed product elements (per `AGENTS.md`): floating "door" links, `DoorField` physics, `CandleLink` on the home — do not reintroduce without explicit product decision.

### 3.1 North-star use cases

1. **Visitor lands on home** — sees warm generative aurora, kodexArg wordmark, types in the terminal for playful interaction, clicks through to the CV property via the seeded link.
2. **Agent or developer changes the site** — reads `AGENTS.md` / ADRs, uses bun only, runs `bun run check` before commit, pushes to `main` to trigger auto-deploy.
3. **RPG designer reads SyV specs** — navigates to `/syv/fases/` or `/syv/uc/` for character-creation flow and API user-story catalogs (static reference material).

### 3.2 Non-goals

- npm/npx/pnpm/yarn (forbidden by ADR 0003 and agent rules).
- Svelte 4 syntax (`export let`, `$:`, `on:click`, slots between Svelte components).
- Cloudflare Pages as deploy target.
- Reintroducing removed door/floating-link navigation without product sign-off.
- SvelteKit routing, stores, or async SSR patterns in islands (`docs/svelte.md` explicitly scopes these out).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node >= 22.12 (toolchain), Bun (package manager/scripts) | `package.json` engines; ADR 0003 |
| Frontend framework | Astro ^6.4.6, file-based `.astro` pages | `package.json`, `astro.config.mjs` |
| Interactive islands | Svelte ^5.56.3 via `@astrojs/svelte` ^8.1.2, runes only | `package.json`, ADR 0001, `docs/svelte.md` |
| Edge adapter | `@astrojs/cloudflare` ^13.7.0 | `package.json`, `astro.config.mjs`, ADR 0002 |
| Data | KV `SESSION` binding (reserved, not used in current pages) | `wrangler.jsonc` |
| Infra / deploy | Cloudflare Workers Builds on push to `main`; wrangler 4 | `AGENTS.md`, `wrangler.jsonc`, `package.json` devDependency |
| AI / agents | `AGENTS.md`, `CLAUDE.md` (symlink), `.claude/skills/svelte-core-bestpractices/` | repo root, `.claude/` |
| Tests / checks | `astro check` + `svelte-check` via `bun run check` | `package.json` scripts |

### 4.1 Notable dependencies (curated)

- `astro` — static site generator; default prerendered output with islands architecture.
- `@astrojs/cloudflare` — emits Worker + static assets bundle and generated wrangler config at build time.
- `@astrojs/svelte` — mounts Svelte 5 components with `client:*` directives.
- `svelte` — runes-based islands (`$state`, `$derived`, `$props`, `$effect`) for Aurora and Terminal only.
- `wrangler` — Cloudflare deploy CLI; root config is account-level only.
- `@astrojs/check` / `svelte-check` — type and Svelte diagnostics gate commits.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `src/pages/index.astro` — home route.
  - `src/pages/syv/fases/index.astro` — GDDR-01 character creation phases (Spanish static doc).
  - `src/pages/syv/uc/index.astro` — SyV Character Kit user stories and endpoint catalog (Spanish static doc).
- **Layouts:** `src/layouts/Base.astro` — shared HTML shell, Aurora backdrop, slot for page content.
- **Domain / core (presentation):**
  - `src/components/Aurora.svelte` — client-only generative warm halo background (spawn algorithm + CSS motion).
  - `src/components/Terminal.svelte` — typeable console echo UI with CV seed link.
  - `src/components/Wordmark.svelte` — vendored brand mark from design SSOT repo.
  - `src/styles/global.css` — design tokens (ink/cream/orange palette, mono font, motion vars).
- **Adapters:** `@astrojs/cloudflare` adapter (build output); no custom server handlers in source.
- **Static assets:** `public/favicon.svg`, `public/robots.txt` (allow all).
- **Docs vaults:**
  - `docs/ADRs/` — four accepted architecture decisions (Astro+Svelte, Workers-not-Pages, bun-only, wrangler minimal config).
  - `docs/svelte.md` — distilled Svelte 5 guidance for this project's islands.
  - `docs/cloudflare-permissions.md` — historical Cloudflare auth audit (pre/post deploy); contains account metadata — do not copy credentials into summaries.
- **Agent scaffolding:**
  - `AGENTS.md` / `CLAUDE.md` — hard rules (bun, push-to-deploy, design sync, home product description).
  - `.claude/skills/svelte-core-bestpractices/` — trimmed Svelte 5 island skill with reference docs (`$state`, `$derived`, snippets, each blocks, etc.).
- **Tooling config:** `astro.config.mjs`, `svelte.config.js`, `tsconfig.json`, `.vscode/` editor settings.
- **Generated / vendor (gitignored):** `dist/`, `.astro/`, `.wrangler/`, `node_modules/` — not ingested.

No `.docs/` directory present in the tree.

## 6. Configuration & contracts (no secrets)

- **Package scripts:** `dev`, `build`, `preview`, `check`, `deploy` — all bun-invoked per README.
- **Astro config:** `site` set to production domain in `astro.config.mjs`; `adapter: cloudflare()`; `integrations: [svelte()]`.
- **Wrangler root config (`wrangler.jsonc`):**
  - Worker name: `kodexarg-com`
  - Compatibility date: `2026-06-12`
  - Flags: `nodejs_compat`, `global_fetch_strictly_public`
  - KV binding: `SESSION` (namespace id pinned for redeploy reuse)
  - Custom domain routes: apex and `www` host patterns
  - Observability enabled
  - No `main` — adapter-generated config at build time
- **Env files:** `.env` and `.env.*` are gitignored; no `.env.example` committed in tree.
- **No committed CI workflow files** in `.github/` — deploy pipeline documented as Cloudflare Workers Builds triggered by GitHub push to `main`.

### 6.1 HTTP / API endpoints (when applicable)

This repository implements **no server-side API**. Astro prerenders static HTML; the Cloudflare Worker serves those assets. Documented **site routes** (file-based):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home — aurora + terminal + wordmark | none |
| `GET` | `/syv/fases/` | Static GDDR-01 character creation phase spec | none |
| `GET` | `/syv/uc/` | Static SyV Character Kit user stories / API catalog | none |

The SyV pages describe a **hypothetical external Character Kit API** (`GET /character`, `POST /canonize`, squad endpoints, etc.) for downstream consumers (battle engine, lore site, QA pipeline). Those endpoints are **not implemented in this repo** — they are design documentation only.

### 6.2 Other interfaces

- **CLI (bun scripts):** `bun run dev|build|preview|check|deploy` — standard Astro/Wrangler developer workflow.
- **Agent interface:** `AGENTS.md` contract — bun-only, build before commit, push to `main` completes a change, sync `Wordmark.svelte` with design SSOT.
- **Svelte MCP / external tooling:** explicitly out of scope per `docs/svelte.md`.

## 7. Data & persistence

- **No application database** in this repo. Pages are static HTML/CSS with client-side island state only.
- **Cloudflare KV:** `SESSION` namespace bound in `wrangler.jsonc` for potential future Astro session support — not exercised by current source pages.
- **Topology:** Prerendered static assets at the edge via Workers; no server-side data reads or writes in current code. Terminal history and Aurora spawn randomness exist only in browser memory for the session.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`README.md`** — commands, structure, deploy target, bun-only convention, island prop rules.
2. **`AGENTS.md` / `CLAUDE.md`** — deploy pipeline, design SSOT sync, home product spec, forbidden patterns.
3. **`docs/ADRs/0001-astro6-svelte5-islands.md`** — Astro 6 + Svelte 5 runes decision and consequences.
4. **`docs/ADRs/0002-cloudflare-workers-not-pages.md`** — Workers-with-static-assets platform choice.
5. **`docs/ADRs/0003-bun-package-manager.md`** — bun as sole package manager.
6. **`docs/ADRs/0004-wrangler-config-no-main.md`** — minimal root wrangler, adapter-generated deploy redirect.
7. **`docs/svelte.md`** — Svelte 5 canon and anti-patterns for islands; SvelteKit excluded.
8. **`docs/cloudflare-permissions.md`** — deploy auth audit history (sensitive account details omitted from this summary).
9. **`.claude/skills/svelte-core-bestpractices/SKILL.md`** — agent guidance for `$state`, `$derived`, `$effect`, events, snippets, each blocks; references subdirectory for attach/bind/render docs.
10. **`src/pages/syv/fases/index.astro`** — GDDR-01 phased character creation rules (affiliation → identity → attributes → rest).
11. **`src/pages/syv/uc/index.astro`** — 27 user stories mapped to Character Kit REST paths (documentation).

No `.docs/` hidden vault found. No root `README` variants beyond single `README.md`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repo; this summary describes architecture without offering clone URLs as product links. `related: []` per private-repo frontmatter rule.
- **Auth model:** Public static site — no authentication on served pages. Cloudflare deploy auth (OAuth/API token) is operator-side only; not embedded in repo.
- **Secrets hygiene:** `.env*` gitignored. `docs/cloudflare-permissions.md` contains historical account identifiers and email — not reproduced here. KV namespace id in `wrangler.jsonc` is infrastructure binding metadata, not a credential.
- **This summary contains no secrets, tokens, PEM keys, or env values.**

## 10. Operational picture

- **Local dev:** `bun install` then `bun run dev` (Astro dev server in workerd runtime).
- **Build gate:** `bun run check` (`astro check` + `svelte-check`) must pass before commits per agent rules.
- **Build:** `bun run build` → `dist/` with `dist/client` assets.
- **Preview:** `bun run preview` for local production preview.
- **Deploy:** Automatic — push to `main` → GitHub → Cloudflare Workers Builds → `kodexarg-com` worker. Manual fallback: `bun run deploy`. Edge cache may briefly serve stale HTML after deploy; cache-bust query param recommended when verifying.
- **No `.github/workflows` in repo** — CI is external Workers Builds integration.
- **Hardware constraints:** None specific; standard Node/Bun workstation. Aurora respects `prefers-reduced-motion`.

## 11. Open questions / unknowns

- Whether custom-domain DNS was fully finalized after the initial deploy audit update in `docs/cloudflare-permissions.md` (routes are declared in `wrangler.jsonc` but historical doc noted DNS pending).
- Whether `SESSION` KV will be used for future interactive features or remains adapter boilerplate.
- SyV Character Kit API — implementation repo and runtime unknown from this tree; only static specs hosted here.
- Exact Workers Builds GitHub app configuration not present in repo (no workflow YAML).
- Phase 4 ("Resto") of GDDR-01 marked pending in the fases doc.
- Whether `design.kodexarg.com` token CSS has fully migrated or `global.css` still carries duplicated SSOT comments.
