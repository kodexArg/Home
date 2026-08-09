---
id: "portal-tajamar"
title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth"
visibility: private
importance: normal
source_repo: "portal-tajamar"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags: ["django", "python", "portal", "tajamar", "aws", "elastic-beanstalk", "mysql", "s3", "django-allauth", "htmx", "bulma", "file-upload", "spanish", "gunicorn", "media"]
problems_solved:
  - "Tajamar TV needs a private web portal to manage and present company information instead of ad-hoc file shares or unmanaged static hosting."
  - "Operators need a starter Django stack on AWS (Elastic Beanstalk, RDS MySQL, S3 static/media) with email-based login and a minimal authenticated upload workflow — without building infra wiring from scratch."
technologies:
  - "Django 5.1"
  - "Python (Django 5.1 stack)"
  - "django-allauth 64.2.1"
  - "django-storages 1.14.4 + boto3"
  - "MySQL (mysqlclient 2.2.4)"
  - "AWS Elastic Beanstalk (awsebcli, .ebextensions)"
  - "Gunicorn 23.0.0"
  - "HTMX (vendored static)"
  - "Bulma CSS (vendored static)"
  - "Alpine.js (vendored static, not wired in base layout)"
  - "Loguru 0.7.2"
  - "environs 11.0.0"
  - "pytest + pytest-django"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Portal Tajamar TV

> **Problem thesis (required):** `portal-tajamar` is a **private starter repository** for **Portal Tajamar TV** — a Django web application meant to manage and present company information for the Tajamar TV organization. At its current maturity it delivers an authenticated dark-themed upload page (HTMX partial responses), email-verified user accounts via django-allauth, Django admin, and AWS-oriented deployment scaffolding (Elastic Beanstalk container commands, S3-backed static/media in non-debug modes, MySQL via RDS). A stub `autogestion` app hints at future self-service features but is not yet registered or implemented. The repo solves “empty Django + AWS portal bootstrap” more than a finished product portal.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/portal-tajamar` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Authenticated Django portal scaffold for Tajamar TV with file upload, email login, and AWS Elastic Beanstalk + S3 + MySQL deployment wiring. |
| Audience | Tajamar TV internal staff uploading or viewing company assets; developers deploying on AWS EB; Django operators managing users via admin. |

## 2. Problems it solves

### P1 — No centralized company information portal

- **Who hurts:** Tajamar TV staff and operators who need a single authenticated place to manage and present company-related files and information.
- **Pain today:** Company assets may live in scattered shares, email attachments, or unmanaged static hosting without access control or a consistent branded UI.
- **How this repo answers:** Provides a Django monolith with mandatory login (`LoginRequiredMixin` on home), a Spanish (`es-ar`) dark-themed UI, navbar with auth links, and an HTMX-driven multipart upload form that stores files via Django’s default storage backend (local media in debug, S3 in staging/non-debug) and returns inline success/error partials showing the uploaded asset URL.
- **Out of scope:** Content management workflows (pages, news, video catalogs), public anonymous browsing, fine-grained permissions beyond Django auth groups, and the planned `autogestion` self-service module (app exists but is empty and not in `INSTALLED_APPS`).

### P2 — AWS deployment bootstrap for a Django portal

- **Who hurts:** Developers who must stand up a Django app on AWS with MySQL, S3 static/media, and EB deploy hooks without reinventing settings splits and container commands.
- **Pain today:** Manual EB configuration, migrate/collectstatic on deploy, and environment-specific storage backends are repetitive and error-prone when starting from a blank Django project.
- **How this repo answers:** Ships `.ebextensions/django.config` (pip install, migrate, collectstatic, conditional superuser bootstrap on leader instance) and `eb.config` (nginx proxy, WSGI path `project.wsgi:application`, MariaDB client libs, health check on `/`). Settings split across `project/base.py`, `project/development.py`, and `project/staging.py` with `DJANGO_ENV` selecting the module via `manage.py` and `wsgi.py`. S3 bucket name is derived from `DJANGO_ENV` via env var pattern `AWS_S3_BUCKET_NAME_{ENV}`. README documents `eb deploy` as the deployment path.
- **Out of scope:** A dedicated `production.py` settings module (README mentions production but only `development` and `staging` modules exist in tree). CI/CD beyond EB CLI, infrastructure-as-code (no Terraform/CloudFormation in repo), and multi-region HA patterns.

## 3. Product / idea

The mental model is a **small authenticated portal monolith**:

1. **Auth layer** — django-allauth with email-as-username, mandatory email verification (including verification-by-code), session cookies with long TTL, logout-on-get enabled.
2. **Core app** — custom `core.User` (`AbstractUser` subclass, migration `0001_initial`), `HomeView` rendering upload UI, `UploadFileView` accepting `POST` with `file` field.
3. **Presentation** — server-rendered templates with layout inheritance (`layouts/base.html` → `content.html` / `box.html`), partials for navbar, success/error boxes, and a minimal allauth entrance layout override.
4. **Future zone** — `autogestion` Django app scaffold (empty models/views, not installed) reserved for self-service features per naming convention.

Non-debug deployments serve static and media from S3 (`storages.backends.s3boto3`); debug mode uses local `core/static` and a `media/` directory.

### 3.1 North-star use cases

1. **Staff login** — User signs up or logs in via `/accounts/` flows; email verification required before full access.
2. **Authenticated upload** — Logged-in user visits home (`/`), selects a file, HTMX posts to `upload/`, receives inline preview link on success.
3. **Operator deploy** — Developer sets `.env`, runs migrations locally or relies on EB container commands, deploys with `eb deploy`, admin user bootstrapped on first leader deploy if absent.

### 3.2 Non-goals

- Finished CMS or TV programming catalog (README positions repo as “starting repository”).
- API-first or headless architecture (no DRF, no OpenAPI).
- `autogestion` functionality (stub only).
- Social OAuth login (allauth `socialaccount` appears in an early duplicate block in `base.py` but the active installed apps list uses account-only allauth without social providers configured).

## 4. Technology stack

Derived from `requirements.txt`, `project/*.py`, `.ebextensions/`, and `README.md`. Lockfile is a flat pinned `requirements.txt` (not summarized line-by-line).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python, Django 5.1 | `requirements.txt`, `manage.py` |
| Frontend | Server templates, HTMX, custom dark CSS, Bulma vendored | `core/templates/`, `core/static/` |
| Backend / API | Django views (class-based), django-allauth | `core/views.py`, `project/urls.py` |
| Data | MySQL (RDS in staging; Docker-style env vars in development) | `project/development.py`, `project/staging.py` |
| Infra / deploy | AWS Elastic Beanstalk, S3, Gunicorn (declared) | `.ebextensions/`, `README.md` |
| AI / agents | None in tree | — |
| Tests | pytest, pytest-django (declared; minimal test stubs) | `requirements.txt`, `core/tests.py`, `autogestion/tests.py` |

### 4.1 Notable dependencies (curated)

- `Django==5.1` — core web framework and ORM.
- `django-allauth==64.2.1` — email authentication, signup, verification flows under `/accounts/`.
- `django-storages==1.14.4` + `boto3` — S3-backed default and static file storage in non-debug modes.
- `mysqlclient==2.2.4` — MySQL database driver for RDS.
- `gunicorn==23.0.0` — production WSGI server (typical EB Python stack).
- `environs==11.0.0` + `python-dotenv` — typed environment variable loading from `.env`.
- `loguru==0.7.2` — structured logging in views and settings modules.
- `awsebcli==3.20.10` — Elastic Beanstalk CLI for `eb deploy`.
- `django-debug-toolbar==4.4.6` — dev-only toolbar appended in `development.py`.
- `django-extensions==3.2.3` — common Django dev utilities (not heavily used in visible code).

## 5. Repository map (abstraction)

- **Entrypoints:** `manage.py` (CLI, `DJANGO_ENV` → `project.{env}` settings); `project/wsgi.py` / `project/asgi.py` (WSGI default for EB).
- **Settings / config:** `project/base.py` (shared apps, allauth, AWS env keys, email backend config); `project/development.py` (local hosts, debug toolbar, Docker DB env vars); `project/staging.py` (permissive hosts, RDS DB env vars, logging dict).
- **Domain / core:** `core/` — `User` model, `HomeView`, `UploadFileView`, templates, static assets, initial migration.
- **Future domain:** `autogestion/` — empty scaffold (models, views, admin stubs only).
- **HTTP routing:** `project/urls.py` — admin, home, upload, allauth include.
- **Deploy hooks:** `.ebextensions/django.config`, `.ebextensions/eb.config`.
- **Docs vaults:** Root `README.md` (bilingual ES/EN). No `docs/`, `.docs/`, ADR, or PRD directories present.
- **Agent scaffolding:** No `.claude/`, `.agents/`, or `SKILL.md` trees found (scanned — absent).
- **Generated / vendor / ignored:** `node_modules`, `venv`, `.env`, `db.sqlite3`, `staticfiles`, `media`, `.elasticbeanstalk/*` per `.gitignore`; `xtras/` and `xtras/` docker folder gitignored.

## 6. Configuration & contracts (no secrets)

Environment variables and settings shapes (names and purpose only — **no values**):

| Name / setting | Purpose |
|----------------|---------|
| `DJANGO_ENV` | Selects settings module (`development` default, `staging` for EB staging) |
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Boolean debug flag |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | S3 API credentials |
| `AWS_S3_BUCKET_NAME_{ENV}` | Per-environment S3 bucket (suffix from `DJANGO_ENV`) |
| `DOCKER_DB_NAME`, `DOCKER_DB_USER`, `DOCKER_DB_PASSWORD`, `DOCKER_DB_HOST`, `DOCKER_DB_PORT` | MySQL connection in development |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` | MySQL connection in staging |
| `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_PORT`, `DEFAULT_FROM_EMAIL` | SMTP for allauth verification emails (configured in `project/base.py` — should be env-driven in production) |

django-allauth account settings (from `project/base.py`): email authentication, email required, mandatory verification, verification-by-code enabled, username not required, custom `AUTH_USER_MODEL = core.User`, login/logout redirect to `/`, long `SESSION_COOKIE_AGE`, `ACCOUNT_LOGOUT_ON_GET = True`.

EB bindings: WSGI path `project.wsgi:application`; nginx proxy; health check path `/`; `mariadb105-devel` yum package for MySQL client build.

### 6.1 HTTP / API endpoints (when applicable)

No REST API. Server-rendered routes and django-allauth standard paths:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home — file upload form (`home.html`) | login required (`account_login` redirect) |
| `POST` | `/upload/` | Multipart file upload; returns HTMX partial (`success_box` or `error_box`) | login required; `csrf_exempt` on view |
| `GET` | `/admin/` | Django admin | staff session |
| `GET`/`POST` | `/accounts/login/` | allauth login | public |
| `GET`/`POST` | `/accounts/signup/` | allauth registration | public |
| `GET` | `/accounts/logout/` | allauth logout (logout-on-get) | session |
| `GET`/`POST` | `/accounts/confirm-email/` … | Email verification flows | varies |
| `GET` | `/upload/` | Disallowed — returns 405 | login required |

Static/media URLs: `/static/` and `/media/` locally in debug; S3 custom domain URLs in non-debug staging per `AWS_S3_CUSTOM_DOMAIN`.

### 6.2 Other interfaces

- **CLI:** `python manage.py migrate`, `collectstatic`, `createsuperuser` (also automated on EB leader via container command).
- **Deploy CLI:** `eb deploy` (documented in README).
- No MCP, Telegram, systemd units, or background workers in tree.

## 7. Data & persistence

- **Primary store:** MySQL via Django ORM (`django.db.backends.mysql`).
- **File store:** Local `media/` in debug; S3 bucket with `media/` and `static/` prefixes via django-storages in non-debug modes.
- **Entities:** `core.User` (extends `AbstractUser` — standard auth fields, no custom columns beyond the abstract base). No domain models for content, programs, or uploads metadata (files stored by name through default storage only).
- **Topology:** Single-region AWS pattern — EB Python environment, RDS MySQL, S3 for assets. No edge workers, caches, or vector indexes. Sessions stored via Django default (database-backed when using database session engine — default session app installed).

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **`README.md`** — Bilingual (ES/EN) project description, tech stack list, env setup steps (`venv`, `pip install`, `.env`, migrate, superuser), EB deploy note, environment names (`development`, `staging`, `production`).
2. **`.claude/`** — Scanned; **not present** in repository.
3. **`.docs/`** — Scanned; **not present** in repository.
4. **`docs/`** — Not present.
5. **ADR / PRD / constitution** — Not found.
6. **Agent skill trees** — Not found.

README evidence: positions repo as “starting repository” for Portal Tajamar TV; documents Django, EB, MySQL, S3, Bulma, HTMX, Alpine.js, Loguru; warns not to expose `.env` credentials.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repo — internal Tajamar TV portal; no public clone URLs in related frontmatter (`related: []`).
- **Auth model:** Session cookies after django-allauth email login with mandatory email verification; `LoginRequiredMixin` on main views; Django admin for staff.
- **Upload surface:** Authenticated POST to `/upload/` with `csrf_exempt` on the upload view (reduces CSRF protection on that endpoint — worth hardening if extended).
- **Secrets hygiene:** `.env` is gitignored. **This summary contains no secrets.** Note for operators: `project/base.py` embeds SMTP credentials inline rather than exclusively from environment variables, and `.ebextensions/django.config` embeds a bootstrap superuser password in a container command — both should be migrated to secrets management and rotated; values are intentionally omitted here.
- **Session duration:** `SESSION_COOKIE_AGE` configured for approximately one year; `SESSION_EXPIRE_AT_BROWSER_CLOSE = False`.

## 10. Operational picture

- **Local dev:** Create venv → `pip install -r requirements.txt` → configure `.env` → `DJANGO_ENV=development python manage.py migrate` → create superuser. Debug toolbar enabled in development settings. Static served from `core/static`; media from local `media/`.
- **Staging / EB:** Set `DJANGO_ENV=staging` (or matching module), provide RDS and S3 env vars, deploy via `eb deploy`. Container commands on leader: pip install, migrate, collectstatic, conditional superuser creation.
- **Last push activity:** GitHub metadata shows last code push in late 2024; repo metadata updated in 2025 — treat as low-velocity / scaffold stage.
- **Hardware:** Standard EB EC2 (`aws-elasticbeanstalk-ec2-role` instance profile); no GPU, RPi, or embedded constraints.

## 11. Open questions / unknowns

- **Production settings module:** README references `production` environment but no `project/production.py` exists — production may reuse `staging.py` or an uncommitted module.
- **`autogestion` scope:** App directory exists but is not in `INSTALLED_APPS` and has no models or views — intended self-service features are undefined in code.
- **Alpine.js usage:** Vendored in `core/static/libs/alpinejs/` but not included in `layouts/base.html` (only HTMX script loaded) — may be unused or planned.
- **Email provider:** SMTP host appears to be a sandbox provider in settings; production mail path unknown.
- **Content beyond uploads:** No models or views for “presenting company information” beyond the upload page — portal features may be planned but not implemented.
- **CI/CD:** No GitHub Actions or other CI config in tree; deployment appears EB-CLI/manual per README.
- **Test coverage:** `pytest` declared; test modules are empty stubs.
