---
id: "alvs-registros-libros-societarios-kodexarg"
title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS"
visibility: private
importance: high
source_repo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags:
  - "corporate-registry"
  - "libros-societarios"
  - "compliance"
  - "litigation"
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
  - "argentina"
  - "private"
problems_solved:
  - "Legacy REGISTROS corporate-law operations — statutory books, folios, cap tables, officers, and entity permissions — were trapped in an aging Spanish desktop system without modern auth, audit, or multi-user web access."
  - "Grupo ALVS law-firm staff needed a single authenticated web tier for corporate registry, compliance tracking, and litigation docket work across many client entities, with per-entity RBAC instead of firm-wide binary access."
  - "SharePoint-hosted corporate data and growing operational surfaces could not be exposed directly to browsers — the group required the astro-drf-aws pattern: M365 ingestion through app-only Graph, PostgreSQL as system of record, Cognito login, Django authorization, and a safe ChatUI navigation router."
technologies:
  - "Astro 7 (SSR)"
  - "Svelte 5"
  - "Tailwind CSS 4"
  - "HTMX 2"
  - "Melt UI (headless builder layer)"
  - "Django 6"
  - "Django REST Framework 3.17"
  - "Python 3.14"
  - "PostgreSQL 17"
  - "Uvicorn (ASGI)"
  - "AWS ECS Fargate"
  - "AWS Cognito (OIDC via Google federation)"
  - "AWS Bedrock (Nova Micro inference profile for router)"
  - "Microsoft Graph (app-only capability layer)"
  - "Bun (frontend package manager and runtime)"
  - "uv (Python package manager)"
  - "Docker Compose (local dev)"
  - "GitHub Actions (CI and prod deploy)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ALVS Registro de Libros Societarios

> **Problem thesis (required):** Grupo ALVS maintains corporate registry operations for client entities — statutory books and folios, shareholder cap tables, governing-body officers, assembly checklists, compliance reminders and filings, and litigation dockets — historically through the legacy REGISTROS application. This repository is the migration to the kodexArg `astro-drf-aws` template: a private, authenticated web application where PostgreSQL is the system of record, Django enforces per-entity read/write grants on top of Cognito login, the Astro SSR frontend renders Spanish operator copy, and a governed harness keeps API, ADR, and documentation discipline as the surface grows by addition.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG` |
| Visibility | `private` |
| Default branch | `main` (integration); `prod` is the production promotion line |
| One-line pitch | Corporate registry and adjacent law-firm operations for Grupo ALVS — entities, statutory books, compliance, and litigation in one authenticated Astro + Django stack migrated from legacy REGISTROS. |
| Audience | ALVS corporate-law operators and editors; firm admins managing entity permissions and officer approvals; litigation staff; internal kodexArg maintainers and AI agents working through the project harness. |

## 2. Problems it solves

### P1 — Legacy REGISTROS cannot serve modern corporate-book workflows

- **Who hurts:** Corporate-law operators at Grupo ALVS who maintain libros societarios, shareholder registries, and entity governance records for client companies and associations.
- **Pain today:** The legacy REGISTROS desktop application held statutory books, numbered folios, cap-table shareholdings, officer rosters, and assembly preparation checklists in a monolithic Spanish codebase without web access, modern authentication, immutable audit semantics, or per-entity authorization. Opening a book, writing a folio, and sealing it with a cryptographic close hash — core Argentine corporate-registry practice — had no path to a secure multi-user web tier.
- **How this repo answers:** The `corporate` Django app ports the domain into English identifiers with Spanish i18n labels: `Entity` (registered company/association), `Book` (rubricated statutory book), `Folio` (numbered leaf opened then immutably closed with SHA-256 `close_hash`), `Shareholder`/`Shareholding` (firm-wide registry and per-entity cap table), `Officer` with an approval queue (`OfficerUpdateRequest`), and `AssemblyChecklist`/`ChecklistStep` (LGS meeting preparation). REST endpoints under `/api/corporate/` expose list/create/detail/patch/close flows; the Astro frontend implements directory pages, detail views, and editor-gated forms driven by 130+ TDD specs in `docs/tdds/`.
- **Out of scope:** Replacing the public registries (DPJ/IGJ/IPJ/INAES) themselves, e-invoicing, or general ERP functions. External legacy behavior is referenced for parity (e.g. shareholding delete as `eliminar_tenencia`) but the old app is not vendored.

### P2 — Compliance and litigation work must live beside the registry without fragmenting access control

- **Who hurts:** Compliance analysts tracking tax obligations, regulatory filings, beneficial owners, and administrative proceedings; litigation staff managing case files, procedural deadlines, powers of attorney, and regulated fees.
- **Pain today:** Compliance reminders, findings, tax due dates, regulatory filings, proceedings, and renewals — plus litigation dockets, case events, adjustment indexes, jus values, pleading templates — were separate concerns in the legacy stack with inconsistent authorization models.
- **How this repo answers:** Three additional domain apps partition the surface while sharing session auth and Django Groups: `compliance` (reminders, findings, beneficial owners, tax obligations/due dates, regulatory filings, proceedings/renewals), `litigation` (case files, events, procedural deadlines, powers of attorney, adjustment indexes, jus values, regulated fees, pleading templates), and `platform` (audit log, module permissions, in-app notifications). Entity-scoped records honor `EntityPermission` read/write grants; firm-wide litigation catalogs use `FirmWideEditorAccess` or `AdminManagedCatalog` as documented in `docs/API.md`. A cross-entity compliance dashboard aggregates dated items at `/compliance/`.
- **Out of scope:** Full document management replacement, court e-filing integrations, or automated tax-calendar generation beyond the modeled obligation/due-date engine.

### P3 — Operators need a governed full-stack harness, not ad-hoc feature sprawl

- **Who hurts:** kodexArg maintainers and AI agents extending a large, multi-domain legal application on shared ALVS AWS infrastructure.
- **Pain today:** Repositories with 170+ declared HTTP endpoints, 136 backend TDD documents, extensive frontend test suites, M365 capability, Bedrock router, and strict RBAC are easy to break with undeclared routes, env-var drift, or documentation rot.
- **How this repo answers:** The project inherits the complete `astro-drf-aws` harness: Obsidian-flavored `docs/` vault, 24 ADRs mirrored into `.claude/rules/`, guardian subagents (`astro-drf-aws-prd`, `-adr`, `-api`), enforcement hooks (`check_api.py`, `check_variables.py`, `dispatch_guardians.py`, `load_ssot.py`), vendored skills under `.claude/skills/`, and the `markdown-vault-docs` MCP for vault-first doc reads. The ABC gate requires every change to align with `docs/PRD.md`, ADRs, and `docs/API.md`. Backend work follows API row → TDD → models; frontend work follows BDD entries in `docs/bdds/`.
- **Out of scope:** Being a public reusable template — this is a private ALVS production application that still carries template reference defaults (notably `PROJECT_SLUG=astro-drf-aws` in deploy workflow seeds) pending full rename to a project-specific slug.

## 3. Product / idea

ALVS Registro de Libros Societarios is a **two-service web application** built on the kodexArg template: Astro 7 SSR + Svelte 5 frontend and Django 6 + DRF backend, each as an AWS Fargate service behind a shared ALB. PostgreSQL 17 holds all operational state. Cognito (Google-federated OIDC) authenticates; Django Groups plus per-entity `EntityPermission` grants authorize. The default UI locale is Spanish (`frontend/src/i18n/config.ts` sets `es`); code, API paths, models, and documentation remain English per ADR.

The mental model has four cooperating layers:

1. **Corporate registry core** — Entities are the aggregate root. Each entity owns statutory `Book`s containing numbered `Folio`s. Shareholders are firm-wide; `Shareholding` rows attach them to entities. Officers, assembly checklists, and entity documents hang off the entity detail surface.
2. **Compliance ring** — Reminders, findings, beneficial owners, tax obligations with generated due dates, regulatory filings, and administrative proceedings/renewals provide operational compliance tracking with entity scoping.
3. **Litigation ring** — Case files, docket events, procedural deadlines, powers of attorney, monetary indexes, regulated fees, and pleading templates serve firm-wide legal work (not entity-gated reads).
4. **Assistant + router** — A closed-enum ChatUI router (`POST /api/router/route/`) uses Bedrock Nova Micro for safe navigation intent matching; `assistant` app models support AI chat sessions and generated documents (lawyer/accountant personas).

Users without a granted Django Group land on the **lobby** (`/`) per `adr-20-authorization-lobby`. Authenticated editors navigate entity directories, book/folio workflows, shareholder registries, compliance dashboards, litigation dockets, chat UI, profile theming, and admin surfaces (audit logs, module permissions, tax-obligation catalog). Theme tokens are CSS custom properties; users tune appearance on `/profile`.

Growth is **by addition**: new capabilities become new domain endpoints and Astro pages; the harness (PRD, ADRs, API SSOT, hooks, skills) stays fixed.

### 3.1 North-star use cases

1. **Open and seal a statutory folio** — An editor with write grant on an entity opens a book (`POST /api/corporate/books/`), creates a folio (`POST /api/corporate/folios/`), edits content while status is `open`, then immutably closes it (`POST /api/corporate/folios/{id}/close/`) receiving a SHA-256 `close_hash`; minutes books reject empty definitive content.
2. **Entity compliance review** — An operator opens an entity detail page, reviews embedded cards for reminders, findings, filings, beneficial owners, and proceedings, then uses the cross-entity `/compliance/` dashboard to see aggregated upcoming deadlines.
3. **Officer change with admin approval** — A user with entity write access files an `OfficerUpdateRequest`; an `admins` group member approves it from the officer-request queue, materializing `Officer` rows with deduplication by document, role, and active status.
4. **Agent-driven feature delivery** — A maintainer or agent reads `AGENTS.md`, holds `docs/PRD.md` and `docs/API.md` in context, adds an API row before backend code, writes a `docs/tdds/` spec, implements with `kdx-django-6-drf` / `kdx-astro-7` skills, and opens a PR to `main` with guardian review on SSOT touches.

### 3.2 Non-goals

- Redis or ElastiCache (DatabaseCache in PostgreSQL only; Redis prohibited by `adr-06-cache`).
- Cognito groups for RBAC (Django Groups + `EntityPermission` only; `adr-10-auth`).
- npm or Node in the frontend toolchain (`bun` mandatory; `adr-02-initial-stack`).
- Staging cloud environment (local + dev/prod cloud only).
- Public anonymous access to corporate or compliance data (session auth throughout; M365 demo endpoints are deliberate `AllowAny` exceptions).
- Hardcoded secrets or account identifiers (names in `docs/VARIABLES.md`; values in Secrets Manager or gitignored `.env`).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.14 (backend), Bun (frontend JS) | `backend/pyproject.toml` `requires-python`; `frontend/package.json` scripts |
| Frontend | Astro 7.0.7 SSR, Svelte 5.56, Tailwind 4.3, HTMX 2.0, Melt 0.44 | `frontend/package.json`, `frontend/astro.config.mjs` |
| Backend / API | Django 6.0.7 + DRF 3.17.1, drf-spectacular, async views where mandated | `backend/pyproject.toml`, `backend/config/asgi.py` |
| Data | PostgreSQL 17.9 (RDS cloud, Compose local) | `docs/BD.md`, `compose.yaml` `postgres:17.9-bookworm` |
| Auth | Cognito OIDC (Google federation), Django session, PyJWT, MSAL for Graph | `backend/pyproject.toml`, `docs/AUTH.md` |
| AI / agents | Bedrock Nova Micro router, assistant chat models, vendored harness skills | `docs/CHATBOT.md`, `.claude/skills/`, `backend/apps/router/` |
| Infra / deploy | AWS ECS Fargate (two services), ALB, Cloud Map, Secrets Manager, S3 media, GitHub Actions OIDC | `docs/INFRASTRUCTURE.md`, `.github/workflows/deploy-prod.yml` |
| Tests | pytest + pytest-django (backend), bun test + happy-dom (frontend), harness structure tests | `backend/pyproject.toml`, `frontend/package.json`, `tests/` |

### 4.1 Notable dependencies (curated)

- `drf-spectacular` — OpenAPI schema generation for the large DRF surface.
- `django-cors-headers` + `whitenoise` — split-origin local dev and static serving behind ALB.
- `msal` + `httpx` — app-only Microsoft Graph token acquisition and reads (`backend/apps/m365/`).
- `psycopg[binary]` — PostgreSQL driver for Django 6 on Python 3.14.
- `@astrojs/node` — Node adapter for Astro SSR in the frontend container.
- `melt` — headless UI builder layer under shadcn-svelte components (`docs/MELT-UI.md`).

## 5. Repository map (abstraction)

- **Entrypoints:** `backend/manage.py` (Django), `backend/config/asgi.py` (Uvicorn), `frontend/src/pages/` (Astro routes), `compose.yaml` (local orchestration).
- **Domain / core:**
  - `backend/apps/corporate/` — entities, books, folios, shareholders, officers, assembly checklists, entity permissions.
  - `backend/apps/compliance/` — reminders, findings, beneficial owners, tax obligations/due dates, filings, proceedings, renewals.
  - `backend/apps/litigation/` — case files, events, deadlines, powers, indexes, fees, pleading templates.
  - `backend/apps/assistant/` — chat sessions, messages, generated documents.
  - `backend/apps/platform/` — audit log, module permissions, notifications.
  - `backend/apps/users/` — Cognito-keyed `User` (`sub` PK), `AccessRequest` lobby grants.
  - `backend/apps/router/` — ChatUI intent registry and audit (`Intent`, `IntentQuery`).
- **Adapters:** `backend/apps/m365/` (Graph reads), `backend/config/throttling.py` (cooldown + rate abuse), S3 storage backend for media, Cloud Map internal SSR fetches documented in `docs/INFRASTRUCTURE.md`.
- **Frontend zones:** `frontend/src/components/views/` (page-level Svelte views), `frontend/src/components/` (shadcn/Melt component library), `frontend/src/i18n/messages/es.ts` (Spanish catalog), `frontend/src/middleware.ts` (SSR auth helpers).
- **Docs vaults:** `docs/` — PRD, API, VARIABLES, GLOSSARY, INFRASTRUCTURE, 24 ADRs under `docs/adrs/`, 136 TDD specs under `docs/tdds/`, 9 BDD specs under `docs/bdds/`. No `.docs/` directory present.
- **Agent scaffolding:** `.claude/rules/` (ADR rules), `.claude/agents/` (guardians + orchestrator workers), `.claude/skills/` (vendored kdx-* skills), `.claude/hooks/` (enforcement), `agents/` (guardian SSOT), `skills/` (mirror), `CLAUDE.md` → `AGENTS.md`.
- **Generated / vendor:** `docs/CODEMAP.md` (live-doc inverse index), `backend/uv.lock`, `frontend/bun.lock`, `.mvmcp/` (gitignored MCP venv), `node_modules`/`.venv` (gitignored).

## 6. Configuration & contracts (no secrets)

Configuration is declared in `docs/VARIABLES.md` and enforced by `hooks/check_variables.py`. Secrets live in AWS Secrets Manager paths `alvs/<env>/<project>/{django,db,cognito,s3,msgraph}`; local dev uses gitignored `.env` from `.env.example`.

**Shared identity**

| Name | Purpose |
|------|---------|
| `PROJECT_SLUG` | AWS resource naming stem; deploy workflow seed still `astro-drf-aws` (template reference) |
| `BASE_DOMAIN` | Host composition for ALB routing |

**Backend (representative)**

| Name | Purpose |
|------|---------|
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | PostgreSQL connection |
| `SECRET_KEY` | Django signing |
| `ALLOWED_HOSTS` | Must include Cloud Map internal hostname for SSR fetches |
| `COGNITO_*` | OIDC pool, client, domain, region |
| `MSGRAPH_TENANT_ID` / `MSGRAPH_CLIENT_ID` / `MSGRAPH_CLIENT_SECRET` | App-only Graph |
| `ROUTER_ENABLED` / `ROUTER_BEDROCK_MODEL_ID` / `ROUTER_RATE_*` | ChatUI router kill switch, model, abuse guard |
| `AUTH_BOOTSTRAP_ALLOWLIST` | Comma-separated `email:group` pre-authorization at first login |
| `AUTH_DEV_MODE` | DEBUG-only dev login path |

**Frontend (all non-secret)**

| Name | Purpose |
|------|---------|
| `PUBLIC_API_URL` / `PUBLIC_BACKEND_URL` / `PUBLIC_SITE_URL` | Browser-visible origins |
| `BACKEND_API_URL` | Server-side Cloud Map URL for SSR |
| `PUBLIC_PROJECT_SLUG` | Derived from `PROJECT_SLUG` for display |

Compose profiles: `db` (Postgres only), `backend` (Django + Postgres), `frontend`, `full` — see `compose.yaml` and `docs/DOCKER.md`.

### 6.1 HTTP / API endpoints (when applicable)

`docs/API.md` is the single source of truth — **177 declared endpoint rows** at time of summary. Undeclared `urls.py` routes are defects caught by `hooks/check_api.py`. Summary by prefix:

| Prefix | Domain | Representative operations |
|--------|--------|---------------------------|
| `/api/health/` | health | Liveness probe |
| `/accounts/*` | auth | OIDC login, callback, logout, DEBUG dev-login |
| `/api/me/` | users | Session identity, profile patch (nickname, theme) |
| `/api/restricted/` | auth | RBAC probe for `admins` group |
| `/api/m365/hello/` `/world/` | m365 | Demo Graph cell reads (`AllowAny` exception) |
| `/api/router/route/` | router | ChatUI choosing tier (Bedrock, closed enum) |
| `/api/corporate/*` | corporate | Entities, books, folios, shareholders, shareholdings, officers, officer requests, assembly checklists, checklist steps |
| `/api/compliance/*` | compliance | Reminders, findings, beneficial owners, tax obligations/due dates, regulatory filings, proceedings, renewals |
| `/api/litigation/*` | litigation | Case files, events, procedural deadlines, powers (incl. revoke), adjustment indexes, jus values, regulated fees (incl. adjust), pleading templates (incl. render) |
| `/api/assistant/*` | assistant | Chat sessions, messages, generated documents, draft actions |
| `/api/platform/*` | platform | Audit logs, module permissions, notifications inbox |
| `/admin/` | django | Django admin |

Auth defaults: session cookie for browser operations; `EntityAccess` and sibling permission classes enforce per-entity read/write; `FirmWideEditorAccess` gates litigation writes; `AdminManagedCatalog` gates firm-wide admin catalogs. Responses authenticated are `no-store` per `docs/CACHE.md`.

### 6.2 Other interfaces

- **CLI:** `uv run python manage.py migrate`, `bootstrap_admin`, `seed_demo_operator`, `createcachetable`, `purge_router_audit` — invoked in Compose startup and deploy migrate task.
- **MCP:** `markdown-vault-docs` over `docs/` (launcher `scripts/mvmcp.py`); `codebase-memory-mcp` for code graph (machine-global, not vendored).
- **Harness hooks:** PostToolUse API/variable/ADR checks; SessionStart SSOT preload; guardian dispatch on watched files.
- **Management scripts:** `scripts/cloud_setup.sh`, `scripts/provision_bedrock_endpoint.sh`, `scripts/strip_comments.py` — infra and tooling helpers.

## 7. Data & persistence

- **Engine:** PostgreSQL 17.9 everywhere; Django migrations are the only schema mechanism (`docs/BD.md`).
- **Cache:** `DatabaseCache` table in the same database — no Redis.
- **Media:** Private S3 bucket with Django presigned URLs in cloud; char paths in models for local/dev references.

**Key entity groups (by Django app)**

| App | Models (names only) |
|-----|---------------------|
| `corporate` | `Entity`, `Book`, `Folio`, `Attachment`, `Comment`, `Shareholder`, `Shareholding`, `Officer`, `OfficerUpdateRequest`, `AssemblyChecklist`, `ChecklistStep`, `EntityDocument`, `EntityPermission` |
| `compliance` | `Reminder`, `Finding`, `BeneficialOwner`, `TaxObligation`, `TaxDueDate`, `RegulatoryFiling`, `Proceeding`, `Renewal` |
| `litigation` | `CaseFile`, `CaseEvent`, `ProceduralDeadline`, `PowerOfAttorney`, `AdjustmentIndex`, `JusValue`, `RegulatedFee`, `PleadingTemplate` |
| `assistant` | `ChatSession`, `ChatMessage`, `GeneratedDocument` |
| `platform` | `AuditLog`, `ModulePermission`, `Notification` |
| `users` | `User` (PK = Cognito `sub`), `AccessRequest` |
| `router` | `Intent`, `IntentQuery` |

**Topology:** Local Compose Postgres; cloud RDS in isolated subnets per env; frontend SSR reaches backend via Cloud Map private DNS, never through the public ALB. User identity keys on immutable Cognito `sub`.

## 8. Docs & agent memory (required scan)

Sources read for this summary:

- `README.md` — template lineage, local Docker commands, project completion status.
- `ONBOARDING.md` — onboarding path for Alvsgroup operators and agents.
- `AGENTS.md` / `CLAUDE.md` — harness entry index, ABC gate, development loop, skill inventory pointers.
- `docs/PRD.md` — product objective: SharePoint-to-web secure tier, growing ChatUI router, harness-first growth.
- `docs/API.md` — full endpoint SSOT (corporate/compliance/litigation/assistant/platform surfaces).
- `docs/GLOSSARY.md` — naming authority including REGISTROS corporate-law vocabulary (entities, books, folios, officers, compliance, litigation terms).
- `docs/INFRASTRUCTURE.md` — two-Fargate AWS layout, ALB rules, Cloud Map, Bedrock VPC endpoint, accepted no-NAT trade-off.
- `docs/BD.md` — PostgreSQL placement, migration execution points.
- `docs/VARIABLES.md` — env var SSOT and `PROJECT_SLUG` consumption inventory.
- `docs/HARNESS.md` — vendored skills and MCP servers.
- `docs/CODEMAP.md` — generated doc→code inverse index.
- `backend/apps/corporate/models.py` — domain model docstring and aggregate structure.
- `.claude/rules/` — 24 ADR rule files (stack, API, auth, cache, harness, markdown vault, guardians, ephemeral run, etc.).
- `.claude/hooks/` — ten enforcement hooks (API, variables, ADR, guardians, graph freshness, SSOT preload).
- `.claude/skills/` — vendored kdx-orchestrator, kdx-django-6-drf, kdx-astro-7, kdx-aws-*, kdx-triage, obsidian-markdown, kdx-live-doc, kdx-markdown-vault, kdx-wf-triage-and-fix, and related skills.
- `compose.yaml` — local service definitions and env wiring.
- `.github/workflows/ci.yml` — backend pytest, harness tests, frontend bun test.
- `.github/workflows/deploy-prod.yml` — prod ECS deploy with OIDC.

**`.claude/` summary:** Agent instructions mirror the docs vault. ADRs load as rules; guardians watch PRD/API/ADR surfaces; hooks enforce SSOT discipline at edit time. Skills are self-contained copies — no dependence on a machine-global harness. The `kdx-send-to-telegram` skill includes a token file path that must never be quoted in summaries.

**`.docs/`:** Not present in this repository.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg`; corporate registry and client entity data are sensitive. This summary contains no secrets, tokens, connection strings with passwords, or `.env` contents.
- **Auth model:** Cognito OIDC (Google federation) establishes identity; Django session cookie carries it; authorization is Django Groups (`admins`, `ai_operators`, etc.) plus per-entity `EntityPermission` read/write grants. Lobby flow gates users without assigned roles (`adr-20-authorization-lobby`).
- **Frontend secret posture:** Frontend Fargate tasks receive only `PUBLIC_*` plain env — zero secrets in the browser bundle (`adr-10-auth` rule 7).
- **Accepted infra risks:** Fargate tasks run with public IPs and no NAT gateway by deliberate cost trade-off; documented in `docs/INFRASTRUCTURE.md`.
- **Audit:** `AuditLog` model records user actions on polymorphic targets; folio close uses immutable hash sealing.

## 10. Operational picture

**Local development**

```bash
docker compose --profile db up -d        # Postgres only
docker compose --profile backend up -d   # Django API + Postgres
docker compose --profile full up -d      # Adds frontend
python3 tests/test_docker_compose.py     # Layout verification
```

Backend tests: `cd backend && uv run pytest -m "not cognito_live and not bedrock_live"`. Frontend tests: `cd frontend && bun test`. Copy `.env.example` → `.env` for local names.

**CI (`ci.yml` on PR/push to `main`)**

- Backend: uv sync, `manage.py check`, pytest with service Postgres.
- Harness: auto-discovered `tests/test_*.py` except live-AWS `test_aws_infra.py`.
- Frontend: bun install + test when `frontend/package.json` exists.

**Deploy (`deploy-prod.yml` on `prod` branch)**

- OIDC to AWS — no long-lived keys.
- Build → ECR push → one-off migrate ECS task → update backend and frontend services.
- `PROJECT_SLUG` drives resource names; current seed value remains template reference `astro-drf-aws`.

**Agent verification:** Browser smoke tests use `chrome-devtools` MCP only under interactive `kodex` Unix user — not in CI or agent sandboxes (`AGENTS.md`).

## 11. Open questions / unknowns

- **Project slug rename:** Deploy workflow and glossary still reference `astro-drf-aws` as `PROJECT_SLUG` seed; whether production AWS resources will be re-provisioned under an `alvs-registros-*` slug is not evident from the tree — may still be template-phase naming.
- **SharePoint ingestion scope:** PRD emphasizes SharePoint-to-web connectivity; M365 app exposes demo Graph reads only (`/api/m365/hello/`, `/world/`). Full workbook ingestion pipelines for corporate documents are not visible in the API table — may be future work.
- **Production host mapping:** Exact prod hostname for this private fork depends on `PROJECT_SLUG` + `BASE_DOMAIN` at deploy time; not independently confirmed from manifests alone.
- **Legacy data migration:** Models document port from legacy REGISTROS; ETL/migration scripts for historical folio content are not surfaced in the shallow clone's top-level tooling.
- **Ephemeral vs permanent deploy:** Template `adr-12-ephemeral-run` describes a born-dead reference deploy; this private ALVS app's long-term infra posture (shared vs dedicated RDS) should be confirmed against `docs/INVENTORY.md` at deploy time.
