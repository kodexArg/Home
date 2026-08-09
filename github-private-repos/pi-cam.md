---
id: "pi-cam"
title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi"
visibility: private
importance: normal
source_repo: "pi-cam"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["python", "telegram", "rtsp", "raspberry-pi", "opencv", "ffmpeg", "asyncio", "home-security", "iot", "layered-architecture"]
problems_solved:
  - "Remote on-demand access to an IP camera feed without a dedicated mobile app or VPN browser session — operators trigger photo and short video capture from Telegram."
  - "Blocking, single-user camera scripts that cannot serve concurrent Telegram users or isolate per-user failures on constrained Raspberry Pi hardware."
  - "Ad-hoc RTSP + notification glue with no clear service boundaries, configuration validation, or motion-monitoring lifecycle."
technologies:
  - "Python 3.9+"
  - "python-telegram-bot 21+"
  - "OpenCV (opencv-python)"
  - "FFmpeg / ffmpeg-python"
  - "uv (package manager)"
  - "Pydantic 2"
  - "Loguru"
  - "pytest + pytest-asyncio"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Pi-Cam

> **Problem thesis (required):** Pi-Cam exists to turn a Raspberry Pi 3+ and an Ethernet-connected IP camera into a lightweight, remotely operable surveillance assistant. Operators interact through Telegram commands to grab still frames or short MP4 clips from an RTSP stream, optionally start/stop background motion monitoring, and receive media back in-chat — all without building a custom mobile client or exposing a public web UI. The codebase also addresses the maintainability pain of monolithic bot scripts by refactoring toward a layered architecture with explicit command orchestration, service lifecycle management, FIFO media caching, and a unified notifier.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/pi-cam` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Async Telegram bot that captures photos and videos from an RTSP IP camera on a Raspberry Pi, with optional motion monitoring and multi-user concurrency. |
| Audience | Home operators / internal ALVs who want phone-based camera control; developers maintaining the Pi deployment; CI agents running the pytest suite with mocks (no real hardware required). |

## 2. Problems it solves

### P1 — Remote camera access without a bespoke client

- **Who hurts:** Someone with an IP camera on a local network and a Raspberry Pi gateway who wants quick visual checks from a phone while away from the LAN UI.
- **Pain today:** Manufacturer apps are fragmented; browser RTSP viewers are awkward on mobile; writing one-off scripts ties capture logic directly to a chat handler and breaks under concurrent requests.
- **How this repo answers:** A long-polling Telegram bot exposes `/photo`, `/clip5`, and `/clip20` commands. Each command spawns an independent async task, delegates capture to an RTSP service (OpenCV for frames, FFmpeg for timed MP4 segments), and returns the media file in the chat. Per-user error handling prevents one failed capture from blocking others.
- **Out of scope:** Cloud NVR hosting, multi-camera orchestration, PTZ control, live continuous streaming to Telegram, or a web dashboard.

### P2 — Resource-bounded edge hardware with ephemeral media

- **Who hurts:** Raspberry Pi 3+ deployments with limited storage and CPU where uncapped snapshot/video accumulation fills the SD card.
- **Pain today:** Naive capture scripts write files indefinitely; blocking I/O in the bot thread stalls other users.
- **How this repo answers:** `CacheManager` enforces a FIFO cap (default 10 files) under a configurable `cache/` directory. Capture and FFmpeg work run in thread-pool executors to keep the asyncio event loop responsive. System FFmpeg uses `ultrafast` preset for short clips to reduce encode latency on weak hardware.
- **Out of scope:** Long-term archival, object storage upload, or transcoding pipelines.

### P3 — Evolving from script soup to testable services

- **Who hurts:** Maintainers of a growing Telegram + RTSP + motion-detection codebase where root-level modules became tightly coupled.
- **Pain today:** Direct imports between bot handlers and OpenCV calls make unit testing and feature addition (e.g., REST API, alternate input channels) costly.
- **How this repo answers:** A documented layered refactor (`TASK.md`) introduces `input_layer/`, `business_logic/`, `services/`, and `infrastructure/` packages. `CommandManager` centralizes command types (`CAPTURE_PHOTO`, `START_MONITORING`, `GET_STATUS`, etc.), tracks `SystemState`, and coordinates `RTSPCaptureService` and `MotionDetectionService` through a `ServiceManager`. Legacy root modules (`telegram_bot.py`, `rtsp_capture.py`, …) remain for gradual migration compatibility.
- **Out of scope:** Fully completed migration (some root duplicates still exist); hot configuration reload; REST/WebSocket interfaces (planned only in `TASK.md`).

## 3. Product / idea

Pi-Cam is a single-process Python application (`app.py`) that boots on a Raspberry Pi, loads validated environment configuration, wires infrastructure helpers (notifier, cache), instantiates domain services, and starts Telegram long-polling. The mental model is **Telegram as the control plane**, **CommandManager as the orchestrator**, **RTSP services as the data plane**, and **Notifier as the cross-cutting observability channel** (console + optional Telegram push for system events).

On `/photo`, the input layer acknowledges the user, asynchronously requests `CommandType.CAPTURE_PHOTO`, receives a filesystem path, sends the JPEG via `reply_photo`, and registers the file with the FIFO cache. Video commands differ only in duration (5 s or 20 s). `/start_monitoring` and `/stop_monitoring` toggle paired services: RTSP capture readiness plus a frame-differencing motion loop that can emit Telegram warnings when motion exceeds a sensitivity threshold. `/status` surfaces per-service run state and cumulative counters (motion events, photos, videos).

Hardware context from `README.md`: Raspberry Pi 3+, optional 7-inch display, IP camera on Ethernet, Pi on Wi-Fi. RTSP credentials and LAN addressing live in operator `.env` (not committed); the README documents the expected variable shapes without this summary repeating live values.

### 3.1 North-star use cases

1. **Quick visual check:** Operator sends `/photo` from Telegram; bot captures one JPEG from the RTSP stream and replies in-thread within seconds.
2. **Incident clip:** Operator sends `/clip5` or `/clip20` to record a short MP4 segment for review or forwarding in chat.
3. **Passive monitoring:** Operator runs `/start_monitoring`; motion detection loops on downscaled frames, notifies via Notifier when motion percentage crosses sensitivity, and `/stop_monitoring` tears down services cleanly.
4. **Developer validation:** Maintainer runs `uv run pytest` on a workstation with FFmpeg installed; mocks substitute cv2, ffmpeg, and Telegram so no Pi or camera is required.

### 3.2 Non-goals

- Public HTTP API or WebSocket control surface (mentioned as future in `TASK.md`, not implemented).
- Multi-tenant auth beyond optional `TELEGRAM_ALLOWED_USERS` allow-list (enforcement depth in bot layer is limited).
- Cloud deployment, container orchestration, or GitHub Actions CI (no `.github/` workflows in tree).
- Guaranteed production-hardening: configuration hot-reload, `CONFIGURE_SYSTEM` command, and some `TASK.md` notifier extensions remain stubs or placeholders.
- Storing or indexing historical footage beyond the local FIFO cache.

## 4. Technology stack

Derived from `pyproject.toml`, `README.md`, `pytest.ini`, and service implementations.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python ≥ 3.9 | `pyproject.toml` `requires-python` |
| Package manager | uv (`uv sync`, `uv run`) | `README.md`, `uv.lock` (lock not ingested) |
| Chat / input | python-telegram-bot 21+ (async Application, CommandHandler) | `pyproject.toml`, `input_layer/telegram_bot.py` |
| Video / vision | OpenCV (`cv2.VideoCapture`, frame diff), FFmpeg CLI via ffmpeg-python | `services/rtsp_capture.py`, `services/rtsp_motion_sense.py` |
| Config / validation | dataclasses + env loading, Pydantic models in Notifier | `infrastructure/system_config.py`, `infrastructure/notifier.py` |
| Logging | Loguru + structured Notifier channels | `infrastructure/notifier.py` |
| Concurrency | asyncio, `run_in_executor` for blocking capture | `services/rtsp_capture.py`, `input_layer/telegram_bot.py` |
| Data / files | Local filesystem cache directory | `infrastructure/cache_manager.py`, `.gitignore` `cache/` |
| Infra / deploy | Manual on Raspberry Pi; no IaC in repo | absence of `.github/`, `Dockerfile*` |
| Tests | pytest, pytest-asyncio, pytest-mock, pytest-cov | `pyproject.toml` optional dev deps, `pytest.ini`, `TESTS.md` |

### 4.1 Notable dependencies (curated)

- `python-telegram-bot` — async bot framework; all user-facing commands and media upload.
- `opencv-python` — RTSP frame grab, connection health checks, motion frame differencing.
- `ffmpeg-python` — timed MP4 segment recording from RTSP with TCP transport preference.
- `python-dotenv` — loads `.env` at application start (`app.py`).
- `pydantic` — message models and validation inside the Notifier subsystem.
- `loguru` — structured logging backend for notifier console/file channels.
- `pytest-asyncio` — async test execution (`asyncio_mode = auto` in `pytest.ini`).

## 5. Repository map (abstraction)

Zones of the codebase (layered layout plus legacy root duplicates):

- **Entrypoints:** `app.py` — `PiCamApplication` initializes config, cache, `CommandManager`, `TelegramBot`, signal handlers, graceful shutdown. Runnable via `uv run app.py`.
- **Input layer (`input_layer/`):** `telegram_bot.py` — Telegram command handlers, async task spawning per user request, media reply formatting. Planned but absent: `base_interface.py`, `api_interface.py` per `TASK.md`.
- **Business logic (`business_logic/`):** `command_manager.py` — `CommandType` enum, `CommandResult`, `SystemState`, service orchestration, motion event callbacks.
- **Services (`services/`):** `rtsp_capture.py` — photo/video capture service with health checks; `rtsp_motion_sense.py` — `MotionDetectionService` with `FrameDiffDetector` strategy.
- **Infrastructure (`infrastructure/`):** `system_config.py` (env-backed dataclasses), `service_interface.py` (`BaseService`, `ServiceManager`, `ServiceStatus`), `notifier.py` (multi-channel notifications), `cache_manager.py` (FIFO file cap).
- **Legacy root modules:** `telegram_bot.py`, `rtsp_capture.py`, `rtsp_motion_sense.py`, `cache_manager.py`, `notifier.py` — pre-refactor copies kept during gradual migration (`TASK.md` §Migración Gradual).
- **Docs vaults:** `README.md` (operator setup, commands, env template), `TASK.md` (architecture PRD / refactor plan), `TESTS.md` (test harness documentation). No `docs/`, `.docs/`, or ADR directories present.
- **Agent scaffolding:** No `.claude/`, `.agents/`, or `SKILL.md` trees found in the shallow clone.
- **Tests (`tests/`):** Layer-aligned subpackages (`test_input_layer/`, `test_business_logic/`, `test_services/`), shared `conftest.py`, RTSP/Telegram mocks under `tests/mocks/`.
- **Generated / vendor:** `uv.lock` present (not summarized); `cache/` directory gitignored except structure; `__pycache__` ignored.

## 6. Configuration & contracts (no secrets)

Configuration loads exclusively from environment variables via `SystemConfig.load_from_env()` in `infrastructure/system_config.py`. Required keys fail fast at startup.

**Required environment variables**

| Variable | Purpose |
|----------|---------|
| `BOT_TOKEN` | Telegram bot API token |
| `RTSP_URL` | Full RTSP stream URI for the IP camera |

**Optional Telegram**

| Variable | Purpose |
|----------|---------|
| `CHAT_ID` | Default chat for notifier push messages |
| `TELEGRAM_ALLOWED_USERS` | Comma-separated numeric user IDs (allow-list intent) |
| `TELEGRAM_MAX_FILE_SIZE` | Upload size cap (default 50 MB) |
| `TELEGRAM_TIMEOUT` | Telegram API timeout seconds |

**Optional RTSP tuning**

| Variable | Purpose |
|----------|---------|
| `RTSP_USERNAME` | Credential override (if not embedded in URL) |
| `RTSP_PASSWORD` | Credential override |
| `RTSP_TIMEOUT` | Connection timeout |
| `RTSP_RETRY_ATTEMPTS` | Retry count |
| `RTSP_RETRY_DELAY` | Delay between retries |

**Motion detection (`DETECTION_*`)**

| Variable | Purpose |
|----------|---------|
| `DETECTION_ENABLED` | Master enable flag (default false) |
| `DETECTION_SENSITIVITY` | Motion percentage threshold (0.0–1.0 scale used as percent in service) |
| `DETECTION_MIN_AREA` | Minimum motion area |
| `DETECTION_FRAME_SKIP` | Frame skip interval |
| `DETECTION_NOTIFICATION_COOLDOWN` | Seconds between notifications |
| `DETECTION_SAVE_CLIPS` | Whether to persist motion clips |
| `DETECTION_CLIP_DURATION` | Clip length seconds |
| `DETECTION_THRESHOLD` | Frame-diff pixel threshold |
| `DETECTION_FRAME_WIDTH` / `DETECTION_FRAME_HEIGHT` | Downscale dimensions |
| `DETECTION_FPS` | Processing FPS target |
| `DETECTION_CHECK_INTERVAL` | Loop sleep between frames |

**Cache & system**

| Variable | Purpose |
|----------|---------|
| `CACHE_DIR` | Cache base path (default `cache`) |
| `CACHE_MAX_SIZE_MB` | Size budget |
| `CACHE_CLEANUP_INTERVAL` | Janitor interval seconds |
| `CACHE_MAX_AGE_HOURS` | Max file age |
| `LOG_LEVEL` | Logging verbosity |
| `DEBUG_MODE` | Boolean debug flag |

`.env` is gitignored; operators create it locally per `README.md`. This summary contains no credential values.

### 6.1 HTTP / API endpoints (when applicable)

**No HTTP server is exposed.** Pi-Cam is a Telegram long-polling client, not a web service. There is no OpenAPI spec, Django `urls.py`, or Workers route table.

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| — | — | N/A — no HTTP surface | — |

Internal command API (Python, not network):

| Command type (`CommandType`) | Invoked by | Purpose |
|------------------------------|------------|---------|
| `CAPTURE_PHOTO` | `/photo` handler | Single JPEG from RTSP |
| `CAPTURE_VIDEO` | `/clip5`, `/clip20` | Timed MP4 (`duration` parameter) |
| `START_MONITORING` | `/start_monitoring` | Start RTSP + motion services |
| `STOP_MONITORING` | `/stop_monitoring` | Stop monitoring services |
| `GET_STATUS` | `/status`, `/start` status line | SystemState snapshot |
| `GET_HEALTH` | (internal / future) | Service health aggregation |
| `RESTART_SERVICES` | (internal) | Restart all registered services |
| `CONFIGURE_SYSTEM` | (stub) | Placeholder for runtime config updates |

### 6.2 Other interfaces

**Telegram bot commands** (`input_layer/telegram_bot.py`):

| Command | Behavior |
|---------|----------|
| `/start` | Welcome message, RTSP connectivity summary, command list, exposes chat ID |
| `/photo` | Async photo capture and `reply_photo` |
| `/clip5` | 5-second video capture and `reply_video` |
| `/clip20` | 20-second video capture and `reply_video` |
| `/status` | Service states and capture/motion counters |
| `/start_monitoring` | Enables motion detection pipeline |
| `/stop_monitoring` | Disables motion detection pipeline |

Non-command text messages are logged at debug level via `debug_message_handler`.

**CLI:** `uv run app.py` — starts the full application until SIGINT/SIGTERM.

**Test CLI:** `uv run pytest` with markers (`asyncio`, `integration`, `telegram`, `cache`, etc.) documented in `TESTS.md` and `pytest.ini`.

## 7. Data & persistence

- **Primary store:** Local filesystem only. Captured JPEG/MP4 files land under `cache/` (or `CACHE_DIR`). `CacheManager` tracks at most 10 files by default, deleting oldest by mtime when exceeded.
- **No database:** No SQL, KV, or vector index. System state (`SystemState` counters, service status enums) lives in process memory and is lost on restart.
- **Entities (in-memory):** `SystemState` tracks `monitoring_active`, per-service `ServiceStatus`, timestamps for last motion/photo/video, and cumulative totals.
- **Topology:** Edge-only. Raspberry Pi pulls RTSP from a LAN IP camera (often via port forwarding documented in README). Telegram cloud acts as the control and delivery channel for media and alerts. No cloud persistence layer in-repo.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`README.md`** — hardware layout, bot commands, env var template, `uv` install/run, system dependencies (FFmpeg, OpenCV). Note: README historically embeds example RTSP credentials; those were not copied into this summary.
2. **`TASK.md`** — layered architecture specification, design patterns (Command, Singleton, Observer, Factory, Strategy), directory plan, dependency flow diagram, phased migration checklist, future REST API mention.
3. **`TESTS.md`** — pytest structure, markers, FFmpeg prerequisite, mock-based testing strategy for Windows/dev machines without Pi hardware.
4. **`pyproject.toml`** — dependency versions, Python floor, hatchling build, black/flake8 config.
5. **`pytest.ini`** — asyncio mode, warning filters, test discovery rules.
6. **`infrastructure/system_config.py`** — authoritative env var catalog and validation rules.
7. **`input_layer/telegram_bot.py`** — command surface and async processing flow.
8. **`business_logic/command_manager.py`** — orchestration and state model.
9. **`services/rtsp_capture.py`** / **`services/rtsp_motion_sense.py`** — capture and motion algorithms.

**`.claude/` scan:** Not present in repository — no agent instruction trees to summarize.

**`.docs/` scan:** Not present — no hidden docs vault beyond root markdown files.

**`docs/` / ADR scan:** No `docs/` directory or ADR files found.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repository under `kodexArg`. This summary describes capabilities without publishing clone URLs or live credentials.
- **Auth model:** Telegram bot token authenticates outbound polling to Telegram servers. Inbound authorization is implicit (any user who can message the bot); optional `TELEGRAM_ALLOWED_USERS` exists in config schema but bot handlers do not consistently enforce it in the reviewed input layer.
- **Secrets handling:** `.env`, virtualenvs, and `cache/` contents are gitignored. README examples contain placeholder/example RTSP credentials — operators must rotate real camera passwords and never commit `.env`.
- **Media privacy:** Photos and videos transit through Telegram infrastructure when sent to chats; local cache files remain on the Pi until FIFO eviction.
- **Summary hygiene:** No tokens, passwords, PEM keys, or live connection strings appear in this document.

## 10. Operational picture

**Local development / Pi runtime**

```bash
uv sync                  # install dependencies
uv sync --extra dev      # include pytest toolchain
uv run app.py            # start bot (requires .env + FFmpeg + reachable RTSP)
uv run pytest            # run test suite
uv run pytest -m "not slow" -v   # faster subset
```

**System dependencies (on the Pi or dev machine):** FFmpeg binary on PATH; OpenCV available via pip wheel; network route to RTSP source; outbound HTTPS for Telegram API.

**Hardware constraints:** Tuned for Raspberry Pi 3+ — motion detection downscales frames (default 320×240), limits FPS, uses executor offloading, and FFmpeg `ultrafast` preset to reduce CPU load.

**Deployment:** Manual operator deployment on the Pi per README. No GitHub Actions, Wrangler, Docker, or systemd unit files in the repository tree.

**Graceful shutdown:** `app.py` registers SIGINT/SIGTERM handlers, awaits shutdown event, calls `CommandManager.shutdown()` to stop monitoring and services.

## 11. Open questions / unknowns

- **Migration completeness:** Root-level modules duplicate layered packages; unclear which import path is canonical at runtime without executing on hardware (both `app.py` layered imports and legacy files coexist).
- **Command result field naming:** `CommandManager._handle_capture_photo` returns `photo_path` in data while `TelegramBot._process_photo` expects `file_path` — possible integration bug affecting photo delivery unless an intermediate adapter exists outside reviewed paths.
- **RTSPCaptureService constructor:** `command_manager.py` passes `notifier=` keyword to `RTSPCaptureService`, but `services/rtsp_capture.py` `__init__` only accepts `config` — may indicate incomplete refactor or runtime import of a different module.
- **Allow-list enforcement:** `TELEGRAM_ALLOWED_USERS` is parsed in config but not visibly checked in Telegram handlers.
- **Motion clip saving:** `DETECTION_SAVE_CLIPS` and related config exist; automatic clip capture on motion may be partially implemented (callbacks notify, but dedicated clip persistence flow unclear from service skim).
- **CI/CD:** No automated build/test pipeline in repo; production update process unknown.
- **`.claude/` / `.docs/`:** Confirmed absent — no agent memory beyond `TASK.md` architecture notes.
