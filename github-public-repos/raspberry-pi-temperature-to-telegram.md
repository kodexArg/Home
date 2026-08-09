---
id: "raspberry-pi-temperature-to-telegram"
title: "raspberry-pi-temperature-to-telegram — Raspberry Pi DHT sensor logger with Telegram remote monitoring"
visibility: public
importance: normal
source_repo: "raspberry-pi-temperature-to-telegram"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags:
  - "raspberry-pi"
  - "iot"
  - "dht11"
  - "dht22"
  - "telegram"
  - "mariadb"
  - "python"
  - "adafruit-circuitpython-dht"
  - "opencv"
  - "plotly"
  - "pandas"
  - "apscheduler"
  - "systemd"
  - "edge-computing"
  - "temperature"
  - "humidity"
problems_solved:
  - "Home or facility operators with a Raspberry Pi and DHT sensors need continuous temperature and humidity logging without standing at the device or SSH-ing in for every reading."
  - "Remote stakeholders want on-demand snapshots — current readings, historical charts, and camera images — delivered to a familiar mobile chat interface rather than a custom web dashboard."
  - "IoT sensor code must be developable and testable off-device (x86 laptop, CI) without physical GPIO hardware attached."
technologies:
  - "Python 3.9+"
  - "MariaDB"
  - "python-telegram-bot 20.0b0"
  - "adafruit-circuitpython-dht (DHT11/DHT22)"
  - "APScheduler 3.6"
  - "OpenCV (opencv-python)"
  - "Plotly 5 + Kaleido"
  - "Pandas / NumPy / SQLAlchemy"
  - "loguru + python-dotenv"
  - "systemd unit"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# raspberry-pi-temperature-to-telegram

> **Problem thesis (required):** A headless Raspberry Pi with a DHT11 or DHT22 sensor can measure temperature and humidity locally, but the operator is rarely at the device. This repository turns that Pi into a self-contained edge appliance: it samples the sensor every five seconds, persists readings to a local MariaDB table, and exposes a Telegram bot for remote commands — current measurement, a 48-hour temperature chart, and a live camera snapshot. A demo mode with simulated sensor values allows development and testing without GPIO hardware. No web server, no cloud dependency, no GUI on the Pi.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/raspberry-pi-temperature-to-telegram` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Headless Raspberry Pi edge app that logs DHT temperature/humidity to MariaDB and serves remote monitoring via Telegram bot commands (measure, chart, picture). |
| Audience | Raspberry Pi hobbyists and operators deploying environmental monitoring at home or small facilities; maintainers who SSH into the Pi for setup; developers who need off-device demo mode for testing Telegram and charting logic. |

## 2. Problems it solves

### P1 — No persistent, hands-free environmental logging on a Raspberry Pi

- **Who hurts:** Operators with a Raspberry Pi and DHT11/DHT22 sensor who want continuous temperature and humidity history without manual polling or ad-hoc scripts.
- **Pain today:** Reading the sensor interactively (e.g. via IPython) produces point-in-time values only; there is no scheduled ingestion, no durable store, and no way to review trends after the fact without building a separate pipeline.
- **How this repo answers:** `app.py` starts an APScheduler `BackgroundScheduler` that calls `db_inserts()` from `kweed_utils/db.py` every five seconds. Each tick reads temperature and humidity (via `kweed_utils/getth.py` on real hardware or `kweed_utils/getth_sim.py` in demo mode) and inserts a row into the `temphumi` table in the `rpi` MariaDB database. The schema (`installation/rpi.sql`) stores `temp`, `humi`, and an auto-timestamped `time` column. A systemd unit (`installation/kweed.service`) keeps the process alive across reboots.
- **Out of scope:** Multi-sensor networks, alerting thresholds, MQTT/HTTP ingestion APIs, cloud sync, data retention policies, or replication to remote databases (remote DB env vars exist for debug only).

### P2 — Remote visibility without building a web dashboard

- **Who hurts:** Anyone who wants to check conditions at the Pi from a phone while away from the device — without hosting a web UI, configuring port forwarding, or installing a separate monitoring app.
- **Pain today:** SSH is cumbersome on mobile; raw database queries require technical skill; there is no push or pull interface for "what is it right now?" or "show me the last two days."
- **How this repo answers:** `kweed_utils/telegram_bot.py` runs a long-polling Telegram bot (python-telegram-bot v20 async API) alongside the database writer. Three slash commands are registered: `/measure` returns formatted current temperature and humidity as HTML text; `/chart` queries MariaDB, resamples the last 48 hours into hourly buckets, renders a Plotly line chart to PNG, and uploads it; `/picture` captures a frame from the default camera device via OpenCV and sends it as a photo. Non-command text messages echo back to the sender (debug/placeholder handler). Chat actions (typing, uploading photo/document) are sent while long operations run.
- **Out of scope:** Multi-user authorization, command ACLs, push alerts on threshold breach, bot webhook mode (uses polling only), humidity on the chart (temperature only in current Plotly config).

### P3 — Hardware-coupled sensor code that blocks off-device development

- **Who hurts:** Developers working on Telegram handlers, charting, or database logic on a laptop without a Raspberry Pi, DHT sensor, or GPIO wiring.
- **Pain today:** `adafruit_dht` imports fail off-device; every test requires physical hardware; CI cannot exercise the ingestion loop.
- **How this repo answers:** Both `kweed_utils/db.py` and `kweed_utils/telegram_bot.py` branch on the `ISRPI` environment variable: when `ISRPI=yes`, they import `kweed_utils/getth.py` (real `adafruit_dht` reads with retry logic); otherwise they import `kweed_utils/getth_sim.py`, which generates slowly drifting random temperature and humidity values. Sensor type (DHT11 vs DHT22) and GPIO pin are configured via `DHT` and `BOARD` env vars in `getth.py`. This lets the full stack — scheduler inserts, chart generation, Telegram replies — run on any machine with MariaDB and Python deps installed.
- **Out of scope:** Mock camera capture off-device (OpenCV `VideoCapture(0)` still runs for `/picture`; will fail or capture wrong device without a camera).

## 3. Product / idea

The mental model is a **single-process edge daemon** on a headless Raspberry Pi: one Python process (`app.py`) runs two concurrent concerns — a background scheduler for sensor-to-database ingestion and a blocking Telegram bot poll loop for remote commands. All state lives in local MariaDB; images are written to an `images/` directory (`chart.png`, `capture.jpg`). No HTTP server is started.

```
┌─────────────────────────────────────────────────────────┐
│  app.py (single process)                                │
│  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │ APScheduler (5s)    │  │ Telegram bot (polling)   │ │
│  │  → db_inserts()     │  │  /measure /chart /picture│ │
│  └──────────┬──────────┘  └────────────┬─────────────┘ │
│             │                          │               │
│             ▼                          ▼               │
│  ┌──────────────────┐    ┌─────────────────────────┐  │
│  │ getth / getth_sim│    │ chart_th, take_a_pic    │  │
│  │ (DHT or fake)    │    │ (Plotly PNG, OpenCV)    │  │
│  └──────────┬───────┘    └────────────┬────────────┘  │
│             │                          │               │
│             ▼                          ▼               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ MariaDB — database `rpi`, table `temphumi`       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ▲                              ▲
         │ GPIO                         │ USB camera
    DHT11/DHT22                     (OpenCV device 0)
```

The `kweed_utils` package name reflects an earlier project context ("kweed"); it holds all domain adapters — sensor reads, database writes, chart rendering, camera capture, and Telegram handlers.

### 3.1 North-star use cases

1. **Deploy on Pi** — Install MariaDB, clone repo to `/App`, configure `.env` with DB credentials and `ISRPI=yes`, wire DHT sensor to configured GPIO pin, enable `kweed.service`, interact with the bot from Telegram.
2. **Check current conditions** — Send `/measure` to receive device-local timestamp, temperature (°C), and humidity (%).
3. **Review trends** — Send `/chart` to receive a PNG line chart of hourly-averaged temperature over the last 48 hours, with outlier trimming (1st–99th percentile on temperature).
4. **Visual check** — Send `/picture` to capture and receive a JPEG from the default video device.
5. **Develop off-device** — Set `ISRPI` to anything other than `yes`, run `app.py` locally with MariaDB; simulated sensor values populate the database for chart testing.

### 3.2 Non-goals

- No web UI, REST API, or mobile app — Telegram is the sole remote interface.
- No authentication on bot commands (any Telegram user who can message the bot receives responses).
- No automated alerting or scheduled Telegram pushes — all interaction is pull/on-demand.
- No multi-Pi fleet management or centralized dashboard.
- README references an older clone path (`raspberry-temp-humi`) and repo naming; the current GitHub name is `raspberry-pi-temperature-to-telegram`.

## 4. Technology stack

Derived from `requirements.txt`, source imports, and `installation/` artifacts.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.9+ (README states 3.9 on Pi) | `README.md`, `requirements.txt` |
| Sensor / GPIO | adafruit-circuitpython-dht (DHT11/DHT22 via `board` pin) | `kweed_utils/getth.py`, README checkpoint |
| Scheduler | APScheduler 3.6 (BackgroundScheduler, UTC, 5s interval) | `app.py`, `requirements.txt` |
| Database | MariaDB (native `mariadb` connector + SQLAlchemy for reads) | `kweed_utils/db.py`, `kweed_utils/chart_th.py`, `installation/rpi.sql` |
| Telegram | python-telegram-bot 20.0b0 (async, ApplicationBuilder, polling) | `kweed_utils/telegram_bot.py` |
| Charting | Plotly Express + Kaleido (PNG export), Pandas resampling | `kweed_utils/chart_th.py` |
| Camera | OpenCV (`cv2.VideoCapture`) | `kweed_utils/take_a_pic.py` |
| Config | python-dotenv (`.env` loading) | multiple `kweed_utils/*.py` |
| Logging | loguru | `app.py`, `kweed_utils/db.py`, `kweed_utils/chart_th.py` |
| Process manager | systemd (`kweed.service`) | `installation/kweed.service` |
| Dev tooling | Black formatter (VS Code setting) | `.vscode/settings.json`, `requirements.txt` |
| Backup script | Bash + mysqldump + gzip (AWS S3 upload commented out) | `installation/mariadbcopy.sh` |

### 4.1 Notable dependencies (curated)

- `adafruit-circuitpython-dht` — GPIO access to DHT11/DHT22; installed separately per README (`pip install adafruit-circuitpython-dht`), not pinned in `requirements.txt`.
- `python-telegram-bot==20.0b0` — async Telegram Bot API client; drives all remote interaction.
- `APScheduler==3.6.3` — interval-based background job for sensor polling without blocking the bot loop.
- `mariadb==1.0.11` — native MariaDB connector for insert path; separate from SQLAlchemy read path in charting.
- `plotly==5.11.0` + `kaleido==0.2.1` — server-side chart rendering to PNG for Telegram photo upload.
- `opencv-python==4.6.0.66` — camera frame capture for `/picture` command.
- `pandas==1.5.2` + `SQLAlchemy==1.4.46` — DataFrame loading and time-based resampling for chart generation.

## 5. Repository map (abstraction)

- **Entrypoint:** `app.py` — starts scheduler and Telegram bot; sole production process.
- **Domain / core (`kweed_utils/`):**
  - `getth.py` — real DHT sensor reads with retry loop (5 attempts, 1s backoff); handles NaN from flaky reads.
  - `getth_sim.py` — simulated drifting random values for off-device development.
  - `db.py` — MariaDB connection factory and `db_inserts()` INSERT loop.
  - `chart_th.py` — SQL → Pandas → Plotly → PNG pipeline for historical temperature chart.
  - `take_a_pic.py` — single-frame OpenCV capture to disk.
  - `telegram_bot.py` — command handlers, bot initialization, polling main.
- **Installation / ops (`installation/`):**
  - `rpi.sql` — `temphumi` table DDL.
  - `kweed.service` — systemd unit (user `kodex`, working dir `/App/raspberry-temp-humi`).
  - `mariadbcopy.sh` — local mysqldump backup script (S3 upload stubbed).
- **Assets:** `images/chart.png` — sample chart output checked into repo.
- **Tests:** `tests/testings.py` — minimal SQLAlchemy engine smoke test (mostly commented ORM model).
- **Docs vaults:** No `docs/`, `.docs/`, `.claude/`, or agent skill trees present in the repository tree.
- **Generated / vendor:** `__pycache__/`, `venv/`, `.env` are gitignored; not ingested.

## 6. Configuration & contracts (no secrets)

Environment variables are loaded via `python-dotenv` from a `.env` file (gitignored). Names and purposes only:

| Variable | Purpose |
|----------|---------|
| `ISRPI` | When `yes`, use real `adafruit_dht` sensor module; otherwise use simulated readings |
| `DHT` | Sensor type: `11` for DHT11, anything else defaults to DHT22 |
| `BOARD` | GPIO board pin identifier passed to `adafruit_dht` constructor (e.g. board pin constant name) |
| `DBUSER` | MariaDB username (default `root` in code fallback) |
| `DBPASS` | MariaDB password (default `root` in code fallback) |
| `DBHOST` | MariaDB host (default `localhost`) |
| `DBPORT` | MariaDB port (read in `db_cursor` but connection hardcodes port 3306) |
| `REMOTEDBUSER` | Remote DB username (debug/testing only, `islocal=False` path) |
| `REMOTEDBPASS` | Remote DB password (debug only) |
| `REMOTEDBHOST` | Remote DB host (debug only) |
| `REMOTEDBPORT` | Remote DB port (debug only) |

**Telegram bot token:** Hardcoded as a string literal in `kweed_utils/telegram_bot.py` inside `ApplicationBuilder().token(...)`. This is a security anti-pattern — the token should be moved to an environment variable and rotated. This summary does not reproduce the token value.

Database name is hardcoded as `rpi`; table name is `temphumi`.

### 6.1 HTTP / API endpoints

This repository exposes **no HTTP server or REST API**. All external interaction is via the Telegram Bot API (outbound polling from the Pi to Telegram servers). No routes, no OpenAPI, no Django/FastAPI/Workers surface.

### 6.2 Other interfaces

**Telegram bot commands (slash commands):**

| Command | Handler | Behavior |
|---------|---------|----------|
| `/start` | `start()` | Replies "Initialized..." (registered in code but not added to handler list in `main()` — only `/picture`, `/measure`, `/chart` are registered) |
| `/measure` | `send_adafruit_dht_data()` | Returns HTML-formatted current temperature, humidity, and device timestamp |
| `/chart` | `send_chart()` | Generates 48-hour hourly temperature chart PNG from MariaDB and uploads as photo |
| `/picture` | `send_picture()` | Captures camera frame via OpenCV, uploads as photo |
| *(any other text)* | `echo()` | Echoes sender name and message text back |

**systemd unit:** `installation/kweed.service` — `ExecStart=/usr/bin/python /App/raspberry-temp-humi/app.py`, runs as user `kodex`, restarts always, starts after `mariadb.service`.

**Sensor interface:** `getth.get_temp()`, `getth.get_humi()`, `getth.getth()` — returns float or NaN on read failure.

## 7. Data & persistence

- **Store:** Local MariaDB on the Raspberry Pi (or dev machine).
- **Database:** `rpi`
- **Table:** `temphumi` — columns `id` (bigint unsigned auto-increment PK), `temp` (float, nullable), `humi` (float, nullable), `time` (timestamp, default `current_timestamp()`).
- **Write pattern:** INSERT every 5 seconds via raw SQL in `db_inserts()`; NaN sensor values are written as SQL `NULL`.
- **Read pattern:** `chart_th.get_mariadb_data()` loads up to 90,000 most recent rows via SQLAlchemy/Pandas; resamples by configurable hours and time unit (default 48h, `1H` buckets); trims temperature outliers at 1st/99th percentile before aggregation.
- **Topology:** Fully on-premise edge — sensor, database, bot, and camera all co-located on one Pi. No cloud sync in active code (backup script has commented S3 upload). Remote DB env vars exist for debugging cross-host queries but are not part of the production architecture.

## 8. Docs & agent memory (required scan)

Sources scanned and evidence paths:

1. **Root README** (`README.md`) — Primary setup guide: hardware prerequisites (Pi 3+, DHT11/22, camera), OS packages (`python3-pip`, `libgpiod2`, `libmariadb-dev`, MariaDB), clone instructions, DHT sensor test checkpoint, MariaDB schema and user creation. README is incomplete (ends after DB setup; no Telegram or systemd configuration documented). References older repo name `raspberry-temp-humi` and clone path `/App`.
2. **`docs/`** — Not present.
3. **`.docs/`** — Not present (scanned; directory absent).
4. **`.claude/`** — Not present (scanned; directory absent). No agent skills, harness files, or constitution docs in this repo.
5. **ADR / PRD / constitution** — None found.
6. **Inline module docstrings** — `app.py`, `kweed_utils/telegram_bot.py`, `kweed_utils/chart_th.py`, `kweed_utils/take_a_pic.py` provide architecture narrative at module level.
7. **LICENSE** — MIT license file present.
8. **VS Code settings** — `.vscode/settings.json` sets Black as Python formatter.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; no private deployment URLs documented.
- **Auth model:** None on the Telegram bot — any user who can message the bot receives sensor data, charts, and camera images. No chat-ID allowlist or token-based command authorization.
- **Secrets in source:** The Telegram bot API token is embedded as a plaintext string literal in `kweed_utils/telegram_bot.py`. This is a critical finding — the token is exposed in version control and should be rotated and moved to environment configuration immediately. This summary contains no token value.
- **SQL construction:** `db_inserts()` builds INSERT statements via f-string interpolation. While current values are numeric, this pattern is injection-prone if inputs change; parameterized queries are recommended.
- **README example credentials:** The setup guide shows example MariaDB user/password pairs for illustration. Do not reuse these in production.
- **`.env` gitignored:** Correctly excluded; real credentials belong only in local `.env`, never committed.
- **Camera access:** `/picture` captures from device index 0 with no access control beyond Telegram bot exposure.

## 10. Operational picture

**Local development / demo:**

```bash
# With MariaDB running and .env configured (ISRPI unset or not "yes")
python app.py
```

**Raspberry Pi production setup (from README + installation artifacts):**

1. `sudo apt update && sudo apt upgrade`
2. Install system packages: `python3-pip`, `git`, `libgpiod2`, `libmariadb-dev`, `mariadb-client`, `mariadb-server`
3. `sudo mkdir /App && sudo chmod o=rwx /App`
4. Clone repo into `/App`
5. `pip install -r requirements.txt && pip install adafruit-circuitpython-dht`
6. Configure MariaDB: create `rpi` database, apply `installation/rpi.sql`
7. Create `.env` with DB credentials, `ISRPI=yes`, `DHT`, `BOARD` pin
8. Install and enable systemd unit from `installation/kweed.service` (adjust paths to match actual clone location)
9. Message the Telegram bot with `/measure`, `/chart`, `/picture`

**Hardware constraints:**

- Raspberry Pi 3 or newer; headless (no GUI recommended in README).
- DHT11 or DHT22 sensor on a GPIO pin (README example uses `board.D4`).
- USB or Pi camera supported by OpenCV `VideoCapture(0)` for `/picture`.
- Sufficient SD card storage for MariaDB time-series growth (no retention policy implemented; table can grow unbounded).

**CI / deploy:** No GitHub Actions, Dockerfile, or automated deploy pipeline in the repository. Deployment is manual on-device following README steps.

**Backup:** `installation/mariadbcopy.sh` provides a local gzipped mysqldump to `$HOME/mysql/`; AWS S3 upload is commented out.

## 11. Open questions / unknowns

- README ends abruptly after MariaDB setup — Telegram bot configuration, `.env` template, systemd install steps, and camera setup are undocumented in README (inferred from source only).
- README clone URL and systemd `WorkingDirectory` reference `raspberry-temp-humi`, not the current repo name `raspberry-pi-temperature-to-telegram` — may cause confusion during install.
- `/start` handler exists in code but is not registered in `main()` — only three commands are active.
- Chart currently plots temperature average only; humidity aggregation code exists in `resample_by_time()` but is commented out in the Plotly figure.
- `db_cursor()` reads `DBPORT` env var but `mariadb.connect()` hardcodes `port=3306` — env port override may not work.
- `tests/testings.py` is a stub (commented ORM model, engine creation only) — no automated test coverage for sensor, bot, or chart logic.
- No `.env.example` file — required env var names must be inferred from source.
- `installation/mariadbcopy.sh` has syntax issues (`BASH_SOURCHE` typo, malformed `log` function) and empty `PASS` variable — script may not run as-is without fixes.
- Whether the hardcoded Telegram token is still valid or has been rotated is unknown from the tree alone.
- No `.claude/` or `.docs/` directories exist — nothing to summarize for agent scaffolding.
