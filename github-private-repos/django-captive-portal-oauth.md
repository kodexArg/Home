---
id: "django-captive-portal-oauth"
title: "Django Captive Portal OAuth — WiFi guest authentication via social login"
visibility: private
importance: normal
source_repo: "django-captive-portal-oauth"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags: ["django", "captive-portal", "oauth", "wifi", "allauth", "google", "facebook", "unifi", "hospitality"]
problems_solved:
  - "Open WiFi networks need a captive portal that intercepts unauthenticated traffic and forces users through a login page before granting internet access."
  - "Venue operators (hotels, cafés, offices) want social OAuth (Google/Facebook) instead of managing local username/password accounts for guest WiFi."
  - "First-time visitors should be distinguishable from returning registered guests so staff can approve new users at reception before granting network access."
technologies:
  - "Django 4.0.4"
  - "django-allauth (social account providers)"
  - "django-bootstrap5"
  - "SQLite (default dev database)"
  - "django-unifi-portal (declared in extended requirements, not yet wired)"
  - "social-auth / oauth-toolkit / DRF (declared in extended requirements, not active in settings)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Django Captive Portal OAuth

> **Problem thesis (required):** This repository is a Django web application intended to serve as a **captive portal** for open WiFi: when a guest connects to the network, their HTTP traffic is redirected to this app, where they must authenticate (via Google or Facebook OAuth) before being allowed to browse. The README further describes a **registration gate** — returning users get internet access immediately, while first-time visitors see a page directing them to reception for manual approval — though that workflow is described at the product level and is not fully implemented in the checked-in tree.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/django-captive-portal-oauth` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Django captive portal that authenticates WiFi guests through Google/Facebook OAuth before granting internet access. |
| Audience | Venue operators deploying guest WiFi (hospitality context suggested by template branding), Django developers integrating UniFi or similar captive-portal hardware, and internal Kodex Arg maintainers. |

## 2. Problems it solves

### P1 — Guest WiFi needs a login wall before internet access

- **Who hurts:** Venue operators running open or semi-open WiFi (hotels, cafés, coworking spaces) and the network admins who configure captive-portal hardware.
- **Pain today:** Raw open WiFi either grants unrestricted access (abuse, liability) or requires brittle manual credential distribution. Captive portals solve interception, but building a maintainable login UI with real identity providers is non-trivial.
- **How this repo answers:** Provides a Django project skeleton with `django-allauth` wired for social login, a minimal home template that shows login state in three languages (Spanish, Portuguese, English), and URL routes that delegate authentication to allauth's standard account flows. The extended requirements file signals intent to integrate `django-unifi-portal` for UniFi controller handshake.
- **Out of scope:** Does not include firewall/radius configuration, DHCP, or hardware-side captive-portal redirect rules — those live outside this app on the access point or controller.

### P2 — Social OAuth beats local guest accounts

- **Who hurts:** Front-desk staff and guests who would otherwise need disposable usernames/passwords printed on receipts.
- **Pain today:** Local Django `User` registration creates support burden; guests forget passwords; staff reset accounts manually.
- **How this repo answers:** `INSTALLED_APPS` registers `allauth`, `allauth.account`, `allauth.socialaccount`, and `allauth.socialaccount.providers.google`. Settings configure email-based account authentication and Google as a `SOCIALACCOUNT_PROVIDERS` entry. README states Facebook is also a target provider, but Facebook is not present in the active provider list in settings at the time of this summary.
- **Out of scope:** Enterprise SSO (SAML, OIDC beyond social), per-device MAC authorization, or bandwidth quotas.

### P3 — First-time visitor approval workflow (product intent)

- **Who hurts:** Reception staff at venues that want to vet new guests before granting WiFi.
- **Pain today:** Without a registration gate, any successful OAuth login immediately grants access — no staff checkpoint.
- **How this repo answers (intended):** README describes that registered users navigate freely while first-time visitors are shown a page inviting them to approach reception for access registration. **The checked-in codebase does not yet implement this distinction** — the home template only branches on `user.is_authenticated` vs anonymous, with no custom user-registration or approval model.
- **Out of scope:** CRM integration, SMS verification, or payment for WiFi access.

## 3. Product / idea

The mental model is a **thin Django portal layer** sitting behind captive-portal hardware:

1. Guest connects to WiFi; the access point redirects HTTP to this Django app.
2. Guest lands on `/` (home), sees a trilingual prompt to log in.
3. Guest follows the login link → allauth social flow (Google configured; Facebook planned).
4. On success, `LOGIN_REDIRECT_URL` sends them back to `home`, which displays a welcome message confirming internet access.
5. (Planned) UniFi integration via `django-unifi-portal` would authorize the client MAC/session on the controller after successful login.

The repository is **small and incomplete**: there are no custom Django apps (`models.py`, `views.py` packages are absent). Business logic is limited to Django admin, allauth, and a `TemplateView` for the landing page. Settings contain a developer comment marking OAuth provider configuration as work-in-progress.

### 3.1 North-star use cases

1. **Returning guest** — Connects to venue WiFi, redirected to portal, clicks Log In, authenticates via Google, sees trilingual welcome, browses freely.
2. **New guest (intended)** — Connects, authenticates, but is blocked or redirected to a reception-approval page until staff registers them (not yet coded).
3. **Operator** — Uses Django admin to manage users/accounts; eventually would pair with UniFi controller authorization.

### 3.2 Non-goals

- Not a full property-management or PMS system.
- Not a production-hardened deployment (debug defaults, empty `ALLOWED_HOSTS`, insecure dev secret key present in settings — credentials must be externalized before any real deployment).
- Not a REST API for third-party clients (DRF appears only in unused requirements).
- No CI/CD, Docker, or infrastructure-as-code in the tree.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (implicit), Django 4.0.4 | `requirements/base.txt`, `requirements/django-unifi-portal.txt` |
| Web framework | Django 4.0.4 | `requirements/base.txt` |
| Auth / social | django-allauth (account + socialaccount + Google provider) | `portal/config/settings.py` `INSTALLED_APPS`, `AUTHENTICATION_BACKENDS` |
| UI | django-bootstrap5, minimal custom CSS | `portal/config/settings.py`, `portal/templates/base.html`, `portal/static/base.css` |
| Data | SQLite (file `db.sqlite3`, gitignored) | `portal/config/settings.py` `DATABASES` |
| Captive hardware (planned) | django-unifi-portal 0.0.2 | `requirements/django-unifi-portal.txt` (not in `INSTALLED_APPS`) |
| Unused / aspirational deps | django-oauth-toolkit, django-rest-framework-social-oauth2, social-auth-app-django, djangorestframework, django-material, django-braces | `requirements/django-unifi-portal.txt` only |
| Tests | None evident | — |
| Infra / deploy | None evident (no CI, Dockerfile, compose) | — |

### 4.1 Notable dependencies (curated)

- `Django==4.0.4` — core web framework and ORM.
- `django-allauth` (via social stack in extended requirements; configured in settings as `allauth` apps) — social OAuth login flows and account management.
- `django-bootstrap5` — Bootstrap 5 rendering tags in templates.
- `django-unifi-portal==0.0.2` — intended UniFi captive-portal integration; declared but not activated in settings.
- `social-auth-app-django`, `django-oauth-toolkit`, `djangorestframework` — present in extended requirements file, suggesting experimentation or a prior auth approach, but not wired in current `INSTALLED_APPS`.

## 5. Repository map (abstraction)

- **Entrypoints:** `portal/manage.py` (Django CLI), `portal/config/wsgi.py` and `portal/config/asgi.py` (deployment callables).
- **Configuration / routing:** `portal/config/settings.py` (apps, auth backends, database, allauth settings, social provider config), `portal/config/urls.py` (admin, allauth accounts, home `TemplateView`).
- **Presentation:** `portal/templates/base.html` (Bootstrap shell, title "KM1107 - WiFi Portal"), `portal/templates/home.html` (trilingual authenticated/anonymous states), `portal/static/base.css` (empty placeholder).
- **Dependencies:** `requirements/base.txt` (minimal Django pin), `requirements/django-unifi-portal.txt` (full stack pin list).
- **Domain / core:** **Absent** — no custom Django app with models, views, or business rules beyond generic template rendering.
- **Docs vaults:** Root `README.md` only. No `docs/`, `.docs/`, ADRs, or PRDs.
- **Agent scaffolding:** No `.claude/`, `.agents/`, or skill trees present.
- **Generated / vendor:** `db.sqlite3` is gitignored; not present in clone.

## 6. Configuration & contracts (no secrets)

### Environment & settings (shapes only)

| Setting / area | Purpose |
|----------------|---------|
| `SECRET_KEY` | Django cryptographic signing (hardcoded dev value in repo — must be rotated and moved to env for production) |
| `DEBUG` | Development mode flag (`True` in repo) |
| `ALLOWED_HOSTS` | Host header allowlist (empty in repo) |
| `DATABASES['default']` | SQLite file at `portal/db.sqlite3` |
| `INSTALLED_APPS` | Django contrib + allauth + Google provider + bootstrap5 |
| `AUTHENTICATION_BACKENDS` | ModelBackend + allauth `AuthenticationBackend` |
| `LOGIN_REDIRECT_URL` / `LOGOUT_REDIRECT_URL` | Both set to named route `home` |
| `ACCOUNT_EMAIL_REQUIRED` | `True` — email mandatory for accounts |
| `ACCOUNT_AUTHENTICATION_METHOD` | `'email'` |
| `ACCOUNT_LOGOUT_ON_GET` | `True` — logout via GET request |
| `SOCIALACCOUNT_LOGIN_ON_GET` | `True` — flagged in settings comment as risky; enables login initiation on GET |
| `SOCIALACCOUNT_PROVIDERS['google']` | Google OAuth app credentials (client id + secret stored inline — **must be externalized**; not reproduced here) |
| `STATIC_URL` / `STATICFILES_DIRS` | Serves `portal/static/` |

No `.env` example file is checked in. `.env`, `venv/`, and `db.sqlite3` are gitignored per `.gitignore`.

### 6.1 HTTP / API endpoints

Django URLconf plus standard allauth routes. No custom REST API.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home captive-portal landing page (`home.html`); shows login prompt or welcome | none (public); content varies if session authenticated |
| `GET/POST` | `/admin/` | Django admin interface | staff session |
| `GET/POST` | `/accounts/login/` | allauth login page | none |
| `GET` | `/accounts/logout/` | allauth logout (`ACCOUNT_LOGOUT_ON_GET=True`) | session |
| `GET/POST` | `/accounts/signup/` | allauth registration (if enabled) | none |
| `GET` | `/accounts/google/login/` | Initiate Google OAuth (`SOCIALACCOUNT_LOGIN_ON_GET=True`) | none |
| `GET` | `/accounts/google/login/callback/` | Google OAuth callback | none |
| `…` | `/accounts/*` | Additional allauth routes (password reset, email verification, etc.) | varies |

Facebook OAuth routes are **not** active because the Facebook provider is not registered in `INSTALLED_APPS` / `SOCIALACCOUNT_PROVIDERS` despite README mention.

### 6.2 Other interfaces

- **CLI:** `python manage.py` from `portal/` directory (standard Django management commands: `runserver`, `migrate`, `createsuperuser`, etc.).
- **WSGI/ASGI:** `config.wsgi.application` / ASGI equivalent for production servers (gunicorn, uvicorn).
- **UniFi captive portal protocol:** Intended via `django-unifi-portal` dependency; no integration code visible in current tree.

## 7. Data & persistence

- **Store:** SQLite single-file database (`portal/db.sqlite3`, gitignored).
- **Entities:** Standard Django `auth_user` and allauth-related tables created by migrations (no custom models in repo). Social account linkage stored via allauth's `socialaccount` tables.
- **Topology:** Single-process Django app suitable for edge deployment on a small VM or Raspberry Pi behind the WiFi controller. No Redis, Postgres, or external session store configured. Offline-capable at the app layer (SQLite local), but OAuth requires outbound internet to Google.

## 8. Docs & agent memory (required scan)

| Source | Finding |
|--------|---------|
| `README.md` | Describes captive portal purpose, Google/Facebook auth, and first-visit reception workflow. Credits a third-party django-allauth Bootstrap template author. |
| `docs/` | **Not present** |
| `.docs/` | **Not present** |
| `.claude/` | **Not present** |
| ADRs / PRDs / constitution | **Not present** |
| `LICENSE` | MIT License, Copyright 2022 Kodex Arg |

No agent instruction trees or hidden documentation vaults exist in this repository. All product context comes from the root README and inline settings comments.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — summary describes purpose without publishing clone links as product endpoints.
- **Auth model:** Session-based Django authentication augmented by django-allauth social OAuth (Google configured). Email is the primary account identifier.
- **Credential hygiene:** The checked-in `settings.py` contains a development `SECRET_KEY` and inline Google OAuth client credentials. **This summary contains none of those values.** Any deployment must rotate secrets, set `DEBUG=False`, configure `ALLOWED_HOSTS`, and move OAuth credentials to environment variables or a secrets manager.
- **Risk flags:** `SOCIALACCOUNT_LOGIN_ON_GET=True` noted in source as risky (CSRF/login CSRF surface). `ACCOUNT_LOGOUT_ON_GET=True` allows logout via GET.
- **Guest data:** OAuth flows exchange identity with Google; privacy policy and data-retention practices are not documented in-repo.
- **Gitignore respected:** `.env`, `venv/`, `db.sqlite3`, and build artifacts were not read.

## 10. Operational picture

### Local development

1. Create a Python virtual environment (gitignored).
2. Install dependencies: `pip install -r requirements/django-unifi-portal.txt` (or `requirements/base.txt` for minimal Django only — allauth/bootstrap5 pins are only in the extended file).
3. `cd portal && python manage.py migrate`
4. `python manage.py runserver`
5. Configure Google OAuth app credentials via environment or settings (not documented in-repo).

### Deployment

- No GitHub Actions, Dockerfile, or deployment manifests found.
- Production would require a WSGI server, HTTPS termination (required for OAuth redirects), static file serving, and captive-portal hardware redirect configuration pointing guest traffic to this host.

### Hardware context

- Template title references "KM1107 - WiFi Portal", suggesting deployment for a specific venue or property code.
- `django-unifi-portal` dependency implies UniFi network gear as the intended captive-portal enforcement layer.

## 11. Open questions / unknowns

- **Facebook provider:** README claims Facebook auth; settings and `INSTALLED_APPS` only configure Google. Status of Facebook integration is unknown.
- **UniFi integration:** `django-unifi-portal` is pinned in requirements but not added to `INSTALLED_APPS` or referenced in URLconf — integration status unknown.
- **First-visit reception gate:** Described in README but no models, views, or templates implement approval workflow.
- **Extended requirements vs active stack:** `requirements/django-unifi-portal.txt` lists DRF, oauth-toolkit, social-auth, django-material — none appear in current settings. Unclear if these are legacy or planned.
- **Production deployment target:** No CI/CD or hosting configuration; deployment platform unknown.
- **Custom CSS:** `portal/static/base.css` is empty; styling relies entirely on Bootstrap via django-bootstrap5.
- **Tests:** No test modules or pytest configuration present.
