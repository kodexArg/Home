---
id: "syv-map"
title: "syv-map — Living cartographic editor for the SyV universe (Ciudad Dársena)"
visibility: public
importance: normal
source_repo: "syv-map"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "experimental"
related: []
tags: ["astro", "svelte", "maplibre", "terra-draw", "geojson", "sqlite", "cartography", "syv-universe", "darsena", "tailwind", "bun", "map-editing"]
problems_solved:
  - "Authoring fictional geography for the Subordinación y Valor (SyV) universe requires a fast, visual surface to draw, name, stack, and toggle map regions—not hand-editing GeoJSON files in a text editor."
  - "Region semantics in SyV are mechanic-driven (closed areas vs. open-line walls share geometry types but mean different things); a generic GIS tool does not encode the Región / Lugar / Ruta domain model or the wall-opening workflow."
  - "Map experiments need local persistence across reloads without standing up a separate backend service, auth, or deploy pipeline—while still leaving a seed canon on disk that can be re-imported."
technologies:
  - "Astro 7 (islands, SSR API routes)"
  - "Svelte 5 (runes, client-only map island)"
  - "MapLibre GL JS 5"
  - "Terra Draw + MapLibre adapter (polygon/line editing)"
  - "Tailwind CSS 4"
  - "better-sqlite3 (Node dev-server persistence)"
  - "Bun (package manager and script runner)"
  - "polygon-clipping (declared; not yet wired in source)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# syv-map

> **Problem thesis (required):** SyV Map is the cartographic birthplace of the _Subordinación y Valor_ fictional universe, starting with **Ciudad Dársena**. The map does not merely illustrate lore—it **originates** it. This repository solves the gap between a frozen atlas in a docs vault and a hands-on authoring tool: a local Astro + Svelte + MapLibre application where operators draw regions, toggle layers, edit vertices, convert closed polygons into open-line walls, and persist changes to SQLite through dev-server API routes—without auth, multi-user sync, or production deploy configuration.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-map` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Local map editor and viewer for SyV geography—polygon regions on MapLibre, Terra Draw editing, SQLite persistence, seeded from on-disk GeoJSON canon. |
| Audience | SyV lore authors and worldbuilders; kodexArg operators iterating on Ciudad Dársena and surrounding Argentine-future geography; coding agents assisting map work (MapLibre skills locked in `skills-lock.json`). |

## 2. Problems it solves

### P1 — Visual, iterative geography authoring vs. raw GeoJSON editing

- **Who hurts:** Authors building the SyV atlas who need to see neighborhoods, military zones, trade routes, and walls in spatial context while naming and coloring them.
- **Pain today:** Editing `.geojson` by hand is slow, error-prone, and detached from the basemap; toggling visibility or stack order requires code or manifest edits; there is no immediate feedback loop for "draw → name → recolor → reorder."
- **How this repo answers:** A full-screen MapLibre map centers on Ciudad Dársena coordinates with a left sidebar listing all region layers. Each layer supports visibility toggle, color picker, rename, stack reorder, vertex editing (Terra Draw), creation of new polygon areas, and deletion. Changes persist through `/api/polygons` into `db/syv-map.db` and survive browser reloads when the Astro dev server is running.
- **Out of scope:** Collaborative real-time editing, production hosting of the editor, custom tile infrastructure, or automatic bidirectional sync with the `syv-docs` SSOT vault.

### P2 — Domain-specific region mechanics (walls vs. areas)

- **Who hurts:** Worldbuilders who must express SyV's **Región** primitive where a wall is geometrically a line but semantically still a region (it divides territory rather than connecting places).
- **Pain today:** Standard map tools treat lines as routes/paths; converting a closed neighborhood polygon into an open wall at a chosen gate requires manual coordinate surgery in GeoJSON.
- **How this repo answers:** The `openAsWall` flow in `src/lib/mapStore.svelte.ts` and the "Abrir en un vértice → muro" UI mode in `src/components/MapView.svelte` let the author click a vertex on a closed polygon; the ring is cut there and the feature becomes a `LineString` with `fill: false`, rendering as border-only (no interior fill). `hasArea` / `isEditable` helpers distinguish fillable polygons from open-line regions at render time.
- **Out of scope:** Full implementation of **Lugar** (point) and **Ruta** (path) primitives described in `PRD.md`—those remain planned, not shipped.

### P3 — Lightweight local persistence without a dedicated backend

- **Who hurts:** Solo authors who want "edit all the time" locally without provisioning Postgres, auth, or Cloudflare bindings—yet need durability beyond `localStorage`.
- **Pain today:** Pure static GeoJSON in `public/` requires manual file replacement after every edit session; browser `localStorage` is fragile and was explicitly removed from this codebase.
- **How this repo answers:** Astro API routes (`src/pages/api/polygons/`) backed by `better-sqlite3` in `src/lib/db.ts` provide CRUD for layer metadata and GeoJSON payloads. `public/polygons/*.geojson` plus `public/polygons/index.json` act as **seed canon**; `seedFromDisk()` and the `↺ Restaurar` UI action re-import disk seeds into SQLite. A committed `db/syv-map.db` ships working state in-repo. Schema is plain SQLite designed to port to Cloudflare D1 later (driver swap only).
- **Out of scope:** Portable GeoJSON export button (PRD option A)—not implemented yet. Production edge deployment with D1—future work.

## 3. Product / idea

SyV Map is conceived as a **living map** for a speculative-fiction Argentina: cities like Dársena, Córdoba, Mendoza, San Luis, confederal trade corridors, agricultural belts, and the fixed "Cuerpo de Hielo" meteor impact overlay (2039) that situates Dársena near the edge of the blast zones. The mental model is **authoring surface → in-memory Svelte store → HTTP API → SQLite file**, with disk GeoJSON as bootstrap canon.

The UI is a single Astro page (`src/pages/index.astro`) hosting one Svelte island (`MapView.svelte`, `client:only`). MapLibre renders each layer as paired fill + line MapLibre sources; stack order in the sidebar maps to `moveLayer` z-order on the map. Terra Draw handles create-mode polygon drawing and select-mode vertex dragging. A separate fixed overlay (not in the store) renders concentric impact zones from hardcoded coordinates transcribed from an external HTML impact map—toggleable but never editable.

Styling inherits Presentation Orange / warm-ink tokens from `syv-frontend` via `src/styles/global.css` (Nunito + DM Mono, cream-on-ink palette, orange accent)—ported as CSS variables and Tailwind v4 `@theme inline` mappings, not as copied component CSS.

### 3.1 North-star use cases

1. **Explore Dársena:** Run `bun run dev`, open the local dev port, toggle barrios (Centro, Zona Militar, Barrio de la Armada, Gremio de Pesca, Muro, etc.) and optionally reveal the Cuerpo de Hielo impact rings for geographic context.
2. **Author a new region:** Click "＋ nueva área…", draw a polygon on the map, auto-persist as `area-<timestamp>` with default orange styling; rename and recolor from the sidebar.
3. **Edit an existing wall or neighborhood:** Enter vertex-edit mode on a layer, drag points, save back to SQLite; or use "open at vertex" to turn a closed barrio into an open wall at a gate.
4. **Reset to seed canon:** Confirm `↺ Restaurar` to wipe SQLite and re-import all `public/polygons/*.geojson` in `index.json` order—useful after experimental edits.
5. **Bulk seed via script:** With dev server in background mode, run `bun run seed` (`scripts/seed-db.ts`) to HTTP PUT all disk polygons into SQLite (Bun does file I/O; Node dev server does the native SQLite write).

### 3.2 Non-goals

From `PRD.md` and README (partially stale but directionally aligned):

- Backend service, authentication, multi-user, live collaborative editing.
- Paid or self-hosted raster/vector tile stacks (uses free CartoDB Positron no-labels raster tiles).
- Publishing/deploying the editor to production (editor is local-first; a read-only viewer may be published separately later).
- Automatic write-back to `syv-docs` SSOT—the relationship is explicitly undecided and must not be changed unilaterally.
- Full shadcn-svelte design system (sidebar is hand-built Tailwind using token classes; CLI init was skipped due to interactive prompt friction).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node ≥ 22.12 (engines), TypeScript 6, Bun for install/scripts | `package.json` |
| Frontend framework | Astro 7 + Svelte 5 (runes, `$state`, `$effect`) | `package.json`, `astro.config.mjs`, `src/lib/mapStore.svelte.ts` |
| Map rendering | MapLibre GL JS 5, inline raster style (Carto light no-labels) | `package.json`, `src/components/MapView.svelte` |
| Map editing | Terra Draw 1.31 + MapLibre adapter (polygon, linestring, select modes) | `package.json`, `MapView.svelte` |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` | `package.json`, `src/styles/global.css` |
| Backend / API | Astro server routes (`prerender = false`), no separate server process | `src/pages/api/polygons/` |
| Data | SQLite via `better-sqlite3`; committed `db/syv-map.db`; seed GeoJSON in `public/polygons/` | `src/lib/db.ts`, `db/`, `public/polygons/` |
| Infra / deploy | None configured—local dev only | no `.github/workflows`, no `wrangler.jsonc` |
| AI / agents | MapLibre agent skills lockfile; minimal `AGENTS.md` | `skills-lock.json`, `AGENTS.md` |
| Tests | None evident | no test configs in tree |

### 4.1 Notable dependencies (curated)

- `maplibre-gl` — core WebGL map engine; basemap + GeoJSON layer rendering.
- `terra-draw` + `terra-draw-maplibre-gl-adapter` — interactive polygon/line creation and vertex editing atop MapLibre.
- `better-sqlite3` — synchronous Node-native SQLite driver for dev-server persistence; marked `ssr.external` in Vite config.
- `polygon-clipping` — declared in `package.json` (likely planned for boolean region ops) but not imported in current `src/` tree.
- `@astrojs/svelte` — integrates Svelte 5 island into Astro 7 page.

## 5. Repository map (abstraction)

- **Entrypoints:** `src/pages/index.astro` (sole page); `src/pages/api/polygons/index.ts` (collection); `src/pages/api/polygons/[id].ts` (per-layer + reserved `_seed` / `_order` ids).
- **Domain / core:** `src/lib/mapStore.svelte.ts` (UI state, create/edit/delete/reorder/wall-open flows); `src/lib/types.ts` (`LayerMeta`, `Layer`); `src/lib/persistence.ts` (fetch wrappers for API).
- **Adapters:** `src/lib/db.ts` (SQLite schema, CRUD, `seedFromDisk`); `src/components/MapView.svelte` (MapLibre + Terra Draw + sidebar UI + impact overlay).
- **Seed canon:** `public/polygons/*.geojson` (19 region files including Dársena barrios, confederal cities, crop belts, walls); `public/polygons/index.json` (manifest order and labels).
- **Database:** `db/syv-map.db` (committed runtime store; WAL/journal sidecars gitignored).
- **Scripts:** `scripts/seed-db.ts` (HTTP bulk seed from disk via running dev server).
- **Docs vaults:** `README.md`, `PRD.md` at repo root. **No `.docs/` directory present.** **No `.claude/` directory present** (`CLAUDE.md` is a symlink to `AGENTS.md`).
- **Agent scaffolding:** `AGENTS.md` / `CLAUDE.md` (Astro dev background-mode instructions only); `skills-lock.json` (three MapLibre skills from `maplibre/maplibre-agent-skills`).
- **Generated / vendor:** `node_modules/` (gitignored), `dist/`, `.astro/` (gitignored), `bun.lock` (present but not summarized).

## 6. Configuration & contracts (no secrets)

- **No `.env` files** in tree; `.env` and `.env.production` are gitignored.
- **Optional env for seed script:** `SYV_MAP_URL` overrides the default local API base for `scripts/seed-db.ts` (defaults to localhost dev port `/api/polygons`).
- **SQLite path:** `db/syv-map.db` relative to project cwd; directory auto-created.
- **DB schema (`layers` table):** `id` (PK), `label`, `color`, `default_visible`, `data` (JSON text of GeoJSON FeatureCollection), `ord` (stack order).
- **GeoJSON feature properties convention:** `name`, `color`, `fillOpacity`, `weight`, `fill` (boolean for wall vs area), optional `lineStyle` (`solid` / `dotted` / `dashed`).
- **Vite SSR:** `better-sqlite3` externalized so native addon loads at request time in Node.

### 6.1 HTTP / API endpoints

All routes are Astro server endpoints under `src/pages/api/polygons/`, active only when the dev server runs (`prerender = false`).

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/polygons` | Layer manifest (`LayerMeta[]`, ordered, no geometry) | none |
| `PUT` | `/api/polygons` | Bulk replace all layers (admin/seed script) | none |
| `GET` | `/api/polygons/<id>` | Single layer GeoJSON FeatureCollection | none |
| `POST` | `/api/polygons/<id>` | Upsert layer `{ meta, data }` | none |
| `DELETE` | `/api/polygons/<id>` | Remove layer by id | none |
| `PUT` | `/api/polygons/_order` | Persist stack order `{ ids: string[] }` | none |
| `POST` | `/api/polygons/_seed` | Wipe DB and re-import `public/polygons/*.geojson` | none |

Static GeoJSON files under `public/polygons/` are also served as static assets at `/polygons/<file>.geojson` by Astro, but the live UI loads geometry via `/api/polygons/<id>` after the SQLite migration.

### 6.2 Other interfaces

- **CLI / npm scripts:** `bun run dev` (Astro dev), `bun run build`, `bun run preview`, `bun run seed` (disk → SQLite via HTTP PUT).
- **Astro background dev:** `astro dev --background` with `astro dev stop|status|logs` per `AGENTS.md`.
- **VS Code:** `.vscode/launch.json` launches Astro dev via node-terminal.
- **Browser UI modes:** `idle`, `create` (draw polygon), `edit` (Terra Draw select), `open` (click vertex to open wall)—managed in `MapView.svelte`.

## 7. Data & persistence

**Topology:** Single-machine, dev-server-local. Browser holds ephemeral in-memory state in the Svelte store; every load and mutation goes through HTTP to SQLite. Without the dev server, `loadManifest` fails and the map shows an error—there is no offline `localStorage` fallback (legacy key `syv-map:layers:v1` is explicitly removed on mount).

**Stores:**

1. **SQLite (`db/syv-map.db`)** — authoritative runtime store for editable regions.
2. **`public/polygons/`** — seed canon; frozen copy of Dársena geography originally sourced from `syv-docs/2_atlas/ciudades/darsena/mapa/` (not auto-synced).
3. **Hardcoded impact overlay** — five concentric circles around the Cuerpo de Hielo impact center; not in DB or seed files.

**Entities:** Each row in `layers` is one map layer (typically one SyV region or confederal zone). User-created areas get ids like `area-<timestamp>`. Seed layers include `centro`, `zona-militar-norte`, `barrio-de-la-armada`, `barrio-de-pescadores`, `mendoza-ciudad`, `cordoba-ciudad-25m`, `ruta-confederacion`, `soja-cordoba-100m`, `ganado-mixto-100m`, `canamo-norte-cordoba`, and several `area-*` user-authored regions committed in the DB snapshot.

**Future port:** Comments in `db.ts` note D1 compatibility—SQL and row shapes should transfer with a driver swap.

## 8. Docs & agent memory (required scan)

Scanned sources and findings:

1. **`README.md`** — Quickstart (`bun install`, `bun run dev`), historical workflow for adding GeoJSON + `layers.ts` ( **stale**: `layers.ts` no longer exists; registration is via SQLite seed or API). Documents Carto basemap, syv-frontend token port, stack versions. Claims "sin backend" which predates the SQLite API layer.
2. **`PRD.md`** — Living product doc: vision (map originates lore), three-primitive domain model (Región / Lugar / Ruta), wall-as-region rules, persistence options A vs B (B chosen in code), open question on `syv-docs` SSOT sync, phased roadmap.
3. **`AGENTS.md`** / **`CLAUDE.md`** (symlink) — Astro background dev server commands and links to Astro docs guides.
4. **`skills-lock.json`** — Locks three MapLibre agent skills: migration, PMTiles patterns, tile sources.
5. **`.claude/`** — not present in repository.
6. **`.docs/`** — not present in repository.
7. **`public/polygons/index.json`** — canonical layer ordering and human labels for seed import.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repo; map data describes fictional geography, not PII.
- **Auth model:** None. All API routes are open on the local dev server—appropriate only for localhost authoring, not internet exposure.
- **Secrets:** This summary contains no credentials, tokens, connection strings, or `.env` contents. The SQLite file holds only public fictional GeoJSON.
- **Native addon:** `better-sqlite3` is a compiled Node ABI dependency—build/rebuild required when Node version changes.
- **External tiles:** Map loads Carto/OSM attribution raster tiles over the network when the map runs—no API keys required.

## 10. Operational picture

**Local development:**

```bash
bun install
bun run dev
```

Alternative: `astro dev --background` then manage with `astro dev stop|status|logs`.

Default dev port is Astro's standard (4321). Map centers at Dársena coordinates zoom 14.

**Seeding:**

1. Start dev server.
2. `bun run seed` — or use UI `↺ Restaurar`, or `POST /api/polygons/_seed`.

**Build:** `bun run build` / `bun run preview` exist but the product is dev-local; no CI workflow or Cloudflare/GitHub Actions deploy config is present in the tree.

**Hardware constraints:** None beyond a modern browser with WebGL and Node ≥ 22 for the dev server.

## 11. Open questions / unknowns

- **SSOT bridge:** How edited geography flows back to `syv-docs` remains explicitly undecided in `PRD.md`.
- **Lugar and Ruta primitives:** Documented in PRD but not implemented—only Región (polygon/line) exists.
- **`polygon-clipping`:** Listed as dependency but unused in current source—likely planned for region boolean operations.
- **README drift:** Still references `src/lib/layers.ts` and "sin backend"; actual architecture is SQLite + API routes.
- **Export path (PRD option A):** No download/export button for edited GeoJSON yet.
- **Production persistence:** D1 migration path is commented but not built; `better-sqlite3` will not run on Cloudflare Workers without rework.
- **Test coverage:** No automated tests found.
- **`.claude/` / `.docs/`:** Confirmed absent—nothing further to ingest from those paths.
