---
id: "kcbd-monitor"
title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF)"
visibility: private
importance: high
source_repo: "kcbd-monitor"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags:
  - "iot"
  - "time-series"
  - "django"
  - "drf"
  - "astro"
  - "svelte"
  - "postgresql"
  - "aws"
  - "amplify"
  - "ecs"
  - "raspberry-pi"
  - "vpd"
  - "cultivation"
  - "monitoring"
problems_solved:
  - "Fragmented, reactive environmental monitoring in multi-room indoor cultivation — no single live view, no durable history, gradual drifts missed until visible plant stress."
  - "Legacy monolith stack (Django templates + HTMX + server-side Plotly) coupled presentation to data, blocked modern clients, and carried security debt (open ingestion, exposed database)."
  - "High-volume time-series reads (~7 GB historical readings) require database-side downsampling and aggregation without loading raw rows into application memory."
technologies:
  - "Astro 7"
  - "Svelte 5"
  - "Tailwind CSS v4"
  - "shadcn-svelte"
  - "echarts 6"
  - "Vitest 4"
  - "Django 6"
  - "Django REST Framework 3.17"
  - "PostgreSQL 17 (RDS)"
  - "pandas / numpy (server-side resampling)"
  - "AWS Amplify Hosting"
  - "AWS ECS Fargate"
  - "AWS ALB"
  - "AWS Secrets Manager"
  - "GitHub Actions"
  - "Docker Compose (local dev)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# kcbd-monitor

> **Problem thesis (required):** kcbd-monitor exists to replace a production legacy indoor-environment monitoring system with a **decoupled, secure, headless architecture** that continuously ingests IoT sensor readings (temperature, humidity, light, substrate), stores them as durable time series grouped by cultivation room, and surfaces live dashboards plus historical charts — including derived agronomic indicators like Vapor Pressure Deficit (VPD) — so growers and technicians can see whole-facility state at a glance, spot drifts before crop damage, and trust that only authorized devices can write data. The refactor preserves the legacy domain logic while eliminating the monolith's security and scalability risks.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/kcbd-monitor` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Full-stack refactor of dj-indoor-monitor: headless Django REST API + Astro static frontend for IoT environmental time-series monitoring in controlled cultivation spaces. |
| Audience | Growers/operators (dashboard consumers), technicians/installers (sensor catalog), Raspberry Pi field devices (ingest clients), system admins (infra/CI), AI coding agents (extensive SSOT docs and ADRs). |

## 2. Problems it solves

### P1 — No centralized, continuous environmental visibility

- **Who hurts:** Indoor cultivation operators managing multiple rooms with heterogeneous Raspberry Pi sensor devices.
- **Pain today:** Without a centralized system, operators rely on spot checks, handheld meters, or memory — missing gradual drifts, catching problems only after visual plant stress, and lacking historical evidence for post-mortems or cycle planning.
- **How this repo answers:** Authenticated high-frequency `POST` ingestion stores every reading in a PostgreSQL time-series table. A public `latest` endpoint exposes the most recent value per (sensor, metric) pair for wall-display dashboards; authenticated endpoints serve history, resampled charts, room/sensor catalogs, and on-the-fly VPD. The Astro frontend polls these endpoints and renders gauges, traffic-light banding, and echarts time-series client-side.
- **Out of scope:** Actuation/control of HVAC or irrigation; agronomic prescriptions; real-time WebSocket push (MVP uses polling); multi-tenant SaaS.

### P2 — Legacy monolith security and coupling

- **Who hurts:** The organization running the legacy dj-indoor-monitor system and anyone depending on trustworthy sensor data.
- **Pain today:** The legacy stack coupled Django templates, HTMX, and server-side Plotly chart rendering in one deployable unit. It carried documented risks: unauthenticated ingestion, database ports exposed broadly, secrets in server env files, and manual EC2 deploys without reproducible CI/CD.
- **How this repo answers:** Strict separation — static Astro site on Amplify Hosting talks cross-origin to a headless DRF API on ECS Fargate behind an ALB. Ingestion requires a static Bearer token; operator reads use per-user DRF Token auth with Django Groups (`reader` / `operator`). Only `GET /api/data-point/latest/` and health probes are anonymously reachable, enforced at both DRF permission layer and ALB path rules (ADR-009). Credentials live in AWS Secrets Manager, never in the repo.
- **Out of scope:** Decommissioning or modifying the legacy EC2 deployment (explicitly left untouched in sa-east-1).

### P3 — Time-series visualization at scale without choking the API

- **Who hurts:** Operators requesting multi-day charts and the backend serving a ~7 GB readings table migrated from legacy TimescaleDB.
- **Pain today:** Raw point dumps would overwhelm browsers and API memory; the legacy system used TimescaleDB hypertables and server-side Plotly rendering.
- **How this repo answers:** Historical reads use pandas-based server-side resampling in `backend/kcbd_core/resample.py` via `GET /api/data-point/timeframed/` — one sensor per request, configurable timeframe buckets (`5S` through `1D`), optional min/max/mean/first/last aggregations, ~120-point display target, 7-day window cap, and admin-editable safety caps (`timeframed_db_preload_cap`, `timeframed_output_cap`) stored in `SiteConfigurations`. Out-of-range values are filtered on read per metric catalog in `docs/DOMAIN.md`. Chart rendering moved entirely to the browser via echarts Svelte islands.
- **Out of scope:** TimescaleDB or other proprietary time-series extensions (deliberately plain PostgreSQL on RDS); server-side chart image generation.

## 3. Product / idea

kcbd-monitor is the **greenfield rewrite** of the ALVS indoor monitoring product. Physical Raspberry Pi devices report single-character metric codes (`t` temperature, `h` humidity, `l` light, `s` substrate) with float values and timestamps. The backend stores these as `DataPoint` rows where `sensor` is a free string (not a foreign key) for write efficiency; room membership resolves on-read by crossing `DataPoint.sensor` with the `Sensor` catalog table linked to `Room` entities.

The mental model is **three runtime tiers plus edge devices**:

1. **Sensor clients** — periodic HTTPS `POST` batches to `/api/data-point/` with Bearer ingest auth.
2. **Headless API** — Django 6 + DRF on ECS Fargate, PostgreSQL on shared ALVS RDS, Django admin for low-frequency catalog/config CRUD.
3. **Static frontend** — Astro 7 builds to static HTML/JS; Svelte 5 islands handle interactivity (charts, polling, login, shadcn-svelte UI). Deployed via Amplify; refreshes data by visibility-aware polling, not WebSockets.

Both dev and prod environments are live. The legacy system continues in parallel until a planned pg_dump migration cutover (documented in `docs/ARCHITECTURE.md` §6). Current project phase is **2B — frontend implemented, gap-closing**: all 12 API endpoints ship; the Astro app has eight routes and 442 Vitest tests; active work is visual polish, sensor grouping, and closing remaining gap-list features rather than initial scaffolding.

### 3.1 North-star use cases

1. **Operator morning check** — open the dashboard (`/`), see per-room gauges with cold/optimal/hot band coloring from latest readings, identify any out-of-range metric within seconds.
2. **Trend diagnosis** — on `/sensores`, pick a sensor and timeframe; `timeframed/` returns resampled multi-metric series rendered as echarts line charts; active-sensor window hides stale devices.
3. **VPD assessment** — on `/vpd`, view per-sensor VPD computed from latest `t`+`h` pairs against agronomic bands (propagation, vegetation, flowering phases).
4. **Technician provisioning** — register `Room` and `Sensor` entries in Django admin; new device readings appear under the correct room on next poll without code deploy.
5. **Field device ingest** — Raspberry Pi runs `clients/raspberry-pi/rpi-sensor-service.py`, batches readings, flushes offline buffers atomically (max 1000 per request).
6. **Agent-assisted development** — consult `API.md` first for live endpoint behavior, `docs/ENDPOINTS.md` for contract design, `docs/MODEL.md` for schema, `docs/DOMAIN.md` for business rules; ADRs in `docs/ADRS/` govern all non-trivial decisions.

### 3.2 Non-goals

- Realtime WebSockets or push notifications (polling only; future ADR required).
- Server-side chart rendering (Plotly, kaleido removed from stack).
- Alerts and notification pipelines.
- Multi-tenant end-user management (interim per-user Token auth; future identity broker planned).
- Modifying the legacy dj-indoor-monitor repository or its production host.
- Agronomic advice — the system surfaces data; interpretation stays with operators.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (Django backend), Node ≥22.12 (Astro build), Bun (frontend package manager) | `backend/requirements.txt`, `frontend/package.json` engines |
| Frontend | Astro 7.0.2, Svelte 5.56.4, Tailwind 4.3.1, shadcn-svelte (vendored), echarts 6.1.0 | `frontend/package.json`, `frontend/src/lib/components/ui/`, `docs/REQUIREMENTS.md` |
| Backend / API | Django 6.0.6 + DRF 3.17.1, gunicorn, whitenoise, django-cors-headers | `backend/requirements.txt`, `backend/kcbd_core/api.py` |
| Data | PostgreSQL 17 on RDS (logical DB `kcbd`); local Postgres 17 via Docker Compose | `docs/MODEL.md`, `docker-compose.yml`, `infra/kcbd-backend-infra.yaml` |
| Infra / deploy | AWS Amplify (frontend), ECS Fargate + ALB (backend), ECR, Secrets Manager, Route53, CloudWatch; GitHub Actions on `dev`/`prod` branches | `amplify.yml`, `.github/workflows/deploy.yml`, `docs/INFRA.md` |
| AI / agents | `.claude/rules/` (ADR symlinks), `.agents/skills/kcbd-logs/`, `AGENTS.md` SSOT | `.claude/`, `AGENTS.md` |
| Tests | Vitest 4 + Testing Library Svelte (frontend, 442 tests); pytest stack adopted but backend test surface lighter | `frontend/vitest.config.ts`, `docs/REQUIREMENTS.md` |

### 4.1 Notable dependencies (curated)

- `pandas` / `numpy` — powers `GET /api/data-point/timeframed/` resampling in `backend/kcbd_core/resample.py`; central to read-performance requirement OB-03.
- `echarts` — client-side time-series charting in Svelte islands; replaces legacy server-side Plotly.
- `bits-ui` + `tailwind-variants` — headless primitives underlying vendored shadcn-svelte components.
- `psycopg[binary]` — PostgreSQL driver for RDS connectivity via `DATABASE_URL`.
- `django-cors-headers` — required because Amplify frontend and API are on distinct hosts.
- `dj-database-url` — parses `DATABASE_URL` for Django database config.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `backend/manage.py` — Django CLI (migrate, seed_admin, seed_role_users, runserver).
  - `backend/config/urls.py` — HTTP route registration (admin, healthz, auth login, DRF router for data-point/rooms/sensors, VPD view).
  - `frontend/src/pages/*.astro` — eight Astro page shells: `/`, `/interactivo`, `/sensores`, `/vpd`, `/graficos`, `/salud`, `/login`, `/showcase`.
  - `clients/raspberry-pi/rpi-sensor-service.py` — field device ingest client.
  - `amplify.yml` — Amplify build spec (bun install + astro build).
  - `.github/workflows/deploy.yml` — backend ECS deploy on push to `dev`/`prod` branches.

- **Domain / core:**
  - `backend/kcbd_core/models.py` — `Room`, `Sensor`, `DataPoint`, `SiteConfigurations`.
  - `backend/kcbd_core/resample.py` — pandas resampling for timeframed endpoint.
  - `backend/kcbd_core/permissions.py`, `authentication.py` — ingest Bearer vs Token auth, `IsReader`/`IsOperator`/`HasIngestRole`.
  - `frontend/src/lib/domain/` — client-side domain helpers (VPD, staleness, timeframe, metric bands, room ordering) with Vitest coverage.

- **Adapters:**
  - `backend/kcbd_core/api.py`, `serializers.py`, `auth_views.py` — DRF viewsets and auth.
  - `backend/kcbd_core/views.py` — healthz probe (`SELECT 1`).
  - `frontend/src/lib/` — API client, polling provider, chart components.

- **Docs vaults:**
  - `docs/` — primary markdown vault (PRD, DOMAIN, MODEL, ENDPOINTS, ARCHITECTURE, INFRA, DEVELOPMENT, DEPLOYMENT, SECRETS, RPI-INGEST, ADRs 001–016, context notes).
  - Root SSOT files: `README.md`, `AGENTS.md` (symlinked as `CLAUDE.md`), `API.md` (live contract), `PRD.md` (stack-agnostic product intent), `BDD.md`, `TDD.md`, `CHANGELOG.md`.
  - **`.docs/`** — not present in this repository; all hidden-vault content lives under `docs/`.

- **Agent scaffolding:**
  - `.claude/rules/` — symlinks to numbered ADRs (naming, frontend, backend, model, endpoints, markdown vault, GitHub backlog, CI pipeline, public surface, shadcn, echarts, vitest, temp auth gate, AWS logs skill, per-user auth, doc anchors).
  - `.claude/skills/kcbd-logs/` — duplicate of `.agents/skills/kcbd-logs/`; CloudWatch/Amplify log retrieval skill with delta cursor.
  - `AGENTS.md` — authoritative agent instructions: API-first delivery order, `API.md` over `ENDPOINTS.md` for live behavior, document map, fixed stack table, language conventions (ADR-001).
  - `skills/skills.md` — placeholder noting future domain skills; largely superseded by `.agents/skills/`.

- **Generated / vendor:**
  - `frontend/src/lib/components/ui/` — vendored shadcn-svelte components (do not treat as hand-authored domain code).
  - `frontend/dist/` — Astro build output (gitignored).
  - `node_modules/`, `.venv/`, `backend/staticfiles/` — gitignored; not scanned.

- **Infrastructure as code:**
  - `infra/kcbd-backend-infra.yaml` — CloudFormation for kcbd backend slots on shared ALVS platform.
  - `infra/deploy-infra.sh`, `infra/create-rds-database.sh` — operator scripts.

- **Scripts:**
  - `scripts/migrate_legacy.py` — legacy data migration helper.
  - `scripts/mock-data.py` — local dev data seeding.
  - `scripts/adr-watch.sh` — watches ADR file changes against `scripts/adr-watch-map.json`.

## 6. Configuration & contracts (no secrets)

Environment variable names and purposes (values never documented here):

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` / `DJANGO_SECRET_KEY` | Django signing key |
| `DATABASE_URL` | PostgreSQL connection string |
| `DJANGO_ALLOWED_HOSTS` | Host header allowlist |
| `DJANGO_DEBUG` | Debug mode toggle |
| `CORS_ALLOWED_ORIGINS` | Frontend origin allowlist for cross-origin API calls |
| `INGEST_TOKEN` | Static Bearer token for sensor `POST` ingestion |
| `INGEST_API_KEY` | Legacy alias for ingest token |
| `READ_TOKEN` | Decommissioned shared read Bearer (do not use) |
| `KCBD_OPERATOR_USER` | Seed `username:password` for operator group |
| `KCBD_READER_USER` | Seed `username:password` for reader group |
| `DJANGO_ADMIN_PASSWORD` | Local superuser password |
| `POSTGRES_PASSWORD` | Local Docker Compose DB password |
| `API_BASE_URL` / `PUBLIC_API_BASE_URL` | Frontend → API base URL |
| `DJANGO_LOGURU_LEVEL` | Logging verbosity |

Production secrets map to AWS Secrets Manager paths documented in `docs/SECRETS.md` under prefix `alvs/<env>/kcbd/` (keys: `db`, `django`, `ingest`; `read` secret exists but shared read Bearer is decommissioned).

Django settings highlights (`backend/config/settings.py`): `TIME_ZONE = America/Argentina/Buenos_Aires` with `USE_TZ = True`; DRF throttling scopes `anon`, `latest`, `ingest`, `timeframed`, `login`; CORS and WhiteNoise middleware enabled; no custom user model.

### 6.1 HTTP / API endpoints

Full live contract in `API.md`. Summary:

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `POST` | `/api/auth/login/` | Exchange username/password for DRF Token | none (throttled 20/min) |
| `GET` | `/api/data-point/` | List raw readings with date/sensor/metric filters | Token (`reader` or `operator`) |
| `POST` | `/api/data-point/` | Ingest single or batch readings (max 1000, atomic) | Bearer ingest token |
| `GET` | `/api/data-point/{id}/` | Retrieve one reading by ID | Token (authenticated) |
| `PUT` | `/api/data-point/{id}/` | Full replace one reading | Token (`operator`) |
| `PATCH` | `/api/data-point/{id}/` | Partial update one reading | Token (`operator`) |
| `DELETE` | `/api/data-point/{id}/` | Delete one reading | Token (`operator`) |
| `GET` | `/api/data-point/latest/` | Latest value per (sensor, metric) pair | **public** (throttled 120/min) |
| `GET` | `/api/data-point/timeframed/` | Pandas-resampled series for one sensor | Token (`reader` or `operator`) |
| `GET` | `/api/vpd/` | On-the-fly VPD from latest t+h per sensor | Token (`reader` or `operator`) |
| `GET` | `/api/rooms/` | List cultivation rooms | Token (`reader` or `operator`) |
| `GET` | `/api/sensors/` | List catalogued sensors with room names | Token (`reader` or `operator`) |
| `GET` | `/healthz/` | Liveness/readiness (DB `SELECT 1`) | public |
| `GET` | `/api/healthz/` | Alias of healthz | public |

All routes require trailing slash. JSON only; DRF error shapes (`{"detail": "..."}` or field errors). Rate limits documented per scope in `API.md`.

### 6.2 Other interfaces

- **Django admin** — `/admin/` for `Room`, `Sensor`, `SiteConfigurations`, user/group management; staff credentials via Secrets Manager in prod.
- **Raspberry Pi client** — `clients/raspberry-pi/rpi-sensor-service.py` reads local sensor config from `rpi-sensor-config.yaml`, posts batches to ingest endpoint; documented in `docs/RPI-INGEST.md`.
- **CLI (Django management)** — `seed_admin`, `seed_role_users`, migrations; no standalone public CLI beyond `manage.py`.
- **Agent skill `kcbd-logs`** — `uv run .agents/skills/kcbd-logs/scripts/logs.py` for incremental CloudWatch (backend) and Amplify build log retrieval with cursor state in gitignored `state.json`.
- **ADR watch script** — `scripts/adr-watch.sh` monitors ADR file changes for doc drift.

## 7. Data & persistence

**Store:** PostgreSQL on shared ALVS RDS instances (`alvs-dev-pg` / `alvs-prod-pg`), logical database `kcbd`, user `kcbd_user`. Local dev uses Docker Compose `postgres:17-alpine` with named volume `pgdata`.

**Core entities** (from `docs/MODEL.md`):

| Table | Entity | Role |
|-------|--------|------|
| `kcbd_room` | `Room` | Named cultivation space |
| `kcbd_sensor` | `Sensor` | Device catalog with FK to Room |
| `kcbd_datapoint` | `DataPoint` | Atomic reading: timestamp, sensor (string), metric (1 char), value (float) |
| `kcbd_site_configurations` | `SiteConfigurations` | Key/value runtime config (metric catalog, timeframed caps) |

`DataPoint` is a standard PostgreSQL table (no TimescaleDB). Composite indexes optimize `latest/` (`idx_sensor_metric_timestamp`), range scans, and resample preloads. Auth uses Django contrib `User`, `Group`, and DRF `Token` tables — not custom `kcbd_*` auth models.

**Topology:** Edge Raspberry Pi devices write northbound to the public API ALB. Browser clients read from Amplify-hosted static assets that call the API cross-origin. All persistent state lives in RDS; no edge KV or vector store. DEV environment confirmed live-ingesting with millions of rows as of mid-2026.

**Migration:** Legacy ~7 GB TimescaleDB hypertable exports via `pg_dump` to plain PostgreSQL; cutover procedure outlined in `docs/ARCHITECTURE.md` §6, script `scripts/migrate_legacy.py`.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **`README.md`** — project entry, phase status (2B), doc map, decided stack, legacy reference to dj-indoor-monitor.
2. **`AGENTS.md`** — agent SSOT: API-first rule, `API.md` precedence over `ENDPOINTS.md`, phase 2B status, fixed stack table, document ownership boundaries.
3. **`API.md`** — live HTTP contract with all 12 endpoints, auth model, throttles, request/response shapes, BDD cross-refs.
4. **`PRD.md`** (root) — stack-agnostic product vision, personas, user stories, success criteria.
5. **`docs/PRD.md`** — stack-aware product requirements: goals OB-01–OB-05, MVP scope, personas P-01–P-04, functional requirements F-01–F-07.
6. **`docs/DOMAIN.md`** — metric codes, VPD formula and bands, active-sensor window, downsampling rules, outlier filtering.
7. **`docs/MODEL.md`** — schema SSOT: entities, indexes, auth-outside-schema table, storage decision (plain PG on RDS).
8. **`docs/ENDPOINTS.md`** — contract-design SSOT mirroring MODEL; public-surface narrowing; timeframed/vpd contracts.
9. **`docs/ARCHITECTURE.md`** — system topology (static FE + API + DB + sensors), ingest/read flows, admin surfaces, legacy migration outline.
10. **`docs/INFRA.md`** — AWS service mapping, shared ALVS platform audit, dev/prod provisioning status, DNS scheme, legacy risks not to replicate.
11. **`docs/DEVELOPMENT.md`** — local Docker Compose topology, port 8002 mapping, env var contract, `bun run dev` for frontend.
12. **`docs/REQUIREMENTS.md`** — pinned dependency versions with ADR links.
13. **`docs/ADRS/`** — 17 numbered ADRs (001 naming through 016 doc anchors) governing every major decision.
14. **`.claude/rules/`** — symlinked ADRs loaded as agent rules; enforces conventions during AI-assisted development.
15. **`.claude/skills/kcbd-logs/SKILL.md`** and **`.agents/skills/kcbd-logs/SKILL.md`** — AWS log retrieval skill with delta cursor and fingerprint tracking.
16. **`skills/skills.md`** — placeholder for future domain skills (partially stale; references old Angular wording).
17. **`.docs/`** — **not present**; no hidden docs vault beyond `docs/`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg` org. This summary contains no clone URLs, live credentials, or connection strings with passwords.
- **Auth model (three principals):**
  - Anonymous — `latest/` and `healthz/` only (ALB + DRF defense in depth).
  - Operator/reader — per-user DRF Token via `POST /api/auth/login/`; Groups gate read vs write-correction (`operator` for PUT/PATCH/DELETE).
  - Ingest device — static Bearer token; cannot read; throttled separately.
- **Decommissioned:** Shared read Bearer token (`READ_TOKEN` / Secrets Manager `read` key) — must not be used.
- **Temporary frontend gate:** Client-side password gate (ADR-013) is cosmetic; real boundary is backend tokens + ALB path lockdown.
- **Secrets hygiene:** `.env` gitignored; `.env.example` has empty placeholders only; `docs/SECRETS.md` documents secret path shapes not values.
- **Legacy contrast:** New system closes open POST, public DB ports, and in-repo production secrets that plagued the legacy EC2 deployment.

## 10. Operational picture

### Local development

1. Copy `.env.example` → `.env`, fill non-production values.
2. `docker compose up` — starts Postgres + Django backend on host port **8002** (not 8000).
3. `cd frontend && bun install && bun run dev` — Astro dev server on port **4321** (frontend intentionally not in Docker Compose).
4. `bun test` in `frontend/` — runs 442 Vitest tests.
5. Simulate ingest with `curl` or `scripts/mock-data.py` per `docs/DEVELOPMENT.md`.

### Deployment

- **Backend:** GitHub Actions workflow `.github/workflows/deploy.yml` triggers on push to `dev` or `prod` branches. Builds Docker image, pushes to ECR `alvs/kcbd-backend`, runs one-shot ECS migration task, updates Fargate service on shared `alvs-dev` / `alvs-prod` clusters.
- **Frontend:** AWS Amplify connected to `main` branch (both dev and prod Amplify apps currently build from `main` — open decision per `docs/INFRA.md`). Build via `amplify.yml`: Node 22 + bun install + `astro build` → `frontend/dist`.
- **Infra provisioning:** CloudFormation stack `kcbd-monitor-infra` (and prod variant) via `infra/deploy-infra.sh`.
- **Health checks:** ALB targets `/healthz/` (HTTP, no redirect) expecting `{"status":"ok","db":"connected"}`.

### Hardware constraints

- Field devices: Raspberry Pi running Python ingest service (`clients/raspberry-pi/`).
- No GPU or specialized edge compute required; all aggregation runs on Fargate tasks with pandas.

## 11. Open questions / unknowns

- **Amplify branch strategy:** Both dev and prod Amplify apps build from `main`, making frontends byte-identical — whereas backend deploys independently from `dev`/`prod` branches. Long-term intent undecided (`docs/INFRA.md`).
- **Identity broker:** Permanent Google/OIDC sign-in planned to replace interim per-user Token auth and temporary frontend password gate (ADR-013, ADR-015).
- **Legacy cutover:** Detailed pg_dump incremental migration and sensor repointing procedure during cutover window not fully scripted (`docs/ARCHITECTURE.md` §6 pending).
- **Default polling frequency:** Frontend `PollingProvider` interval and API load impact not finalized.
- **RDS scaling:** `db.t4g.micro` with 20 GB and no autoscaling — may need review as ingest volume grows.
- **Backend pytest coverage:** pytest stack listed in `docs/REQUIREMENTS.md` as adopted; comprehensive backend automated test suite maturity unclear from tree scan alone.
- **`.docs/` vault:** Directory does not exist in this repo; all documentation is under `docs/` with Obsidian-style frontmatter and wikilinks.
