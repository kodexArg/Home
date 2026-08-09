---
id: "django-unifi-portal"
title: "Django UniFi Portal — reusable Django captive portal for UniFi guest WiFi with MAC authorization"
visibility: private
importance: normal
source_repo: "django-unifi-portal"
org: "kodexArg"
default_branch: "master"
primary_language: "Python"
repo_kind: "library"
status: "legacy"
related: []
tags: ["django", "python", "unifi", "ubiquiti", "captive-portal", "guest-wifi", "oauth2", "facebook", "social-auth", "wifi", "mac-authorization", "reusable-app", "material-design"]
problems_solved:
  - "UniFi guest WiFi networks with external captive portals need a server that authenticates individual users and then authorizes their device MAC address on the UniFi Controller — built-in voucher-only flows do not support per-user accounts, registration, or social login."
  - "Operators running Django stacks need a drop-in reusable app (not a one-off script) that wires Django authentication, optional Facebook OAuth, and the UniFi Controller REST API into the standard UniFi external-portal redirect flow."
  - "Venues and clubs want to collect guest profile data (email, phone, demographics) at WiFi login time while still satisfying UniFi's requirement to authorize the guest station via the controller API after successful authentication."
technologies:
  - "Python 2.7 (runtime.txt) / Python 3-capable demo with Django 2.2"
  - "Django 1.10–1.11 (library target) / Django 2.2.27 (demo)"
  - "django-material (Material Design forms)"
  - "python-social-auth / social-django (Facebook OAuth2)"
  - "django-rest-framework-social-oauth2"
  - "django-oauth2-provider"
  - "django-braces"
  - "requests + requests-toolbelt (SSL adapter for UniFi HTTPS)"
  - "Pillow (profile image storage)"
  - "SQLite (demo default database)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Django UniFi Portal

> **Problem thesis (required):** When a guest connects to a UniFi wireless network with guest policy and an **external portal** configured, the access point redirects HTTP traffic to a captive portal server. That server must (1) authenticate the guest, (2) receive UniFi query parameters identifying the guest device MAC and access point, and (3) call the UniFi Controller API to **authorize-guest** for a configurable duration. This private repository is a **reusable Django application** (`django_unifi_portal`) that implements that full loop: Django username/password login, self-service registration with profile fields, Facebook OAuth2 sign-in, and programmatic MAC authorization against UniFi Controller versions 3–5. It originated as a fork of the open-source `bsab/django-unifi-portal` project and is packaged for internal reuse with a demo project illustrating integration.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/django-unifi-portal` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Reusable Django app that authenticates WiFi guests (Django + Facebook OAuth) and authorizes their MAC on a UniFi Controller external captive portal. |
| Audience | Network operators and Django developers deploying UniFi guest WiFi with custom branding, user accounts, and social login; maintainers integrating the app into a host Django project. |

## 2. Problems it solves

### P1 — UniFi external portal requires post-auth MAC authorization

- **Who hurts:** Operators of UniFi access points with guest policies who configure an external captive portal instead of UniFi's built-in hotspot manager.
- **Pain today:** UniFi redirects unauthenticated guests to the external portal with query parameters (`id` = guest MAC, `ap` = AP MAC, `url` = original destination, `ssid`). After the guest proves identity, something must call the controller's `authorize-guest` command or the device remains blocked. Manual voucher systems do not tie authorization to individual user records.
- **How this repo answers:** The `UserAuthorizeView` at `guest/s/default/` is the UniFi landing path. After `@login_required` succeeds, the view reads MAC/AP/URL from the query string, persists MAC and login timestamp on the `UnifiUser` profile, instantiates `UnifiClient`, logs into the controller API, checks whether the MAC is already authorized, and if not posts `cmd: authorize-guest` with `UNIFI_TIMEOUT_MINUTES` from settings. Failure renders `forbidden.html`.
- **Out of scope:** UniFi built-in voucher/hotspot UI; RADIUS integration; per-SSID rate limiting; automatic deauthorization scheduling beyond the minutes parameter.

### P2 — Per-user guest accounts with registration and social login on a captive portal

- **Who hurts:** Venues (clubs, hotels, events) that want identifiable guest accounts, marketing opt-in, and Facebook sign-in rather than shared passwords or vouchers.
- **Pain today:** Captive portals are often static HTML forms or vendor-locked. Django's auth stack is powerful but does not include UniFi integration or Material-styled portal templates out of the box.
- **How this repo answers:** Ships `UnifiUserLogin` (email-as-username login form), `UnifiUserRegistration` (extended profile: phone, gender, terms acceptance, newsletter opt-in), and Facebook OAuth via `rest_framework_social_oauth2` at `/auth/`. A custom `SOCIAL_AUTH_PIPELINE` in `pipeline.py` creates `UnifiUser` profiles, pulls Facebook avatar/locale/city/birthday, and handles `AuthAlreadyAssociated` by logging out instead of raising. Forms use `django-material` layouts with Font Awesome social buttons.
- **Out of scope:** Google/Apple/other OAuth providers (backends are commented as extensible only); email verification workflows beyond social-auth mail validation; admin approval of new registrations.

### P3 — Encapsulating UniFi Controller API complexity in a Django library

- **Who hurts:** Django developers who do not want to reimplement controller login, cookie sessions, SSL quirks, and `stamgr` commands for every deployment.
- **Pain today:** UniFi's HTTPS API on port 8443 uses self-signed certificates, version-specific login paths (`login` vs `api/login`), and site-scoped endpoints (`api/s/{site_id}/cmd/stamgr`). Direct integration is error-prone.
- **How this repo answers:** `UnifiClient` in `unifi_client.py` wraps session management (LWPCookieJar persisted under `/tmp/unifi_cookie`), SSLAdapter for handshake issues, `login_on_unifi_server`, `authorize_guest`, `unauthorize_guest`, `_is_authorized` (via `stat/sta`), and the orchestration method `send_authorization`. Settings drive server host, port, version, site ID, and controller credentials.
- **Out of scope:** UniFi Network Application 6+ API changes; multi-site orchestration; guest analytics dashboards; firmware management.

## 3. Product / idea

The repository is structured as a **publishable Django app** plus a **demo host project**. The mental model:

1. Guest device associates with guest SSID → UniFi redirects browser to the external portal (must be configured as controller IP; README notes folder paths are not allowed in UniFi external portal settings).
2. Guest hits login (`/unifi-portal/login/`) or registration (`/unifi-portal/registration/`) or Facebook OAuth (`/auth/login/facebook`).
3. On success, Django session is established; UniFi's `next` redirect (stored in session as `mynext`) or default `index` sends the guest to `guest/s/default/?id=…&ap=…&url=…`.
4. `UserAuthorizeView` authorizes the MAC via controller API and shows `index.html` with SSID, timeout, and guest metadata from `unifi_context` context processor.

The `UnifiUser` model extends Django's `User` with portal-specific fields: profile picture, language, gender, city, about, date of birth, phone, last seen guest MAC, and last backend login source. A custom permission `can_navigate` is defined for future authorization gating.

The demo project (`demo/`) shows how a consuming site wires `unifi_settings.py` into `settings.py`, imports secrets from a separate `unifi_secret` module (not present in the tracked tree), mounts `django_unifi_portal.urls` at root, and adds a small `unifi` app with `ListGuestView` for listing registered guests.

### 3.1 North-star use cases

1. **Club/venue guest WiFi** — Guest connects to branded SSID, registers with email and phone, accepts terms, gets authorized for N minutes, and can browse.
2. **Returning guest via Facebook** — Guest taps "Sign in with Facebook"; pipeline creates or reactivates `UnifiUser`, downloads avatar, then MAC authorization proceeds on the index view.
3. **Operator inspection** — Demo `ListGuestView` at `/unifi/list-unifi-guest/` lists all `UnifiUser` records (intended for staff; no login decorator in current code).

### 3.2 Non-goals

- Not supported or endorsed by Ubiquiti (explicit README disclaimer).
- Package marked **still in development — use with caution** in README.
- Does not modernize to current Django LTS or Python 3 as a first-class target (classifiers and `runtime.txt` indicate Python 2.7 era; demo pins Django 2.2.27).
- Does not ship production deployment manifests (Docker, systemd, nginx) — integration is manual per README.
- `SECURITY.md` is a generic GitHub template with version table unrelated to this package's actual release line.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 2.7.13 declared; demo uses Django 2.2 | `runtime.txt`, `demo/requirements.txt` |
| Web framework | Django ≥1.10 (library); Django 2.2.27 (demo) | `setup.py`, `demo/requirements.txt` |
| UI / forms | django-material, Font Awesome static assets, jQuery 2.1.1 | `setup.py`, `django_unifi_portal/forms.py`, `django_unifi_portal/static/` |
| Auth / OAuth | django.contrib.auth, social-django (Facebook), oauth2_provider, rest_framework_social_oauth2 | `demo/demo_unifi_portal/unifi_settings.py`, `django_unifi_portal/urls.py` |
| HTTP client | requests, requests-toolbelt SSLAdapter, cookielib cookie jar | `django_unifi_portal/unifi_client.py` |
| Data | SQLite in demo; Django ORM models + migrations | `demo/demo_unifi_portal/settings.py`, `django_unifi_portal/migrations/` |
| Media | Pillow ImageField for profile pictures | `setup.py`, `django_unifi_portal/models.py` |
| Infra / deploy | None in tree — manual Apache/nginx + port 8443 forwarding per README | `README.md` |
| AI / agents | None — `.claude/` and `.docs/` absent | tree scan |
| Tests | unittest-style tests in demo | `demo/tests/` |

### 4.1 Notable dependencies (curated)

- `django-material` — Material Design form layouts and template builtins for login/registration screens.
- `django-rest-framework-social-oauth2` — OAuth2 URL include at `auth/` for social token flows.
- `social-django` / `social-core` — Facebook OAuth2 backends and pipeline hooks.
- `django-braces` — `AjaxResponseMixin` on demo guest list view.
- `requests-toolbelt` — `SSLAdapter` to work around UniFi controller SSL handshake behavior.
- `Pillow` — stores Facebook-downloaded avatars on `UnifiUser.picture`.

## 5. Repository map (abstraction)

- **Core library (`django_unifi_portal/`):** The installable app — models, views, forms, UniFi API client, social auth pipeline extensions, URL routes, HTML templates, static assets.
  - `views.py` — `UserAuthorizeView`, `UnifiUserLogin`, `UnifiUserLogout`, `UnifiUserRegistration`.
  - `unifi_client.py` — UniFi Controller HTTPS API adapter.
  - `pipeline.py` — social-auth pipeline steps: `manage_auth_already_associated`, `user_details`, `save_profile`, optional `require_email`.
  - `models.py` — `UnifiUser` profile linked to `User`.
  - `forms.py` / `form_mixin.py` — Material-styled login and registration forms.
  - `context_processor.py` — injects logo, SSID, timeout into templates.
  - `templates/` — `login.html`, `registration.html`, `index.html`, `forbidden.html`, `logged_out.html`, base layouts.
  - `migrations/` — schema evolution from 2017 (initial FK to User through profile field additions).
- **Demo host (`demo/`):** Example integration project `demo_unifi_portal` with `manage.py`, `settings.py`, `unifi_settings.py`, and thin `unifi` app for guest listing.
- **Packaging:** `setup.py` (version 0.0.2), `MANIFEST.in` (README, LICENSE, templates, static), `LICENSE` (MIT).
- **Documentation:** Root `README.md` (primary integration guide), `SECURITY.md` (placeholder).
- **Screenshots:** `screen/`, `logo-django-unifi.png` — UI and UniFi dashboard configuration examples.
- **Agent scaffolding:** `.claude/` — **not present**. `.docs/` — **not present**. No `docs/` tree.
- **Ignored / not tracked:** `.env`, `venv/`, `db.sqlite3`, `local_settings.py` per `.gitignore`; demo references `unifi_secret` module not in clone.

## 6. Configuration & contracts (no secrets)

Integration is split between `unifi_settings.py` (tracked template with placeholders) and host `settings.py` (merges `UNIFI_INSTALLED_APPS`, auth backends, pipeline, template processors). Demo additionally imports `unifi_secret` for sensitive values kept out of the tracked template.

**UniFi controller settings (names + purpose):**

| Setting | Purpose |
|---------|---------|
| `UNIFI_SERVER` | Controller hostname or IP |
| `UNIFI_PORT` | HTTPS API port (default 8443) |
| `UNIFI_VERSION` | API version selector (`v3`, `v4`, `v5`) |
| `UNIFI_SITE_ID` | UniFi site slug (e.g. `default`) |
| `UNIFI_USER` / `UNIFI_PASSWORD` | Controller admin credentials for API login |
| `UNIFI_SSID` | Display name in portal templates |
| `UNIFI_LOGO` | Static path to logo image |
| `UNIFI_TIMEOUT_MINUTES` | Guest authorization duration passed to `authorize-guest` |

**URL routing settings:**

| Setting | Purpose |
|---------|---------|
| `UNIFI_LOGIN_URL` | Django `LOGIN_URL` target |
| `UNIFI_LOGIN_REDIRECT_URL` | Post-login redirect (reverse to `index`) |

**Social auth settings:**

| Setting | Purpose |
|---------|---------|
| `SOCIAL_AUTH_FACEBOOK_KEY` / `SOCIAL_AUTH_FACEBOOK_SECRET` | Facebook app credentials |
| `SOCIAL_AUTH_FACEBOOK_SCOPE` | OAuth scopes (includes `email`) |
| `SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS` | Graph API field list |
| `SOCIAL_AUTH_PIPELINE` / `UNIFI_SOCIAL_AUTH_PIPELINE` | Ordered pipeline including custom steps |

**Demo-only:** `SECRET_KEY` is hardcoded in `demo/demo_unifi_portal/settings.py` (security anti-pattern for production; value not reproduced here). `DEBUG = False`, `ALLOWED_HOSTS = ['*']`.

### 6.1 HTTP / API endpoints (when applicable)

**Django portal routes** (`django_unifi_portal/urls.py`):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `guest/s/default/` | UniFi external portal landing; reads MAC/AP params, authorizes guest via API, renders success or forbidden | Django session (`login_required`) |
| `GET`/`POST` | `/` | Direct login form (`unifi_login_direct`) | none |
| `GET`/`POST` | `unifi-portal/login/` | Login form | none |
| `GET` | `unifi-portal/logout/` | Logout and redirect to login | session |
| `GET`/`POST` | `unifi-portal/registration/` | Self-service registration + auto-login | none (redirects if already authenticated) |
| `*` | `auth/` | OAuth2 / social auth routes from `rest_framework_social_oauth2` | varies by sub-route |

**Demo additional routes** (`demo/demo_unifi_portal/urls.py`, `demo/unifi/urls.py`):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `*` | `admin/` | Django admin | staff |
| `GET` | `unifi/list-unifi-guest/` | AJAX-capable list of all `UnifiUser` records | none in current code |

**UniFi Controller API** (outbound from `UnifiClient`, not exposed by this repo):

| Method | Path pattern | Purpose |
|--------|--------------|---------|
| `POST` | `https://{server}:8443/api/login` (v4/v5) | Controller admin login |
| `POST` | `https://{server}:8443/api/s/{site}/stat/sta` | List stations; check `authorized` flag |
| `POST` | `https://{server}:8443/api/s/{site}/cmd/stamgr` | `authorize-guest` / `unauthorize-guest` commands |
| `GET` | `https://{server}:8443/logout` | Controller logout |

### 6.2 Other interfaces

- **pip package:** `django-unifi-portal` installable via `setup.py` (`pip install` or VCS URL in README).
- **Django management:** Standard `manage.py migrate django_unifi_portal` to apply profile model migrations.
- **CLI:** None dedicated; operational tasks are Django shell / admin or direct API client usage in tests.

## 7. Data & persistence

- **Store:** Relational database via Django ORM. Demo defaults to SQLite (`db.sqlite3`, gitignored).
- **Core entities:**
  - `auth_user` (Django built-in) — username (often email), password hash, names, active flag.
  - `django_unifi_portal_unifiuser` — FK to User; fields: `picture`, `language`, `gender`, `city`, `about`, `dob`, `phone`, `guest_mac`, `last_backend_login`; custom permission `can_navigate`.
  - Social auth tables from `social_django` and `oauth2_provider` when those apps are installed.
- **Media:** `MEDIA_ROOT` / `MEDIA_URL` in demo for uploaded profile images; default placeholder `profile_images/user_no_image.png`.
- **Topology:** Single Django app server reachable by guest devices and able to reach UniFi Controller HTTPS API (port 8443, often requires firewall forwarding if offsite). Cookie file for UniFi sessions stored on app server filesystem at `/tmp/unifi_cookie`.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

- `README.md` — primary documentation: problem statement, quick start, `unifi_settings.py` template, UniFi controller external portal configuration, screenshots, disclaimer, MIT license, development warning.
- `SECURITY.md` — generic vulnerability reporting template; version support table does not reflect this package.
- `setup.py` — package metadata, dependency list, PyPI classifiers.
- `LICENSE` — MIT.
- `demo/demo_unifi_portal/settings.py` — demo wiring pattern (imports `unifi_settings`, `unifi_secret`).
- `demo/demo_unifi_portal/unifi_settings.py` — canonical settings shape for consumers.
- `django_unifi_portal/urls.py`, `views.py`, `unifi_client.py`, `models.py`, `forms.py`, `pipeline.py` — behavioral source of truth for routes and flows.

**Absent (scanned, not found):**

- `.claude/` — no agent instruction tree in this repository.
- `.docs/` — no hidden docs vault.
- `docs/` — no conventional docs directory.
- ADRs, PRDs, constitution, or CI workflow files — not present in shallow clone.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg`; summary contains no clone URLs or live credentials.
- **Auth model:** Django session cookies after form login or Facebook OAuth; `UserAuthorizeView` requires authenticated session before MAC authorization. Registration collects PII (email, phone, gender, optional marketing consent).
- **Transport:** UniFi API client disables SSL verification (`verify=False` on login POST) and uses legacy SSL protocol adapter — weak by modern standards.
- **Exposure:** Demo `ListGuestView` has no `login_required` — guest list may be publicly accessible if deployed as-is. Demo `ALLOWED_HOSTS = ['*']` and embedded `SECRET_KEY` are unsafe for production.
- **Secrets handling:** Real deployments expected to use `unifi_secret` (demo) or environment-specific modules for `UNIFI_PASSWORD`, Facebook keys, and `SECRET_KEY`. `.env` is gitignored; no `.env` files were read.
- **This summary contains no secrets**, private keys, connection strings with passwords, or scraped environment files.

## 10. Operational picture

**Local development (demo):**

1. Create Python environment; install `demo/requirements.txt` (pins Django 2.2.27 and VCS install of this package).
2. Provide `demo/demo_unifi_portal/unifi_secret.py` with real UniFi and Facebook credentials (referenced by settings but not in repo).
3. `python manage.py migrate` (including `django_unifi_portal`).
4. Run Django dev server or deploy behind Apache/nginx as README describes.
5. Configure UniFi controller external portal to point at the portal server IP (not a subpath); may require Apache index redirect or symlink trick per README.

**Deployment:**

- No GitHub Actions, Dockerfile, or wrangler config in tree.
- README assumes Apache2 (or similar) reverse proxy, static file serving when `DEBUG=False`, and network path to controller port 8443.
- Last git push to remote: 2022-04-20 (metadata via `gh repo view`).

**Tests:**

- `demo/tests/test_login.py` — integration test for `guest/s/default/` with sample MAC query strings (expects 200 when authenticated, 404 on wrong path).
- `demo/tests/test_api_client.py` — live UniFi API tests (login, authorize, unauthorize, logout); require real controller credentials in settings to pass.

## 11. Open questions / unknowns

- Exact delta from upstream `bsab/django-unifi-portal` — not documented in README; kodexArg fork history unknown from tree alone.
- Whether `unifi_secret.py` ever existed in a private branch or only locally — demo `settings.py` imports it but file is absent from clone.
- Production deployment target for kodexArg (hostname, reverse proxy, TLS termination) — not specified in repository.
- Compatibility with modern UniFi Network Application (7.x+) API — code targets v3–v5 login and `stamgr` paths; newer controllers may need API updates.
- Python 3 migration status — `runtime.txt` still says Python 2.7; demo uses Django 2.2 but library code uses Python 2 idioms (`print` statements, `django.core.urlresolvers`, `cookielib`, `urllib.urlopen`, `user.is_authenticated()` callable form).
- CI/CD and automated test execution — no workflow files found.
- Whether the package is still actively used in any kodexArg venue deployment — last code push 2022; metadata updated 2024 without corresponding commits visible in shallow clone.
