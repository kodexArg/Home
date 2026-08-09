---
id: "dj-apprunner-template"
title: "dj-apprunner-template — Django starter for AWS App Runner with Vite, HTMX, and S3 static delivery"
visibility: public
importance: normal
source_repo: "dj-apprunner-template"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "template"
status: "template"
related: []
tags:
  - "django"
  - "aws"
  - "app-runner"
  - "postgresql"
  - "rds"
  - "s3"
  - "cloudfront"
  - "gunicorn"
  - "vite"
  - "tailwind"
  - "htmx"
  - "django-components"
  - "django-vite"
  - "secrets-manager"
  - "iam"
  - "uv"
  - "python"
  - "starter-template"
problems_solved:
  - "Teams starting a Django project on AWS App Runner lack a proven baseline that wires together RDS PostgreSQL, S3/CloudFront static hosting, Secrets Manager, IAM instance roles, Gunicorn runtime, and a modern frontend toolchain — forcing every new project to rediscover the same integration pitfalls."
  - "Django + Vite + Tailwind + HTMX + django-components is a powerful but finicky stack: asset manifests, collectstatic timing, offline CDN-free production, and App Runner build phases must align or deployments fail silently with missing CSS/JS."
  - "Operators need a living verification dashboard and health endpoints to confirm each layer (DB, S3, frontend build, HTMX, components) is wired correctly after deploy — not just a bare 'Hello World' scaffold."
technologies:
  - "Python 3.11"
  - "Django 5"
  - "Gunicorn"
  - "PostgreSQL (RDS)"
  - "AWS App Runner"
  - "AWS S3 + CloudFront"
  - "AWS Secrets Manager"
  - "boto3 / django-storages"
  - "Vite 5"
  - "Tailwind CSS v4"
  - "HTMX 2"
  - "django-vite"
  - "django-htmx"
  - "django-components"
  - "Loguru"
  - "uv (dependency installer)"
  - "pytest / pytest-django"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# dj-apprunner-template

> **Problem thesis (required):** This repository is a **production-oriented Django starter template** for AWS App Runner. It solves the recurring pain of bootstrapping a Django web app that must run on App Runner behind HTTPS, talk to RDS PostgreSQL, serve static and media assets from S3 via CloudFront (no external CDNs), inject secrets from AWS Secrets Manager, and ship a modern frontend built with Vite, Tailwind v4, HTMX, and django-components — all with a documented build pipeline split across App Runner pre-build, build, and runtime phases. The home page doubles as a **Technology Verification Dashboard** so operators can confirm each stack layer is alive after deploy. Authentication, REST APIs, and OAuth2 are explicitly marked as future work.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/dj-apprunner-template` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Clone-ready Django 5 template with App Runner manifest, RDS + S3/CloudFront integration, Secrets Manager wiring, and a Vite/Tailwind/HTMX/django-components frontend that builds inside App Runner and self-verifies on the home page. |
| Audience | Backend developers starting new Django projects on AWS App Runner; DevOps operators configuring IAM roles, RDS, S3, and Secrets Manager; Cursor IDE agents guided by `.cursor/rules/`; teams wanting an offline-capable frontend stack without CDN dependencies. |

## 2. Problems it solves

### P1 — Repeat AWS integration work for every new Django App Runner project

- **Who hurts:** Developers and operators who want Django on App Runner with managed PostgreSQL and S3-backed static files — not a toy SQLite demo.
- **Pain today:** Each greenfield project must manually stitch together `apprunner.yaml` build phases, Gunicorn binding on port 8080, RDS connection env vars, Secrets Manager secret references, IAM instance-role policies for S3 and `GetSecretValue`, django-storages configuration, CSRF/HTTPS proxy headers for App Runner, and runtime `collectstatic` after secrets are available.
- **How this repo answers:** Ships a working `apprunner.yaml` with a three-phase build (system Node install + `npm run build`, Python `uv` venv + pip install, runtime `scripts/start.sh`), `project/settings.py` with production/local branching via `IS_LOCAL`, PostgreSQL `DATABASES` from env vars, S3 `STORAGES` backends when not local, hardened cookie/CSRF settings for HTTPS behind App Runner proxy, and README documentation of required IAM policies and secret key shapes (names only, no values).
- **Out of scope:** Multi-region HA, blue/green deploy orchestration, Terraform/CDK for provisioning AWS resources (template assumes resources already exist), Docker/ECS paths.

### P2 — Frontend toolchain friction on serverless Python hosts

- **Who hurts:** Teams wanting Vite HMR locally but hashed production bundles on S3 — without shipping `node_modules` to runtime or relying on public CDNs for HTMX/Tailwind.
- **Pain today:** App Runner Python runtimes lack Node by default; `collectstatic` during build cannot see runtime secrets; django-vite manifest paths drift; favicon and unimported assets get dropped from Vite output; Tailwind v4 + `@tailwindcss/vite` plugin must be configured for Django template/component paths.
- **How this repo answers:** Pre-build phase downloads Node 20.x into `/tmp/.node`, runs `npm install` and `npm run build`, outputting to `static/dist/` with `manifest.json`. `vite.config.mjs` uses `@tailwindcss/vite`, `vite-plugin-static-copy` for favicon, and scans `templates/`, `components/`, `frontend/`. `django-vite` toggles dev mode via `IS_LOCAL`. `frontend/main.js` bundles HTMX with CSRF-aware defaults. README states the stack is **fully offline in production** once deployed (all assets from S3/CloudFront).
- **Out of scope:** SSR frameworks (React/Vue SPA shell), WebSocket real-time, service-worker PWA.

### P3 — Post-deploy confidence without manual smoke testing

- **Who hurts:** Operators who deploy and need to know immediately whether DB, S3, Vite build, HTMX, and django-components are correctly wired.
- **Pain today:** Generic health checks return 200 even when static manifest is broken; DB failures surface only on first ORM query; component CSS/JS registration errors appear as blank UI.
- **How this repo answers:** Home page (`templates/core/home.html`) renders a four-card **Technology Verification Dashboard** (Vite, Tailwind, HTMX, Components) with live HTMX probes to `/core/health/`, `/core/health/db/`, `/core/hello/`, and an HTMX demo endpoint. A `ping` django-component demonstrates per-component Media (CSS/JS). `scripts/start.sh` runs migrations, `collectstatic`, superuser bootstrap, and the full pytest suite before Gunicorn starts — failing fast on misconfiguration.
- **Out of scope:** Synthetic monitoring SaaS, APM dashboards, load testing.

## 3. Product / idea

The mental model is a **single Django monolith** deployed on App Runner that serves server-rendered HTML with progressive enhancement via HTMX, styled by Tailwind (built through Vite), and composed with django-components. In production, the app process handles dynamic requests via Gunicorn on port 8080; static assets and logs (via Loguru S3 sink) land in a configured S3 bucket fronted by CloudFront. In local dev (`IS_LOCAL=True`), filesystem storage replaces S3 and Vite dev server provides HMR.

The repository is intentionally a **template**, not a finished product: `core/models.py` is empty (no domain models beyond Django auth), and README lists authentication and REST API as next steps.

### 3.1 North-star use cases

1. **Fork and deploy:** Clone the template, provision RDS + S3 + Secrets Manager secrets matching the documented key names, attach IAM policies to the App Runner instance role, push to `main`, and let App Runner CI/CD build and run `scripts/start.sh`.
2. **Local full-stack dev:** Create `.env` from the sample in `.cursor/rules/entorno.mdc`, run `uv pip install -r requirements.txt`, `npm install`, then either `scripts/dev.ps1` (Windows PowerShell, starts Vite job + Django) or parallel `python manage.py runserver` and `npm run dev`.
3. **Verify stack after deploy:** Open `/` and confirm all four technology cards show green; click HTMX health/DB/hello links; confirm `ping` component renders PONG.
4. **Extend with components:** Follow `.cursor/rules/django-components.mdc` to add new components under `components/{app}/nombre_componente/` and register imports in `{app}/apps.py`.

### 3.2 Non-goals

- Django authentication beyond default admin (planned: OAuth2) — not implemented.
- REST API / JWT / OpenAPI — explicitly listed as future work in README.
- Docker or ECS deployment paths — App Runner only per cursor rules.
- Domain models or business logic — `core` app is scaffold-only.
- GitHub Actions workflow files — no `.github/` directory present; deploy is described as push-to-`main` triggering App Runner native CI/CD.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.11 | `apprunner.yaml` `runtime: python311` |
| Web framework | Django 5 (unpinned in requirements) | `README.md`, `requirements.txt` (`django`) |
| WSGI server | Gunicorn | `requirements.txt`, `scripts/start.sh` |
| Database | PostgreSQL via RDS | `project/settings.py` `DATABASES`, `apprunner.yaml` env `DB_*` |
| Object storage / CDN | S3 + CloudFront via django-storages | `project/settings.py` `STORAGES`, `apprunner.yaml` AWS env vars |
| Secrets | AWS Secrets Manager (runtime injection) | `apprunner.yaml` `run.secrets` block |
| AWS SDK | boto3 | `requirements.txt`, `tests/test_integration.py` |
| Frontend build | Vite 5, Tailwind v4 (`@tailwindcss/vite`) | `package.json`, `vite.config.mjs`, `tailwind.config.js` |
| Frontend runtime | HTMX 2, django-htmx, django-vite, django-components | `package.json`, `project/settings.py` `INSTALLED_APPS`, `frontend/main.js` |
| Logging | Loguru (stdout + optional S3 daily rotation) | `project/settings.py` `LOGURU_CONFIG` |
| Package tooling | uv for venv/pip in CI; pip in requirements | `apprunner.yaml` build commands, `README.md` |
| Node (build only) | Node 20.13.1 downloaded in pre-build | `apprunner.yaml` `build.env` `NODE_*` vars |
| Tests | pytest, pytest-django, Django `DiscoverRunner` | `requirements.txt`, `tests/`, `core/tests/` |
| IDE agent rules | Cursor rules (`.cursor/rules/`) | `.cursor/rules/*.mdc` |

### 4.1 Notable dependencies (curated)

- `django-vite` — bridges Vite manifest/HMR to Django templates (`{% vite_asset %}`, `{% vite_hmr_client %}`).
- `django-htmx` — middleware + `{% htmx_script %}` for partial-page updates without a SPA framework.
- `django-components` — encapsulates reusable UI blocks with co-located CSS/JS Media (used by `ping` component); referenced in code and settings but **not listed in `requirements.txt`** (possible gap).
- `django-storages` — S3 backend for staticfiles and default file storage in production.
- `psycopg2-binary` — PostgreSQL driver for RDS.
- `loguru` — structured logging with optional S3 sink for production log persistence.
- `python-dotenv` — loads local `.env` for development (`load_dotenv` in settings).
- `htmx.org` — bundled via Vite, not loaded from CDN.
- `vite-plugin-static-copy` — copies favicon.ico into `static/dist/` since it is not imported in JS.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `manage.py` — Django CLI.
  - `project/wsgi.py` / `project/asgi.py` — WSGI/ASGI application objects.
  - `scripts/start.sh` — App Runner runtime: migrations → collectstatic → superuser → tests → Gunicorn.
  - `scripts/dev.ps1` — Windows local dev orchestrator (Vite background job + Django foreground).
  - `apprunner.yaml` — App Runner service definition (build + run + env + secrets).

- **Domain / core:**
  - `core/` — sole Django app; views for home, health, HTMX demo; empty `models.py`; admin registration stub.
  - `core/tests/` — view and model tests (auth user factory tests despite empty models file).

- **Project config:**
  - `project/settings.py` — central configuration: DB, S3, security, django-vite, django-components, Loguru.
  - `project/urls.py` — root URL routing, admin, core include, django_components URLs.

- **Frontend zone:**
  - `frontend/` — Vite entry (`main.js`, `styles.css`, favicon).
  - `static/dist/` — Vite build output (gitignored contents; `.gitkeep` under `static/core/`).
  - `templates/` — Django templates (`base.html`, `core/home.html`, `navbar.html`).
  - `components/core/ping/` — reference django-component (py/html/css/js).

- **Tests (top-level):**
  - `tests/test_config.py` — settings/env presence checks.
  - `tests/test_security.py` — CSRF middleware, admin auth redirect.
  - `tests/test_startup.py` — env + security integration (expects `DEBUG=False` in prod).
  - `tests/test_integration.py` — live S3 list + DB `SELECT 1` (requires real AWS/RDS in test env).

- **Docs vaults:**
  - `README.md` — primary documentation (Spanish); stack status checklist, build process, IAM/secrets setup, test inventory.
  - `docs/` — **not present**.
  - `.docs/` — **not present** (scanned; absent).

- **Agent scaffolding:**
  - `.cursor/rules/` — Cursor IDE rules: environment (Windows/PowerShell, App Runner deploy, local `.env` template), django-components creation guide, Spanish docstrings policy, README/home.html sync policy, GitHub repo metadata.
  - `.claude/` — **not present** (scanned; absent).

- **Generated / vendor (existence only):**
  - `node_modules/`, `.venv/`, `static/dist/` build artifacts — gitignored; do not ingest.
  - `package-lock.json` — present for npm reproducibility; not summarized as content.

## 6. Configuration & contracts (no secrets)

### Environment variables (names + purpose)

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | Django cryptographic signing (from Secrets Manager in prod) |
| `DEBUG` | Debug mode flag (`True` in apprunner.yaml — README notes caution) |
| `IS_LOCAL` | Switches local filesystem storage vs S3; enables Vite dev mode |
| `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | PostgreSQL RDS connection |
| `AWS_STORAGE_BUCKET_NAME` | S3 bucket for static/media/logs |
| `AWS_S3_REGION_NAME` | AWS region for S3 client |
| `AWS_S3_CUSTOM_DOMAIN` | CloudFront domain for static URL prefix |
| `AWS_S3_OBJECT_PARAMETERS` | JSON cache-control headers for S3 objects |
| `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_PASSWORD` | Bootstrap admin user at runtime |
| `PING` | Demo secret value for component testing (from Secrets Manager) |
| `PORT` | App Runner network port binding (8080) |
| `NODE_VERSION`, `NODE_DIST`, `NODE_PATH` | Build-time Node.js installation paths |

Local development `.env` shape is documented in `.cursor/rules/entorno.mdc` (placeholder values only — not production secrets).

### IAM & secrets (abstraction)

- Instance role name referenced in README: `kdx-django-apprunner-instance-role`.
- Policy names: S3 access, App Runner required secrets, RDS free-tier DB access.
- Three secret bundles in Secrets Manager: Django app secrets (`SECRET_KEY`, superuser creds), RDS credentials, and a `PING` demo secret.
- Full ARNs and account identifiers appear in `apprunner.yaml` and README — **not reproduced here** per RAG hygiene.

### Feature flags / settings branches

- `IS_LOCAL=True` → filesystem static/media, Vite HMR, Django dev server.
- `IS_LOCAL` unset/false → S3 storages, CloudFront URLs, Gunicorn, Loguru S3 log sink.

### 6.1 HTTP / API endpoints

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Technology Verification Dashboard (home) | none |
| `GET` | `/core/health/` | JSON liveness (`status: ok`) | none |
| `GET` | `/core/health/db/` | JSON DB connectivity (`SELECT 1`) | none |
| `GET` | `/core/home/` | Alternate home route (same view) | none |
| `GET` | `/core/hello/` | Plain-text "Hola Mundo" smoke test | none |
| `GET` | `/core/htmx-demo/` | HTMX partial swap demo (returns HTML fragment when `request.htmx`) | none |
| `GET` | `/admin/` | Django admin | session (superuser) |
| `*` | `django_components.urls` | Component asset serving (included at `""`) | unknown |

No REST API, OpenAPI spec, or JWT endpoints exist yet (planned in README).

### 6.2 Other interfaces

- **CLI:** `manage.py` standard Django commands; `scripts/start.sh` orchestrates production boot sequence.
- **Build CLI:** `npm run dev` / `npm run build` / `npm run preview` (Vite).
- **Dependency CLI:** `uv venv`, `uv pip install` (documented for local and App Runner build).

## 7. Data & persistence

- **Primary store:** PostgreSQL on AWS RDS (`django.db.backends.postgresql`). Connection validated by `/core/health/db/` and integration tests.
- **File/object store:** AWS S3 bucket for static files (`location: static`), default file storage, and daily Loguru log files under `logs/` prefix when not local.
- **CDN:** CloudFront custom domain serves static and media URL prefixes in production.
- **Entities:** No custom Django models defined (`core/models.py` is empty). Django built-in `User` model used for superuser bootstrap and admin.
- **Topology:** Single App Runner service in one AWS region connects to regional RDS and S3; static assets served from CloudFront edge. Local dev uses localhost Postgres (per `.env` template) and filesystem static — no S3 required for basic page rendering if env vars are set.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **`README.md`** — Primary SSOT for stack status, build phases, IAM/secrets setup (abstracted), test inventory, roadmap (auth + REST API). Spanish language.
2. **`.cursor/rules/entorno.mdc`** — Declares Windows/PowerShell dev environment, App Runner production target, push-to-main CI/CD, local `.env` template shape.
3. **`.cursor/rules/django-components.mdc`** — Mandatory component creation procedure (directory layout, `@register`, `apps.py` import, Media class).
4. **`.cursor/rules/spanish.mdc`** — Spanish for docstrings/comments; English for code identifiers.
5. **`.cursor/rules/update-readme.mdc`** — Requires README and `templates/core/home.html` stay synchronized on config changes.
6. **`.cursor/rules/github-account.mdc`** — Repo owner/name metadata for agents.
7. **`apprunner.yaml`** — Build/run contract (env names and phase commands; secret ARNs not quoted here).
8. **`project/settings.py`** — Security, storage, vite, components, logging configuration.
9. **`templates/core/home.html`** — Mirrors README content in embedded documentation section.

### Directories scanned but absent

- **`.claude/`** — not found in repository tree.
- **`.docs/`** — not found in repository tree.
- **`docs/`** — not found.

Agent guidance lives in **`.cursor/rules/`** instead of `.claude/`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public template; contains example AWS resource names and secret *identifiers* in README and `apprunner.yaml` — operators should rotate and replace all placeholder infrastructure when forking.
- **Auth model:** Django session auth for `/admin/` only; no user-facing login, OAuth2, or API tokens implemented.
- **CSRF / cookies:** `CSRF_COOKIE_SECURE`, `SESSION_COOKIE_SECURE`, `SameSite=Strict`, `CSRF_USE_SESSIONS`, `SECURE_PROXY_SSL_HEADER` for HTTPS behind App Runner reverse proxy.
- **DEBUG:** `apprunner.yaml` sets `DEBUG=True` with an inline warning comment — tests in `tests/test_config.py` and `tests/test_startup.py` assert `DEBUG` must be `False` in production, creating a known tension.
- **Secrets handling:** Production secrets injected via App Runner `secrets` block from Secrets Manager; local dev uses `.env` (gitignored). This summary contains **no** secret values, PEM keys, passwords, or full connection strings.

## 10. Operational picture

### Local development

1. `uv venv` → activate → `uv pip install -r requirements.txt`
2. `npm install`
3. Create `.env` per `.cursor/rules/entorno.mdc`
4. Run `scripts/dev.ps1` (Windows) or `python manage.py runserver` + `npm run dev` in parallel
5. Django dev server on port 8000; Vite dev server on port 5173 (per dev script comments)

### Production deploy

1. Configure AWS resources (RDS, S3, CloudFront, Secrets Manager, IAM role) per README
2. Set env vars and secret references in `apprunner.yaml`
3. Push to `main` — App Runner native CI/CD builds and deploys (per `.cursor/rules/entorno.mdc`; no `.github/workflows` in repo)
4. Runtime `scripts/start.sh`: `makemigrations` → `migrate` → `collectstatic` → conditional `createsuperuser` → pytest suites → Gunicorn on `0.0.0.0:8080`

### Build phases (App Runner)

- **Pre-build:** Install tar/xz, download Node 20.x, `npm install`, `npm run build` (frontend assets to `static/dist/`)
- **Build:** Install `uv`, create `.venv`, `uv pip install -r requirements.txt`
- **Run:** `bash scripts/start.sh` (migrations, static collection, tests, Gunicorn)

### Hardware constraints

- None specific; standard x86_64 Linux App Runner instance. Node downloaded as linux-x64 tarball during build.

## 11. Open questions / unknowns

- **`django-components` not in `requirements.txt`** despite being imported throughout — may be installed manually or omitted by mistake; fork should verify pip resolution.
- **Django version unpinned** in `requirements.txt` (`django` without `==`); README claims Django 5 but exact minor version unknown from manifests.
- **No `.github/` workflows** in tree; CI/CD mechanism is described as App Runner auto-deploy on push to `main` but not verifiable from workflow files.
- **`DEBUG=True` in production `apprunner.yaml`** conflicts with test assertions expecting `DEBUG=False` — intentional for template debugging or oversight unknown.
- **`.claude/` and `.docs/` absent** — agent memory is Cursor-centric only.
- **No custom domain models or migrations** beyond Django defaults — template is infrastructure-focused, not domain-focused.
- **Integration tests require live AWS/RDS** (`test_integration.py` lists S3 objects) — may fail in isolated CI without credentials.
- **Spanish-primary README** with English code identifiers — mixed-locale documentation convention per cursor rules.
