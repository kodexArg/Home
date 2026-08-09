---
id: "rpi-temp"
title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL"
visibility: private
importance: normal
source_repo: "rpi-temp"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags: ["raspberry-pi", "flask", "temperature", "humidity", "mysql", "docker", "nginx", "uwsgi", "chartjs", "iot", "monitoring"]
problems_solved:
  - "Operators need a lightweight web dashboard to visualize recent temperature and humidity readings collected by Raspberry Pi edge sensors without building a full analytics platform."
  - "Sensor data lives in a remote MySQL database while the display layer must run in a small, reproducible container stack suitable for home-lab or edge hardware."
  - "Raw sensor streams include occasional bad humidity spikes that would distort charts unless filtered before presentation."
technologies:
  - "Python 3.8"
  - "Flask 1.1.2"
  - "Flask-MySQL / PyMySQL"
  - "pandas"
  - "uWSGI"
  - "nginx"
  - "Docker / Docker Compose"
  - "MySQL (external RDS)"
  - "Chart.js 2.x"
  - "Bootstrap 4"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# rpi-temp

> **Problem thesis (required):** This repository provides a minimal, containerized web application that reads the latest temperature and humidity samples from a MySQL table populated by Raspberry Pi sensors, filters obvious bad readings, and renders an interactive line chart in the browser. It exists to give operators a quick visual health check of environmental conditions—originally in a cannabis grow monitoring context (container names and UI branding reference "Weed Pi")—without standing up a heavier observability stack.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/rpi-temp` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Dockerized Flask + nginx stack that charts the last 100 temperature/humidity rows from MySQL for Raspberry Pi sensor feeds. |
| Audience | Home-lab operators, grow-room monitors, and anyone maintaining edge Pi sensors that write into a shared MySQL `tb_temperatura` table. |

## 2. Problems it solves

### P1 — Edge sensor data needs a simple live chart

- **Who hurts:** Operators running Raspberry Pi nodes that log environmental readings into a central database but lack a turnkey visualization layer.
- **Pain today:** Raw rows in MySQL are not actionable at a glance; exporting to spreadsheets or wiring Grafana is heavier than needed for a single-room monitor.
- **How this repo answers:** A Flask app exposes `GET /get`, which pulls the 100 most recent rows from `tb_temperatura`, drops humidity values above 110 (treated as sensor error), serializes to JSON, and a Chart.js front page plots temperature and humidity over time.
- **Out of scope:** Alerting, multi-tenant auth, long-term analytics, sensor ingestion (assumed to happen elsewhere into MySQL).

### P2 — Reproducible small-footprint deployment

- **Who hurts:** Someone who wants the API + chart on a Pi or small VM without manual Python virtualenv juggling.
- **Pain today:** Mixing dev Flask, production WSGI, and reverse-proxy config by hand is error-prone on constrained hardware.
- **How this repo answers:** `docker-compose.yml` defines two services—`flask` (Python 3.8 image, uWSGI via `app.ini`) and `nginx` (reverse proxy to uWSGI socket on port 8080)—with volume-mounted source for iterative dev.
- **Out of scope:** Kubernetes, Terraform, CI/CD pipelines, secrets management (credentials are currently inlined in source—see §9).

### P3 — Noisy humidity readings distort trends

- **Who hurts:** Anyone reading live humidity who would misinterpret spikes caused by sensor glitches.
- **Pain today:** Unfiltered time series show impossible values (e.g., humidity > 110%) that break chart scaling.
- **How this repo answers:** `views.py` filters out rows where `Humedad > 110` before JSON serialization.
- **Out of scope:** Broader data-quality pipelines, calibration, or per-device thresholds.

## 3. Product / idea

The mental model is a **read-mostly dashboard** sitting in front of an existing MySQL fact table. Raspberry Pi devices (implied by column name `RPi` and project naming) write temperature (`Temperatura`), humidity (`Humedad`), and timestamp (`Fecha`) rows into `tb_temperatura`. This app never ingests sensors directly—it only queries and presents.

User flow:

1. Browser hits `/` → Jinja template `chart.html` loads Bootstrap, jQuery, Moment.js, and Chart.js from public CDNs.
2. Client-side JavaScript synchronously fetches `GET /get` (same origin, appended to current page URL).
3. JSON columns (`RPi`, `Temperatura`, `Humedad`, `Fecha`) are mapped into a dual-series line chart with time axis and y-axis suggested range 10–45 (°C-oriented scale).

Production path: **nginx** terminates HTTP/HTTPS on ports 80/443 and `uwsgi_pass`es to the `weedapi-flask` container on port 8080. The Flask Dockerfile CMD runs `uwsgi app.ini` (4 processes, 2 threads, socket `:8080`). A separate `run.py` exists for ad-hoc dev server on `0.0.0.0` (not used in the Docker CMD).

### 3.1 North-star use cases

1. Operator opens the chart page on a phone or desktop to verify current grow-room or equipment-closet conditions.
2. Developer bind-mounts `./flask` into the container, sets `FLASK_DEBUG=true`, and iterates on views or templates.
3. nginx fronts multiple future uWSGI apps (only one route today) on a home network or small VPS.

### 3.2 Non-goals

- No README documentation (root `README.md` is empty).
- No authentication or API keys on routes.
- No write/update/delete API for sensor data.
- No automated tests, linting, or GitHub Actions workflows in tree.
- No agent harness (`.claude/`, `.docs/`) present.

## 4. Technology stack

Derived from manifests and top-level source only; `flask/env38/` virtualenv is gitignored and not summarized.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.8 | `flask/Dockerfile`, `flask/requirements.txt` |
| Web framework | Flask 1.1.2 | `flask/requirements.txt`, `flask/app/__init__.py` |
| WSGI server | uWSGI 2.0.19 | `flask/requirements.txt`, `flask/app.ini`, `flask/Dockerfile` CMD |
| Reverse proxy | nginx (official image) | `nginx/Dockerfile`, `nginx/nginx.conf` |
| Data access | Flask-MySQL 1.5.1, PyMySQL 0.10.1 | `flask/requirements.txt`, `flask/app/db.py` |
| Data shaping | pandas 1.1.3, numpy 1.19.2 | `flask/requirements.txt`, `flask/app/views.py` |
| Database | MySQL (`db_temperatura`, table `tb_temperatura`) | `flask/app/db.py`, SQL in `flask/app/views.py` |
| Frontend | Jinja2 templates, Chart.js 2.9.3, jQuery 3.5.1, Bootstrap 4.5.2 | `flask/app/templates/` |
| Container orchestration | Docker Compose v3 | `docker-compose.yml` |
| Infra / deploy | Local Docker only; DB host points to external managed MySQL | `flask/app/db.py`, `docker-compose.yml` |
| AI / agents | None | — |
| Tests | None evident | — |

### 4.1 Notable dependencies (curated)

- `Flask-MySQL` — thin integration layer binding Flask config keys to MySQL connections used by `views.py`.
- `pandas` + `pandas.io.sql` — reads SQL result sets into DataFrames for row filtering and `to_json()` output.
- `uWSGI` — production app server behind nginx; configured via `flask/app.ini`.
- `Chart.js` (CDN) — client-side time-series rendering in `chart.html`.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `flask/run.py` — dev entry (`server.run(host="0.0.0.0")`); SSL line commented out.
  - `flask/Dockerfile` CMD — `uwsgi app.ini` (production).
  - `docker-compose.yml` — orchestrates `flask` and `nginx` services.
- **Domain / core:**
  - `flask/app/views.py` — HTTP routes, SQL query, humidity filter, JSON response.
  - `flask/app/db.py` — MySQL connection config and `Flask-MySQL` initialization.
- **Adapters:**
  - `flask/app/db.py` — MySQL adapter (external RDS host in config).
  - `nginx/nginx.conf` — HTTP → uWSGI adapter to `weedapi-flask:8080`.
- **Presentation:**
  - `flask/app/templates/base.html` — Bootstrap shell.
  - `flask/app/templates/chart.html` — chart canvas + fetch/render script.
- **Docs vaults:** None (`docs/`, `.docs/` absent).
- **Agent scaffolding:** None (`.claude/` absent).
- **Generated / vendor:**
  - `flask/env38/` — local Python virtualenv; listed in `.gitignore` as `**/env38` (must not be ingested).
  - `flask/__pycache__/`, `flask/app/__pycache__/` — bytecode caches.
  - `flask/.app.ini.swp` — vim swap file (artifact).

## 6. Configuration & contracts (no secrets)

### Flask / MySQL config (shape only)

`flask/app/db.py` sets Flask config keys inline (not environment-driven):

| Config key | Purpose |
|------------|---------|
| `MYSQL_DATABASE_USER` | MySQL username |
| `MYSQL_DATABASE_PASSWORD` | MySQL password (**hardcoded in source — must be rotated and moved to env**) |
| `MYSQL_DATABASE_DB` | Database name (`db_temperatura`) |
| `MYSQL_DATABASE_HOST` | Remote MySQL hostname (**hardcoded — external managed instance**) |

**No secret values are reproduced in this summary.**

### Docker Compose environment

| Variable | Service | Purpose |
|----------|---------|---------|
| `FLASK_APP` | flask | Entry module (`run.py`) |
| `FLASK_ENV` | flask | `development` |
| `FLASK_DEBUG` | flask | `"true"` |

Ports: flask `5000:5000` (dev) and expose `8080` (uWSGI); nginx `80:80`, `443:443`.

### uWSGI (`flask/app.ini`)

- `module = run`, `callable = server`
- `socket = :8080`, `process = 4`, `threads = 2`, `master = true`

### 6.1 HTTP / API endpoints

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Renders `chart.html` (temperature/humidity dashboard) | none |
| `GET` | `/get` | Returns JSON of last 100 rows from `tb_temperatura` (humidity > 110 filtered) | none |

No OpenAPI spec, Django urls, or additional routes found.

### 6.2 Other interfaces

- **CLI:** `python run.py` for local Flask dev server (per `flask/run.py`).
- **Docker:** `docker-compose up` to build and run both services.
- **uWSGI:** invoked as container CMD, not typically run manually.
- No MCP, Telegram, systemd units, or hardware GPIO code in this repo (sensor ingestion is upstream).

## 7. Data & persistence

- **Store:** External MySQL database `db_temperatura`.
- **Primary table:** `tb_temperatura` — columns referenced in code: `RPi`, `Temperatura`, `Humedad`, `Fecha`.
- **Query pattern:** `SELECT * FROM tb_temperatura ORDER BY Fecha DESC LIMIT 100` — read-only, latest-first.
- **Topology:** Edge Pis (implied writers, not in repo) → remote MySQL → this Flask/nginx stack (reader/presenter). No local SQLite, KV, or vector storage. Application state is stateless between requests aside from DB connection pooling via Flask-MySQL.

## 8. Docs & agent memory (required scan)

| Source | Result |
|--------|--------|
| Root `README.md` | Present but **empty** — no project narrative in-repo. |
| `docs/**` | **Not present.** |
| `.docs/**` | **Not present.** |
| ADR / PRD / constitution | **Not found.** |
| `.claude/**` | **Not present.** |

Evidence used for this summary:

- `README.md` — empty placeholder.
- `docker-compose.yml` — service topology and env vars.
- `flask/requirements.txt` — dependency versions.
- `flask/app/views.py` — routes, SQL, filtering logic.
- `flask/app/db.py` — DB config shape (values omitted here).
- `flask/app.ini` — uWSGI contract.
- `nginx/nginx.conf` — reverse proxy routing.
- `flask/app/templates/chart.html` — front-end data fetch and Chart.js setup.
- `.gitignore` — ignores `**/env38` virtualenv trees.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repo; this summary describes architecture without clone links or live connection strings.
- **Auth model:** None on HTTP routes—anyone who can reach the service can read sensor JSON.
- **Credential handling:** Database username, password, and host are **hardcoded in `flask/app/db.py`** rather than environment variables or a secrets manager. This is a significant security debt; this document intentionally omits those values.
- **Transport:** nginx listens on 443 but no TLS certificate configuration appears in-repo; likely incomplete HTTPS setup.
- **Dependencies:** Pinned 2019–2020 era packages (Flask 1.1.2, urllib3 1.25.8, etc.) with known CVE exposure if redeployed without upgrades.
- **This summary contains no secrets, PEM keys, `.env` contents, or scraped credentials.**

## 10. Operational picture

### Local / dev

```bash
# Typical paths (commands only, no URLs):
docker-compose up --build          # from repo root
# OR inside flask/: python run.py   # Flask dev server on 0.0.0.0:5000
```

Volume mount `./flask:/flaskapp` enables live code edits in the flask container.

### Deploy

- No GitHub Actions, Makefile, or wrangler config in tree.
- Intended deployment appears to be manual `docker-compose` on a host with network access to the external MySQL instance.
- Container names: `weedapi-flask`, `weedapi-nginx` (referenced in compose and nginx upstream).

### Hardware constraints

- Named and structured for **Raspberry Pi** temperature monitoring, but the repo itself is a web stack—not Pi firmware or GPIO scripts. Pis are implied data producers writing to MySQL elsewhere.
- Resource footprint is small (Flask + nginx), suitable for Pi or small VPS when pointed at a remote DB.

### Freshness

- Last GitHub push: **2020-10-15** — treat as legacy / unmaintained unless revived.

## 11. Open questions / unknowns

- **Sensor ingestion:** No code in this repo shows how Pi devices write to `tb_temperatura`; writer service is unknown.
- **HTTPS:** Port 443 is exposed but certificate provisioning is not documented or configured in nginx conf.
- **Compose dependency order:** `flask` `depends_on: nginx` is unusual (typically nginx depends on app); startup race risk unknown.
- **`run.py` vs uWSGI:** Compose sets `FLASK_APP`/`FLASK_DEBUG` but production CMD uses uWSGI—whether dev compose path actually hot-reloads as intended is unclear.
- **Multi-Pi support:** JSON includes `RPi` column but chart aggregates all rows without per-device series separation.
- **Empty README:** Original intent, deployment target host, and operator runbook were never committed.
