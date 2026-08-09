---
id: "alvs-financial-gateway"
title: "ALVS Financial Gateway — treasury web application for Grupo ALVS"
visibility: private
importance: high
source_repo: "alvs-financial-gateway"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags:
  - "treasury"
  - "django"
  - "drf"
  - "astro"
  - "svelte"
  - "aws"
  - "fargate"
  - "postgresql"
  - "sharepoint"
  - "m365"
  - "cognito"
  - "bedrock"
  - "alvs"
  - "private"
problems_solved:
  - "Legacy GestiónFinanciera treasury operations were trapped in spreadsheets and an aging desktop system — cash positions, payment circuits, third-party checks, and intercompany balances across a 16-company holding needed a modern, authenticated, role-gated web surface."
  - "SharePoint-hosted financial Excel workbooks could not be exposed directly to browsers without bypassing authorization — the group needed an authenticated AWS tier that ingests M365 data app-only and serves computed figures under Django RBAC."
  - "Treasury staff lacked a single audited system of record for operational state (check lifecycles, payment orders, confirmations, manual movements) — PostgreSQL must be authoritative while Excel-derived data is ingested once and computed server-side."
technologies:
  - "Astro 7 (SSR)"
  - "Svelte 5"
  - "Tailwind CSS 4"
  - "HTMX 2"
  - "Django 6"
  - "Django REST Framework 3.17"
  - "Python 3.14"
  - "PostgreSQL 17"
  - "Uvicorn (ASGI)"
  - "AWS ECS Fargate"
  - "AWS Cognito (OIDC via Google federation)"
  - "AWS Bedrock (Nova Micro inference profile)"
  - "Microsoft Graph (app-only SharePoint ingestion)"
  - "Bun (frontend package manager and runtime)"
  - "Docker Compose (local dev)"
  - "GitHub Actions (CI and prod deploy)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ALVS Financial Gateway

> **Problem thesis (required):** Grupo ALVS operates daily treasury across sixteen companies — cash positions, payment circuits, third-party checks, intercompany balances — historically through the legacy GestiónFinanciera system and SharePoint Excel workbooks. This repository is the permanent replacement: an authenticated web application that ingests financial data from Microsoft 365 into PostgreSQL, computes positions once on the server, enforces segregation-of-duties on writes, and renders everything in Spanish for operators while keeping code and documentation in English. It is a production deployment on shared ALVS AWS infrastructure, not a throwaway template fork.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/alvs-financial-gateway` |
| Visibility | `private` |
| Default branch | `main` (integration); `prod` is the production promotion line |
| One-line pitch | Treasury web gateway for Grupo ALVS — SharePoint financial data through an authenticated Django API to an Astro SSR frontend, replacing GestiónFinanciera. |
| Audience | ALVS treasury operators, confirmers, and viewers; internal admins; AI agents working through the project's harness; infrastructure operators deploying to AWS. |

## 2. Problems it solves

### P1 — Legacy treasury tooling cannot serve a multi-company holding

- **Who hurts:** Treasury staff, finance controllers, and executives across Grupo ALVS's sixteen-company holding who relied on GestiónFinanciera and scattered Excel workflows.
- **Pain today:** Cash positions, payment circuits, third-party checks, and intercompany balances were fragmented across a legacy desktop system and SharePoint workbooks. There was no single authenticated web surface with role-based access, audit trails, or server-side computation that every view could trust.
- **How this repo answers:** Eleven treasury views (holding funnel, daily position, bank position, projection, payments, check portfolio, movements, intercompany, reports, confirmation, control panel) are implemented as Astro SSR pages backed by Django REST endpoints. All figures are computed once in Python services (`compute_posicion` and related treasury computation layer) and consumed identically by every screen. Operational writes — manual movements, check transitions, payment orders and confirmations — land immutable audit rows with segregation-of-duties guards.
- **Out of scope:** General ledger, ERP replacement, or non-treasury corporate functions. The external `finanzas-grupo-alvs` reverse-engineering reference is consulted out-of-tree and never vendored.

### P2 — SharePoint data must not reach browsers without an auth tier

- **Who hurts:** IT security, compliance, and treasury operators who need Excel-sourced figures without exposing M365 directly.
- **Pain today:** Financial Excel files live in Microsoft 365. Serving them raw to a browser would bypass Django authorization and leak source workbooks.
- **How this repo answers:** A confidential Entra app registration acquires app-only Graph tokens (`client_credentials`) using three declared env vars (`MSGRAPH_TENANT_ID`, `MSGRAPH_CLIENT_ID`, `MSGRAPH_CLIENT_SECRET`). Nine SharePoint workbooks ingest into PostgreSQL via `POST /api/ingestion-runs/` (admin-gated). Every treasury read endpoint requires session auth plus Django group membership (`treasury_viewers`, `treasury_operators`, `treasury_confirmers`, or `admins`). Responses are `no-store` cached.
- **Out of scope:** User-delegated Graph flows, write-back to SharePoint, or real-time Excel co-authoring. Scheduled ingestion via EventBridge → ECS RunTask is designed but not yet provisioned.

### P3 — Agents and humans need a governed development harness, not ad-hoc edits

- **Who hurts:** kodexArg maintainers and AI agents implementing features under strict API, ADR, and documentation discipline.
- **Pain today:** Full-stack treasury apps with AI surfaces, M365 integration, and AWS deploys are easy to break with undeclared routes, secret leaks, or docs drift.
- **How this repo answers:** A vendored harness (`docs/skills/`, `.claude/`, hooks, guardians) enforces the ABC gate (PRD → ADRs → API), requires API rows before code, blocks undeclared env vars, dispatches guardian agents on SSOT changes, and mandates vault-first doc reads via `markdown-vault-docs` MCP. Development follows BDD → API → TDD for backend and BDD-first for user-facing frontend work.
- **Out of scope:** Being a reusable open-source framework — it is a permanent ALVS production app born from the `astro-drf-aws` template but no longer governed as a template.

## 3. Product / idea

ALVS Financial Gateway is a **two-service web application**: an Astro 7 SSR + Svelte 5 frontend and a Django 6 + DRF backend, each running as its own AWS Fargate task behind a shared ALB. PostgreSQL holds authoritative operational state. Cognito (federated through Google) authenticates; Django Groups authorize. Bedrock powers two disjoint AI tiers — a closed-enum navigation router (`POST /api/router/route/`) and a read-only page-context assistant (`POST /api/assistant/ask/`).

The mental model for treasury data is **ingest → compute → render**:

1. SharePoint workbooks are ingested into normalized tables with real `source_date` stamps.
2. Pure computation services assemble positions, projections, and reports server-side (one `compute_posicion` call feeds Posición, Posición Bancaria, and Holding views).
3. The Astro frontend SSR-fetches composed payloads (e.g. `/api/posicion/`) to avoid client waterfalls, renders Spanish labels from a frontend catalog, and scopes by `?empresa=<CompanyId>|CONSOLIDADO`.

Users land on a role-gated lobby (`/`) or their configured `default_page`, switch company scope via the navbar, and navigate eleven treasury views plus profile, control panel, chat UI, and a component showcase. Theme, sidebar side, and chat drawer preferences are user-tunable and persisted via `PATCH /api/me/`.

### 3.1 North-star use cases

1. **Morning position review** — A `treasury_viewers` member opens Posición del Día for `CONSOLIDADO` or a single company, sees disponible vs compromisos cuadro with honest `source_dates` and conversion-error flags, drills into bank/cash rows.
2. **Payment circuit** — A `treasury_operator` registers manual movements, transitions held checks, builds a payment order from payable items; a separate `treasury_confirmer` confirms orders under segregation-of-duties rules.
3. **Operator/agent development** — A developer or agent follows `docs/DEVELOPMENT-LOOP.md`: BDD spec → API row → TDD tests → implementation → PR to `main`, with guardian review on SSOT touches.

### 3.2 Non-goals

- Redis or any external cache broker (DatabaseCache + LocMem only; Redis is prohibited by ADR).
- Cognito groups or custom claims for RBAC (Django Groups only).
- Smoke tests as CI or merge gates (owner directive; interactive kodex-only runs allowed).
- Staging environment (dev local + prod cloud only).
- NAT gateways in AWS VPC (accepted public-IP Fargate trade-off for cost).
- Hardcoded account identifiers or credentials (everything through `VARIABLES.md` and Secrets Manager).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.14 (backend), Bun (frontend) | `backend/pyproject.toml`, `frontend/package.json`, `frontend/bunfig.toml` |
| Frontend | Astro 7.0.7 SSR, Svelte 5.56, Tailwind 4.3, HTMX 2.0, Melt UI, Lucide icons | `frontend/package.json`, `frontend/astro.config.mjs` |
| Backend / API | Django 6.0.7 + DRF 3.17.1, Uvicorn ASGI, drf-spectacular, django-cors-headers | `backend/pyproject.toml`, `backend/config/settings.py` |
| Data | PostgreSQL 17.9 (RDS prod, Compose local), Django DatabaseCache | `compose.yaml`, `docs/BD.md`, `backend/config/settings.py` |
| Infra / deploy | AWS ECS Fargate (two services), shared ALB, Cloud Map service discovery, ECR, Secrets Manager, Bedrock VPC endpoint | `docs/INFRASTRUCTURE.md`, `.github/workflows/deploy-prod.yml` |
| Identity | AWS Cognito OIDC + Google IdP, Django session auth | `docs/AUTH.md`, `backend/apps/users/` |
| M365 / ingestion | MSAL client_credentials, httpx, nine workbook sources | `backend/pyproject.toml`, `docs/adr-13-m365-graph.md` |
| AI / agents | AWS Bedrock Nova Micro (router + assistant), vendored kskill-* harness, markdown-vault-docs MCP | `docs/CHATBOT.md`, `docs/HARNESS.md`, `.claude/` |
| Tests | pytest + pytest-django (backend), Bun test + happy-dom (frontend), harness tests in `tests/` | `backend/pyproject.toml`, `frontend/package.json`, `tests/` |
| CI/CD | GitHub Actions: `ci.yml` on PRs to main, `deploy-prod.yml` on push to prod, hunt workflows | `.github/workflows/` |

### 4.1 Notable dependencies (curated)

- `boto3` — Bedrock inference for router and assistant tiers; S3 media when configured.
- `msal` + `httpx` — App-only Microsoft Graph token acquisition and SharePoint reads.
- `pyjwt[crypto]` — OIDC ID token verification against Cognito JWKS.
- `psycopg[binary]` — PostgreSQL driver for Django ORM.
- `django-storages` — Optional S3-backed media storage in cloud environments.
- `whitenoise` — Static file serving in the backend container.
- `@astrojs/node` — Node adapter for Astro SSR production builds.
- `melt` — Headless UI primitives underlying shadcn-svelte components.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `frontend/` — Astro SSR app; pages under `frontend/src/pages/` (eleven treasury views, profile, panel, chatui, showcase); shared layout and middleware in `frontend/src/layouts/`, `frontend/src/middleware.ts`.
  - `backend/` — Django project root; `backend/config/` (settings, ASGI, root urls); domain apps under `backend/apps/`.
  - `compose.yaml` — Local Docker orchestrator with profiles `db`, `backend`, `frontend`, `full`.
- **Domain / core:**
  - `backend/apps/treasury/` — Models, serializers, views, computation services, ingestion pipeline, payment-order workflow, check state machine.
  - `backend/apps/users/` — Cognito OIDC views, session user model, `/api/me/` profile API, Django Groups RBAC.
  - `backend/apps/router/` — Chatbot choosing tier (closed-enum Bedrock routing).
  - `backend/apps/assistant/` — Page-context generating tier (Spanish Q&A with structured links).
  - `frontend/src/lib/treasury/` — Client types, currency conversion display helpers, API client (`treasuryApi.ts`).
  - `frontend/src/lib/components/views/` — One Svelte view component per treasury screen.
- **Adapters:**
  - `backend/apps/m365/` — Graph demo and status endpoints.
  - `backend/apps/health/` — ALB liveness probe.
  - `frontend/src/lib/router-client.ts`, `frontend/src/lib/csrf.ts` — Browser-to-API session bridge.
- **Docs vaults:**
  - `docs/` — Obsidian-flavored SSOT vault: `PRD.md`, `API.md`, `VARIABLES.md`, ADRs in `docs/adrs/`, BDDs in `docs/bdds/`, TDDs in `docs/tdds/`, contracts in `docs/contracts/`, treasury migration playbook in `docs/treasury-migration-playbook/`, plan artifacts in `docs/plan/`.
  - No `.docs/` hidden vault present in this clone.
- **Agent scaffolding:**
  - `.claude/rules/` — Symlinks to `docs/adrs/` loaded as agent rules.
  - `.claude/skills/` — Symlink to `docs/skills/` (kskill-astro-7, kskill-django-6-drf, kskill-orchestrator, kskill-aws-*, kskill-chatui, kskill-live-doc, kskill-markdown-vault, triage workflows, etc.).
  - `.claude/agents/` — Symlink to `docs/agents/` (kbot-* builders/guardians, kwf-* workflow cast, kwf-cloud-* cloud cast).
  - `.claude/hooks/` — Symlink to `docs/hooks/` (API check, variables check, guardian dispatch, graph-first, PR flow, SSOT preload).
  - `docs/agents/` — SSOT for all agent definitions including `kbot-prd`, `kbot-adr`, `kbot-api` guardians.
  - `AGENTS.md` / `CLAUDE.md` — Root harness index (outside vault, real file).
  - `scripts/mvmcp.py` — Self-bootstrapping launcher for vendored `markdown-vault-docs` MCP.
- **Generated / vendor:**
  - `docs/CODEMAP.md` — Generated doc→code inverse index (kskill-live-doc); never hand-edited.
  - `frontend/bun.lock`, `backend/.venv` (local), `node_modules/` (gitignored) — lock/vendor artifacts; not ingested for content.

## 6. Configuration & contracts (no secrets)

Environment variables are declared exclusively in `docs/VARIABLES.md`. Secret values live in AWS Secrets Manager under `alvs/<env>/<project>/*` or local gitignored `.env` for development. The frontend receives only `PUBLIC_*` non-secret variables.

**Backend (representative names and purpose):**

| Name | Purpose |
|------|---------|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | PostgreSQL connection |
| `SECRET_KEY` | Django signing |
| `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` | Django runtime and cross-origin session bridge |
| `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `COGNITO_CLIENT_SECRET`, `COGNITO_DOMAIN`, `COGNITO_REGION` | OIDC authentication |
| `AUTH_DEV_MODE`, `LOGIN_REDIRECT_URL`, `LOGOUT_REDIRECT_URL` | Dev login path and redirect targets |
| `MSGRAPH_TENANT_ID`, `MSGRAPH_CLIENT_ID`, `MSGRAPH_CLIENT_SECRET` | App-only Graph access |
| `BEDROCK_REGION`, `ROUTER_BEDROCK_MODEL_ID`, `ASSISTANT_BEDROCK_MODEL_ID` | Bedrock inference |
| `ROUTER_ENABLED`, `ASSISTANT_ENABLED` | AI tier kill switches |
| `ROUTER_USE_MOCK_INFERENCE`, `ASSISTANT_USE_MOCK_INFERENCE` | DEBUG-only local mock opt-out |
| `THROTTLE_COOLDOWN_SECONDS`, `ROUTER_RATE_*` | Router/assistant throttling and abuse guard |
| `PROJECT_SLUG`, `BASE_DOMAIN` | AWS resource naming and host composition |
| `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_REGION_NAME`, `MEDIA_URL` | Optional S3 media |
| `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_PASSWORD`, `AUTH_BOOTSTRAP_ALLOWLIST` | Bootstrap admin and first-login group grants |

**Frontend (all non-secret):**

| Name | Purpose |
|------|---------|
| `PORT`, `HOST`, `NODE_ENV` | Astro server bind |
| `PUBLIC_SITE_URL`, `PUBLIC_API_URL`, `PUBLIC_BACKEND_URL` | Client-visible origins |
| `BACKEND_API_URL` | Server-side SSR fetch target (Cloud Map hostname in cloud) |
| `PUBLIC_PROJECT_SLUG` | Derived from `PROJECT_SLUG` |
| `RUN_SMOKE` | Opt-in gate for prohibited smoke test suite |

Django settings module: `config.settings`. Cache: `DatabaseCache` on table `django_cache_table` plus `LocMemCache` alias. No Redis.

### 6.1 HTTP / API endpoints (when applicable)

All backend routes are declared in `docs/API.md`. Contracts with payload detail live in `docs/contracts/api-contracts-platform.md` and `docs/contracts/api-contracts-treasury.md`.

**Platform and auth:**

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/api/health/` | ALB liveness | none |
| GET | `/accounts/login/` | OIDC redirect to Google via Cognito | none |
| GET | `/accounts/callback/` | Token exchange, session open | none |
| POST | `/accounts/logout/` | Session + Cognito logout | session |
| GET | `/accounts/dev-login/` | DEBUG dev login | none (DEBUG only) |
| GET | `/api/me/` | Current user + groups + theme | session |
| PATCH | `/api/me/` | Profile/theme/default_page update | session |
| GET | `/api/restricted/` | Admins RBAC probe | session; admins group |
| GET | `/api/m365/hello/` | Graph demo cell A1 | none (AllowAny) |
| GET | `/api/m365/world/` | Graph demo cell C3 | none (AllowAny) |
| GET | `/api/m365/status/` | Permission-filtered Graph probe | session |
| POST | `/api/router/route/` | Chatbot choosing tier | session; admins or ai_operators |
| POST | `/api/assistant/ask/` | Page-context assistant | session; admins or treasury groups |
| GET | `/admin/` | Django admin mount | session; staff |

**Treasury reads (all session + `HasTreasuryReadAccess` unless noted):**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/companies/` | Company roster |
| GET | `/api/exchange-rates/` | FX rates with provenance |
| GET | `/api/bank-balances/` | Bank balances per company scope |
| GET | `/api/cash-balances/` | Cash box balances per company scope |
| GET | `/api/posicion/` | Composed daily position payload |
| GET | `/api/posicion-bancaria/` | Bank-narrowed position |
| GET | `/api/holding/` | Per-company holding funnel |
| GET | `/api/proyectado/` | Weekly projection |
| GET | `/api/informes/` | Monthly report |
| GET | `/api/informes/ejecutado/` | Executed report over date range |
| GET | `/api/intercompany-balance/` | Netted intercompany debts |
| GET | `/api/held-checks/` | Third-party check portfolio |
| GET | `/api/invoices-payable/` | Payable invoices |
| GET | `/api/issued-cpds/` | Issued deferred checks |
| GET | `/api/loan-installments/` | Loan installments |
| GET | `/api/tax-obligations/` | Tax obligations |
| GET | `/api/payroll-aggregates/` | Payroll aggregates |
| GET | `/api/card-statements/` | Credit card statements |
| GET | `/api/manual-movements/` | Manual movements register |
| GET | `/api/payment-orders/` | Payment orders list |
| GET | `/api/ingestion-runs/` | Ingestion history / freshness |

**Treasury writes (session + role-specific permission):**

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/api/manual-movements/` | Register movement | treasury_operators or admins |
| PATCH | `/api/manual-movements/{id}/` | Edit/cancel pending movement | treasury_operators or admins |
| PATCH | `/api/held-checks/{id}/transition/` | Check lifecycle transition | treasury_operators or admins |
| POST | `/api/payment-orders/` | Create payment order | treasury_operators or admins |
| POST | `/api/payment-orders/{id}/confirm/` | Confirm order | treasury_confirmers or admins |
| POST | `/api/ingestion-runs/` | Trigger SharePoint ingestion | admins |

**Frontend HTTP surface (Astro SSR pages, not API):**

| Path | Purpose |
|------|---------|
| `/` | Authorization lobby / home cards |
| `/holding/` | Holding funnel view |
| `/posicion/` | Daily position |
| `/posicion-bancaria/` | Bank position |
| `/proyectado/` | Projection |
| `/pagos/` | Payments agenda |
| `/cheques-cartera/` | Check portfolio |
| `/movimientos/` | Manual movements |
| `/intercompany/` | Intercompany balances |
| `/informes/` | Monthly report |
| `/informes/ejecutado/` | Executed report |
| `/confirmar/` | Payment confirmation |
| `/panel/` | Control panel |
| `/profile/` | User profile and theming |
| `/chatui/` | Chat UI surface |
| `/showcase/components/` | Design system gallery |
| `/healthz` | Frontend container health (TypeScript endpoint) |

### 6.2 Other interfaces

- **CLI / management commands:** `python manage.py migrate`, `bootstrap_admin`, `seed_demo_operator`, `loaddata intents`, `createcachetable`, `run_ingestion` (planned for scheduled ECS tasks).
- **MCP tools:** `markdown-vault-docs` (vault search/read/backlinks), `codebase-memory-mcp` (code graph, machine-local), `chrome-devtools` (interactive browser verification, local only).
- **Harness workflows:** `triage-and-fix` and `cloud-triage-and-fix` JavaScript workflows in `.claude/workflows/`; GitHub Actions `hunt.yml` runs cloud triage unattended per issue.
- **Hooks:** PostToolUse and SessionStart Python hooks enforcing API, variables, ADR, guardian dispatch, graph-first code exploration.

## 7. Data & persistence

**Stores:**

- **PostgreSQL 17.9** — Single authoritative database per environment. Prod rides shared RDS instance `alvs-prod-pg` with database `alvs_financial_gateway`. Local uses Compose `db` service (published port configurable, default 5433 on host per README).
- **Django DatabaseCache** — Router rate-abuse blocks, throttle state, general cache entries in `django_cache_table` within the same database.
- **S3 (optional cloud)** — Private media bucket when `AWS_STORAGE_BUCKET_NAME` is set; presigned URLs, no CDN.
- **Django sessions** — DB-backed session store for browser authentication (no Redis).

**Important entity families (treasury app):**

- Companies roster (`Company`), exchange rates, bank/cash balances (ingested).
- Held checks with lifecycle states (`cartera`, `a_acreditarse`, `negociado`, `cobrado`, `rechazado`).
- Manual movements, payment orders, payment confirmations, audit rows.
- Payables: invoices, CPDs, loans, taxes, payroll, card statements.
- Ingestion runs with source dates and row counts.
- Users keyed on Cognito `sub`, Django Groups for RBAC, `theme_config` and `default_page` preferences.
- Router `Intent`/`IntentQuery` and assistant `AssistantQuery` audit tables.

**Topology:** SharePoint (M365 cloud) → ingestion pipeline (backend Fargate) → PostgreSQL (isolated RDS subnets) → computation services → DRF JSON → Astro SSR (frontend Fargate via Cloud Map internal DNS, never through public ALB for server-side fetches). Edge is the shared ALB terminating TLS and routing `/api/*`, `/accounts/*`, `/admin/*` to backend and all other paths to frontend.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

- `README.md` — Project pitch, Docker profiles, branch model, roadmap pointer.
- `AGENTS.md` — Harness index, ABC gate, development loop, smoke-test prohibition, structure map.
- `docs/PRD.md` — Objective, SharePoint-through-tier doctrine, PostgreSQL authority, Spanish rendering, growth-by-addition.
- `docs/API.md` — Complete endpoint SSOT table (40+ rows).
- `docs/VARIABLES.md` — Env var SSOT with Secrets Manager mapping.
- `docs/INFRASTRUCTURE.md` — Two-Fargate layout, ALB rules, Cloud Map, no-NAT trade-off, Bedrock VPC endpoint.
- `docs/AUTH.md` — Cognito authenticates / Django authorizes split, OIDC flow, dev-login guards.
- `docs/BD.md` — PostgreSQL environments, migration execution points.
- `docs/ROADMAP.md` — Six stages; stages 2–4 current; mock-fed era ended 2026-07-27.
- `docs/HARNESS.md` — Vendored skills inventory, MCP servers, agent naming conventions.
- `docs/contracts/api-contracts-platform.md` — Auth, me, m365, router, assistant contracts.
- `docs/contracts/api-contracts-treasury.md` — Treasury payload shapes, write audit behavior, segregation rules.
- `docs/treasury-migration-playbook/00-README.md` — Phased migration from legacy GestiónFinanciera.
- `.claude/rules/` — ADR symlinks (adr-00 through adr-31+ present).
- `.claude/skills/`, `.claude/agents/`, `.claude/hooks/` — Harness symlink trees mirroring `docs/skills/`, `docs/agents/`, `docs/hooks/`.
- **`.docs/`** — Not present in repository; no hidden docs vault beyond `docs/`.

Agent conventions worth retaining: docs prose is reached through `markdown-vault-docs` MCP before grep; code structure through `codebase-memory-mcp`; PRD and API must stay in agent memory; guardians (`kbot-prd`, `kbot-adr`, `kbot-api`) gate SSOT edits; `sleep` is prohibited as a wait strategy; smoke tests are never merge gates.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg`. This summary contains no clone URLs, credentials, ARNs with live suffixes, or connection strings.
- **Auth model:** Cognito OIDC authorization-code flow with Google federation → Django DB session cookie. RBAC exclusively via Django Groups (`admins`, `treasury_viewers`, `treasury_operators`, `treasury_confirmers`, `ai_operators` for router only). CSRF on unsafe methods; `CORS_ALLOW_CREDENTIALS` enabled for split-origin local dev and single-origin cloud.
- **Secrets:** AWS Secrets Manager for cloud (`django`, `db`, `cognito`, `msgraph` secret families). Local `.env` gitignored. Frontend never receives secrets.
- **Accepted infra risks:** Fargate tasks run with public IPs and no NAT (documented cost trade-off). Task security group is primary network isolation.
- **AI safety:** Router returns only closed enum outcomes (never free-form navigation actions outside registry). Assistant returns Spanish text with server-validated link targets only; no HTML/Markdown interpretation client-side. Rate abuse blocks return indistinguishable bare 429s.
- **Audit:** Payment confirmations enforce creator≠confirmer segregation. Check transitions and manual movement writes create immutable audit rows. Ingestion runs stamp real source dates.

## 10. Operational picture

**Local development:**

```bash
docker compose --profile full up -d    # Postgres + Django + Astro
docker compose --profile db up -d      # Postgres only
python3 tests/test_docker_compose.py   # Structural compose validation
```

Backend dev server: Uvicorn with reload on port 8000. Frontend: `bun run dev` on port 4321 inside Compose. Migrations and seed commands run automatically on backend container start.

**Testing:**

- Backend: `uv run pytest` (live Cognito/Bedrock markers deselected by default).
- Frontend: `bun test` with browser/svelte conditions; `bun run check` and `bun run build` in CI.
- Harness: `tests/` auto-discovered structural tests (hooks, compose, guardians, merge gate).
- Smoke: `bun run test:smoke` only when `RUN_SMOKE=1` and run interactively by kodex user — never CI.

**Deployment:**

- PRs to `main` trigger `.github/workflows/ci.yml` (backend pytest, harness tests, frontend check/build/test).
- Push to `prod` triggers `.github/workflows/deploy-prod.yml`: test job, Docker build to ECR (`alvs/alvs-financial-gateway-backend`, `alvs/alvs-financial-gateway-frontend`), one-off migrate ECS task, rolling service update on `alvs-prod` cluster, region us-east-1.
- Project slug: `alvs-financial-gateway`. Prod host configured as `fg` stem on ALB (see `PROJECT_HOST` in deploy workflow).
- Hunt workflows (`hunt.yml`, `hunt-sweep.yml`, `hunt-reopen.yml`) automate issue triage in cloud sandboxes.

**Hardware constraints:** Fargate baseline 256 CPU / 512 MB per service. RDS `db.t4g.micro` single-AZ. No GPU. Bedrock inference via VPC interface endpoint to avoid NAT.

## 11. Open questions / unknowns

- **Scheduled ingestion:** EventBridge Scheduler → ECS RunTask shape is decided (`docs/INFRASTRUCTURE.md`) but not yet provisioned; no inventory row exists until created.
- **Exact prod runtime state:** ROADMAP places deploy (stage 6) as pending; README states permanent production deployment at the configured prod host — exact promotion cadence and live feature completeness beyond merged `main`/`prod` code not verified from tree alone.
- **Remaining stage-3 data-model work:** ROADMAP notes data-model and ingestion documentation track may still be open alongside active implementation.
- **`.docs/` vault:** Absent; all documentation lives in visible `docs/`.
- **HTMX fragment routes:** ADR-05 requires HTML fragment endpoints in API.md; current API table is JSON-heavy — any HTMX-specific fragment routes not exhaustively verified in this shallow scan.
- **Dev cloud environment:** Explicitly no staging; only local and prod cloud per ADR-23 and BD docs.
