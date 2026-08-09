---
id: "dj-indoor-monitor"
title: "dj-indoor-monitor — Django IoT dashboard for indoor crop sensor monitoring"
visibility: public
importance: normal
source_repo: "dj-indoor-monitor"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags:
  - "django"
  - "drf"
  - "postgresql"
  - "timescaledb"
  - "docker"
  - "iot"
  - "raspberry-pi"
  - "indoor-crop"
  - "sensors"
  - "htmx"
  - "plotly"
  - "pandas"
  - "nginx"
  - "gunicorn"
  - "on-premise"
  - "agriculture"
problems_solved:
  - "Indoor growers and operators need a centralized place to ingest high-frequency sensor readings (temperature, humidity, soil moisture, light) from distributed Raspberry Pi devices and query them over time — without building ad-hoc spreadsheets or one-off scripts per grow room."
  - "Time-series IoT workloads need write-optimized ingestion (many small POSTs from edge devices) alongside read-optimized historical queries and charting — a tension that naive relational schemas and synchronous dashboards fail to balance."
  - "On-premise LAN deployments behind firewalls need a containerized stack that sensors can reach on a stable host port, with optional CI/CD via self-hosted runners — without exposing SSH or manual wrangler-style deploy steps."
technologies:
  - "Django 5.1"
  - "Django REST Framework 3.15"
  - "PostgreSQL 14 + TimescaleDB 2.11"
  - "Pandas / NumPy"
  - "Plotly 5"
  - "HTMX (django-htmx)"
  - "Gunicorn + Nginx"
  - "Docker Compose"
  - "Redis (compose service; LocMemCache in settings)"
  - "pytest / pytest-django"
  - "Raspberry Pi sensor service (Python + YAML config)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# dj-indoor-monitor

> **Problem thesis (required):** This repository is a **Django monolith** that solves indoor-crop environmental monitoring at the intersection of edge IoT and time-series analytics. Raspberry Pi devices (and similar edge nodes) POST raw sensor readings to a REST API; data lands in TimescaleDB-backed PostgreSQL with write-optimized schema choices; operators query latest values, time-bucketed aggregates, and interactive charts (temperature, humidity, soil moisture, light, VPD) through a server-rendered dashboard powered by HTMX and Plotly. The system prioritizes **fast ingestion** and **read-time aggregation** (Pandas resampling) over pre-computed rollups. As of the README, the **web dashboard is temporarily in maintenance** while the **REST API remains operational** for collection and external queries.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/dj-indoor-monitor` |
| Visibility | `public` |
| Default branch | `main` (integration); production CD targets branch `on-premise` |
| One-line pitch | Django + DRF REST API and HTMX/Plotly dashboard for indoor-crop IoT sensor monitoring (Raspberry Pi → TimescaleDB), containerized with Docker and deployed on-premise. |
| Audience | Indoor growers / facility operators monitoring grow rooms; edge-device maintainers configuring Raspberry Pi sensor services; backend developers extending DRF endpoints or chart views; AI agents guided by `AGENTS.md` and `.claude/skills/django-expert/`. |

## 2. Problems it solves

### P1 — Centralized ingestion and query for distributed indoor sensors

- **Who hurts:** Operators running multiple grow rooms with Raspberry Pi nodes reading DHT22 (temp/humidity), MCP3008 ADC (soil moisture, light), and similar hardware — each producing readings every few seconds with no shared store or API contract.
- **Pain today:** Data siloed on individual devices, manual exports, or fragile scripts posting to inconsistent endpoints; no unified way to ask "what is the latest reading per sensor?" or "what was the hourly average last week?"
- **How this repo answers:** Exposes a DRF `DataPointViewSet` at `/api/data-point/` for CRUD ingestion (`POST` from edge services) plus custom actions `/latest/` (last reading per sensor) and `/timeframed/` (Pandas-based temporal aggregation with configurable buckets like `30T`, `4H`, `1D`). Ships `scripts/rpi_services/rpi-sensor-service.py` and `rpi-sensor-config.yaml` as a reference edge collector that POSTs metric tuples (`t`, `h`, `s`, `l`) to one or more API URLs.
- **Out of scope:** Device firmware OTA, greenhouse automation/actuator control, multi-tenant SaaS billing, cloud-managed IoT platforms (AWS IoT Core, etc.).

### P2 — Write-optimized time-series storage with read-time analytics

- **Who hurts:** Developers who model `DataPoint` with foreign keys to `Sensor` and hit referential-integrity and lock contention under high-frequency writes from dozens of edge nodes.
- **Pain today:** ORM-heavy ingestion paths slow POST throughput; pre-aggregating every interval at write time multiplies storage and pipeline complexity; chart UIs either load too many raw points or require a separate analytics warehouse.
- **How this repo answers:** `DataPoint.sensor` is a **string field**, not an FK to `Sensor`, deliberately decoupling ingestion from room/sensor registry (`AGENTS.md`, `docs/database_model.md`). Composite indexes on `(sensor, timestamp)`, `(sensor, metric, timestamp)`, and related combinations optimize range scans. Read paths use **Pandas resampling** in `core/api.py` (`TimeframedData`) and chart views (`core/charts.py`, `GenerateSensorView` with downsampling to ~120 points via `calculate_optimal_frequency`). Philosophy: **ingest raw, aggregate on read**.
- **Out of scope:** Real-time streaming (Kafka, WebSockets push to browsers); long-term cold archival to object storage; ML-based anomaly detection.

### P3 — On-premise Docker deployment with sensor-compatible networking

- **Who hurts:** Teams deploying on a private LAN (e.g. static host on `192.168.x.x`) where sensors were already configured to POST to port 8000, and where inbound SSH from the public internet is undesirable for CI/CD.
- **Pain today:** Cloud-first deploy guides do not match LAN topology; opening SSH for GitHub Actions is a security risk; nginx/Django port mapping mismatches break existing sensor configs.
- **How this repo answers:** `docker-compose.yml` runs `webapp` (Gunicorn), `db` (TimescaleDB), `nginx`, and `redis`. Nginx maps host ports `80` and `8000` → container port 80, so sensors targeting `:8000/api/data-point/` keep working (`DEPLOY.md`). GitHub Actions workflow `.github/workflows/deploy.yml` uses a **self-hosted runner** on push to `on-premise`, running `docker-compose up -d --build` without exposing inbound ports (`CICD_SETUP.md`).
- **Out of scope:** Cloudflare Workers deploy (this repo is on-prem Docker, not edge Workers); managed Kubernetes; automatic TLS/Let's Encrypt (docs assume optional HTTP on LAN).

## 3. Product / idea

The mental model is a **three-tier loop**: (1) **edge collectors** on Raspberry Pi read hardware on intervals defined in YAML and POST JSON payloads to the API; (2) **Django + TimescaleDB** persist atomic `DataPoint` rows and serve both REST queries and HTML fragments; (3) **browser dashboard** loads skeleton pages via SSR, then HTMX lazy-loads Plotly chart HTML per sensor/metric.

Physical structure is modeled as **Room → Sensor** (relational), while telemetry is stored as denormalized **DataPoint** rows keyed by sensor name string. At read time, optional `include_room=true` joins sensor names to rooms via in-memory maps (`_get_sensor_room_map` in `core/api.py`).

Derived metrics include **VPD (Vapor Pressure Deficit)** computed from temperature and humidity in dedicated views (`VPDView`, documented in `staticfiles/VPD.md` and `docs/frontend.md`).

### 3.1 North-star use cases

1. **Edge ingest:** A Raspberry Pi with DHT22 on GPIO 4 posts `{"sensor": "vege-oeste", "metric": "t", "value": 24.5}` every 10 seconds; the API validates and inserts without requiring a pre-existing `Sensor` row.
2. **Operator dashboard:** User opens `/charts/sensors/`, selects a timeframe (`1h`, `4h`, `1d`), and HTMX triggers parallel `POST /generate_sensor/` requests that return Plotly chart fragments per sensor/metric, grouped by room.
3. **External analytics:** A script or agent calls `GET /api/data-point/timeframed/?timeframe=1H&sensors=vege-oeste,vege-este&aggregations=true` to retrieve hourly min/max/mean/first/last without loading the web UI.
4. **Admin configuration:** Staff use Django admin (`/admin/`) to register rooms, sensors, and site key-value settings (`SiteConfigurations`).

### 3.2 Non-goals

- Dashboard is explicitly **under maintenance** per root `README.md` — visualization may be suspended while API ingest continues.
- Redis is provisioned in compose but `project/settings.py` uses `LocMemCache`; switching to Redis is documented as a manual settings change (`docs/production.md`).
- No authentication on public DRF endpoints is evident in settings — API appears open within the trusted LAN (throttle config referenced in README env example but not enforced in inspected `REST_FRAMEWORK` block).
- Not a generic IoT platform: metric codes are single-character (`t`, `h`, `s`, `l`) and hardware support in the RPI service is limited to DHT11/DHT22, MCP3008, and fake simulators.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.12 (Dockerfile), Django 5.1.3 | `Dockerfile`, `requirements.txt` |
| Frontend | Django Templates, HTMX, Skeleton CSS, Plotly.js | `core/templates/`, `core/static/`, `docs/frontend.md` |
| Backend / API | Django 5.1 + DRF 3.15, django-filter, django-cors-headers | `core/api.py`, `project/settings.py` |
| Data | PostgreSQL 14 + TimescaleDB 2.11 (`timescale/timescaledb` image) | `docker-compose.yml`, `core/models.py` |
| Infra / deploy | Docker Compose, Nginx reverse proxy, Gunicorn (3 workers), GitHub Actions self-hosted CD | `docker-compose.yml`, `nginx/nginx.conf`, `.github/workflows/deploy.yml` |
| Edge / IoT | Python asyncio sensor service, YAML config, adafruit_dht / gpiozero on ARM | `scripts/rpi_services/` |
| AI / agents | `.claude/skills/django-expert/` (SKILL + reference docs); `AGENTS.md` as SSOT for agents | `.claude/`, `AGENTS.md` |
| Tests | pytest, pytest-django, pytest-cov, coverage | `requirements.txt`, `core/tests.py` |

### 4.1 Notable dependencies (curated)

- `pandas` / `numpy` — time-series resampling, aggregation, and chart data preparation (`core/api.py`, `core/utils.py`, `core/charts.py`).
- `plotly` + `kaleido` — interactive chart generation server-side, injected into templates.
- `django-htmx` — partial-page updates for chart lazy loading without a SPA framework.
- `psycopg2` — PostgreSQL adapter for Django ORM and TimescaleDB.
- `loguru` — structured application logging with rotation (`project/settings.py`, RPI service).
- `gunicorn` — production WSGI server (`scripts/entrypoint.sh`).
- `python-dotenv` — loads `.env` at startup (`project/settings.py`).

## 5. Repository map (abstraction)

- **Entrypoints:** `manage.py` (Django CLI); `project/wsgi.py` / `project/asgi.py` (WSGI/ASGI); `scripts/entrypoint.sh` (container boot: wait for DB, migrate, collectstatic, gunicorn).
- **Domain / core:** `core/` — single Django app holding models (`Room`, `Sensor`, `DataPoint`, `SiteConfigurations`), DRF API (`api.py`), HTML views (`views.py`), chart builders (`charts.py`), filters (`filters.py`), serializers (`serializers.py`), and templates under `core/templates/`.
- **Project config:** `project/` — `settings.py`, root `urls.py` (admin + include `core.urls`).
- **Adapters:** `nginx/nginx.conf` (static + proxy to Gunicorn); `scripts/rpi_services/rpi-sensor-service.py` (hardware → HTTP POST); `docker-compose.yml` (service orchestration).
- **Docs vaults:** `docs/` — architecture, database model, backend, frontend, development, production, requirements, and `docs/section/chart_sensors.md` (functional analysis of SensorsView). **No `.docs/` directory present** in this clone.
- **Agent scaffolding:** `.claude/skills/django-expert/` — Claude skill with references for models, DRF, views, security, testing, performance, production deployment; `AGENTS.md` — Spanish-language master guide for AI agents (domain rules, API patterns, key file map).
- **Ops docs:** `DEPLOY.md` (on-premise install), `CICD_SETUP.md` (self-hosted runner), `CICD_SETUP.md` + `.github/workflows/deploy.yml`.
- **Generated / vendor:** `staticfiles/` — collected static assets including vendored `htmx`, `plotly`, `luxon`, CSS; do not treat as source of truth for logic.

## 6. Configuration & contracts (no secrets)

Environment variables (from `.env.example` and `docs/development.md` — **names and purpose only**):

| Variable | Purpose |
|----------|---------|
| `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_LOCAL` | PostgreSQL connection; `DB_LOCAL` used when running `runserver` outside Docker |
| `DJANGO_SECRET_KEY` | Django signing key |
| `DJANGO_DEBUG` | Debug mode flag |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hostnames/IPs |
| `DJANGO_DEFAULT_LANGUAGE_CODE` | Locale (default `es-ar`) |
| `DJANGO_TIMEZONE` | Time zone (e.g. Argentina) |
| `DOMAIN` | Host used for CSRF/CORS trusted origins |
| `IGNORE_SENSORS` | Comma-separated sensor names excluded from charts |
| `DJANGO_LOG_LEVEL`, `DJANGO_LOGURU_LEVEL` | Logging verbosity |
| `BEHIND_SSL_PROXY`, `CSRF_COOKIE_SECURE`, `SESSION_COOKIE_SECURE` | TLS/proxy cookie behavior |
| `DRF_DEFAULT_THROTTLE_RATES`, `DRF_DEFAULT_PAGE_SIZE` | Referenced in README; page size 1000 set in `REST_FRAMEWORK` |

`project/settings.py` sections: `INSTALLED_APPS` (django-htmx, DRF, corsheaders, plotly), `CACHES` (LocMem), `DATABASES`, `REST_FRAMEWORK` (django-filter backends, page size 1000), CSRF/CORS origins derived from `DOMAIN`.

RPI edge service reads `DJANGO_API_URL` (optional) and `scripts/rpi_services/rpi-sensor-config.yaml` for hardware definitions.

### 6.1 HTTP / API endpoints

#### REST API (DRF — primary external contract)

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/data-point/` | List/filter DataPoints (paginated, default page size 1000) | none observed |
| `POST` | `/api/data-point/` | Ingest single DataPoint (`sensor`, `metric`, `value`) | none observed |
| `GET` | `/api/data-point/{id}/` | Retrieve one DataPoint | none observed |
| `PUT`/`PATCH` | `/api/data-point/{id}/` | Update DataPoint | none observed |
| `DELETE` | `/api/data-point/{id}/` | Delete DataPoint | none observed |
| `GET` | `/api/data-point/latest/` | Latest reading per sensor; query: `start_date`, `end_date`, `sensors`, `metadata`, `include_room` | none observed |
| `GET` | `/api/data-point/timeframed/` | Time-bucketed aggregates; query: `timeframe` (required, e.g. `30T`, `4H`), `start_date`, `end_date`, `sensors`, `metrics`, `aggregations`, `metadata`, `include_room` | none observed |

Common query filters (via `DataPointFilter`): date ranges, sensor lists, metric range filters (`metric__t__gte`, etc.).

Valid timeframe tokens mapped in `core/utils.py` (`TIMEFRAME_MAP`): include `5S`, `1T`, `5T`, `15T`, `30T`, `1H`, `2H`, `4H`, `12H`, `1D` (per README and code).

Metric single-character codes: `t` temperature, `h` humidity, `s` soil moisture, `l` light (per `AGENTS.md`, RPI config).

#### Web UI (Django views — dashboard; maintenance mode per README)

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home | session (Django auth available) |
| `GET` | `/development/` | Development page | unknown |
| `GET` | `/charts/` | Charts index | unknown |
| `GET` | `/charts/interactive/` | Interactive historical charts | unknown |
| `GET` | `/charts/sensors/` | Sensor dashboard (lazy HTMX charts) | unknown |
| `GET` | `/charts/vpd/` | VPD visualization | unknown |
| `GET` | `/charts/gauges/` | Gauge panel | unknown |
| `POST` | `/generate_gauge/` | HTMX fragment: gauge chart HTML | unknown |
| `POST` | `/generate_sensor/` | HTMX fragment: sensor time-series chart HTML | unknown |
| `GET` | `/admin/` | Django admin | staff session |

Custom 404 returns JSON `{"error": "Not found"}` (`project/urls.py`).

### 6.2 Other interfaces

- **RPI sensor service CLI:** `python scripts/rpi_services/rpi-sensor-service.py` — reads YAML config, polls hardware on intervals, POSTs to configured `api_urls`.
- **Django management:** `python manage.py runserver`, `migrate`, `collectstatic`, `createsuperuser`.
- **Shell utilities:** `scripts/get-db.sh` (DB helper), `scripts/unused_code.py` (maintenance script).
- **No MCP tools, Telegram bots, or systemd units** found in tree.

## 7. Data & persistence

**Stores:** PostgreSQL with TimescaleDB extension (time-series optimized image in compose). Redis container exists for future caching but is not wired in Django settings.

**Entities (from `core/models.py` and `docs/database_model.md`):**

| Model | Role |
|-------|------|
| `Room` | Logical grow space (`name`) |
| `Sensor` | Named device linked to `Room` via FK |
| `DataPoint` | Atomic reading: `timestamp`, `sensor` (string), `metric` (1 char), `value` (float) |
| `SiteConfigurations` | Key-value site settings (`get_all_parameters()` class method) |

**Topology:** Edge Raspberry Pi devices on the LAN POST to the on-premise host (nginx → Gunicorn → Django → TimescaleDB). No edge database; all persistence is central. Static files served by Nginx from shared `staticfiles` volume.

**Migrations:** `core/migrations/0001_initial.py`, `0002_datapoint_core_datapo_sensor_f186fa_idx_and_more.py` (index additions).

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **Root `README.md`** — system overview, API documentation (extensive endpoint reference), install steps, maintenance notice for web UI.
2. **`AGENTS.md`** — agent SSOT: domain model, write-decoupling rationale, API/UI architecture, Pandas-on-read pattern, key file pointers.
3. **`docs/architecture.md`** — layered architecture diagram (client HTMX/Plotly, Django/Gunicorn, TimescaleDB), data flow for ingest/query/interactivity.
4. **`docs/database_model.md`** — ER conceptual diagram, index strategy, DataPoint decoupling note.
5. **`docs/backend.md`** — DRF ViewSet, Processor pattern (`ListData`, `LatestData`, `TimeframedData`), HTMX partial views.
6. **`docs/frontend.md`** — template hierarchy, static asset layout, HTMX interaction flow.
7. **`docs/development.md`** — local Docker and non-Docker setup, env var inventory.
8. **`docs/production.md`** — production architecture, nginx/gunicorn roles, Redis optional note.
9. **`docs/requirements.md`** — dependency categorization by function.
10. **`docs/section/chart_sensors.md`** — SensorsView functional analysis, lazy-load pattern, performance bottlenecks, proposed room filter.
11. **`DEPLOY.md`** — on-premise deployment on private LAN host, port 8000 sensor compatibility.
12. **`CICD_SETUP.md`** — self-hosted GitHub Actions runner setup for `on-premise` branch.
13. **`.claude/skills/django-expert/SKILL.md`** — Claude skill for Django/DRF work; references bundled docs for models, views, DRF, security, testing, performance, production deployment.
14. **`.claude/skills/django-expert/references/`** — eight reference markdown files (models-and-orm, views-and-urls, drf-guidelines, security-checklist, testing-strategies, performance-optimization, production-deployment, examples).

### `.docs/` scan

**Not present** in repository tree. All project documentation lives under `docs/` and root markdown files.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public GitHub repo; summary contains no clone URLs, live credentials, or connection strings with passwords.
- **Auth model:** Django session auth for admin and likely staff UI; DRF endpoints inspected do not declare permission classes — treat API as **trusted-LAN open ingest** unless additional middleware or deployment-layer auth exists outside repo.
- **Secrets handling:** `.env` is gitignored; `.env.example` provides placeholder values only. This summary does not reproduce any secret values from example files (IPs in examples are structural hints only).
- **CSRF/CORS:** Configured via `DOMAIN` env; supports HTTP on LAN when secure cookie flags are false.
- **Database:** Compose sets `POSTGRES_HOST_AUTH_METHOD: trust` for the db service — acceptable only on isolated Docker networks, not internet-exposed hosts.

## 10. Operational picture

### Local development

```bash
docker compose up --build
docker compose exec webapp python manage.py migrate
docker compose exec webapp python manage.py createsuperuser
```

Alternative: `python manage.py runserver` with local Postgres (`DB_LOCAL`).

### Production / on-premise

- Deploy per `DEPLOY.md`: copy `.env.example` → `.env`, `docker compose up -d --build`.
- Container entrypoint waits for Postgres, runs migrations and `collectstatic`, starts Gunicorn on `0.0.0.0:8000` with 3 workers, 120s timeout.
- **CI/CD:** Push to `on-premise` branch triggers `.github/workflows/deploy.yml` on self-hosted runner: checkout, hard reset to branch, `docker-compose up -d --build`, `docker system prune -f`.
- **Hardware:** Raspberry Pi 4 class devices with DHT22, MCP3008 ADC; `arm: true` in YAML enables real GPIO libraries.

### Current operational status

Per `README.md`: **web dashboard in maintenance** (visualization suspended); **REST API operational** for data collection and queries.

## 11. Open questions / unknowns

- Whether API authentication (API keys, token auth) is enforced in deployment but not committed — README mentions `API_KEY` for RPI service env example, but DRF settings show no default authentication classes.
- Whether TimescaleDB hypertable/continuous-aggregate features are used beyond running the Timescale image — migrations appear standard Django without explicit hypertable DDL in inspected files.
- Redis service purpose in compose vs `LocMemCache` — migration path documented but not implemented in settings.
- Exact production host identity beyond private LAN examples in `DEPLOY.md` / `nginx/nginx.conf` (`kcbd.grupoalvs.com` server_name) — relationship to kodexArg org unclear from tree alone.
- Test coverage depth — `core/tests.py` exists; extent of pytest suite not fully inventoried.
- Whether `on-premise` branch diverges significantly from `main` — workflow targets `on-premise`; this summary cloned `main` only.
