---
id: "commce"
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring"
visibility: private
importance: normal
source_repo: "ComMCE"
org: "kodexArg"
default_branch: "master"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags: ["django", "python", "mysql", "slots", "casino", "raspberry-pi", "temperature", "chartjs", "django-tables2", "internal-ops", "mce", "legacy"]
problems_solved:
  - "MCE floor and back-office staff need a single authenticated web hub for internal announcements instead of ad-hoc channels when coordinating slot-floor changes, maintenance, and daily operations."
  - "Slot-machine fleet managers cannot easily browse machine configuration (position, sala, hold, devol, denomination) or aggregate win totals per sala from the legacy MySQL telemetry store without opening spreadsheets or direct DB tools."
  - "Facility operators lack a browser dashboard for Raspberry Pi temperature and humidity readings collected into a separate MySQL database, making environmental drift hard to spot before hardware or comfort issues escalate."
technologies:
  - "Django 2.2.6"
  - "Python 3.6"
  - "MySQL (mysqlclient 1.4.4)"
  - "django-tables2 2.1.1"
  - "django-chartjs 1.5.0"
  - "django-pandas 0.6.1"
  - "pandas 0.25.1"
  - "Bootstrap 3 (CDN)"
  - "Chart.js (static + CDN plugin)"
  - "Google Charts (beneficios page scaffold)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ComMCE

> **Problem thesis (required):** `ComMCE` (Comunicación MCE) is a private, Spanish-facing **internal operations portal** for an MCE slot-floor environment. It unifies three concerns in one Django monolith served over classic server-rendered HTML: **staff communications** (short internal posts), **slot-machine statistics** (read-only views over legacy MySQL tables `DDBB25` and `TDATOS`), and **environmental monitoring** (temperature/humidity time series from Raspberry Pi sensors in `tb_temperatura` on a second MySQL database). Authentication is Django session login; navigation links the three modules from shared Bootstrap nav bars. The codebase dates to 2019, targets Python 3.6 and Django 2.2, and includes a committed `venv/` tree — it is operational legacy software, not a modern deployable template.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/ComMCE` |
| Visibility | `private` |
| Default branch | `master` |
| One-line pitch | Django 2 internal portal: internal messaging, slot-machine fleet table, and RPi temperature charts over dual MySQL backends. |
| Audience | MCE floor supervisors, slot technicians, and back-office staff who need comms, machine stats, and environmental reads; maintainers reviving or replacing the legacy stack. |

## 2. Problems it solves

### P1 — Fragmented internal communications on the slot floor

- **Who hurts:** MCE supervisors and technicians coordinating daily changes (machine moves, maintenance windows, policy notes) across shifts.
- **Pain today:** Updates spread through informal channels with no persistent, searchable record tied to authenticated staff accounts.
- **How this repo answers:** The `Comunicaciones` app provides a minimal **blog-style post list** (`Post` model: title up to 35 chars, text body, author FK to `AUTH_USER_MODEL`, `create_date`). Authenticated users can create posts via `post_new`; all users can browse `post_list` and `post_detail`. Posts are registered in Django admin. Navigation is shared with the other modules via top-level nav buttons.
- **Out of scope:** Threaded discussions, attachments, push notifications, email digests, or role-based visibility per post.

### P2 — Slot machine configuration and win telemetry locked in legacy MySQL

- **Who hurts:** Fleet managers and analysts who need to see which machines sit in which sala, their hold/devol percentages, denominations, and aggregated wins without writing SQL.
- **Pain today:** Machine master data lives in `DDBB25` and time-series coin-in/coin-out/win metrics in `TDATOS` inside a MySQL database named `slots` (configured as Django `default` database). These tables pre-exist; Django models are `managed = False` mirrors.
- **How this repo answers:** `Estadisticas` exposes **Listado de Máquinas** — a paginated `django_tables2` table (`DdbbTable`) over `Ddbb25` showing id, position, sala, juego, fabricante, modelo, denomination, hold, devol, tipo with percentage formatting for hold/devol. **Beneficios** queries `Tdatos` for the last ~40 days, aggregates `Sum('field_win')` grouped by `field_sala`, serializes to JSON in the view — though the template currently renders a **hardcoded Google Charts demo** instead of the live JSON payload (integration incomplete).
- **Out of scope:** Real-time slot telemetry ingestion, EGM protocol integration, regulatory reporting export, or write paths to machine configuration.

### P3 — Environmental monitoring without a dedicated SCADA UI

- **Who hurts:** Operators monitoring server-room or floor-adjacent Raspberry Pi nodes that log temperature and humidity.
- **Pain today:** Sensor rows accumulate in `tb_temperatura` on a separate MySQL database (`db_temperatura`, routed via `Temperatura.dbrouters.MiRouter`). Raw SQL or spreadsheets are the fallback.
- **How this repo answers:** `Temperatura` reads `TbTemperatura` (columns: `RPi`, `Temperatura`, `Humedad`, `Fecha`) and builds pandas DataFrames via `django_pandas.read_frame`. **24hs** view aggregates average temperature per RPi per hour for the prior day; **semana** plots raw points over a ~2-day window. Templates render **Chart.js** line charts with per-RPi datasets and show the latest reading timestamp. Humidity is stored but not charted in current views.
- **Out of scope:** Alerting thresholds, SMS/email alarms, sensor provisioning, or ingestion code (assumed external to this repo).

## 3. Product / idea

`ComMCE` is a **small multi-app Django project** with one settings module (`ComMCE/settings.py`), root URLconf (`ComMCE/urls.py`), and three domain apps mounted at path prefixes. There is no REST API layer; every feature is HTML templates plus minimal view logic.

Mental model for users:

1. **Home** (`/`) — landing page showing login state; link to temperatura module (primary entry after auth).
2. **Comunicaciones** (`/comunicaciones/`) — internal message board.
3. **Estadisticas** (`/estadisticas/`) — machine inventory table and benefits chart scaffold.
4. **Temperatura** (`/temperatura/`) — environmental charts (default route = 24h view).
5. **Admin** (`/admin/`) — Django admin for `Post` and standard auth models.
6. **Accounts** (`/accounts/`) — stock Django auth URLs (login, logout).

Each module duplicates a similar Bootstrap 3 nav bar linking all three modules plus auth controls. Spanish UI strings (`es-es` language code). Time zone is UTC with `USE_TZ = False`.

Data topology: **two MySQL databases** on localhost (configurable host in settings). Default DB holds slot data and Django-managed tables (auth, sessions, `Comunicaciones_post`). Secondary `db_temp` holds temperature readings; only `TbTemperatura` reads route there via `DATABASE_ROUTERS`.

### 3.1 North-star use cases

1. **Shift handoff note:** Supervisor logs in, opens Comunicaciones, posts a short title/body announcement; next shift reads the list ordered by `create_date`.
2. **Machine floor walk:** Analyst opens Estadisticas → Listado de Máquinas, pages through `DDBB25` to verify positions, salas, hold/devol, and game titles.
3. **Sala profitability glance:** Operator opens Beneficios intending to see per-sala win totals for the last 40 days (view prepares data; chart UI not wired to live JSON yet).
4. **Environmental check:** Technician opens Temperatura → 24hs or Semana, inspects Chart.js lines per RPi label and checks `ultimo` timestamp for staleness.

### 3.2 Non-goals

- Not a public customer-facing product — private internal portal with `ALLOWED_HOSTS` limited to loopback in committed settings.
- No container/CI/deploy manifests in tree — deployment method undocumented.
- No `requirements.txt` or `pyproject.toml` — dependencies inferred from committed `venv/` (should not be vendored in production).
- Beneficios chart is scaffold-only; live aggregated JSON is not rendered.
- Temperature humidity field exists in model but is not visualized.
- No agent instruction trees (`.claude/`), hidden docs vault (`.docs/`), or root README present.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.6 | `venv/` interpreter paths, migration timestamps |
| Backend | Django 2.2.6 | `venv/lib/python3.6/site-packages/Django-2.2.6.dist-info`, `ComMCE/settings.py` header comment (2.1.7 origin) |
| DB driver | mysqlclient 1.4.4 | `venv/.../mysqlclient-1.4.4.dist-info` |
| Data | Dual MySQL databases | `ComMCE/settings.py` `DATABASES`, `Temperatura/dbrouters.py` |
| Tables UI | django-tables2 2.1.1 | `INSTALLED_APPS`, `Estadisticas/tables.py` |
| Charts (server) | django-chartjs 1.5.0 | `INSTALLED_APPS` |
| DataFrames | django-pandas 0.6.1, pandas 0.25.1 | `Temperatura/views.py` `read_frame` |
| Frontend | Bootstrap 3 CDN, per-app CSS | `templates/base.html`, `*/static/css/*.css` |
| Charts (client) | Chart.js static + CDN color plugin | `Temperatura/templates/Temperatura/*.html` |
| Charts (client alt) | Google Charts loader (beneficios) | `Estadisticas/templates/Estadisticas/Hojas/hoja2.html` |
| Auth | Django.contrib.auth sessions | `ComMCE/urls.py` `accounts/`, `LOGIN_REDIRECT_URL` |
| Tests | Django test modules (minimal) | `*/tests.py` files |

### 4.1 Notable dependencies (curated)

- `django-tables2` — paginated semantic table for `DDBB25` machine list with custom percentage columns.
- `django-pandas` — converts ORM querysets to DataFrames for Chart.js template iteration in Temperatura views.
- `mysqlclient` — MySQL backend for both `slots` and `db_temperatura` databases.
- `chartjs` / Chart.js — client-side line charts for temperature time series.
- `django-bootstrap4` — present in venv but not listed in `INSTALLED_APPS` (unused in current templates).

## 5. Repository map (abstraction)

- **Project config:** `ComMCE/settings.py`, `ComMCE/urls.py`, `ComMCE/wsgi.py` — settings, routing, WSGI entry.
- **CLI entry:** `manage.py` — standard Django management script.
- **Comunicaciones app:** `Comunicaciones/models.py` (`Post`), `views.py`, `urls.py`, `forms.py`, `admin.py`, templates under `Comunicaciones/templates/`, CSS in `Comunicaciones/static/css/`.
- **Estadisticas app:** `Estadisticas/models.py` (`Ddbb25`, `Tdatos` unmanaged), `tables.py`, `views.py`, `urls.py`, templates `Hojas/hoja1.html` (table), `hoja2.html` (chart scaffold).
- **Temperatura app:** `Temperatura/models.py` (`TbTemperatura`), `dbrouters.py` (`MiRouter`), `views.py` (query helpers `Qry24hs`, `QrySemana`), templates `24hs.html`, `semana.html`.
- **Shared templates:** `templates/home.html`, `templates/base.html`, `templates/registration/login.html`.
- **Migrations:** Per-app `migrations/` — `Comunicaciones` has evolution migrations; stats/temp models are unmanaged mirrors.
- **Vendor / generated:** `venv/` — full Python virtualenv committed to git (thousands of site-packages files; do not ingest for RAG). `__pycache__/` throughout.
- **Docs vaults:** none — no `docs/`, `.docs/`, ADRs, or README at repo root.
- **Agent scaffolding:** none — no `.claude/`, `.agents/`, or `SKILL.md` trees.

## 6. Configuration & contracts (no secrets)

Settings module `ComMCE/settings.py` defines:

| Setting | Purpose |
|---------|---------|
| `SECRET_KEY` | Django signing key — **hardcoded in repo (security risk; value not reproduced here)** |
| `DEBUG` | `True` in committed settings |
| `ALLOWED_HOSTS` | Loopback only in committed settings |
| `DATABASES['default']` | MySQL connection to `slots` database (user `computer`, host localhost, port 3306) |
| `DATABASES['db_temp']` | MySQL connection to `db_temperatura` for temperature reads |
| `DATABASE_ROUTERS` | `Temperatura.dbrouters.MiRouter` routes `TbTemperatura` reads to `db_temp` |
| `LANGUAGE_CODE` | `es-es` |
| `TIME_ZONE` | `UTC`; `USE_TZ = False` |
| `STATIC_URL` / `STATIC_ROOT` | `/static/` collected to project `static/` |
| `LOGIN_REDIRECT_URL` / `LOGOUT_REDIRECT_URL` | `/` |

**Credential hygiene note:** Database passwords and `SECRET_KEY` are embedded directly in `settings.py`. This summary intentionally omits all secret values. Operators should externalize credentials via environment variables before any redeployment.

No `.env` files, `wrangler.jsonc`, Docker compose, or CI secrets mapping found in tree.

### 6.1 HTTP / API endpoints

Server-rendered HTML only; no REST/JSON API except JSON serialization internal to `beneficios` view (not exposed as endpoint).

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home landing (`home.html`) | optional — shows username if logged in |
| `GET` | `/admin/` | Django admin | staff session |
| `GET` | `/accounts/login/` | Login form | none |
| `POST` | `/accounts/login/` | Session login | none |
| `GET` | `/accounts/logout/` | Logout | session |
| `GET` | `/comunicaciones/` | Post list | none observed in views |
| `GET` | `/comunicaciones/post/<pk>/` | Post detail | none observed |
| `GET`/`POST` | `/comunicaciones/post/new/` | Create post | implied login for `request.user` assignment |
| `GET` | `/estadisticas/` | Stats base page (`pki` view) | none observed |
| `GET` | `/estadisticas/listado_de_maquinas/` | Machine table (`Ddbb25`) | none observed |
| `GET` | `/estadisticas/beneficios/` | Benefits chart page | none observed |
| `GET` | `/temperatura/` | 24h temperature chart (default) | none observed |
| `GET` | `/temperatura/24hs` | 24h temperature chart | none observed |
| `GET` | `/temperatura/semana` | Week-range temperature chart | none observed |

Static files served at `/static/` when collected.

### 6.2 Other interfaces

- **Django management CLI:** `manage.py` — migrations, `runserver`, `collectstatic`, user creation.
- **Django admin:** `Comunicaciones.admin` registers `Post`.
- No MCP tools, Telegram bots, systemd units, or background workers in tree.

## 7. Data & persistence

**Stores:**

1. **MySQL `slots` (default)** — legacy slot operations data plus Django app tables.
   - `DDBB25` — machine master/configuration (Spanish column names: position, sala, isla, hold, devol, fabricante, modelo, juego, denomination, etc.).
   - `TDATOS` — telemetry rows with `_DATE`, `_SLOT`, `_MODEL`, `_DENOM`, `_IN`, `_OUT`, `_WIN`, `_DROP`, `_GAMES`, `_BILL`, `_JP`, `_HP`, `_DEVOL`, `_SALA`.
   - `Comunicaciones_post` — Django-managed posts (via migrations).
   - Standard Django auth/session tables.

2. **MySQL `db_temperatura` (secondary)** — environmental readings.
   - `tb_temperatura` — `RPi` identifier, `Temperatura`, `Humedad`, `Fecha`.

**Topology:** Single Django process on an app server connects to local MySQL (or LAN host per settings). Raspberry Pi nodes write temperature rows via external ingestion not present in this repo. Slot telemetry ingestion into `TDATOS` is likewise external. The portal is **read-mostly** for stats and temperature; only Comunicaciones posts are written through Django.

**Entities by name:** `Post`, `Ddbb25`, `Tdatos`, `TbTemperatura`, plus Django `User` for authors.

## 8. Docs & agent memory (required scan)

Scans performed; sources found and used:

1. **Root README** — not present in repository.
2. **`docs/**` and `.docs/**`** — not present.
3. **ADRs / PRDs / constitution** — not present.
4. **`.claude/**` and agent skill trees** — not present.

Evidence bullets from code used instead:

- `ComMCE/settings.py` — app registry, databases, i18n, static, auth redirects.
- `ComMCE/urls.py` — top-level route map.
- `Comunicaciones/models.py`, `views.py`, `urls.py` — comms domain.
- `Estadisticas/models.py`, `tables.py`, `views.py`, `urls.py` — slot stats domain.
- `Temperatura/models.py`, `dbrouters.py`, `views.py`, `urls.py` — temperature domain.
- `templates/home.html` — landing behavior.
- `Estadisticas/templates/Estadisticas/Hojas/hoja2.html` — hardcoded chart scaffold vs live data.
- `Temperatura/templates/Temperatura/24hs.html`, `semana.html` — Chart.js integration.
- Migration files under each app — schema evolution timestamps (2019).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repo; summary describes internal MCE operations tooling without clone URLs as product links.
- **Auth model:** Django session cookies via `django.contrib.auth`; no OIDC or API tokens. View-level login enforcement is inconsistent — many module views do not decorate with `login_required`, so pages may be reachable without auth despite UI login prompts.
- **Secrets in tree:** `SECRET_KEY`, MySQL username/password pairs are hardcoded in `settings.py`. This summary contains **no** secret values, tokens, or connection strings with passwords.
- **Debug mode:** `DEBUG = True` in committed settings — unsuitable for production exposure.
- **Host restriction:** `ALLOWED_HOSTS` lists loopback only in committed settings.
- **Vendored venv:** Committed virtualenv increases leak surface and repo size; should be removed from version control.

## 10. Operational picture

**Local dev (reconstructed):**

1. Activate Python 3.6 environment with Django 2.2.6 + mysqlclient + django-tables2 + django-pandas + chartjs dependencies (committed `venv/` exists but should be recreated cleanly).
2. Ensure MySQL serves `slots` and `db_temperatura` with expected tables populated.
3. `python manage.py migrate` for Django-managed tables (Comunicaciones, auth).
4. `python manage.py runserver` — binds default development server (typically port 8000).
5. Optional: `python manage.py collectstatic` for static assets.

**Deployment:** No GitHub Actions, Dockerfile, or platform manifest in tree. Historical deployment likely manual on an internal Windows/Linux host near the MySQL server (settings comment hints at a former LAN DB host, now localhost).

**Hardware context:** Temperature module assumes multiple Raspberry Pi nodes identified by string labels in `RPi` column. Slot stats assume EGM telemetry already landed in MySQL.

## 11. Open questions / unknowns

- Exact organizational meaning of **MCE** (Mendoza Casino Entretenimiento or similar) — inferred from slot-machine schema and Spanish UI, not documented in repo.
- Production deployment host, reverse proxy, and whether `DEBUG` was ever disabled in production.
- Whether Beneficios chart was ever wired to `jsdata` from `beneficios` view or abandoned mid-implementation.
- `post_new` view assigns `post.published_date` though `published_date` was removed from `Post` model in migration `0003` — likely runtime error on create unless model diverged from migrations.
- Login button in nav templates links to `logout` URL when unauthenticated (label says "Iniciar Sesión") — probable UX bug.
- Source of RPi temperature ingestion scripts and slot `TDATOS` ETL — external to this repository.
- Why full `venv/` is committed and whether `test` empty file at repo root has significance.
- No `requirements.txt` — exact reproducible dependency set depends on venv dist-info versions only.
