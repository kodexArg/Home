---
id: "alvs-finanzas"
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness"
visibility: private
importance: high
source_repo: "alvs-finanzas"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["alvs", "finanzas", "django", "astro", "svelte", "aws", "fargate", "cognito", "m365", "sharepoint", "harness", "agents", "htmx", "postgresql", "private"]
problems_solved:
  - "ALVS needs a private, deployable internal finanzas web application with a proven two-service AWS pattern (SSR frontend + DRF API) instead of ad-hoc stacks per project."
  - "Agent-assisted development on business software requires enforced single sources of truth (PRD, API, variables, ADRs) so autonomous edits do not invent routes, env vars, or scope drift."
  - "Finance workflows tied to Microsoft 365 / SharePoint need a bounded backend capability to read organizational Excel data via Graph without bolting secrets or auth logic into the frontend."
technologies:
  - "Astro 7 SSR"
  - "Svelte 5"
  - "Tailwind CSS 4"
  - "shadcn-svelte"
  - "HTMX 2"
  - "Django 6 + DRF"
  - "Python 3.14"
  - "uvicorn (ASGI)"
  - "PostgreSQL 17"
  - "AWS ECS Fargate"
  - "AWS Cognito (OIDC)"
  - "AWS Secrets Manager"
  - "Microsoft Graph / MSAL"
  - "bun"
  - "uv"
  - "Docker Compose"
  - "GitHub Actions (OIDC deploy)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# alvs-finanzas

> **Problem thesis (required):** This private repository is a fork of the `astro-drf-aws` template, repurposed as **kodexArg/alvs-finanzas** — an internal Alvsgroup finanzas application whose expected outcome is a **working AWS deploy** of a two-container system (Astro SSR frontend + Django REST backend). The **harness is treated as the real product**: a live Obsidian-flavored documentation vault, vendored agent skills, enforcement hooks, and three guardian subagents that gate changes to PRD, ADRs, and API contracts. Application code (auth, RBAC, health probes, M365 Graph Excel reads, showcase UI) follows that harness. The home page already exercises SharePoint connectivity by SSR-fetching two Excel cells through app-only Graph endpoints.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/alvs-finanzas` |
| Visibility | `private` |
| Default branch | `main` (integration); production deploys from `prod` |
| One-line pitch | Private ALVS finanzas app on a harness-first Astro+Django template with Cognito login, Django RBAC, and Microsoft Graph SharePoint probes — deployed as twin Fargate services on AWS us-east-1. |
| Audience | Internal ALVS operators and developers; AI coding agents working through `AGENTS.md`; kodexArg maintainers syncing upstream template improvements. |

## 2. Problems it solves

### P1 — Repeatable internal web-app delivery for ALVS finanzas

- **Who hurts:** ALVS engineering and product owners who need another authenticated internal tool without reinventing ECS, ALB routing, Cognito, RDS, and CI/CD each time.
- **Pain today:** One-off stacks drift on auth, caching, secrets handling, and deploy mechanics; finanzas features get blocked on infrastructure decisions.
- **How this repo answers:** Forks the battle-tested `astro-drf-aws` layout: `frontend/` (Astro 7 SSR + Svelte islands) and `backend/` (Django 6 + DRF) behind a shared ALB with path-based routing (`/api/*`, `/accounts/*` → backend; catch-all → frontend). `docs/INFRASTRUCTURE.md` documents the two-Fargate, no-NAT, no-CDN, Secrets Manager-only pattern. Root `compose.yaml` reproduces Postgres + backend + frontend locally with profiles `db`, `backend`, `frontend`, `full`.
- **Out of scope:** Multi-tenant SaaS, public marketing sites, edge CDN caching, Redis/ElastiCache, or a staging environment tier (only `dev` and `prod` exist per ADR doctrine).

### P2 — Agent-safe development with binding contracts

- **Who hurts:** Developers and autonomous agents editing a complex full-stack repo where undeclared API routes and mystery env vars silently ship to production.
- **Pain today:** LLM edits add endpoints, variables, or features that contradict product scope; review burden explodes because truth is scattered across code.
- **How this repo answers:** The **ABC gate** in `AGENTS.md`: every change must follow `docs/PRD.md`, comply with ADRs in `docs/adrs/` (mirrored to `.claude/rules/`), and respect `docs/API.md` if touching HTTP surface. Hooks in `.claude/hooks/` enforce this at edit time: `check_api.py` blocks undeclared `urls.py` routes; `check_variables.py` blocks undeclared env reads; `load_ssot.py` injects PRD+API at session start; `dispatch_guardians.py` routes SSOT edits to guardian agents. Development loop: `idea → user-facing? → BDD → needs backend? → enter through API → TDD`. Backend code is born through `docs/TDD.md` entries, not ad-hoc patches.
- **Out of scope:** Replacing human product judgment; the guardians triage and block defects but do not define business requirements.

### P3 — Bounded Microsoft 365 / SharePoint access from Django

- **Who hurts:** Finanzas workflows that depend on Excel workbooks in SharePoint; teams that must not expose Graph tokens or client secrets to the browser.
- **Pain today:** Spreadsheets are authoritative but inaccessible to a web UI without fragile scripts, over-broad permissions, or frontend-held secrets.
- **How this repo answers:** `backend/apps/m365/` implements **app-only** Graph reads (`client_credentials` via MSAL) for two demo endpoints (`/api/m365/hello/`, `/api/m365/world/`) that return plain-text cell values from a configured workbook (`A1` → "Hello", `C3` → "World"). The Astro home page (`frontend/src/pages/index.astro`) SSR-fetches these via internal `BACKEND_API_URL` and displays a SharePoint connection card (Spanish UI copy for operators). `docs/API.md` and `adr-13-m365-graph` document the deliberate `AllowAny` exception. A fuller delegated-OAuth plan lives in `IMPLEMENTATION-PLAN-M365.md` and `M365-REQUIRED-VARIABLES-AND-SECRETS.md` for future four-endpoint JSON resource APIs.
- **Out of scope:** Full SharePoint CRUD, delegated user OAuth connect flow (planned but not fully implemented per the M365 plan), Cognito-as-Graph-IdP, or any Graph secrets on the frontend.

## 3. Product / idea

The mental model is **harness-first, two-service web app**:

```
Browser ──► shared ALB (TLS)
              ├─ /accounts/*, /api/*, /admin/*, /static/* → Django (port 8000)
              └─ /* (catch-all) → Astro SSR (port 4321)
                    └─ server-side fetch → Cloud Map DNS → backend:8000 (never via public ALB)
```

**Authentication:** Cognito hosted UI performs OIDC; Django exchanges the code, verifies the ID token (PyJWT + JWKS), `get_or_create`s a custom `User` keyed on `sub`, and opens a **Django DB session** (not bearer tokens in the browser). **Authorization:** Django Groups + DRF permission classes only — Cognito groups/claims are explicitly banned (`docs/AUTH.md`, `adr-10-auth`). Local dev can use `/accounts/dev-login/` when both `DEBUG` and `AUTH_DEV_MODE` are true; deploy checks hard-fail if either leaks into production images.

**Frontend interactivity ladder** (`docs/FRONTEND.md`): server HTML first → HTMX fragments from Django → Svelte islands only when client state demands it. The repo includes shadcn-svelte components, a ChatInput showcase, and middleware-level `Cache-Control: no-store` backstop.

**Caching doctrine** (`docs/CACHE.md`, `adr-06-cache`): no Redis ever; `DatabaseCache` + explicit HTTP headers + narrow LocMem/module caches only.

**Fork relationship:** `alvs-finanzas` retains `upstream` remote to `astro-drf-aws`; `kdx-fork-sync` skill cherry-picks compatible upstream commits. Project slug in docs/glossary is `alvs-finanzas`, but the **live ephemeral deploy inventory** (`docs/INVENTORY.md`, `deploy-prod.yml`) still references the prior `astro-drf-aws` slug until resources are re-provisioned under the new name.

### 3.1 North-star use cases

1. **Operator login:** Unauthenticated visitor hits Astro home → Login link → `/accounts/login/` → Cognito → callback → session → home shows avatar, nickname, logout, and SharePoint cell badges.
2. **SharePoint connectivity check:** Home page SSR reads `/api/m365/hello/` and `/api/m365/world/`; UI confirms Excel cells match expected literals or surfaces Graph error codes (`graph_auth_failed`, `graph_forbidden`, `graph_throttled`).
3. **RBAC verification:** Authenticated user calls `/api/me/` for identity + Django groups; admins pass `/api/restricted/` (`IsInAdminsGroup`), others receive 403.
4. **Agent-driven feature:** New backend capability starts with a row in `docs/API.md`, a TDD spec in `docs/tdds/`, implementation under `backend/apps/<domain>/`, guardian review, and pytest green in CI.
5. **Local full stack:** `docker compose --profile full up` brings Postgres, Django (migrate + createcachetable + uvicorn), and Astro; `python3 tests/test_docker_compose.py` validates layout.

### 3.2 Non-goals

- No CDN in front of the ALB (permanent decision, issue #33 / `adr-02`).
- No npm/Node runtime — **bun only** for JavaScript (`adr-04-frontend-and-design-system`).
- No Cognito RBAC, no second IdP, no passwords in production.
- No Redis, ElastiCache, or dedicated cache servers.
- Smoke tests in prod deploy workflow are **suspended** by owner directive (2026-07-13); `bun run build` still gates deploy.
- Staging environment does not exist in the ALVS AWS account.
- `.docs/` hidden vault is **not present** in this repo (only `docs/`).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.14 (backend), bun (frontend JS runtime) | `backend/pyproject.toml`, `backend/.python-version`, `frontend/package.json`, `docs/REQUIREMENTS.md` |
| Frontend | Astro 7.0.7 SSR, Svelte 5.56.4, Tailwind 4.3.2, shadcn-svelte (vendored components), HTMX 2.0.10 | `frontend/package.json`, `frontend/astro.config.mjs`, `frontend/src/lib/components/ui/` |
| Backend / API | Django 6.0.7, DRF 3.17.1, uvicorn 0.51.0 ASGI, drf-spectacular, django-cors-headers, PyJWT, MSAL, httpx | `backend/pyproject.toml`, `backend/config/settings.py`, `backend/config/urls.py` |
| Data | PostgreSQL 17.9 (RDS prod + Compose local), Django migrations only | `compose.yaml`, `docs/BD.md`, `docs/REQUIREMENTS.md` |
| Cache | Django `DatabaseCache` (Postgres table via `createcachetable`), no Redis | `docs/CACHE.md`, `backend/config/settings.py` |
| Auth | AWS Cognito OIDC (confidential client) + Django sessions + custom `User(sub)` model | `docs/AUTH.md`, `backend/apps/users/` |
| M365 | MSAL client_credentials app-only Graph reads | `backend/apps/m365/graph.py`, `backend/apps/m365/views.py`, `adr-13-m365-graph` |
| Infra / deploy | AWS ECS Fargate (256 CPU / 512 MB), shared ALB, Cloud Map service discovery, Secrets Manager, GitHub Actions OIDC | `docs/INFRASTRUCTURE.md`, `.github/workflows/deploy-prod.yml`, `docs/INVENTORY.md` |
| AI / agents | Vendored `.claude/skills/*`, guardian agents in `agents/`, hooks in `.claude/hooks/`, ADRs as rules | `docs/HARNESS.md`, `.claude/settings.json`, `AGENTS.md` |
| Tests | pytest + pytest-django + factory_boy (backend); bun test (frontend, CI only — prod deploy skips smoke) | `backend/pyproject.toml`, `frontend/tests/smoke.test.ts`, `.github/workflows/ci.yml` |
| Local orchestration | Docker Compose profiles | `compose.yaml`, `docs/DOCKER.md` |

### 4.1 Notable dependencies (curated)

- `msal` — acquires app-only Microsoft Graph tokens for SharePoint Excel cell reads without persisting access tokens.
- `PyJWT[crypto]` — verifies Cognito ID tokens at the `/accounts/callback/` seam against pool JWKS.
- `drf-spectacular` — OpenAPI generation for JSON APIs; `docs/API.md` remains authoritative over generated schema.
- `htmx.org` — hypermedia client loaded in Astro layout for future Django-rendered fragment swaps (`docs/HTMX.md`).
- `@astrojs/node` — standalone SSR adapter; executed under bun per frontend toolchain rules.
- `psycopg[binary]` — PostgreSQL driver for Django ORM against RDS and local Compose Postgres.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `backend/manage.py` — Django management CLI.
  - `backend/config/asgi.py` — ASGI app served by uvicorn (port 8000).
  - `frontend/src/pages/` — Astro SSR routes (`index.astro`, `showcase/*`, `healthz.ts`).
  - `compose.yaml` — local multi-service orchestrator (profiles `db`, `backend`, `frontend`, `full`).

- **Domain / core:**
  - `backend/apps/users/` — custom User model (`sub` PK), OIDC views (`/accounts/*`), `/api/me/`, `/api/restricted/`, RBAC permissions, deploy safety checks.
  - `backend/apps/health/` — `/api/health/` liveness for ALB.
  - `backend/apps/m365/` — Graph client + hello/world cell readers.
  - `backend/config/settings.py` — fully env-driven settings, CORS/CSRF/session policy, ECS task IP append for health probes.

- **Adapters:**
  - `backend/apps/users/oidc.py` — Cognito token exchange and verification.
  - `backend/apps/m365/graph.py` — MSAL token acquisition + httpx Graph REST calls with module-level cell cache (60s TTL).
  - `frontend/src/middleware.ts` — global `Cache-Control` backstop for SSR responses.

- **Docs vaults:**
  - `docs/` — SSOT topics: `PRD.md`, `API.md`, `VARIABLES.md`, `AUTH.md`, `BACKEND.md`, `FRONTEND.md`, `INFRASTRUCTURE.md`, `HARNESS.md`, `INVENTORY.md`, BDDs under `docs/bdds/`, ADRs under `docs/adrs/` (15 active ADRs, `adr-00` through `adr-14`).
  - **`.docs/` — not present** (scanned; no hidden docs vault in this tree).

- **Agent scaffolding:**
  - `AGENTS.md` / `CLAUDE.md` — trusted index and ABC gate; session-start reading list.
  - `.claude/skills/` (mirrored `skills/`) — 19 vendored skills (`kdx-django-6-drf`, `kdx-astro-7`, `kdx-orchestrator`, `kdx-fork-sync`, AWS family, handoff trio, `obsidian-markdown`, `kdx-triage`).
  - `.claude/hooks/` (symlink `hooks/`) — `load_ssot.py`, `check_api.py`, `check_variables.py`, `check_adr.py`, `dispatch_guardians.py`, `require_api_read.py`, `graph_first.py`, `graph_freshness.py`.
  - `agents/` (mirrored `.claude/agents/`, `.agents/agents/`) — guardians `alvs-finanzas-prd`, `alvs-finanzas-adr`, `alvs-finanzas-api`; orchestrator workers `orch-planner`, `orch-builder`, `orch-auditor`, `orch-critic`, `orch-evaluate`, `orch-janitor`, `orch-document-this`, `orch-changelog`, `orch-low/medium/high`.
  - `.claude/rules/` — ADR files loaded as agent rules (symlink from `docs/adrs/`).
  - `ONBOARDING.md` — human/agent cold-start reading order.
  - `IMPLEMENTATION-PLAN-M365.md`, `M365-REQUIRED-VARIABLES-AND-SECRETS.md` — M365 capability expansion plans (delegated OAuth, encrypted refresh tokens, resource catalog).

- **CI/CD:**
  - `.github/workflows/ci.yml` — PR to `main`: backend pytest, harness compose tests, frontend build+test.
  - `.github/workflows/deploy-prod.yml` — push to `prod`: test → ECR build/push → one-off ECS migrate task → rolling ECS deploy (backend + frontend).

- **Harness / structure tests:**
  - `tests/test_docker_compose.py` — validates Compose profiles and service wiring.
  - `tests/test_check_variables_hook.py` — regression for variables hook.
  - `tests/test_aws_infra.py` — infra layout checks.

- **Generated / vendor (existence only):**
  - `backend/uv.lock`, `frontend/bun.lock` — lockfiles (not ingested as content).
  - `node_modules/`, `.venv/`, `dist/`, `.astro/` — gitignored build artifacts.

## 6. Configuration & contracts (no secrets)

All names below are declared in `docs/VARIABLES.md`. Values live in gitignored `.env` locally or AWS Secrets Manager paths `alvs/<env>/<project>/<component>` in cloud. **No secret values are recorded here.**

### Shared identity

| Name | Purpose |
|------|---------|
| `PROJECT_SLUG` | AWS resource naming stem (`alvs-finanzas` for this fork) |
| `BASE_DOMAIN` | Composes public host `<slug>[.dev].<domain>` per infrastructure doc |

### Backend (selected)

| Name | Purpose |
|------|---------|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Postgres connection |
| `SECRET_KEY` | Django signing |
| `ALLOWED_HOSTS` | Host header allowlist (must include Cloud Map internal hostname in prod) |
| `DEBUG` | Debug flag (never true in prod) |
| `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` | Split-origin browser ↔ API (local ports 4321/8000) |
| `COGNITO_*` (5 vars) | OIDC pool, client, secret, domain, region |
| `AUTH_DEV_MODE` | Local-only dev login switch (paired with DEBUG) |
| `USE_X_FORWARDED_PROTO` | Trust ALB HTTPS header in cloud |
| `MSGRAPH_TENANT_ID`, `MSGRAPH_CLIENT_ID`, `MSGRAPH_CLIENT_SECRET` | App-only Graph credentials |
| `ECS_CONTAINER_METADATA_URI_V4` | Auto-injected; appends task IP to ALLOWED_HOSTS for ALB IP health checks |

### Frontend (all non-secret)

| Name | Purpose |
|------|---------|
| `PORT`, `HOST` | Astro bind (4321 / 0.0.0.0) |
| `PUBLIC_SITE_URL`, `PUBLIC_API_URL`, `PUBLIC_BACKEND_URL` | Browser-visible URLs |
| `BACKEND_API_URL` | Server-side only internal backend base (Compose: `http://backend:8000`; cloud: Cloud Map hostname) |

### Compose-only publish ports

`DB_PUBLISH_PORT`, `BACKEND_PUBLISH_PORT`, `FRONTEND_PUBLISH_PORT` — host port mappings, not read by app code.

`.env.example` at repo root shows local placeholder shapes; copy to `.env` for development.

### 6.1 HTTP / API endpoints

Authoritative table: `docs/API.md`. Summary:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/health/` | ALB liveness probe | none |
| `GET` | `/accounts/login/` | Start Cognito OIDC redirect | none |
| `GET` | `/accounts/callback/` | OIDC code exchange → Django session | none |
| `POST` | `/accounts/logout/` | Flush session + Cognito logout | session (CSRF) |
| `GET` | `/accounts/dev-login/` | DEBUG+AUTH_DEV_MODE local login | none (absent in prod) |
| `GET` | `/api/me/` | Current user + Django groups JSON | session |
| `GET` | `/api/restricted/` | RBAC probe for `admins` group | session + `IsInAdminsGroup` |
| `GET` | `/api/m365/hello/` | App-only Graph read of Excel cell A1 (`Hello`) | none (`AllowAny` demo exception) |
| `GET` | `/api/m365/world/` | App-only Graph read of Excel cell C3 (`World`) | none (`AllowAny` demo exception) |

All listed routes return `Cache-Control: no-store` where they touch session or authenticated identity. M365 demo endpoints return `text/plain` bodies with structured error tokens on Graph failures (502/503, never raw tracebacks).

**Frontend HTTP surface (Astro, not in API.md):**

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/` | Home: login affordance, SharePoint card, nav to showcases | passes session cookie to SSR `/api/me/` |
| `GET` | `/healthz` | Frontend container health for Compose/ALB | none |
| `GET` | `/showcase/components/` | shadcn-svelte component gallery | unknown session usage |
| `GET` | `/showcase/chatui/` | ChatInput UI showcase | unknown session usage |

Django admin and DRF browsable API are available under `/admin/` when enabled but are infrastructure/static concerns, not finanzas product endpoints.

### 6.2 Other interfaces

- **CLI:** `uv run python manage.py <command>` (migrate, check, createsuperuser); `bun run dev|build|test` in `frontend/`.
- **Guardian agents:** `alvs-finanzas-prd`, `alvs-finanzas-adr`, `alvs-finanzas-api` — invoked via hook dispatch on SSOT/surface edits; return `status: valid|defect` verdicts.
- **Orchestrator workers:** `orch-*` agents for plan/build/audit/critic/evaluate/document/changelog/janitor loops per `kdx-orchestrator` skill.
- **Compose profiles:** `docker compose --profile db|backend|frontend|full up`.
- **Upstream sync:** `kdx-fork-sync` skill — cherry-pick from `upstream` (`astro-drf-aws`), never merge/rebase.

## 7. Data & persistence

- **Primary store:** PostgreSQL 17.9 — one database per project per environment (`app` db name locally).
- **Prod:** Dedicated RDS instance for the ephemeral reference run (`docs/INVENTORY.md`); shared-account pattern documented in `docs/BD.md`. Credentials via Secrets Manager `alvs/prod/<project>/db` JSON keys mapped to `DB_*` env vars.
- **Local:** Compose `db` service (`postgres:17.9-bookworm`) with named volume `pgdata`; backend runs migrations on startup.
- **Cache table:** Django `DatabaseCache` table created by `createcachetable` during deploy migrate task and local backend startup — lives in the same Postgres database (no separate cache server).
- **Entities:**
  - `users.User` — primary key `sub` (Cognito subject), fields `email`, `given_name`, `family_name`, `picture`, standard Django auth flags; linked to Django Groups for RBAC.
  - M365 app currently has no persisted models in the implemented hello/world path (tokens are ephemeral per request); the implementation plan describes a future `UserMicrosoftConnection` for delegated refresh tokens.
- **Media:** Private S3 bucket pattern in infrastructure doc; presigned URLs from Django when used — not heavily exercised in current finanzas demo.
- **Topology:** Cloud tasks in public subnets (no NAT); SSR frontend reaches backend via Cloud Map private DNS inside the VPC; browsers hit the shared ALB on the public project host.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`README.md`** — fork identity, stack one-liner, Compose quick start, roadmap (all three stages done).
2. **`ONBOARDING.md`** — ABC gate, reading order, doctrine surprises (no Redis, Cognito auth-only, bun/uv toolchains, English code).
3. **`AGENTS.md`** — harness index, development loop, guardian protocol, M365 Entra registration standing choices, smoke-test suspension note.
4. **`docs/PRD.md`** — harness-as-product thesis, canonical workflows, non-negotiables, M365 stage-4 addition.
5. **`docs/API.md`** — full endpoint SSOT with contracts for auth and M365 demos.
6. **`docs/AUTH.md`** — Cognito/Django split, dev-login guards, cookie/CSRF bridge for split origins.
7. **`docs/BACKEND.md`**, **`docs/FRONTEND.md`**, **`docs/INFRASTRUCTURE.md`**, **`docs/BD.md`**, **`docs/CACHE.md`**, **`docs/HARNESS.md`**, **`docs/VARIABLES.md`**, **`docs/REQUIREMENTS.md`**, **`docs/GLOSSARY.md`** — stack rules, version pins, naming authority, AWS layout.
8. **`docs/INVENTORY.md`** — ephemeral `astro-drf-aws` prod resource inventory (shared vs ephemeral rows, teardown order).
9. **`docs/bdds/bdd-01-plain-home-page.md`**, **`docs/bdds/bdd-02-home-navigation-and-sharepoint-check.md`** — user-facing BDD specs for home and SharePoint check behavior.
10. **`docs/adrs/adr-00` through `adr-14`** — machine-loaded rules (API discipline, stack pins, HTMX, cache ban, auth split, guardians, ephemeral run, M365 graph, harness vendoring).
11. **`.claude/settings.json`** — hook wiring for SessionStart, PreToolUse (graph-first), UserPromptSubmit (API read), PostToolUse (ADR/API/variables/guardian dispatch).
12. **`.claude/skills/`** — 19 vendored skills inventoried in `docs/HARNESS.md`; `kdx-fork-sync`, `kdx-orchestrator`, `kdx-django-6-drf`, `kdx-astro-7`, AWS operational skills, handoff trio, `obsidian-markdown`, `kdx-triage`.
13. **`agents/alvs-finanzas-api.md`** (and siblings prd/adr) — guardian missions and restrictive enforcement posture.
14. **`IMPLEMENTATION-PLAN-M365.md`**, **`M365-REQUIRED-VARIABLES-AND-SECRETS.md`** — planned delegated Graph OAuth, Fernet-encrypted refresh storage, resource catalog JSON — not fully built beyond app-only demo.
15. **`CHANGELOG.md`** — documents 2026-07-13 fork from `astro-drf-aws`, identity rename, ChatInput UI work, MSGRAPH compose passthrough.
16. **`.docs/`** — **not present**; scan attempted, no hidden vault directory exists.

Agent conventions worth retaining in memory: PRD+API always loaded; ADRs are rules-only with wikilinks to content docs; Obsidian callouts and `[[wikilinks]]` everywhere; direct push to `main`/`prod` restricted to `kodexArg`; issues use branches `issue-<n>-<slug>`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repo under `kodexArg`; this summary contains no clone URLs, live secrets, or credential values.
- **Auth model:** OIDC via Cognito (Google federation on shared org pool per inventory notes) → Django session cookie; RBAC exclusively via Django Groups (`admins` group seeded by migration). Frontend never receives Cognito or Graph secrets.
- **Secrets handling:** AWS Secrets Manager JSON blobs per component (`django`, `db`, `cognito`, `msgraph`, `s3`); local `.env` gitignored. Deploy workflow injects secrets into ECS task definitions by ARN reference, not plaintext in YAML beyond structural ARNs in the workflow file (infrastructure identifiers, not secret values).
- **M365 demo risk:** `/api/m365/hello/` and `/world/` are deliberately unauthenticated (`AllowAny`) per `adr-13` owner exception — acceptable only as a bounded demo; broader Graph APIs in the plan require session auth.
- **Dev guards:** `users/checks.py` deploy checks block `DEBUG` or `AUTH_DEV_MODE` in production boot paths.
- **Caching privacy:** Authenticated responses default `no-store`; SharePoint probe card and `/api/me/` follow this.
- **This file:** Contains no `.env` contents, PEM material, client secrets, or connection strings with passwords.

## 10. Operational picture

### Local development

```bash
# Postgres only
docker compose --profile db up -d

# Backend API + Postgres (AUTH_DEV_MODE defaults true in compose)
docker compose --profile backend up -d

# Full stack including Astro frontend
docker compose --profile full up -d

# Harness validation
python3 tests/test_docker_compose.py
python3 tests/test_docker_compose.py --smoke
```

Copy `.env.example` → `.env` and fill Cognito/MSGRAPH names per `docs/VARIABLES.md` for live integrations. Backend tests: `cd backend && uv sync && uv run pytest -m "not cognito_live"`. Frontend: `cd frontend && bun install && bun run build && bun test`.

### Deployment

- **CI:** `.github/workflows/ci.yml` on PRs to `main` — backend tests, compose layout tests, frontend build+test.
- **Prod deploy:** `.github/workflows/deploy-prod.yml` on push to `prod` — pytest → Docker buildx push to ECR (`alvs/<slug>-backend|frontend` with `prod-<sha>` tags) → one-off Fargate migrate task → update `astro-drf-aws-backend` and `astro-drf-aws-frontend` ECS services on cluster `alvs-prod` (names still on pre-rename slug per inventory).
- **Auth to AWS:** GitHub OIDC → `gha-deploy-prod` role; no long-lived AWS keys in the repo.
- **Branch policy:** `main` = integration; `prod` = production line (do not treat `main` as live). Release tags `v*` per `docs/GH.md`.
- **Ephemeral reference run:** Prod-only, tagged `lifecycle=ephemeral`, teardown from `docs/INVENTORY.md` Phase E — resources born dead, user-gated destruction.

### Hardware constraints

- Fargate baseline 256 CPU / 512 MB per service; scale only when measured (`docs/INFRASTRUCTURE.md`).
- RDS `db.t4g.micro` single-AZ; no GPU or specialized hardware.

## 11. Open questions / unknowns

- **Deploy slug mismatch:** Documentation and `.env.example` say `PROJECT_SLUG=alvs-finanzas`, but `deploy-prod.yml` and `docs/INVENTORY.md` still provision under `astro-drf-aws` hostnames and ECR repos — unclear when a full re-provision under the finanzas slug will occur.
- **M365 delegated flow:** `IMPLEMENTATION-PLAN-M365.md` describes four JSON resource endpoints + OAuth connect + encrypted refresh tokens; only app-only hello/world cells are implemented. `MSGRAPH_SCOPES`, `MSGRAPH_RESOURCE_CATALOG`, `MSGRAPH_TOKEN_FERNET_KEY` are documented in the M365 variables doc but not in the main `docs/VARIABLES.md` table yet.
- **HTMX production usage:** HTMX is in the stack and documented, but current finanzas UI is primarily Astro SSR + Svelte islands; no declared HTMX fragment endpoints in `docs/API.md` yet.
- **Finanzas domain features:** Beyond SharePoint connectivity demo and auth scaffolding, specific finanzas business logic (ledgers, approvals, reporting) is not evident — repo is still template-shaped with ALVS branding and M365 probe.
- **`.docs/` vault:** Confirmed absent; all documentation lives in `docs/` only.
- **Dev cloud environment:** Infrastructure doctrine includes `dev ← main` deploys for real projects, but the template's own ephemeral run is prod-only; whether `alvs-finanzas` will get a dev ECS environment is unknown.
- **Live Cognito integration tests:** `cognito_live` pytest marker exists but is excluded from CI by default; live pool behavior depends on secrets not inspected here.
