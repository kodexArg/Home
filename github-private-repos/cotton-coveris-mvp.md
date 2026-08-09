---
id: "cotton-coveris-mvp"
title: "Coveris — Healthcare Capacity Planning SaaS"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["healthcare", "capacity-planning", "saas", "angular", "django", "postgresql", "aws", "workforce", "clinics", "primeNG", "drf"]
problems_solved:
  - "Private clinics cannot see in real time the gap between operational demand (positions per org unit) and available supply (employees after contracts, tags, and reductions) because staffing data lives in disconnected spreadsheets and informal channels."
  - "HR managers and service heads cannot quickly answer who can cover an uncovered shift, whether candidates have required certifications, overtime impact, and post-assignment coverage without opening multiple tools and calling colleagues."
  - "Institutions lack a single configurable organigram-backed source of truth that ties employees, positions, assignments, hours ledger, coverage rollups, scheduling, and downstream payroll-prep workflows together."
technologies:
  - "Angular 21 CSR"
  - "PrimeNG 21"
  - "Django 5.2"
  - "Django REST Framework 3.15"
  - "PostgreSQL 16/17"
  - "SimpleJWT / AWS Cognito"
  - "AWS Amplify"
  - "AWS ECS Fargate"
  - "AWS RDS"
  - "Docker Compose"
  - "Bun"
  - "uv"
  - "Uvicorn"
  - "Vitest"
  - "pytest"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Coveris

> **Problem thesis (required):** Coveris exists because mid-size private clinics (roughly 20–100 employees, multiple services) still run capacity planning on spreadsheets, phone calls, and stale folders. The clinic has the data—contracts, shift regimes, certifications, leave—but it is fragmented. There is no live measure of the gap between **demand** (positions and weekly hours each org unit needs) and **supply** (employees with an effective hours pool after tags and reductions). Coveris is a SaaS that puts a configurable organigram at the center, models employees and positions with explicit business rules in Django, and gives managers a real-time UI for assignments, coverage, hours, scheduling, and extensions into productivity, pre-liquidation, labor cost, and talent review.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/cotton-coveris-mvp` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Healthcare capacity-planning SaaS that measures live demand-vs-supply across a clinic organigram and supports assignment, coverage, hours, scheduling, and payroll-adjacent workflows. |
| Audience | Clinic HR managers (“Jefe” / MANAGER), operational staff (“Agente” / EMPLOYEE), auditors (AUDITOR), platform admins (ADMIN, internal), developers and AI agents maintaining the stack. |

## 2. Problems it solves

### P1 — Fragmented staffing truth

- **Who hurts:** HR managers, service heads, and clinic operators responsible for shift coverage.
- **Pain today:** Answering “who can cover this guard?” requires multiple spreadsheets, certification folders, and ad-hoc calls. Data is edited without notification; answers are hours old before they are acted on.
- **How this repo answers:** A PostgreSQL-backed domain model with org units, positions (demand), employees (supply), tag-based hour pools, and assignment FSMs. Django computes business rules; Angular renders organigram, roster, structure, coverage, and hours views fed by a documented REST contract (`docs/API.md`). Coverage rolls up from leaf units to clinic root.
- **Out of scope:** Full payroll execution, union contract negotiation engines, or institution-specific legal advice baked into code (rules are configurable via tags and ADRs, not hard-coded convenio logic).

### P2 — No preview before committing assignments

- **Who hurts:** Managers assigning staff to positions and employees accepting or rejecting proposals.
- **Pain today:** Assignments are made without a unified preview of hours impact, eligibility (required tags), or resulting coverage state; mistakes create overtime or uncovered positions discovered later.
- **How this repo answers:** Assignment lifecycle with preview endpoints, eligibility validation against position tag requirements (ADR-019), hours ledger as stateless computation (ADR-011), and employee FSM with proposal/accept/reject flows. UI routes under `/roster`, `/org-chart`, `/coverage`, `/hours`, and control-panel demand surfaces.
- **Out of scope:** Employee push notifications for proposals (listed out-of-scope in PRD); automated shift bidding marketplaces.

### P3 — Demo, staging, and agent-safe development without production data

- **Who hurts:** Developers, contributors, and AI agents implementing features against realistic clinic scenarios.
- **Pain today:** Empty databases block UI work; copying production data risks privacy violations; inconsistent seeds break contract tests.
- **How this repo answers:** `mock-data/` YAML scenarios (clinic-bienestar, hospital-notti, clinica-francesa) hot-loaded via dev-gated API and Panel de Control UI; showcase route uses isolated mocks per ADR-022. Avatars sync from scenario folders to frontend assets without external image URLs.
- **Out of scope:** Production tenant onboarding automation; multi-tenant SaaS billing (pricing page exists as product surface, not full billing backend in MVP scope).

## 3. Product / idea

Coveris treats the **organigram** as the system nucleus: without org units there is no “where” for employees, positions, coverage, or hours. Institutions configure tree depth and labels; positions can exist at any level (not only leaves). **Demand** is expressed as positions with weekly hour requirements and optional tag requirements. **Supply** is employees with a six-state FSM lifecycle, typed tags (contract, qualification, certification, exception) that sum to an effective weekly hours pool, and assignments linking employee hours to positions. **Coverage** aggregates upward; **hours balance** (`obligated − assigned`) is the central metric—positive means available capacity, negative means overtime.

Beyond the MVP core, the codebase implements **Capa 1** (productivity import, pre-liquidation, fractal labor cost, billing catalog) and **Capa 2** (talent review / 9-box desempeño), monthly scheduling, economía hub routes, and productivity audit FSM—documented in `docs/goals/`, `docs/API.md`, and extensive ADRs.

Auth uses httpOnly cookie JWT locally (SimpleJWT) with a production path to Cognito JWT validation (ADR-008). Roles collapsed to ADMIN, MANAGER, AUDITOR, EMPLOYEE with orthogonal org-unit scope (`scope_unit`, ADR-030). Frontend is CSR-only Angular on Amplify; API on ECS Fargate behind ALB; RDS PostgreSQL.

### 3.1 North-star use cases

1. **Coverage crisis:** Manager opens coverage or organigram, sees uncovered positions, finds eligible employees with available hours and certifications, previews assignment impact, confirms—coverage rollup updates immediately.
2. **Structure setup:** Admin builds org tree and positions in control-panel structure/demand, configures tag catalog, loads a mock scenario or seeds manually, verifies roster and hours ledger.
3. **Payroll-prep path (Capa 1):** Productivity records import from Sheets webhook or UI; auditor reviews via productivity audit FSM; preliq period runs; costos fractal and economía views expose labor cost drill-down.
4. **Agent/developer path:** Clone repo, `docker compose up`, `bun start`, load mock scenario from Panel de Control, run pytest/Vitest, follow `docs/API.md` contract-first changes with live-docs and backlog agents.

### 3.2 Non-goals

- SSR/SSG for the main app (CSR only; rejected stack per README and ADR-002-b).
- External state libraries on frontend (NgRx, TanStack Query)—Signals, `httpResource()`, Signal Forms only.
- Persisting computed hours balance in the database (computed on the fly per ADR-011).
- Automatic ADR adoption by agents—human-in-the-loop required (`AGENTS.md`).
- Pushing to `prod` branch by agents (owner-only, direct AWS production deploy).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.13, Node 22+, Bun 1.3 | `backend/pyproject.toml`, `frontend/package.json` |
| Frontend | Angular 21.2, PrimeNG 21, Tailwind 4, TypeScript 5.9 | `frontend/package.json`, `docs/stack/frontend.md` |
| Backend / API | Django 5.2, DRF 3.15, django-fsm-2, Uvicorn ASGI | `backend/pyproject.toml`, `backend/config/urls.py` |
| Data | PostgreSQL 16 (local compose) / 17 (CI/RDS) | `docker-compose.yml`, `docs/prod/aws.md` |
| Infra / deploy | Docker Compose (dev), AWS Amplify (SPA), ECS Fargate + ECR + ALB, RDS, Secrets Manager | `amplify.yml`, `.github/workflows/deploy-backend.yml`, `docs/prod/aws.md` |
| AI / agents | `.claude/` agents/skills/rules, Obsidian vault MCP, cotton live-docs/backlog pipeline | `.claude/`, `AGENTS.md`, `.mcp.json` |
| Tests | pytest + pytest-django, Vitest 4 | `backend/pyproject.toml`, `frontend/vitest.config.ts`, `docs/dev/testing.md` |

### 4.1 Notable dependencies (curated)

- `primeng` / `@primeuix/themes` — sole UI design system; Lara/Noir/Zinc preset via `theme.config.ts`.
- `djangorestframework-simplejwt` — local dev cookie-based JWT auth.
- `django-fsm-2` — employee and assignment state machines with guarded transitions.
- `psycopg` — PostgreSQL driver for Django 5.2.
- `reportlab`, `openpyxl` — export surfaces for preliq and reporting endpoints.
- `holidays` — calendar/holiday API support.
- `marked` — markdown rendering in help or docs surfaces on frontend.

## 5. Repository map (abstraction)

- **Entrypoints:** `frontend/src/main.ts` + `app.routes.ts` (lazy feature routes); `backend/config/asgi.py` + `config/urls.py` (API mount tree); `Makefile` and `docker-compose.yml` for local stack.
- **Domain / core:** `backend/apps/` — `users`, `demand` (org units, positions), `offer` (employees, hours ledger), `assignments`, `tags`, `business_rules`, `weekly_structure`, `scheduling`, `productivity`, `preliq`, `cost`, `performance`, `catalog`, `audit_log`, `fsm`, `mockdata`.
- **Adapters:** DRF viewsets/serializers per app; `apps/productivity` importers; Google Apps Script integration doc in `docs/integrations/`; Cognito auth adapter in `apps/users`.
- **Docs vaults:** `docs/` Obsidian vault (PRD, API, ADRs, backlogs, stack, dev, prod, business-logic, goals, marathon fix tickets). Root symlinks: `PRD.md`, `API.md` → `docs/`. **No `.docs/` directory present**—all hidden-style docs live under `docs/` and `.claude/`.
- **Agent scaffolding:** `.claude/agents/` (cotton-coveris-live-docs, cotton-coveris-backlog, docker-manager, bosses, testers), `.claude/skills/` (dev-server, orchestrate, waypoint, marathon-fixer, obsidian-rest), `.claude/rules/` (symlinks to ADRs for auto-load), `.claude/hooks/cotton-goal-gate.py`, `.agents/` skill lock mirror, `AGENTS.md` + `CLAUDE.md` pointer.
- **Mock / seed:** `mock-data/<scenario>/` YAML SSOT; `scripts/sync_avatars.py`; legacy `backend/fixtures/` still exists but hot-load panel is canonical.
- **Generated / vendor:** `frontend/dist/`, `node_modules/`, `.venv/`, `backend/staticfiles/` — gitignored; not ingested.

## 6. Configuration & contracts (no secrets)

Environment variables (names and purpose only, from `.env.example` and ADR-006):

| Variable | Purpose |
|----------|---------|
| `DJANGO_SECRET_KEY` | Django secret; required in production |
| `DJANGO_SETTINGS_MODULE` | Settings module (`config.settings.local` vs production) |
| `COVERIS_ENV` | `dev` enables mock-data hot-load; `prod` hides dev endpoints |
| `POSTGRES_*` | Database connection |
| `SUPERUSER_*` | Bootstrap admin on container entrypoint |
| `MOCK_USER_PASSWORD` | Password applied to seeded mock users |
| `LOCAL`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` | Host and CORS policy |
| `CACHE_URL`, `CACHE_DB_TABLE` | Throttle/cache backend (DatabaseCache default) |
| `LOGIN_THROTTLE_RATE` | Login endpoint throttle |
| `COVERIS_IMPORT_TOKEN` | Shared secret for productivity import webhook (`X-Import-Token`) |
| `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `COGNITO_REGION`, `COGNITO_DOMAIN` | Production Cognito JWT validation when pool id set |
| `COVERIS_PAGE_SIZE` | Default API pagination size |

Cloudflare bindings: N/A (AWS stack, not Workers).

### 6.1 HTTP / API endpoints (when applicable)

Base: `/api/v1/` unless noted. Full contracts in `docs/API.md` (SSOT, ADR-005). Cross-cutting rules in `docs/stack/api-conventions.md`.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/health/` | Liveness + DB connectivity | none |
| `POST` | `/api/v1/auth/login/` | Login; sets httpOnly JWT cookies | none (throttled) |
| `POST` | `/api/v1/auth/logout/` | Logout; blacklist refresh | session cookie |
| `POST` | `/api/v1/auth/token/refresh/` | Refresh access token | refresh cookie |
| `GET` | `/api/v1/auth/me/` | Current user profile + scope | session cookie |
| `DELETE` | `/api/v1/auth/account/` | GDPR soft-delete account | session cookie |
| `GET/POST/PATCH/DELETE` | `/api/v1/employees/` … | Roster CRUD + FSM transitions | role + scope |
| `GET/POST/PATCH/DELETE` | `/api/v1/assignments/` … | Assignment CRUD + FSM | role + scope |
| `GET/POST/PATCH/DELETE` | `/api/v1/org-units/` … | Organigram structure | role + scope |
| `GET/POST/PATCH/DELETE` | `/api/v1/positions/` … | Position demand definitions | role + scope |
| `GET` | `/api/v1/offer/hours-ledger/` | Stateless hours computation | role + scope |
| `GET/POST` | `/api/v1/tags/` … | Tag catalog and employee tags | role + scope |
| `GET` | `/api/v1/audit-log/` | Transition history | role + scope |
| `GET/POST` | `/api/v1/weekly-structure/` … | Weekly structure board | role + scope |
| `GET/POST` | `/api/v1/scheduling/` … | Monthly scheduling | menu + scope |
| `GET/POST` | `/api/v1/dev/mock-data/` … | List/load/wipe mock scenarios | ADMIN, dev env only |
| `GET/POST` | `/api/v1/access-management/` … | User provisioning | ADMIN |
| `GET/POST` | `/api/v1/catalog/` … | Billing nomenclators (Capa 1) | MANAGER+ |
| `POST` | `/api/v1/productivity/imports/anesthesia/` | Sheets webhook import | `X-Import-Token` or manager session |
| `GET/POST` | `/api/v1/productivity/` … | Production records + audit FSM | role + scope |
| `GET/POST` | `/api/v1/preliq/` … | Pre-liquidation periods + export | ADMIN/AUDITOR |
| `GET` | `/api/v1/cost/` … | Fractal labor cost | ADMIN |
| `GET/POST` | `/api/v1/performance/` … | Talent review / desempeño (Capa 2) | MANAGER/AUDITOR |

Django admin: `/kdx-admin/` (staff users).

### 6.2 Other interfaces

- **CLI / Makefile:** `make up`, `make test`, `make migrate`, `make shell` — Docker-wrapped Django operations.
- **Scripts:** `scripts/claudiotton`, `scripts/generate_avatars.py`, `scripts/qr.py`, `scripts/obsidian_local.py`.
- **MCP:** Obsidian vault server configured in `.mcp.json` for doc navigation (`mcp__obsidian__*` tools).
- **Google Apps Script:** `docs/integrations/coveris-productividad-sync.gs` — hourly full-sheet POST to productivity import endpoint.
- **Agent hooks:** Stop hook runs `cotton-goal-gate.py` for goal completion checks.

## 7. Data & persistence

- **Primary store:** PostgreSQL via Django ORM; migrations per app under `backend/apps/*/migrations/`.
- **Key entities (by name):** `User`, `Employee`, `EmployeeTransitionLog`, `OrgUnit`, `Position`, `Assignment`, `TagCatalog`, `EmployeeTag`, `WeeklyStructure`, scheduling month grids, `ProductivityRecord`, preliq period tables, cost aggregation views, performance scorecard entities—see PRD §5 and `docs/API.md`.
- **Cache:** Django DatabaseCache table `coveris_cache` by default; optional Redis via `CACHE_URL`.
- **Media/static:** Whitenoise for static; S3 target for production media (`docs/prod/aws.md`).
- **Topology:** Single-tenant clinic deployment per environment; hierarchical RBAC scopes queries to org-unit subtrees. Local Docker Compose runs API + DB on developer machine; staging `dev` branch deploys to shared preview; `main` promoted to `prod` for AWS production.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **`README.md`** — stack diagram, architecture zones, quick start, deployment model, doc map.
2. **`AGENTS.md`** — agent operating model, branch policy (`main` / `dev` / `prod`), cotton team flow, Obsidian vault rules, mock-data constraints, organigram nucleus, implementation priority.
3. **`CLAUDE.md`** — pointer to AGENTS.md (Spanish one-liner).
4. **`docs/PRD.md`** — problem statement, vision, domain model (demand/supply/bridge), FSM tables, scope in/out.
5. **`docs/API.md`** — HTTP contract SSOT (health, auth, employees, assignments, tags, org units, positions, scheduling, mock-data, access management, catalog, productivity, preliq, cost, performance).
6. **`docs/stack/overview.md`** — version table and local dev commands.
7. **`docs/README.md`** — vault index and reading order.
8. **`docs/prod/aws.md`** — partial AWS provisioning status, secrets naming, target topology.
9. **`docs/integrations/README.md`** — Sheets → productivity import pipeline.
10. **`docs/goals/capa1-preliq-costo-fractal.md`** and **`docs/goals/capa2-desempeno-talent-review.md`** — layered product goals.
11. **`mock-data/README.md`** — scenario hot-load flow and gating.
12. **`.claude/settings.json`** — Obsidian MCP, goal gate hook, denied cloud MCPs.
13. **`.claude/skills/cotton-skills-dev-server/SKILL.md`** — dev stack orchestration skill.
14. **`.claude/agents/`** — repo-vendored cotton-coveris-live-docs, backlog, docker-manager, tester bosses.
15. **`docs/adr/`** — 40+ ADRs indexed (stack, auth, API SSOT, testing, design system, mock-data, RBAC, scheduling, etc.); `.claude/rules/` symlinks load them into agent context.
16. **No `.docs/` directory** — scanned; not present in tree.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository; summary describes architecture without clone URLs as product links. `related: []` in frontmatter per private-repo rule.
- **Auth model:** httpOnly cookie JWT (SimpleJWT) in dev; Cognito RS256 JWKS when `COGNITO_USER_POOL_ID` set. Login throttled; CSRF on cookie auth; `must_change_password` gate (ADR-032). Role × org-unit scope (ADR-030).
- **Dev-only surfaces:** Mock-data load/wipe and hot-load router mounted only when `COVERIS_ENV=dev`; 404 elsewhere.
- **Import webhook:** Optional `COVERIS_IMPORT_TOKEN` header auth for productivity Sheets sync; empty disables token path.
- **Secrets hygiene:** This summary contains no live secrets, PEM keys, connection strings with passwords, or `.env` values. Example dev passwords exist in compose defaults and `.env.example` in the repo but are not reproduced here.

## 10. Operational picture

- **Local dev:** `cp .env.example .env` → `docker compose up -d` (Postgres + API on port 8000) → `cd frontend && bun install && bun start` (port 4200, proxies `/api`). Containers: `kdx-ng-db`, `kdx-ng-backend-pod`. Entrypoint runs migrations and superuser seed.
- **Tests:** `make test` or `docker compose exec api pytest`; `cd frontend && bun run test` / Vitest static config.
- **CI:** `.github/workflows/backend-checks.yml` — migration committed check on backend changes. `.github/workflows/deploy-backend.yml` — on push to `dev` branch with backend changes: test gate, ECR image build, ECS Fargate rolling deploy (cluster `coveris-prod`, service `coveris-prod-backend`).
- **Frontend deploy:** `amplify.yml` — Bun install, `ng build` production; separate Amplify apps for prod vs dev API rewrites (documented in amplify.yml comments). `dev` branch → shared staging host; `main` → owner promotes to `prod` for production AWS.
- **Branch policy:** Contributors push tested work to `dev`; owner promotes `main` to `prod` only; agents forbidden from `prod` pushes.

## 11. Open questions / unknowns

- Cognito as live production auth vs current SimpleJWT on deployed stack—ADR-008 gap noted in `docs/prod/aws.md` (partially provisioned AWS, auth mode unclear at cut-over).
- PostgreSQL version drift: local compose image `postgres:17-alpine` in `docker-compose.yml` vs README stating 16; RDS doc mentions 17.
- Full CI for frontend (Amplify builds on push but no frontend workflow in `.github/` beyond backend).
- NIVO anesthesia integration endpoint on external vendor side—documented as engineering gap (G-03) in integrations README.
- Exact production custom domain cut-over from placeholder `example.com` convention to registered domain—tracked in prod docs, not finalized in tree.
- Depth of BDD/e2e coverage vs ~120 scenarios claimed in AGENTS.md—full harness state in `docs/plan/` not exhaustively verified in this scan.
