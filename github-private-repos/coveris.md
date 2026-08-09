---
id: "coveris"
title: "Coveris — healthcare capacity planning for Argentine private clinics"
visibility: private
importance: high
source_repo: "coveris"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "active"
related: []
tags: ["healthcare", "capacity-planning", "angular", "django", "postgresql", "cloudflare", "workers", "containers", "argentina", "saas", "fsm", "productivity", "preliq"]
problems_solved:
  - "Private clinics manage staffing with fragmented spreadsheets, so HR cannot answer in real time who can cover a shift, with which certifications, and what overtime impact that creates."
  - "Operational demand (positions per org unit) and employee supply (contracts, reductions, leave) live in separate systems with no single source of truth for coverage gaps."
  - "Anesthesia productivity data trapped in Google Sheets cannot flow reliably into payroll-prep and audit workflows without manual re-entry."
technologies:
  - "Angular 21 CSR"
  - "PrimeNG 21 + Tailwind CSS 4"
  - "Django 5.2 + Django REST Framework 3.15"
  - "PostgreSQL 17"
  - "Cloudflare Workers + Containers"
  - "Supabase Postgres (managed DB layer)"
  - "Cloudflare Access OIDC (production auth target)"
  - "SimpleJWT httpOnly cookies (local dev)"
  - "Docker Compose (local dev)"
  - "Bun (frontend package manager)"
  - "uv (Python backend deps)"
  - "Vitest + pytest"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Coveris

> **Problem thesis (required):** Coveris is a proprietary healthcare **capacity-planning SaaS** for private clinics in Argentina. It closes the real-time gap between **operational demand** (positions declared on a configurable organizational tree) and **available supply** (employees with contracts, certifications, leave, and hour balances). Clinic staff today answer coverage questions by juggling multiple spreadsheets and phone calls; Coveris gives them one system that measures vacancy, partial coverage, full coverage, and surplus hours, supports assignment workflows with eligibility preview, and extends into productivity import, pre-liquidation, labor cost, and performance review modules. The product UI is Spanish-facing; the codebase is English throughout.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/coveris` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Real-time staffing gap measurement and assignment tooling for mid-size private clinics, built on a demand/offer domain model over a hierarchical org chart. |
| Audience | Clinic HR managers, service chiefs, auditors, and employees (role-scoped); internal developers and AI agents maintaining the stack; operators deploying to Cloudflare. |

## 2. Problems it solves

### P1 — Fragmented staffing data blocks real-time coverage decisions

- **Who hurts:** HR managers and service chiefs at private clinics (roughly 20–100 employees, 3–15 services) responsible for filling uncovered shifts.
- **Pain today:** Answering “who can cover this shift, with the right certifications, without blowing overtime?” requires opening multiple spreadsheets, calling supervisors, and checking paper certification folders. Data goes stale because sheets are edited without coordination. The clinic already has contracts, schedules, reductions, and licenses — but they are not unified.
- **How this repo answers:** Coveris models **OrgUnit** (configurable-depth tree), **Position** (weekly hour demand per unit, optional tag requirements), and **Employee** (FSM lifecycle with tag-based eligibility). **Assignment** links supply to demand with preview of hour impact. **Coverage** and **Hours Ledger** compute obligated vs assigned balances in real time, rolling up the org tree. Managers operate through Angular feature routes (`/roster`, `/coverage`, `/control-panel/structure`, `/services`, etc.) backed by a contract-first REST API (`API.md`).
- **Out of scope:** Full hospital information systems, patient scheduling, payroll execution, and generic HRIS replacement. Notifications to employees and advanced granular permissions are deferred beyond MVP boundaries in the PRD.

### P2 — No single source of truth for demand vs supply

- **Who hurts:** Clinic leadership and operations teams trying to see service-level staffing health at a glance.
- **Pain today:** Demand (how many hours each service needs) and offer (who is actually available after contracts, leave, and reductions) are tracked in different artifacts. Coverage status (vacant, partial, covered, surplus) cannot be computed consistently.
- **How this repo answers:** The backend splits domain apps explicitly: `apps.demand` (positions, org units, staffing plans), `apps.offer` (hours ledger computations), `apps.assignments` (assignment FSM + audit), `apps.tags` (certifications/contracts as typed tags per ADR-019). Business rules engine (`apps.business_rules`) evaluates eligibility at assignment time. Weekly structure and monthly scheduling modules extend demand planning beyond static positions.
- **Out of scope:** Institution-specific collective bargaining rule engines — the system is agnostic; each clinic configures its own structure and tags.

### P3 — Productivity data stuck in spreadsheets

- **Who hurts:** Auditors and managers reconciling anesthesia productivity for pre-liquidation and payroll prep.
- **Pain today:** Google Form responses land in Sheets; manual processes are needed to get clean codes and IDs into any downstream system.
- **How this repo answers:** `apps.productivity` exposes import endpoints (token-authenticated machine import and server-side Google Sheets pull). A documented Apps Script pushes the calculated **Registro** tab hourly via `POST /api/v1/productivity/imports/anesthesia/`. Local dev runs a `scheduler` sidecar that respects UI-driven sync cadence. Production Cloudflare Worker cron triggers the same sync path. Preliq (`apps.preliq`), cost (`apps.cost`), and performance (`apps.performance`) build on this data layer.
- **Out of scope:** Building or hosting the Google Form/Sheet itself; NIVO HSI integration is specified but awaiting external endpoint delivery.

## 3. Product / idea

Coveris is a full-stack web application: an **Angular 21** single-page client talks to a **Django REST Framework** API over same-origin `/api/*` paths. The mental model is three domains — **demand**, **offer**, and **bridge** (assignments) — centered on the **organigram** (org tree). Without the tree there is no “where” for employees, positions, coverage, or hours.

Users authenticate (SimpleJWT cookies locally; Cloudflare Access OIDC in production target), receive role-scoped visibility (`ADMIN`, `MANAGER`, `AUDITOR`, `EMPLOYEE` per ADR-044/045) further constrained by `User.scope_unit` (subtree scope per ADR-030). Managers design structure and demand in the Control Panel; operators view roster, coverage dashboards, scheduling grids, and economía cluster screens (productividad, costos, preliq, desempeño).

The platform is **mid-migration** from AWS (Amplify + ECS Fargate + RDS + Cognito) to **Cloudflare** (Worker serves static Angular build, proxies `/api/*` and `/admin/*` to a Django container, Supabase Postgres as `DATABASE_URL`). `wrangler.jsonc` and `worker/index.ts` encode this target topology; GitHub Actions `deploy-worker.yml` builds the SPA and deploys on pushes to `main`.

### 3.1 North-star use cases

1. **Fill an uncovered shift:** Manager opens coverage or roster, filters employees with available hours and required tags, previews assignment impact, confirms — coverage rollup updates immediately.
2. **Configure clinic structure:** Admin defines org units, positions, weekly structure templates, staffing plan lines, and tag catalog; mock-data packs under `mock-data/` seed demo clinics for dev/showcase.
3. **Sync productivity and run preliq:** Hourly Sheets import populates `ProductivityRecord`; auditor reviews via `/productividad`; admin runs pre-liquidation periods and exports.
4. **Agent/developer workflow:** Read `AGENTS.md`, start stack via `cotton-skills-dev-server`, treat `docs/API.md` as contract SSOT, run pytest/Vitest gates before milestones.

### 3.2 Non-goals

- Not open source — proprietary license; three named owners hold all rights (`README.md`).
- Not a multi-tenant public marketplace in current scope — single-clinic configuration model with scope isolation via org units and roles.
- Supabase Auth, Cloudflare D1, and Neon were explicitly rejected in migration ADRs — Postgres stays vendor-swappable via DSN only.
- Mock data must not leak into production pages (ADR-022): only Django seed commands and the `/showcase` design system may consume `mock-data/` and `frontend/src/app/shared/mocks/`.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node ≥22 / Bun 1.3.5 (frontend); Python ≥3.13 (backend) | `frontend/package.json`, `backend/pyproject.toml` |
| Frontend | Angular 21.2, PrimeNG 21, Tailwind 4, Chart.js, Vitest | `frontend/package.json`, `frontend/angular.json` |
| Backend / API | Django 5.2, DRF 3.15, uvicorn ASGI, django-fsm-2, SimpleJWT | `backend/pyproject.toml`, `docs/stack/backend.md` |
| Data | PostgreSQL 17 (local Compose); Supabase Postgres 17 (prod target) | `docker-compose.yml`, `docs/migration-plan/README.md` |
| Infra / deploy | Cloudflare Worker + Container (prod target); legacy AWS ECS/RDS/Amplify docs; GitHub Actions deploy | `wrangler.jsonc`, `worker/index.ts`, `.github/workflows/deploy-worker.yml`, `docs/prod/aws.md` |
| AI / agents | Extensive `.claude/` rules (ADR symlinks), `.agents/` Cloudflare skills, Obsidian vault MCP, cotton agent pipeline | `AGENTS.md`, `.claude/rules/`, `docs/README.md` |
| Tests | pytest + pytest-django (backend); Vitest + Angular test runner (frontend) | `backend/pyproject.toml`, `frontend/vitest.config.ts` |

### 4.1 Notable dependencies (curated)

- `primeng` / `@primeuix/themes` — UI component library and Lara/Noir/Zinc preset via `theme.config.ts`.
- `django-fsm-2` — Employee and Assignment lifecycle state machines with audit trail split (`apps.fsm`, `apps.audit_log`).
- `@cloudflare/containers` — Durable Object–backed Django container with scale-to-zero `sleepAfter`.
- `google-api-python-client` — server-side Google Sheets pull for productivity sync.
- `reportlab` / `openpyxl` — export surfaces for preliq and reporting.
- `holidays` — Argentine calendar/feriados support.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `frontend/src/main.ts` — Angular bootstrap; routes in `frontend/src/app/app.routes.ts`.
  - `backend/config/asgi.py` — ASGI app served by uvicorn in container.
  - `worker/index.ts` — Cloudflare Worker fetch handler (SPA assets vs API proxy vs cron sync).
  - `docker-compose.yml` — local `db`, `api`, `scheduler` services.

- **Domain / core (backend `apps/`):**
  - `users` — custom User, auth, OIDC hooks, access management.
  - `api` — Employee model core.
  - `demand` — OrgUnit, Position, staffing plan.
  - `offer` — hours ledger computations.
  - `assignments` — assignment FSM.
  - `tags` — tag catalog and employee/position tag links.
  - `business_rules` — rule catalogue and evaluation.
  - `weekly_structure`, `scheduling`, `calendar_api` — planning surfaces.
  - `productivity`, `preliq`, `cost`, `performance`, `catalog` — economía cluster.
  - `mockdata` — dev-only hot-load API (gated by `COVERIS_ENV`).

- **Frontend features (`frontend/src/app/features/`):**
  - `dashboard`, `roster`, `org-chart`, `structure`, `coverage`, `hours`, `shifts`, `scheduling`, `control-panel`, `economia` (+ productividad sub-routes), `productividad`, `preliq`, `costos`, `desempeno`, `audit-log`, `account-settings`, `help`, `pricing`, `catalogo`, `services`.

- **Adapters:**
  - `frontend/src/app/core/interceptors/` — auth cookie + error handling.
  - `backend/config/settings/` — environment layering (`base`, `local`, `production`).
  - `worker/index.ts` — injects secrets into container `envVars`.

- **Docs vaults:**
  - `docs/` — Obsidian SSOT vault (PRD symlink, ADRs, stack, dev, prod, migration-plan, integrations, marathon bug tickets, business-logic).
  - Root `PRD.md`, `API.md` (contract SSOT), `AGENTS.md`, `CLAUDE.md`.

- **Agent scaffolding:**
  - `.claude/rules/` — symlinked ADR rule files auto-loaded for agents (naming, stack, auth, testing, mock-data scope, design system, Argentine legal context, etc.).
  - `.claude/skills/` — vendored skills (`cotton-skills-dev-server`, docker-compose, django-expert, kdx-angular-*, obsidian-*).
  - `.claude/agents/` — `cotton-agent-docker-manager`, live-docs and backlog agents.
  - `backend/.claude/skills/` — django-pro, django-drf, kdx-fsm.
  - `.agents/skills/cloudflare/` — large Cloudflare reference skill tree (mirrored under `.claude/skills/cloudflare/`).

- **Mock / seed data:**
  - `mock-data/template/`, `mock-data/hospital-notti/`, `mock-data/clinica-francesa/`, `mock-data/clinic-bienestar/` — YAML entity packs (employees, org-units, positions, assignments, tags, users, avatars).

- **Tooling / scripts:**
  - `scripts/sync_avatars.py` — syncs avatar assets into frontend public folder on build.
  - `scripts/generate_avatars.py`, `tools/avatar-gen/` — avatar generation utility.
  - `xtras/` — ancillary media and conversion scripts (not core runtime).

- **Generated / vendor:** `node_modules/`, `frontend/dist/`, `backend/.venv/`, `.wrangler/` — gitignored; do not ingest.

## 6. Configuration & contracts (no secrets)

Environment variable **names** (from `.env.example` and `worker/index.ts`):

| Variable | Purpose |
|----------|---------|
| `DJANGO_SECRET_KEY` | Django signing secret (required in prod) |
| `DJANGO_SETTINGS_MODULE` | Settings module selector (`config.settings.local` vs `production`) |
| `COVERIS_ENV` | `dev` enables mock-data API; `prod` hides it |
| `POSTGRES_*` / `DATABASE_URL` | Database connection (Compose uses discrete vars; Cloudflare uses DSN) |
| `SUPERUSER_*` | Bootstrap admin on container first run |
| `MOCK_USER_PASSWORD` | Password applied to seeded mock users in dev |
| `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` | Host/CORS policy |
| `CACHE_URL`, `CACHE_DB_TABLE`, `LOGIN_THROTTLE_RATE` | Throttle/cache backends |
| `COVERIS_IMPORT_TOKEN` | Shared secret for machine productivity import and cron sync |
| `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SHEETS_REGISTRO_TAB` | Sheets pull configuration |
| `GOOGLE_SERVICE_ACCOUNT_FILE` / `GOOGLE_SERVICE_ACCOUNT_INFO` | Service account credential shape (never commit values) |
| `SCHEDULER_TICK_SECONDS` | Local scheduler wake interval |
| `COGNITO_*` | Legacy AWS Cognito settings (being removed per migration plan) |
| `CF_OIDC_*` | Cloudflare Access OIDC client endpoints (prod worker injects into container) |
| `COVERIS_PAGE_SIZE` | Default API pagination size |

Cloudflare bindings (`wrangler.jsonc`): `ASSETS` (static SPA), `BACKEND` (Durable Object container class), custom domain route pattern, hourly cron `0 * * * *` for productivity auto-sync.

### 6.1 HTTP / API endpoints (when applicable)

Contract SSOT is `API.md` (repo root; mirrored into docs vault). High-level surface:

| Method | Path prefix | Purpose | Auth (if known) |
|--------|-------------|---------|-----------------|
| `GET` | `/api/health/` | Liveness + DB connectivity | none |
| `POST` | `/api/v1/auth/login/` | Email/password login, httpOnly JWT cookies | none (throttled) |
| `POST` | `/api/v1/auth/logout/` | Clear cookies, blacklist refresh | session cookie |
| `POST` | `/api/v1/auth/token/refresh/` | Rotate access token | refresh cookie |
| `GET` | `/api/v1/auth/me/` | Current user profile + scope | session cookie |
| `GET/POST/PATCH/DELETE` | `/api/v1/employees/` | Employee CRUD + FSM transitions | role-scoped |
| `GET` | `/api/v1/transition-logs/` | Audit history | authenticated |
| `GET/POST/PATCH/DELETE` | `/api/v1/assignments/` | Assignment lifecycle | role-scoped |
| `GET/POST/PATCH/DELETE` | `/api/v1/tags/`, `/employee-tags/`, `/position-tags/` | Tag catalog and links | role-scoped |
| `GET` | `/api/v1/offer/...` | Hours ledger computations | role-scoped |
| `GET/POST/PATCH/DELETE` | `/api/v1/org-units/`, `/demand/`, `/staffing-plan/` | Structure and demand | role-scoped |
| `GET` | `/api/v1/business-rules/` | Rule reference list | authenticated |
| `GET` | `/api/v1/calendar/...` | Argentine holidays | authenticated |
| `GET/POST/PATCH/DELETE` | `/api/v1/weekly-structure/...` | Weekly templates and blueprints | role-scoped |
| `GET/POST/PATCH/DELETE` | `/api/v1/scheduling/...` | Monthly scheduling grid | role-scoped |
| `GET/POST` | `/api/v1/dev/mock-data/` | Mock data list/load/wipe | dev only (`COVERIS_ENV=dev`) |
| `GET/POST/PATCH/DELETE` | `/api/v1/access/...` | User access management | ADMIN |
| `GET/POST/PATCH/DELETE` | `/api/v1/catalog/...` | Billing nomenclator catalog | ADMIN/MANAGER |
| `POST` | `/api/v1/productivity/imports/anesthesia/` | Sheets/machine productivity ingest | `X-Import-Token` or manager session |
| `GET/POST` | `/api/v1/productivity/...` | Records, objetivos, sync settings/run | role-scoped |
| `GET/POST/PATCH/DELETE` | `/api/v1/preliq/periods/` | Pre-liquidation periods | ADMIN/AUDITOR |
| `GET` | `/api/v1/cost/...` | Labor cost fractal views | ADMIN |
| `GET/POST/PATCH/DELETE` | `/api/v1/performance/...` | Talent review, scorecards, surveys | role-scoped |
| `GET` | `/kdx-admin/` | Django admin | staff |

Worker routing: paths starting `/api/` or `/admin/` proxy to the Backend container; all other paths serve the Angular SPA (`not_found_handling: single-page-application`).

### 6.2 Other interfaces

- **CLI / management commands:** Django `manage.py` commands including `sync_productividad_sheets`, `expire_proposals`, migrations — run inside `api` or `scheduler` containers.
- **Google Apps Script:** `docs/integrations/coveris-productividad-sync.gs` — hourly push client for productivity import endpoint.
- **Obsidian MCP:** `.mcp.json` configures vault HTTP server for doc navigation (`mcp__obsidian__*` tools referenced in `AGENTS.md`).
- **Avatar tooling:** `tools/avatar-gen/generate-avatars.ts` — Bun script for generating local avatar assets.
- **Cotton agent orchestration:** Global `~/.claude/agents/cotton-*` hierarchy referenced from `AGENTS.md`; repo vendors docker-manager and live-docs agents only.

## 7. Data & persistence

- **Primary store:** PostgreSQL 17. Local dev uses Docker volume `pg_data` via service `kdx-ng-db`. Production target uses Supabase managed Postgres in `sa-east-1` accessed through Supavisor pooler (`DATABASE_URL` transaction mode for app, session mode for migrations) — database layer only; no Supabase Auth or other Supabase products.

- **Important entities (by Django app/model names):** `User` (custom, `sub` UUID for OIDC), `Employee` (FSM states ONBOARDING→TERMINATED), `OrgUnit` (tree), `Position`, `Assignment`, `TagCatalog` / `EmployeeTag` / `PositionTag`, `EmployeeTransitionLog`, `AssignmentTransitionLog`, `BusinessRule`, `StaffingPlanLine`, weekly structure templates/blueprints, scheduling assignments/exceptions, `ProductivityRecord`, `PreliqPeriod`, cost and performance cycle entities.

- **Caching:** Django DatabaseCache by default (`coveris_cache` table); optional Redis via `CACHE_URL`.

- **Topology:** Browser → Cloudflare edge Worker (same region pinning SAM for container) → Django container → external Postgres. Local dev splits Angular on host port 4200 proxying to API on 8000. No edge vector index or object storage in core path; static avatars ship from `frontend/public/assets/`.

- **Offline:** None — online SaaS; Sheets integration is pull/push over HTTPS.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

- `README.md` — product pitch, stack diagram, migration status, local dev commands.
- `PRD.md` — problem statement, vision, domain model (demand/offer/bridge), MVP scope, employee FSM, roles.
- `API.md` — exhaustive HTTP contract sections (health, auth, employees, assignments, tags, offer, demand, scheduling, productivity, preliq, cost, performance).
- `AGENTS.md` — agent operating model, cotton orchestration, Obsidian vault rules, branch policy (`main`/`dev`/`prod`), architecture map, mock-data constraints, Angular 21 patterns.
- `CLAUDE.md` — pointer to `AGENTS.md`.
- `docs/README.md` — vault index, wikilink authoring rules, plugin requirements.
- `docs/stack/overview.md`, `docs/stack/backend.md` — version table, installed apps, DRF settings.
- `docs/migration-plan/README.md` — AWS→Cloudflare decisions D-1..D-8, Supabase provisioning status, pending execution items.
- `docs/prod/requirements.md` — AWS prerequisite checklist (legacy prod path).
- `docs/integrations/README.md` — Google Sheets productivity sync flow.
- `.env.example` — env var names and purposes (no values copied).
- `wrangler.jsonc`, `worker/index.ts` — Cloudflare deployment shape.
- `docker-compose.yml` — local service topology.
- `.claude/rules/` — ADR-backed agent rules present (adr-001 through adr-024+ covering naming, stack, auth, testing, mock-data, design system, audit trail, Argentine legal context, coverage dashboard, etc.).
- `.docs/` — **not present** in this repository.

Agent conventions worth retaining for RAG:

- `docs/API.md` wins over code when contracts diverge; update API first.
- ADR changes require explicit human confirmation — agents assess only.
- Protected top-level folders (`backend/`, `frontend/`, `scripts/`, `mock-data/`, `docs/`) must not be moved without user approval.
- Frontend bug fixes must not touch backend/API without consent.
- Mock data strictly limited to seed + showcase per ADR-022.
- Docs are an Obsidian vault; prefer MCP vault tools over raw grep for wikilinks.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private proprietary repo — summary describes architecture without offering clone instructions as a product surface. Three named copyright holders; no redistribution rights.

- **Auth model:** Local dev uses SimpleJWT in httpOnly cookies (`CookieJWTAuthentication`). Production target replaces Cognito with **Cloudflare Access as OIDC IdP** behind a branded in-app login shell (`/login`, `/auth/callback`, OIDC routes under `/api/v1/auth/oidc/`). RBAC remains in Django (`role` + `scope_unit`). Login throttling, CSRF, CSP middleware documented in stack auth docs.

- **Machine import:** Productivity endpoints accept `X-Import-Token` header when `COVERIS_IMPORT_TOKEN` is set; cron uses same token from Worker secrets.

- **Secrets hygiene:** `.env`, `.secrets/`, `*.serviceaccount.json`, `.wrangler/`, Obsidian plugin `data.json` files are gitignored. This summary contains **no** passwords, tokens, DSNs, PEM material, or scraped env values. `.env.example` contains illustrative dev defaults — not reproduced here.

- **GDPR:** Account export and soft-delete deactivation endpoints documented in `API.md` (Art. 17 deactivation retains records for admin recovery).

## 10. Operational picture

**Local development:**

```bash
cp .env.example .env
docker compose up -d          # PostgreSQL + Django API on :8000 + scheduler sidecar
cd frontend && bun install && bun start   # Angular :4200, proxies /api/*
pytest                        # backend tests (in container or backend/)
bun run test                  # frontend Vitest
```

Prefer the vendored `cotton-skills-dev-server` skill ("start dev") per `AGENTS.md`. Container names: `kdx-ng-db`, `kdx-ng-backend-pod`, `kdx-ng-scheduler`.

**Deployment:**

- **Target (in progress):** GitHub Actions `deploy-worker.yml` on `main` — `bun install`, build Angular, `bunx wrangler deploy`. Secrets via `set-worker-secrets.yml` and `wrangler secret put`. Custom domain configured in `wrangler.jsonc`.
- **Legacy AWS:** Documented in `docs/prod/aws.md` — Amplify frontend, ECS Fargate backend, RDS, Cognito; `prod` branch owner-locked.
- **Staging:** `dev` branch deploys to shared preview host (documented in `AGENTS.md` branch table).
- **Backend CI:** `.github/workflows/backend-checks.yml` for Python checks.

**Hardware constraints:** None specific — standard cloud/serverless. Container pinned to SAM region for Argentine latency. Scale-to-zero acceptable (`sleepAfter` 15m on Backend container).

## 11. Open questions / unknowns

- **Migration completion:** `docs/migration-plan/README.md` lists pending items — full Django `DATABASE_URL` cutover to Supabase in settings, Cloudflare Access app provisioning, Cognito code removal, ADR supersession chain (003→046, 008→047, 006→048), and editorial doc cleanup. Execution status may have advanced since doc snapshot; verify live `wrangler.jsonc` and settings modules.
- **Production auth flip:** Whether all environments already use Cloudflare OIDC vs lingering Cognito paths — `COGNITO_*` vars still appear in `.env.example` alongside `CF_OIDC_*` in worker.
- **Test counts:** Migration doc cites 1528 passing backend tests at one snapshot; current count unknown without running pytest in clone.
- **Commercial deployment:** Ministry of Health proposal exists under `docs/comercial/` — relationship to production tenants unclear from tree alone.
- **NIVO integration:** Documented requirements exist; external API not confirmed delivered.

---
