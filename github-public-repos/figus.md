---
id: "figus"
title: "Figus — World Cup 2026 Panini sticker album tracker and local trade finder"
visibility: public
importance: normal
source_repo: "figus"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "experimental"
related: []
tags: ["astro", "typescript", "tailwind", "leaflet", "panini", "world-cup-2026", "stickers", "trading", "localstorage", "spanish", "argentina", "prototype", "frontend-only"]
problems_solved:
  - "Completing a Panini FIFA World Cup 2026 sticker album is a high-cardinality tracking problem (~1,000+ stickers across 48 teams, foil variants, mystery players, and regional Coca-Cola inserts) that paper checklists and spreadsheets handle poorly on mobile."
  - "Finding trade partners for duplicate stickers requires knowing who nearby has extras of what you need—a coordination problem that WhatsApp groups and informal networks solve slowly and without distance-aware matching."
  - "Community-sourced album checklists arrive messy (typos, duplicate codes, non-collectible 'printed in album' pages, regional Coca-Cola variants); the repo needs a cleaned, typed catalog before any UI can work."
technologies:
  - "Astro 6 (MPA with client islands)"
  - "TypeScript 6"
  - "Tailwind CSS 4 via @tailwindcss/vite"
  - "Leaflet 1.9 (collector map)"
  - "Browser localStorage (collection + profile persistence)"
  - "Python 3 (catalog generator script)"
  - "Node ≥ 22.12 (engines)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Figus

> **Problem thesis (required):** Figus is a Spanish-language, Argentina-oriented prototype for tracking a **Panini FIFA World Cup 2026** sticker collection and discovering **local trade opportunities**. It attacks the pain of juggling a thousand-plus figuritas across 48 national teams—knowing what you own, what you lack, what you can offer as duplicates, and which nearby collectors might reciprocate—without standing up accounts, servers, or payments. Today it is a **frontend-only demo**: real catalog data, mock community users, client-side scoring for suggestions, and direct-contact trades via WhatsApp / Instagram / Telegram / email links.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/figus` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Local-first Panini Mundial 2026 album companion—mark stickers, browse duplicates, see proximity-ranked trade suggestions and a collector map, all in the browser with mock community data. |
| Audience | Argentine and LATAM Panini collectors during Mundial 2026; friends-and-family demo users; kodexArg operators prototyping a sticker-trading UX before any backend exists. |

## 2. Problems it solves

### P1 — High-cardinality album progress tracking

- **Who hurts:** Collectors filling a World Cup album who lose track of owned vs. missing stickers, especially across foil escudos, team photos, mystery-player parallel sets, and Coca-Cola regional inserts.
- **Pain today:** Paper album slots and ad-hoc notes do not scale to **1,074 catalogued stickers** (980 main-album positions plus extras). Spreadsheets lack mobile tap-to-increment UX and do not surface duplicates automatically.
- **How this repo answers:** `src/data/catalog.json` (generated from a community checklist) defines teams, sticker types, rarity, and album positions. The **Álbum** page (`src/pages/album.astro`) renders a filterable grid of `StickerCard` components; tap increments/decrements counts stored in `localStorage` via `src/lib/store.ts`. Dashboard stats (owned, missing, duplicate count, suggestion count) update reactively through a lightweight pub/sub `subscribe()` pattern.
- **Out of scope:** Official Panini image assets, barcode scanning, OCR of physical stickers, cloud sync across devices, or multi-user album sharing.

### P2 — Discovering who has your missing stickers nearby

- **Who hurts:** Collectors with duplicates who want to trade efficiently rather than broadcasting "tengo repetidas" into large chat groups without knowing reciprocity or distance.
- **Pain today:** Informal WhatsApp/Telegram groups are noisy; you cannot easily filter "who within 50 km has ARG-17 as a duplicate and might want something I have extra." Distance and mutual interest are manual mental work.
- **How this repo answers:** Thirty **mock users** (`src/data/users.ts`) are seeded across Argentina and neighboring capitals with procedurally generated inventories and `wants` lists. `src/lib/market.ts` lists only **tradeable duplicates** (count > 1), sorted by haversine distance from the user's profile coordinates. `src/lib/suggestions.ts` scores missing stickers by match count, proximity, reciprocity (how many of the other user's wants overlap your duplicates), and rarity bonus—surfacing ranked trade leads on **Sugerencias** and the home dashboard. **Mapa** (`src/pages/mapa.astro`) plots collector pins on a Leaflet + OpenStreetMap layer.
- **Out of scope:** In-app messaging, escrow, shipping logistics, reputation verification, or real user registration—the footer explicitly labels the build as **prototipo frontend · mock data**.

### P3 — Clean catalog ingestion from messy community checklists

- **Who hurts:** Developers (or agents) who need a structured sticker catalog before building UI, starting from an unofficial community Panini checklist with typos and regional variants.
- **Pain today:** Raw blog checklists mix printable album pages with collectible stickers, duplicate player codes, and multiple Coca-Cola regional editions; hand-transcribing into JSON is error-prone.
- **How this repo answers:** `Input/build_catalog.py` encodes cleaning rules (typo fixes, dropping "printed in album" decor pages, selecting Coca-Cola **Versión 2 LATAM** for Argentina, modeling 20 mystery players × 4 color parallels). It emits `catalog.json` with version `0.1`, team metadata for all **48** qualified nations, and sanity checks (980 unique album positions, 20 stickers per team). The committed `src/data/catalog.json` is what the TypeScript layer imports at build time.
- **Out of scope:** Legal licensing of Panini trademarks, automated scraping pipelines, or ongoing sync when Panini revises the official checklist.

## 3. Product / idea

Figus ("figuritas") is conceived as a **single-user album journal plus community trade radar**. The mental model is:

**Catalog (static JSON) → in-browser collection state (localStorage) → derived views (market, suggestions, duplicates, map) over mock peer inventories.**

There is no server round-trip. Astro prerenders seven routes as mostly static HTML; each page hydrates client `<script>` blocks that import typed modules. The UI language is **Spanish (Argentina)**—copy like "Tu álbum del Mundial, sin perder figuritas" and "Cargá demo" reflects the intended audience. Styling uses a dark "pitch" gradient background (`src/styles/global.css`), emerald/sky accents, and Tailwind utility classes.

Sticker thumbnails are **deterministic placeholders**, not official Panini art: team emblems use flag CDN images (`src/data/teams.ts` → `flagUrl`), players and specials use DiceBear avatar URLs seeded by label (`src/lib/images.ts`), and mascot/logo types fall back to emoji glyphs.

### 3.1 North-star use cases

1. **Track your album:** Open `/album`, tap stickers to mark ownership; use filters (team, type, missing/owned/duplicate) to focus completion gaps.
2. **See what you can trade:** `/repetidas` summarizes duplicate inventory; extras implicitly appear in the mock **Mercado** listings.
3. **Find a swap partner:** Set city + lat/lng on `/perfil` (or use browser geolocation), then browse `/sugerencias` for missing stickers ranked by nearby collectors who have duplicates and might want your extras.
4. **Explore geographically:** `/mapa` shows mock collector pins; tap for contact badges (WhatsApp, IG, Telegram, mail).
5. **Bootstrap a demo session:** "Cargar demo" on home or album calls `seedDemoCollection()` (~40% ownership, ~25% of owned are duplicated) so UX can be explored without manual data entry.

### 3.2 Non-goals

Evident from architecture and footer copy:

- Backend API, authentication, real user accounts, or persistent server-side inventories.
- Payments, in-app chat, or trade completion workflows.
- Production deployment configuration (no CI workflows, no `wrangler.jsonc`, no Docker).
- Official Panini branding compliance or licensed sticker imagery.
- README maintenance—the root `README.md` is still the default **Astro Starter Kit: Minimal** template and does not describe Figus.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node ≥ 22.12, TypeScript 6, ES modules | `package.json`, `tsconfig.json` |
| Frontend framework | Astro 6 (file-based routing, `.astro` pages + client scripts) | `package.json`, `astro.config.mjs`, `src/pages/` |
| Styling | Tailwind CSS 4 via Vite plugin | `package.json`, `astro.config.mjs`, `src/styles/global.css` |
| Maps | Leaflet 1.9 (dynamic import in map page) | `package.json`, `src/pages/mapa.astro` |
| Data / state | Static `catalog.json`; `localStorage` keys `figus.collection.v1` and `figus.profile.v1` | `src/data/catalog.json`, `src/lib/store.ts` |
| Catalog tooling | Python script (stdlib `json`, `re`, `pathlib`) | `Input/build_catalog.py` |
| Infra / deploy | None configured | no `.github/workflows`, no hosting manifests |
| AI / agents | Minimal VS Code launch config only | `.claude/launch.json` |
| Tests | None evident | no test runner configs |

### 4.1 Notable dependencies (curated)

- `astro` — static site generator; seven routes under `src/pages/` with islands-style client `<script>` hydration.
- `@tailwindcss/vite` + `tailwindcss` — utility-first styling integrated through Astro's Vite config.
- `leaflet` + `@types/leaflet` — interactive map for collector geography; tiles from OpenStreetMap.
- `@astrojs/check` — Astro/TS diagnostics (dev dependency).
- External image CDNs (referenced in code, not npm): flag images for team emblems; DiceBear for player/special placeholders.

## 5. Repository map (abstraction)

- **Entrypoints (routes):** `src/pages/index.astro` (dashboard), `album.astro`, `repetidas.astro`, `mercado.astro`, `sugerencias.astro`, `mapa.astro`, `perfil.astro`.
- **Layout / chrome:** `src/layouts/Layout.astro` (HTML shell, meta, footer), `src/components/Nav.astro` (sticky header + mobile menu).
- **Domain / core:** `src/data/types.ts` (sticker, team, user, profile types); `src/data/stickers.ts` (catalog hydration, rarity derivation, sort order); `src/data/teams.ts`; `src/data/users.ts` (mock community); `src/data/catalog.json` (committed dataset).
- **Business logic (client):** `src/lib/store.ts` (collection + profile CRUD, demo seed); `src/lib/market.ts` (duplicate listings + filters); `src/lib/suggestions.ts` (scoring engine); `src/lib/geo.ts` (haversine + distance formatting); `src/lib/images.ts` (thumbnail URL resolution).
- **UI components:** `StickerCard`, `UserCard`, `ContactBadges`, `ProgressBar`, `Stat`.
- **Catalog pipeline:** `Input/build_catalog.py` (source generator), `Input/catalog.json` (intermediate/output copy), `Input/.gitkeep`.
- **Static assets:** `public/favicon.svg`, `public/favicon.ico`; root `figus.png` (large branding image).
- **Agent scaffolding:** `.claude/launch.json` — VS Code debug configuration `figus-dev` running `npm run dev` on port 4321.
- **Editor hints:** `.vscode/extensions.json`, `.vscode/launch.json` (standard editor metadata).
- **Docs vaults:** **No `.docs/` directory present.** Root README is generic Astro boilerplate, not project documentation.
- **Generated / vendor (existence only):** `dist/`, `.astro/`, `node_modules/` are gitignored build/deps dirs—not ingested.

## 6. Configuration & contracts (no secrets)

No `.env` files are committed; `.gitignore` excludes `.env` and `.env.production`. The app has **no server-side secrets surface**.

### Client persistence keys

| Key | Shape | Purpose |
|-----|-------|---------|
| `figus.collection.v1` | `Record<stickerId, count>` | How many copies of each sticker the user owns (0 = absent key). |
| `figus.profile.v1` | `{ name, city, lat?, lng?, contacts: { whatsapp?, instagram?, telegram?, email? } }` | User identity and location for distance calculations. |

### Catalog schema (version 0.1)

Top-level `catalog.json` fields: `version`, `source` (provenance note), `license_note`, `counts`, `teams[]`, `stickers[]`. Each sticker carries `id`, `code`, `album_position` (nullable for extras), `label`, `type` (enum: `panini_logo`, `player`, `mystery_player`, etc.), `team_id`, `is_foil`, `parallel_set`, `parallel_variant`. Counts at time of scan: **48 teams**, **980** main-album stickers, **80** extra mystery variants, **14** Coca-Cola LATAM, **1074** total.

### 6.1 HTTP / API endpoints (when applicable)

**No HTTP API.** This is a static Astro site with client-only logic. There are no `src/pages/api/` routes, no OpenAPI spec, and no server middleware.

Effective "routes" are **static page paths** served by Astro dev/build:

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/` | Dashboard: progress stats, top suggestions, quick links | none |
| `GET` | `/album` | Full sticker grid with ownership toggles and filters | none |
| `GET` | `/repetidas` | Duplicate inventory view | none |
| `GET` | `/mercado` | Browse mock users' tradeable duplicates | none |
| `GET` | `/sugerencias` | Ranked missing-sticker trade suggestions | none |
| `GET` | `/mapa` | Leaflet map of mock collectors + user pin | none |
| `GET` | `/perfil` | Edit name, city, coordinates, contact channels | none |

### 6.2 Other interfaces

- **CLI (dev):** `npm run dev` (Astro dev server, default port 4321 per README boilerplate), `npm run build`, `npm run preview`.
- **Catalog generator:** `python Input/build_catalog.py` — writes JSON (script default output path in source points outside repo; committed artifact is `src/data/catalog.json`).
- **Demo seed API (client):** `seedDemoCollection(seed?)` and `clearAll()` exported from `src/lib/store.ts`.
- **Trade contact surface:** `ContactBadges` component renders `tel:`, `mailto:`, and external social deep links from profile/contact objects—trades happen **off-app**.

## 7. Data & persistence

- **Canonical sticker/team data:** Read-only `src/data/catalog.json` imported at build time; TypeScript enriches with `rarity`, `number`, and resolved `team` references.
- **User collection + profile:** Browser `localStorage` only—no sync, no export UI (except manual devtools).
- **Mock community:** `USERS` array (30 entries) with deterministic RNG inventories keyed per user index; includes fictional contact strings for UI demonstration (not real PII from the repo's perspective—they are demo fixtures).
- **Topology:** Fully offline/edge-client after initial page load. Map tiles and placeholder images are fetched from third-party CDNs at runtime. No database, KV, or vector index.

## 8. Docs & agent memory (required scan)

### Sources reviewed

1. **Root README** (`README.md`) — default Astro minimal starter; lists generic `npm` commands and Astro folder layout. **Does not document Figus product intent** (stale relative to implemented pages).
2. **`.claude/launch.json`** — agent/IDE launch config: runs `figus-dev` via `npm run dev` on port 4321. No skills, constitution, or prompt trees beyond this.
3. **`.docs/`** — **not present** in repository tree; nothing to summarize.
4. **`Input/build_catalog.py` module docstring** — richest prose documentation in the repo: data-source attribution, cleaning decisions (typo fixes, LATAM Coca-Cola choice, mystery-player modeling), and sanity-check expectations.
5. **In-app copy and footer** (`src/layouts/Layout.astro`, page headers) — confirms prototype/mock-data stance and Spanish UX targeting.
6. **`src/data/types.ts`** — implicit domain model documentation for stickers, users, profiles, and market listing shapes.

### Evidence bullets (paths only)

- `README.md`
- `.claude/launch.json`
- `Input/build_catalog.py`
- `src/data/types.ts`
- `src/layouts/Layout.astro`
- `src/pages/index.astro`

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repo; summary contains no clone URLs per RAG hygiene rules.
- **Auth model:** None. All state is local to the browser.
- **Secrets:** No committed `.env`, keys, or credentials files. `.gitignore` blocks env files. Mock user contacts in `src/data/users.ts` are synthetic demo strings—this summary does not reproduce them.
- **Third-party leakage:** Profile contacts typed by a real user would live only in their own `localStorage`, not transmitted by this codebase. Map and image modules reference external CDNs at runtime (flags, avatars, OSM tiles).
- **Child-safety / PII:** Designed for direct messaging handoff; no moderation, reporting, or age gating.

## 10. Operational picture

- **Local dev:** `npm install` then `npm run dev` (README); engines require Node ≥ 22.12. `.claude/launch.json` mirrors the dev command for VS Code debugging.
- **Production build:** `npm run build` emits to `dist/` (gitignored); `npm run preview` serves the static output locally.
- **Deploy:** No GitHub Actions, Cloudflare, or container configs in tree—deployment path unknown / not yet wired (contrast with sibling kodexArg repos targeting Cloudflare via Actions).
- **Catalog refresh:** Re-run `Input/build_catalog.py`, copy output into `src/data/catalog.json`, rebuild. No automated pipeline.
- **Hardware constraints:** None; runs in any modern browser. Geolocation optional for profile setup.

## 11. Open questions / unknowns

- **Production intent:** Unknown whether Figus will gain a real backend (user accounts, inventory sync, push notifications) or remain a static demo.
- **README drift:** Product is substantially implemented but README was never replaced—operators must infer behavior from pages and `build_catalog.py`.
- **Package manager:** `package-lock.json` is present; sibling kodexArg repos often standardize on `bun`, but this repo's scripts use `npm` in README and `.claude/launch.json`.
- **Official vs. community catalog accuracy:** Checklist derived from community blog source; Panini may revise official numbering—no update mechanism documented.
- **Legal/branding:** Use of "Panini", team names, and player names is factual catalog data; commercial deployment implications not addressed in-repo.
- **`.docs/` vault:** Absent—no hidden SSOT beyond the Python script comments and TypeScript types.

---
