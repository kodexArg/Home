---
id: "alvs-corporate-books"
title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django"
visibility: private
importance: high
source_repo: "alvs-corporate-books"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["astro", "svelte", "django", "drf", "postgresql", "aws", "fargate", "cognito", "bedrock", "compliance", "corporate-books", "litigation", "alvs", "sharepoint", "m365"]
problems_solved:
  - "Grupo ALVS needs a single authenticated web system for corporate statutory books, compliance obligations, and litigation records instead of scattered spreadsheets and SharePoint-only workflows."
  - "Company data must leave the Microsoft 365 estate only through a controlled AWS tier with Django RBAC, not via anonymous or direct SharePoint exposure."
  - "Legal and compliance staff need deadline visibility, immutable folio sealing, and auditable CRUD across entities, cases, filings, and powers of attorney."
  - "Operators need a safe AI-assisted navigation layer (router + page-context assistant) that cannot freely generate actuator commands or leak unauthorized routes."
technologies:
  - "Astro 7 SSR"
  - "Svelte 5"
  - "Tailwind CSS 4"
  - "HTMX 2"
  - "Django 6"
  - "Django REST Framework 3.17"
  - "PostgreSQL 17"
  - "AWS ECS Fargate"
  - "Amazon Cognito (OIDC via Google IdP)"
  - "Amazon Bedrock (Nova Micro / Nova Lite)"
  - "Microsoft Graph (app-only)"
  - "Docker Compose"
  - "GitHub Actions"
  - "uv / Bun"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ALVS Corporate Books

> **Problem thesis (required):** This repository is the production application for Grupo ALVS corporate books — statutory registers, compliance tracking, and litigation management — delivered as a two-service stack (Astro SSR frontend + Django/DRF API) on persistent AWS Fargate infrastructure. It exists because legal, corporate, and compliance teams need one authenticated system to maintain entities, books and folios, cap tables, officers, regulatory deadlines, case files, and related artifacts under entity-scoped permissions, with SharePoint/M365 data reachable only through this tier. A custom agent harness (constitution, ADRs, API SSOT, TDD/BDD gates, guardian bots) keeps the product growing safely by addition rather than ad-hoc sprawl.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/alvs-corporate-books` |
| Visibility | `private` |
| Default branch | `main` (integration); `prod` is the production deploy branch |
| One-line pitch | Corporate books, compliance, and litigation for Grupo ALVS — Astro SSR UI over a Django 6 API on two Fargate services with PostgreSQL, Cognito auth, and Bedrock-assisted routing. |
| Audience | Internal ALVS legal/compliance/corporate operators, firm administrators, and `ai_operators` using the chat router; kodexArg maintainers and agent harness users. |

## 2. Problems it solves

### P1 — Fragmented corporate and compliance record-keeping

- **Who hurts:** Corporate secretaries, compliance officers, and entity administrators at Grupo ALVS.
- **Pain today:** Statutory books, beneficial-owner declarations, tax obligations, regulatory filings, proceedings, and renewals live across disconnected tools; deadlines are easy to miss; there is no single entity-scoped view of "what is due and what is sealed."
- **How this repo answers:** Django domain apps (`corporate`, `compliance`, `litigation`) expose a large, permission-filtered REST API declared in `docs/API.md`. The Astro frontend renders directory pages, detail views, and editor-gated forms for entities, books/folios (with immutable close + SHA-256 hash), shareholders/shareholdings, officers (with an admin approval queue), compliance reminders/findings/beneficial owners, tax catalogs and due dates, regulatory filings, proceedings/renewals, case files, procedural deadlines, powers of attorney, regulated fees, pleading templates, and a cross-entity compliance dashboard. Entity-level `EntityPermission` grants scope read vs write access; admins see all.
- **Out of scope:** General ERP, payroll, accounting ledger, or external court e-filing integrations beyond what the API models capture.

### P2 — Unsafe exposure of M365/SharePoint data to the public web

- **Who hurts:** IT security, platform owners, and executives responsible for information governance.
- **Pain today:** Publishing company registers or compliance data directly from SharePoint risks anonymous access, inconsistent RBAC, and no unified audit trail at the application layer.
- **How this repo answers:** The PRD (`docs/constitution/PRD.md`) mandates that SharePoint/M365 information reaches the web only through this authenticated AWS tier. Cognito (federated Google IdP) authenticates; Django Groups and per-entity permissions authorize. Microsoft Graph is used app-only (`apps/m365`) for controlled reads (demo hello/world cells and the capability layer), with secrets in AWS Secrets Manager per `docs/VARIABLES.md`. Media uses S3 presigned URLs; audit logs and notifications live in `apps/platform`.
- **Out of scope:** Replacing SharePoint as the document system of record; this app brokers and presents governed subsets.

### P3 — AI assistance without giving models actuator rights

- **Who hurts:** Operators who want natural-language navigation and lawyers who need drafting help; security reviewers who fear prompt injection driving mutations.
- **Pain today:** Chatbots that both interpret intent and execute actions blur trust boundaries; unconstrained LLM output can suggest or trigger unauthorized operations.
- **How this repo answers:** A strict two-tier AI design (`docs/CHATBOT.md`, ADR-17/18/25): the **router** (`POST /api/router/route/`) uses Bedrock Nova Micro with JSON-schema constrained enum outputs — it chooses among permission-filtered intents only, never generates user-visible prose. The **assistant** generating tier (`POST /api/assistant/ask/`, chat sessions) produces read-only text; page context is assembled server-side from a closed nav registry, not raw page HTML. Rate limits, cooldowns, audit rows (`IntentQuery`, `AssistantQuery`), and kill switches (`ROUTER_ENABLED`, `ASSISTANT_ENABLED`) provide operational guardrails.
- **Out of scope:** Autonomous agents that POST/PATCH/DELETE domain records; all mutations remain explicit UI/API actions by authenticated humans.

## 3. Product / idea

The mental model is **two Dockerized services in production** — backend (ASGI uvicorn on port 8000) and frontend (Astro SSR on port 4321) — fronted by a shared ALB with host-based routing: API, accounts, admin, and static/media paths hit Django; everything else is SSR from Astro. SSR fetches the backend via Cloud Map private DNS (`backend.<project>-<env>.local`), never through the public load balancer. PostgreSQL (RDS in cloud, container locally) holds all domain state. Redis is explicitly prohibited (`docs/CACHE.md`); caching uses Django database cache, HTTP cache headers, and in-process patterns.

The product grew from the `astro-drf-aws` template but is no longer that template: project slug `alvs-corporate-books`, owner-chosen production host (documented in `docs/INVENTORY.md` and `docs/constitution/INFRASTRUCTURE.md`), persistent footprint never torn down (ADR-29). Features are added by **new domain routes and TDD/BDD entries**, not by rewriting the harness.

User journey (simplified): authenticate via Cognito → land in lobby/home → browse entities → drill into books, cap table, officers, compliance cards, litigation cases → act through forms gated by `me.is_editor` and entity permissions → optionally open chat drawer for page-context Q&A or use the chatui router for safe navigation intents.

### 3.1 North-star use cases

1. **Corporate secretary** opens an entity, maintains statutory books and folios, closes a minutes folio with immutable hash, and registers officer changes (directly or via admin approval queue).
2. **Compliance officer** monitors the compliance dashboard aggregating reminders, tax due dates, regulatory filings, and renewals; resolves items before deadlines; records findings and beneficial owners.
3. **Litigation lawyer** opens case files, logs docket events, tracks procedural deadlines, manages powers of attorney, adjusts regulated fees using adjustment indexes, and renders pleading templates.
4. **Administrator** configures module permissions, reviews audit logs, manages tax obligation catalogs, and oversees bootstrap allowlist grants for first-login role assignment.
5. **AI operator** uses the router to jump to allowed destinations from natural language without the model emitting free text or unauthorized actions.

### 3.2 Non-goals

- No staging environment tier in the AWS account (dev and prod only).
- No NAT gateways by design (cost trade-off; tasks use public IPs with security-group isolation).
- No npm/Node for frontend tooling — Bun is mandatory.
- No undeclared API routes (enforced by hooks); no env vars used in code without `docs/VARIABLES.md` rows.
- Router-mediated "smart generation behind the router" is architecturally reserved but not built; only the direct assistant generating tier ships.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.14 (backend), Bun (frontend) | `backend/pyproject.toml`, `frontend/package.json` |
| Frontend | Astro 7.0.7, Svelte 5.56, Tailwind 4.3, HTMX 2.0, Melt UI | `frontend/package.json`, `frontend/astro.config.mjs` |
| Backend / API | Django 6.0.7, DRF 3.17.1, drf-spectacular, uvicorn ASGI | `backend/pyproject.toml`, `backend/config/urls.py` |
| Data | PostgreSQL 17 (RDS prod, Compose locally) | `compose.yaml`, `docs/BD.md` |
| Auth | Cognito OIDC + Django session; MSAL for Graph app-only | `docs/AUTH.md`, `backend/apps/users/` |
| AI | Bedrock Nova Micro (router), Nova Lite (assistant) | `docs/CHATBOT.md`, `docs/VARIABLES.md` |
| Infra / deploy | ECS Fargate (2 services), ALB, ECR, Secrets Manager, S3 media, Cloud Map, Bedrock VPC endpoint | `docs/constitution/INFRASTRUCTURE.md`, `.github/workflows/deploy-prod.yml` |
| AI / agents | `.claude/` hooks, kskill-* skills, kbot-* guardians, kwf-* delivery cast | `docs/constitution/HARNESS.md`, `.claude/settings.json` |
| Tests | pytest + pytest-django (backend), Bun test + happy-dom (frontend), harness tests at repo root | `backend/pyproject.toml`, `frontend/package.json`, `tests/` |

### 4.1 Notable dependencies (curated)

- `django` + `djangorestframework` — core API and ORM for all domain apps.
- `psycopg[binary]` — PostgreSQL driver with SSL modes enforced in production.
- `msal` + `httpx` — Entra app-only token acquisition for Microsoft Graph.
- `pyjwt[crypto]` — Cognito ID token verification on OIDC callback.
- `drf-spectacular` — OpenAPI schema generation (supporting contract discipline).
- `astro` + `@astrojs/node` — SSR adapter for Fargate frontend service.
- `htmx.org` — progressive enhancement layer before Svelte interactivity.
- `melt` — headless UI primitives aligned with shadcn-svelte patterns.
- `boto3` (dev group) — AWS integration tests and Bedrock clients.
- `whitenoise` — static file serving for Django admin/static in container.

## 5. Repository map (abstraction)

- **Entrypoints:** `backend/config/urls.py` mounts admin, accounts, and `/api/` includes for health, users, m365, router, corporate, compliance, litigation, assistant, platform. `frontend/src/pages/` defines SSR routes (entities, books, cases, compliance, chat, profile, catalogs, etc.). `compose.yaml` orchestrates local `db`, `backend`, `frontend` profiles.
- **Domain / core:** `backend/apps/corporate/` (entities, books, folios, shareholders, officers, assembly checklists), `backend/apps/compliance/` (reminders, findings, beneficial owners, tax, filings, proceedings, renewals), `backend/apps/litigation/` (cases, events, deadlines, powers, fees, templates, indexes), `backend/apps/users/` (custom user model, access requests, permissions), `backend/apps/router/` (intents, constrained routing), `backend/apps/assistant/` (chat sessions, generated documents, page-context ask).
- **Adapters:** `backend/apps/m365/` (Graph client), `backend/config/settings.py` (env, Cognito, S3, CORS, cache), `frontend/src/middleware.ts` (SSR concerns), Astro server fetches to backend via `BACKEND_API_URL` / Cloud Map in prod.
- **Docs vaults:** `docs/` — Obsidian-style vault with wikilinks; `docs/constitution/` (PRD, REQUIREMENTS, HARNESS, INFRASTRUCTURE, etc.); `docs/adrs/` (30 ADRs); `docs/tdds/` (100+ backend TDD specs); `docs/bdds/` (frontend BDD specs); `docs/API.md` (endpoint SSOT); `docs/VARIABLES.md` (env SSOT). No `.docs/` directory present.
- **Agent scaffolding:** `.claude/` hosts symlinks to `docs/skills`, `docs/hooks`, `docs/agents`; skills include `kskill-django-6-drf`, `kskill-astro-7`, AWS family, `kskill-orchestrator`, `kskill-live-doc`, `kskill-markdown-vault`, triage workflows. Hooks enforce API/variable/ADR checks, guardian dispatch, graph-first search, SSOT preload. `CLAUDE.md` points to `AGENTS.md` as the agent entry index.
- **CI/CD:** `.github/workflows/ci.yml` (backend pytest + harness tests + frontend checks), `deploy-prod.yml` (ECR build, ECS deploy, migrate task, Bedrock live gate).
- **Harness tests:** `tests/` at repo root validates compose layout, project slug hardcoding, guardian identity, docker compose smoke, AWS infra expectations, hook behavior.
- **Generated / vendor:** `frontend/bun.lock` (not summarized), `backend/.venv` in images only, `state/` tracked runtime reference root (gitkept, not docs).

## 6. Configuration & contracts (no secrets)

Environment variables are declared exclusively in `docs/VARIABLES.md`. Secrets (`DB_*`, `SECRET_KEY`, Cognito, MS Graph, S3) live in AWS Secrets Manager paths `alvs/<env>/<project>/<component>`; local dev uses gitignored `.env` mirroring names from `.env.example`. Frontend receives only `PUBLIC_*` non-secret variables.

Notable configuration groups:

| Group | Purpose |
|-------|---------|
| `PROJECT_SLUG`, `BASE_DOMAIN`, `PROJECT_HOST` | Deploy identity; host is owner-decided, not derived from slug |
| `DB_*`, `DB_SSLMODE`, `DB_SSLROOTCERT` | PostgreSQL connectivity with TLS in cloud |
| `COGNITO_*` | OIDC login/logout against shared org pool with project client |
| `MSGRAPH_*` | Entra single-tenant app-only Graph access |
| `ROUTER_*`, `ASSISTANT_*`, `BEDROCK_REGION` | AI tier models, kill switches, abuse guards, audit retention |
| `AUTH_DEV_MODE`, `AUTH_BOOTSTRAP_ALLOWLIST` | Local dev login and first-login group grants |
| `PUBLIC_API_URL`, `PUBLIC_BACKEND_URL`, `PUBLIC_SITE_URL` | Frontend SSR fetch targets |

Django settings module: `config.settings` (ASGI via uvicorn). Feature flags include `ROUTER_ENABLED`, `ASSISTANT_ENABLED`, `DEBUG` (blocked in deploy checks when combined with `AUTH_DEV_MODE`).

### 6.1 HTTP / API endpoints (when applicable)

The canonical table with 100+ rows lives in `docs/API.md`. All paths are under `/api/`, `/accounts/`, or `/admin/` on the backend ALB rules. Representative surface by domain:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/health/` | Liveness probe | none |
| `GET` | `/accounts/login/` | Start Cognito OIDC redirect (Google IdP) | none |
| `GET` | `/accounts/callback/` | OIDC callback, open Django session | none |
| `POST` | `/accounts/logout/` | Session flush + Cognito logout | session |
| `GET` | `/api/me/` | Current user, groups, `is_editor`, theme | session |
| `PATCH` | `/api/me/` | Update profile/theme/chat drawer prefs | session |
| `POST` | `/api/router/route/` | Chat router — enum outcome only | session; `CanUseRouter` |
| `POST` | `/api/assistant/ask/` | Page-context assistant answer | session; `CanUseAssistant` |
| `GET` | `/api/corporate/entities/` | List authorized entities | session; `EntityAccess` |
| `GET` | `/api/corporate/books/` | Statutory books | session; `BookAccess` |
| `POST` | `/api/corporate/folios/{id}/close/` | Immutable folio seal | session; write grant |
| `GET` | `/api/compliance/reminders/` | Compliance reminders | session; `ReminderAccess` |
| `GET` | `/api/compliance/tax-due-dates/` | Generated tax deadlines | session; `TaxDueDateAccess` |
| `GET` | `/api/litigation/case-files/` | Litigation docket | session; `IsInAnyGroup` |
| `POST` | `/api/litigation/pleading-templates/{id}/render/` | Render template with variables | session |
| `GET` | `/api/platform/audit-logs/` | Admin audit trail | session; admin |
| `GET` | `/api/m365/hello/` | Graph demo read cell A1 | none (`AllowAny` demo) |

Frontend SSR routes (served by Astro, not listed in API.md) include `/`, `/entities`, `/books`, `/cases`, `/compliance`, `/chat`, `/chatui`, `/profile`, `/shareholders`, `/powers-of-attorney`, `/pleading-templates`, `/tax-obligations`, `/healthz`, and nested dynamic segments for detail/edit forms — see `frontend/src/pages/` and matching `frontend/tests/*` specs.

### 6.2 Other interfaces

- **Management commands:** `bootstrap_admin`, `seed_demo_operator`, `createcachetable`, audit purge commands for router/assistant — invoked on container boot in Compose and deploy.
- **MCP (agent dev):** `markdown-vault-docs` for `docs/` prose; `codebase-memory-mcp` for code graph; `chrome-devtools` for smoke UI tests (kodex user only).
- **GitHub Actions:** `ci` on PR/push to `main`; `deploy-prod` on `prod` branch with repository variables for ARNs and host.
- **Docker Compose CLI:** `docker compose --profile db|backend|full up` per `README.md`.

## 7. Data & persistence

- **Primary store:** PostgreSQL 17 — single application database; shared prod RDS instance across ALVS projects per `docs/BD.md`.
- **Object storage:** S3 bucket for media attachments (`AWS_STORAGE_BUCKET_NAME`); presigned URLs, no CDN in template.
- **Cache:** Django database cache table (`createcachetable` on boot) — no Redis.
- **Key entities (by model name):** `Entity`, `Book`, `Folio`, `Shareholder`, `Shareholding`, `Officer`, `OfficerUpdateRequest`, `AssemblyChecklist`, `ChecklistStep`, `EntityPermission`, `Reminder`, `Finding`, `BeneficialOwner`, `TaxObligation`, `TaxDueDate`, `RegulatoryFiling`, `Proceeding`, `Renewal`, `CaseFile`, `CaseEvent`, `ProceduralDeadline`, `PowerOfAttorney`, `AdjustmentIndex`, `JusValue`, `RegulatedFee`, `PleadingTemplate`, `Intent`, `IntentQuery`, `ChatSession`, `ChatMessage`, `GeneratedDocument`, `AssistantQuery`, `AuditLog`, `ModulePermission`, `Notification`, `AccessRequest`.
- **Topology:** Cloud — RDS in isolated subnets; Fargate tasks in public subnets with public IPs (no NAT); SSR→API via Cloud Map private DNS. Local — Postgres container + hot-reload backend/frontend bind mounts.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

- `README.md` — repo front door, stack summary, branch model, local Docker commands.
- `AGENTS.md` / `CLAUDE.md` — agent entry, ABC gate (PRD → constitution → ADRs → API), development loop, harness index.
- `docs/constitution/PRD.md` — product objective: SharePoint-to-web tier, safe ChatUI, harness for growth.
- `docs/constitution/INFRASTRUCTURE.md` — two Fargate services, ALB routing, Secrets Manager, Bedrock VPC endpoint, persistent prod footprint.
- `docs/constitution/HARNESS.md` — skills, hooks, guardians, doc tiers, vendored tooling under `docs/`.
- `docs/API.md` — full endpoint SSOT (100+ rows) with contracts for auth, corporate, compliance, litigation, assistant, platform.
- `docs/VARIABLES.md` — env var SSOT with Cognito, DB, Graph, Bedrock, router/assistant knobs.
- `docs/CHATBOT.md` — two-tier AI architecture, router enum safety, assistant read-only generation.
- `.claude/settings.json` — SessionStart SSOT preload, PostToolUse API/variable/ADR/guardian hooks.
- `.claude/skills/` — stack-specific and AWS skills (`kskill-django-6-drf`, `kskill-astro-7`, `kskill-orchestrator`, etc.).
- `compose.yaml` — local service wiring and env shape (names only, no secret values).
- `backend/pyproject.toml`, `frontend/package.json` — version pins.
- `backend/config/urls.py` — app mount structure.
- `.github/workflows/ci.yml` — CI jobs overview.

No `.docs/` hidden vault exists in this repository. `docs/ABOUT-KODEX-COMPUTER.md` is gitignored and was not read.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg`; this summary contains no clone URLs, tokens, or credential values.
- **Auth model:** Cognito OIDC (Google federated) establishes identity; Django session cookie holds authorization context. RBAC via Django Groups (`admins`, `ai_operators`, etc.) plus per-entity `EntityPermission` read/write grants. `ai_operators` may only use router and assistant endpoints.
- **Data isolation:** Entity-scoped queries return `404` outside scope to prevent enumeration. Admin-only catalogs (tax obligations, adjustment indexes, pleading templates) gated separately.
- **AI safety:** Router constrained decoding to closed enum; assistant never receives raw page HTML; audit retention configurable.
- **Infra accepted risks:** Public task IPs without NAT documented in INFRASTRUCTURE; security groups are the primary network control.
- **Harness enforcement:** Hooks block undeclared routes and env reads; guardian agents (`kbot-prd`, `kbot-adr`, `kbot-api`) review changes to watched surfaces.
- **Explicit:** No secrets, PEMs, connection strings with passwords, or `.env` contents appear in this file.

## 10. Operational picture

- **Local dev:** `docker compose --profile db up -d` (Postgres only) or `--profile backend` / `full` for API and UI; `bun run dev` in `frontend/` or via compose; `uv run` in `backend/`. Harness test `python3 tests/test_docker_compose.py` validates layout; `--smoke` for deeper check.
- **CI:** GitHub Actions `ci` — backend `pytest` (excluding `cognito_live` and `bedrock_live` markers), harness auto-discovered tests, frontend `bun test` and `astro check`.
- **Deploy:** `deploy-prod.yml` on `prod` branch — build/push ECR images tagged `<env>-<sha>`, run migration task, update ECS services `alvs-corporate-books-backend` and `alvs-corporate-books-frontend` on cluster `alvs-prod`, ALB host rule for owner-configured production host. Bedrock live test gate in pipeline.
- **Branches:** `main` integrates via PR; `prod` is production; direct pushes restricted to `kodexArg` on protected branches.
- **Observability:** CloudWatch log groups `/alvs/<project>/<component>-<env>`; AWS skills in harness for alarms, queries, troubleshooting.
- **Hardware:** Standard Fargate 256 CPU / 512 MB baseline per service; scale on measurement.

## 11. Open questions / unknowns

- Exact production host string is stored in GitHub repository variables and `docs/INVENTORY.md` — not repeated here per RAG hygiene; deploy workflow requires `PROJECT_HOST` explicitly.
- Full OpenAPI export from drf-spectacular was not ingested; endpoint contracts beyond the sample table are in `docs/API.md` only.
- SharePoint sync depth (which lists/libraries are integrated beyond Graph demo endpoints) is not fully enumerated in manifests reviewed; M365 layer may be capability-ready more than feature-complete.
- Content of gitignored `.env` / `docs/ABOUT-KODEX-COMPUTER.md` unknown by design.
- Whether all 100+ TDD/BDD entries have corresponding merged UI is implied by extensive `frontend/tests/` coverage but not verified runtime in this scan.

---
