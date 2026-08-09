---
id: "kdx-pi-cam"
title: "kdx-pi-cam — async Telegram bot for RTSP camera motion alerts"
visibility: public
importance: normal
source_repo: "kdx-pi-cam"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags:
  - "python"
  - "telegram-bot"
  - "rtsp"
  - "opencv"
  - "ffmpeg"
  - "motion-detection"
  - "raspberry-pi"
  - "iot"
  - "surveillance"
  - "asyncio"
  - "pydantic"
  - "uv"
  - "pytest"
  - "edge-compute"
problems_solved:
  - "Operators with IP cameras exposing RTSP streams need lightweight, phone-accessible motion alerts without subscribing to a commercial NVR, cloud CCTV SaaS, or running a full desktop surveillance suite on a Pi or small Linux host."
  - "Home and small-site monitoring workflows break when motion notifications require constant desktop apps or proprietary mobile clients — a Telegram bot provides push alerts and on-demand snapshots from any chat-capable device."
  - "Single-camera edge deployments on constrained hardware need non-blocking I/O, bounded disk use for temporary clips, and configurable quiet hours / cooldowns so motion spam does not overwhelm the operator."
technologies:
  - "Python 3.11+"
  - "python-telegram-bot 20+"
  - "OpenCV (opencv-python 4.8+)"
  - "FFmpeg (ffmpeg-python + system ffmpeg)"
  - "NumPy"
  - "Pillow"
  - "Pydantic 2 + pydantic-settings"
  - "psutil"
  - "uv (package manager)"
  - "pytest / pytest-asyncio"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# kdx-pi-cam

> **Problem thesis (required):** kodexArg needs a **single-camera, edge-deployable surveillance notifier** that connects to one RTSP stream, buffers recent frames, detects motion via classical computer vision (frame differencing), and pushes short video clips or photos to a designated Telegram chat on demand or on trigger. The operator controls monitoring with simple bot commands (`/start`, `/stop`, `/stream`, `/clip5`, `/status`) from a phone — no web dashboard, no multi-tenant cloud, no NVR UI. The stack targets Raspberry Pi–class hardware: async capture loop, CPU throttling when load exceeds 80%, rotating log files, and a size-bounded local cache for generated media.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/kdx-pi-cam` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Async Python Telegram bot that monitors one RTSP camera, detects motion, and sends clips/photos to a configured chat. |
| Audience | Home/small-site operators with IP cameras; kodexArg maintainers running Pi-edge IoT tooling; developers extending motion-detection or Telegram command handlers; AI agents reading `AI.md` (aspirational architecture notes). |

## 2. Problems it solves

### P1 — No affordable push notifications from a single RTSP camera

- **Who hurts:** Operators with one IP camera (door, grow room, garage) who want motion alerts on their phone without paying for cloud NVR subscriptions or running Blue Iris / ZoneMinder on a full PC.
- **Pain today:** RTSP streams are viewable in VLC or vendor apps but do not push alerts; DIY scripts are fragile; commercial solutions bundle multi-camera licensing and cloud lock-in.
- **How this repo answers:** `VideoProcessor` opens the configured `RTSP_URL` via OpenCV, maintains a circular frame buffer sized from `VIDEO_BUFFER_SECONDS` (assumes ~10 FPS), and `MotionDetector` compares consecutive frames with grayscale absolute difference, thresholding, and contour area checks. On motion, `BotHandler._monitor_motion` generates a 5-second MP4 via FFmpeg and sends it through the Telegram Bot API. Cooldown (`NOTIFICATION_COOLDOWN_SECONDS`) and quiet hours (`NOTIFICATION_QUIET_HOURS_START` / `END`) reduce notification spam.
- **Out of scope:** Multi-camera orchestration, cloud video storage, person/vehicle ML classification, ONVIF discovery, web live-view UI, DVR playback timeline.

### P2 — Telegram as the control plane for edge camera ops

- **Who hurts:** Operators who already use Telegram daily and want start/stop monitoring and on-demand snapshots without SSH or a separate mobile app.
- **Pain today:** SSH + `ffmpeg` one-liners are not phone-friendly; vendor apps are siloed per camera brand; scripting Telegram sends requires boilerplate for polling, handlers, and media upload.
- **How this repo answers:** `BotHandler` registers command handlers on a `python-telegram-bot` `Application`: `/start` begins RTSP capture and background motion loop; `/stop` cancels monitoring; `/stream` and `/photo` send the latest buffered frame as a JPEG; `/clip5` sends a 5-second clip; `/status` reports monitoring state, RTSP connectivity, and buffer depth. The bot runs polling in a dedicated thread while `main.py` keeps the asyncio event loop alive for cache cleanup.
- **Out of scope:** Inline keyboards, multi-user ACL, group-chat role management, webhook mode behind reverse proxy (only polling is implemented).

### P3 — Bounded resource use on small Linux / Pi hosts

- **Who hurts:** Edge operators running 24/7 capture on hardware with limited CPU, RAM, and SD-card wear concerns.
- **Pain today:** Naive OpenCV loops peg CPU; unbounded temp video files fill disk; duplicate bot instances fight for the same Telegram token and RTSP connection.
- **How this repo answers:** Capture loop throttles to ~10 FPS (`asyncio.sleep(0.1)`), backs off on read failures (5 s retry), and slows further when `psutil.cpu_percent()` exceeds 80%. `CacheManager` enforces `CACHE_MAX_SIZE_MB` by deleting oldest files in `CACHE_DIR` on a periodic interval. `main.py` writes a `bot.pid` file and refuses to start if another instance is alive. Rotating file logs via `logging.handlers.RotatingFileHandler` when `LOG_TO_FILE` is enabled.
- **Out of scope:** GPU/NPU acceleration, hardware H.264 encode on Pi OMX, distributed scaling, Kubernetes deployment manifests.

## 3. Product / idea

The mental model is a **long-running single-process edge agent**: one RTSP input, one Telegram output, one chat destination. There is no HTTP server, database, or message bus in the shipped code.

```
[Telegram Bot API] <--> [bot_handler.py]  (/start, /stop, /stream, /photo, /clip5, /status)
                              |
                              v
[config.py] --> [video_processor.py]  (OpenCV RTSP capture, circular buffer, FFmpeg clip export)
                              |
                              v
[motion_detector.py]  (frame diff → threshold → contour area)
                              |
                              v
[cache_manager.py]  (temp clips/photos, size-limited cleanup)
                              |
                              v
[Telegram send_video / send_photo / send_message]
```

`main.py` is the CLI entry (`kdx-pi-cam` script alias in `pyproject.toml`). It sets up logging, enforces single-instance via PID file, starts `CacheManager` background cleanup, spawns `BotHandler` polling in a thread, and blocks on `asyncio.sleep(inf)`.

`BotHandler` owns the lifecycle: on `/start`, it sets `monitoring = True`, calls `video_processor.start_capture()`, and launches `_monitor_motion` as an asyncio task that polls every second. Motion triggers clip generation and `send_video`; quiet hours skip sends but still log. RTSP connection failures invoke an optional `error_callback` that posts a warning message to the chat after three consecutive failures.

### 3.1 North-star use cases

1. **Passive motion alerting** — Operator sends `/start` once; bot runs indefinitely; motion sends 5 s clips to the configured chat during active hours.
2. **On-demand snapshot** — Operator sends `/stream` or `/photo` while monitoring is active to receive the latest buffered frame.
3. **Manual clip pull** — Operator sends `/clip5` to receive the last five seconds of buffered video without waiting for motion.
4. **Operator health check** — `/status` confirms whether monitoring is running, RTSP is connected, and how many frames are buffered.

### 3.2 Non-goals

- Multi-camera or multi-tenant operation (single `RTSP_URL`, single `CHAT_ID`).
- Cloud storage backends — `STORAGE_BACKEND` accepts `s3` / `azure` / `gcp` in config schema but only local disk is implemented.
- Event-sourced layered architecture described in `AI.md` (handlers/, core/, services/, infrastructure/) — **not present in the current tree**; see §11.
- Webhook-based Telegram deployment, REST API for third-party integrations, or browser live view.

## 4. Technology stack

Derived from `pyproject.toml`, `README.md`, and module imports. Lockfile (`uv.lock`) present for reproducible installs; not summarized here.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python ≥ 3.11 | `pyproject.toml` `requires-python` |
| Package manager | uv | `pyproject.toml` `[tool.uv]`, `uv.lock`, `README.md` install steps |
| Bot / messaging | python-telegram-bot ≥ 20 (async) | `pyproject.toml`, `bot_handler.py` |
| Video capture | OpenCV `VideoCapture` on RTSP | `video_processor.py` |
| Clip encoding | FFmpeg via `ffmpeg-python` (libx264) | `video_processor.py` `generate_clip` |
| Motion CV | OpenCV absdiff, threshold, contours | `motion_detector.py` |
| Image export | Pillow (JPEG from frame) | `motion_detector.py` `generate_photo` |
| Config validation | Pydantic v2 + pydantic-settings | `config.py` `AppConfig` |
| System metrics | psutil (CPU throttle) | `video_processor.py` |
| Env loading | python-dotenv (via pydantic-settings `.env`) | `config.py` `model_config` |
| Tests | pytest, pytest-asyncio, pytest-cov (dev) | `pyproject.toml`, `tests/` |
| Build | hatchling | `pyproject.toml` `[build-system]` |

### 4.1 Notable dependencies (curated)

- `python-telegram-bot` — async Telegram Bot API client; command handlers and media upload for clips/photos.
- `opencv-python` — RTSP frame capture, grayscale diff, contour detection; assumed ~10 FPS throttle in capture loop.
- `ffmpeg-python` — pipes raw BGR frames to FFmpeg for H.264 MP4 clips (requires system `ffmpeg` binary).
- `pydantic-settings` — loads and validates all env vars into `AppConfig`; fails fast on missing required keys.
- `psutil` — CPU monitoring to reduce capture rate under load (>80% warning threshold).

## 5. Repository map (abstraction)

Flat Python package at repo root (no `src/` layout, no package subdirectories beyond `tests/` and `docs/`).

- **Entrypoints:** `main.py` (`asyncio.run(main)`), CLI script `kdx-pi-cam` → `main:main` in `pyproject.toml`.
- **Domain / core logic:**
  - `video_processor.py` — `VideoProcessor`: RTSP connect/reconnect, circular `frame_buffer`, `generate_clip`, `capture_photo`.
  - `motion_detector.py` — `MotionDetector`: `detect`, `detect_in_buffer` with cooldown, photo/clip helpers.
  - `bot_handler.py` — `BotHandler`: command handlers, motion monitoring task, Telegram application setup.
- **Adapters / infrastructure:**
  - `config.py` — `AppConfig`, `load_config`, `get_config`, `ConfigError`.
  - `cache_manager.py` — `CacheManager`: directory creation, periodic oldest-first eviction, global singleton `get_cache_manager`.
- **Docs vaults:**
  - `README.md` — install, usage, architecture ASCII diagram, troubleshooting.
  - `docs/api_reference.md` — module/class/method index (partial; does not list all commands).
  - `AI.md` — extensive Spanish architecture specification for a **planned** layered design (see §8).
- **Agent scaffolding:**
  - `.kilocode/mcp.json` — empty MCP server map (`{"mcpServers":{}}`).
  - No `.claude/` or `.docs/` directories in the cloned tree.
- **Tests:** `tests/test_bot_handler.py`, `tests/test_config.py`, `tests/test_motion_detector.py`, `tests/test_video_processor.py`.
- **Generated / vendor / ignored at runtime:** `cache/` (gitignored), `bot.pid`, `*.mp4` and other video extensions per `.gitignore`, `.env` (secrets).

## 6. Configuration & contracts (no secrets)

All settings load from environment variables (and optional `.env` file) into `AppConfig` (`config.py`). Names and purposes below; **never paste real values**.

### Core (required)

| Variable | Purpose |
|----------|---------|
| `RTSP_URL` | RTSP stream endpoint for the IP camera |
| `BOT_TOKEN` | Telegram bot token from BotFather |
| `CHAT_ID` | Default Telegram chat for notifications (bot also learns chat from `/start` sender) |

### Motion detection

| Variable | Purpose |
|----------|---------|
| `MOTION_THRESHOLD` | Pixel difference threshold for binarization (default 30 in `.env.example`) |
| `MOTION_SENSITIVITY` | Documented 0.0–1.0 sensitivity — **loaded in config but not referenced in `motion_detector.py`** |
| `MOTION_MIN_AREA` | Minimum contour area (pixels) to count as motion |

### Cache & storage

| Variable | Purpose |
|----------|---------|
| `CACHE_DIR` | Base directory for temp clips, photos, logs subdirectory |
| `CACHE_MAX_SIZE_MB` | Max cache size before oldest-file eviction |
| `CACHE_COMPRESSION_ENABLED` | Flag in schema — **compression not implemented in `cache_manager.py`** |
| `CACHE_CLEANUP_INTERVAL` | Seconds between cleanup sweeps |
| `STORAGE_BACKEND` | `local` (only implemented); `s3`/`azure`/`gcp` are placeholders |

### Video

| Variable | Purpose |
|----------|---------|
| `VIDEO_BUFFER_SECONDS` | Buffer duration; buffer size = seconds × 10 (assumed FPS) |
| `VIDEO_MAX_DURATION` | Cap on generated clip length |
| `VIDEO_QUALITY` | `low` / `medium` / `high` — **not consumed in `video_processor.py`** |

### Notifications

| Variable | Purpose |
|----------|---------|
| `NOTIFICATION_COOLDOWN_SECONDS` | Minimum seconds between motion notifications |
| `NOTIFICATION_QUIET_HOURS_START` | Quiet window start hour (24h) |
| `NOTIFICATION_QUIET_HOURS_END` | Quiet window end hour (supports overnight wrap) |

### Logging

| Variable | Purpose |
|----------|---------|
| `LOG_LEVEL` | DEBUG / INFO / WARNING / ERROR |
| `LOG_TO_FILE` | Enable file logging |
| `LOG_FILE_PATH` | Log file path (default under cache logs dir) |
| `LOG_ROTATION_ENABLED` | Rotating file handler on/off |
| `LOG_MAX_FILE_SIZE_MB` | Rotation size threshold |
| `LOG_BACKUP_COUNT` | Rotated backup file count |

### 6.1 HTTP / API endpoints (when applicable)

**No HTTP server is exposed.** This application is a Telegram long-polling client only. There is no REST, WebSocket, or OpenAPI surface in the repository.

Telegram command contract (inbound via Bot API polling):

| Command | Purpose | Preconditions |
|---------|---------|---------------|
| `/start` | Begin RTSP capture and motion monitoring loop | — |
| `/stop` | Halt monitoring and release capture | Monitoring active |
| `/stream` | Send latest frame as photo | Monitoring active |
| `/photo` | Alias for `/stream` | Monitoring active |
| `/clip5` | Send 5-second video clip from buffer | Monitoring active |
| `/status` | Report monitoring flag, RTSP connected, buffer length | — |

Outbound: `send_message`, `send_photo`, `send_video` to the active chat; motion alerts use `send_video` with caption "Motion detected!" or fallback `send_message`.

### 6.2 Other interfaces

- **CLI:** `uv run python main.py` or `uv run kdx-pi-cam` after `uv sync` and `.env` configuration (`README.md`).
- **PID file:** `bot.pid` in working directory for single-instance guard.
- **MCP:** `.kilocode/mcp.json` present but empty — no MCP tools defined.

## 7. Data & persistence

- **No database.** All state is in-process: frame buffer (NumPy arrays in memory), monitoring flags on `BotHandler`, motion cooldown timestamp on `MotionDetector`.
- **Ephemeral files:** Generated `.mp4` clips and `.jpg` photos written under `CACHE_DIR` via `tempfile.NamedTemporaryFile`; many are deleted immediately after Telegram upload (`os.remove` in command handlers). Cache manager evicts oldest files when total size exceeds `CACHE_MAX_SIZE_MB`.
- **Logs:** Optional rotating text logs at `LOG_FILE_PATH` (under `cache/logs/` by default).
- **Topology:** Single edge node pulls RTSP from LAN camera, pushes media outbound to Telegram cloud API. No local web UI, no edge-to-cloud object store in current implementation.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **`README.md`** — Features list, install (`uv sync`, `.env`), commands, ASCII architecture, troubleshooting (RTSP, threshold, token, CPU/FFmpeg), tech stack, MIT license, contribution guidelines (PEP 8, type hints, tests).
2. **`docs/api_reference.md`** — Per-module API index for `AppConfig`, `VideoProcessor`, `MotionDetector`, `BotHandler`, `main`; omits `/photo`, `/clip5`, `/status` commands present in code.
3. **`AI.md`** — Large Spanish document describing an **aspirational layered architecture** (`app.py`, `handlers/`, `core/`, `services/`, `infrastructure/`, event bus, `Notifier`, Strategy-pattern storage backends, integrated `video_stream_service`). **This structure does not exist in the current repository** — the live code is a flat six-module layout. Treat `AI.md` as design intent / future refactor guide, not as accurate tree documentation.
4. **`.kilocode/mcp.json`** — Empty MCP configuration; no agent rules.
5. **`.claude/`** — **Not present** in clone (scanned; directory absent).
6. **`.docs/`** — **Not present** in clone (scanned; directory absent).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; summary contains no clone URLs, tokens, or live credentials.
- **Secrets surface:** `BOT_TOKEN`, `RTSP_URL` (often embeds camera credentials), and `CHAT_ID` must live in `.env` (gitignored). `main.py` logs only the last 10 characters of the bot token at startup. `VideoProcessor._mask_url` redacts RTSP user/password in log lines.
- **Auth model:** Telegram Bot API token authenticates outbound API calls. Inbound commands are accepted from any Telegram user who can message the bot — **no allowlist or chat-ID verification** beyond storing `effective_chat.id` on `/start`. Any user triggering `/start` could receive monitoring responses on their chat.
- **Network exposure:** Outbound HTTPS to Telegram; inbound RTSP from camera (typically LAN). No listening ports opened by the app.
- **This summary contains no secrets, private keys, connection strings with passwords, or `.env` contents.**

## 10. Operational picture

### Local development

1. `uv sync` — install dependencies from `pyproject.toml` / `uv.lock`.
2. Copy `.env.example` → `.env` and set `RTSP_URL`, `BOT_TOKEN`, `CHAT_ID` plus optional tuning vars.
3. Ensure system **FFmpeg** is installed (required for `generate_clip`).
4. `uv run python main.py` or `uv run kdx-pi-cam`.
5. Message the bot in Telegram: `/start` to begin monitoring.

### Testing

- `uv run pytest` (dev deps: pytest, pytest-asyncio, pytest-cov per `pyproject.toml`).
- Tests mock config and Telegram/update objects; env fixture in `test_bot_handler.py` sets full `AppConfig` field set.

### Deployment

- **No `.github/workflows/`** or other CI/CD manifests in the cloned tree — deployment is manual on target host (likely Raspberry Pi or small Linux server per repo naming and kodexArg Pi tooling context).
- Process expects long-running foreground or process-manager wrapper (systemd unit not included in repo).
- Hardware constraints: continuous OpenCV decode + motion loop; README warns about CPU and recommends FFmpeg; `psutil` throttle at 80% CPU.

### Runtime artifacts

- `bot.pid` — single-instance lock (stale PID removed if process dead).
- `cache/` — gitignored working directory for media temps and logs.

## 11. Open questions / unknowns

- **`AI.md` vs reality:** The layered architecture (`handlers/`, `core/`, `services/`, `infrastructure/`, `app.py`, event bus, `Notifier`) is documented extensively but **not implemented** in `main` branch. Unknown whether refactor is planned or `AI.md` is stale aspirational spec.
- **Unused config fields:** `MOTION_SENSITIVITY`, `VIDEO_QUALITY`, `CACHE_COMPRESSION_ENABLED`, and non-`local` `STORAGE_BACKEND` values are defined in `AppConfig` / `.env.example` but have no effect in current modules.
- **Sensitivity / quality tuning:** Operators can only practically tune `MOTION_THRESHOLD` and `MOTION_MIN_AREA` today.
- **Telegram authZ:** No enforcement that commands come from `CHAT_ID` env var — security model for multi-user bots is undefined.
- **Default branch description:** GitHub repo description was empty at scan time.
- **Production deployment:** No systemd unit, Docker image, or GitHub Actions workflow found — operator packaging unknown.
- **`.claude/` / `.docs/`:** Directories absent; no hidden agent instruction vault beyond `AI.md` and empty `.kilocode/`.
