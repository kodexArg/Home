---
id: "alvs-km-gw"
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router"
visibility: private
importance: high
source_repo: "alvs-km-gw"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags:
  - "alvs"
  - "km-gw"
  - "sharepoint"
  - "m365"
  - "django"
  - "drf"
  - "astro"
  - "svelte"
  - "aws"
  - "fargate"
  - "postgresql"
  - "cognito"
  - "bedrock"
  - "chatui"
  - "router"
  - "harness"
  - "private"
problems_solved:
  - "Grupo ALVS company information lives in Microsoft 365 and SharePoint estates that cannot be exposed directly to browsers — operators need an authenticated AWS tier with Django RBAC between M365 and the public web."
  - "Growing internal web surfaces need a conversational entry point that routes users safely without free-text LLM generation — a closed-menu router on Bedrock Nova Micro chooses among permission-filtered actions only."
  - "New ALVS web apps must ship on a harness whose documentation, ADRs, API contract, and agent skills cannot be bypassed — the repo vendors the full astro-drf-aws opinionated stack so features grow by addition, not by weakening foundations."
technologies:
  - "Astro 7 (SSR)"
  - "Svelte 5"
  - "Tailwind CSS 4"
  - "HTMX 2"
  - "Melt UI (headless primitives)"
  - "Django 6"
  - "Django REST Framework 3.17"
  - "Python 3.14"
  - "PostgreSQL 17"
  - "Uvicorn (ASGI)"
  - "AWS ECS Fargate"
  - "AWS Cognito (OIDC, Google federation)"
  - "AWS Bedrock (Nova Micro inference profile)"
  - "AWS Secrets Manager"
  - "Microsoft Graph (app-only client_credentials)"
  - "Bun (frontend package manager and runtime)"
  - "uv (Python toolchain)"
  - "Docker Compose (local orchestration)"
  - "GitHub Actions (CI and prod deploy)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ALVS km-gw

> **Problem thesis (required):** Grupo ALVS needs a knowledge-management web gateway (`km-gw`) that lets authenticated staff reach company information originating in Microsoft 365 and SharePoint without exposing those estates directly. This private repository is a production-oriented instance scaffolded from the `astro-drf-aws` template: an Astro 7 SSR frontend and a Django 6 + DRF backend on two AWS Fargate services, backed by PostgreSQL, gated by Cognito authentication and Django RBAC, with a ChatUI surface that is actually a security-conscious router (not a chatbot) and a vendored AI harness that enforces PRD, ADR, and API contracts on every change.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/alvs-km-gw` |
| Visibility | `private` |
| Default branch | `main` (integration); `prod` is the production promotion line |
| One-line pitch | ALVS knowledge-management gateway — SharePoint and M365 data through an authenticated Django API to an Astro SSR frontend, with a Bedrock-backed navigation router and an agent harness that cannot be left. |
| Audience | Grupo ALVS internal operators and admins; AI agents working through the project's harness; infrastructure operators deploying to shared ALVS AWS infrastructure in `us-east-1`. |

The deploy workflow sets `PROJECT_SLUG: alvs-km-gw`, identifying this instance on shared ALVS infrastructure. Much of the documentation and seed defaults still carry the template reference slug `astro-drf-aws` (compose fallbacks, guardian agent names, some secret ARNs frozen at provisioning time per issue #129) — the repo is a forked template instance whose runtime identity is `alvs-km-gw` while inheriting the template's harness naming.

## 2. Problems it solves

### P1 — SharePoint and M365 data must not reach browsers without an auth tier

- **Who hurts:** ALVS staff who need company information from Microsoft 365; IT security and compliance teams responsible for data egress; operators building dashboards and tools on top of SharePoint-sourced content.
- **Pain today:** Financial and operational data lives in SharePoint workbooks and the broader M365 estate. Serving that material directly to a browser would bypass authorization, leak source files, and offer no centralized RBAC or audit surface.
- **How this repo answers:** The PRD (`docs/PRD.md`) states the north star: connect SharePoint securely through AWS so company information reaches the web only through this authenticated tier under Django RBAC. A confidential Entra app registration acquires app-only Graph tokens via `client_credentials` using three declared env vars (`MSGRAPH_TENANT_ID`, `MSGRAPH_CLIENT_ID`, `MSGRAPH_CLIENT_SECRET`). Demo endpoints (`GET /api/m365/hello/`, `GET /api/m365/world/`) prove the Graph read path by fetching named workbook cells as plain text. Production expansion follows the same pattern: new domain apps and routes grow by addition while the harness stays fixed.
- **Out of scope:** Replacing SharePoint as a document system; anonymous public access; storing M365 credentials in the frontend (frontend tasks receive only `PUBLIC_*` non-secret variables).

### P2 — A growing web site needs a safe conversational router, not an open chatbot

- **Who hurts:** End users navigating a site that keeps gaining pages and actions; security reviewers worried about prompt injection and uncontrolled LLM output; operators in the `admins` or `ai_operators` Django groups who use the ChatUI.
- **Pain today:** A conventional chatbot that generates free text reintroduces ambiguity, injection risk, and un-auditable behavior. Users still want a chat-like box to express intent and be routed to the right place.
- **How this repo answers:** The ChatUI (`frontend/src/pages/chatui.astro`, documented in `docs/CHATBOT.md`) is a **router**, not a chatbot. `POST /api/router/route/` takes an utterance, builds a permission-filtered closed menu server-side, calls Amazon Nova Micro on Bedrock with JSON-schema-constrained decoding at temperature 0, and returns exactly one of four outcomes (`Action`, `Answer`, `Escalate`, `NO_MATCH`) — never free prose. The choosing tier never generates; a future generating tier (stage 2, not built) would be filtered through structured slot-filled templates. Every decision persists an `IntentQuery` audit row. Rate limits (`CooldownThrottle`, silent abuse block via `DatabaseCache`) return indistinguishable `429` responses. RBAC requires membership in `admins` or `ai_operators`.
- **Out of scope:** Open-ended conversational AI; local model servers; Redis-backed rate limiting (Redis is prohibited per `adr-06-cache`).

### P3 — New ALVS apps need a harness whose railguard cannot be bypassed

- **Who hurts:** Developers and AI agents adding features; maintainers who must keep docs, API contracts, and architecture rules aligned; operators running autonomous issue workflows.
- **Pain today:** Undocumented routes, env vars, and ad-hoc agent behavior cause drift, security gaps, and expensive rework when multiple contributors (human and AI) touch the same codebase.
- **How this repo answers:** The harness is the product's support structure (`docs/HARNESS.md`, `adr-14-harness`). Vendored skills under `.claude/skills/` (mirrored to `skills/`) cover Astro, Django, AWS, vault editing, orchestration, and triage-and-fix workflows. Hooks enforce the ABC gate (PRD? ADRs? API?), block undeclared `urls.py` routes and env reads, preload SSOTs at session start, and dispatch guardian subagents (`astro-drf-aws-prd`, `-adr`, `-api`) on watched surfaces. ADRs in `docs/adrs/` load as `.claude/rules/`. Development loop: idea → user-facing? → BDD → needs backend? → enter through `docs/API.md` only.
- **Out of scope:** Machine-global skill dependencies (everything required is vendored); teammate-style agent teams (standing decision: all agents are subagents).

## 3. Product / idea

The central mental model is **two Fargate containers behind one ALB host**: the Astro SSR service owns all browser-facing pages; the Django ASGI service owns `/api/*`, `/accounts/*`, `/admin/*`, and `/ws/*`. PostgreSQL holds users, sessions, router audit rows, and domain data. Cognito authenticates via OIDC (Google federated through the org pool); Django owns sessions and all RBAC via Groups and DRF permission classes.

The frontend delivers themed, localized-rendered pages (code and docs always English per `adr-01`) with variable-driven CSS custom properties (`docs/DESIGN-SYSTEM.md`). Users authenticate through `/accounts/login/` → Cognito → `/accounts/callback/`, then interact with profile theming (`/profile`), a component showcase (`/showcase/components`), and the ChatUI router (`/chatui`). HTMX sits in the interactivity ladder before Svelte islands for server-rendered fragments.

Infrastructure mirrors the SROA production precedent on shared ALVS AWS: ECS clusters `alvs-dev` / `alvs-prod`, ECR repos `alvs/<project>-backend` and `alvs/<project>-frontend`, Secrets Manager paths `alvs/<env>/<project>/<component>`, Cloud Map for SSR-to-backend internal calls, and a Bedrock VPC interface endpoint so Fargate tasks reach inference without NAT gateways.

### 3.1 North-star use cases

1. **Authenticated operator opens the site** — OIDC login via Google through Cognito, Django session established, `/api/me/` returns identity and groups, theme cookie set for flash-free SSR.
2. **Operator uses ChatUI to navigate** — types natural language, router returns a closed action (navigate/confirm) from the permission-filtered registry, audit row written, no generated prose.
3. **Backend reads M365/SharePoint** — app-only Graph token acquired, workbook cells or future ingestion endpoints serve data under Django auth, never exposing SharePoint URLs to unauthenticated clients.
4. **Developer or agent adds a feature** — checks PRD and ADRs, adds API row before code, writes BDD/TDD spec, passes harness hooks and guardian review, merges to `main`, promotes via `prod` branch deploy.

### 3.2 Non-goals

- Redis, ElastiCache, or any cache server (`adr-06-cache` prohibits Redis; `DatabaseCache` only).
- Cognito groups or custom claims as RBAC authority (`adr-10-auth` — Django Groups only).
- npm or Node as the frontend toolchain (`bun` mandatory).
- Staging environment tier (dev and prod only on this account).
- Free-text LLM generation in stage 1 of the ChatUI router (`adr-15-chatbot-two-tier`).
- NAT gateways (deliberate cost trade-off; public-subnet Fargate with documented accepted risk in `docs/INFRASTRUCTURE.md`).

## 4. Technology stack

Derived from manifests and docs; lockfiles not quoted.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.14, Bun (no Node/npm) | `backend/.python-version`, `backend/pyproject.toml`, `frontend/package.json`, `adr-02-initial-stack` |
| Frontend | Astro 7.0.7 SSR, Svelte 5.56, Tailwind 4.3, HTMX 2.0, Melt UI | `frontend/package.json`, `frontend/astro.config.mjs`, `docs/FRONTEND.md` |
| Backend / API | Django 6.0.7, DRF 3.17.1, async-first ASGI views, uvicorn 0.51 | `backend/pyproject.toml`, `docs/BACKEND.md`, `adr-16-async-mandatory` |
| Data | PostgreSQL 17 (RDS prod/dev, Compose locally) | `compose.yaml`, `docs/BD.md` |
| Infra / deploy | AWS ECS Fargate, ALB, ECR, Secrets Manager, Cloud Map, Bedrock VPC endpoint | `docs/INFRASTRUCTURE.md`, `.github/workflows/deploy-prod.yml` |
| AI / agents | Bedrock Nova Micro router; vendored `.claude/skills/`, hooks, guardians, `kdx-orchestrator`, `kdx-wf-triage-and-fix` | `docs/CHATBOT.md`, `docs/HARNESS.md`, `.claude/` |
| Auth | Cognito OIDC + Django session + PyJWT verification | `docs/AUTH.md`, `adr-10-auth` |
| M365 | MSAL + httpx for Graph app-only reads | `backend/pyproject.toml`, `adr-13-m365-graph` |
| Tests | pytest + pytest-django (backend); bun test (frontend); harness tests in `tests/` | `backend/pyproject.toml`, `frontend/package.json`, `.github/workflows/ci.yml` |

### 4.1 Notable dependencies (curated)

- `melt` — headless UI primitives underlying shadcn-svelte components (`docs/MELT-UI.md`).
- `drf-spectacular` — OpenAPI schema generation for DRF.
- `django-cors-headers` — split-origin session cookie bridge between Astro and Django.
- `whitenoise` — serves Django admin and DRF browsable API statics in-container.
- `boto3` — Bedrock inference for the router (wrapped in `sync_to_async`, not `aiobotocore`).
- `msal` — Entra token acquisition for Microsoft Graph.
- `@astrojs/node` — Node adapter for Astro SSR in the Fargate container (Bun runs the built server).

## 5. Repository map (abstraction)

**Entrypoints**

- `backend/manage.py` — Django management CLI.
- `backend/config/asgi.py` — ASGI application served by uvicorn on port 8000.
- `frontend/src/pages/` — Astro routes: `index.astro`, `profile.astro`, `chatui.astro`, `showcase/components.astro`, `healthz.ts`.
- `compose.yaml` — local Docker orchestrator (profiles: `db`, `backend`, `frontend`, `full`).

**Domain / core (backend apps under `backend/apps/`)**

- `users` — custom user model keyed on Cognito `sub`, OIDC auth views, `/api/me/`, RBAC probe `/api/restricted/`.
- `router` — ChatUI choosing tier: `Intent`, `IntentQuery` models, `POST /api/router/route/`.
- `m365` — Microsoft Graph demo reads (`/api/m365/hello/`, `/api/m365/world/`).
- `health` — `GET /api/health/` liveness for ALB.

**Adapters**

- `backend/config/settings.py` — env-driven settings (structure only; names in `docs/VARIABLES.md`).
- `backend/config/urls.py` — root URL mount points.
- `frontend/src/lib/router-client.ts` — browser client for the router API.
- `frontend/src/middleware.ts` — default `Cache-Control: no-store` backstop.
- `scripts/mvmcp.py` — self-bootstrapping launcher for the vendored `markdown-vault-docs` MCP server.

**Docs vaults**

- `docs/` — Obsidian-flavored SSOT vault: PRD, API, VARIABLES, ADRs (`docs/adrs/`), BDDs (`docs/bdds/`), TDDs (`docs/tdds/`), infrastructure, auth, chatbot, harness, codemap.
- `.docs/` — **not present** in this repository (scanned; path does not exist).

**Agent scaffolding**

- `.claude/skills/` — vendored kdx skills (astro, django, aws-*, orchestrator, triage, live-doc, markdown-vault, wf-triage-and-fix).
- `.claude/hooks/` — enforcement: `load_ssot.py`, `check_api.py`, `check_variables.py`, `check_adr.py`, `dispatch_guardians.py`, `graph_first.py`, `require_api_read.py`, `require_pr_flow.py`, and others.
- `.claude/rules/` — symlinks to ADR files (loaded as agent rules).
- `.claude/agents/` and `agents/` — guardian (`astro-drf-aws-*`) and orchestrator (`orch-*`) and workflow (`wf-*`) agent definitions.
- `.claude/workflows/triage-and-fix.js` — deterministic issue-processing workflow.
- `AGENTS.md` / `CLAUDE.md` — trusted index for agents.
- `DANGER-README-FIRST.md` — append-only register of autonomous agent decisions and guardrails.

**Generated / vendor (existence only; contents not ingested)**

- `frontend/bun.lock`, `backend/uv.lock` — lockfiles.
- `node_modules/`, `.venv/`, `.astro/`, `dist/` — gitignored build and install trees.
- `.mvmcp/` — gitignored MCP venv, index, and embeddings for markdown-vault-docs.

**CI / deploy**

- `.github/workflows/ci.yml` — PR checks: backend pytest, harness tests, frontend check/test.
- `.github/workflows/deploy-prod.yml` — push to `prod` branch: test, build, push ECR, deploy Fargate services with `PROJECT_SLUG: alvs-km-gw`.

## 6. Configuration & contracts (no secrets)

Environment variable names and purposes are owned by `docs/VARIABLES.md`. Secret **values** live in AWS Secrets Manager (`alvs/<env>/<project>/<component>`) or local gitignored `.env` for development only.

**Shared identity**

- `PROJECT_SLUG` — AWS resource naming; deploy workflow sets `alvs-km-gw`.
- `BASE_DOMAIN` — host suffix for ALB routing (declared in VARIABLES; not repeated here).

**Backend (representative)**

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` — PostgreSQL connection.
- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` — Django core.
- `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `COGNITO_CLIENT_SECRET`, `COGNITO_DOMAIN`, `COGNITO_REGION` — OIDC auth.
- `AUTH_DEV_MODE`, `AUTH_BOOTSTRAP_ALLOWLIST` — local dev login and first-login group grants.
- `MSGRAPH_TENANT_ID`, `MSGRAPH_CLIENT_ID`, `MSGRAPH_CLIENT_SECRET` — Entra app-only Graph.
- `ROUTER_ENABLED`, `ROUTER_BEDROCK_MODEL_ID`, `ROUTER_AUDIT_RETENTION_DAYS`, `ROUTER_RATE_*`, `THROTTLE_COOLDOWN_SECONDS` — ChatUI router behavior.
- `BEDROCK_REGION`, `UVICORN_WORKERS` — inference region and ASGI worker count.

**Frontend (all non-secret)**

- `PUBLIC_SITE_URL`, `PUBLIC_API_URL`, `PUBLIC_BACKEND_URL`, `BACKEND_API_URL`, `PUBLIC_PROJECT_SLUG`, `PORT`, `HOST`, `NODE_ENV`.

**Local Compose only**

- `DB_PUBLISH_PORT`, `BACKEND_PUBLISH_PORT`, `FRONTEND_PUBLISH_PORT` — host port publishing.

`.env.example` at repo root seeds local development names with placeholder values (no production secrets).

### 6.1 HTTP / API endpoints

Backend endpoints are declared in `docs/API.md`; an undeclared route in code is a defect enforced by `hooks/check_api.py`.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/health/` | Liveness probe for ALB target group | none |
| `GET` | `/accounts/login/` | Starts OIDC redirect to Google via Cognito | none |
| `GET` | `/accounts/callback/` | OIDC callback; verifies token, opens Django session | none |
| `POST` | `/accounts/logout/` | Flushes session and Cognito logout | session (CSRF) |
| `GET` | `/accounts/dev-login/` | DEBUG-only dev login (absent in production images) | none |
| `GET` | `/api/me/` | Current session user identity and groups | session |
| `PATCH` | `/api/me/` | Partial update of nickname, avatar_visible, theme_config | session |
| `GET` | `/api/restricted/` | RBAC probe for `admins` group membership | session; `IsInAdminsGroup` |
| `GET` | `/api/m365/hello/` | App-only Graph read of workbook cell A1 (`Hello`) | none (`AllowAny` demo) |
| `GET` | `/api/m365/world/` | App-only Graph read of workbook cell C3 (`World`) | none (`AllowAny` demo) |
| `POST` | `/api/router/route/` | ChatUI router choosing tier; closed enum outcomes only | session; `CanUseRouter` (`admins` or `ai_operators`) |
| `GET` | `/admin/` | Django admin mount | session; `is_staff` |

**Frontend (Astro SSR pages, not in API.md)**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home page with corner-nav triangle | unknown — page-level |
| `GET` | `/profile` | User profile and theme configuration | session expected |
| `GET` | `/chatui` | ChatUI router surface | session + router RBAC for API calls |
| `GET` | `/showcase/components` | Design-system component gallery | unknown |
| `GET` | `/healthz` | Frontend container health check | none |

ALB path rules route `/api/*`, `/accounts/*`, `/admin/*`, `/ws/*`, `/static/*`, `/media/*` to the backend target group; all other paths on the project host go to the frontend.

### 6.2 Other interfaces

- **CLI:** `uv run python manage.py` (Django commands), `bun run dev|build|test|check` (frontend), `docker compose --profile <profile> up` (local stack), `python3 tests/test_docker_compose.py` (compose layout verification).
- **MCP:** `markdown-vault-docs` server via `.mcp.json` and `scripts/mvmcp.py` — searchable `docs/` vault with backlinks (first source of truth for documentation queries per `adr-18`).
- **Harness workflow:** `triage-and-fix` JavaScript workflow (`.claude/workflows/triage-and-fix.js`) driving `wf-*` agent cast for autonomous issue processing.
- **Management commands:** `bootstrap_admin`, `seed_demo_operator`, `createcachetable`, `purge_router_audit` (referenced in compose and docs).

## 7. Data & persistence

**Stores**

- **PostgreSQL 17** — primary application database. Production: RDS in isolated subnets (`docs/BD.md`). Local: Compose `db` service or native Postgres.
- **Django `DatabaseCache`** — router rate-abuse block state and general cache table (no Redis).
- **AWS S3** — private media bucket per project (presigned URLs; no CDN).
- **AWS Secrets Manager** — all secret values for cloud deploys.

**Notable entities (from apps and docs)**

- Custom `User` — keyed on immutable Cognito `sub`; mirrors standard OIDC profile attributes; stores `theme_config` JSON blob.
- Django `Group` — RBAC authority (`admins`, `ai_operators`, and project-specific groups).
- `Intent` — registry row for router menu options (phrases, targets, kinds).
- `IntentQuery` — per-call audit log of router decisions, throttles, and faults.
- `AccessRequest` — authorization lobby for users awaiting group assignment (`adr-20-authorization-lobby`).

**Topology:** Cloud runs two Fargate tasks (frontend + backend) in public subnets with public IPs (no NAT), RDS in isolated subnets, SSR-to-backend via Cloud Map private DNS. Local dev splits frontend (:4321) and backend (:8000) with same-site cookie semantics for localhost. Bedrock inference in cloud uses a VPC interface endpoint; local dev calls Bedrock over standard AWS API paths with developer IAM credentials.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **Root README and onboarding** — `README.md`, `ONBOARDING.md`, `AGENTS.md`, `DANGER-README-FIRST.md`, `CHANGELOG.md`.
2. **`docs/` vault** — `docs/PRD.md`, `docs/API.md`, `docs/VARIABLES.md`, `docs/INFRASTRUCTURE.md`, `docs/AUTH.md`, `docs/CHATBOT.md`, `docs/HARNESS.md`, `docs/BACKEND.md`, `docs/FRONTEND.md`, `docs/BD.md`, `docs/REQUIREMENTS.md`, plus ADR index under `docs/adrs/` (24 ADRs, `adr-00` through `adr-23`).
3. **BDD/TDD specs** — `docs/bdds/` (user-facing behavior specs including chatui, profile, theming, authorization lobby, router abuse guard) and `docs/tdds/` (backend technical design docs for theme config, access request, Bedrock inference, router abuse guard).
4. **`.claude/` agent tree** — skills inventory per `docs/HARNESS.md`; hooks in `.claude/settings.json` (SessionStart SSOT preload, PostToolUse API/ADR/variable checks, guardian dispatch, graph-first nudge); guardian agents `astro-drf-aws-prd/adr/api`; orchestrator `orch-*` workers; workflow cast `wf-hunter` through `wf-bard` etc.; `kdx-wf-triage-and-fix` skill with `validate.mjs` gate.
5. **`.docs/`** — scanned; directory does not exist in this repo.

**Harness conventions agents must follow**

- ABC gate before any change: PRD compliance, ADR compliance, API modification protocol.
- `docs/PRD.md` and `docs/API.md` held in memory at all times (main session preloaded; subagents read explicitly).
- Documentation queries go through `markdown-vault-docs` MCP first; code structure through `codebase-memory-mcp` when available.
- ADRs state rules only; facts live in linked `docs/` files (`adr-00-adr-doctrine`).
- Git: feature branches → PR to `main`; production is `prod` branch only; direct push to protected branches restricted to `kodexArg` owner.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository. This summary describes architecture without offering clone URLs as product links. Related public repo ids remain empty in frontmatter.
- **Auth model:** Cognito OIDC (Google federation) authenticates; Django DB-backed sessions authorize. RBAC is exclusively Django Groups + DRF permissions — never Cognito claims. Admin login is a named exception for bootstrap superuser only.
- **Router security:** Closed enum outputs only; hard reject on out-of-menu model responses; permission-filtered menu built before inference; audit trail on every call; kill switch via `ROUTER_ENABLED`; silent rate-abuse blocking.
- **Secrets:** No secret values in this file. Production secrets in AWS Secrets Manager only. Frontend receives zero secrets. `.env` is gitignored.
- **Network:** Fargate tasks run in public subnets with documented accepted risk (no NAT). RDS never publicly reachable. Bedrock accessed via private VPC endpoint in cloud.
- **Cache discipline:** Authenticated responses `no-store` by default. No Redis.

## 10. Operational picture

**Local development**

```bash
cp .env.example .env
docker compose --profile db up -d          # Postgres only
docker compose --profile backend up -d     # Django + Postgres
docker compose --profile full up -d        # frontend + backend + db
python3 tests/test_docker_compose.py
python3 tests/test_docker_compose.py --smoke   # smoke: kodex Unix user only per AGENTS.md
```

Backend hot-reloads via watchfiles + uvicorn; frontend via `bun run dev`. `AUTH_DEV_MODE=true` enables `/accounts/dev-login/` when `DEBUG=true`.

**CI**

- `ci` workflow on PRs to `main`: backend pytest (excluding `cognito_live` and `bedrock_live` markers), harness structure tests, frontend `bun run check` and `bun test` when `frontend/package.json` exists.

**Deploy**

- `deploy-prod` workflow on push to `prod`: run tests, build Docker images, push to ECR `alvs/alvs-km-gw-backend` and `alvs/alvs-km-gw-frontend`, deploy to ECS cluster `alvs-prod` with OIDC role `gha-deploy-prod`. Migrate task runs before service rollout. Image tags: `prod-<full-git-sha>` (no `latest`).

**Hardware constraints:** None specific (cloud Fargate; local dev is standard x86_64/arm64 with Docker). Smoke tests require interactive `kodex` user session with Chrome DevTools MCP — not runnable in headless agent sandboxes.

## 11. Open questions / unknowns

- **Template vs instance naming drift:** Deploy uses `PROJECT_SLUG: alvs-km-gw` but many docs, guardian names, secret ARNs, and seed defaults still reference `astro-drf-aws`. Whether secret ARNs in `deploy-prod.yml` will be re-provisioned for `alvs-km-gw` or remain on the template paths is unclear from the tree alone (issue #129 documents opaque ARN exception).
- **Production hostnames:** Expected hosts follow `<project>[.dev].<base_domain>` pattern per INFRASTRUCTURE doc; exact live DNS for `alvs-km-gw` not confirmed in manifests read.
- **SharePoint ingestion beyond demo:** M365 endpoints currently read two demo cells; full SharePoint-to-PostgreSQL ingestion pipelines described in PRD horizon are not yet evident as implemented API rows beyond the demo reads.
- **ChatUI stage 2:** Generating tier behind the router is explicitly future work (`docs/CHATBOT.md`); no code present.
- **`.docs/` vault:** Directory absent; all documentation lives in `docs/` only.
- **Ephemeral reference run state:** `docs/INVENTORY.md` tracks provisioned resources for the template reference deploy; whether `alvs-km-gw` has its own inventory or shares template resources unknown without live AWS inspection (harness test `tests/test_aws_infra.py` is excluded from CI per `adr-12-ephemeral-run`).
