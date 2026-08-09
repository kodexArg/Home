---
id: "astro-drf-aws"
title: "astro-drf-aws — Astro SSR + Django DRF template on AWS Fargate"
visibility: public
importance: high
source_repo: "astro-drf-aws"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "template"
status: "active"
related: []
tags:
  - "astro"
  - "svelte"
  - "django"
  - "drf"
  - "aws"
  - "fargate"
  - "postgresql"
  - "cognito"
  - "bedrock"
  - "htmx"
  - "tailwind"
  - "harness"
  - "agent-scaffolding"
  - "sharepoint"
  - "chatbot"
  - "template"
problems_solved:
  - "Teams need a repeatable, opinionated full-stack template that deploys Astro SSR + Django/DRF as two Fargate services with RDS Postgres, OIDC auth, and Bedrock AI — without re-inventing infrastructure, documentation discipline, or agent harness conventions on every new app."
  - "Company data in Microsoft 365 / SharePoint must reach authenticated web surfaces only through a controlled tier with Django RBAC — never via direct anonymous exposure or Cognito-claim-based authorization."
  - "Conversational UI features need a safe-by-design router that chooses from a closed, permission-filtered menu (zero free-text generation) plus a separate generating tier for page-context answers — avoiding prompt-injection and actuator abuse from day one."
technologies:
  - "Astro 7 (SSR, Node adapter)"
  - "Svelte 5"
  - "Tailwind CSS 4"
  - "Melt UI / shadcn-svelte"
  - "HTMX 2"
  - "Django 6 + DRF"
  - "Python 3.14 / uv"
  - "PostgreSQL 17"
  - "AWS ECS Fargate"
  - "AWS Cognito (OIDC)"
  - "Amazon Bedrock (Nova Micro)"
  - "Microsoft Graph (app-only)"
  - "Docker Compose (local)"
  - "GitHub Actions (CI + prod deploy)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# astro-drf-aws

> **Problem thesis (required):** This repository is a production-grade **template** whose primary deliverable is a working deploy — not a one-off app. It solves three intertwined pains: (1) bootstrapping a two-service AWS stack (Astro SSR frontend + Django/DRF backend on Fargate, RDS Postgres, ALB routing, Secrets Manager) without ad-hoc infra decisions; (2) bridging SharePoint / M365 data to the web through an authenticated, RBAC-governed tier; and (3) shipping a **harness-first** development culture — live docs, ADRs, guardian agents, enforcement hooks, and vendored skills — so new capabilities grow by addition without eroding foundations. The harness is the product; application code follows it.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/astro-drf-aws` |
| Visibility | `public` |
| Default branch | `main` (integration); `prod` is the production deploy branch |
| One-line pitch | Astro 7 SSR + Svelte frontend and Django 6 + DRF backend template — two Fargate services on AWS, with OIDC auth, Bedrock router/assistant, M365 Graph integration, and an agent harness that enforces API-first, TDD/BDD discipline. |
| Audience | kodexArg operators and agents building ALVS-family web apps; backend/frontend engineers adopting the stack; AI agents entering through `AGENTS.md` / `CLAUDE.md`; reviewers of PRD, API, and ADR surfaces via guardian subagents. |

## 2. Problems it solves

### P1 — Repeatable full-stack AWS template without reinventing conventions

- **Who hurts:** Teams spinning up new internal web apps that need SSR frontend, REST API, Postgres, OIDC login, and Fargate deploy — but lack a single repo that encodes ALVS account conventions (shared ALB, Cloud Map service discovery, no NAT gateway cost trade-off, ECR tagging, Secrets Manager naming).
- **Pain today:** Each greenfield project re-decides folder layout, env var inventory, CI gates, Docker profiles, and deploy workflow — producing drift, secret mishandling, and routes that exist in code but not in documentation.
- **How this repo answers:** Ships canonical `backend/` and `frontend/` trees, root `compose.yaml` with `db` / `backend` / `frontend` / `full` profiles, `docs/constitution/INFRASTRUCTURE.md` mirroring the SROA production precedent, `.github/workflows/ci.yml` (PR) and `deploy-prod.yml` (push to `prod`), and SSOT files `docs/API.md` + `docs/VARIABLES.md` enforced by PostToolUse hooks. Clone → configure env names → deploy.
- **Out of scope:** Multi-tenant SaaS boilerplate; staging environments (dev + prod only); managed Kubernetes; serverless-only architectures.

### P2 — Secure SharePoint-to-web bridge with Django RBAC

- **Who hurts:** Organizations whose authoritative data lives in Microsoft 365 / SharePoint and need dashboards or tools on the public web without bypassing identity or mixing authorization into the IdP.
- **Pain today:** Direct SharePoint embeds, anonymous links, or Cognito custom claims used as roles create audit gaps and permission bugs; federated IdP attributes (e.g. avatar `picture`) are inconsistently available on ID tokens.
- **How this repo answers:** Cognito authenticates via OIDC authorization code (Google federated through the pool); Django owns all RBAC via Groups + DRF permission classes — Cognito groups and claim-as-role are explicitly banned (`docs/AUTH.md`, `adr-14-auth`). M365 access uses app-only Graph `client_credentials` (`apps/m365/`, `MSGRAPH_*` vars). The PRD horizon: new apps flourish on the same harness, each moving SharePoint-sourced information to the web under RBAC.
- **Out of scope:** Replacing SharePoint as system of record; user-delegated Graph flows (template standard is app-only for the demo endpoints); per-tenant white-labeling in code.

### P3 — Safe conversational UI (router vs assistant split)

- **Who hurts:** Product owners wanting chat-like navigation without opening prompt-injection, unbounded LLM prose, or actuator abuse on the choosing path.
- **Pain today:** Monolithic chatbots mix intent classification with free-text generation, making security arguments expensive; menus hardcoded in prompts drift from actual permissions.
- **How this repo answers:** Two-tier architecture (`docs/CHATBOT.md`, `adr-17-chatbot-two-tier`, `adr-25-page-context-assistant`): **router** (`POST /api/router/route/`) — Nova Micro on Bedrock, JSON-schema constrained enum, temperature 0, server-built permission-filtered menu, four closed outcomes, audit rows; **assistant** (`POST /api/assistant/ask/`) — page-context free-text answers with registry-validated links only, no actuators. Kill switches `ROUTER_ENABLED` / `ASSISTANT_ENABLED`; rate-abuse guard via DatabaseCache (no Redis).
- **Out of scope:** The future router-mediated generating path (designed as possible, not shipped); multi-turn conversation memory; arbitrary tool-calling agents.

## 3. Product / idea

The central mental model is **two Docker services on Fargate** — frontend (Astro SSR on port 4321, bun runtime) and backend (Django ASGI on port 8000, uvicorn workers) — fronted by a **shared per-environment ALB** that path-splits `/api/*`, `/accounts/*`, `/admin/*`, `/static/*`, `/media/*`, `/ws/*` to the backend and everything else to the frontend. SSR fetches the backend via **Cloud Map private DNS** (`backend.<project>-<env>.local:8000`), never through the public ALB. PostgreSQL 17 on RDS holds Django models, sessions, and cache tables. Secrets live in AWS Secrets Manager (`alvs/<env>/<project>/<component>`); the frontend receives only `PUBLIC_*` plain env vars.

Above the runtime sits the **harness**: an Obsidian-flavored `docs/` vault (wikilinks, ADRs, BDD/TDD specs), vendored skills under `docs/skills/`, guardian subagents (`astro-drf-aws-prd`, `-adr`, `-api`), nine Claude lifecycle hooks under `.claude/hooks/`, and a `triage-and-fix` workflow cast (`wf-*` agents). Agents must hold `docs/constitution/PRD.md` and `docs/API.md` in memory at all times; the ABC gate (PRD → constitution → ADRs → API) governs every change.

All three construction stages are **complete** per `README.md` and `AGENTS.md`: documents & harness structure, harness construction (skills, hooks, guardians), and project construction (backend through TDD, frontend, deploy pipeline, ephemeral reference run).

### 3.1 North-star use cases

1. **Clone and run locally:** `docker compose --profile full up -d` — Postgres, Django with hot reload, Astro dev server; dev login at `/accounts/dev-login/` when `DEBUG` + `AUTH_DEV_MODE`; smoke via `tests/test_docker_compose.py` or `start-dev-server` skill + chrome-devtools MCP (kodex user only).
2. **Add a backend feature:** Row in `docs/API.md` → TDD in `docs/tdds/` → models/views → guardian `astro-drf-aws-api` review → pytest green → PR to `main`.
3. **Add a user-facing feature:** BDD in `docs/bdds/` → frontend work via `kdx-astro-7` skill → showcase-ready Svelte components (`adr-23`) → browser verification.
4. **Deploy to production:** Merge to `prod` branch → `deploy-prod.yml` runs backend/frontend tests, builds ECR images tagged `<env>-<full-git-sha>`, runs migrate task, updates ECS services.
5. **Operate the chat router:** Authenticated `admins` or `ai_operators` POST utterances; router returns navigate/confirm/escalate/NO_MATCH; assistant answers with page-scoped context on `/`, `/chatui/`, `/showcase/components/`, `/profile/`.

### 3.2 Non-goals

- Redis / ElastiCache — prohibited; cache uses PostgreSQL `DatabaseCache` (`docs/CACHE.md`, `adr-10-cache`).
- npm / Node as frontend toolchain — bun is mandatory runtime and package manager.
- Cognito groups or custom claims for authorization.
- NAT gateways in VPC — accepted cost trade-off; public-subnet Fargate tasks documented as accepted risk (`docs/constitution/INFRASTRUCTURE.md`).
- Staging environment tier — dev and prod only.
- CDN for static/media in this template — WhiteNoise for admin statics; S3 presigned URLs for media.

## 4. Technology stack

Derived from `backend/pyproject.toml`, `frontend/package.json`, `docs/constitution/REQUIREMENTS.md`, `compose.yaml`, and constitution docs.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.14.6, bun (latest stable) | `backend/.python-version`, `backend/pyproject.toml`, `docs/constitution/REQUIREMENTS.md` |
| Frontend | Astro 7.0.7 SSR, Svelte 5.56.4, Tailwind 4.3.2, HTMX 2.0.10, Melt ^0.44 | `frontend/package.json`, `frontend/astro.config.mjs` |
| Backend / API | Django 6.0.7, DRF 3.17.1, uvicorn 0.51.0 ASGI, drf-spectacular | `backend/pyproject.toml`, `backend/config/urls.py` |
| Data | PostgreSQL 17.9 (RDS + local Compose) | `compose.yaml`, `docs/BD.md` |
| Auth | AWS Cognito OIDC + Django sessions; PyJWT for token verify | `docs/AUTH.md`, `backend/apps/users/` |
| AI | Amazon Bedrock Nova Micro (`us.amazon.nova-micro-v1:0` inference profile) | `docs/CHATBOT.md`, `backend/apps/router/`, `backend/apps/assistant/` |
| M365 | MSAL + httpx app-only Graph | `backend/apps/m365/`, `adr-16-m365-graph` |
| Infra / deploy | ECS Fargate, ECR, ALB, Cloud Map, Secrets Manager, Bedrock VPC endpoint | `docs/constitution/INFRASTRUCTURE.md`, `.github/workflows/deploy-prod.yml` |
| AI / agents | Vendored skills, guardian subagents, markdown-vault MCP, codebase-memory MCP (local) | `docs/constitution/HARNESS.md`, `.claude/settings.json`, `scripts/mvmcp.py` |
| Tests | pytest + pytest-django (backend); bun test + happy-dom (frontend); harness tests in `tests/` | `backend/pyproject.toml`, `frontend/package.json`, `.github/workflows/ci.yml` |

### 4.1 Notable dependencies (curated)

- `melt` — headless UI primitives under shadcn-svelte components (`docs/MELT-UI.md`).
- `htmx.org` — hypermedia fragments from Django before reaching for Svelte interactivity (`docs/HTMX.md`).
- `msal` + `httpx` — Entra app-only token + Graph REST for SharePoint workbook demo cells.
- `boto3` — Bedrock `InvokeModel` wrapped in `sync_to_async` for router/assistant (`adr-18-async-mandatory`).
- `whitenoise` — in-process static serving for Django admin (no CDN).
- `drf-spectacular` — OpenAPI schema generation aligned with `docs/API.md` contract.
- `@astrojs/node` — standalone SSR adapter executed under bun, not Node.

## 5. Repository map (abstraction)

Describe zones, not every file:

- **Entrypoints:** `backend/manage.py`, `backend/config/asgi.py`, `frontend/src/pages/` (Astro routes), `frontend/src/middleware.ts`, root `compose.yaml`.
- **Domain / core:** `backend/apps/users/` (identity, profile, theme_config), `backend/apps/router/` (IntentQuery, choosing tier), `backend/apps/assistant/` (AssistantQuery, generating tier), `backend/apps/health/`, `backend/apps/m365/`.
- **Adapters:** `backend/config/settings.py` (env + secrets wiring), `backend/config/middleware.py`, `frontend/src/lib/router-client.ts`, `frontend/src/lib/theme.ts`.
- **Frontend UI:** `frontend/src/lib/components/ui/` (shadcn-svelte), `frontend/src/lib/components/views/` (page views), `frontend/src/lib/components/shell/` (nav FSM, layout).
- **Docs vaults:** `docs/` — constitution (`docs/constitution/`), ADRs (`docs/adrs/`, 28+ records), BDDs (`docs/bdds/`), TDDs (`docs/tdds/`), assertions (`docs/assertions/`), agent definitions (`docs/agents/`).
- **Agent scaffolding:** `.claude/` — `settings.json` (hook wiring), `hooks/` (nine enforcement scripts), symlinks `agents` → `docs/agents`, `rules` → `docs/adrs`, `skills` → `docs/skills`; `.claude/kdx-park.json` (issue draft park routing). No `.docs/` directory present; all hidden docs live under `docs/`.
- **Harness scripts:** `scripts/mvmcp.py` (markdown-vault MCP launcher), `scripts/check_harness_integrity.py`, `scripts/strip_comments.py`, `scripts/cloud_setup.sh`, `scripts/provision_bedrock_endpoint.sh`.
- **CI/CD:** `.github/workflows/ci.yml`, `.github/workflows/deploy-prod.yml`, `.github/ISSUE_TEMPLATE/`.
- **Harness tests:** `tests/` — compose layout, hook behavior, AWS infra shape, guardian identity, live-doc linker, project slug hardcode guard.
- **Generated / vendor:** `frontend/bun.lock`, `backend/uv.lock` (signal only); `docs/CODEMAP.md` (generated doc→code index); `state/` (tracked runtime reference root, gitignored contents).

## 6. Configuration & contracts (no secrets)

### Environment variables

All names declared in `docs/VARIABLES.md` — undeclared env reads are hook-blocked. Secrets always in AWS Secrets Manager in cloud; local `.env` (gitignored) mirrors names only.

**Shared identity:** `PROJECT_SLUG`, `BASE_DOMAIN`.

**Backend (selected):** `DB_*`, `SECRET_KEY`, `ALLOWED_HOSTS`, `DEBUG`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `COGNITO_*`, `MSGRAPH_*`, `AUTH_DEV_MODE`, `LOGIN_REDIRECT_URL`, `LOGOUT_REDIRECT_URL`, `ROUTER_*`, `ASSISTANT_*`, `THROTTLE_COOLDOWN_SECONDS`, `UVICORN_WORKERS`, `AUTH_BOOTSTRAP_ALLOWLIST`, `DJANGO_SUPERUSER_*`, `BEDROCK_REGION`, `AWS_STORAGE_BUCKET_NAME`.

**Frontend (all non-secret):** `PUBLIC_API_URL`, `PUBLIC_BACKEND_URL`, `PUBLIC_SITE_URL`, `PUBLIC_PROJECT_SLUG`, `BACKEND_API_URL` (SSR server-side).

Compose defaults in `compose.yaml` use dev-safe literals for local Postgres; production values come from Secrets Manager JSON blobs per component (`db`, `django`, `cognito`, `msgraph`, `s3`).

### Feature flags / settings

- `config/settings.py` — Django apps, middleware, CORS, cache backend (`DatabaseCache`), REST framework, spectacular, auth backends, throttle classes.
- `ROUTER_ENABLED` / `ASSISTANT_ENABLED` — kill switches before inference.
- `AUTH_DEV_MODE` + `DEBUG` — gate dev-login; deploy checks `users.E001`/`E002` fatal if set in production context.

### 6.1 HTTP / API endpoints

Authoritative table: `docs/API.md`. Backend mounts under `backend/config/urls.py`.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/health/` | Liveness probe for ALB | none |
| `GET` | `/accounts/login/` | OIDC redirect kickoff (Google via Cognito) | none |
| `GET` | `/accounts/callback/` | OIDC code exchange, session open | none |
| `POST` | `/accounts/logout/` | Session flush + Cognito logout | session, CSRF |
| `GET` | `/accounts/dev-login/` | DEBUG-only dev login | none (absent in prod) |
| `GET` | `/api/me/` | Current user + groups + theme_config | session |
| `PATCH` | `/api/me/` | Profile/theme partial update | session |
| `GET` | `/api/restricted/` | RBAC probe (`admins` group) | session; `IsInAdminsGroup` |
| `GET` | `/api/m365/hello/` | Graph read cell A1 → plain text | none (`AllowAny` demo) |
| `GET` | `/api/m365/world/` | Graph read cell C3 → plain text | none (`AllowAny` demo) |
| `POST` | `/api/router/route/` | Chatbot choosing tier (closed enum) | session; `CanUseRouter` |
| `POST` | `/api/assistant/ask/` | Page-context generating tier | session; `CanUseAssistant` |
| `GET` | `/admin/` | Django admin mount | session; `is_staff` |

**Frontend HTTP (Astro):** `GET /healthz` (`frontend/src/pages/healthz.ts`) — container health; pages `/`, `/chatui/`, `/profile/`, `/showcase/components/` — SSR routes, not listed in `docs/API.md` (ALB catch-all to frontend TG).

### 6.2 Other interfaces

- **CLI:** `uv run python manage.py` (migrate, bootstrap_admin, seed_demo_operator, purge_router_audit, purge_assistant_audit).
- **MCP:** `markdown-vault-docs` (docs graph search/read/backlinks via `scripts/mvmcp.py`); `codebase-memory-mcp` (code graph, local machine).
- **Hooks (Claude):** SessionStart (`load_ssot`, `graph_freshness`, `mvmcp_freshness`); PreToolUse (`graph_first`, `require_pr_flow`); UserPromptSubmit (`require_api_read`); PostToolUse (`check_adr`, `check_api`, `check_variables`, `dispatch_guardians`).
- **Guardian subagents:** `astro-drf-aws-prd`, `astro-drf-aws-adr`, `astro-drf-aws-api` — gate SSOT edits.
- **Workflow:** `triage-and-fix` — issue-to-PR pipeline via `wf-*` cast (`docs/agents/wf-*.md`).

## 7. Data & persistence

- **PostgreSQL 17** — sole durable store: Django models (custom user keyed on Cognito `sub`), sessions, `DatabaseCache` tables, `IntentQuery` / `AssistantQuery` audit tables, router rate-abuse block state.
- **S3** — private media bucket in cloud (`AWS_STORAGE_BUCKET_NAME`); presigned URLs, no CDN.
- **No Redis** — explicit prohibition; all cache layers use Postgres or in-process patterns.
- **Topology:** Local Compose Postgres volume `pgdata`; cloud RDS in isolated subnets per env; Fargate tasks in public subnets (no NAT); Bedrock via VPC interface endpoint in public subnets for private DNS resolution.

**Notable entities (by name):** User (with `theme_config`, `nickname`, `chat_drawer_enabled`), Django Groups (`admins`, `ai_operators`, …), `Intent` / `IntentQuery`, `AssistantQuery`, `AccessRequest` (authorization lobby).

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **Root README** — template status, branch model (`main` integration, `prod` production), Compose profiles, three-stage completion claim.
2. **`AGENTS.md` / `CLAUDE.md`** — agent entry index, ABC gate, development loop, testing policy (chrome-devtools MCP, kodex-only smoke), structure map.
3. **`ONBOARDING.md`** — human onboarding: PRD+API always in memory, skill inventory, surprising doctrines (no Redis, Cognito auth-only, bun not npm).
4. **`docs/constitution/PRD.md`** — objective: SharePoint-to-web, ChatUI growth, harness solidity.
5. **`docs/constitution/INFRASTRUCTURE.md`** — Fargate/ALB/ECR/Cloud Map/Secrets/Bedrock endpoint layout.
6. **`docs/constitution/HARNESS.md`** — vendored skills table, MCP servers, guardian/orch/wf agents, SessionStart subagent caveat.
7. **`docs/constitution/REQUIREMENTS.md`** — version pins for Python, Django, Astro, bun, Postgres.
8. **`docs/API.md`** — full endpoint SSOT with contracts.
9. **`docs/VARIABLES.md`** — env var SSOT (names and purposes only).
10. **`docs/AUTH.md`**, **`docs/CHATBOT.md`**, **`docs/DOCKER.md`** — auth flow, two-tier AI, local Docker doctrine.
11. **`docs/adrs/`** — 28+ architecture decision records (stack, harness, auth, cache, HTMX, chatbot, M365, live-doc, nav FSM, etc.).
12. **`.claude/settings.json`** — hook lifecycle wiring to `.claude/hooks/*.py`.
13. **`DANGER-README-FIRST.md`** — autonomous run register (triage-and-fix history, guardian dispatch gaps, worktree hygiene) — operational meta, not runtime config.

**Evidence paths:** `README.md`, `AGENTS.md`, `docs/constitution/PRD.md`, `docs/API.md`, `docs/constitution/HARNESS.md`, `docs/constitution/INFRASTRUCTURE.md`, `.claude/settings.json`, `compose.yaml`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public template under `kodexArg`; no private credentials in repo; secrets in Secrets Manager / gitignored `.env` only.
- **Auth model:** OIDC via Cognito (Google federated IdP) → one-time token verify → Django DB session cookie; RBAC exclusively via Django Groups + DRF permissions; bootstrap allowlist for first-login admin grant (`AUTH_BOOTSTRAP_ALLOWLIST`).
- **AI safety:** Router constrained decoding (enum only); assistant returns text + validated link objects; rate limits and silent abuse blocks; audit retention env vars.
- **Frontend secret boundary:** Zero secrets in frontend task definitions — only `PUBLIC_*` vars.
- **This summary contains no secrets, keys, connection strings with passwords, or `.env` contents.** Deploy workflow ARNs and account identifiers exist in `.github/workflows/deploy-prod.yml` but are not reproduced here.

## 10. Operational picture

### Local development

```bash
docker compose --profile db up -d           # Postgres only
docker compose --profile backend up -d      # Django + Postgres
docker compose --profile full up -d         # Full stack
python3 tests/test_docker_compose.py        # harness compose test
python3 tests/test_docker_compose.py --smoke
```

Backend tests: `cd backend && DEBUG=true DJANGO_SECRET_KEY=test DB_HOST=127.0.0.1 uv run pytest -q`. Frontend: `cd frontend && bun test`. Harness: `pytest` from repo root `tests/`.

`start-dev-server` skill — free ports 8000/4321, Compose `full`, dev-login via chrome-devtools.

### Deployment

- **CI:** `.github/workflows/ci.yml` on PRs to `main` — backend pytest (excluding `cognito_live` / `bedrock_live`), harness tests, frontend `bun test` + `astro check`.
- **Production:** `.github/workflows/deploy-prod.yml` on push to `prod` — test gate, Docker build/push to ECR, ECS task definition register, migrate run-task, service update. Region `us-east-1`, cluster `alvs-prod`.
- **Git policy:** `main` = integration; `prod` = production deploy trigger; direct push to protected branches restricted to `kodexArg` org actors (`docs/GH.md`).

### Hardware / environment constraints

- Smoke/browser tests require interactive `kodex` Unix user with chrome-devtools MCP at local CDP port — not for agent sandboxes or headless cron.
- `codebase-memory-mcp` and `chrome-devtools` are local-machine MCPs; cloud agent sessions fall back to Grep/Read.
- Fargate baseline 256 CPU / 512 MB per service; scale on measurement only.

## 11. Open questions / unknowns

- Exact production hostnames and tenant-specific Graph workbook locations are env-driven — not inferable from tree without live config.
- Whether all `bedrock_live` and `cognito_live` integration gates pass in CI outside the owner's AWS account — markers exist for opt-in only.
- Staging tier explicitly absent by design; future isolated-subnet hardening for Fargate noted as optional in `INFRASTRUCTURE.md` but not scheduled.
- Some ONBOARDING cross-references use stale ADR numbers (e.g. `adr-07` cited for development flow where `adr-11` is canonical) — doc drift possible; agents should follow `AGENTS.md` links.
- Ephemeral reference-run resource inventory in `docs/INVENTORY.md` not fully ingested in this summary — teardown state may change independently of code.
