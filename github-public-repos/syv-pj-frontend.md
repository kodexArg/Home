---
id: "syv-pj-frontend"
title: "SyV Character Creator — Astro + Svelte web UI on Cloudflare"
visibility: public
importance: normal
source_repo: "syv-pj-frontend"
org: "kodexArg"
default_branch: "main"
primary_language: "Svelte"
repo_kind: "application"
status: "experimental"
related: ["syv-pj-api"]
tags: ["astro", "svelte", "cloudflare-workers", "tailwind", "shadcn-svelte", "syv", "character-creator", "bun", "edge", "spanish", "game-ui"]
problems_solved:
  - "Players and operators of Subordinación y Valor need a browser-based character creator that reads canonical faction and rules data from the authoritative backend — not hardcoded JSON or duplicated game logic in the UI layer."
  - "The syv-pj-api backend deliberately omits CORS; the frontend must reach it same-origin in development (Vite proxy) and via Cloudflare service bindings in production — without exposing cross-origin API calls from the browser."
  - "Agent and human contributors need a strict, minimal component architecture so pages stay thin shells and all interactive UI lives in Svelte 5 runes components with a shared design system."
technologies:
  - "Astro 7 (SSR, output: server)"
  - "Svelte 5 (runes: $state, $effect)"
  - "@astrojs/cloudflare 14"
  - "Tailwind CSS v4 (@tailwindcss/vite)"
  - "shadcn-svelte (components.json, bits-ui)"
  - "Bun"
  - "Wrangler (Cloudflare Workers deploy)"
  - "Cloudflare Workers service binding (BACKEND → syv-pj-api)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# SyV Character Creator Frontend

> **Problem thesis (required):** Subordinación y Valor (_SyV_) is a tabletop-style game ecosystem whose character-creation rules and canonical metadata live in a dedicated Python API (`syv-pj-api`). This repository is the **web UI layer** for that creator: an Astro 7 + Svelte 5 application deployed as a Cloudflare Worker that renders interactive character-building screens, fetches live data from the backend motor, and enforces a component-first architecture so agents and developers can grow the UI without page-level spaghetti. At its current maturity it is an early scaffold — one landing view that proves backend connectivity by listing canonical factions — but the stack, proxy contract, and agent conventions are fully wired for expansion.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-pj-frontend` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Browser UI for the SyV character creator, built with Astro 7 + Svelte 5 on Cloudflare Workers, consuming the `syv-pj-api` rules engine via same-origin proxy (dev) or service binding (prod). |
| Audience | SyV players building characters; kodexArg developers and coding agents extending the creator UI; operators deploying the paired frontend/backend Workers. |

## 2. Problems it solves

### P1 — No browser surface for the SyV character creator

- **Who hurts:** Players who need to create SyV characters interactively; game operators who maintain canonical faction and rules data in the backend API; frontend developers who must render that data without re-implementing game logic.
- **Pain today:** Game rules and metadata are authoritative in `syv-pj-api` (documented in that repo's `API.md`). Without a dedicated frontend, character creation is limited to API clients, scripts, or manual table work — no polished, styled, player-facing workflow in the browser.
- **How this repo answers:** Provides a Cloudflare-hosted web application with Spanish UI chrome (`lang="es"`, title _Subordinación y Valor_), a dark SyV-themed design token palette in `src/styles/global.css`, and Svelte components that fetch live backend data. The initial `Saludo` component calls `GET /api/meta/facciones`, receives faction objects (`slug`, `nombre`, `descripcion`), and renders them as cards — proving the UI-to-motor pipeline works end-to-end.
- **Out of scope:** Implementing game rules, persistence, or character sheet logic (those belong in `syv-pj-api` and its storage layer). This repo does not own the API contract.

### P2 — Backend has no CORS; browser must not call the API cross-origin

- **Who hurts:** Frontend developers who would naively `fetch()` the backend Worker URL from the browser; operators who need dev and prod topologies that both work without CORS headers on the API.
- **Pain today:** `syv-pj-api` is designed without CORS. Direct browser calls to the backend origin fail or require unsafe workarounds. Local development typically runs the API on a separate port from the Astro dev server.
- **How this repo answers:** Two complementary patterns, both documented in `AGENTS.md` and `astro.config.mjs`:
  - **Development:** Astro Vite dev server proxies `/api/*` to `API_TARGET` (default loopback port 8010), stripping the `/api` prefix so `/api/meta/facciones` becomes `<backend>/meta/facciones`. The browser only ever talks same-origin to the Astro dev server.
  - **Production:** `wrangler.jsonc` declares a Cloudflare **service binding** `BACKEND` → `syv-pj-api`. The Astro Cloudflare adapter can invoke the backend Worker in-account without cross-origin HTTP from the browser.
- **Out of scope:** Adding CORS to the backend; this frontend explicitly forbids cross-origin API calls.

### P3 — Unstructured page growth blocks agent and human contributors

- **Who hurts:** Coding agents and developers adding UI to the character creator; reviewers who need predictable file boundaries.
- **Pain today:** Astro projects often accumulate logic, markup, and fetch calls directly in `.astro` pages, making components hard to test, reuse, or generate consistently.
- **How this repo answers:** A **hard componentization rule** in `AGENTS.md`: Astro pages (`src/pages/*.astro`) are minimal shells that mount exactly one Svelte component with a client directive (e.g. `client:load`). All UI, state, and interaction live in `src/lib/components/*.svelte`. Additional conventions: zero boilerplate, zero code comments, zero example assets; use `bun`/`bunx` exclusively (never npm/npx); shadcn-svelte aliases via `$lib`.
- **Out of scope:** Server-side rendering of complex interactive flows beyond what the Cloudflare adapter supports; the current pattern favors client-loaded Svelte islands.

## 3. Product / idea

The mental model is **SSR Astro shell + Svelte 5 interactive islands + backend motor over a proxy/binding** — not a monolithic SPA or a separate BFF service.

```
Browser
  └─► Astro page (index.astro) — thin shell
        └─► Base.astro layout — HTML shell, global.css
              └─► Saludo.svelte (client:load) — state, fetch, render
                    └─► fetch("/api/meta/facciones")
                          ├─ dev:  Vite proxy → syv-pj-api (local uvicorn)
                          └─ prod: Worker service binding BACKEND → syv-pj-api
```

The UI targets a dark, gold-accented aesthetic aligned with SyV branding: near-black backgrounds (`#0d0f12`), muted card surfaces, and a primary gold tone (`#c4a35a`) defined as CSS custom properties and mapped into Tailwind v4 `@theme` tokens. shadcn-svelte is configured (`components.json`) with `neutral` base color and `$lib` path aliases, ready for additional UI primitives under `src/lib/components/ui/` (not yet populated).

The application is **Spanish-first**: page title, headings, loading/error copy, and faction descriptions are in Spanish. The backend contract (faction slugs and names) is consumed as returned by the API.

### 3.1 North-star use cases

1. **Player opens the creator** — lands on the home page, sees the SyV title and a live list of canonical factions pulled from the database-backed API, confirming the rules motor is reachable.
2. **Developer extends the creator** — adds new Svelte components under `src/lib/components/`, mounts them from minimal Astro pages, fetches additional `/api/...` routes proxied to the backend, and styles with Tailwind + shadcn tokens.
3. **Operator deploys to Cloudflare** — runs `bun run build` then `bun run deploy` (only when instructed); the frontend Worker binds to `syv-pj-api` in the same account with no CORS configuration needed.

### 3.2 Non-goals

- Owning or duplicating game rules, character validation, or persistence logic (delegated to `syv-pj-api`).
- Cross-origin browser API access (explicitly forbidden).
- npm/npx toolchain (bun only per `AGENTS.md`).
- Example assets, tutorial boilerplate, or inline comments in source (explicitly banned).
- README or standalone docs tree in-repo (none present; `AGENTS.md` is the sole agent/human directive).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Bun (package manager + scripts); TypeScript strict | `package.json`, `tsconfig.json` |
| Frontend framework | Astro 7 SSR + Svelte 5 islands | `package.json`, `astro.config.mjs`, `svelte.config.js` |
| Styling | Tailwind CSS v4 via Vite plugin; shadcn-svelte tokens | `src/styles/global.css`, `components.json` |
| UI primitives | bits-ui, @lucide/svelte, tailwind-variants, mode-watcher | `package.json` dependencies |
| Edge deploy | @astrojs/cloudflare adapter; Wrangler | `astro.config.mjs`, `wrangler.jsonc` |
| Backend coupling | Service binding `BACKEND` → `syv-pj-api`; dev Vite proxy | `wrangler.jsonc`, `astro.config.mjs` |
| AI / agents | Agent directives only (`AGENTS.md`, `CLAUDE.md` symlink) | `AGENTS.md` |
| Tests | None configured | no test runner in `package.json` |

### 4.1 Notable dependencies (curated)

- `astro` ^7.0.5 — SSR site framework with file-based routing under `src/pages/`.
- `@astrojs/cloudflare` ^14.1.0 — deploys the built app as a Cloudflare Worker with `nodejs_compat`.
- `@astrojs/svelte` ^9.0.0 — Svelte 5 integration with `vitePreprocess`.
- `svelte` ^5.56.4 — runes API (`$state`, `$effect`) used in `Saludo.svelte`.
- `@tailwindcss/vite` ^4.3.1 + `tailwindcss` ^4.3.1 — utility-first CSS via Vite plugin (not PostCSS config file).
- `bits-ui` ^2.18.1 — headless accessible primitives backing shadcn-svelte.
- `clsx` + `tailwind-merge` — `cn()` helper in `src/lib/utils.ts` for conditional class names.
- `mode-watcher` — dark/light mode utility (present in deps; not yet wired in current components).

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `src/pages/index.astro` — sole route; mounts `<Saludo client:load />` inside `Base` layout.
  - `astro.config.mjs` — Astro + Cloudflare + Svelte + Tailwind + `$lib` alias + dev API proxy.
  - `wrangler.jsonc` — Worker name and `BACKEND` service binding.

- **Domain / core:**
  - `src/lib/components/Saludo.svelte` — only business UI so far: fetches factions, handles loading/error states, renders list.
  - `src/lib/utils.ts` — `cn()` class merge helper and shadcn-svelte TypeScript utility types.

- **Adapters:**
  - Dev: Vite `server.proxy` in `astro.config.mjs` rewrites `/api` → backend origin.
  - Prod: Cloudflare service binding declared in `wrangler.jsonc` (consumer code for binding not yet visible in the minimal source tree — likely used as the app grows).

- **Presentation shell:**
  - `src/layouts/Base.astro` — minimal HTML document, imports `global.css`.
  - `src/styles/global.css` — Tailwind v4 imports, dark SyV color tokens, `@source` for `src/lib`.

- **Docs vaults:**
  - `AGENTS.md` — primary agent/human SSOT for stack, structure, dev, deploy, and hard rules.
  - `CLAUDE.md` — symlink to `AGENTS.md`.
  - No `docs/`, `.docs/`, `README*`, ADRs, or PRDs in the tree.

- **Agent scaffolding:**
  - No `.claude/` directory present.
  - `components.json` — shadcn-svelte registry config pointing at `$lib/components/ui`.

- **Generated / vendor (existence only; not ingested):**
  - `dist/`, `.output/`, `.astro/`, `.wrangler/`, `node_modules/` — gitignored build and cache artifacts.
  - `bun.lock` — lockfile present; versions inferred from `package.json` only.

## 6. Configuration & contracts (no secrets)

| Name | Purpose |
|------|---------|
| `API_TARGET` | Dev-only: origin for Vite proxy target when forwarding `/api/*` (default loopback port 8010). Documented in `.env.example` as a hostname/port pattern only. |

**Wrangler bindings (from `wrangler.jsonc`):**

| Binding | Target service | Role |
|---------|----------------|------|
| `BACKEND` | `syv-pj-api` | In-account Worker-to-Worker call to the rules API (production path). |

**Astro config signals:**

- `output: "server"` — SSR mode required for Cloudflare adapter.
- `adapter: cloudflare()` — builds to Worker-compatible output.
- Path alias `$lib` → `./src/lib` (also in `tsconfig.json` paths).

**shadcn-svelte (`components.json`):**

- Components alias: `$lib/components`; UI subfolder: `$lib/components/ui`.
- Tailwind CSS entry: `src/styles/global.css`; base color `neutral`.
- Registry: shadcn-svelte public registry (schema reference only; no secrets).

### 6.1 HTTP / API endpoints (when applicable)

This repository **does not define its own REST API**. It is a frontend that consumes the sibling `syv-pj-api` contract. The browser-facing surface is:

| Method | Path (browser) | Proxied backend path | Purpose | Auth |
|--------|----------------|----------------------|---------|------|
| `GET` | `/api/meta/facciones` | `/meta/facciones` | List canonical factions (`slug`, `nombre`, `descripcion`) | none (in current `Saludo.svelte`) |

All other backend routes documented in `syv-pj-api`'s `API.md` are reachable in development via the same `/api` prefix rewrite pattern, but no additional routes are implemented in this repo yet.

**N/A for first-party API routes** — no `src/pages/api/` or Astro endpoints exist. Production backend access is intended via the `BACKEND` service binding rather than public cross-origin HTTP.

### 6.2 Other interfaces

- **CLI (package scripts):** `bun run dev` (Astro dev server, port 4321 per `AGENTS.md`), `bun run build`, `bun run preview`, `bun run deploy` (build + `wrangler deploy` — documented as do-not-run-without-order).
- **Sibling backend dev command (documented in `AGENTS.md`, not this repo):** `uv run uvicorn personajes.api.app:app` with `KDX_RUNTIME=local` in `syv-pj-api` for local sqlite-backed API.

## 7. Data & persistence

This frontend is **stateless** with respect to persistence. It does not own a database, KV namespace, or object store.

- **Data source:** All canonical game metadata (factions, and eventually character fields) comes from `syv-pj-api`, which uses sqlite in local dev and its own Cloudflare storage in production.
- **Client state:** Svelte 5 runes in components (`facciones`, `error`, `cargando` in `Saludo.svelte`) — ephemeral, in-browser only.
- **Topology:** Browser → Astro Worker (prod) or Astro dev server (local) → proxy/binding → `syv-pj-api` → backend storage. No edge caching layer is configured in this repo.

## 8. Docs & agent memory (required scan)

| Source | Present | Summary |
|--------|---------|---------|
| Root `README*` | **No** | No README file in the repository. GitHub description hint: "SyV character creator web UI (Astro + Svelte)". |
| `docs/**` | **No** | Directory absent. |
| `.docs/**` | **No** | Hidden docs vault absent. |
| ADR / PRD / constitution | **No** | None in tree. |
| `.claude/**` | **No** | Directory absent. |
| `AGENTS.md` | **Yes** | Full agent SSOT: stack versions, componentization rule, directory layout, dev proxy contract, backend startup instructions, deploy commands, service binding name. |
| `CLAUDE.md` | **Yes** (symlink) | Points to `AGENTS.md`. |

**Evidence bullets (paths only):**

- `AGENTS.md` — mission, stack, structure, dev proxy, deploy, hard rules.
- `CLAUDE.md` — symlink to `AGENTS.md`.
- `components.json` — shadcn-svelte registry and alias conventions.
- `.env.example` — `API_TARGET` variable name and example local value pattern.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; summary contains no clone URLs, tokens, or account identifiers.
- **Auth model:** None implemented in the current UI. Faction listing is unauthenticated. Future character creation flows will inherit whatever auth `syv-pj-api` requires.
- **Secrets hygiene:** `.env` and `.env.*` are gitignored (except `.env.example`). This summary contains no credentials, PEM keys, or connection strings with passwords.
- **CORS posture:** Frontend architecture avoids cross-origin API exposure by design — reduces browser-side attack surface against the backend.
- **Deploy caution:** `AGENTS.md` explicitly warns not to run `bun run deploy` without instruction — production deploys affect the live Worker.

## 10. Operational picture

**Local development:**

```bash
bun install
bun run dev    # Astro dev server (documented as port 4321)
```

Requires the sibling `syv-pj-api` running locally (default port 8010, `KDX_RUNTIME=local`, sqlite storage). Optional `.env` with `API_TARGET` if the backend is not on the default host/port.

**Build:**

```bash
bun run build   # astro build via Cloudflare adapter
```

**Deploy:**

```bash
bun run deploy  # astro build && wrangler deploy — operator-initiated only
```

**CI/CD:** No `.github/workflows/` or other CI manifests present in this repository. Deployment mechanism is Wrangler CLI invoked manually or from an external pipeline not defined here.

**Hardware constraints:** None — edge Worker deployment; no GPU or local device requirements.

## 11. Open questions / unknowns

- **Production proxy implementation:** `wrangler.jsonc` declares the `BACKEND` binding, but the current source tree does not show server-side code that invokes the binding for `/api/*` routes in production (only the Vite dev proxy is configured). How production `/api` routing is wired — Astro middleware, adapter hooks, or forthcoming code — is not evident from the shallow tree.
- **Character creation UI:** Only faction listing exists; full creator flows (stats, skills, validation, save/export) are not yet implemented.
- **shadcn-svelte UI kit:** `components.json` is configured and `src/lib/components/ui/` is aliased, but no shadcn components have been added yet beyond custom markup in `Saludo.svelte`.
- **Authentication:** Unknown whether future screens will require session tokens or Cloudflare Access; not present now.
- **CI/CD owner:** No in-repo GitHub Actions; unknown whether kodexArg uses a monorepo workflow or manual Wrangler deploys for this Worker.
- **Related repo contract:** Full API surface is defined in `syv-pj-api`'s `API.md` (not in this clone); this summary documents only the one consumed endpoint observed in source.
