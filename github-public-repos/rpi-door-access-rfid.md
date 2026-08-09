---
id: "rpi-door-access-rfid"
title: "rpi-door-access-rfid — Raspberry Pi RFID shower-door access control with admin panel"
visibility: public
importance: normal
source_repo: "rpi-door-access-rfid"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["raspberry-pi", "rfid", "iot", "fastapi", "sqlite", "gpio", "door-access", "htmx", "sse", "access-control", "embedded", "mfrc522", "gpiozero", "tailwind", "jwt"]
problems_solved:
  - "Fuel-station shower facilities need automated RFID door access that enforces prepaid credits, card expiry, and active status without staff standing at the door."
  - "Operators lack a tamper-evident audit trail and real-time visibility into grant/deny events at a physical access point."
  - "IoT door-control code must run on real Raspberry Pi GPIO in production yet be developable and testable on x86 without hardware attached."
technologies:
  - "Python 3.x"
  - "FastAPI 0.136"
  - "Uvicorn 0.44"
  - "SQLAlchemy 2.0"
  - "SQLite (WAL mode)"
  - "gpiozero + mfrc522 + spidev"
  - "HTMX 2 + Alpine.js + Tailwind CSS 3"
  - "JWT (python-jose) + passlib/bcrypt"
  - "pytest + httpx"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# rpi-door-access-rfid

> **Problem thesis (required):** Parador Km1151 (a YPF Full truck-stop in Uspallata, Mendoza) operates paid shower facilities for truckers. Before this system, access was manual: no enforced credit limits, no card expiry, no audit trail, and no live view of door events. This repository delivers a self-contained Raspberry Pi appliance that reads RFID cards at the shower door, validates accounts against a local SQLite database, actuates a relay/LEDs/buzzer for feedback, and gives front-desk staff a browser-based admin panel to manage companies, clients, cards, credits, and recovery workflows — all without cloud dependency.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/rpi-door-access-rfid` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | On-device RFID door access for prepaid shower facilities: Pi GPIO hardware, credit/expiry enforcement, and a FastAPI admin panel with live SSE updates. |
| Audience | Front-desk operators at the deployment site; maintainers of the Pi appliance; AI agents extending hardware or admin workflows; developers running mock hardware on x86 for tests. |

## 2. Problems it solves

### P1 — No automated enforcement of prepaid shower access

- **Who hurts:** Truck-stop staff and truckers using paid shower facilities; operators who previously tracked usage on paper or by memory.
- **Pain today:** Cards could be reused beyond paid limits, stale cards stayed valid indefinitely, and there was no reliable way to block inactive or expired credentials at the physical door.
- **How this repo answers:** An async RFID polling loop (`rfid_polling_task` in `app/main.py`) reads card UIDs every 500 ms and calls `process_swipe()` in `app/domain/workflows.py`. Validation runs in order: account exists → `status == "active"` → `expiration_date` not passed → `credits > 0`. On grant: green LED, single beep, relay open for 5 seconds, one credit deducted, immutable access log written. On deny: red LED, differentiated buzzer pattern (3 beeps for out-of-credits, 1 long beep otherwise), reason recorded (`Not Found`, `Invalid Status`, `Expired`, `Out of Credits`).
- **Out of scope:** Payment processing, multi-door zones, anti-passback, card-cloning detection, cloud billing integration.

### P2 — No audit trail or real-time operator visibility

- **Who hurts:** Front-desk staff resolving disputes; operators who need to know immediately when a card is denied at the door.
- **Pain today:** Access events were invisible to staff away from the door; admin actions and RFID swipes had no structured, searchable history.
- **How this repo answers:** Two persistence layers: `access_logs` (every grant/deny at the reader) and `audit_logs` (immutable system-wide trail for admin and system actions — user/company/card CRUD, recharges, batch blanquear, RFID events). KPI stats (`compute_kpi` in `app/api/stats.py`) aggregate grant/deny rates by day, week, and month. Server-Sent Events at `/sse/events` stream HTML fragments to the dashboard sidebar via a SQLite-backed `EventBroadcaster` (`app/core/events.py`), so all worker processes and browser tabs see the same live feed.
- **Out of scope:** Remote monitoring, email/Telegram alerts, export to external SIEM, multi-user RBAC.

### P3 — Hardware-coupled code that cannot be developed off-device

- **Who hurts:** Developers and CI pipelines without a Raspberry Pi, MFRC522 reader, relay module, and GPIO wiring on every machine.
- **Pain today:** Raw GPIO code sprinkled through business logic makes x86 development impossible and hardware swaps painful.
- **How this repo answers:** Strict Open/Closed hardware abstraction (ADR 0001): abstract interfaces `LedIndicator`, `Buzzer`, `DoorRelay`, `RFIDReader` in `app/infrastructure/hardware/interfaces.py`. `build_factory()` in `app/infrastructure/hardware/factory.py` selects `GpioHardwareFactory` on Raspberry Pi (gpiozero, mfrc522) or `MockHardwareFactory` elsewhere (stdout logging, no side effects). Domain workflows receive injected hardware — `process_swipe()` never imports GPIO directly. `scripts/seed_mock_data.py` exercises the full stack with mock hardware and narrative seed data.
- **Out of scope:** AWS IoT Core sync (mentioned as future in `docs/PRD.md` but explicitly a non-goal in root `PRD.md` v1.0).

## 3. Product / idea

The mental model is a **single-process edge appliance**: one FastAPI app on a Raspberry Pi serves both the door-control daemon and the admin web UI on port 8000. SQLite is the sole datastore, co-located on the Pi. No external services are required at runtime.

Three layers (documented in root `PRD.md` §6):

1. **API layer** — FastAPI routers for REST (`/api/*`), server-rendered Jinja2 templates with HTMX partials (`/ui/*`), auth (`/login`, `/ui/login`), and SSE (`/sse/events`).
2. **Domain layer** — `process_swipe`, `grant_access`, `deny_access`, audit helpers; publishes events to the broadcaster after each swipe or admin mutation.
3. **Infrastructure layer** — SQLAlchemy models and sessions (`app/infrastructure/`), hardware factory strategy, platform detection (`app/infrastructure/hardware/platform.py`).

Domain entities map to a Spanish operational context (ADR 0002 SSOT): `Company` (empresa), `User` (usuario/cliente), `Account` (tarjeta/ficha RFID), `AccessLog`, credits as remaining uses. Cards support `key_type` variants: `particulares` (sold credits), `cuenta_corriente` (company-covered), `ticket_carga` (credits tied to a load-ticket invoice number).

### 3.1 North-star use cases

1. **Trucker at door** — Presents RFID ficha at MFRC522 reader; system grants or denies with LED/buzzer feedback and unlocks door relay for 5 seconds on success.
2. **Operator assigns card** — Logs into admin panel, creates or selects a client and company, scans card via USB reader at desk (auto-fills UID), sets credits and 24-hour default expiry, hands card to trucker.
3. **Operator recovers abandoned card** — Uses "blanquear" batch workflow to unlink cards from users so fichas can be re-issued; views audit log and KPI dashboard for today's deny reasons.

### 3.2 Non-goals

- Payment processing (handled outside the system per root `PRD.md`).
- Multi-user admin accounts (single `SUPER_USER` / `SUPER_PASSWORD`).
- Cloud synchronization or remote monitoring (deferred; contradicts v1.0 "fully on-device" goal).
- Multi-door or multi-zone access control.
- Mobile app.
- Card duplication / anti-passback logic.

## 4. Technology stack

Derived from `requirements.txt`, `package.json`, `PRD.md`, ADRs, and `app/` structure.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.x | `requirements.txt`, `run.py` shebang |
| Web framework | FastAPI 0.136 + Uvicorn 0.44 | `requirements.txt`, `app/main.py` |
| ORM / data | SQLAlchemy 2.0 + SQLite (WAL) | `requirements.txt`, `app/infrastructure/database.py` |
| Templates / UI | Jinja2 + HTMX 2 + Alpine.js | `app/templates/`, `app/static/vendor/` |
| CSS | Tailwind CSS 3 (build script) | `package.json`, `tailwind.config.js`, `scripts/build-css.sh` |
| Auth | JWT HS256 (python-jose), passlib/bcrypt | `app/core/security.py`, `requirements.txt` |
| GPIO / RFID | gpiozero, mfrc522, spidev | `requirements.txt`, `app/infrastructure/hardware/gpio_impl.py` |
| Settings | pydantic-settings | `app/core/config.py` |
| Tests | pytest, pytest-asyncio, pytest-cov, httpx | `requirements.txt`, `tests/` |
| Infra / deploy | Manual on Pi (no CI workflow in tree) | ADR 0003 mentions future GitHub Actions; no `.github/` present |
| AI / agents | `AGENTS.md`, `skills/` tree, `skills.sh` dispatcher | `AGENTS.md`, `skills/README.md` |

### 4.1 Notable dependencies (curated)

- `gpiozero` — GPIO abstraction for LEDs, buzzer, and relay on Raspberry Pi.
- `mfrc522` + `spidev` — SPI RFID reader driver for door-mounted MFRC522 module.
- `fastapi` + `uvicorn` — Combined REST API and server-rendered admin UI in one ASGI process.
- `python-jose` — JWT creation and validation for admin session cookies and Bearer API auth.
- `pydantic-settings` — Typed environment configuration including GPIO pin assignments.
- `tailwindcss` (dev) — Utility CSS compiled to committed `app/static/dist/app.css` for deployment without Node on the Pi.

## 5. Repository map (abstraction)

- **Entrypoints:** `run.py` (CLI with `--verbose`, starts Uvicorn on `0.0.0.0:8000`); `app/main.py` (FastAPI app, lifespan, RFID polling task).
- **Domain / core:** `app/domain/workflows.py` (swipe validation, grant/deny sequences); `app/domain/entities.py` (Pydantic schemas); `app/core/` (config, security, events, audit, time, templates).
- **API / adapters:** `app/api/` — `auth.py`, `endpoints.py` (accounts + main UI routes + SSE), `users.py`, `companies.py`, `stats.py`, `logs.py`.
- **Infrastructure:** `app/infrastructure/database.py` (engine, migrations, seed); `app/infrastructure/models.py` (SQLAlchemy ORM); `app/infrastructure/hardware/` (interfaces, gpio_impl, mock_impl, factory, platform).
- **Web UI:** `app/templates/` — tabbed dashboard (`_tab_dashboard`, `_tab_users`, `_tab_data`, `_tab_logs`), HTMX partials for inline edits, login page, KPI cards, event items.
- **Static assets:** `app/static/dist/app.css` (committed compiled CSS); `app/static/vendor/` (htmx, alpine minified).
- **Docs vaults:** `docs/PRD.md` (shorter overview), root `PRD.md` (full v1.0 production spec), `HELP.md` (Spanish operator manual), `docs/ADRs/` (architecture, glossary, git workflow), `docs/architecture.html`, `docs/rfid_happy_path.html`, `docs/uml_diagrams.html`.
- **Agent scaffolding:** `AGENTS.md` (SOLID/FastAPI guidelines); `skills/` with `system/check_solid_compliance.sh` and `templates/hardware_interface.md`; `skills.sh` dispatcher. **No `.claude/` or `.docs/` directories present** — scanned, absent.
- **Scripts:** `scripts/build-css.sh` (Tailwind standalone binary download + compile); `scripts/seed_mock_data.py` (narrative mock dataset via real domain services).
- **Tests:** `tests/test_api.py`, `tests/test_events.py`, `tests/test_workflows.py`, `tests/conftest.py`.
- **Generated / vendor / ignored:** `node_modules/` gitignored; `*.db` gitignored (sample WAL/SHM files may appear in working tree but must not be ingested); `scripts/bin/` gitignored (Tailwind binary).

## 6. Configuration & contracts (no secrets)

Environment variables (from `.env.example` and `app/core/config.py`):

| Variable | Purpose |
|----------|---------|
| `SUPER_USER` | Admin username for JWT subject (default `admin`) |
| `SUPER_PASSWORD` | Admin password compared at login (required, not hashed in DB) |
| `JWT_SECRET_KEY` | HS256 signing key for session tokens |
| `VERBOSE` | Boolean — verbose RFID polling logs to stdout |
| `DATABASE_URL` | SQLAlchemy DSN (default `sqlite:///./rpi_door_access.db`) |
| `RELAY_PIN` | GPIO pin for door relay (default 17) |
| `BUZZER_PIN` | GPIO pin for buzzer (default 22) |
| `LED_GREEN_PIN` | GPIO pin for grant LED (default 27) |
| `LED_RED_PIN` | GPIO pin for deny LED (default 18) |
| `RFID_RST_PIN` | MFRC522 reset pin (default 25) |

Copy `.env.example` to `.env` locally on the Pi; never commit `.env`.

### 6.1 HTTP / API endpoints

**Authentication**

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/login` | Admin login page | none |
| `POST` | `/ui/login` | Form login → HttpOnly JWT cookie | none |
| `GET` | `/ui/logout` | Clear session cookie | none |
| `POST` | `/api/login` | OAuth2 password flow → Bearer token JSON | none |

**REST API (Bearer token via `get_current_admin`)**

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/api/accounts` | List RFID accounts (paginated skip/limit) | Bearer |
| `POST` | `/api/accounts` | Create account | Bearer |
| `PUT` | `/api/accounts/{account_id}/recharge` | Add credits (`amount` query param) | Bearer |
| `GET` | `/api/users` | List active users | Bearer |
| `GET` | `/api/companies` | List active companies | Bearer |
| `GET` | `/api/stats/kpi` | KPI aggregates (grant/deny rates, deny reason breakdown) | cookie or Bearer |

**Web UI (HTMX fragments — cookie auth via `get_current_admin_cookie`)**

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/` | Main dashboard (users, companies, KPI) | cookie |
| `POST` | `/ui/accounts/create` | Create or link card | cookie |
| `POST` | `/ui/accounts/{account_id}/recharge` | Recharge credits (1–10000) | cookie |
| `POST` | `/ui/accounts/{account_id}/edit` | Edit status, expiry, credits, key_type | cookie |
| `DELETE` | `/ui/accounts/{account_id}` | Unlink card from user | cookie |
| `POST` | `/ui/accounts/blanquear` | Batch unlink cards (comma-separated IDs) | cookie |
| `GET` | `/ui/users/search` | User search partial | cookie |
| `GET` | `/ui/users/{user_id}/detail` | User detail panel with cards | cookie |
| `POST` | `/ui/users/create` | Create user | cookie |
| `DELETE` | `/ui/users/{user_id}` | Soft-delete user | cookie |
| `POST` | `/ui/companies/create` | Create company | cookie |
| `POST` | `/ui/companies/create-option` | Create company + return select options | cookie |
| `DELETE` | `/ui/companies/{company_id}` | Soft-delete company (Particulares protected) | cookie |
| `GET` | `/ui/logs` | Audit log browser with filters/pagination | cookie |

**Real-time**

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/sse/events` | Server-Sent Events stream (swipe, KPI, account events as HTML fragments) | cookie |

**Static**

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| — | `/static/*` | CSS, HTMX, Alpine assets | none |

No separate health-check endpoint; liveness is implicit via Uvicorn process and boot logs.

### 6.2 Other interfaces

- **CLI:** `python run.py [-v|--verbose]` — starts ASGI server with optional verbose RFID logging.
- **RFID hardware:** `RFIDReader.read_card() -> str | None` — polled every 500 ms; returns card UID string.
- **GPIO outputs:** `DoorRelay.trigger(seconds=5)`, `LedIndicator.on/off`, `Buzzer.beep(times, duration)`.
- **AI skills CLI:** `./skills.sh <skill_path>` — dispatches executable scripts under `skills/` (e.g. `system/check_solid_compliance.sh`).
- **Seed utility:** `python scripts/seed_mock_data.py [--reset]` — populates mock Parador scenario using domain services.

## 7. Data & persistence

**Store:** Single SQLite database file (default `rpi_door_access.db`), WAL journal mode enabled at connection (`app/infrastructure/database.py`) to prevent SSE long-polls from blocking RFID writes.

**Tables / entities:**

| Table | Role |
|-------|------|
| `companies` | Company names; soft-delete via `deleted_at`; seeded with "Particulares" |
| `users` | Clients (name, email, company FK, document fields, nationality); soft-delete |
| `accounts` | RFID cards — PK is `account_id` (UID); status, expiry, credits, `user_id` FK, `key_type`, `invoice_number` |
| `access_logs` | Immutable grant/deny at reader (`event_type`, `reason`, indexed by timestamp/account) |
| `audit_logs` | Immutable admin/system actions with JSON `details` (never deleted) |
| `sse_events` | Cross-process SSE bus — publishers INSERT, subscribers poll by id |

**Topology:** Fully offline edge — all data and logic on the Raspberry Pi. No cloud replication in v1.0. Development uses the same schema with `MockHardwareFactory` on non-Pi hosts.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **Root `README.md`** — One-line product description (Python, FastAPI, SQLite RFID door access). Note: README text says "Currently Private" but GitHub visibility flag for this swarm run is `public`; frontmatter reflects `public`.
2. **Root `PRD.md`** — Full v1.0 production spec: deployment context (Parador Km1151 showers), goals/non-goals, architecture diagram, data model, feature breakdown, GPIO pin map, operator workflows.
3. **`docs/PRD.md`** — Shorter PRD with hardware list, validation flow, future AWS sync mention.
4. **`HELP.md`** — Spanish operator manual: concepts (empresa, tarjeta, créditos, tipos de llave), hardware signal table, login/session duration (60 min), dashboard tabs, blanquear procedure.
5. **`docs/ADRs/0001-initial-architecture.md`** — FastAPI + SQLite + SOLID hardware injection decisions.
6. **`docs/ADRs/0002-glossary-and-nomenclature.md`** — SSOT English code terms mapped to Spanish colloquials; enforcement rule for agents.
7. **`docs/ADRs/0003-git-and-github-workflow.md`** — Conventional Commits, GitHub Flow, SemVer, zero-tolerance secrets policy.
8. **`AGENTS.md`** — Agent coding guidelines: SOLID (especially Open/Closed for hardware), DRY, FastAPI, pointers to PRD and ADRs.
9. **`skills/README.md`** — AI skills infrastructure: `skills.sh` dispatcher, `system/` and `templates/` subtrees.
10. **`CHANGELOG.md`** — Scaffolding-phase changelog (may lag behind current code maturity).
11. **`.claude/`** — **Not present** (directory absent in clone).
12. **`.docs/`** — **Not present** (directory absent in clone).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public GitHub repo; this summary contains no clone URLs, live credentials, or connection strings with passwords.
- **Auth model:** Single shared admin account via environment variables; JWT in HttpOnly cookie for web UI, Bearer token for REST. Password compared in plaintext against `SUPER_PASSWORD` (not stored hashed in DB — bcrypt utilities exist in `security.py` but login path uses direct comparison). Session expiry: 60 minutes (`ACCESS_TOKEN_EXPIRE_MINUTES`).
- **Secrets:** `.env` gitignored; `.env.example` uses placeholder values only. ADR 0003 mandates zero committed secrets. GPIO and DB files stay on the Pi.
- **Audit:** `audit_logs` and `access_logs` are append-only by convention; soft-delete on users/companies preserves historical referential context in logs.
- **Network:** Admin UI binds `0.0.0.0:8000` — intended for LAN access at the parador, not Internet exposure without additional hardening.

## 10. Operational picture

**Local development (x86 or Pi):**

```bash
# Install Python deps
pip install -r requirements.txt   # or equivalent venv workflow

# Copy and edit env
cp .env.example .env

# Optional: seed mock data
python scripts/seed_mock_data.py

# Run server (mock hardware off-Pi)
python run.py
# or verbose RFID logging:
python run.py --verbose
```

**CSS build (when changing Tailwind sources):**

```bash
./scripts/build-css.sh
```

**Tests:**

```bash
pytest
```

**Production deployment:** Raspberry Pi on `main` branch (per ADR 0003); pull and run via `run.py` or process manager. Boot log prints LAN IP and hardware mode (`GPIO` vs `MOCK`). Operator manual in `HELP.md` documents panel access on port 8000.

**Hardware constraints:** Raspberry Pi with GPIO + SPI; MFRC522 RFID reader at door; 5V relay (5-second unlock), red/green LEDs, buzzer; USB RFID reader at desk for admin card scanning. Pin defaults documented in `app/core/config.py` and `docs/GPIO.jpeg`.

**CI/CD:** ADR 0003 describes a planned GitHub Actions workflow (SOLID check + tests on PRs). No `.github/workflows/` found in the current shallow clone — checks are run manually via `pytest` and `./skills.sh system/check_solid_compliance.sh`.

## 11. Open questions / unknowns

- **README vs GitHub visibility:** Root `README.md` still says "Currently Private" while the repo is flagged `public` for this summary — may need README update.
- **CHANGELOG staleness:** `CHANGELOG.md` describes "initial scaffolding" with "no core Python code committed yet," but the tree contains a full application — changelog may not reflect current maturity.
- **CI workflow:** ADR 0003 references automated PR checks; no workflow file observed — implementation status unknown.
- **AWS IoT sync:** Mentioned in `docs/PRD.md` as future phase; explicitly a non-goal in root `PRD.md` v1.0 — roadmap intent unclear without maintainer confirmation.
- **Password hashing:** `passlib`/`bcrypt` imported in `security.py` but web login compares plaintext env password — intentional simplicity or incomplete hardening unknown.
- **`.claude/` / `.docs/`:** Required scan performed; neither directory exists in this repository.
