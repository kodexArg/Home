---
id: "welp-app"
title: "Welp App — internal purchase and payment workflow"
visibility: private
importance: normal
source_repo: "welp-app"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["django", "htmx", "tailwind", "postgresql", "aws", "ecs", "purchase-workflow", "payflow", "internal", "server-first", "vite", "pytest-bdd", "argentina"]
problems_solved:
  - "Purchase and payment requests across business units lack a single auditable workflow with role-based approvals, budget attachments, and dual authorization before payment."
  - "Finance and operations staff need tenant-scoped visibility (UDN and sector) without exposing tickets across organizational boundaries — with explicit gaps still tracked as security debt."
  - "Internal teams need a server-first web app with minimal JavaScript, live USD/ARS display for Argentine operations, and documentation dense enough for AI-assisted development."
technologies:
  - "Python 3.11+"
  - "Django 5.2"
  - "HTMX 2"
  - "Tailwind CSS 4"
  - "Vite 5"
  - "PostgreSQL 17"
  - "AWS ECS Fargate (target production)"
  - "AWS S3 + CloudFront (target production)"
  - "Gunicorn"
  - "uv + bun"
  - "pytest / pytest-bdd"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Welp App

> **Problem thesis (required):** Welp App is an internal management system whose core product is **Welp Payflow** — a role-based, server-rendered workflow for purchase and payment requests ("tickets") that move through authorization, budgeting, dual manager/director sign-off, payment processing, shipping, and closure. It exists because ad-hoc email or spreadsheet processes cannot enforce organizational boundaries (UDN, sector), preserve an auditable message history, attach budgets securely, or surface "needs attention" work queues per role. The stack deliberately favors Django + HTMX over a SPA so operators get fast, accessible pages with near-zero client JavaScript.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/welp-app` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Internal Django monolith for purchase/payment tickets with a data-defined status machine, granular roles per business unit and sector, and a server-first HTMX UI. |
| Audience | Internal operators at Grupo ALVS — end users opening requests, supervisors/managers/directors authorizing, technicians attaching budgets, purchase managers processing payments; developers and AI agents maintaining the codebase. |

## 2. Problems it solves

### P1 — Uncontrolled purchase/payment request flow

- **Who hurts:** End users, supervisors, managers, directors, technicians, and purchase managers across multiple business units (UDNs) and sectors who must coordinate buying and paying for goods/services.
- **Pain today:** Without a centralized system, requests scatter across informal channels; approvals are hard to trace; budgets and invoices lack a single attachment store; nobody has a reliable queue of "what needs my action now."
- **How this repo answers:** `welp_payflow` models tickets (`Ticket`, `Message`, `Attachment`) tied to `UDN`, `Sector`, and `AccountingCategory`. Status transitions are declared in `core/constants.py` (`PAYFLOW_STATUSES`) as a finite state machine with labels, allowed transitions, responsible roles, Mermaid diagram styling, and UI affordances (comment boxes, attachment uploads, amount inputs). Each transition creates `Message` rows forming an auditable timeline. `TicketManager` filters visibility and powers a "needs attention" view based on role-specific status lists.
- **Out of scope:** General ERP, inventory, vendor master data, accounting ledger posting, or external supplier portals. DRF is installed but no REST API surface is wired; the product is browser HTML, not a public API.

### P2 — Multi-tenant organizational scoping without a separate database per unit

- **Who hurts:** Staff who must only see tickets for their UDN/sector; security reviewers ensuring cross-tenant isolation.
- **Pain today:** Shared tools often leak data when queries fetch by primary key alone; role matrices sprawl across views.
- **How this repo answers:** `Roles` links users to `(UDN, Sector, role_type)` with permissions derived from `PAYFLOW_ROLE_PERMISSIONS` on save. `welp_payflow/utils.py` centralizes authorization (superuser → staff → role checks). `Ticket.objects.get_queryset(user)` scopes list/detail queries. Templates hide actions via server-side `{% if %}` checks — no client-side permission logic.
- **Out of scope:** Perfect isolation today — documented **IDOR debt** remains on `htmx_single_ticket` and `AttachmentView` (see `docs/devops/security.md`); authenticated users can still read some tickets/attachments by ID until fixed.

### P3 — Maintainable internal UI for Argentine currency context

- **Who hurts:** Users entering amounts in USD or ARS; finance staff needing official exchange rates without blocking page renders.
- **Pain today:** Live FX calls on every page slow ticket lists; toggling display currency requires heavy JS frameworks.
- **How this repo answers:** Amounts stored in USD (`Ticket.estimated_amount`); optional per-ticket `quote_amount`. Official ARS rate fetched from DolarAPI, cached three hours (`PAYFLOW_USD_CACHE_TIMEOUT`), refreshed via HTMX background endpoint with `HX-Trigger` for reactive UI updates. Currency preference stored in a cookie; minimal JS confined to `frontend/js/core/ticket-amount.js` where HTMX cannot suffice.
- **Out of scope:** Treasury hedging, multi-currency beyond USD/ARS, or guaranteed real-time FX during API outages (falls back to last cache or "no rate").

## 3. Product / idea

Welp App is a **server-first Django monolith**. The browser talks HTTP and HTMX to Gunicorn/Django; Django renders HTML templates with inclusion-tag components (`templates/core/components/`, `templates/welp_payflow/partials/`). Interactivity is layered: native HTML5 first, then HTMX partial swaps, then Alpine.js only as last resort, then small Vite-bundled JS modules for attachments and currency.

The mental model:

```text
Browser ──HTTP/HTMX──▶ Gunicorn ──▶ Django (WSGI)
                                    ├── core           (auth, health, currency, dev tools, User model)
                                    └── welp_payflow   (tickets, workflow, roles, attachments)
                                           │
                                           ├──▶ PostgreSQL      (production data)
                                           ├──▶ S3 + CDN        (prod media/static; filesystem locally)
                                           └──▶ DolarAPI        (official USD/ARS, cached)
```

Root URL redirects to `/payflow/`. Users log in via `/core/login/`; `GlobalAuthMiddleware` enforces authentication on all non-exempt paths. Payflow home offers navigation to create tickets, list/filter tickets, and view detail pages with Mermaid workflow diagrams per ticket.

### 3.1 North-star use cases

1. **End user opens a request** — Select UDN → sector → accounting category (cascading HTMX partials), enter title/amount, submit; ticket starts in `open` status.
2. **Supervisor authorizes → technician budgets** — Role-appropriate transitions move `open → authorized → budgeted` with required comments and PDF budget attachments.
3. **Dual authorization and payment** — Manager and director authorize (`authorized_by_manager`, `authorized_by_director`); system may auto-insert `payment_authorized`; purchase manager processes payment through `processing_payment`, `shipping`, `closed`.
4. **Operator triage** — List view lazy-loads ticket rows on viewport intersection with `hx-sync` queue and staggered CSS reveal (`docs/features/ticket-loading.md`). Session-persisted filters (UDN, sector, status, needs attention) narrow the queue.

### 3.2 Non-goals

- Not a customer-facing or multi-tenant SaaS product; private internal deployment for ALVS group conventions.
- Not a JavaScript-heavy SPA; explicit "zero-JavaScript default" in `AGENTS.md` and `.claude/skills/kdx-zero-javascript-enforcer/`.
- Not a completed cloud rollout — ECS/Fargate, ECR, Dockerfile, and full GitHub Actions deploy pipeline are **planned** (`docs/deployment/cicd.md`, `docs/architecture/cloud-architecture.md`); only lint CI exists today.
- Not a generic workflow engine — status machine is Payflow-specific Python data in `core/constants.py`, not a reusable rules DSL.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.11+ | `pyproject.toml` (`requires-python`) |
| Backend | Django 5.2, Gunicorn, django-htmx, django-components, django-vite | `pyproject.toml`, `project/settings.py` |
| API layer | Django REST Framework installed; no routed API views found | `project/settings.py` (`rest_framework` in `INSTALLED_APPS` only) |
| Frontend | HTMX 2, Tailwind CSS 4 (`@tailwindcss/vite`), Alpine.js 3, Mermaid 11 | `package.json`, `vite.config.mjs` |
| Build | Vite 5 → `static/dist/` + manifest; bun 1.3.x | `package.json`, `vite.config.mjs` |
| Database | PostgreSQL 17 (dev/prod); SQLite in-memory under pytest | `project/settings.py`, `docs/architecture/architecture.md` |
| Storage | Filesystem locally; `core.storage.CustomS3Storage` in production | `project/settings.py`, `core/storage.py` |
| Infra / deploy | Target: AWS ECS Fargate, ECR `alvs/welp-backend`, ALB, CloudFront, Secrets Manager | `docs/architecture/cloud-architecture.md` |
| CI | GitHub Actions Ruff format/lint on `main` PRs | `.github/workflows/lint.yml` |
| AI / agents | `AGENTS.md`, `docs/`, `.claude/skills/`, `.agents/skills/` | tree scan |
| Tests | pytest, pytest-django, pytest-bdd, pytest-ruff, djlint | `pyproject.toml`, `features/` |

### 4.1 Notable dependencies (curated)

- `django-htmx` — HTMX request detection and partial rendering for nearly all interactive UI.
- `django-vite` — Bridges Django templates to Vite dev server (HMR) or hashed production assets.
- `django-storages` + `boto3` — S3-backed media and static files in non-local environments.
- `Pillow` — Image handling for user avatars and attachment previews.
- `loguru` — Structured logging wrapper in `core/logger.py`.
- `requests` — DolarAPI HTTP client for official exchange rate.
- `pytest-bdd` — Gherkin acceptance tests under `features/` (smoke scenario present; strategy docs describe fuller BDD loop).
- `ruff` + `djlint` — Python and Django template formatting/linting; format is a CI gate, lint advisory until backlog cleared.

## 5. Repository map (abstraction)

- **Entrypoints:** `manage.py` (Django CLI); `project/wsgi.py` / `project/asgi.py` (WSGI/ASGI); `scripts/run-dev.py` (starts Vite + Django); `scripts/start.sh` (container-oriented prod boot: migrate, collectstatic, gunicorn); `scripts/run-deploy.py` (manual deploy helper).
- **Django config:** `project/settings.py` (env-driven flags `IS_LOCAL`, `TESTING`, storage backends, security headers); `project/urls.py` (root redirects, includes `core/` and `payflow/`).
- **Core app (`core/`):** Custom `User` model (`core/models.py`); `GlobalAuthMiddleware` (`core/middleware.py`); auth views (`core/views/auth.py`); health checks (`core/views/health.py`); currency endpoints (`core/views/currency.py`, `core/views/home.py`); `PAYFLOW_STATUSES` and role matrix (`core/constants.py`); template-tag component libraries (`core/templatetags/`).
- **Domain app (`welp_payflow/`):** Models (`UDN`, `Sector`, `AccountingCategory`, `Roles`, `Ticket`, `Message`, `Attachment`); permission/workflow helpers (`utils.py`); page views (`views/ticket_views.py`); HTMX partials (`views/htmx_views.py`); attachments and errors (`views/utility_views.py`); URL table (`urls.py`).
- **Templates:** `templates/core/` (base layout, login, dashboard, dev playground, reusable components); `templates/welp_payflow/` (index, list, detail, create, success, partials for filters and lazy ticket rows).
- **Frontend source:** `frontend/main.js`, `frontend/main.css`, `frontend/css/` (Tailwind utilities), `frontend/js/` (payflow create/success/attachments, currency toggle, mermaid init, dev tools). Build output lands in `static/dist/` (generated — do not edit).
- **Scripts & seed:** `scripts/init_app.py`, `scripts/init_users.py`, `scripts/seed_payflow.py`, `scripts/init_payflow.yaml`, `scripts/update_supervisors.py` — bootstrap UDNs, sectors, roles, demo users.
- **Docs vault (`docs/`):** SSOT index at `docs/index.md` with YAML frontmatter on every doc; architecture, deployment, development, testing strategy, design system, features, audits, integrations. No `.docs/` hidden vault present in tree.
- **Agent scaffolding:** `.claude/skills/` and mirrored `.agents/skills/` — orchestrator, HTMX expert, zero-JS enforcer, Tailwind design system, Django refactor, BDD/QA patterns, AWS diagrams. `AGENTS.md` is symlinked as `CLAUDE.md`.
- **BDD features:** `features/core/smoke_test.feature` (pytest-bdd wiring smoke test).
- **CI / templates:** `.github/workflows/lint.yml`; issue template `bug_report.md`.
- **Generated / vendor:** `static/dist/`, `uv.lock`, `bun.lock`, `node_modules/` (gitignored) — noted but not ingested.

## 6. Configuration & contracts (no secrets)

Environment variables are loaded via `python-dotenv` from `.env` locally; production expects platform-injected vars from AWS Secrets Manager (`alvs/{prod,dev}/welp/{db,django,s3}` per cloud architecture doc).

| Variable / group | Purpose |
|------------------|---------|
| `SECRET_KEY` | Django signing; required in non-test runs (no insecure default outside `TESTING`) |
| `DEBUG`, `IS_LOCAL` | Dev vs production behavior switches |
| `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS` | Host and CSRF validation (comma-separated) |
| `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | PostgreSQL connection (skipped when `TESTING` uses SQLite) |
| `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_REGION_NAME`, `AWS_S3_CUSTOM_DOMAIN` | S3 + CDN for media/static when not local |
| `AWS_S3_MEDIA_LOCATION`, `AWS_S3_STATIC_LOCATION` | S3 key prefixes (defaults `welp/media`, `prod/static`) |
| `LOG_LEVEL`, `LOG_LEVEL_DJANGO`, `LOG_LEVEL_APP` | Logging verbosity |
| `PAYFLOW_MAX_FILE_SIZE_MB`, `PAYFLOW_TICKET_LIST_LIMIT` | Upload cap and list pagination |
| `PAYFLOW_TICKET_LOAD_DELAY`, `PAYFLOW_TICKET_FADE_IN_DURATION` | UI stagger timing (ms) |
| `PAYFLOW_USD_CACHE_TIMEOUT` | FX cache TTL (seconds) |
| `APP_NAME`, `APP_META_DESCRIPTION` | Template branding |
| `DJANGO_SUPERUSER_*` | Optional bootstrap for `scripts/init_app.py` |
| `DEPLOY_BRANCH` | Deploy script branch hint (default `prod`) |
| `LANGUAGE_CODE`, `TIMEZONE` | Defaults `es-ar`, `America/Argentina/Buenos_Aires` |

Django `STORAGES` selects filesystem vs `CustomS3Storage` based on `IS_LOCAL`. `DJANGO_VITE` points dev server at port 5173. Session cookies: 14-day age, secure flags when not local, CSRF token in session.

### 6.1 HTTP / API endpoints (when applicable)

Primary surface is **server-rendered HTML + HTMX partials**, not a JSON API. Documented routes:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Redirect to Payflow index | public redirect |
| `GET` | `/core/login/` | Login form | public |
| `POST` | `/core/login/` | Authenticate | public |
| `GET` | `/core/logout/` | Logout | session |
| `GET` | `/core/dashboard/` | User dashboard | session |
| `GET` | `/core/user-panel/` | User control panel | session |
| `GET`/`POST` | `/core/change-password/` | Password change | session |
| `GET` | `/core/health/` | Liveness | none (health exempt) |
| `GET` | `/core/health/db/` | DB connectivity check | none (health exempt) |
| `GET`/`POST` | `/core/toggle-currency/` | Currency display preference | session |
| `GET` | `/core/get-official-rate/` | Fetch/cached official FX | session |
| `GET` | `/core/dolar-oficial/` | Dolar display partial | session |
| `GET` | `/payflow/` | Payflow home/index | session |
| `GET` | `/payflow/list/` | Ticket list shell | session |
| `GET` | `/payflow/ticket/<id>/` | Ticket detail | session |
| `GET`/`POST` | `/payflow/create/` | Create ticket | session + role |
| `GET` | `/payflow/success/<id>/` | Post-create success | session |
| `GET` | `/payflow/whats-new/` | Release notes page | session |
| `GET` | `/payflow/ticket/<id>/attachment/<aid>/` | Serve attachment | session (IDOR risk) |
| `POST` | `/payflow/ticket/<id>/transition/<status>/` | Workflow transition | session + role |
| `GET`/`POST` | `/payflow/ticket/<id>/close/confirm/` | Close confirmation | session + role |
| `POST` | `/payflow/ticket/<id>/close/process/` | Process close | session + role |
| `GET` | `/payflow/error/permission-denied/` | Permission error page | session |
| `GET` | `/payflow/htmx/udn/` | HTMX UDN selector partial | session |
| `GET` | `/payflow/htmx/sectors/<udn>/` | HTMX sector partial | session |
| `GET` | `/payflow/htmx/categories/<sector>/` | HTMX accounting category partial | session |
| `GET` | `/payflow/htmx/fields-body/<category>/` | HTMX dynamic form fields | session |
| `GET` | `/payflow/htmx/list-content/` | HTMX filtered list body | session |
| `GET` | `/payflow/htmx/ticket/<id>/` | HTMX single ticket row | session (IDOR risk) |
| `GET` | `/payflow/htmx/ticket-amount/<id>/` | HTMX amount display | session |
| `POST` | `/payflow/htmx/filter-apply/` | Apply session filters | session |
| `POST` | `/payflow/htmx/filter-clear/` | Clear filters | session |
| `GET` | `/payflow/htmx/filter-close/` | Close filter modal | session |
| `POST` | `/payflow/htmx/needs-attention-toggle/` | Toggle needs-attention filter | session |
| `GET` | `/payflow/htmx/sync-filter-buttons/` | Sync filter UI state | session |
| `GET` | `/payflow/htmx/update-rate/` | Background FX refresh | session |
| `GET` | `/admin/` | Django admin | superuser only |
| `GET` | `/core/dev/*` | Dev playground (DEBUG only) | staff |

No DRF router or OpenAPI spec found; REST framework is a dependency only.

### 6.2 Other interfaces

- **CLI:** `uv run manage.py` (migrate, createsuperuser, shell, etc.); `uv run pytest` with markers (`core`, `welp_payflow`, `htmx`, `p0`, `wip`, `slow`); `uv run djlint templates/ --check`.
- **Init scripts:** `uv run scripts/init_app.py` seeds organizational data and users from YAML; `scripts/seed_payflow.py` for demo tickets.
- **Agent skills:** `.claude/skills/kdx-welp-orchestrator` documents local bring-up (Postgres container `welp-db`, Vite :5173, Django :8000, browser verification via chrome-devtools MCP).
- **Release notes:** `whats_new.json` consumed by WhatsNew view.

## 7. Data & persistence

- **PostgreSQL** is the production system of record for users, roles, tickets, messages, and attachment metadata. Connection pooling via `CONN_MAX_AGE=600` with health checks.
- **Tests** use in-memory SQLite automatically when `TESTING` is true (pytest or `manage.py test`), enabling fast BDD/unit runs without Postgres.
- **Object storage:** Ticket attachment files (`Attachment.file`) upload to `payflow_attachments/YYYY/MM/DD/ticket_<id>_<filename>` paths; local `mediafiles/` in dev, S3 behind CloudFront in production.
- **Cache:** Django `LocMemCache` for USD/ARS official rate (`welp-cache` location).
- **Key entities:** `core.User` (extends `AbstractUser` with phone, avatar); `UDN` (business unit); `Sector` (many-to-many with UDN); `AccountingCategory` (scoped to sectors); `Roles` (user + UDN + sector + role type + boolean permission flags); `Ticket` (UDN, sector, category, title, `estimated_amount`, `quote_amount`, timestamps); `Message` (status timeline, comment/system types); `Attachment` (linked to messages).
- **Topology:** Single-region AWS target (`us-east-1`) with shared ALVS ECS clusters (`alvs-prod`, `alvs-dev`), shared RDS instances hosting per-app databases (`welp_db` to be created), per-app S3 media buckets, and grouped Secrets Manager JSON secrets — edge delivery via CloudFront to ALB for dynamic HTML and to S3 for media.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **Root README** — `README.md` — product pitch, stack, quick start commands.
2. **Agent SSOT** — `AGENTS.md` (also `CLAUDE.md` symlink) — hard rules (zero-JS default, Tailwind 4 only, docs-first), layout map, test commands, AI working loop.
3. **Docs index** — `docs/index.md` — full documentation taxonomy with frontmatter metadata.
4. **Architecture** — `docs/architecture/architecture.md`, `docs/architecture/cloud-architecture.md` — monolith shape, AWS target topology, secrets layout (keys only).
5. **Features** — `docs/features/payflow-workflow.md`, `permissions.md`, `ticket-loading.md`, `usd-ars-conversion.md`.
6. **Deployment** — `docs/deployment/deployment.md`, `docs/deployment/cicd.md` — manual deploy steps, planned GitHub Actions → ECR → ECS pipeline.
7. **Security** — `docs/devops/security.md` — transport hardening, auth model, known IDOR debt.
8. **Development** — `docs/development/development.md`, `ai-first-loop-workflow.md`, `code-style.md`, `reporting-issues.md`.
9. **Testing** — `docs/tests/strategy-overview.md` and sibling strategy docs (unit, models, HTMX, BDD).
10. **Design system** — `docs/design-system/design-system.md`, `styles.md`, `components.md`.
11. **Audits** — `docs/audits/` — deployment gaps (missing Dockerfile/IaC, dotenv override risk, thin test coverage, unpinned prod deps).
12. **`.claude/skills/`** — agent skills for orchestration, HTMX patterns, zero-JS enforcement, Tailwind design system, Django refactor, BDD/QA, AWS diagrams. `kdx-welp-orchestrator` is the operational runbook for local dev environment lifecycle.
13. **`.agents/skills/`** — mirror of `.claude/skills/` (same skill set).
14. **`.docs/`** — **not present** in repository; scan attempted, no hidden docs vault found.
15. **CHANGELOG** — `CHANGELOG.md` — recent doc frontmatter work, test baseline (~262 passing), Ruff hygiene.
16. **Env contract** — `.env.example` — variable names and purposes only (no live values copied).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository; summary contains no clone URLs, credentials, or live hostnames beyond what architecture docs name for deployment planning.
- **AuthN:** Django session cookies; global middleware requires login except explicit exempt paths (login, logout, health, static/media, root redirect). Minimum password length 10 with standard Django validators.
- **AuthZ:** Three-tier model — superuser (full + admin), staff (full Payflow, no admin), regular users scoped by `Roles` per UDN/sector. Admin path locked to superusers only.
- **Transport:** When `IS_LOCAL` is false — SSL redirect, HSTS, secure cookies, CSRF in session, proxy SSL header for ALB termination.
- **Known debt:** High-severity IDOR on HTMX single-ticket partial and attachment detail view — any authenticated user may access arbitrary ticket/attachment IDs until queryset scoping is fixed; regression tests expected with marker `p0`.
- **Upload limits:** Max 10 files, 50 MB per file (`PAYFLOW_MAX_FILE_SIZE`); S3 with no public ACL, no overwrite.
- **This summary contains no secrets**, private keys, connection strings with passwords, or `.env` contents.

## 10. Operational picture

**Local development:**

```bash
uv sync && bun install
cp .env.example .env    # configure Postgres + SECRET_KEY
uv run manage.py migrate
uv run scripts/init_app.py    # first-run seed
uv run scripts/run-dev.py     # Vite :5173 + Django :8000
```

Postgres required for dev (tests alone can run on SQLite). Agent orchestrator skill documents optional `welp-db` Docker container on machines without native Postgres.

**Testing:**

```bash
uv run pytest
uv run pytest -m htmx
uv run djlint templates/ --check
```

**CI (current):** `.github/workflows/lint.yml` on push/PR to `main` — `uv sync --frozen`, `ruff format --check` (hard gate), `ruff check` (advisory `continue-on-error: true`).

**Deployment (target / partial):** Multi-stage Docker image (frontend build + Python + Gunicorn on port 8000) pushed to ECR `alvs/welp-backend`, rolled via ECS service `welp-backend` on clusters `alvs-prod` / `alvs-dev`. **Dockerfile not yet in repo** (`docs/audits/deployment/missing-dockerfile-and-iac.md`). Manual path via `scripts/run-deploy.py` and AWS CLI until full pipeline lands. Container entrypoint pattern described in `scripts/start.sh` (migrate, collectstatic, seed, superuser, gunicorn).

**Hardware constraints:** Fargate task definition target 256 CPU / 512 MB (revisit under load). No GPU or edge-device requirements.

## 11. Open questions / unknowns

- **Production deployment status:** Cloud architecture doc marks most Welp-specific AWS resources (ECR, ECS service, S3 buckets, CloudFront aliases, secrets) as "to create"; unclear how much is provisioned outside the repo.
- **Dockerfile / IaC:** Absent from tree; container build and infrastructure-as-code may live elsewhere or remain TODO.
- **DRF intent:** `djangorestframework` is a dependency without routed views — future JSON API or legacy install unclear.
- **Data anomaly:** `payment_authorized.transitions` lists invalid keys `manager` and `director` alongside `processing_payment` per `docs/features/payflow-workflow.md`.
- **Test coverage depth:** Audit notes thin coverage in places; CHANGELOG cites 262 passing tests but full BDD feature set beyond smoke test not verified in shallow scan.
- **`.docs/` vault:** Not found; all documentation appears under public `docs/` with Obsidian-oriented frontmatter.
- **Sibling app parity:** Deployment conventions mirror `sroa` and `kcbd` backends in the same AWS account; exact sharing of ALB listener rules and secret rotation practices not fully documented in-repo.
