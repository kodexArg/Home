---
id: "apprunnertest2"
title: "AppRunner Test 2 — Django on AWS App Runner integration harness"
visibility: private
importance: normal
source_repo: "apprunnertest2"
org: "kodexArg"
default_branch: "prod"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags: ["django", "python", "aws", "app-runner", "rds", "postgresql", "s3", "cloudfront", "secrets-manager", "gunicorn", "uv", "integration-tests", "django-storages", "loguru", "pytest"]
problems_solved:
  - "Teams need a minimal, reproducible Django deployment on AWS App Runner without Docker, ECS, or Fargate — validating that the managed Python runtime path works end-to-end."
  - "Operators lack a single reference app that proves RDS PostgreSQL, S3 static/media storage, CloudFront CDN, and Secrets Manager wiring before building production ALVS services."
  - "Deployments need a fail-fast gate: migrations, static collection, superuser bootstrap, and live integration tests must pass before Gunicorn starts serving traffic."
technologies:
  - "Python 3.11"
  - "Django (requirements.txt, unpinned)"
  - "Gunicorn WSGI"
  - "uv (venv + pip install in App Runner build)"
  - "PostgreSQL via psycopg2-binary + RDS"
  - "boto3 + django-storages (S3 backend)"
  - "AWS App Runner (apprunner.yaml)"
  - "AWS Secrets Manager (runtime secrets)"
  - "CloudFront (custom S3 domain for static/media)"
  - "Loguru (stdout + S3 log sinks)"
  - "pytest + pytest-django (via Django test runner)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# AppRunner Test 2

> **Problem thesis (required):** kodexArg needs a **private, throwaway-but-real** Django application that deploys on **AWS App Runner's native Python 3.11 runtime** — no containers — while exercising the full AWS peripheral stack (RDS Postgres, S3, CloudFront, Secrets Manager). The repo is both a **deployment recipe** (`apprunner.yaml` + `scripts/start.sh`) and an **integration test harness** that aborts startup if configuration, connectivity, or S3 write/read checks fail. It is not a production product; it is the proving ground for ALVS-style Django hosting patterns before auth, API, and modern frontend work land.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/apprunnertest2` |
| Visibility | `private` |
| Default branch | `prod` |
| One-line pitch | Minimal Django 3.11 app deployed on AWS App Runner with RDS, S3/CloudFront, and Secrets Manager — gated by startup integration tests. |
| Audience | kodexArg operators and backend engineers validating AWS App Runner for Django; future maintainers extending ALVS infrastructure patterns; agents needing context on the App Runner + Django stack choice. |

## 2. Problems it solves

### P1 — Django on App Runner without container orchestration

- **Who hurts:** Engineers evaluating AWS App Runner as a simpler alternative to ECS/Fargate/Docker for small Django services.
- **Pain today:** Most Django-on-AWS guides assume Docker images or Elastic Beanstalk. App Runner's **source-based Python runtime** is under-documented for Django-specific concerns: WSGI binding, `ALLOWED_HOSTS` for App Runner domains, proxy SSL headers, and build-time dependency installation.
- **How this repo answers:** Ships `apprunner.yaml` with Python 3.11 runtime, `uv` for fast venv creation during build, port `8080` bound via `PORT` env, and `scripts/start.sh` as the run command. `project/settings.py` configures `SECURE_PROXY_SSL_HEADER`, `CSRF_TRUSTED_ORIGINS` for App Runner/AWS host patterns, and Gunicorn as the production WSGI server.
- **Out of scope:** Does not compare App Runner vs ECS cost/scale. No multi-service mesh, no blue/green deploy automation, no GitHub Actions CI in this repo.

### P2 — End-to-end AWS service integration proof for Django

- **Who hurts:** Teams wiring Django to RDS, S3, and Secrets Manager who need a **working reference** before copying patterns into larger apps.
- **Pain today:** Configuration errors in `STORAGES`, database DSNs, or secret injection often surface only at runtime in production. Scattered tutorials rarely combine all three with App Runner's secret-reference syntax.
- **How this repo answers:** `apprunner.yaml` declares plain env vars for non-secret config (DB host/port/name, S3 bucket, region, CloudFront custom domain) and `secrets` blocks referencing Secrets Manager ARNs for `SECRET_KEY`, DB credentials, Django superuser fields, and a `PING` secret (connectivity smoke). `project/settings.py` reads all values from environment, configures `django-storages` S3 backends for default and staticfiles, and routes Loguru logs to both stdout and an S3 log prefix. `tests/test_integration.py` performs live S3 list, DB `SELECT 1`, and S3 save/read/delete for static storage.
- **Out of scope:** No IAM policy definitions in-repo (assumed provisioned externally). No Terraform/CDK. No local S3 emulation (listed as TODO in README).

### P3 — Fail-fast deployment gate via ordered startup tests

- **Who hurts:** Operators who want App Runner instances to **never serve traffic** if AWS integrations are broken.
- **Pain today:** Default App Runner behavior starts the process immediately; application-level health checks may pass while DB or S3 is misconfigured.
- **How this repo answers:** `scripts/start.sh` runs a strict pipeline before `exec gunicorn`: drop stale test DB, `makemigrations` + `migrate`, `collectstatic`, conditional `createsuperuser`, then four ordered test phases (`tests.test_config`, `tests.test_startup`, `tests.test_integration`, `core.tests.test_views`, `core.tests.test_models`) — any failure exits non-zero and aborts deployment.
- **Out of scope:** Does not run tests in a separate CI stage; tests execute on every cold start/redeploy. No canary or staged rollout.

## 3. Product / idea

The repository is a **single Django project** (`project/`) with one domain app (`core/`) and a shared template layer under `templates/`. Mental model:

```
App Runner build  →  uv venv + pip install requirements
App Runner run    →  start.sh
                       ├─ migrate + collectstatic + superuser
                       ├─ config / startup / integration / view tests
                       └─ gunicorn project.wsgi :8080
HTTP surface      →  / → redirect /core/home/
                       /core/health/, /core/health/db/, /core/hello/, /core/home/
                       /admin/
Persistence       →  RDS PostgreSQL (Django auth tables; no custom models yet)
Static/media/logs →  S3 bucket behind CloudFront custom domain
Secrets           →  Secrets Manager injected as env at runtime
```

The home page (`templates/core/home.html`) is a minimal testing shell linking to the DB health check. There is no user-facing product beyond proving infrastructure works.

### 3.1 North-star use cases

1. **Deploy smoke test** — Push to `prod`, App Runner builds and runs `start.sh`; all integration tests green; `/core/health/` returns JSON `status: ok`.
2. **RDS verification** — `/core/health/db/` executes `SELECT 1` and returns success/failure JSON; mirrored by `test_database_connectivity` in integration suite.
3. **S3 write path** — Integration test saves a temp file via `S3Boto3Storage`, reads it back, deletes it — proving django-storages and IAM role permissions.
4. **Operator inspection** — Django admin available after auto-created superuser (credentials from Secrets Manager, not in repo).

### 3.2 Non-goals

- **No Docker/ECS/Fargate** — explicitly chosen path per README.
- **No authentication/API yet** — README checklists mark user system, JWT API, rate limiting as future work.
- **No modern frontend stack yet** — Vite, Tailwind, HTMX, django-components are planned but not implemented.
- **No custom domain product** — serves on App Runner-assigned host; CloudFront is for static asset CDN only.
- **Local dev environment incomplete** — README marks local settings, DB, and S3 emulation as unchecked TODOs.

## 4. Technology stack

Derived from `requirements.txt`, `apprunner.yaml`, `project/settings.py`, and `scripts/start.sh`. Versions in `requirements.txt` are unpinned (package names only).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.11 | `apprunner.yaml` `runtime: python311` |
| Web framework | Django | `requirements.txt`, `manage.py`, `project/settings.py` |
| WSGI server | Gunicorn (bind `0.0.0.0:8080`) | `scripts/start.sh`, `requirements.txt` |
| Package install | uv (build) + pip | `apprunner.yaml` build commands |
| Database | PostgreSQL via RDS | `project/settings.py` `django.db.backends.postgresql`, `psycopg2-binary` |
| Object storage | S3 via django-storages + boto3 | `project/settings.py` `STORAGES`, `requirements.txt` |
| CDN | CloudFront custom domain for static/media URLs | `project/settings.py` `STATIC_URL`, `MEDIA_URL` |
| Logging | Loguru → stdout + S3 daily rotation | `project/settings.py` `LOGURU_CONFIG` |
| Secrets | AWS Secrets Manager (App Runner secret refs) | `apprunner.yaml` `secrets` block |
| Tests | Django DiscoverRunner + pytest deps | `project/settings.py` `TEST_RUNNER`, `requirements.txt` |
| Deploy platform | AWS App Runner | `apprunner.yaml` |
| CI/CD | None in repo | no `.github/workflows/` tree |

### 4.1 Notable dependencies (curated)

- `django` — core web framework; admin, auth, sessions, templates.
- `gunicorn` — production WSGI entry used by `start.sh`.
- `psycopg2-binary` — PostgreSQL driver for RDS.
- `boto3` — direct S3 client in integration tests; underlying SDK for django-storages.
- `django-storages` — S3 backend for default file storage and staticfiles.
- `loguru` — structured logging with S3 sink for app and test logs.
- `pytest` / `pytest-django` — listed in requirements; tests use Django's `TestCase` via `manage.py test`.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `manage.py` — Django CLI.
  - `project/wsgi.py` — WSGI application for Gunicorn.
  - `project/asgi.py` — ASGI stub (not used in production path).
  - `scripts/start.sh` — App Runner run command orchestrator.

- **Domain / core:**
  - `core/views.py` — `home`, `hello_world`, `health`, `db_health_check`.
  - `core/urls.py` — routes under `/core/`.
  - `core/models.py` — empty (no custom models; uses Django built-in User).
  - `core/admin.py` — empty registration.

- **Project config:**
  - `project/settings.py` — env-driven settings, S3 storages, Loguru, security headers.
  - `project/urls.py` — root redirect to `/core/home/`, includes `core.urls`, admin.

- **Templates:**
  - `templates/base.html` — HTML shell with blocks.
  - `templates/navbar.html` — minimal nav with home link.
  - `templates/core/home.html` — testing landing page with health link.

- **Tests (three tiers + app tests):**
  - `tests/test_config.py` — settings presence (SECRET_KEY, DB, AWS, security, apps, middleware).
  - `tests/test_startup.py` — environment and integration-style config checks (duplicate class name `IntegrationTests`; config/security focused).
  - `tests/test_integration.py` — live S3 list, DB query, S3 storage round-trip.
  - `core/tests/test_views.py` — HTTP endpoint tests including mocked DB failure.
  - `core/tests/test_models.py` — Django User create/superuser/str tests.

- **Deploy manifest:**
  - `apprunner.yaml` — build/run spec, env vars, Secrets Manager bindings.

- **Docs vaults:** none — no `docs/`, `.docs/`, ADRs, or PRDs in tree.

- **Agent scaffolding:** none — `.claude/` not present (scanned). No `AGENTS.md`, `SKILL.md`, or `.agents/` tree.

- **Generated / vendor / ignored:**
  - `.venv/` — gitignored local virtualenv (may exist in working copies; not ingested).
  - `*/migrations/*.py` — gitignored except `__init__.py`; migrations generated at startup via `makemigrations`.
  - `db.sqlite3`, `.env`, `static/`, `media/` — gitignored.

## 6. Configuration & contracts (no secrets)

All runtime configuration is **environment-variable driven**. Secret values are injected by App Runner from Secrets Manager; this summary documents **names and purpose only**.

### Environment variables (plain, from `apprunner.yaml` env block)

| Variable | Purpose |
|----------|---------|
| `ALLOWED_HOSTS` | Comma-separated Django allowed hosts (includes wildcard App Runner/AWS patterns) |
| `DEBUG` | Boolean string (`True`/`False`) — **currently set True in manifest; tests expect False in production** |
| `DB_HOST` | RDS hostname |
| `DB_PORT` | RDS port (5432) |
| `DB_NAME` | PostgreSQL database name |
| `AWS_STORAGE_BUCKET_NAME` | S3 bucket for media, static, and logs |
| `AWS_S3_REGION_NAME` | AWS region for S3 client |
| `AWS_S3_CUSTOM_DOMAIN` | CloudFront distribution domain for static/media URL prefix |
| `AWS_S3_OBJECT_PARAMETERS` | JSON string of default S3 object headers (Cache-Control) |
| `PORT` | App Runner network port (8080) |

### Secrets (from `apprunner.yaml` secrets block)

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | Django cryptographic secret |
| `DB_USERNAME` | RDS database user |
| `DB_PASSWORD` | RDS database password |
| `DJANGO_SUPERUSER_USERNAME` | Auto-created admin username |
| `DJANGO_SUPERUSER_EMAIL` | Auto-created admin email |
| `DJANGO_SUPERUSER_PASSWORD` | Auto-created admin password |
| `PING` | Secrets Manager connectivity smoke value (injected but **not referenced in application Python code**) |

### Django settings highlights (`project/settings.py`)

- `DATABASES['default']` — PostgreSQL engine, all fields from env.
- `STORAGES` — S3 for `default` and `staticfiles` with shared bucket; staticfiles use `location: static`.
- Security: `CSRF_COOKIE_SECURE`, `SESSION_COOKIE_SECURE`, `CSRF_USE_SESSIONS`, SameSite Strict, proxy SSL header for HTTPS termination at App Runner edge.
- `INSTALLED_APPS` includes `storages` and `core`.
- Loguru sinks: stdout (INFO) and S3 path under `logs/app_YYYY-MM-DD.log` (DEBUG, 1-day rotation, 30-day retention).

### 6.1 HTTP / API endpoints

Django URL routing only; no REST framework or OpenAPI. All paths relative to App Runner service host.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Redirect to `/core/home/` | none |
| `GET` | `/core/home/` | HTML testing landing page | none |
| `GET` | `/core/hello/` | Plain-text "Hello World" smoke | none |
| `GET` | `/core/health/` | JSON liveness (`status: ok`) | none |
| `GET` | `/core/health/db/` | JSON DB connectivity check | none |
| `GET` | `/admin/` | Django admin UI | session (superuser) |

No POST/PUT/DELETE API endpoints implemented. README plans JWT REST API as future work.

### 6.2 Other interfaces

- **CLI:** `manage.py` standard Django commands (`migrate`, `collectstatic`, `createsuperuser`, `test`).
- **Shell startup:** `scripts/start.sh` — bash orchestration with `psql` for test DB cleanup, sequential `manage.py test` invocations, Gunicorn exec.
- **No MCP, Telegram, systemd, or worker queues** in current tree.

## 7. Data & persistence

- **Primary store:** Amazon RDS PostgreSQL — Django built-in tables (auth User, sessions, admin, migrations). No custom models in `core/models.py`.
- **Object storage:** S3 bucket — static files (`static/` prefix), media (default storage), application logs (`logs/` prefix), test logs (`logs/tests_*`).
- **CDN:** CloudFront custom domain referenced in `STATIC_URL` and `MEDIA_URL` for browser-facing asset URLs.
- **Topology:** Single-region AWS (us-east-1 per manifest). App Runner service in AWS network talks to RDS and S3 via IAM instance role (not defined in-repo). No edge Workers, no D1, no Redis/cache layer.
- **Test DB:** `start.sh` drops `test_<DB_NAME>` on Postgres before migrations to avoid stale test schema conflicts.

## 8. Docs & agent memory (required scan)

| Source | Present | Summary |
|--------|---------|---------|
| `README.md` | yes | Implementation checklist (infrastructure done, features/frontend TODO), notes on DEBUG risk, startup automation, test philosophy, planned JWT API and Vite/Tailwind/HTMX stack. |
| `LICENSE` | yes | MIT License, copyright AppRunner Test 2 (2024). |
| `docs/**` | no | Not in repository. |
| `.docs/**` | no | Scanned; directory absent. |
| `.claude/**` | no | Scanned; directory absent. No agent instruction trees, skills, or harness files. |
| ADR / PRD / constitution | no | None found. |

**Evidence paths used:** `README.md`, `LICENSE`, `apprunner.yaml`, `project/settings.py`, `project/urls.py`, `core/urls.py`, `core/views.py`, `scripts/start.sh`, `tests/test_config.py`, `tests/test_startup.py`, `tests/test_integration.py`, `core/tests/test_views.py`, `core/tests/test_models.py`, `templates/core/home.html`, `requirements.txt`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repo under `kodexArg`. Summary contains no clone URLs or live credentials.
- **Auth model:** Django session auth for admin only; public health/hello/home endpoints unauthenticated. Future JWT API documented in README but not implemented.
- **Secrets handling:** Production secrets live in AWS Secrets Manager, referenced by ARN in `apprunner.yaml` — ARNs and account identifiers are **not reproduced** in this summary. Never commit `.env` or secret values.
- **DEBUG tension:** `apprunner.yaml` sets `DEBUG=True` with an inline warning comment; `tests/test_config.py` and `tests/test_startup.py` assert `DEBUG` must be **False** in production. This inconsistency means config tests may fail on deploy unless DEBUG is overridden or tests are updated — worth operator attention.
- **ALLOWED_HOSTS:** Includes broad wildcards (`*`, `*.amazonaws.com`, `*.apprunner.aws`) — permissive for test harness, not production-hardened.
- **CSRF/Session cookies:** Secure + SameSite Strict configured assuming HTTPS via App Runner proxy.
- **This summary contains no secrets, PEM keys, passwords, or connection strings with credentials.**

## 10. Operational picture

### Local development

- README marks local dev setup as **not done** (no dev settings split, no local DB/S3 emulation scripts).
- `.gitignore` excludes `.venv/`, `.env`, sqlite, static/media artifacts.
- Would require exporting the same env var names locally plus a Postgres instance and AWS credentials for full parity.

### Deployment

- **Platform:** AWS App Runner via `apprunner.yaml` (version 1.0, Python 3.11).
- **Build:** `pip3 install uv` → `uv venv .venv` → `uv pip install -r requirements.txt`.
- **Run:** `bash scripts/start.sh` on port 8080.
- **Bootstrap:** Auto migrations, collectstatic to S3, superuser creation if missing, full test suite, then Gunicorn.
- **CI/CD:** No GitHub Actions or other pipeline in repo; deployment is App Runner–native (likely connected to GitHub branch `prod` externally).

### Observability

- Gunicorn access/error logs to stdout.
- Loguru INFO on stdout, DEBUG to S3 daily log files.
- Health endpoints for load balancer / manual checks.

## 11. Open questions / unknowns

- **DEBUG vs test expectations:** Manifest sets `DEBUG=True` but startup/config tests require `DEBUG=False` — unclear if deploy currently passes all tests or if one side was changed without the other.
- **PING secret usage:** Declared in `apprunner.yaml` secrets but no Python reference to `os.environ['PING']` — purpose is likely Secrets Manager injection smoke only; no explicit test found.
- **`tests/test_startup.py` vs `tests/test_integration.py`:** Both define a class named `IntegrationTests` with overlapping config checks; `test_startup.py` does not perform live S3/DB calls (despite importing boto3). Naming/overlap may be accidental duplication.
- **Dependency versions:** `requirements.txt` lists unpinned package names — reproducibility across rebuilds unknown.
- **IAM policies:** S3/RDS/Secrets Manager permissions assumed provisioned outside repo; no policy JSON in tree.
- **App Runner ↔ GitHub linkage:** No workflow files; exact trigger mechanism (console vs API) not documented in-repo.
- **Future roadmap items** (auth, REST API, Vite frontend) have no design docs yet — only README checklists.

---
