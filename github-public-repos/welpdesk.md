---
id: "welpdesk"
title: "Welp Desk — configurable multi-organization Django help-desk ticketing"
visibility: public
importance: normal
source_repo: "welpdesk"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags:
  - "django"
  - "htmx"
  - "postgresql"
  - "docker"
  - "help-desk"
  - "ticketing"
  - "multi-tenant"
  - "nginx"
  - "gunicorn"
  - "vite"
  - "tailwindcss"
  - "django-components"
  - "on-premise"
  - "spanish"
problems_solved:
  - "Organizations with multiple business units (branches, departments, franchises) need a help-desk where ticket visibility follows organizational hierarchy — not a single flat queue where every agent sees every ticket."
  - "Off-the-shelf ticketing tools often force rigid category trees and permission models that do not map to real-world UDN/Sector structures (e.g. fuel-station networks with Full, Playa, Administración areas) without expensive customization."
  - "Internal IT teams need a self-hosted, containerized ticketing stack they can deploy on their own infrastructure with file attachments, status workflows, and partial-page UI updates — without building a heavy SPA or subscribing to SaaS per seat."
technologies:
  - "Django 5.1"
  - "PostgreSQL 16"
  - "HTMX 1.9"
  - "Vite 6 + Tailwind CSS 4"
  - "django-components 0.131"
  - "django-vite 3.1"
  - "Gunicorn 23"
  - "Nginx (reverse proxy)"
  - "Docker Compose"
  - "Loguru"
  - "PyYAML (DB seed)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Welp Desk

> **Problem thesis (required):** Welp Desk is a **self-hosted, multi-organizational help-desk ticketing system** built on Django 5 with HTMX-driven partial updates. It solves the pain of running internal support across **many business units (UDNs) and functional sectors** where ticket visibility must follow Django group membership — not a one-size-fits-all SaaS permission model. Operators create tickets through a cascading UDN → Sector → Category → Issue wizard, attach files up to 50 MB, and track lifecycle states via threaded messages. The stack ships Dockerized (Postgres + Gunicorn + Nginx) with YAML-driven database seeding for rapid org-specific rollout, exemplified by a fuel-station / DEBO-YPF IT support configuration in `configs/initialize-db/`.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/welpdesk` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Configurable multi-organization help-desk ticketing built with Django 5 + HTMX, containerized with Docker, with granular group-based access per UDN and Sector. |
| Audience | IT support teams and help-desk operators in multi-site organizations (retail, fuel stations, franchises); Django administrators configuring UDN/Sector hierarchies and issue taxonomies; developers extending HTMX partials or Django admin; operators deploying via Docker Compose on Linux servers. |

## 2. Problems it solves

### P1 — Hierarchical ticket visibility across business units

- **Who hurts:** Help-desk managers at organizations with multiple branches or business units (UDNs) and functional areas (Sectors) — e.g. two fuel stations each with Full, Playa, Administración, and Parador zones — where agents must only see tickets for sites and areas they support.
- **Pain today:** Generic ticketing tools offer flat queues or coarse role-based access; mapping real org charts (UDN × Sector intersections) requires custom fields, manual filtering, or expensive enterprise tiers. Agents either see too much (privacy/noise) or too little (missed escalations).
- **How this repo answers:** Core domain models `UDN`, `Sector`, `IssueCategory`, and `Issue` form a configurable taxonomy. `TicketManager` in `core/models.py` filters tickets so non-staff users see only rows where they belong to **both** the ticket's UDN group (or admin permission group) **and** its Sector group. Staff users bypass filtering. HTMX list views (`TicketListView`, `htmx_list_content`) respect the same queryset. Django `Group` objects are auto-created per UDN (`UDN {name}`) and Sector (`SECTOR {name}`) during `post_migrate` seeding in `core/apps.py`.
- **Out of scope:** Federated identity across external orgs (SAML/OIDC not implemented); cross-tenant SaaS billing; automatic SLA timers or escalation rules; email-to-ticket ingestion.

### P2 — Fast deployment with org-specific taxonomy pre-seeded

- **Who hurts:** Teams rolling out a new help desk who would otherwise spend days manually entering dozens of issue types, categories, and org nodes through Django admin before the system is usable.
- **Pain today:** Greenfield ticketing installs start empty; every UDN, sector, category, and issue type must be typed by hand. Copy-paste from spreadsheets is error-prone and does not wire up permission groups.
- **How this repo answers:** `configs/initialize-db/initialize-db.yaml` declares the full hierarchy (UDNs, Sectors, IssueCategories, Issues) in YAML. On `post_migrate`, `CoreConfig.populate_db` loads this file, creates model rows, and `create_model_groups` assigns Django groups to each UDN and Sector. Documentation in `configs/initialize-db/initialize-db.md` explains customization limits (model names are fixed; each Issue belongs to one IssueCategory). Default role groups (`Operator`, `Auditor`, `Support`, `Administrative`) receive curated Django permissions in `setup_groups_and_permissions`. A real-world example targets fuel-station operations (DEBO, YPF, Soporte IT categories).
- **Out of scope:** Hot-reloading taxonomy without migration/restart; multi-format seed loaders beyond YAML (TOML/JSON mentioned in docs but only YAML loader implemented in `core/apps.py`); UI for editing YAML inside the app.

### P3 — Lightweight reactive UI without a JavaScript SPA

- **Who hurts:** Internal IT teams who want filterable ticket lists, cascading create forms, and attachment widgets with minimal frontend complexity and no separate Node API server in production.
- **Pain today:** Full React/Vue SPAs add build pipelines, auth duplication, and API contracts; plain Django templates require full page reloads for every filter change; older jQuery stacks are hard to maintain.
- **How this repo answers:** Server-rendered Django templates augmented with **HTMX** (`htmx.org` via `package.json`) for partial swaps: ticket list content, cascading UDN/Sector/Category/Issue selectors, attachment add/remove rows, and close-ticket confirmation modals. **django-components** (`core/components/`) encapsulates reusable UI pieces (buttons, nav links, status switches, tag switches). **Vite + Tailwind CSS 4** bundles `core/static/js/main.js` into `assets/` for modern CSS/JS assets served via `django-vite`. Nginx terminates TLS-facing traffic and serves `/static/` and `/media/` directly.
- **Out of scope:** Mobile-native apps; real-time WebSocket push; offline-first PWA; public unauthenticated ticket submission portal (login required for ticket operations).

## 3. Product / idea

The mental model is a **Django monolith** with three cooperating layers: (1) a **relational permission graph** tying Django `Group` membership to UDN and Sector visibility; (2) a **ticket conversation thread** where each `Message` carries status and optional `Attachment` files, and ticket status is derived from the latest message; (3) an **HTMX-enhanced template UI** that keeps interaction snappy while logic stays server-side.

A ticket is always anchored to four taxonomy foreign keys: `udn`, `sector`, `issue_category`, and `issue`. Creating a ticket walks the user through dependent dropdowns populated via HTMX endpoints. Listing tickets supports multi-select filters (UDN, Sector, Category, Status) with URL-persisted query params and pagination (6 per page). Status filtering uses a subquery on the **last message** per ticket to match current workflow state.

Administrators manage the taxonomy and inspect tickets through **Django admin** (`core/admin.py`) with inlines for messages and attachments, autocomplete fields, and image/PDF previews.

### 3.1 North-star use cases

1. **Operator files a ticket:** Authenticated user opens create flow, selects UDN → Sector → Category → Issue via HTMX partials, writes a description, attaches screenshots, submits; first `Message` is created with status `open`.
2. **Support agent triages queue:** Agent opens ticket list, filters by UDN and status `open`, sees only tickets for their assigned groups; clicks into detail view to reply and change status to `solved` or `feedback`.
3. **Admin bootstraps new site:** Operator clones `initialize-db.yaml`, edits UDN/Sector/Issue names for a new franchise, runs `docker-compose up`; `post_migrate` seeds taxonomy and permission groups automatically.
4. **Manager closes resolved ticket:** Agent or authorized user triggers close flow via HTMX confirmation modal (`htmx-confirm-close`) and `close_ticket` endpoint; final message status becomes `closed`.

### 3.2 Non-goals

- No REST/JSON API for external integrations — HTTP surface is HTML forms and HTMX fragments only.
- No email notifications, webhooks, or chat integrations evident in the tree.
- No automated test suite (`package.json` test script is a stub; no pytest in `requirements.txt`).
- No GitHub Actions or cloud deploy manifests — deployment is manual Docker Compose.
- Model/table names (`UDN`, `Sector`, etc.) are **not renameable** per `initialize-db.md`; customization is limited to option values inside those models.
- README references `.env.example` but that file is not present in the cloned tree (only `.env` is gitignored).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.11 (Dockerfile), Django 5.1.7 | `Dockerfile`, `requirements.txt` |
| Frontend | Django Templates, HTMX 1.9, Tailwind CSS 4, django-components | `package.json`, `core/templates/`, `core/components/` |
| Asset pipeline | Vite 6, django-vite 3.1 | `vite.config.mjs`, `project/settings.py` |
| Backend | Django 5.1 monolith (`core` app) | `project/settings.py`, `core/` |
| Data | PostgreSQL 16 | `docker-compose.yaml`, `requirements.txt` (`psycopg2-binary`) |
| Infra / deploy | Docker Compose (db, web, nginx), Gunicorn (3 workers, 2 threads) | `docker-compose.yaml`, `Dockerfile` |
| Logging | Loguru (file rotation, 60-day retention) | `core/logger.py`, `project/settings.py` |
| Seed / config | PyYAML loading of `initialize-db.yaml` on migrate | `core/apps.py`, `configs/initialize-db/` |
| Tests | None configured | `package.json` scripts, no test deps in `requirements.txt` |

### 4.1 Notable dependencies (curated)

- `Django==5.1.7` — core web framework, ORM, admin, auth.
- `django_components==0.131` — reusable template components with Python/HTML pairs under `core/components/`.
- `django-vite==3.1.0` — bridges Vite build output in `assets/` to Django static pipeline.
- `htmx.org` (devDependency) — partial page updates without a SPA framework.
- `gunicorn==23.0.0` — production WSGI server binding to port 8080 inside the web container.
- `psycopg2-binary==2.9.10` — PostgreSQL adapter.
- `loguru==0.7.3` — structured application logging alongside Django's logging config.
- `python-dotenv==1.0.1` — loads environment variables for settings at startup.
- `PyYAML==6.0.2` — parses database initialization YAML.

## 5. Repository map (abstraction)

- **Entrypoints:** `manage.py` (Django CLI); `project/wsgi.py` / `project/asgi.py` (WSGI/ASGI); `docker-compose.yaml` (orchestrated stack); `Dockerfile` (web image).
- **Domain / core:** `core/models.py` (UDN, Sector, IssueCategory, Issue, Ticket, Message, Attachment); `core/views.py` (page views: home, list, create, detail, close); `core/views_htmx.py` (HTMX fragment endpoints); `core/forms.py` (ticket creation, attachment validation); `core/apps.py` (post_migrate hooks: superuser, groups, YAML seed).
- **Adapters:** `project/settings.py` (env-driven Postgres, static/media, Vite, CSRF); `configs/nginx.conf` (reverse proxy, static/media aliases, 50 MB upload limit); `docker-compose.yaml` (service wiring).
- **Presentation:** `core/templates/` (base, ticket, registration layouts); `core/components/` (head, main, common component trees); `core/static/` (CSS, JS source); `assets/` (Vite build output).
- **Docs vaults:** `README.md` (Spanish, comprehensive feature/architecture doc); `configs/initialize-db/initialize-db.md` (seed file guide). No `docs/`, `.docs/`, ADR, or PRD directories present.
- **Agent scaffolding:** `.claude/` — **not present** in repository. No `AGENTS.md`, `.agents/`, or skill trees found.
- **Generated / vendor:** `staticfiles/` and `mediafiles/` are committed (sample attachments present); `node_modules/` is gitignored; `welpdesk.dump` appears to be a database dump artifact (not ingested for this summary).

## 6. Configuration & contracts (no secrets)

All runtime configuration is **environment-variable driven** via `python-dotenv` in `project/settings.py`. The `.env` file is gitignored; do not commit or quote real values.

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | Django secret key; also used as initial superuser password in `create_superuser` |
| `DEBUG` | Boolean string (`True`/`False`) toggling debug mode and django-vite dev mode |
| `ALLOWED_HOSTS` | Comma-separated hostnames |
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_HOST` | Database host (compose sets `db` for web service) |
| `POSTGRES_PORT` | Database port |
| `LANGUAGE_CODE` | Django locale (default example: Spanish Argentina) |
| `TIME_ZONE` | Django timezone (default example: Argentina/Buenos Aires) |
| `CSRF_TRUSTED_ORIGINS` | Optional comma-separated trusted origins for CSRF |

**Settings modules of note:** `INSTALLED_APPS` includes `core`, `django_components`, `django_vite`. `MEDIA_ROOT` is `/app/welpdesk/mediafiles`. `LOGIN_URL` is named route `login`. Proxy headers `SECURE_PROXY_SSL_HEADER` and `USE_X_FORWARDED_HOST` are enabled for Nginx termination.

**Attachment contract:** `AttachmentForm.clean_file` enforces max 50 MB per file (`core/forms.py`). Nginx `client_max_body_size` is also 50M (`configs/nginx.conf`).

### 6.1 HTTP / API endpoints (when applicable)

Primary surface is **server-rendered HTML** and **HTMX partials** — no DRF or OpenAPI. All ticket routes require authentication except home and auth pages.

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/` | Home page | none |
| `GET` | `/accounts/login/` | Login form | none |
| `POST` | `/accounts/login/` | Session login | none |
| `GET`/`POST` | `/accounts/logout/` | Logout | session |
| `GET` | `/logout_page/` | Post-logout page | none |
| `GET` | `/admin/` | Django admin | staff |
| `GET` | `/tickets/list/` | Ticket list (full page or HTMX partial via `HX-Request`) | login required |
| `GET` | `/tickets/view/<ticket_id>/` | Ticket detail | login required |
| `POST` | `/tickets/view/<ticket_id>/` | Add message/reply on ticket | login required |
| `GET` | `/tickets/view/<ticket_id>/item/` | Single ticket item partial | login required |
| `GET`/`POST` | `/tickets/create/` | Create new ticket | login required |
| `POST` | `/tickets/<ticket_id>/close/` | Close ticket | login required |
| `GET` | `/htmx/create/udn/` | HTMX UDN selector partial | login required |
| `GET` | `/htmx/create/sector/<udn>/` | HTMX Sector selector (filtered by UDN) | login required |
| `GET` | `/htmx/create/issue-category/<sector>/` | HTMX category selector | login required |
| `GET` | `/htmx/create/issue/<issue_category>/` | HTMX issue type selector | login required |
| `GET` | `/htmx/create/ticket-details/<issue>/` | HTMX ticket detail fields | login required |
| `GET` | `/htmx/list-content/` | HTMX paginated list fragment | login required |
| `POST` | `/htmx/add-attachment/` | HTMX add attachment row | login required |
| `POST` | `/htmx/remove-attachment/` | HTMX remove attachment row | login required |
| `GET` | `/htmx/confirm-close/<ticket_id>/` | HTMX close confirmation modal | login required |
| `GET` | `/static/*` | Static assets (Nginx in production) | none |
| `GET` | `/media/*` | Uploaded attachments (Nginx in production) | none |
| `GET` | `/development/` | Development template (DEBUG only in `project/urls.py`) | DEBUG gate |

### 6.2 Other interfaces

- **Django management CLI:** `python manage.py migrate`, `collectstatic`, `createsuperuser` — invoked in Docker web service startup command.
- **YAML seed contract:** Top-level keys `UDNs`, `Sectors`, `IssueCategories`, `Issues` in `configs/initialize-db/initialize-db.yaml`; loaded automatically on migrate via `post_migrate` signal.
- **No CLI tool, MCP server, or Telegram bot** interfaces present.

## 7. Data & persistence

- **Primary store:** PostgreSQL 16 in Docker (`postgres_data` volume). Django ORM with single migration `core/migrations/0001_initial.py`.
- **File storage:** `Attachment.file` stored under `mediafiles/attachments/` (local filesystem via `FileField`).
- **Key entities:** `UDN` (business unit), `Sector` (functional area, M2M to UDNs), `IssueCategory` (grouped problem types, M2M to Sectors), `Issue` (specific incident type, FK to category), `Ticket` (incident record linking all four), `Message` (thread entry with status enum: `open`, `solved`, `closed`, `feedback`), `Attachment` (file linked to message).
- **Auth data:** Standard Django `User` and `Group` models; custom permission wiring via M2M `permission_group` and `groups` fields on taxonomy models.
- **Topology:** Single-server on-premise deployment — web container (Gunicorn) + db container + nginx container on one Docker bridge network. No edge workers, replication, or object storage backend configured.

## 8. Docs & agent memory (required scan)

Sources scanned and folded into this summary:

1. **`README.md`** — Primary documentation (Spanish): features, architecture, data model, HTMX filtering, Docker deployment, installation steps, customization guidance. Evidence: `README.md`.
2. **`configs/initialize-db/initialize-db.md`** — Seed file format, customization limits, YAML structure, real-world fuel-station example context. Evidence: `configs/initialize-db/initialize-db.md`.
3. **`configs/initialize-db/initialize-db.yaml`** — Concrete seed data (UDNs, Sectors, Categories, Issues for DEBO/YPF/IT scenarios). Evidence: `configs/initialize-db/initialize-db.yaml`.
4. **`LICENSE`** — MIT License (copyright 2024). Evidence: `LICENSE`.

**Directories scanned but absent:**

- **`.claude/`** — not found in repository.
- **`.docs/`** — not found in repository.
- **`docs/`** — not found in repository.
- **ADR / PRD / constitution / harness files** — not found.
- **`.github/`** — no CI workflows present.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public GitHub repository under `kodexArg` org; application itself is designed for **private on-premise** deployment behind org network controls.
- **Auth model:** Django session authentication (`LoginRequiredMixin` / `@login_required` on ticket views). No OAuth, OIDC, or API token auth.
- **Authorization:** Group-based ticket visibility via custom `TicketManager`; staff users see all tickets. Default groups (`Operator`, `Auditor`, `Support`, `Administrative`) receive Django model permissions assigned in `core/apps.py`.
- **Bootstrap security concern:** `create_superuser` auto-creates username `admin` with password equal to `SECRET_KEY` env var on first migrate — operators must rotate credentials immediately in production.
- **CSRF:** Standard Django CSRF middleware enabled; `CSRF_TRUSTED_ORIGINS` configurable for reverse-proxy deployments.
- **Upload limits:** 50 MB per attachment enforced in form validation and Nginx.
- **This summary contains no secrets**, no `.env` contents, no database dump data, and no credential literals.

## 10. Operational picture

**Local / production run (Docker Compose):**

1. Configure `.env` with required variables (see §6; README shows example shape).
2. `docker-compose up -d` — starts Postgres (health-checked), web (migrate + collectstatic + Gunicorn on 8080), and Nginx on host port 80.
3. `docker-compose exec web python manage.py createsuperuser` — optional if auto `admin` user is insufficient.
4. Access application on host port 80 via Nginx reverse proxy.

**Frontend asset build (development):**

- `npm run dev` — Vite dev server on port 3000 (`package.json`).
- `npm run build` — produces hashed assets into `assets/` for django-vite.

**Logging:**

- Loguru writes daily rotated logs under `logs/` (both `project/settings.py` and `core/logger.py` configure handlers).

**CI/CD:** No automated pipeline found (no `.github/workflows/`). Deployment is operator-driven Docker Compose.

**Committed artifacts note:** Repository includes `staticfiles/`, `mediafiles/` (sample screenshots), and `welpdesk.dump` (database dump) — operators should treat dump files as sensitive and not expose them publicly in forks.

## 11. Open questions / unknowns

- **`.env.example`:** README instructs `cp .env.example .env` but no `.env.example` exists in the shallow clone — operators must infer variable names from `project/settings.py` and README examples.
- **Initialize-db idempotency:** `populate_db` uses `get_or_create` but re-running migrations may not update changed YAML values for existing rows — behavior on taxonomy edits unclear.
- **Production hardening:** No evidence of HTTPS termination config, rate limiting, or security headers beyond Django defaults.
- **Test coverage:** No automated tests; regression safety relies on manual QA.
- **Internationalization:** UI strings and README are Spanish-first; `LANGUAGE_CODE` is env-configurable but no i18n translation files observed.
- **Email / notifications:** No outbound mail configuration in settings — status changes are in-app only.
- **Agent instructions:** No `.claude/`, `.docs/`, or agent harness — future agent work would rely solely on README and this summary.
