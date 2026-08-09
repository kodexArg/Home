---
id: "kdx-ng-template"
title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint"
visibility: private
importance: high
source_repo: "kdx-ng-template"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "template"
status: "template"
related: []
tags: ["angular", "django", "drf", "postgresql", "primeng", "signals", "saas", "aws", "amplify", "app-runner", "cognito", "docker", "bun", "uv", "api-first", "gdpr", "ai-skills", "csr"]
problems_solved:
  - "Teams building SaaS products repeatedly reinvent the same full-stack decisions — state management, forms, auth, API contracts, deployment topology — wasting weeks and producing inconsistent codebases."
  - "AI coding agents produce divergent Angular and Django patterns unless architectural choices are encoded as enforceable skills and a single HTTP contract file."
  - "Greenfield SaaS development blocks on backend readiness; developers need a working auth stack, seeded data, and local Docker environment from day one."
technologies:
  - "Angular 21 CSR"
  - "PrimeNG 21 (Aura theme)"
  - "TypeScript 5.9"
  - "Tailwind CSS 4"
  - "Django 5.2"
  - "Django REST Framework 3.15"
  - "SimpleJWT (local) / AWS Cognito (production target)"
  - "PostgreSQL 16"
  - "Uvicorn ASGI"
  - "Docker Compose"
  - "Bun 1.3 (frontend)"
  - "uv (backend Python)"
  - "Vitest 4"
  - "pytest / pytest-django"
  - "AWS Amplify + App Runner + RDS (deployment target)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# kdx-ng-template

> **Problem thesis (required):** kdx-ng-template is an **opinionated full-stack blueprint** — not a throwaway boilerplate — for building client-side-rendered SaaS applications with Angular 21 and Django 5.2 DRF. It exists because every new SaaS product otherwise re-decides the same painful questions: which state library, which form API, how frontend and backend agree on HTTP shapes, how auth works in dev vs production, and how to deploy CSR Angular on AWS without drifting into SSR complexity. The repo encodes those decisions in working code, human docs, `API.md` as the HTTP contract SSOT, and a fleet of `kdx-*` AI skills that force agents to produce identical patterns. Clone it, run Docker Compose + `bun start`, and you immediately have cookie-based JWT auth, GDPR endpoints, seeded mock users, a PrimeNG design-system showcase, and a reference `users` app to copy for new domains.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/kdx-ng-template` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Opinionated Angular 21 CSR + Django 5.2 DRF SaaS blueprint with PrimeNG, signals, API-first contracts, and AI skills that enforce one way to build. |
| Audience | Internal developers and AI coding agents scaffolding new SaaS products on the kodexArg AWS stack; DevOps engineers targeting Amplify + App Runner + RDS; backend engineers extending DRF apps; frontend engineers building signal-native Angular features. |

## 2. Problems it solves

### P1 — Repeated full-stack architectural indecision

- **Who hurts:** Teams starting new SaaS products; tech leads who must keep multiple apps consistent; AI agents that otherwise invent incompatible patterns per session.
- **Pain today:** Angular ecosystems tempt teams toward NgRx, TanStack Query, Reactive Forms, Material, or SSR — each choice multiplies learning cost and fragments codebases. Django backends sprawl without a documented API contract. Every greenfield project spends weeks on auth, CORS, cookie strategy, and folder layout before shipping domain features.
- **How this repo answers:** Every major decision is pre-made and documented. The README explicitly rejects NgRx, NGXS, TanStack Query, Reactive Forms, Angular Material, SSR, and NgModules. Angular 21 native primitives (`signal()`, `httpResource()`, Signal Forms, `@if`/`@for`) are the only approved patterns. `AGENTS.md` forbids proposing alternatives. Ten canonical skills in `.agents/skills/` (symlinked from `.claude/skills/`) encode component, signal, form, HTTP, routing, API-first, and design-system rules. `docs/01`–`09` provide human-readable guides mirroring the same constraints.
- **Out of scope:** Being a finished product — it is a scaffold. Multi-tenancy, real-time collaboration, OAuth social login, 2FA, email notifications, and RBAC beyond `is_staff` are explicitly deferred in `PRD.md` examples.

### P2 — Frontend/backend contract drift

- **Who hurts:** Full-stack developers; frontend engineers blocked on undocumented API responses; reviewers catching serializer ↔ TypeScript mismatches late.
- **Pain today:** DRF browsable API and ad-hoc docstrings diverge from what Angular services expect. Endpoints get coded before the contract is agreed, causing rework and brittle tests.
- **How this repo answers:** `API.md` at repo root is the **single source of truth** for all HTTP communication. `AGENTS.md` and the `kdx-api-first` skill enforce: document in `API.md` first, then implement DRF views and Angular services. `PRD.md` maps user stories to `API.md` sections rather than duplicating endpoint specs. `docs/07-drf-endpoints.md` adds DRF design rules. The workflow is: branch → update `API.md` → backend model/serializer/viewset/URLs/tests → frontend service/component/routes/tests.
- **Out of scope:** Auto-generated OpenAPI client codegen is not wired; contract discipline is procedural via skills and docs, not CI-gated yet.

### P3 — Slow time-to-first-feature on a new SaaS stack

- **Who hurts:** Developers who need to build UI against real API responses on day one; QA needing login flows and test users immediately.
- **Pain today:** Backend and frontend teams wait on each other; empty databases block realistic development; local setup spans Node, Python, Postgres, and env files with unclear defaults.
- **How this repo answers:** `docker-compose.yml` brings up PostgreSQL 16 and the Django API with hot-reload Uvicorn. `backend/entrypoint.sh` auto-runs migrations, creates a superuser from env vars, and seeds mock users via `seed_mock_users`. Frontend `proxy.conf.json` proxies `/api/*` to the backend. Shipped features include login, dashboard (protected), auth guard/interceptor/service (signal-based), 404 page, lazy routes, cookie consent, legal pages, pricing showcase, and a full PrimeNG design-system showcase at `/showcase`. Developers log in against seeded data and extend `backend/apps/users/` as the reference DRF pattern.
- **Out of scope:** Production migration governance — README admits unreviewed migrations hitting production RDS is **not solved** and requires a future CI/CD gate with senior DevOps/backend review.

## 3. Product / idea

kdx-ng-template is a **monorepo blueprint** with two deployable surfaces and one contract file:

```text
Angular 21 CSR (frontend/) ── /api/* ──▶ Django 5.2 DRF (backend/) ──▶ PostgreSQL 16
        │                                         │
        │                                         ├── SimpleJWT + httpOnly cookies (local)
        │                                         └── Cognito JWKS validation (production target)
        ▼
   AWS Amplify (static CSR hosting, SPA rewrites, API proxy)
```

The mental model is **decisions over files**. Cloning gives you a working auth vertical slice plus conventions for every future feature. New domain work follows the `users` app pattern: custom model → serializer → class-based views → URL includes → pytest coverage → Angular feature folder with lazy `loadComponent` routes.

Frontend organization (`frontend/src/app/`):

- `core/` — guards (`authGuard`, `noAuthGuard`), functional interceptors (`authInterceptor`, `errorInterceptor`), `AuthService` with signal state, title strategy, selective preloading, global error handler.
- `layout/` — authenticated `Shell` and public `PublicShell` with PrimeNG Menubar.
- `features/` — lazy feature areas (`dashboard`, `pricing`).
- `auth/` — login card and login page.
- `showcase/` — design-system gallery (colors, typography, forms, data tables, overlays, etc.).
- `shared/` — reusable widgets (`stat-cards`, `cookie-consent`, `not-found`).
- `legal/` — privacy and terms pages.

Backend organization (`backend/`):

- `config/` — split settings (`base`, `local`, `production`), ASGI, URL routing, security middleware (`CSPMiddleware`, `PermissionsPolicyMiddleware`, `Api404Middleware`).
- `apps/users/` — custom `User` model (UUID `sub`, email login, soft-delete via `deleted_at`), cookie JWT authentication, login/logout/refresh/me/account-delete/export endpoints, admin, management commands (`create_superuser`, `seed_mock_users`), comprehensive pytest suite.

Auth uses **httpOnly cookies** (not `Authorization: Bearer` headers). Angular sends `withCredentials: true`; the browser attaches `access_token` and `refresh_token` cookies. `APP_INITIALIZER` calls `checkAuth()` which hydrates from `GET /api/auth/me/` with refresh retry. Production target uses `SameSite=None; Secure=True` for cross-origin Amplify ↔ App Runner; local dev uses `SameSite=Lax`.

### 3.1 North-star use cases

1. **Bootstrap a new SaaS repo** — Clone template, copy `.env.example` to `.env`, `docker-compose up`, `cd frontend && bun install && bun start`, verify health/login/dashboard within minutes (`docs/VALIDATION.md`).
2. **Add a new domain feature with AI** — Invoke `kdx-api-first` to document endpoints in `API.md`, generate DRF + Angular scaffolding, implement with `kdx-angular-*` skills enforcing signals, PrimeNG, and lazy routing.
3. **Extend UI with design-system consistency** — Start with `kdx-design-system-use` skill mapping needs to PrimeNG components; reference `/showcase` routes for live examples; use `kdx-tailwind-design-system` only as PrimeNG's utility layer.
4. **Prepare for AWS deployment** — Build Angular to static `dist/`, deploy CSR to Amplify with SPA rewrites and `/api/*` proxy to App Runner; run backend Docker image on App Runner against RDS; switch auth to Cognito in production settings.

### 3.2 Non-goals

- **SSR / SSG** — CSR only; Amplify hosts static files with SPA fallback rules (`docs/04-routing.md`).
- **Alternative state/form/UI libraries** — No NgRx, TanStack Query, Reactive Forms, Angular Material, Taiga UI (explicit rejection table in `README.md`).
- **Production migration auto-approval** — Dangerous migrations require human gates not yet implemented.
- **BDD layer** — Planned on top of pytest/Vitest; not implemented yet (`README.md` roadmap).
- **Public redistribution** — README states private template, not for redistribution.
- **Signup endpoint** — `PRD.md` example lists signup as not yet in `API.md`; current template ships login, profile, GDPR, not registration.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node 22+, TypeScript 5.9, Python 3.13 | `frontend/package.json` engines, `backend/pyproject.toml` |
| Frontend | Angular 21.2 CSR, PrimeNG 21, Tailwind 4, PrimeIcons | `frontend/package.json`, `frontend/src/app/app.config.ts`, `frontend/src/app/theme.config.ts` |
| Backend / API | Django 5.2, DRF 3.15, SimpleJWT 5.x, Uvicorn ASGI | `backend/pyproject.toml`, `backend/config/settings/base.py` |
| Data | PostgreSQL 16 | `docker-compose.yml`, `backend/config/settings/base.py` |
| Infra / deploy | Docker Compose (local); target AWS Amplify + App Runner + RDS + Cognito + S3/CloudFront | `README.md`, `docker-compose.yml`, `backend/Dockerfile`, `frontend/customHttp.yml` |
| Security | django-csp, django-cors-headers, cookie JWT, CSRF double-submit for SPA, rate throttling | `backend/pyproject.toml`, `backend/config/settings/base.py`, `docs/SECURITY_HEADERS.md` |
| AI / agents | `.agents/skills/`, `.claude/skills/` symlinks, `AGENTS.md`, `backend/AGENTS.md`, `.mcp.json` (Angular CLI MCP) | tree scan |
| Tests | Vitest 4 (frontend), pytest-django + pytest-asyncio (backend) | `frontend/package.json`, `backend/pyproject.toml`, `.github/workflows/ci.yml` |
| CI | GitHub Actions: backend pytest, frontend test+build, Docker image build | `.github/workflows/ci.yml` |

### 4.1 Notable dependencies (curated)

- `@angular/*` 21.2 — Core framework; signals, `httpResource`, Signal Forms, built-in control flow are first-class.
- `primeng` + `@primeuix/themes` — Single design system; Aura preset configured in `theme.config.ts`.
- `tailwindcss` 4 + `tailwindcss-primeui` — Utility layer subordinate to PrimeNG tokens (`docs/09-tailwind4.md`).
- `djangorestframework-simplejwt` — JWT issuance with httpOnly cookie transport via custom `CookieJWTAuthentication`.
- `psycopg[binary]` — PostgreSQL driver for Django 5.2.
- `django-csp` — Content-Security-Policy headers in middleware stack.
- `vitest` + `jsdom` — Unit tests run via `ng test` in CI.

## 5. Repository map (abstraction)

- **Root contracts & governance:** `README.md` (overview), `AGENTS.md` (agent rules), `API.md` (HTTP SSOT), `PRD.md` (product template with examples), `CHANGELOG.md` (version history, latest v0.2.0 with QA remediation), `.env.example` (env shape).
- **Frontend entrypoints:** `frontend/src/main.ts` → `app.config.ts` → `app.routes.ts`. Dev via `bun start` (`ng serve`); prod build via `bun run build`. Proxy at `frontend/proxy.conf.json`.
- **Backend entrypoints:** `backend/manage.py`, `backend/config/asgi.py` (Uvicorn target), `backend/config/urls.py` (route table), `backend/entrypoint.sh` (container bootstrap).
- **Domain / core:** `backend/apps/users/` — sole domain app today; reference for future `apps/*`. Frontend `features/` for product screens.
- **Adapters:** `backend/apps/users/authentication.py` (cookie JWT), `backend/config/middleware.py` (API JSON 404, permissions policy), Angular interceptors in `frontend/src/app/core/interceptors/`.
- **Docs vaults:** `docs/` — numbered guides `01`–`09` plus operational docs (`DOCKER`, `MONOREPO`, `GH_WORKFLOW`, `VALIDATION`, `ADMIN_PANEL`, `SECURITY_HEADERS`). **No `.docs/` directory present.**
- **Agent scaffolding:** `.agents/skills/` (canonical) with symlinks in `.claude/skills/` for Claude Code. Backend-specific `django-pro` skill in `backend/.agents/skills/` (also symlinked under `backend/.claude/skills/`). `backend/AGENTS.md` for backend-only agent context. `.mcp.json` registers Angular CLI MCP and Playwright MCP.
- **QA artifacts:** `QA/2026-03-14_kodexArg-kdx-ng-template/` — audit reports (accessibility, security, performance, SEO, functionality, framework, dependencies, compliance, code, operations).
- **Generated / vendor:** `frontend/bun.lock`, `backend/uv.lock` — lockfiles for reproducible installs; not summarized. `node_modules/`, `.venv/`, `dist/`, `.angular/` gitignored.

## 6. Configuration & contracts (no secrets)

Environment variables (names + purpose only, from `.env.example` and `docker-compose.yml`):

| Variable | Purpose |
|----------|---------|
| `DJANGO_SECRET_KEY` | Django signing key; must be generated for non-dev |
| `DJANGO_SETTINGS_MODULE` | `config.settings.local` (dev) or `config.settings.production` |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT` | PostgreSQL connection |
| `SUPERUSER_PASSWORD` | Auto-create Django superuser on container start (dev only) |
| `SUPERUSER_EMAIL`, `SUPERUSER_GIVEN_NAME`, `SUPERUSER_FAMILY_NAME` | Optional superuser field overrides |
| `LOCAL` | `True` for localhost cookie/CORS behavior; `False` for production cross-origin |
| `ALLOWED_HOSTS` | Django host allowlist |
| `CORS_ALLOWED_ORIGINS` | Frontend origin(s) for credentialed CORS |

Django settings highlights (`backend/config/settings/base.py`):

- `AUTH_USER_MODEL = 'users.User'`
- `CookieJWTAuthentication` as default DRF auth class
- SimpleJWT cookie names: `access_token` (60 min), `refresh_token` (7 days), rotation + blacklist enabled
- DRF throttles: anon 100/hr, user 1000/hr, login 5/hr, token refresh 20/hr
- CSP directives via `django-csp`
- Admin at non-default path `kdx-admin/` (SEC-010)

Frontend proxy (`frontend/proxy.conf.json`) forwards `/api` to local backend port 8000 during development.

### 6.1 HTTP / API endpoints

Documented in `API.md` and implemented in `backend/config/urls.py` + `backend/apps/users/urls.py`:

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/api/` | API root message | none |
| `GET` | `/api/health/` | Liveness + DB connectivity check | none |
| `POST` | `/api/auth/login/` | Email/password login; sets httpOnly JWT cookies | none |
| `POST` | `/api/auth/logout/` | Blacklist refresh token; clear cookies | cookie session |
| `POST` | `/api/auth/token/refresh/` | Refresh access token from refresh cookie | refresh cookie |
| `GET` | `/api/auth/me/` | Current user profile (`sub`, email, names, flags) | cookie session |
| `DELETE` | `/api/auth/account/` | Soft-delete account (GDPR Art. 17) | cookie session |
| `GET` | `/api/auth/export/` | Personal data JSON export (GDPR Art. 20) | cookie session |
| `*` | `/kdx-admin/` | Django admin panel | staff session |

Angular frontend routes (client-side, not HTTP API):

| Path | Purpose | Guard |
|------|---------|-------|
| `/login` | Login page | `noAuthGuard` |
| `/dashboard` | Protected dashboard | `authGuard` + shell layout |
| `/showcase/*` | Design system gallery | public |
| `/pricing`, `/privacy`, `/terms` | Marketing/legal pages | public shell |
| `/**` | 404 with `noindex` meta | none |

### 6.2 Other interfaces

- **CLI — frontend:** `bun start`, `bun run build`, `bun run test` (wraps `ng` commands).
- **CLI — backend:** `python manage.py migrate`, `seed_mock_users`, `create_superuser`; `uv run pytest`; `uv run uvicorn config.asgi:application`.
- **CLI — repo:** `docker-compose up` for full local stack.
- **MCP — Angular:** `.mcp.json` exposes Angular CLI MCP tools (`list_projects`, `build`, `test`, `devserver_*`, `modernize`, `search_documentation`, etc.); `AGENTS.md` instructs agents to prefer MCP over raw `ng` bash.
- **MCP — Playwright:** registered in `.mcp.json` for browser automation (not deeply documented in repo).
- **AI skills (slash commands):** `kdx-api-first`, `kdx-design-system-use`, `kdx-angular-component`, `kdx-angular-signals`, `kdx-angular-forms`, `kdx-angular-http`, `kdx-angular-routing`, `kdx-version`, `kdx-tailwind-design-system`, `kdx-design-system-modification`; backend `django-pro`.

## 7. Data & persistence

- **Store:** PostgreSQL 16 via Docker volume `pg_data` locally; RDS target in production.
- **ORM:** Django models in `backend/apps/*`; currently only `users.User`.
- **Key entities:**
  - `User` — UUID `sub` (Cognito-compatible), unique `email`, `given_name`, `family_name`, `email_verified`, `is_active`, `is_staff`, `date_joined`, `deleted_at` (soft delete). Indexes on `is_active` and `deleted_at`.
  - SimpleJWT token blacklist tables via `rest_framework_simplejwt.token_blacklist`.
- **Migrations:** Django migrations under `backend/apps/users/migrations/`; auto-applied on container start.
- **Topology:** Local = single Compose network (`kdx-ng-network`) with `db` + `api` services. Production = Amplify static frontend, App Runner containerized API, managed RDS — same-origin illusion via Amplify `/api/*` rewrite so production avoids CORS complexity.

## 8. Docs & agent memory (required scan)

Sources read and folded in (path evidence only):

1. **`README.md`** — Project thesis, stack table, architecture tree, quick start, API-first workflow, AI skills map, deployment diagram, known challenges (migrations, Amplify CSR friction, static files), roadmap (BDD).
2. **`AGENTS.md`** — Immutable stack rule, API-first hard gate, skill inventory, MCP tool table, Angular vanilla pattern matrix, documentation hierarchy (PRD → ADR → docs → skills).
3. **`API.md`** — Full HTTP contract: cookie auth mechanism, all endpoints with request/response shapes, error format, token lifetimes, local vs Cognito flows.
4. **`PRD.md`** — Template PRD with example user stories (signup marked not yet in API), GDPR requirements, NFR table, explicit non-goals.
5. **`CHANGELOG.md`** — v0.2.0 QA remediation (45 findings): accessibility, performance, SEO, security, 42 backend + 123 frontend tests passing.
6. **`docs/README.md`** — Docs index; `API.md` wins on conflict.
7. **`docs/01-signals.md` through `docs/09-tailwind4.md`** — Angular patterns: signals, components, HTTP, routing, forms, architecture, DRF rules, PrimeNG, Tailwind.
8. **`docs/DOCKER.md`, `docs/MONOREPO.md`, `docs/GH_WORKFLOW.md`, `docs/VALIDATION.md`, `docs/ADMIN_PANEL.md`, `docs/SECURITY_HEADERS.md`** — Operational guides referenced from README.
9. **`docs/06-architecture.md`** — Full-stack folder structure, bootstrap, provider config patterns.
10. **`backend/AGENTS.md`** — Backend quick start, migration commands, test invocation, architecture notes.
11. **`.agents/skills/kdx-api-first/SKILL.md`** — API-first gatekeeper skill: refuses implementation without `API.md` entry; generates DRF + Angular scaffolding from contract.
12. **`.claude/skills/`** — Symlinks to `.agents/skills/` (10 frontend/root skills); canonical source is `.agents/`.
13. **`backend/.agents/skills/django-pro/SKILL.md`** — Backend Django 5.x mastery skill for agent use.
14. **`.mcp.json`** — Angular CLI MCP + Playwright MCP server registration.
15. **`QA/2026-03-14_kodexArg-kdx-ng-template/`** — Post-audit dimension reports (framework, security, accessibility, performance, SEO, etc.).

**`.docs/` scan:** Directory does not exist in this repository.

**`.claude/` scan:** Contains `skills/` subdirectory only (symlinks to `.agents/skills/`). No `settings.local.json` (gitignored). No worktrees directory in shallow clone.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private template — not for public redistribution. Summary contains no clone URLs or live credentials.
- **Auth model:** Local dev uses SimpleJWT transported as httpOnly cookies with `CookieJWTAuthentication`. Production target validates Cognito-issued tokens via JWKS (`API.md` production section). CSRF uses double-submit pattern: `CSRF_COOKIE_HTTPONLY = False` intentionally so Angular can read the cookie and send `X-CSRFToken` on mutating requests (`backend/config/settings/base.py` comment S-05).
- **GDPR:** Account soft-delete (`DELETE /api/auth/account/`) and data export (`GET /api/auth/export/`) implemented and documented.
- **Headers:** CSP via `django-csp`, `PermissionsPolicyMiddleware`, `X-Frame-Options: DENY`, security headers doc in `docs/SECURITY_HEADERS.md`. Amplify custom headers in `customHttp.yml` and `frontend/customHttp.yml`.
- **Rate limiting:** DRF throttles on anon, user, login, and token refresh endpoints.
- **Admin hardening:** Non-default admin URL `kdx-admin/`.
- **This summary:** Contains no secrets, private keys, connection strings with real passwords, or `.env` contents. Example placeholders from `.env.example` are described by name only.

## 10. Operational picture

**Local development:**

1. Copy `.env.example` → `.env`; set `SUPERUSER_PASSWORD` at minimum.
2. `docker-compose up` — starts Postgres + Django API on port 8000 with hot reload.
3. `cd frontend && bun install && bun start` — Angular dev server on port 4200, proxies API.
4. Verify via `docs/VALIDATION.md` checklist (health endpoint, admin, login, dashboard).

**CI (`.github/workflows/ci.yml`):**

- `backend-tests` — Python 3.13, `uv sync`, `pytest` against service Postgres 16.
- `frontend-build` — Bun 1.3.5, `bun install --frozen-lockfile`, `ng test --no-watch`, `ng build --configuration production`.
- `docker-build` — Builds backend Dockerfile with GHA cache (push disabled).

**Deployment target (documented, not fully automated in repo):**

- Frontend: `ng build` → static assets → AWS Amplify with SPA rewrites and `/api/*` proxy to App Runner.
- Backend: `backend/Dockerfile` multi-stage image → AWS App Runner running Uvicorn.
- Database: AWS RDS PostgreSQL 16.
- Auth (prod): AWS Cognito.
- Static/media (prod): S3 + CloudFront (mentioned in README deployment diagram).

**Git workflow:** Branch-per-concern, `gh` CLI for PRs (`docs/GH_WORKFLOW.md`, `docs/MONOREPO.md`).

## 11. Open questions / unknowns

- **Production CI/CD for migrations** — Explicitly unsolved; README describes needed human review gates before RDS migrations; no workflow file implements this yet.
- **Cognito integration code** — Documented as production auth target; extent of implemented Cognito JWKS validation vs stub unclear without reading all production settings (not fully inspected).
- **Signup endpoint** — `PRD.md` example references `POST /api/auth/signup/` as not yet in template `API.md`.
- **Skills referenced but absent from tree** — `AGENTS.md` lists `kdx-audit`, `kdx-adr-format`, `kdx-prd-format`, `kdx-report` skills; these directories were not found under `.agents/skills/` in the shallow clone (may be planned or live elsewhere).
- **`docs/adr/`** — Referenced in `AGENTS.md` documentation hierarchy; no `docs/adr/` directory exists yet.
- **BDD testing layer** — Announced in README roadmap; current tests are pytest + Vitest unit/integration only.
- **`docker-compose.prod.yml`** — Mentioned in `PRD.md` example goals; only `docker-compose.yml` present for local dev.
- **Exact Amplify build spec** — CSR on Amplify requires manual rewrite configuration; documented in `docs/04-routing.md` but no Amplify config file in repo root beyond `customHttp.yml`.
