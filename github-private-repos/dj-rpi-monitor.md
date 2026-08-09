---
id: "dj-rpi-monitor"
title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity"
visibility: private
importance: low
source_repo: "dj-rpi-monitor"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags:
  - "django"
  - "drf"
  - "sqlite"
  - "iot"
  - "raspberry-pi"
  - "htmx"
  - "plotly"
  - "temperature"
  - "humidity"
  - "kcbd"
  - "monolith"
  - "prototype"
problems_solved:
  - "Edge Raspberry Pi nodes measuring temperature and humidity need a minimal central receiver and live dashboard — without standing up TimescaleDB, Docker, or a full cultivation analytics stack."
  - "Operators want a quick glance at the last few minutes of sensor readings (table + charts) refreshed automatically in the browser, without building a separate SPA or polling API clients by hand."
technologies:
  - "Django (unpinned in requirements.txt)"
  - "Django REST Framework"
  - "django-htmx"
  - "Plotly Express / Plotly.io"
  - "SQLite (default; overridable via env)"
  - "python-dotenv"
  - "loguru"
  - "pytz"
  - "pandas (declared; limited use in tree)"
  - "Skeleton CSS + normalize.css (static)"
  - "HTMX 1.x (vendored minified)"
  - "Plotly 2.35.2 (vendored minified)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# dj-rpi-monitor

> **Problem thesis (required):** dj-rpi-monitor is a **minimal Django monolith** that solves a narrow IoT monitoring need: Raspberry Pi devices POST temperature and humidity readings to a small REST endpoint; data lands in a single `SensorData` table; operators view the **last ten minutes** of readings as a live-updating HTML table (HTMX polling every two seconds) and as server-rendered Plotly line charts on a development dashboard branded for KCBD. It deliberately trades the full sensor suite, TimescaleDB, Docker, and auth hardening of sibling repos for the smallest possible deployable footprint — suitable as a prototype or private lab monitor, not as a production cultivation platform.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/dj-rpi-monitor` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Private Django + DRF + HTMX + Plotly prototype that ingests Raspberry Pi temperature/humidity POSTs and shows a live ten-minute dashboard. |
| Audience | Internal KCBD lab operators prototyping sensor visibility; Raspberry Pi edge scripts posting JSON payloads; developers iterating on the monitoring stack before migrating to `dj-indoor-monitor` or `kcbd-monitor`. |

## 2. Problems it solves

### P1 — Minimal central ingest for Raspberry Pi temp/humidity

- **Who hurts:** Someone standing up a Raspberry Pi with a DHT-style sensor who needs a place to POST readings without provisioning PostgreSQL, TimescaleDB, Docker, or a multi-metric schema.
- **Pain today:** Each device logs locally, or scripts write to ad-hoc files; there is no shared API contract, no timestamped history queryable from a browser, and no single identifier (`rpi`) to distinguish multiple Pis on the same network.
- **How this repo answers:** A single DRF `SensorDataAPIView` accepts `POST` with `timestamp`, `rpi`, `t` (temperature °C), and `h` (humidity %). Valid rows persist via `SensorDataSerializer` into the `SensorData` model. `GET` on the same endpoint returns recent rows, optionally filtered by time window (`seconds` path segment) and by `rpi` query parameter. Logging uses loguru at DEBUG on successful ingest.
- **Out of scope:** Soil moisture, light, CO₂, VPD derivation, room/sensor registry, authenticated ingestion, rate limiting, or multi-tenant isolation.

### P2 — Live browser dashboard without a frontend framework

- **Who hurts:** An operator who wants to watch recent environmental readings update in near real time without writing JavaScript polling logic or deploying a separate Angular/Astro frontend.
- **Pain today:** Raw API responses require curl or Postman; charting requires exporting CSV or building one-off notebooks; static HTML goes stale immediately.
- **How this repo answers:** The `/development/` page includes HTMX partials: `latest-data-table` refreshes table body rows every two seconds via `hx-trigger="load, every 2s"`; `latest-data-chart` renders Plotly Express line charts for temperature and humidity over the same ten-minute window (`LATEST_DATA_MINUTES = 10` constant in `core/views.py`). Skeleton CSS provides layout; vendored HTMX and Plotly avoid CDN dependency at runtime (though base layout still references Google Fonts).
- **Out of scope:** Historical range selectors, downsampling for long timeframes, room grouping, mobile-optimized UX, or production-ready home page (root `/` is an explicit "under development" placeholder linking to `/development/`).

## 3. Product / idea

The mental model is a **tight loop**: (1) edge Raspberry Pi scripts `POST` JSON to `/api/sensor-data/`; (2) Django persists flat rows in SQLite (or an env-configured SQL backend); (3) a single development dashboard page composes server-rendered Plotly HTML plus an HTMX-driven table that polls partial endpoints.

There is **no separation** between API and presentation — both live in the `core` Django app. Charts are generated server-side with Plotly Express (`px.line`) and embedded via `|safe` in templates. The data model is intentionally flat: one table, four payload fields plus auto timestamp, no foreign keys to rooms or sensor catalogs.

The project branding (`KCBD - MONITOR`) and Spanish locale (`LANGUAGE_CODE = 'es-ar'`, `TIME_ZONE = 'America/Argentina/Buenos_Aires'`) align it with the broader KCBD indoor cultivation monitoring lineage documented in sibling repos `dj-indoor-monitor` (public production monolith) and `kcbd-monitor` (private headless refactor). This repo appears to be an **earlier, slimmer experiment** — created mid-November 2024, last touched days later, with no README, CI, or container story.

### 3.1 North-star use cases

1. **Edge ingest:** A Raspberry Pi POSTs `{"rpi": "pi-vege-01", "t": 24.3, "h": 62.1}` (timestamp optional; defaults to `timezone.now()`). Server responds `201` with `{"message": "Data received"}`.
2. **Operator glance:** User opens `/development/` and sees Plotly temperature/humidity lines plus a table of readings from the last ten minutes, auto-refreshing every two seconds.
3. **Programmatic read:** A script calls `GET /api/sensor-data/300/` to fetch rows from the last 300 seconds, or filters by `rpi` when the view supports it via kwargs.
4. **Local dev iteration:** Developer runs `manage.py runserver` with `.env` supplying `SECRET_KEY`, optional `DEBUG`, and database overrides — no compose file required.

### 3.2 Non-goals

- Production home page (root route shows "Página en desarrollo" stub).
- Django admin integration (`core/admin.py` registers nothing).
- Automated tests (`core/tests.py` is empty placeholder).
- Migrations committed to version control (`migrations/` is listed in `.gitignore`).
- Edge collector scripts in-repo (`scripts/` is gitignored; contents not available in tree).
- Authentication or authorization on API endpoints.
- Cloud or container deployment manifests.
- Documentation vaults, ADRs, or agent skill trees.

## 4. Technology stack

Derived from `requirements.txt`, `project/settings.py`, and static asset paths. Dependency versions are **unpinned** in requirements (no lockfile in tree).

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (implicit; no `.python-version` in tree) | `manage.py`, `requirements.txt` |
| Web framework | Django | `project/settings.py`, `INSTALLED_APPS` |
| API | Django REST Framework | `rest_framework` in `INSTALLED_APPS`, `core/views.py` `APIView` |
| Realtime UI | django-htmx + vendored HTMX | `django_htmx` middleware, `core/static/js/htmx.min.js`, partial templates |
| Charts | Plotly Express + vendored Plotly JS | `core/views.py` `px.line`, `core/static/js/plotly-2.35.2.min.js` |
| Data | SQLite default; env-overridable RDBMS | `project/settings.py` `DATABASES` block |
| Config | python-dotenv | `load_dotenv(BASE_DIR / '.env')` in settings |
| Logging | loguru + Django LOGGING dict | `project/settings.py` |
| Styling | Skeleton CSS, normalize, custom `styles.css` | `core/static/css/` |
| Tests | Django TestCase scaffold only | `core/tests.py` (empty) |
| Infra / deploy | None evident | no `docker-compose`, no `.github/workflows`, no `Dockerfile` |

### 4.1 Notable dependencies (curated)

- `django` + `djangorestframework` — core web stack and JSON ingest/query API.
- `django-htmx` — detects HTMX requests in `latest_data_table` to return row fragments vs full table wrapper.
- `plotly` — server-side chart generation with Plotly Express line charts.
- `python-dotenv` — loads `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, and database env vars from `.env` (file gitignored; not read during summary).
- `loguru` — structured stderr logging for ingest success/failure in `SensorDataAPIView`.
- `pytz` — comment in requirements notes intent to convert API timestamps from UTC to GMT-3 (Argentina).
- `pandas` — listed in requirements with comment "iba a pasar…" (planned migration); no active pandas usage found in committed `core/` views.
- `pyperclip` — explicitly marked non-production (for a `describe-project.py` script in gitignored `scripts/`).

## 5. Repository map (abstraction)

- **Entrypoints:** `manage.py` (Django CLI); `project/wsgi.py` / `project/asgi.py` (ASGI/WSGI); `project/urls.py` mounts admin and `core.urls`.
- **Domain / core:** `core/models.py` (`SensorData`); `core/serializers.py` (`SensorDataSerializer`); `core/views.py` (API + HTMX partial views + template class views).
- **Routing:** `core/urls.py` — home, development dashboard, API, and partial paths.
- **Presentation:** `core/templates/` — `layouts/base.html`, `home.html` (stub), `development.html` (dashboard), `partials/` for HTMX fragments and chart/table includes.
- **Static assets:** `core/static/css/` (normalize, skeleton, styles), `core/static/js/` (htmx, plotly minified), `core/static/images/` (directory present).
- **Project config:** `project/settings.py` (apps, middleware, DB, i18n, logging).
- **Docs vaults:** **none** — no `README`, `docs/`, `.docs/`, or ADR files in tree.
- **Agent scaffolding:** **none** — `.claude/` not present; no `AGENTS.md` or skill trees.
- **Generated / vendor / ignored:** `migrations/` gitignored; `scripts/` gitignored; `db.sqlite3` gitignored; standard Django `__pycache__`, `.env`, `venv/` ignored per `.gitignore`.

## 6. Configuration & contracts (no secrets)

Environment variables loaded from `.env` at project root (gitignored — shapes only):

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | Django secret; **required** — startup raises `ValueError` if missing |
| `DEBUG` | Boolean string (`true`/`1` → debug mode); defaults false |
| `LOG` | loguru stderr level; defaults `INFO` |
| `ALLOWED_HOSTS` | Comma-separated hostnames |
| `DB_ENGINE` | Database backend; default `django.db.backends.sqlite3` |
| `DB_NAME` | Database file/name; default `db.sqlite3` |
| `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` | Optional RDBMS connection fields |

Django settings highlights: `APPEND_SLASH = True`; `LANGUAGE_CODE = 'es-ar'`; `TIME_ZONE = 'America/Argentina/Buenos_Aires'`; `USE_TZ = True`; static served at `static/` URL prefix.

### 6.1 HTTP / API endpoints

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home page — "under development" placeholder | none |
| `GET` | `/development/` | Live dashboard (charts + HTMX table) | none |
| `GET` | `/partials/latest-data-table/` | HTMX table wrapper or row fragment (last 10 min) | none |
| `GET` | `/partials/latest-data-chart/` | Plotly temperature + humidity chart HTML | none |
| `GET` | `/api/sensor-data/` | List recent sensor rows (default window: 10 min) | none |
| `GET` | `/api/sensor-data/<seconds>/` | List rows within last `<seconds>` seconds | none |
| `POST` | `/api/sensor-data/` | Ingest one `SensorData` row (`timestamp`, `rpi`, `t`, `h`) | none |
| `POST` | `/api/sensor-data/<seconds>/` | Same ingest endpoint (seconds path segment present but POST ignores window) | none |
| `*` | `/admin/` | Django admin (no models registered) | Django session (staff) |

**POST body shape (JSON):** `{ "timestamp": "<ISO datetime optional>", "rpi": "<string>", "t": <float>, "h": <float> }`.

**GET response shape:** array of serialized objects with same fields.

No health-check, OpenAPI, or CSRF-exempt documentation for machine clients. DRF `APIView` uses default CSRF behavior for session auth; programmatic POSTs from edge devices may require CSRF handling or `@csrf_exempt` — not configured in committed code (potential integration gap).

### 6.2 Other interfaces

- **CLI:** Standard Django management via `manage.py` (`runserver`, `migrate`, etc.). Migrations directory is gitignored, so schema bootstrap may rely on local `makemigrations` not reflected in repo.
- **Edge collector:** Not in committed tree (`scripts/` gitignored). Expected contract is HTTP POST to `/api/sensor-data/` per commit messages ("Sensor data api view receiven POST and GET okay").
- **No** MCP tools, Telegram bots, systemd units, or WebSocket surfaces.

## 7. Data & persistence

- **Store:** SQLite file `db.sqlite3` by default (`project/settings.py`), overridable to any Django-supported backend via env vars.
- **Entity:** `SensorData` — fields `timestamp` (DateTimeField, default now), `rpi` (CharField max 255), `t` (FloatField temperature), `h` (FloatField humidity). String representation: `"{rpi} at {timestamp}"`.
- **Retention / query window:** Application logic consistently filters to the last `LATEST_DATA_MINUTES` (10) for dashboard views; API GET accepts custom `seconds` via URL kwarg.
- **Topology:** Single-process Django app suitable for LAN Raspberry Pi → small server on same network. No edge caching, no read replicas, no time-series extension (TimescaleDB hypertables absent). Offline-first edge storage not implemented.

## 8. Docs & agent memory (required scan)

Scans performed per assignment rules:

1. **Root `README*`:** **not present** in repository root.
2. **`docs/**`:** **not present**.
3. **`.docs/**`:** **not present** (directory does not exist).
4. **ADR / PRD / constitution:** **not present**.
5. **`.claude/**`:** **not present** (directory does not exist).

Evidence sources actually used:

- `requirements.txt` — dependency list and inline comments (Spanish) about non-production packages and timezone intent.
- `project/settings.py` — apps, middleware, env contract, locale, database configuration shape.
- `core/models.py` — `SensorData` schema.
- `core/views.py` — API behavior, HTMX partials, chart generation, ten-minute window constant.
- `core/urls.py` — route map.
- `core/serializers.py` — API field contract.
- `core/templates/` — UX state (home stub vs development dashboard), HTMX polling interval, KCBD branding.
- `.gitignore` — confirms ignored paths (`migrations/`, `scripts/`, `.env`, `db.sqlite3`).
- GitHub metadata via `gh repo view` — private visibility, Python primary language, created 2024-11-15, last push 2024-11-18.
- Commit messages (via GitHub API) — development progression: partials refactor, chart readiness, API POST/GET checkpoint.

Cross-repo context (from kdx-rag sibling summaries, not from this tree): `dj-indoor-monitor` is the public production monolith with TimescaleDB and Docker; `kcbd-monitor` is the private headless refactor. This repo fits earlier in that lineage as a minimal private spike.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` — no public clone or portfolio linkage; summary contains no credentials or live connection strings.
- **Auth model:** **none** on sensor API or dashboard routes. Anyone who can reach the host can POST sensor data and read recent readings. Django admin exists but registers no models.
- **Secrets handling:** `SECRET_KEY` required from environment; `.env` gitignored. This summary does not reproduce any env file contents.
- **CSRF:** Enabled via middleware; edge POST clients may need explicit exemption or token strategy — not documented in tree.
- **ALLOWED_HOSTS:** Must be set via env (empty default split yields `[""]` if unset — deployment misconfiguration risk).

## 10. Operational picture

- **Local dev:** Create `.env` with `SECRET_KEY` (and typically `DEBUG=true`, `ALLOWED_HOSTS=localhost,127.0.0.1`). Install deps from `requirements.txt` into a virtualenv. Run `python manage.py migrate` locally (migrations not in repo). Start with `python manage.py runserver`.
- **Deploy:** No CI/CD, Docker, or infrastructure-as-code in committed tree. Implied manual deploy on a host reachable by Raspberry Pi devices on LAN.
- **Hardware constraints:** Target edge devices are Raspberry Pi nodes posting temperature/humidity; server footprint is intentionally small (SQLite, single Django process). No GPU or high-memory requirements.

## 11. Open questions / unknowns

- Exact contents of gitignored `scripts/` (including referenced `describe-project.py` and possible edge collector).
- Whether production ever ran this repo vs `dj-indoor-monitor`; no deploy docs in tree.
- Why `migrations/` is gitignored — schema may only exist on developer machines.
- Whether `GET` filtering by `raspberry_pi_id` kwargs is wired (view reads `kwargs.get('raspberry_pi_id')` but URL patterns do not define that segment — filter may be dead code).
- Pandas migration mentioned in requirements — scope and status unknown.
- Pinning of Django/DRF versions; unpinned requirements may drift.
- CSRF strategy for unattended Raspberry Pi POST clients.
- Humidity chart partial template only renders `temperature_chart` in committed `latest-data-chart.html` — humidity chart context computed in view but possibly omitted from template (UI gap).
