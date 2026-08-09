---
id: "django-kmportal"
title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet"
visibility: private
importance: normal
source_repo: "django-kmportal"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags:
  - "django"
  - "mysql"
  - "fuel-station"
  - "b2b"
  - "fleet"
  - "km1151"
  - "grupo-alvs"
  - "argentina"
  - "i18n"
  - "tailwind"
  - "flowbite"
  - "django-allauth"
  - "oauth"
  - "gunicorn"
  - "aws"
  - "rds"
  - "s3"
  - "ec2"
  - "pump-operator"
  - "qr-code"
  - "extracash"
  - "private"
problems_solved:
  - "B2B fleet customers at a fuel-station enterprise need a web portal to place multi-tank fuel orders (tractor, backpack, chamber), track agreement status, and share operation codes with drivers — replacing phone, paper, or ad-hoc messaging."
  - "Pump operators at the physical station need a separate intranet to scan QR codes, fulfill refueling orders, attach photos and documents, and process ExtraCash (cash-transfer) requests without sharing the customer OAuth login surface."
  - "An Argentina-facing enterprise site must run in Spanish by default with Portuguese and English alternatives, while binding each OAuth social account to a B2B company (CUIT, drivers, tractors, trailers) for scoped data access."
technologies:
  - "Django 4.2"
  - "Python (requirements.txt; no pinned .python-version in tree)"
  - "MySQL via mysqlclient (local Docker compose; AWS RDS in production per README)"
  - "django-allauth (Google and Facebook OAuth; custom social adapter)"
  - "Django REST Framework 3.14 (api app scaffolded, routes commented out)"
  - "django-tailwind 3.6 + Flowbite 1.6 (theme app)"
  - "django-compressor + WhiteNoise (static delivery)"
  - "Gunicorn (production WSGI; runserver.sh binds 0.0.0.0:8080)"
  - "django-storages + boto3 (S3 document bucket portal-km1151)"
  - "Pillow (image uploads)"
  - "qrcode (operation-code QR generation)"
  - "loguru (structured logging)"
  - "pytest (test harness referenced in requirements)"
  - "django-browser-reload (dev hot reload)"
  - "django-sslserver (local HTTPS dev)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# KM 1151 Enterprise Portal

> **Problem thesis (required):** This repository is a Django web application for **KM 1151**, a fuel-station enterprise serving B2B fleet customers in Argentina. It digitizes the workflow from **fuel order creation** (by authenticated company users via social login) through **QR-based handoff** to **pump operators** who record refueling on a staff intranet, plus a parallel **ExtraCash** (cash transfer) module. The README explicitly marks the project as **work in progress and not production-ready**, but substantial modules (orders, vehicles, company, staff refueling, i18n, CI/CD hooks) are already implemented.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/django-kmportal` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Enterprise fuel-station portal where B2B fleet customers order fuel online and pump operators fulfill orders and ExtraCash requests through a staff intranet, with Spanish-first i18n and Google OAuth company binding. |
| Audience | B2B fleet dispatchers and company users (customer portal); pump operators and station staff (staff intranet); Django admins (admin site); internal operators deploying on EC2 with RDS MySQL. |

The product name in README is **KM 1151 Enterprise Portal**. It targets Grupo ALVS / KM 1151 operational context (Argentina, Spanish primary language). Customer users authenticate via django-allauth social providers; staff use a traditional username/password login restricted to the **Pump Operators** Django group.

## 2. Problems it solves

### P1 — B2B fleet fuel ordering without manual coordination

- **Who hurts:** Fleet dispatchers and transport companies (B2B partners) who must request diesel/gasoline loads across multiple vehicle tanks (tractor, backpack/mochila, chamber/cámara) before trucks arrive at the station.
- **Pain today:** Orders spread across phone calls, informal messages, or paper — hard to track agreement status, liters requested vs. loaded, expiration, and which driver/tractor/trailer combination applies. No shared operation code for station handoff.
- **How this repo answers:** The `app` Django application models **Company**, **Drivers**, **Tractors**, **Trailers**, and **FuelOrders** with a six-character `operation_code`, fuel-type enums (Infinia Diesel, Infinia, Diesel 500, Super), per-tank liter targets (including a sentinel `-1` meaning "max"), lifecycle flags (`is_locked`, `is_paused`, `is_finished`), and agreement states (`under_negotiation`, `no_agreement`, `agreed`). Views expose list/create/detail/edit flows under i18n URL prefixes, JSON endpoints for order data/pause/delete/agreement, CSV export per company, and QR PNG generation from the operation code.
- **Out of scope:** Full ticketing system (route exists but renders under-construction page). Instagram OAuth (README roadmap mentions it; only Google is configured in settings). Public anonymous order creation.

### P2 — Pump-operator fulfillment at the physical station

- **Who hurts:** Pump operators who must receive an order, record actual liters dispensed per tank, attach evidence photos, and mark refueling complete — often while the customer user is not at the console.
- **Pain today:** Disconnect between what the customer ordered online and what happens at the pump; risk of duplicate refueling records; no structured document capture.
- **How this repo answers:** The `staff` app provides a **separate login surface** (`staff/login/`) gated by `is_staff` and membership in the **Pump Operators** group. Operators scan QR codes (POST to `handle_qr_code/`), open refueling forms keyed by `operation_code`, and persist **Refuelings** (one-to-one with `FuelOrders`) plus related **Documents** images stored via custom S3-backed `DocumentStorage`. Staff list views cover active orders and ExtraCash queues; attend flows exist for ExtraCash by operation code.
- **Out of scope:** Full i18n for staff UI (explicit TODO in `extras/docs/TODO.md`). Replacing `staff_member_required` with Pump Operators group checks everywhere (noted as incomplete).

### P3 — Company-scoped identity for OAuth users

- **Who hurts:** Enterprise customers logging in with Google who must only see their own company's drivers, vehicles, and orders.
- **Pain today:** Social login alone does not map users to B2B legal entities (CUIT, fantasy name).
- **How this repo answers:** `CompanySocialAccount` links each `allauth` `SocialAccount` to a `Company`. `CustomAdapter` in `app/adapters.py` prevents duplicate social registrations when an email already exists. View helpers resolve `company` from the authenticated user's Google social account for template context and order scoping.
- **Out of scope:** Self-service company onboarding; admin must configure Sites and Social applications in Django admin per README.

## 3. Product / idea

The mental model is a **two-surface Django monolith** sharing one MySQL database and one set of domain models:

1. **Customer portal (`app`)** — Marketing pages (home, about, contact), OAuth login, authenticated `user_home`, and operational modules: fuel orders, ExtraCash, company profile, vehicles (drivers/tractors/trailers). URLs under `i18n_patterns` so paths are language-prefixed (default `es`).

2. **Staff intranet (`staff`)** — Non-i18n paths under `staff/` for pump operators: home, QR scanner, refueling CRUD, order list, ExtraCash list and attend. Uses Django auth `LoginView` with `CustomLoginForm`, not allauth.

3. **Shared infrastructure** — `portal/portal/settings.py` configures MySQL, allauth, compressor, tailwind theme app, WhiteNoise static files, and S3 document storage. `api` app is installed but views are empty and REST routes are commented out in `urls.py`.

Orders move through a lifecycle: customer creates `FuelOrders` → generates `operation_code` and QR → operator scans QR on staff side → creates `Refuelings` linked one-to-one → uploads `Documents` → marks finished. ExtraCash follows a parallel model with cash amounts and image proof uploads.

Internationalization uses Django's `locale/` PO files plus a custom `translations.json` + `translations.py` pipeline (makemessages → JSON merge → compilemessages) supporting **en**, **es**, **pt**.

### 3.1 North-star use cases

1. **Fleet dispatcher** logs in with Google, opens `orders/`, creates a new fuel order selecting driver, tractor, trailer, fuel types and liters per tank, shares the QR/operation code with the driver.
2. **Pump operator** logs into `staff/`, scans the QR, fills refueling liters and photos, completes the refueling record tied to the fuel order.
3. **Company admin** manages drivers and vehicle plates under `vehicles/` and `company/`, exports order CSV via `export_csv/<company_id>/`.
4. **ExtraCash requester** submits a cash-transfer order under `extracash/`; staff attends via `staff/extracash/<operation_code>/`.

### 3.2 Non-goals

- Production-ready stability (README disclaimer: bugs and incomplete features expected).
- Customer-side order **edit** after creation (listed under "Won't" in TODO).
- Instagram OAuth (roadmap only).
- Ticketing module (placeholder route only).
- Exposed REST API (DRF installed; `api/` include commented out).

## 4. Technology stack

Derived from `requirements.txt`, `portal/portal/settings.py`, `portal/theme/static_src/package.json`, and README.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python; Django 4.2.6 | `requirements.txt`, `portal/manage.py` |
| Frontend styling | Tailwind CSS 3.3, Flowbite 1.6, django-tailwind theme app | `portal/theme/static_src/package.json`, `settings.py` INSTALLED_APPS |
| Backend / API | Django 4.2 + class-based views; DRF present but unused | `portal/portal/urls.py`, `portal/api/views.py` |
| Auth | django-allauth (Google, Facebook providers); Django session auth for staff | `settings.py`, `app/adapters.py` |
| Data | MySQL (`django.db.backends.mysql`) | `settings.py` DATABASES, `extras/ddbb/docker-compose.yaml` |
| Object storage | AWS S3 bucket `portal-km1151` for documents/static experiments | `settings.py` AWS_* keys, `portal/portal/custom_storage.py` |
| Static assets | WhiteNoise + django-compressor; Tailwind build to `portal/static/css/dist/` | `settings.py`, `portal/guvicorn_app.py` |
| Infra / deploy | EC2 + Gunicorn + Nginx (per README/TODO); GitHub Actions `pull-ec2.yml` referenced | `README.md`, `portal/runserver.sh`, `extras/scripts/new-ec2-required.sh` |
| i18n | Django i18n + custom JSON translation sync | `portal/locale/`, `portal/translations.json`, `portal/translations.py` |
| Tests | pytest in requirements; sparse `tests.py` stubs | `requirements.txt`, `portal/app/tests.py` |
| Dev tooling | django-browser-reload, django-sslserver, icecream, Firebase IDX nix stub | `settings.py`, `.idx/dev.nix` |

**Note:** `requirements.txt` contains unresolved **git merge conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`) in the shallow clone — treat pinned versions as unreliable until the file is repaired.

### 4.1 Notable dependencies (curated)

- `Django==4.2.6` — core web framework and ORM for all domain models.
- `django-allauth==0.57.0` — OAuth login, Sites framework integration, social account linking.
- `mysqlclient==2.2.0` — production MySQL driver (requires `libmysqlclient-dev` on Ubuntu per README).
- `django-tailwind==3.6.0` + `flowbite` — component-oriented UI without heavy custom JavaScript.
- `django-storages` + `boto3` — S3-backed `DocumentStorage` for refueling/extracash images.
- `django-compressor` — bundles/compresses CSS/JS for production.
- `whitenoise==6.6.0` — serves compressed static files behind Gunicorn.
- `gunicorn==21.2.0` — WSGI server for EC2 deployment.
- `qrcode` + `Pillow` — operation-code QR PNG generation and image fields.
- `loguru` — logging across models, views, and translation scripts.
- `djangorestframework==3.14.0` — installed for future API work; not wired in URLs.

## 5. Repository map (abstraction)

```
django-kmportal/
├── portal/                    # Django project root (manage.py lives here)
│   ├── portal/                # Project package: settings, urls, wsgi, custom_storage
│   ├── app/                   # Customer B2B portal (models, views, templates, migrations)
│   │   └── views/             # Split by concern: orders, modules, extracash, authorized, unauthorized, helpers
│   ├── staff/                 # Pump-operator intranet (views, forms, models, templates)
│   ├── api/                   # DRF app shell (empty views)
│   ├── theme/                 # django-tailwind app (static_src for Tailwind build)
│   ├── templates/             # Global templates: home, modules, staff, components, base
│   ├── static/                # CSS, JS, images, video backgrounds, compressor CACHE
│   ├── locale/                # en, es, pt message catalogs
│   ├── translations.json      # Central translation key store
│   └── translations.py        # Sync script between JSON and PO/MO files
├── extras/
│   ├── docs/                  # Internal docs: tables, workflows, SSL, skeleton, TODO
│   ├── ddbb/                  # docker-compose MySQL stub, helper scripts
│   ├── scripts/               # EC2 bootstrap, translation utilities, Chrome updater
│   └── tailwind/              # Alternate Tailwind tooling (node_modules gitignored)
├── certificate/               # TLS material present in tree — **not ingested** (secret hygiene)
├── requirements.txt           # Python dependencies (merge conflict present)
├── README.md                  # Primary product README
└── test/                      # Empty placeholder file at repo root
```

**Entrypoints:**
- `portal/manage.py` — Django management CLI.
- `portal/runserver.sh` — Gunicorn on `0.0.0.0:8080`.
- `portal/guvicorn_app.py` — WhiteNoise-wrapped WSGI (despite filename, uses `get_wsgi_application`).

**Domain / core:** `portal/app/models.py` (Company, Drivers, Tractors, Trailers, FuelOrders, ExtraCash, Setting, CompanySocialAccount); `portal/staff/models.py` (Refuelings, Documents).

**Adapters:** `portal/app/adapters.py` (allauth), `portal/portal/custom_storage.py` (S3), view helpers in `portal/app/views/helpers.py` (QR, company resolution).

**Docs vaults:** `extras/docs/` (TABLES, PUMP_MODELS, ORDER_FORM_WORKFLOW, TODO, SSL_CERT, SKELETON). No `.docs/` hidden vault found. No `.claude/` agent tree found.

**Generated / vendor:** `portal/static/CACHE/` (compressor output), `**/node_modules/` (gitignored — not read), `portal/theme/static_src/node_modules/` (present in clone but ignored by policy).

## 6. Configuration & contracts (no secrets)

Environment variables (from README and `settings.py` — **names and purpose only**):

| Variable | Purpose |
|----------|---------|
| `SECRETKEY` | Django secret key (`settings.py` reads `SECRET_KEY` from this env name) |
| `DEBUG` | Debug mode toggle (`False` string disables debug) |
| `MYSQL_DDBB` | MySQL database name (README example: `km1151`) |
| `MYSQL_USER` | MySQL username |
| `MYSQL_PASS` | MySQL password |
| `MYSQL_HOST` | MySQL host (RDS endpoint in production) |
| `MYSQL_PORT` | MySQL port |
| `SITE_ID` | Django Sites framework ID for allauth |
| `AWS_KEY` | AWS access key ID for S3 storage |
| `AWS_SEC` | AWS secret access key for S3 storage |

Files intentionally **not read**: `.env`, `.envrc`, `certificate/*.pem`, `certificate/duckdns.ini` (credential/cert material).

**Settings highlights (`portal/portal/settings.py`):**
- `LANGUAGE_CODE = "es"`; `LANGUAGES` en/es/pt; `LOCALE_PATHS` → `portal/locale/`.
- `LOGIN_REDIRECT_URL = "user_home"`; `ACCOUNT_EMAIL_VERIFICATION = "none"`.
- Cookie security: `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SameSite=None` (cross-site OAuth).
- `CSRF_TRUSTED_ORIGINS` includes production portal host and localhost dev — values not reproduced here.
- Static config has **duplicate assignments** (`STATIC_URL` and `STATICFILES_STORAGE` set twice — S3 then WhiteNoise); indicates migration-in-progress between S3 and local CDN (`local-cdn/static`, gitignored).
- `DEFAULT_FILE_STORAGE` points at custom S3 `DocumentStorage` under `static/documents`.

### 6.1 HTTP / API endpoints

Django URL configuration in `portal/portal/urls.py`. Staff routes are **outside** `i18n_patterns`; customer routes are **inside** (language prefix required).

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/admin/` | Django admin | staff superuser |
| `GET/POST` | `/accounts/*` | allauth OAuth and account flows | public / session |
| `GET/POST` | `/login/` | allauth LoginView | public |
| `GET` | `/under_construction/` | Placeholder page | public |
| `GET` | `/get_qr/<operation_code>/` | QR PNG download for operation code | unknown (no login decorator on function view) |
| `GET` | `/get-server-time/` | JSON server timestamp | public |
| `GET` | `/export_csv/<company_id>/` | Export fuel orders CSV for company | authenticated (class view in authorized module) |
| `GET` | `/orders/<order_id>/data/` | JSON order payload | authenticated |
| `POST` | `/orders/<order_id>/pause/` | Pause order | authenticated |
| `POST` | `/orders/<order_id>/delete/` | Delete order | authenticated |
| `POST` | `/orders/<order_id>/agreement/` | Update agreement status | authenticated |
| `GET` | `/staff/` | Staff home | Pump Operators group + staff |
| `GET/POST` | `/staff/login/` | Staff username/password login | public |
| `POST` | `/staff/logout/` | Staff logout | session |
| `GET/POST` | `/staff/refueling/<operation_code>/` | Refueling form for order | staff (Pump Operators) |
| `POST` | `/staff/handle_qr_code/` | QR scan handler | staff |
| `GET` | `/staff/qr/` | QR scanner page | staff |
| `GET` | `/staff/orders/` | List orders for operators | staff |
| `GET` | `/staff/extracash/` | ExtraCash queue | staff |
| `GET/POST` | `/staff/extracash/<operation_code>/` | Attend ExtraCash request | staff |
| `GET` | `/<lang>/` | Home page | public |
| `GET` | `/<lang>/about_us/` | About page | public |
| `GET` | `/<lang>/contact_us/` | Contact page | public |
| `GET` | `/<lang>/user_home/` | Authenticated user dashboard | OAuth session |
| `GET` | `/<lang>/logout/` | Customer logout | session |
| `GET` | `/<lang>/company/` | Company module | authenticated |
| `GET` | `/<lang>/vehicles/` | Drivers/tractors/trailers | authenticated |
| `GET` | `/<lang>/tickets/` | Ticketing (under construction) | authenticated |
| `GET/POST` | `/<lang>/extracash/` | ExtraCash module | authenticated |
| `GET` | `/<lang>/orders/` | Order list | authenticated |
| `GET/POST` | `/<lang>/order/new/` | Create order | authenticated |
| `GET/POST` | `/<lang>/order/<operation_code>/` | Order detail/edit | authenticated |
| `GET` | `/i18n/setlang/` | Language switch (Django i18n) | public |

**REST API:** No active routes — `path("api/", include("app.api.urls"))` is commented out. `portal/api/views.py` is empty.

### 6.2 Other interfaces

- **Django management commands** — standard `manage.py` (migrations, `createsuperuser`, `makemessages`, `compilemessages`, Tailwind via django-tailwind).
- **Translation CLI** — `portal/translations.py` orchestrates makemessages + JSON merge + compilemessages; `extras/scripts/translations.py` is a sibling utility.
- **Local MySQL** — `extras/ddbb/docker-compose.yaml` exposes MySQL 3306 (placeholder volume path).
- **EC2 bootstrap** — `extras/scripts/new-ec2-required.sh` installs Python, pip, git, gunicorn, tmux, psmisc, libmysqlclient-dev.

## 7. Data & persistence

**Primary store:** MySQL database (name from `MYSQL_DDBB` env). Django migrations under `portal/app/migrations/` and `portal/staff/migrations/`.

**Important entities:**

| Model | App | Role |
|-------|-----|------|
| `Setting` | app | Key-value project settings (e.g. domain) |
| `Company` | app | B2B partner (name, fantasy_name, CUIT) |
| `CompanySocialAccount` | app | Links OAuth social account → company |
| `Drivers` | app | Driver roster per company |
| `Tractors` / `Trailers` | app | Vehicle plates per company |
| `FuelOrders` | app | Customer fuel orders (core workflow) |
| `ExtraCash` | app | Cash transfer requests |
| `Refuelings` | staff | Pump-side fulfillment record (1:1 with FuelOrders) |
| `Documents` | staff | Images attached to refuelings |

**Object storage:** Uploaded images (ExtraCash documents, refueling photos) go to S3 via `DocumentStorage` at prefix `static/documents/` inside bucket `portal-km1151`.

**Topology:** Cloud-shaped production (EC2 app server + RDS MySQL + S3 documents) with local dev using Docker MySQL compose stub and optional `local-cdn/` static output (gitignored). No edge Workers or serverless components.

**Custom managers:** `FuelOrdersManager` and `ExtraCashManager` annotate sort order prioritizing locked active orders; `RefuelingsManager` provides sorted query helpers.

## 8. Docs & agent memory (required scan)

| Source | Summary |
|--------|---------|
| `README.md` | Product overview, roadmap checklist, skeleton tree, package list, env var names, CI/CD description, admin setup for Google OAuth, explicit WIP / not-production disclaimer. |
| `extras/docs/TABLES.md` | Tabular schema reference for all major models. |
| `extras/docs/PUMP_MODELS.md` | Narrative model documentation including PumpOperators (referenced in docs; implementation uses User + Pump Operators group instead of separate model in current `staff/models.py`). |
| `extras/docs/ORDER_FORM_WORKFLOW.md` | Matrix of which layer owns each order field (model/form/view/template). |
| `extras/docs/TODO.md` | Running backlog: S3 static docs, refueling polish, i18n for staff, pagination, done-items history. |
| `extras/docs/SKELETON.md` | Aspirational project layout (differs from actual `portal/` structure). |
| `extras/docs/SSL_CERT.md` | Certbot + Nginx HTTPS setup notes (domain literal in doc — not repeated here). |
| `extras/docs/form.html` | HTML form reference artifact. |
| `.idx/dev.nix` | Empty Firebase IDX workspace stub (no packages enabled). |
| `.claude/` | **Not present** in repository — scan completed, nothing to summarize. |
| `.docs/` | **Not present** in repository — scan completed, nothing to summarize. |

No ADR, PRD, or constitution files found. Agent skill trees (`.agents/`, `SKILL.md`) absent.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — summary describes architecture without clone URLs or live credential values.
- **Auth model:** Customer users via OAuth (Google primary; Facebook provider registered). Staff via Django username/password with `is_staff` and **Pump Operators** group check on home view. Admin via Django superuser.
- **CSRF / cookies:** Secure cookies enabled; trusted origins configured for production host and localhost.
- **Data isolation:** Company scoping via `CompanySocialAccount`; orders tied to `company` FK. Known gap: `/order/new/` TODO notes drivers may not be filtered to current enterprise.
- **Certificate directory:** Repo contains `certificate/` with PEM and ini files — treated as secret material, not ingested.
- **Merge conflicts:** `portal/staff/views.py` contains unresolved conflict markers in the shallow clone — deployment risk if merged broken code ships.
- **This summary contains no secrets**, no `.env` contents, no PEM/key material, and no AWS credential values.

## 10. Operational picture

**Local development (from README):**
1. Install system deps: `python3-dev`, `libmysqlclient-dev`.
2. Create virtualenv, `pip install -r requirements.txt` (fix merge conflict first).
3. Provide `.env` with MySQL and Django vars (gitignored).
4. `python manage.py migrate`, `createsuperuser`.
5. `python manage.py runserver 0.0.0.0:8000` or Tailwind `npm run dev` inside `portal/theme/static_src/`.
6. Translation workflow: `makemessages -a` → `translations.py` → `compilemessages`.

**Production (from README):**
- EC2 instance with cloned repo, Gunicorn + Nginx, RDS MySQL database `km1151`, HTTPS via Certbot.
- `portal/runserver.sh` runs Gunicorn on port 8080.
- GitHub Actions workflow `.github/workflows/pull-ec2.yml` described in README: on push to `main`, SSH to EC2, pull, pip install, migrate — **workflow directory not present in shallow clone** (may be missing from branch or not fetched).

**CI/CD evidence gap:** README references `.github/workflows/pull-ec2.yml` but `.github/` directory is absent in the `main` shallow clone examined.

**Hardware constraints:** None specific (standard x86 EC2; no RPi/GPU requirements).

## 11. Open questions / unknowns

- Whether `.github/workflows/pull-ec2.yml` exists on remote but was omitted from shallow clone (directory entirely absent).
- Correct pinned Python and dependency versions — `requirements.txt` merge conflict must be resolved before reproducible installs.
- Production static file strategy — `settings.py` assigns both S3 and WhiteNoise storage backends; which is authoritative in deployed EC2 is unclear.
- `PumpOperators` model in docs vs. User+Group implementation in code — docs may be stale.
- Instagram OAuth roadmap status (provider registered in settings for Facebook; Instagram not listed in `SOCIAL_ACCOUNT_PROVIDERS`).
- Ticketing module scope and timeline (only under-construction route).
- When the project will exit explicit WIP status (README says not production-ready).
- Whether `certificate/` PEM files should remain in version control (security hygiene concern; contents not inspected).
