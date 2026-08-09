---
id: "cotton-dj-template"
title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS"
visibility: private
importance: normal
source_repo: "cotton-dj-template"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "template"
status: "experimental"
related: []
tags: ["django", "django-cotton", "tailwind", "htmx", "uv", "aws", "ecs", "fargate", "spec-kit", "server-rendered", "template", "allauth", "postgresql", "docker"]
problems_solved:
  - "Starting a new Django project forces repeated decisions on UI architecture, package management, auth, logging, and AWS deployment — this template codifies one curated stack so developers clone and build instead of re-deciding foundations."
  - "Django's default per-app template scattering makes component libraries hard to maintain; the template mandates centralized templates with django-cotton components and strict spacing rules."
  - "Teams wanting server-rendered interactivity without JavaScript frameworks lack a ready HTMX + Tailwind 4 + zero-JS pattern with documented conventions and agent scaffolding via Spec Kit."
technologies:
  - "Python 3.12+"
  - "Django 5.x"
  - "uv 0.9.7"
  - "django-cotton 2.1.3"
  - "Tailwind CSS 4.x (django-tailwind-cli)"
  - "HTMX 2.0+ / django-htmx"
  - "django-allauth 65.13.0"
  - "PostgreSQL 15+ / SQLite (dev fallback)"
  - "Redis / django-redis (optional dev, required prod)"
  - "Docker / ECS Fargate / ECR / RDS / S3 / Secrets Manager"
  - "Loguru / Pydantic / pydantic-settings"
  - "pytest / Playwright"
  - "GitHub Spec Kit workflow"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Cotton Django Template

> **Problem thesis (required):** Personal and internal Django projects repeatedly reinvent the same foundations — auth, component UI, Tailwind styling, HTMX interactivity, logging, Docker, and AWS ECS deployment. This private repository is an **opinionated Django 5 template specification** that solves that repetition by documenting and (when complete) shipping a single curated stack: django-cotton components with Tailwind 4 only, HTMX for server-driven UI with zero client-side JavaScript, django-allauth auth, uv-only package management, centralized `/templates/` architecture, and an AWS-native deployment path (Docker → ECR → ECS Fargate). It is currently **under construction** — the clone contains extensive planning docs, Spec Kit scaffolding, and Claude agent commands, but **no runnable Django application code yet**.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/cotton-dj-template` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Opinionated Django 5 template for component-first, HTMX-driven, Tailwind-styled web apps with AWS ECS deployment and Spec Kit–guided AI development. |
| Audience | kodexArg maintainers building personal or internal Django apps; AI coding agents (Claude Code, Cursor) extending the template via Spec Kit slash commands; future template consumers who clone and customize. |

## 2. Problems it solves

### P1 — Decision fatigue and inconsistent Django project bootstrapping

- **Who hurts:** Solo developers and small teams starting new Django projects who must repeatedly choose UI libraries, auth packages, logging, env config, and deployment targets.
- **Pain today:** Each new repo picks different stacks (React vs HTMX, pip vs poetry, scattered vs centralized templates), leading to incompatible conventions, slow onboarding, and no reusable component library.
- **How this repo answers:** Documents and will ship a **single curated stack** with pinned dependency versions in `docs/dependencies.md`, a 19-phase implementation plan in `docs/PRD.md`, and a non-negotiable `constitution.md` that locks architectural choices (uv-only, Tailwind 4 exclusive, zero JS, two breakpoints, centralized templates).
- **Out of scope:** General-purpose flexibility; multi-tenant SaaS; API-first backends; real-time WebSockets; CMS features.

### P2 — Fragmented Django template organization blocking reusable UI

- **Who hurts:** Developers maintaining django-cotton or Django template components spread across `apps/*/templates/` directories.
- **Pain today:** Django's default convention scatters HTML across apps, making refactors painful and component discovery difficult. Inconsistent margin/spacing rules break layouts when components are reused.
- **How this repo answers:** Mandates **centralized templates** under `/templates/` with `TEMPLATES[0]['DIRS']` pointing there; all django-cotton components live in `/templates/cotton/{category}/` with dot-notation tags (`<c-ui.button>`). The **zero exterior margins rule** (constitution constraint #1) ensures container-agnostic components — parents control positioning via `space-y-*` and grid/flex, never `m-*` on component roots.
- **Out of scope:** Per-app template directories; CSS frameworks other than Tailwind 4; client-side component frameworks (React, Vue, Alpine).

### P3 — Server-rendered interactivity without JavaScript frameworks

- **Who hurts:** Teams wanting modern UX (partial page updates, modals, infinite scroll) without maintaining a separate frontend build pipeline or SPA.
- **Pain today:** HTMX + Tailwind + Django integration patterns are documented ad hoc; teams fall back to React or write custom JS, violating simplicity goals.
- **How this repo answers:** **Zero JavaScript policy** — HTML5 semantic elements (`<details>`, `<dialog>`), modern CSS (`:has()`, container queries), and HTMX served from `/static/js/htmx.min.js` with django-htmx middleware (`request.htmx`). Documented HTMX patterns in `docs/architecture.md` and `docs/cotton-components.md`: form submissions, modals, lazy loading, OOB swaps. Tailwind compiled via django-tailwind-cli with **no Node.js**.
- **Out of scope:** WebSockets, Django Channels, async views, SPA architectures, npm/package.json frontend builds.

### P4 — Production-ready AWS deployment path from day one

- **Who hurts:** Developers who prototype locally then struggle to containerize and deploy to AWS with health checks, secrets management, and observability.
- **Pain today:** Templates ship without Docker, ECS task definitions, RDS/Redis wiring, or CloudWatch logging — production becomes a separate project.
- **How this repo answers:** Documents a **Development → Docker → ECR → ECS Fargate** pipeline in `docs/deployment.md` with multi-stage Dockerfile, non-root container user, `/health/` endpoint via django-health-check, AWS Secrets Manager injection, RDS PostgreSQL, ElastiCache Redis, S3 media/static, SES email via django-anymail, and CloudWatch via watchtower + Loguru structured JSON logging.
- **Out of scope:** Kubernetes, Terraform/CDK IaC (listed as future enhancement), EC2-based deployment, Heroku/Vercel targets.

### P5 — AI agent coherence during feature development

- **Who hurts:** AI coding agents dispatched to extend Django projects without architectural guardrails — they introduce JS frameworks, pip commands, scattered templates, or custom User models.
- **Pain today:** Agents lack a constitution, spec workflow, and slash commands; each session reinvents patterns and violates project constraints.
- **How this repo answers:** Ships **Spec Kit integration**: `.specify/memory/00-template-setup/constitution.md` (12 non-negotiable constraints), `.claude/commands/speckit-*.md` slash commands (specify → clarify → plan → tasks → analyze → implement), and `docs/spec-kit.md` workflow guide. Agents must read the constitution first and follow uv-only, no-comments (use Loguru), minimal try/except, and living documentation principles.
- **Out of scope:** The Spec Kit CLI itself (external tool); agent skills stored outside this repo.

## 3. Product / idea

The central idea is a **specification-first Django template** that a developer (or AI agent) clones to get a production-minded foundation without re-deciding technology choices. The mental model is:

```
Browser (HTML + Tailwind 4 + HTMX)
    ↕ HTTP (partial + full page)
Django 5 views + django-cotton components
    ↕ ORM
PostgreSQL (prod) / SQLite (dev) + optional Redis cache/sessions
    ↕ containerized
Docker → ECR → ECS Fargate (+ RDS, ElastiCache, S3, Secrets Manager, CloudWatch)
```

**Current state (important):** The repository README states **"under construction."** The shallow clone contains only documentation (`docs/`), Spec Kit memory (`constitution.md`), Claude agent commands (`.claude/commands/`), GitHub issue templates, and PRD — **not** the planned `apps/`, `config/`, `templates/`, `manage.py`, or `pyproject.toml`. The PRD's 19 implementation phases are largely unchecked. This repo today functions as an **architectural specification vault** and agent harness prelude, not a runnable application.

After the template is fully implemented, a consumer would: `uv sync` → configure `.env` from `.env.example` → `docker-compose up` for Postgres/Redis → `uv run manage.py tailwind runserver` → build features via Spec Kit workflow with cotton components and HTMX patterns.

### 3.1 North-star use cases

1. **Clone and run** — Developer copies template, has auth (django-allauth + Google OAuth), cotton component library, Tailwind 4, and HTMX working within minutes (`docs/installation.md` target: < 3 minutes to first `runserver`).
2. **Add a feature via Spec Kit** — Developer runs `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`; AI creates models, views, cotton components, and HTMX templates while respecting the constitution.
3. **Deploy to AWS** — Operator builds Docker image, pushes to ECR, deploys ECS Fargate task with Secrets Manager env injection; ALB health checks hit `/health/`.
4. **Extend component library** — Developer adds reusable `<c-ui.*>`, `<c-forms.*>`, `<c-feedback.*>`, `<c-navigation.*>` components under `/templates/cotton/` without exterior margins.

### 3.2 Non-goals

- API-first architecture (DRF installed as skeleton only; no pre-built REST endpoints per `docs/api.md`)
- Real-time features (WebSockets, Channels, async views)
- Multi-tenancy
- CMS functionality
- Mobile native app backends
- Kubernetes / Docker Swarm orchestration
- Custom User model (uses Django default + UserProfile OneToOne)
- Code comments in application code (constitution forbids; use Loguru logging and docstrings on public APIs only)
- Tablet-specific responsive breakpoints (`md:` forbidden; only base + `lg:`)

## 4. Technology stack

Derived from `docs/dependencies.md`, `docs/architecture.md`, and `docs/PRD.md`. No `pyproject.toml` or lockfile exists in the current tree — versions are documented targets.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.12+ | `docs/PRD.md`, `docs/installation.md` |
| Package manager | uv 0.9.7 (exclusive; no pip/poetry) | `docs/PRD.md`, `.specify/memory/00-template-setup/constitution.md` |
| Web framework | Django 5.x (5.1.2 documented) | `docs/dependencies.md` |
| Frontend / UI | django-cotton 2.1.3, Tailwind 4 via django-tailwind-cli 4.4.2, django-shadcn 0.1.0, HTMX 2.0+ local static | `docs/architecture.md`, `docs/cotton-components.md` |
| Interactivity | django-htmx 1.26.0 (zero JS policy) | `docs/architecture.md` |
| Auth | django-allauth 65.13.0 (email + Google OAuth, mandatory email verification) | `docs/models.md`, `docs/PRD.md` |
| API (skeleton) | djangorestframework 3.16.1 (no endpoints planned) | `docs/api.md` |
| Forms / filtering | django-filter 25.2 | `docs/dependencies.md` |
| Validation / config | pydantic 2.12.3, pydantic-settings 2.11.0 | `docs/environment.md` |
| Logging | loguru 0.7.3 (+ watchtower 3.3.6 for CloudWatch in prod) | `docs/architecture.md` |
| Models | django-model-utils 5.0.0 (TimeStampedModel, StatusModel) | `docs/models.md` |
| Database | PostgreSQL 15+ (prod/RDS), SQLite (dev fallback) | `docs/architecture.md` |
| Cache / sessions | django-redis 5.6.0 (optional dev locmem fallback) | `docs/environment.md` |
| Static / media | whitenoise 6.8.2 (dev/simple prod), django-storages + boto3 (S3 prod) | `docs/architecture.md` |
| Email | django-anymail 13.1 (AWS SES prod, console dev) | `docs/environment.md` |
| WSGI / health | gunicorn 23.0.0, django-health-check 3.20.0 | `docs/deployment.md` |
| Admin | django-unfold 0.69.0 (Tailwind admin theme) | `docs/dependencies.md` |
| Containerization | Docker multi-stage, docker-compose (Postgres + Redis) | `docs/deployment.md`, `docs/installation.md` |
| Cloud deploy | AWS ECR, ECS Fargate, RDS, ElastiCache, S3, Secrets Manager, CloudWatch, SES | `docs/deployment.md`, `docs/PRD.md` |
| Tests | pytest 8.4.2, pytest-django 4.11.1, playwright 1.55.0 | `docs/testing.md` |
| Dev tools | django-debug-toolbar 6.1.0, django-extensions 4.1 | `docs/dependencies.md` |
| AI / agents | Spec Kit workflow, `.claude/commands/speckit-*`, constitution | `.claude/commands/`, `.specify/memory/` |

### 4.1 Notable dependencies (curated)

- `django-cotton` — Primary UI architecture; all visual elements are reusable components with dot-notation tags.
- `django-tailwind-cli` — Compiles Tailwind 4 without Node.js/npm; `uv run manage.py tailwind runserver` is the dev entrypoint.
- `django-htmx` — Exposes `request.htmx` for partial-page rendering and HTMX-aware view branching.
- `django-allauth` — Handles login, signup, email verification, password reset, and Google OAuth without custom User model.
- `loguru` — Replaces stdlib logging; constitution mandates comprehensive DEBUG/INFO/WARNING/ERROR in all views.
- `pydantic-settings` — Type-safe `.env` loading with validation at startup.
- `django-health-check` — Provides `/health/` for ECS/ALB target group probes.
- `django-unfold` — Tailwind-styled Django admin matching the project's design system.
- `watchtower` — Streams structured JSON logs to CloudWatch in production.

## 5. Repository map (abstraction)

**Current tree (as cloned):** Documentation and agent scaffolding only. Planned application zones are specified in `docs/structure.md` and `docs/PRD.md` but not yet present on disk.

### Present zones

- **Root docs:** `README.md` — status banner ("under construction"), links to PRD and constitution.
- **Docs vault (`docs/`):** 14 markdown files covering architecture, API philosophy, components, dependencies, deployment, environment, guidelines, installation, models, PRD, spec-kit, structure, testing, and cotton-components guide.
- **Spec Kit memory (`.specify/memory/00-template-setup/`):** `constitution.md` only — the 12 non-negotiable architectural constraints. Planned `spec.md`, `plan.md`, `tasks.md` referenced in PRD but not yet committed.
- **Agent scaffolding (`.claude/`):** Seven Spec Kit slash command definitions (`speckit-specify`, `speckit-clarify`, `speckit-plan`, `speckit-tasks`, `speckit-implement`, `speckit-analyze`, `speckit-constitution`) plus `settings.local.json` (Bash/WebSearch permissions for uv, specify CLI, gh — no secrets).
- **GitHub templates (`.github/`):** Issue templates (bug report, feature request) and pull request template.

### Planned zones (documented, not yet in tree)

- **Entrypoints:** `manage.py`, `config/wsgi.py`, `config/urls.py`, `config/settings/{base,development,production}.py`
- **Domain apps:** `apps/core/` (home, dashboard), `apps/accounts/` (profile, settings beyond allauth)
- **Templates (centralized):** `/templates/base.html`, `/templates/layouts/`, `/templates/{app}/`, `/templates/allauth/`, `/templates/cotton/{ui,forms,feedback,navigation}/`
- **Static:** `/static/js/htmx.min.js`, `/static/css/` (Tailwind output)
- **Tests:** `/tests/` organized by 19 implementation phases
- **Container:** `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- **Config templates:** `.env.example`, `pyproject.toml` with uv lockfile

### Absent / not found

- **`.docs/` hidden vault:** Scanned; directory does not exist. All documentation lives in `docs/`.
- **Application source:** No `apps/`, `config/`, `templates/`, `static/`, `tests/`, `manage.py`, or `pyproject.toml`.
- **`.gitignore`:** Not present in current clone (referenced extensively in docs as planned).
- **CI/CD workflows:** No `.github/workflows/` in current tree (GitHub Actions deployment mentioned as future enhancement in PRD).

## 6. Configuration & contracts (no secrets)

### Environment variables (planned shapes from `docs/environment.md`)

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | Django cryptographic secret |
| `DJANGO_SETTINGS_MODULE` | `config.settings.development` or `config.settings.production` |
| `DEBUG` | Boolean; True only in development |
| `ALLOWED_HOSTS` | Comma-separated hostnames |
| `DATABASE_URL` | PostgreSQL DSN; SQLite fallback if unset in dev |
| `REDIS_URL` | Redis DSN; locmem cache fallback if unset in dev |
| `EMAIL_BACKEND` | Console backend (dev) or anymail SES (prod) |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_DEFAULT_REGION` | AWS SDK credentials (prod) |
| `AWS_STORAGE_BUCKET_NAME` / `AWS_S3_CUSTOM_DOMAIN` | S3 static/media + optional CloudFront |
| `AWS_SES_REGION_NAME` | SES email region |
| `CLOUDWATCH_LOG_GROUP` / `CLOUDWATCH_LOG_STREAM` / `AWS_REGION` | CloudWatch logging via watchtower |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth (optional) |
| `SECURE_SSL_REDIRECT` / `SECURE_PROXY_SSL_HEADER` | HTTPS enforcement (prod) |
| `SESSION_COOKIE_SECURE` / `CSRF_COOKIE_SECURE` | Secure cookies (prod) |

Production secrets intended for AWS Secrets Manager injection via ECS task definition — never committed. `.env.example` planned as documentation-only template.

### Django settings architecture (planned)

- `config/settings/base.py` — shared config, pydantic-settings loader, TEMPLATES DIRS pointing to `/templates/`, `COTTON_DIR = 'cotton'`
- `config/settings/development.py` — DEBUG, SQLite/Postgres, console email, locmem/Redis cache, debug toolbar
- `config/settings/production.py` — DEBUG=False, RDS, ElastiCache, S3, SES, CloudWatch, security headers

### Cloudflare bindings

N/A — this template targets AWS ECS, not Cloudflare Workers.

### 6.1 HTTP / API endpoints (when applicable)

**Current status:** No application code exists; endpoints below are **planned** from documentation.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/health/` | ECS/ALB liveness via django-health-check | none |
| `GET` | `/health/ready/` | Readiness probe (planned per `docs/testing.md`) | none |
| `GET` | `/health/live/` | Liveness probe (planned per `docs/testing.md`) | none |
| `GET`/`POST` | `/admin/` | Django admin (django-unfold theme) | staff session |
| `GET`/`POST` | `/accounts/login/` | django-allauth login | public |
| `GET`/`POST` | `/accounts/signup/` | django-allauth registration | public |
| `GET`/`POST` | `/accounts/logout/` | django-allauth logout | authenticated |
| `GET`/`POST` | `/accounts/password/reset/` | Password reset flow | public |
| `GET` | `/accounts/confirm-email/` | Email verification | token-based |
| `GET` | `/` | Core home page (planned `apps/core`) | public |
| `GET` | `/dashboard/` | User dashboard (planned) | authenticated |
| `GET`/`POST` | `/accounts/profile/` | Custom profile management (planned `apps/accounts`) | authenticated |

**REST API:** Explicitly N/A at template level. `docs/api.md` states DRF is a skeleton dependency with no pre-configured endpoints. API-first architecture is out of scope.

### 6.2 Other interfaces

- **Spec Kit slash commands (Claude Code):** `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-analyze`, `/speckit-implement`, `/speckit-constitution` — defined in `.claude/commands/`
- **Django management commands (planned):** `uv run manage.py tailwind runserver`, `migrate`, `createsuperuser`, `collectstatic`
- **Specify CLI (external):** Referenced in `.claude/settings.local.json` permissions (`specify check`, `uvx specify-cli`) for Spec Kit validation
- **Docker Compose:** `docker-compose up -d` for local PostgreSQL + Redis services

## 7. Data & persistence

### Stores (planned)

| Store | Role | Environment |
|-------|------|-------------|
| PostgreSQL 15+ | Primary relational DB | Production (AWS RDS Multi-AZ); dev via docker-compose |
| SQLite | Dev fallback | When `DATABASE_URL` unset |
| Redis (ElastiCache) | Cache + sessions | Required prod; optional dev with locmem fallback |
| S3 | Static files + media uploads | Production |
| Local filesystem | Media in dev | Development only |

### Important entities (planned from `docs/models.md`)

- **User** — Django default model (no customization); fields: username, email, first_name, last_name, is_active, is_staff, is_superuser
- **UserProfile** — OneToOne extension to User; created via post_save signal
- **EmailAddress, EmailConfirmation** — django-allauth email verification
- **SocialAccount, SocialApp, SocialToken** — Google OAuth linkage
- **Groups** — Visitor, Operator, Administrator for role-based access (not Django's built-in Groups used differently — three named groups assigned via signals)

Custom models will use django-model-utils mixins (TimeStampedModel, StatusModel). No custom User model by design.

### Topology

Single-tenant, monolithic Django app in one ECS Fargate service. Edge traffic via ALB → Gunicorn → Django. RDS and ElastiCache in same VPC. Static/media on S3 with optional CloudFront CDN. No edge Workers or multi-region design documented.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **`README.md`** — Project status (under construction), core stack summary, links to PRD/constitution/docs.
2. **`docs/PRD.md`** — Comprehensive 1400+ line strategic spec: design philosophy, 19-phase plan, technology stack with versions, component architecture, success metrics, out-of-scope list.
3. **`docs/architecture.md`** — Stack table, centralized template rationale, zero-JS policy, logging/error-handling philosophy, AWS deployment flow.
4. **`docs/api.md`** — Confirms no REST endpoints; DRF skeleton only; example patterns for future API addition.
5. **`docs/structure.md`** — Planned directory tree for apps, templates, config, tests.
6. **`docs/dependencies.md`** — Pinned package versions and installation order.
7. **`docs/environment.md`** — Env var names, pydantic-settings shape, dev vs prod secret handling.
8. **`docs/deployment.md`** — Local dev commands, Docker compose, AWS ECS deployment steps, health checks.
9. **`docs/installation.md`** — Prerequisites, clone/setup sequence, docker-compose YAML example.
10. **`docs/models.md`** — User model strategy, three user types, group-based access, signal patterns.
11. **`docs/cotton-components.md`** — Component categories, zero-margin rule, naming conventions, usage examples.
12. **`docs/spec-kit.md`** — Spec Kit workflow phases, quick start, feature development example.
13. **`docs/testing.md`** — Phase-organized test strategy, pytest + Playwright, no factory-boy principle.
14. **`docs/guidelines.md`** — Referenced for commit conventions (not fully ingested; deployment.md cites Conventional Commits).
15. **`.specify/memory/00-template-setup/constitution.md`** — 12 non-negotiable constraints, Spec Kit mandatory workflow, AI agent checklist.
16. **`.claude/commands/README.md`** — Slash command reference, workflow diagram, constitution compliance list.
17. **`.claude/commands/speckit-*.md`** — Seven command definitions for Spec Kit phases.
18. **`.claude/settings.local.json`** — Agent permission allowlist (no secrets).

### `.docs/` scan

Directory **does not exist** in the repository. No hidden docs vault beyond `docs/`.

### `.claude/` scan

Present with Spec Kit slash commands and local settings permissions. No skill files or large prompt trees beyond the seven `speckit-*.md` command definitions and README. Commands enforce constitution rules (zero margins, HTMX only, Tailwind 4, uv run, no comments, comprehensive logging).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — summary describes architecture without offering clone links as product CTAs. `related: []` per private repo rules.
- **Auth model (planned):** django-allauth with mandatory email verification; Google OAuth via env-configured credentials; session-based web auth; group-based RBAC (Visitor/Operator/Administrator). DRF skeleton configured for session + token auth if APIs are added later.
- **Secrets handling:** Constitution rule #12 — no secrets in Git, Docker images, or code. Dev uses `.env` (gitignored); prod uses AWS Secrets Manager via ECS task definition. pydantic-settings validates required vars at startup.
- **Security headers (planned):** CSP, X-Frame-Options, HSTS, secure cookies, CSRF with HTMX integration, HTTPS enforcement behind ALB.
- **Explicit:** This summary contains **no** secrets, private keys, connection strings with real passwords, or `.env` contents. `.claude/settings.local.json` contains only permission patterns.
- **Notable constitution rule:** Code comments are forbidden in application code — use Loguru logging instead (unusual security/maintainability tradeoff documented for agent awareness).

## 10. Operational picture

### Local development (planned commands from docs)

1. `uv sync` — install dependencies
2. `cp .env.example .env` — configure local env
3. `docker-compose up -d` — start PostgreSQL + Redis
4. `uv run manage.py migrate` — apply migrations
5. `uv run manage.py tailwind runserver` — dev server with Tailwind hot compile
6. `uv run pytest` — unit/integration tests
7. `uv run playwright test` — E2E browser tests

**Current reality:** Steps 1 and 4–7 cannot run — no `pyproject.toml` or `manage.py` exist yet.

### Deployment (planned)

1. `docker build` — multi-stage production image
2. Push to AWS ECR
3. ECS Fargate service update with new task definition
4. ALB health check on `/health/`
5. Secrets injected from AWS Secrets Manager
6. Migrations run via one-off ECS task or init container

No `.github/workflows/` present in current tree. PRD lists GitHub Actions for ECR/ECS as a future enhancement.

### Hardware constraints

None specific. Designed for standard ECS Fargate task sizes. Playwright E2E tests require browser binaries (dev/CI only). No GPU, RPi, or embedded targets.

## 11. Open questions / unknowns

- **Implementation completeness:** The template is documentation-only today. Unknown when Phases 1–19 from `docs/PRD.md` will land as actual code. README explicitly says "under construction."
- **Missing Spec Kit artifacts:** PRD references `spec.md`, `plan.md`, `tasks.md` under `.specify/memory/00-template-setup/` but only `constitution.md` exists in the clone.
- **Missing `.specify/commands/`:** PRD references custom commands (`new-component.md`, `deploy-aws.md`) — directory not present; only `.claude/commands/` exists.
- **No `pyproject.toml` / lockfile:** Dependency versions are documented in markdown but not yet materialized as installable project metadata.
- **No `.gitignore`:** Referenced throughout docs but file absent from current tree.
- **PRD visibility mismatch:** PRD header says "public GitHub template" but GitHub visibility flag for this assignment is `private` — may reflect a planned public release or doc drift.
- **Optional dev tools:** ruff, pre-commit, sentry-sdk, django-q2, factory-boy explicitly moved to optional — unknown if any will be added to core later.
- **CI/CD:** No GitHub Actions workflows in tree; deployment automation status unknown.
- **`.docs/` vault:** Does not exist; no hidden documentation layer beyond `docs/`.
