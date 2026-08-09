---
id: "cf-ng-eurotrip2026"
title: "Eurotrip 2026 — Angular trip companion on Cloudflare"
visibility: public
importance: normal
source_repo: "cf-ng-eurotrip2026"
org: "kodexArg"
default_branch: "master"
primary_language: "TypeScript"
repo_kind: "application"
status: "active"
related: []
tags:
  - "angular"
  - "angular-21"
  - "primeng"
  - "tailwind"
  - "cloudflare"
  - "cloudflare-pages"
  - "d1"
  - "r2"
  - "travel"
  - "itinerary"
  - "leaflet"
  - "vitest"
  - "ai-first"
problems_solved:
  - "Scattered trip logistics (flights, trains, hotels, activities) across spreadsheets, email confirmations, and chat threads make it hard for two travelers to see one authoritative day-by-day plan on mobile."
  - "A multi-city European route spanning three weeks needs a single visual system—calendar, timeline, map, bookings, and city notes—that stays current as plans change during the trip."
  - "Owner-only editing and optional visitor access must coexist with a production-only Cloudflare stack without standing up separate staging infrastructure."
technologies:
  - "Angular 21.2 (standalone, OnPush, signals, zoneless-ready)"
  - "PrimeNG 21 with Aura theme preset"
  - "Tailwind CSS v4 + tailwindcss-primeui bridge"
  - "Cloudflare Pages (CSR hosting + Pages Functions API)"
  - "Cloudflare D1 (SQLite itinerary and metadata)"
  - "Cloudflare R2 (photo and video media)"
  - "Leaflet (interactive route map)"
  - "Vitest + JSDOM (unit tests)"
  - "TypeScript 5.9 strict"
  - "Wrangler 4.x (D1/R2/Pages tooling)"
  - "GitHub Actions (migrate → build → deploy → smoke)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Eurotrip 2026

> **Problem thesis (required):** This repository is a personal travel companion web application for a real three-week Europe trip (April–May 2026) by two adult travelers. It centralizes itinerary, bookings, city reference cards, photos, and an interactive map into one mobile-first site backed entirely by Cloudflare (Pages, D1, R2). The product exists because trip logistics otherwise live across confirmations, notes, and ad-hoc edits that are painful to reconcile on the road—especially when cities, transport legs, and accommodation details change while traveling.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/cf-ng-eurotrip2026` |
| Visibility | `public` |
| Default branch | `master` (GitHub default); production deploy workflow targets `prod` branch per `deploy.yml` |
| One-line pitch | Angular 21 Eurotrip 2026 trip planner app—a Cloudflare-hosted companion for one couple's multi-city Europe journey. |
| Audience | Primary: the two trip owners (Gabriel and Vanesa). Secondary: invited visitors with view access. Tertiary: AI agents and developers maintaining the repo via ADRs, PRD, and linked skills. |

## 2. Problems it solves

### P1 — Fragmented trip logistics during a complex multi-city journey

- **Who hurts:** Two senior travelers on a carry-on-only route across seven European cities plus long-haul flights from South America, managing dozens of confirmed and tentative bookings.
- **Pain today:** Flight locators, Airbnb refs, museum tickets, train times, and day plans live in email, screenshots, and mental notes. On mobile, finding "what happens Tuesday afternoon in Madrid" requires digging through multiple sources.
- **How this repo answers:** A unified `events` model in Cloudflare D1 powers calendar (`/calendario`), scrollable itinerary (`/itinerario`), bookings list (`/reservas`), and map (`/mapa`). Each event is typed as `traslado` (transport), `hito` (activity), or `estadia` (lodging), with `confirmed`, `done`, and `mandatory` flags surfaced in the UI. Canonical markdown fallbacks (`VIAJE.md`, `PRD.md`) allow rebuilding data if the database is lost.
- **Out of scope:** General-purpose travel planning for arbitrary users, price comparison, or automated booking.

### P2 — Need for a living itinerary that updates in production without local database staging

- **Who hurts:** The repo owner-developer iterating quickly while the trip is underway or being refined pre-departure.
- **Pain today:** Traditional apps assume local dev databases, migration review cycles, and separate staging—too heavy for a personal trip site that must reflect reality within hours.
- **How this repo answers:** Production-only D1 workflow: data changes via `npm run db` / `wrangler d1 execute --remote`, plus 118 versioned SQL files under `migrations/` applied automatically on deploy. CI runs migrate → build → deploy → smoke against live API invariants. `docs/db-workflow.md` documents schema, limits, and recovery (D1 Time Travel + markdown rebuild).
- **Out of scope:** Multi-tenant staging environments, offline-first sync, or collaborative real-time editing by arbitrary public users.

### P3 — Controlled sharing with owners who need write access on the road

- **Who hurts:** Trip owners who must upload photos, edit events, and invite trusted viewers without exposing write APIs to the public internet.
- **Pain today:** A fully public itinerary leaks planning detail; a fully private app blocks family from following along. Passphrase-only gates are brittle; full account systems are overkill.
- **How this repo answers:** Layered access: site-gate password (`SiteGateService`, `/api/site-gate/*`), session-based owner auth (`/api/auth/*`, `sessions` table), admin invite flow (`/admin`, `/api/admin/*`), and scaffolding for Cloudflare Access + Google IdP (`functions/lib/access.ts`, `CF_ACCESS_*` env vars). Middleware distinguishes view-only GET from owner-only mutations. Owner editing UI lives at `/modificaciones` with `EventForm`; visitors see read-only views.
- **Out of scope:** Public comments, social sharing, push notifications (listed as out of scope in `PRD.md`).

## 3. Product / idea

The application is a **client-rendered Angular SPA** deployed on **Cloudflare Pages**, with **Pages Functions** serving a JSON API backed by **D1** and **R2**. The mental model is: **one trip, one database, many views**.

```
[Angular CSR app]  --HTTP-->  [Pages Functions /api/*]  --SQL-->  [D1 eurotrip2026]
        |                              |
        +---- media URLs -------------> [R2 eurotrip2026-media]
```

**Core user journeys:**

1. **Plan review (default):** Land on `/calendario` (month view, city color-coding, event chips). Tap a day to drill into itinerary detail. Browse `/itinerario` for the full vertical timeline grouped by city → day → activity slot.
2. **Logistics check:** Open `/reservas` for a filterable flat list of all bookings (transport, stays, activities) with confirmation badges. `/mapa` shows Leaflet pins, great-circle and OSRM/rail waypoints between cities.
3. **City context:** `/sitios` (and legacy slug redirects like `/madrid`) show per-city `cards`—`info` reference blocks and `note` personal markdown—plus linked external URLs and inline photos.
4. **Memories:** `/fotos` gallery groups media by itinerary city order; owners upload images/video via multipart POST; lightbox supports swipe, keyboard nav, and rotation.
5. **Owner maintenance:** `/modificaciones` for CRUD on events (guarded by owner role). `/admin` for access requests, session management, and magic-link invites. `/bienvenida` post-auth welcome. `/access` for access-request flow.

**Language rule (binding):** All code, routes, docs, and variable names are **English**. All user-visible UI strings are **Spanish**.

**Design rule (binding):** PrimeNG components first; Tailwind v4 utilities second; no hand-rolled CSS widgets. Every UI atom is a standalone OnPush component. Signals over RxJS for state; `httpResource()` for data fetching.

### 3.1 North-star use cases

1. **On the train:** Open calendar on phone, see today's city color and confirmed chips, tap through to itinerary slot with times and cost hints.
2. **Before a museum:** Open city sitios page, read `info` card with address, hours, and ticket link from `card_links`.
3. **After a day:** Owner uploads photos from phone; gallery updates grouped under the correct city block.
4. **Agent/developer:** Read `PRD.md` + ADR-003/004, apply a D1 migration, push to `prod`, CI smoke validates critical event prices and confirmed flags on live API.

### 3.2 Non-goals

- Visitor comments and social sharing (`PRD.md` out of scope).
- Generic user accounts for the public (evolved toward gated access, but not a multi-user SaaS).
- Real-time weather as a first-class product feature (weather endpoint exists as a proxy to Open-Meteo but PRD lists weather as out of scope for the product vision).
- Local D1 or dev-server-as-source-of-truth workflow—production validation is intentional (`AGENTS.md`, `README.md`).
- Checked luggage planning—the trip constraint is carry-on only (10 kg each).

## 4. Technology stack

Derived from `package.json`, `wrangler.jsonc`, `ADRs/adr-002-tech-stack.md`, and `README.md`.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node 22 (CI), TypeScript 5.9 strict | `.github/workflows/deploy.yml`, `tsconfig.json`, `package.json` |
| Frontend | Angular 21.2 CSR, standalone components, signals, OnPush | `package.json`, `src/app/app.config.ts`, `ADRs/adr-004-angular-patterns.md` |
| UI | PrimeNG 21, Aura preset, PrimeIcons, Material Symbols | `package.json`, `src/app/app.config.ts`, `ADRs/adr-005-design-system.md` |
| Styling | Tailwind CSS v4, `tailwindcss-primeui`, PostCSS | `src/styles.css`, `package.json` |
| Maps | Leaflet 1.9 | `package.json`, `src/app/mapa/` |
| Backend / API | Cloudflare Pages Functions (`functions/`) | `functions/`, `wrangler.jsonc` |
| Data | Cloudflare D1 (`eurotrip2026`, binding `DB`) | `wrangler.jsonc`, `docs/db-workflow.md` |
| Media | Cloudflare R2 (`eurotrip2026-media`, binding `MEDIA`) | `wrangler.jsonc`, `functions/api/photos.ts` |
| Infra / deploy | Cloudflare Pages, GitHub Actions | `.github/workflows/deploy.yml`, `wrangler.jsonc` |
| AI / agents | Documented skills (gitignored), Angular CLI MCP (gitignored), ADR-driven conventions | `README.md`, `AGENTS.md`, `PRD.md` |
| Tests | Vitest 4, JSDOM, angular-eslint | `package.json`, `tsconfig.spec.json`, `src/app/**/*.spec.ts` |
| Tooling | Prettier, Wrangler 4.81, Python scripts for waypoint generation | `package.json`, `scripts/generate_osrm_waypoints.py` |

### 4.1 Notable dependencies (curated)

- `@angular/*` ^21.2 — core framework; zoneless-ready signal-first patterns per ADR-004.
- `primeng` ^21.1 — primary UI component library (Calendar views, Dialog, SelectButton, FileUpload, Cards).
- `tailwindcss` ^4.1 + `tailwindcss-primeui` — utility styling bridged to PrimeNG design tokens.
- `leaflet` — map rendering with custom marker factory and route renderers in `src/app/mapa/map-utils/`.
- `wrangler` — D1 execute, migrations apply, Pages deploy from CI.
- `@vitest/browser-playwright` — optional browser test path (devDependency).
- `rxjs` ~7.8 — retained for `HttpClient` observables; state prefers signals.

## 5. Repository map (abstraction)

**Entrypoints**

- `src/main.ts` — Angular bootstrap.
- `src/app/app.ts` — root shell: site-gate panel vs nav + router outlet.
- `src/app/app.routes.ts` — lazy-loaded feature routes.
- `functions/_middleware.ts` — API auth, Cloudflare Access vs legacy JWT modes, access logging.
- `functions/health.ts` — liveness JSON endpoint.

**Domain / core (frontend)**

- `src/app/calendario/` — month calendar, day cells, event chips, day-detail dialog.
- `src/app/itinerario/` — city → day → event-slot timeline.
- `src/app/mapa/` — Leaflet map container, legend, great-circle and waypoint route rendering.
- `src/app/sitios/` — city detail aggregator.
- `src/app/ciudades/` — card components (`info-card`, `note-card`, `link-card`, `photo-card`).
- `src/app/reservas/` — flat booking list with `booking-card` and type-specific body parts.
- `src/app/fotos/` — gallery, upload form, lightbox, media carousel behaviors.
- `src/app/modificaciones/` — owner event CRUD with `event-form`.
- `src/app/admin/` — invites, sessions, access-request approval.
- `src/app/shared/models/` — `TripEvent`, `City`, `Card`, `Photo`, `Activity` types.
- `src/app/shared/services/` — `auth.service`, `site-gate.service`, `weather.service`, `edit.service`, `itinerary-enrichment.service`, `version-check.service`.

**Adapters (API / edge)**

- `functions/api/itinerary.ts` — cities + events tuple for timeline/calendar.
- `functions/api/reservas.ts` — flat ordered events list.
- `functions/api/map/events.ts` — geo events for map layer.
- `functions/api/cities.ts`, `functions/api/cards/[city].ts` — city and card data.
- `functions/api/photos.ts` — GET gallery metadata, POST multipart upload to R2.
- `functions/api/events/` — POST create, PATCH/DELETE by id (owner mutations).
- `functions/api/weather/[city].ts` — proxies Open-Meteo using city lat/lon from D1.
- `functions/api/auth/*`, `functions/api/site-gate/*`, `functions/api/admin/*`, `functions/api/access-requests.ts`, `functions/api/access-log.ts` — auth and admin surface.
- `functions/lib/jwt.ts`, `functions/lib/access.ts`, `functions/lib/telegram.ts` — shared server utilities.

**Docs vaults**

- `PRD.md` — product definition, pages, seed data, language and design constraints.
- `AGENTS.md` — agent onboarding, trip constraints, workflow rules, skill index.
- `VIAJE.md` — canonical Spanish trip log (flights, lodging, day-by-day bitácora).
- `ADRs/` — ten architectural decision records (glossary through routing).
- `docs/db-workflow.md` — D1 production workflow and schema overview.
- `CHANGELOG.md` — deploy-grouped change history.

**Agent scaffolding (documented, gitignored in clone)**

- `.claude/`, `.agents/`, `.mcp.json`, `context/` — listed in `.gitignore`; not present in shallow clone. `README.md` and `AGENTS.md` document linked Angular/Cloudflare skills and Angular CLI MCP server configuration. `PRD.md` mandates skill usage from `.agents/skills/` when present locally.

**Data / migrations**

- `migrations/` — 118 SQL migration files (trip reality updates, coords, icons, photos, access_log). Applied remotely via CI `wrangler d1 migrations apply`.

**Scripts**

- `scripts/gen-version.mjs` — writes `public/version.json` at prebuild.
- `scripts/smoke-prod.mjs` — post-deploy API invariant checks.
- `scripts/generate_osrm_waypoints.py`, `scripts/generate_rail_waypoints.py` — offline helpers for map geometry.

**Generated / vendor (existence only)**

- `dist/`, `node_modules/`, `.angular/cache` — build and install artifacts (gitignored).
- `public/assets/fonts/` — self-hosted PrimeIcons and Material Symbols woff2.

## 6. Configuration & contracts (no secrets)

**Wrangler bindings** (`wrangler.jsonc`):

- `DB` → D1 database `eurotrip2026`.
- `MEDIA` → R2 bucket `eurotrip2026-media`.
- `pages_build_output_dir` → `./dist/angular-21-csr-primeng/browser`.

**Environment variables (Pages Functions — names and purpose only):**

| Variable | Purpose |
|----------|---------|
| `AUTH_PASSPHRASE` | Legacy owner login passphrase verification |
| `AUTH_SECRET` | JWT signing secret for session cookies |
| `SITE_GATE_PASSWORD` | Front-door site gate password |
| `APP_URL` | Base URL for magic links and redirects |
| `TELEGRAM_BOT_TOKEN` | Optional Telegram notifications |
| `TELEGRAM_CHAT_ID` | Telegram destination for alerts |
| `CF_ACCESS_TEAM_DOMAIN` | Cloudflare Access team domain (activates Access mode when paired with AUD) |
| `CF_ACCESS_AUD` | Cloudflare Access application audience tag |

**Frontend environment** (`src/environments/environment.ts`):

- `production` boolean.
- `r2BaseUrl` — public R2 dev URL for constructing media src (value not reproduced here).

**CI secrets** (GitHub, not in repo):

- `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — deploy and D1 migration apply.

**Feature flags / modes:**

- `_middleware.ts` chooses **Cloudflare Access mode** when both `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` are set; otherwise **legacy passphrase/JWT mode**. Editor allowlist emails defined in `functions/lib/access.ts` (not reproduced).

### 6.1 HTTP / API endpoints

All routes are Pages Functions under `functions/`. Middleware applies unless allowlisted or GET-in-legacy-mode.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/health` | Liveness + timestamp | none |
| `GET` | `/api/itinerary` | Cities + events for calendar/itinerary | site-gate / Access |
| `GET` | `/api/reservas` | Flat ordered events for bookings page | site-gate / Access |
| `GET` | `/api/map/events` | Geo events for map layer | site-gate / Access |
| `GET` | `/api/cities` | City list metadata | site-gate / Access |
| `GET` | `/api/cards/:city` | City cards + links | site-gate / Access |
| `PATCH` | `/api/cards/:city` | Update card content | owner / editor |
| `GET` | `/api/photos` | Photo/video metadata list | site-gate / Access |
| `POST` | `/api/photos` | Multipart upload to R2 + D1 insert | owner |
| `POST` | `/api/events` | Create event | owner |
| `PATCH` | `/api/events/:id` | Update event | owner |
| `DELETE` | `/api/events/:id` | Delete event | owner |
| `GET` | `/api/weather/:city` | 16-day forecast proxy (Open-Meteo) | site-gate / Access |
| `POST` | `/api/auth/login` | Passphrase login, sets session cookie | allowlisted |
| `POST` | `/api/auth/logout` | Clear session | allowlisted |
| `GET` | `/api/auth/me` | Current auth state for Angular | allowlisted |
| `GET` | `/api/auth/whoami` | Identity for welcome page (Access mode) | allowlisted |
| `GET` | `/api/auth/magic-link` | Magic-link handler | allowlisted |
| `POST` | `/api/site-gate/login` | Site gate password | allowlisted |
| `GET` | `/api/site-gate/me` | Site gate pass status | allowlisted |
| `POST` | `/api/access-requests` | Submit access request | allowlisted |
| `GET` | `/api/access-requests` | List pending requests | owner |
| `GET` | `/api/access-log` | Visit log (500 entry cap) | editor |
| `POST` | `/api/admin/invite` | Generate visitor invite link | owner |
| `POST` | `/api/admin/approve` | Approve access request | owner |
| `POST` | `/api/admin/reject` | Reject access request | owner |
| `GET` | `/api/admin/sessions` | List active sessions | owner |
| `DELETE` | `/api/admin/sessions` | Revoke session | owner |

**Angular client routes** (`src/app/app.routes.ts`):

| Path | Feature | Guard |
|------|---------|-------|
| `/` | redirect → `/calendario` | — |
| `/calendario` | Calendar | `authGuard` (currently no-op `true`) |
| `/itinerario` | Itinerary timeline | `authGuard` |
| `/mapa` | Map | `authGuard` |
| `/sitios` | City pages hub | `authGuard` |
| `/fotos` | Media gallery | `authGuard` |
| `/reservas` | Bookings list | `authGuard` |
| `/modificaciones` | Owner event editor | none (checks `AuthService.isOwner()` in component) |
| `/bienvenida` | Post-login welcome | none |
| `/access` | Access request form | none |
| `/admin` | Admin panel | `ownerGuard` |
| `/madrid`, `/barcelona`, etc. | redirect to `/sitios?c=…` | — |
| `**` | Not found | — |

Actual front-door protection is enforced by `SiteGatePanel` in `app.ts` until `SiteGateService.passed()` is true.

### 6.2 Other interfaces

- **CLI:** `npm run db -- --command "…"` / `--file` wraps `wrangler d1 execute eurotrip2026 --remote`.
- **MCP (local dev, gitignored):** Angular CLI MCP exposes `build`, `devserver`, `test`, `modernize`, `e2e`, `list_projects`, `get_best_practices`, `search_documentation`, `ai_tutor` per `README.md`.
- **Python offline tools:** OSRM and rail waypoint generators under `scripts/` for map migration SQL.
- **Telegram:** `functions/lib/telegram.ts` supports optional bot notifications (env-gated).

## 7. Data & persistence

**Stores:**

- **Cloudflare D1 (`eurotrip2026`):** Structured trip data—`cities`, unified `events` with optional `events_traslado` / `events_estadia` sub-rows, `cards` + `card_links`, `photos` metadata, `sessions`, `access_requests`, `access_log`. Legacy `_legacy_*` tables and `d1_migrations` metadata exist but are dormant per `docs/db-workflow.md`.
- **Cloudflare R2 (`eurotrip2026-media`):** Binary photo and video objects; D1 `photos` table holds keys, captions, `city_id`, `date_taken`, uploader notes.

**Key entities:**

- **City:** slug, arrival/departure dates, nights, display color, lat/lon.
- **Event:** master itinerary row with `type` (`traslado` | `hito` | `estadia`), timestamps, USD cost, `confirmed`/`done`/`mandatory`, icon, optional `card_id` cross-reference, coordinates for map.
- **Card:** per-city `info` or `note` content with optional external links.
- **Photo:** R2 key + metadata; gallery groups by city itinerary order (not strictly `date_taken`).

**Topology:** Edge-hosted SPA reads from same-region Pages Functions → D1/R2. No local database replica. D1 Time Travel provides 7-day restore window. Markdown files are the long-horizon human-readable backup.

## 8. Docs & agent memory (required scan)

**Sources read and folded in:**

- `README.md` — stack table, PrimeNG+Tailwind integration, project structure, skills table, MCP overview, production-only workflow, getting started commands.
- `PRD.md` — AI-first mandate, ADR index, language rule, design constraints (PrimeNG-first, absolute componentization), page specs (calendar, itinerary, map, sitios, photos), infrastructure table, seed data, out-of-scope list.
- `AGENTS.md` — must-read ADRs, skill index, MCP servers, trip constraints (2 adults, carry-on, route, confirmed flights), workflow rules (push to prod, D1 remote-only, markdown fallback sync).
- `VIAJE.md` — Spanish canonical trip log with transport table, accommodations, and day-by-day bitácora across all cities.
- `docs/db-workflow.md` — production D1 commands, schema table, limits, recovery procedures.
- `ADRs/adr-001-glossary.md` — domain vocabulary (event types, cards, confirmed, admin path).
- `ADRs/adr-002-tech-stack.md` — locked stack and Cloudflare-only infrastructure.
- `ADRs/adr-003-requirements.md` — binding requirements (note: original "no auth" requirement superseded in practice by gated access scaffolding).
- `ADRs/adr-004-angular-patterns.md` — signals, OnPush, inject(), httpResource (referenced via AGENTS).
- `ADRs/adr-009-routing.md` — lazy loading, signal route inputs, functional guards, SPA `_redirects`.
- `CHANGELOG.md` — recent feature groups (gallery UX, map waypoints, Cloudflare Access scaffolding, media upload).
- `.gitignore` — confirms `.claude/`, `.agents/`, `.mcp.json`, `context/` are local-only; **not present in shallow clone**; content summarized from `README.md` / `AGENTS.md` / `PRD.md` references only.
- **`.docs/`** — not present in repository tree.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public GitHub repo for a personal trip site. Operational URLs and traveler details appear in committed markdown (`VIAJE.md`, migrations)—this summary avoids reproducing live domains, emails, or connection strings.
- **Auth model:** Three layers evolving in parallel: (1) site-gate password before any UI, (2) legacy JWT session cookies for owner/visitor roles, (3) optional Cloudflare Access + Google IdP with editor email allowlist. API middleware enforces GET-open / mutation-restricted semantics per mode.
- **Write surface:** Public cannot mutate itinerary data; owner routes and POST/PATCH/DELETE APIs require owner or editor identity.
- **Secrets:** `.env`, `.dev.vars`, PEM/key patterns, and credential JSON globs are gitignored. This summary contains no secret values, tokens, or passwords.
- **Access logging:** `access_log` table records page/API visits with geo metadata when Access mode or tracking paths are active.

## 10. Operational picture

**Local development:**

```bash
npm install
npm test              # Vitest via ng test
npm run build         # production build (prebuild writes version.json)
npm run lint          # eslint on src
npm run db -- --command "SELECT …"   # remote D1 only
```

`README.md` and `AGENTS.md` emphasize **production-only validation**—smoke script hits live deployment, not localhost.

**Deployment (`.github/workflows/deploy.yml`):**

1. **migrate** — `wrangler d1 migrations apply eurotrip2026 --remote` on push to `prod`.
2. **deploy** — `npm run build -- --configuration production`, then `wrangler pages deploy` to project `eurotrip2026`.
3. **smoke** — `scripts/smoke-prod.mjs` after 20s propagation delay.

Standalone migration workflow: `.github/workflows/apply-migrations.yml` (manual `workflow_dispatch` with optional dry run).

**Versioning:** `scripts/gen-version.mjs` at prebuild; `public/version.json` consumed by `version-check.service` for deploy freshness hints.

**Hardware constraints:** Mobile-first UI for on-trip use; no GPU or edge-device requirements. Trip constraint: carry-on luggage only (10 kg per passenger).

## 11. Open questions / unknowns

- **Branch naming:** GitHub default branch is `master` per assignment metadata; production CI triggers on `prod`. Relationship between these branches in day-to-day workflow is not fully documented in a single file.
- **Auth cutover state:** Cloudflare Access scaffolding is present but dormant until `CF_ACCESS_*` env vars are set; unclear from tree alone whether production currently uses legacy site-gate only or full Access.
- **ADR vs implementation drift:** ADR-003 still states "no authentication" while the codebase has substantial auth, admin, and access-request systems—likely intentional evolution not yet reflected in ADR.
- **docs vs migrations folder:** `docs/db-workflow.md` states "no migrations folder" while `migrations/` with 118 files and CI apply jobs clearly exists—workflow may have shifted from ad-hoc SQL to tracked migrations without doc update.
- **`.claude/` / `.agents/` contents:** Gitignored; skill file contents not inspectable from clone—only names and purposes from `README.md` / `AGENTS.md`.
- **Telegram integration:** Library present; production activation status unknown without env inspection.
