---
id: "docker-kmportal"
title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal"
visibility: private
importance: normal
source_repo: "docker-kmportal"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags: ["django", "docker", "mysql", "fuel-station", "b2b", "fleet", "gunicorn", "nginx", "tailwind", "flowbite", "oauth", "i18n", "ec2", "aws", "s3", "intranet"]
problems_solved:
  - "B2B fleet customers at a fuel station need a self-service web portal to place multi-tank fuel load orders, manage company drivers and vehicles, and request cash transfers—without phone calls or paper forms."
  - "Pump operators need a separate intranet to scan QR codes, fulfill fuel orders on-site, record actual liters dispensed, and attend ExtraCash requests—decoupled from the customer-facing portal."
  - "The Django application must run reproducibly in containers (MySQL + Gunicorn + Nginx) for local dev and EC2 production, with environment-driven database and cloud storage configuration."
technologies:
  - "Django 4.2"
  - "Python 3.12"
  - "MySQL 8"
  - "Docker / docker-compose"
  - "Gunicorn + Nginx"
  - "django-allauth (Google OAuth)"
  - "Django REST Framework"
  - "django-tailwind + Flowbite"
  - "django-storages / boto3 (S3)"
  - "WhiteNoise + django-compressor"
  - "pytest"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# KM 1151 Enterprise Portal (docker-kmportal)

> **Problem thesis (required):** This repository packages and delivers a Django-based enterprise web portal for KM 1151, an Argentine fuel station serving B2B fleet customers. It solves the operational gap between fleet dispatchers (who need to order fuel loads across tractor, backpack, and chamber tanks for specific drivers and plates) and on-site pump operators (who need a staff intranet to fulfill those orders via QR scanning and refueling records). The `docker-kmportal` repo unifies the application source, Docker build/runtime configuration, and deployment scaffolding so the portal can be developed locally and deployed to EC2 with a consistent MySQL-backed stack.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/docker-kmportal` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Containerized Django portal for B2B fuel load ordering, ExtraCash transfers, and pump-operator fulfillment at KM 1151. |
| Audience | B2B fleet customer users (OAuth login), pump operators (staff intranet), Django admins, and internal operators deploying to EC2. |

## 2. Problems it solves

### P1 — B2B fleet fuel ordering without manual coordination

- **Who hurts:** Fleet dispatchers and transport companies (B2B partners) who regularly send trucks to KM 1151 for multi-tank refueling.
- **Pain today:** Coordinating fuel loads by phone or paper is error-prone: wrong driver, wrong plate, unclear liters per tank (tractor / backpack / chamber), and no shared audit trail of order state (paused, locked, agreed, finished).
- **How this repo answers:** The `app` Django application models `FuelOrders` with operation codes, company-scoped drivers, tractors, and trailers, fuel-type choices (Infinia Diesel, Infinia, Diesel 500, Super), liters-to-load per tank, agreement workflow, and pause/lock/finish flags. Customer users authenticate via Google OAuth (django-allauth), land on a localized user home, and manage orders through module views (`orders/`, `order/new/`, `order/<operation_code>/`). QR codes tie orders to the staff fulfillment flow.
- **Out of scope:** Consumer retail fuel purchases, payment processing, real-time pump hardware integration, and the ticketing/helpdesk module (still marked under construction).

### P2 — Pump-operator fulfillment intranet

- **Who hurts:** On-site pump operators who must fulfill queued fuel orders and ExtraCash requests accurately and record actual dispensed liters.
- **Pain today:** Without a dedicated staff UI, operators cannot reliably match incoming orders to physical refueling events, capture photos/documents, or prevent duplicate refueling of finished orders.
- **How this repo answers:** The `staff` Django app provides a separate login path (`staff/login/`) restricted to users in the "Pump Operators" group. Operators access QR scanning (`staff/qr/`), order lists (`staff/orders/`), refueling forms (`staff/refueling/<operation_code>/`), and ExtraCash attendance (`staff/extracash/`). The `Refuelings` model links one-to-one to `FuelOrders` and records actual liters, fuel types, observations, and attached document images stored via S3-backed `DocumentStorage`.
- **Out of scope:** Full HR/payroll for operators, inventory management of underground tank levels, and Instagram OAuth (listed in roadmap but not implemented).

### P3 — Reproducible containerized deployment

- **Who hurts:** Developers and operators who need the portal running consistently across local machines and EC2 production hosts.
- **Pain today:** A bare Django project on a developer laptop does not match production topology (MySQL, reverse proxy, WSGI server, env-driven secrets). Manual EC2 setup is fragile and hard to onboard.
- **How this repo answers:** Root `Dockerfile` (Python 3.12 slim), `docker-compose.yml` (MySQL 8, web/Gunicorn, Nginx 1.25), `config/gunicorn.config.py`, `config/nginx.conf`, and `entrypoint.sh` define a three-service stack. Environment variables drive database credentials and Django settings. README documents EC2 deployment via GitHub Actions SSH pull workflow (referenced in docs; workflow file not present in current shallow clone). Extras include EC2 bootstrap script and a standalone MySQL compose stub.
- **Out of scope:** Kubernetes orchestration, Terraform/IaC, and fully automated initial EC2 provisioning (README states EC2 must be pre-configured).

## 3. Product / idea

The central idea is a **two-surface Django monolith** for a fuel-station enterprise:

1. **Customer portal (`app`)** — OAuth-authenticated B2B users linked to a `Company` via `CompanySocialAccount`. They manage fleet metadata (drivers, tractors, trailers), create and track fuel orders and ExtraCash requests, and export CSV reports. Pages are internationalized (Spanish default, English and Portuguese) via Django i18n plus a custom `translations.json` workflow.

2. **Staff intranet (`staff`)** — Username/password login for pump operators. QR-based order lookup converts a `FuelOrders` operation code into a `Refuelings` record. Operators record actual liters dispensed per tank, attach photos, and mark orders finished.

3. **Container runtime** — Nginx terminates HTTP on port 8000 (host) and proxies to Gunicorn on 8080 inside the `web` container. MySQL persists data in a named volume. The Django `portal/` tree is bind-mounted for development.

Mental model: **Order creation (customer) → QR/share operation code → Staff scan/lookup → Refueling record (operator) → Order finished**. ExtraCash follows a parallel cash-transfer workflow with document image uploads.

The project README explicitly states it is **work in progress and not production-ready**, with incomplete ticketing, partial OAuth (Google only, not Instagram), and ongoing S3 document storage setup.

### 3.1 North-star use cases

1. A fleet dispatcher logs in with Google, creates a fuel order specifying driver, tractor/trailer plates, fuel types, and liters per tank, then shares the operation code or QR with the driver heading to the station.
2. A pump operator logs into the staff intranet, scans the QR or enters the operation code, records actual liters dispensed into `Refuelings`, uploads dispatch photos to S3, and marks the order finished.
3. A fleet user requests an ExtraCash (cash transfer) for a driver, uploads supporting document images, and a pump operator attends the request through `staff/extracash/<operation_code>/`.
4. An operator runs `docker compose up` locally with `.env` pointing at the bundled MySQL service for full-stack development.
5. On push to `main`, a GitHub Actions workflow (documented in README) SSHes into EC2, pulls latest code, installs requirements, and runs migrations.

### 3.2 Non-goals

- Editing fuel orders after agreement is locked (explicit "Won't" in `extras/docs/TODO.md`).
- Instagram OAuth (roadmap item, not implemented).
- Ticketing/helpdesk module (routes to `under_construction` placeholder).
- Full REST API exposure (`api` app exists but views are empty; API URL include is commented out in `urls.py`).
- Production-hardened security defaults (DEBUG driven by env; `ALLOWED_HOSTS = ["*"]` in settings).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.12 | `Dockerfile` base image |
| Web framework | Django 4.2.6 | `requirements.txt`, `config/requirements.txt` |
| Database | MySQL 8 (docker) / RDS (production per README) | `docker-compose.yml`, `portal/portal/settings.py` |
| WSGI / reverse proxy | Gunicorn 21 + Nginx 1.25 | `config/gunicorn.config.py`, `config/nginx.conf`, `docker-compose.yml` |
| Auth | django-allauth 0.57 (Google, Facebook provider registered) | `portal/portal/settings.py`, `portal/app/adapters.py` |
| API (scaffold) | Django REST Framework 3.14 | `requirements.txt`; `portal/api/views.py` empty |
| Frontend styling | django-tailwind 3.6, Flowbite 1.6, Tailwind CSS 3.3 | `portal/theme/static_src/package.json`, `portal/portal/settings.py` |
| Static assets | WhiteNoise, django-compressor | `portal/portal/settings.py` |
| Object storage | django-storages + boto3 → S3 bucket `portal-km1151` | `portal/portal/settings.py`, `portal/portal/custom_storage.py` |
| i18n | Django locale (en, es, pt) + `translations.json` | `portal/locale/`, `portal/translations.json`, `portal/translations.py` |
| QR | qrcode 7.4 | `requirements.txt`, `portal/app/views/helpers.py` |
| Logging / debug | loguru, icecream | `requirements.txt`, used in models/views |
| Tests | pytest 7.4 | `requirements.txt`; test modules in `app/`, `staff/`, `api/` |
| Containerization | Docker, docker-compose v2 services | `Dockerfile`, `docker-compose.yml` |
| CI/CD | GitHub Actions SSH deploy (documented) | `README.md` references `.github/workflows/pull-ec2.yml` (not in clone) |

### 4.1 Notable dependencies (curated)

- `django-allauth` — Google OAuth social login with custom adapter preventing duplicate email accounts across providers.
- `mysqlclient` — MySQL driver for Django ORM against `km1151` / `kmportal_db` database.
- `django-storages` / `boto3` — S3 upload for refueling and ExtraCash document images via `DocumentStorage`.
- `django-tailwind` + `flowbite` — Component-oriented UI without heavy custom JavaScript.
- `django-compressor` — CSS/JS minification pipeline for static assets.
- `qrcode` — Generates QR images for operation codes shared between customer and staff flows.
- `gunicorn` — Production WSGI server binding `0.0.0.0:8080`.
- `whitenoise` — Serves compressed static files in development and fallback production mode.
- `python-dotenv` — Loads `.env` for local and container configuration.

## 5. Repository map (abstraction)

- **Root / Docker zone (`/`)** — `Dockerfile`, `docker-compose.yml`, `entrypoint.sh`, `.env.example`, root `requirements.txt` (duplicate of config requirements). Top-level orchestration for the three-service stack.

- **Config zone (`config/`)** — `gunicorn.config.py` (bind, workers, chdir=`portal`), `nginx.conf` (reverse proxy to `web:8080`), `requirements.txt` (Python deps copied into image at build).

- **Django application (`portal/`)** — Main application tree mounted into the container at `/usr/src/app/portal`.
  - **`portal/portal/`** — Django project package: `settings.py`, `urls.py`, `wsgi.py`, `asgi.py`, `custom_storage.py`.
  - **`portal/app/`** — Customer-facing application: models (`Company`, `Drivers`, `Tractors`, `Trailers`, `FuelOrders`, `ExtraCash`, `Setting`), views split by concern (`authorized.py`, `orders.py`, `extracash.py`, `modules.py`, `unauthorized.py`, `helpers.py`), forms, adapters, migrations, templatetags.
  - **`portal/staff/`** — Pump-operator intranet: models (`Refuelings`, `Documents`), views (login, QR, refueling CRUD, order lists, ExtraCash attend), forms, migrations.
  - **`portal/api/`** — DRF scaffold (empty views; not wired in URLconf).
  - **`portal/theme/`** — django-tailwind app with `static_src/` (Tailwind/Flowbite build chain).
  - **`portal/templates/`** — Shared templates: `base/`, `components/`, `modules/`, `staff/`, SVG icons.
  - **`portal/static/`** — Compiled CSS, JS (Flowbite, jQuery, jsQR), images, SVG assets, compressor CACHE output.
  - **`portal/locale/`** — gettext catalogs for en, es, pt.
  - **`portal/translations.json`** + **`portal/translations.py`** — Centralized translation key management script.

- **Extras zone (`extras/`)** — Non-runtime supporting material.
  - **`extras/docs/`** — Internal design docs: `TODO.md`, `TABLES.md`, `PUMP_MODELS.md`, `ORDER_FORM_WORKFLOW.md`, `SKELETON.md`, `form.html`.
  - **`extras/scripts/`** — `translations.py`, `update_chrome.py`, `new-ec2-required.sh` (EC2 package bootstrap).
  - **`extras/ddbb/`** — Standalone MySQL compose stub and `open-mysql.py` helper.
  - **`extras/tailwind/`** — Alternate Tailwind plugin install scripts and package.json.

- **Docs vaults:** No `.docs/` directory. Internal documentation lives in `extras/docs/` and root `README.md`.

- **Agent scaffolding:** No `.claude/` directory. No `.agents/` or `SKILL.md` trees present.

- **Generated / vendor (existence only, not ingested):** `portal/static/CACHE/` (compressor output), `**/node_modules/` (gitignored), `mysql_data/` volume (gitignored), `local-cdn/` (gitignored).

## 6. Configuration & contracts (no secrets)

### Environment variables

From `.env.example` and `portal/portal/settings.py` (names and purpose only):

| Variable | Purpose |
|----------|---------|
| `MYSQL_DDBB` | MySQL database name |
| `MYSQL_USER` | MySQL application user |
| `MYSQL_PASS` | MySQL application password |
| `MYSQL_ROOT_PASS` | MySQL root password (compose only) |
| `MYSQL_HOST` | MySQL host (compose service `db` or RDS endpoint) |
| `MYSQL_PORT` | MySQL port |
| `SECRETKEY` / `DJANGO_SECRET_KEY` | Django secret key (naming differs between example and settings) |
| `DEBUG` / `DJANGO_DEBUG` | Debug mode toggle |
| `DJANGO_ALLOWED_HOSTS` | Allowed hostnames (example only; settings uses wildcard) |
| `DATABASE_URL` | Composite DSN in example (not used directly in settings.py) |
| `SITE_ID` | Django sites framework ID for allauth |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth client secret |
| `AWS_KEY` | AWS access key ID for S3 |
| `AWS_SEC` | AWS secret access key for S3 |

### Django settings highlights

- MySQL backend via env-driven `DATABASES` dict.
- `INSTALLED_APPS` includes allauth, compressor, rest_framework, tailwind, browser_reload, app, staff, api.
- Session/CSRF cookies set `SameSite=None` and `Secure=True` for cross-site OAuth.
- `CSRF_TRUSTED_ORIGINS` includes production domain and localhost (see `portal/portal/settings.py`).
- Static files: WhiteNoise compressed manifest storage locally; S3 config also present for document uploads.
- `DEFAULT_FILE_STORAGE` points to custom `DocumentStorage` on S3 under `static/documents/`.
- `LANGUAGE_CODE = "es"`; `LANGUAGES` = en, es, pt.

### Docker compose services

| Service | Image / build | Ports (host) | Role |
|---------|---------------|--------------|------|
| `db` | `mysql:8.0` | 3306 | Database with healthcheck |
| `web` | Build from `Dockerfile` | 8080 | Gunicorn WSGI |
| `nginx` | `nginx:1.25` | 8000→80 | Reverse proxy |

### 6.1 HTTP / API endpoints (when applicable)

The application exposes server-rendered Django views (not a JSON API). DRF is installed but unused. Key routes from `portal/portal/urls.py`:

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/admin/` | Django admin | staff superuser |
| `GET/POST` | `/accounts/` | allauth social auth flows | public |
| `GET/POST` | `/login/` | Login view | public |
| `GET` | `/i18n/` | Language switching | public |
| `GET` | `/get_qr/<operation_code>/` | QR image for operation code | public |
| `GET` | `/get-server-time/` | Server time helper | public |
| `GET` | `/export_csv/<company_id>/` | Export fuel orders CSV | login required |
| `GET` | `/orders/<order_id>/data/` | Order JSON data | login required |
| `POST` | `/orders/<order_id>/pause/` | Pause order | login required |
| `POST` | `/orders/<order_id>/delete/` | Delete order | login required |
| `POST` | `/orders/<order_id>/agreement/` | Update agreement status | login required |
| `GET` | `/staff/` | Staff home | pump operator session |
| `GET/POST` | `/staff/login/` | Staff login form | public |
| `GET` | `/staff/logout/` | Staff logout | pump operator session |
| `GET/POST` | `/staff/refueling/<operation_code>/` | Refueling form | pump operator session |
| `POST` | `/staff/handle_qr_code/` | QR code handler | pump operator session |
| `GET` | `/staff/qr/` | QR scanner page | pump operator session |
| `GET` | `/staff/orders/` | Staff order list | pump operator session |
| `GET` | `/staff/extracash/` | ExtraCash list | pump operator session |
| `GET/POST` | `/staff/extracash/<operation_code>/` | Attend ExtraCash | pump operator session |
| `GET` | `/<lang>/` | Home page | public (i18n) |
| `GET` | `/<lang>/about_us/` | About page | public |
| `GET` | `/<lang>/contact_us/` | Contact page | public |
| `GET` | `/<lang>/user_home/` | Authenticated user dashboard | login required |
| `GET` | `/<lang>/logout/` | Logout | login required |
| `GET` | `/<lang>/company/` | Company module | login required |
| `GET` | `/<lang>/vehicles/` | Vehicles module | login required |
| `GET` | `/<lang>/tickets/` | Ticketing (under construction) | login required |
| `GET/POST` | `/<lang>/extracash/` | ExtraCash module | login required |
| `GET` | `/<lang>/orders/` | Orders list | login required |
| `GET/POST` | `/<lang>/order/new/` | Create order | login required |
| `GET/POST` | `/<lang>/order/<operation_code>/` | View/edit order | login required |
| `GET` | `/under_construction/` | Placeholder page | public |

i18n prefix (`/<lang>/`) applies to customer routes via `i18n_patterns`. Staff and admin routes are outside i18n.

### 6.2 Other interfaces

- **CLI (Django management):** `python manage.py` from `portal/` — migrations, `createsuperuser`, `makemessages`, `compilemessages`, `runserver` (via `portal/runserver.sh`).
- **Translation pipeline:** Edit `portal/translations.json` → run `python translations.py` → `makemessages -a` → `compilemessages` (documented in README).
- **CSV export:** `ExportFuelOrderCSV` view for per-company fuel order data export.
- **QR interface:** jsQR library in static JS; server generates QR PNGs via `get_qr` helper.

## 7. Data & persistence

### Stores

- **MySQL** — Primary relational store for all Django models. Local dev uses Docker MySQL 8 with persistent `mysql_data` volume. Production uses AWS RDS (per README).
- **AWS S3** — Document and image uploads (`portal-km1151` bucket, `static/documents/` prefix) via `DocumentStorage` custom backend.
- **Local static** — WhiteNoise serves compressed static from `portal/static/` and `STATIC_ROOT` at `local-cdn/static/` (gitignored).

### Key entities

| Model | App | Role |
|-------|-----|------|
| `Setting` | app | Key-value project settings |
| `Company` | app | B2B partner (name, fantasy_name, CUIT) |
| `CompanySocialAccount` | app | Links OAuth social account to company |
| `Drivers` | app | Company-scoped drivers |
| `Tractors` | app | Company-scoped tractor plates |
| `Trailers` | app | Company-scoped trailer plates |
| `FuelOrders` | app | Core fuel load order with multi-tank liters, fuel types, workflow flags |
| `ExtraCash` | app | Cash transfer request with document image |
| `Refuelings` | staff | One-to-one fulfillment record for a fuel order |
| `Documents` | staff | Photos attached to a refueling |

### Topology

Customer browsers hit Nginx → Gunicorn → Django ORM → MySQL. Document uploads go Django → S3. Production EC2 hosts the Docker stack (or bare-metal Gunicorn per legacy README) with RDS as remote MySQL. No edge Workers or CDN layer beyond S3 for documents.

## 8. Docs & agent memory (required scan)

### Sources read

1. **Root README** (`README.md`) — Project overview, roadmap, structure, packages, installation, CI/CD, admin setup, i18n workflow. Evidence: `README.md`.
2. **Internal docs vault** (`extras/docs/`) — No `.docs/` directory; equivalent content in extras:
   - `extras/docs/TODO.md` — Active backlog, done items, won't-do list.
   - `extras/docs/TABLES.md` — Field-level schema reference for all models.
   - `extras/docs/PUMP_MODELS.md` — Narrative model documentation for pump-operator domain.
   - `extras/docs/ORDER_FORM_WORKFLOW.md` — Field responsibility matrix (model/form/view/template).
   - `extras/docs/SKELETON.md` — Aspirational project layout (differs from actual structure).
3. **Environment template** (`.env.example`) — Database and Django config shape. Evidence: `.env.example`.
4. **Docker / deploy configs** — `Dockerfile`, `docker-compose.yml`, `config/nginx.conf`, `config/gunicorn.config.py`, `entrypoint.sh`. Evidence: respective paths.
5. **Django project** — `portal/portal/settings.py`, `portal/portal/urls.py`, `portal/app/models.py`, `portal/staff/models.py`, `portal/app/adapters.py`. Evidence: respective paths.
6. **Translation system** — `portal/translations.json` (600+ lines of es/en/pt keys), `portal/translations.py`. Evidence: `portal/translations.json`.
7. **EC2 bootstrap** — `extras/scripts/new-ec2-required.sh` lists apt packages for EC2 host setup. Evidence: `extras/scripts/new-ec2-required.sh`.

### Agent scaffolding scan

- **`.claude/`** — Not present in repository.
- **`.docs/`** — Not present; `extras/docs/` serves as the hidden docs vault equivalent.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository. Summary contains no clone URLs or live credentials.
- **Auth model:** Customer users via Google OAuth (django-allauth) with custom adapter blocking duplicate-email cross-provider signups. Staff users via Django session login restricted to `is_staff` + "Pump Operators" group membership. Django admin for superusers.
- **Cookie security:** `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE` enabled; `SameSite=None` for OAuth cross-origin flows.
- **Settings concerns:** `ALLOWED_HOSTS = ["*"]` is permissive. S3 and OAuth credentials are env-driven (not committed). `.env` and `*.env` are gitignored.
- **This summary contains no secrets**, private keys, connection strings with passwords, or scraped `.env` contents.

## 10. Operational picture

### Local development

1. Copy `.env.example` to `.env` and fill database/Django variables.
2. `docker compose up --build` — starts MySQL, web (Gunicorn), and Nginx.
3. Access portal via host port 8000 (Nginx) or 8080 (Gunicorn direct).
4. Alternative: `portal/runserver.sh` or `python manage.py runserver` inside `portal/` for dev without full compose stack.
5. Tailwind rebuild: `npm run build` inside `portal/theme/static_src/`.

### Deployment

- **Documented:** GitHub Actions workflow `.github/workflows/pull-ec2.yml` triggers on push to `main`, SSHes to EC2, pulls code, upgrades pip, installs requirements, runs migrations. EC2 must have pre-cloned project and working RDS connection.
- **Not in clone:** `.github/` directory absent from shallow clone — workflow may have been removed, never committed, or lives only on remote history.
- **EC2 packages:** `extras/scripts/new-ec2-required.sh` installs python3, pip, git, gunicorn, tmux, psmisc, libmysqlclient-dev.

### Hardware constraints

- No GPU or embedded hardware requirements. Standard x86 Linux (EC2) or local Docker host sufficient.

## 11. Open questions / unknowns

- **GitHub Actions workflow:** README references `.github/workflows/pull-ec2.yml` but the directory is absent from the `main` branch shallow clone. Actual CI/CD state is unknown.
- **API layer:** `portal/api/` and DRF are installed but `views.py` is empty and URL include is commented out. Future API plans unclear.
- **PumpOperators model:** Documented in `extras/docs/PUMP_MODELS.md` and `TABLES.md` but not found as a Django model in current `staff/models.py` — operators use Django `User` + "Pump Operators" group instead. Docs may be stale.
- **Production readiness:** README and `extras/docs/TODO.md` both indicate WIP status. Ticketing, Instagram OAuth, pagination, and S3 document storage are incomplete.
- **Settings env naming:** `.env.example` uses `DJANGO_SECRET_KEY` while `settings.py` reads `SECRETKEY` — potential configuration mismatch for new deployments.
- **Static storage dual config:** `settings.py` defines both S3 and WhiteNoise static storage; last assignment wins (WhiteNoise). S3 appears intended for documents only via `DocumentStorage`.
- **Primary language on GitHub:** Reported as HTML (likely due to large template tree); actual application logic is Python/Django.
