---
id: "fsk-showers"
title: "FSK Showers — Flask CRUD for roadside shower registrations"
visibility: private
importance: normal
source_repo: "fsk-showers"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags: ["flask", "python", "mysql", "sqlalchemy", "crud", "bootstrap", "docker-compose", "internal-ops", "showers", "uspallata", "highway-services"]
problems_solved:
  - "Operators at a Uspallata-area fuel/highway facility need a simple way to log shower usage without spreadsheets or paper slips."
  - "Staff need a shared, queryable record of who used showers, which client was served, and which pricing plan applied — tied to responsible users and roles."
technologies:
  - "Python 3 (Flask 2.2)"
  - "Flask-SQLAlchemy + Alembic / Flask-Migrate"
  - "Flask-WTF / WTForms"
  - "MySQL 8 via PyMySQL"
  - "Flask-Bootstrap (UI scaffolding)"
  - "Docker Compose (local MySQL)"
  - "djlint (HTML template linting)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# FSK Showers

> **Problem thesis (required):** This repository is a small internal web application for registering and managing **shower usage** at a roadside fuel/highway service location in the Uspallata corridor (referenced in page metadata as KM1107 / KM1151). It replaces ad-hoc paper or spreadsheet tracking with a browser-based CRUD interface so on-site staff can create, list, and delete shower-use tickets while persisting records in MySQL.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/fsk-showers` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Flask + MySQL CRUD app for logging shower registrations at a highway fuel station, with Spanish operator UI. |
| Audience | On-site operators and internal staff at the Uspallata-area facility; not a public consumer product. |

## 2. Problems it solves

### P1 — Manual shower-use tracking at a remote facility

- **Who hurts:** Highway fuel-station operators and attendants who must record when customers use paid shower facilities.
- **Pain today:** Paper logs or informal notes are hard to search, easy to lose, and do not tie cleanly to staff accountability or pricing plans.
- **How this repo answers:** Provides a minimal Flask web UI (`/create`, `/list`, `/delete`) backed by a relational schema (`User`, `Role`, `Client`, `Plan`, `Ticket`) so each shower session can be recorded and later listed or removed from a central database.
- **Out of scope:** Payment processing, customer self-service portals, multi-site fleet management, reporting dashboards, or mobile-native apps.

### P2 — Lightweight internal ops tooling without enterprise overhead

- **Who hurts:** Small teams that need a database-backed registry but do not want a full ERP or POS integration for a single amenity (showers).
- **Pain today:** Generic tools are either too heavy or too unstructured; bespoke spreadsheets lack referential integrity across clients, plans, and staff.
- **How this repo answers:** Uses Flask, SQLAlchemy, and Docker Compose for MySQL to deliver a locally runnable CRUD stack with Bootstrap-styled forms and Spanish labels (`Responsable`, `Cliente`, `Plan`, `Guardar`).
- **Out of scope:** Authentication/authorization UI, audit trails, automated backups, production hardening, and CI/CD pipelines (none present in tree).

## 3. Product / idea

The mental model is a **single-tenant operator console**: an attendant opens the site, creates a ticket linking a responsible staff member, a client, and a plan/price tier, then reviews or deletes entries from a table view. The domain schema anticipates normalized entities — users belong to roles, clients have name fields, plans carry prices, and tickets join those foreign keys — even though parts of the view layer still use simplified string fields from an earlier iteration.

The UI is Spanish-first (navbar: `Lista`, `Nuevo`; flash messages in Spanish). Page metadata in `app/templates/base.html` explicitly describes the app as a CRUD for shower use in Uspallata, anchoring the business context.

### 3.1 North-star use cases

1. **Register shower use** — Operator navigates to Create, fills `Responsable`, `Cliente`, and optional `Plan`, submits; record is persisted and user is redirected to the list with a success flash.
2. **Review today's registrations** — Operator opens List to see ticket ID, client, responsible party, and timestamp columns (intended; see open questions for model/template drift).
3. **Correct mistakes** — Operator deletes a row via the delete link on the list page.

### 3.2 Non-goals

- No README beyond the repo title; no ADRs, PRDs, or constitution files.
- No `.claude/`, `.docs/`, or `docs/` vault — agent/hidden documentation trees were absent at scan time.
- No GitHub Actions or other deploy automation in tree.
- `migrations/` is listed in `.gitignore` — schema migration history is intentionally excluded from version control.
- `update.html` exists but no corresponding `update_view` route is wired in `app/views.py`.

## 4. Technology stack

Derived from `requirements.txt`, `docker-compose.yml`, `app/config.py`, and application imports. Lockfile versions used only for major-signal deps; full pin list not reproduced.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (implicit; no `.python-version` in tree) | `requirements.txt`, `run.py` |
| Web framework | Flask 2.2.2 | `requirements.txt`, `app/__init__.py` |
| ORM / migrations | SQLAlchemy 1.4, Flask-SQLAlchemy, Alembic / Flask-Migrate | `requirements.txt`, `app/db.py`, `app/__init__.py` |
| Forms / CSRF | Flask-WTF 1.0, WTForms 3.0 | `requirements.txt`, `app/forms.py` |
| Database driver | PyMySQL 1.0 | `requirements.txt`, `app/config.py` URI scheme |
| Database server | MySQL 8.0 (containerized) | `docker-compose.yml` |
| Frontend | Jinja2 templates, Bootstrap 3 via Flask-Bootstrap, custom CSS | `app/templates/`, `app/static/css/base.css` |
| Dev tooling | djlint, cssbeautifier, html-tag-names | `requirements.txt` |
| Infra / deploy | Docker Compose for local MySQL only | `docker-compose.yml` |
| AI / agents | None observed | — |
| Tests | None observed | — |

### 4.1 Notable dependencies (curated)

- `Flask` — core HTTP app and blueprint routing.
- `Flask-SQLAlchemy` — declarative models and session management for `User`, `Role`, `Client`, `Plan`, `Ticket`.
- `Flask-Migrate` / `alembic` — database migration support (migration directory gitignored).
- `Flask-WTF` — CSRF-protected `TicketForm`.
- `PyMySQL` — MySQL dialect for `SQLALCHEMY_DATABASE_URI`.
- `djlint` — HTML/Jinja template linting in dev workflows.
- `flask_bootstrap` — imported in `app/__init__.py` for Bootstrap asset helpers and `wtf.quick_form`; **not listed in `requirements.txt`** (likely install gap).

## 5. Repository map (abstraction)

- **Entrypoints:** `run.py` imports `app` and calls `app.run()` for the dev server; `app/__init__.py` defines `create_app()` and registers the `crud` blueprint.
- **Domain / core:** `app/models.py` — relational entities (`User`, `Role`, `Client`, `Plan`, `Ticket`); `app/forms.py` — `TicketForm` with string fields for author, client, plan.
- **HTTP / views:** `app/views.py` — blueprint routes for index, list, create, delete; 404/500 handlers.
- **Persistence config:** `app/config.py` — `DevelopmentConfig` (active), plus `ProductionConfig`, `StagingConfig`, `TestingConfig` stubs; `app/db.py` — SQLAlchemy extension singleton.
- **Presentation:** `app/templates/` — Jinja layouts (`base.html`, `index.html`, `list.html`, `create.html`, `update.html`, error pages, `partials/_navbar.html`); `app/static/` — `favicon.ico`, `fuel.png`, `css/base.css`.
- **Local data layer:** `docker-compose.yml` provisions MySQL; host volume `./db` (gitignored) for persistence; `mariadb/` also gitignored.
- **Docs vaults:** None — no `docs/`, `.docs/`, or ADR directories.
- **Agent scaffolding:** None — no `.claude/` or `.agents/` trees.
- **Generated / vendor:** `migrations/` exists on disk but is gitignored; `db/`, `venv/`, `__pycache__/` ignored per standard Python `.gitignore`.

## 6. Configuration & contracts (no secrets)

Environment variables read by `app/config.py` (names and purpose only):

| Variable | Purpose |
|----------|---------|
| `FLASK_RUN_HOST` | MySQL host segment for connection URI (defaults to localhost) |
| `FLASK_DB_USER` | MySQL username |
| `FLASK_DB_PASSWORD` | MySQL password |
| `FLASK_NAME` | MySQL database name (default logical name: dbticket) |
| `FLASK_APP_SECRET_KEY` | Flask session/CSRF secret |

`docker-compose.yml` sets equivalent MySQL bootstrap variables for the container (`MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`) — values are development placeholders and must not be copied into documentation bodies.

`DevelopmentConfig` enables `DEBUG`, disables `SQLALCHEMY_TRACK_MODIFICATIONS`, and builds a `mysql+pymysql://` URI from the above. A hardcoded fallback secret exists in source when `FLASK_APP_SECRET_KEY` is unset — treat as dev-only; never deploy as-is.

### 6.1 HTTP / API endpoints (when applicable)

Server-rendered HTML routes only; no JSON API or OpenAPI spec.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Landing/index with links to list and create | none |
| `GET` | `/list` | Table of all `Ticket` rows | none |
| `GET` | `/create` | Render create form | none |
| `POST` | `/create` | Validate form, insert ticket, redirect to list | CSRF token via Flask-WTF |
| `GET` | `/delete/<int:id>` | Delete ticket by primary key, redirect to list | none |

No `update_view` route despite `update.html` referencing `crud.update_view`. No health-check or metrics endpoints.

### 6.2 Other interfaces

- **CLI:** `python run.py` starts the Flask development server (implicit `app.run()`).
- **Database CLI:** Flask-Migrate / Alembic expected for schema changes (migration folder gitignored).
- **Docker:** `docker-compose up` for local MySQL 8 on port 3306.
- No MCP tools, Telegram bots, systemd units, or background workers.

## 7. Data & persistence

**Store:** MySQL 8.0, accessed through SQLAlchemy with the PyMySQL driver. Local development uses Docker Compose with a bind-mounted data directory (`./db`, gitignored).

**Entities (from `app/models.py`):**

| Model | Key fields | Relationships |
|-------|------------|---------------|
| `Role` | `id`, `name` | has many `User` |
| `User` | `id`, `username`, `role_id` | belongs to `Role`; has many `Ticket` |
| `Client` | `id`, `firstname`, `lastname`, `nationality` | has many `Ticket` |
| `Plan` | `id`, `name`, `price` | has many `Ticket` |
| `Ticket` | `id`, `user_id`, `client_id`, `plan_id` | FKs to `User`, `Client`, `Plan` |

**Topology:** Single-process Flask app on operator LAN or localhost talks to a co-located or Docker-hosted MySQL instance. No edge workers, KV, object storage, or vector indexes. Offline-first behavior is not implemented.

**Known schema/view drift:** `create_view` constructs `Ticket(author=..., client=..., plan_price=...)` which does not match the ORM constructor (`user_id`, `client_id`, `plan_id`). `list.html` renders `tk.client`, `tk.author`, `tk.timestamp` — attributes absent from the current `Ticket` model. This suggests an incomplete refactor from a flat ticket model to normalized FKs.

## 8. Docs & agent memory (required scan)

Sources scanned and evidence paths:

1. **Root README** — `README.md` contains only the title `# fsk-showers`; no setup, deploy, or domain narrative.
2. **`docs/**` and `.docs/**`** — not present in repository tree.
3. **ADR / PRD / constitution** — none found.
4. **`.claude/**` and agent skill trees** — not present (confirmed via directory listing).

**Embedded product context (template metadata):**

- `app/templates/base.html` meta description: CRUD to register showers use in Uspallata.
- Meta keywords reference highway kilometer markers KM1107 and KM1151.
- Navbar and form labels are Spanish, indicating operator locale.

**License:** `LICENSE` — MIT, Copyright 2022 Kodex Arg.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository; summary describes purpose without clone or deploy URLs.
- **Auth model:** No login, session user, or role-based route guards implemented. Any visitor who can reach the Flask process can list, create, and delete tickets. CSRF protection is enabled on forms via Flask-WTF (`CSRF_ENABLED = True`).
- **Secrets hygiene:** This summary contains no live credentials. Source includes dev-default DB passwords and a fallback `SECRET_KEY` in `app/config.py` and `docker-compose.yml` — rotate and externalize before any non-local use.
- **Delete via GET:** `/delete/<id>` uses GET without confirmation token beyond the link — unsafe pattern for production.

## 10. Operational picture

**Local development (inferred):**

1. Start MySQL: `docker-compose up` (or equivalent) using `docker-compose.yml`.
2. Set env vars for DB host/user/password/database and `FLASK_APP_SECRET_KEY` as needed.
3. Run app: `python run.py` from repo root.
4. Apply migrations via Flask-Migrate if schema setup is required (migration sources gitignored).

**Deployment:** No CI workflows, Dockerfile for the app, or cloud/IaC manifests in tree. Production/staging config classes exist in `app/config.py` but no wiring or deploy docs accompany them.

**Hardware constraints:** None specified; designed for a single workstation or small server plus MySQL container. Static asset `fuel.png` suggests branding tied to a fuel-station context but imposes no special hardware needs.

## 11. Open questions / unknowns

- What **FSK** abbreviates in the org context (fuel-station brand, internal project code, or facility name) — not documented beyond repo name and Uspallata/KM metadata.
- Whether the app was ever deployed to production or remains a prototype — no deploy artifacts or ops runbooks.
- **Model/view inconsistency** — ORM expects FK IDs but views/forms use free-text `author`, `client`, `plan_price`; list template expects denormalized attributes. App may not run end-to-end without fixes.
- **`flask-bootstrap` missing from `requirements.txt`** — fresh `pip install -r requirements.txt` likely fails on `from flask_bootstrap import Bootstrap`.
- **`update.html` orphaned** — no `update_view` route registered.
- **Typos in models** — `User.__repr__` references `self.usernmae`; `Ticket.__init__` assigns `self.client__iid` instead of `client_id`.
- **`migrations/` gitignored** — canonical schema history unavailable in repo; Alembic folder exists on clone but is excluded from version control per `.gitignore`.
- No test suite, lint config beyond djlint in requirements, or `.python-version` pin observed.
