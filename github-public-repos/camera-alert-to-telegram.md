---
id: "camera-alert-to-telegram"
title: "Camera Alert to Telegram — IP camera motion detection with Telegram alerts"
visibility: public
importance: normal
source_repo: "camera-alert-to-telegram"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["python", "opencv", "telegram", "surveillance", "motion-detection", "rtsp", "raspberry-pi", "home-security", "asyncio"]
problems_solved:
  - "Operators cannot watch an IP camera feed continuously and need automated motion detection with timely remote notification."
  - "Motion events must be captured as shareable video clips without manual recording or third-party NVR software."
  - "Remote users need on-demand snapshots and short clips from the live stream without logging into the camera directly."
technologies:
  - "Python 3.x"
  - "OpenCV (opencv-python 4.9)"
  - "python-telegram-bot 20.7"
  - "Loguru"
  - "python-dotenv"
  - "asyncio"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Camera Alert to Telegram

> **Problem thesis (required):** A lightweight, self-hosted surveillance loop that ingests an RTSP IP camera stream, detects motion inside a configurable rectangular mask, records centered video clips, and pushes alerts to Telegram — including optional instant motion snapshots and interactive bot commands for photos and clips. Designed to run on constrained hardware (e.g. Raspberry Pi 3) without a full NVR stack.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/camera-alert-to-telegram` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Python asyncio app that watches an RTSP camera, detects motion with OpenCV, and sends video alerts and on-demand clips via a Telegram bot. |
| Audience | Home operators, hobbyists, and edge-device deployers who want DIY camera alerting without commercial cloud NVR subscriptions. |

## 2. Problems it solves

### P1 — Unattended motion awareness

- **Who hurts:** Property owners, small-site operators, or anyone with an IP camera who cannot monitor the feed 24/7.
- **Pain today:** Commercial NVRs add cost and complexity; raw RTSP streams require a human viewer; simple motion-email setups lack rich mobile UX.
- **How this repo answers:** Continuous background-subtraction motion detection (MOG2) runs over a user-defined mask region. Sustained motion crossing a frame-count threshold triggers an alert cycle: the rolling frame buffer is sliced into an MP4 clip centered on the first motion timestamp, saved locally, and sent to a configured Telegram chat. Optional instant JPEG snapshots fire on first motion with a cooldown to reduce spam.
- **Out of scope:** Multi-camera orchestration, cloud object storage, person/vehicle classification, PTZ control, web dashboard, or enterprise access control.

### P2 — Remote evidence on demand

- **Who hurts:** The same operator who received an alert but also wants ad-hoc verification ("show me now").
- **Pain today:** Logging into camera firmware or VPNing to a LAN viewer is slow on mobile.
- **How this repo answers:** When Telegram integration is enabled, a polling bot exposes `/photo`, `/clip5`, and `/clip20` commands that read from the in-memory rolling buffer and encode JPEG/MP4 on the fly, replying directly in the chat.
- **Out of scope:** Live streaming, two-way audio, or multi-user role-based bot permissions.

### P3 — Edge-friendly deployment

- **Who hurts:** Users deploying on Raspberry Pi or similar SBCs with limited CPU.
- **Pain today:** Heavy ML pipelines or high-FPS processing overwhelm small boards.
- **How this repo answers:** Configurable `fps` throttles processing rate; sensitivity and mask tune false positives; `slow_motion` stretches playback without re-encoding at higher frame rates; old clips are pruned when `max_video_files` is exceeded.
- **Out of scope:** GPU acceleration, distributed processing, or container orchestration manifests (none present in tree).

## 3. Product / idea

The repository is a **single-process Python application** (`app.py`) that combines three concerns in one asyncio runtime:

1. **Ingest** — `cv2.VideoCapture` opens the RTSP URL from configuration and reads frames at a controlled interval.
2. **Detect & buffer** — Each grayscale frame passes through a MOG2 background subtractor; contours inside the mask rectangle above a sensitivity area threshold count as motion. Frames land in a `deque` sized from FPS, clip length, and alert cooldown.
3. **Notify & interact** — When Telegram mode is on, the same process runs `python-telegram-bot` polling handlers alongside the capture loop. Alerts push MP4/JPEG media; commands pull from the shared buffer.

Configuration splits **secrets** (RTSP URL, bot token, chat ID in `.env`) from **tuning defaults** in `config.py`, overridable via CLI flags. The main loop reconnects on stream failure and attempts graceful shutdown on signals.

A separate utility script (`find-camera.py`) brute-forces common RTSP URL patterns against an IP range — useful during initial camera setup but not part of the runtime alert path.

### 3.1 North-star use cases

1. **Set-and-forget alerting** — Operator configures mask + sensitivity, enables Telegram, runs `python app.py`; sustained motion yields a clip in chat within the configured alert window.
2. **Motion snapshot mode** — With `motion_picture` enabled, first motion in a cooldown window sends a JPEG before the full clip workflow completes.
3. **On-demand check-in** — Operator sends `/photo` or `/clip5` from Telegram to verify the scene without waiting for motion.

### 3.2 Non-goals

- No HTTP REST API or web UI.
- No database or persistent event log beyond rotating file logs and local MP4/JPEG directories.
- No formal test suite or CI pipeline in the repository tree.
- The `notes/` directory is gitignored (scratch/lab code) and is not part of the shipped product surface.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.x | `requirements.txt`, shebang in `app.py` |
| Computer vision | OpenCV 4.9 (`opencv-python`), NumPy | `requirements.txt`, `app.py` |
| Messaging | python-telegram-bot 20.7 (async) | `requirements.txt`, `app.py` |
| Logging | Loguru (console + daily rotating files) | `requirements.txt`, `app.py` |
| Configuration | python-dotenv + argparse | `config.py`, `README.md` |
| Frontend | N/A | — |
| Backend / API | N/A (Telegram bot only) | `app.py` |
| Data | Local filesystem (`./videos`, `./motion_pictures`, `./logs`) | `config.py` |
| Infra / deploy | Manual `python app.py` on host (README cites Raspberry Pi 3) | `README.md` |
| AI / agents | None | — |
| Tests | None evident | — |

### 4.1 Notable dependencies (curated)

- `opencv-python` — RTSP capture, MOG2 background subtraction, contour detection, video encoding (tries multiple fourcc codecs).
- `python-telegram-bot` — Async bot polling, command handlers, media upload (`send_video`, `send_photo`, `reply_video`).
- `loguru` — Structured console and file logging with rotation/retention.
- `python-dotenv` — Loads `RTSP`, `TOKEN`, `CHAT_ID` from `.env` without hardcoding in source (runtime path).
- `httpx` / `httpcore` — Transitive HTTP stack for Telegram API calls.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `app.py` — Main surveillance + Telegram bot asyncio application.
  - `find-camera.py` — Standalone RTSP URL discovery helper (not imported by `app.py`).
- **Domain / core:**
  - `app.py` — Motion pipeline (`process_frame`, `detect_motion_in_mask`, `handle_motion_detection`), buffer management (`save_video`), Telegram command handlers.
  - `config.py` — `Config` class: defaults, env load, argparse parsing, mask and Telegram validation.
- **Adapters:**
  - OpenCV `VideoCapture` / `VideoWriter` — Camera and file I/O.
  - `telegram` package — Outbound alerts and inbound commands.
- **Docs vaults:**
  - `README.md` — Primary operator documentation (features, config table, bot commands).
  - No `docs/`, `.docs/`, ADR, or PRD directories present.
- **Agent scaffolding:**
  - No `.claude/`, `.agents/`, or skill trees present (scan attempted; directories absent).
- **Generated / vendor / ignored:**
  - `.venv/`, `__pycache__/`, `*.mp4`, `*.log` — gitignored; not summarized.
  - `notes/` — gitignored scratch area; existence noted only.
  - `logs/` — placeholder `logs_here`; runtime logs written as `logs/app_YYYY-MM-DD.log`.

## 6. Configuration & contracts (no secrets)

### Environment variables (`.env`)

| Name | Purpose |
|------|---------|
| `RTSP` | Camera RTSP stream URL (required unless passed via `--rtsp`) |
| `TOKEN` | Telegram bot API token (required when Telegram enabled) |
| `CHAT_ID` | Destination Telegram chat ID for alerts and media |

### CLI flags (from `config.py` / `README.md`)

| Flag | Default (code) | Purpose |
|------|----------------|---------|
| `--rtsp` | from env | Override camera URL |
| `--use-telegram` | `True` in code | Enable bot integration |
| `--video-seconds` | `20` | Clip duration (min 4) |
| `--detection-seconds` | `2` | Motion persistence threshold |
| `--secs-between-alerts` | `21` | Cooldown between alert cycles (auto-clamped ≥ video length + 1) |
| `--sensitivity` | `3000` | Contour area threshold inside mask |
| `--show-video` | `False` | Local OpenCV preview window |
| `--log-level` | `DEBUG` | Console verbosity |
| `--mask` | four ints | Detection rectangle `x1 y1 x2 y2` |
| `--fps` | `5` | Processing frame rate |
| `--min-motion-frames` | `2` | Consecutive motion frames before alert |
| `--slow-motion` | `0.75` | Playback speed factor for saved MP4 |
| `--motion-picture` | `True` | JPEG on first motion |
| `--motion-picture-cooldown-secs` | `5` | Snapshot spam guard |
| `--video-directory` | `./videos` | MP4 output folder |
| `--motion-pictures-directory` | `./motion_pictures` | JPEG staging folder |

### Storage paths

- `./videos/` — Motion and on-demand clips (`motion_*`, `clip_*` prefixes).
- `./motion_pictures/` — Temporary JPEGs; cleaned after video alert sent.
- `./logs/` — Daily rotated application logs (7-day retention).

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP server**. All external interaction is via the **Telegram Bot API** (outbound from the host).

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| N/A | N/A | No first-party HTTP routes | — |

Telegram long-polling is used (`start_polling`); there is no webhook endpoint in-tree.

### 6.2 Other interfaces

**Telegram bot commands** (registered in `app.py`):

| Command | Behavior |
|---------|----------|
| `/start` | Welcome message; echoes caller chat ID for setup |
| `/photo` | JPEG from latest buffered frame |
| `/clip5` | 5-second MP4 from rolling buffer |
| `/clip20` | 20-second MP4 from rolling buffer |

**Automatic outbound messages** (when motion/alert logic fires):

- Startup confirmation text.
- Motion JPEG with caption (optional).
- Motion-centered MP4 video.
- Critical error text on processing failures.

**CLI:**

- `python app.py` [flags] — primary run mode.
- `python find-camera.py` — RTSP URL probe utility (standalone).

**Signals:** `SIGINT` / `SIGTERM` trigger async cleanup (stop polling, release capture, destroy windows).

## 7. Data & persistence

- **Stores:** Local filesystem only — no SQL, KV, or cloud object bindings.
- **Entities / artifacts:**
  - Timestamped MP4 clips in `video_directory` (FIFO capped by `max_video_files`, default 20).
  - Ephemeral JPEG motion pictures in `motion_pictures_directory`.
  - Rotating text logs under `logs/`.
- **In-memory:** `deque` of `(timestamp, frame)` tuples sized from FPS × (clip length + alert spacing + buffer slack).
- **Topology:** Single edge host (e.g. Raspberry Pi on LAN) pulls RTSP from camera, pushes media outbound to Telegram cloud; no multi-node sync.

## 8. Docs & agent memory (required scan)

| Source | Finding |
|--------|---------|
| `README.md` | Primary documentation: features, quick start, `.env` shape, full config table, bot commands, dependency list. Tested on Raspberry Pi 3. |
| `docs/**` | **Not present.** |
| `.docs/**` | **Not present.** |
| ADR / PRD / constitution | **Not present.** |
| `.claude/**` | **Not present** — scan attempted; no agent instruction tree in repository. |
| `.vscode/settings.json` | Empty object `{}`; no workspace conventions encoded. |
| `notes/` | **Gitignored** — not read per gitignore rules; presumed scratch/lab scripts. |

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; operators must supply their own `.env` secrets locally (gitignored).
- **Auth model:** Telegram bot token authenticates outbound API calls; no end-user auth layer beyond Telegram's chat targeting (`CHAT_ID`).
- **Sensitive data hygiene:** Runtime secrets belong in `.env` only. The helper `find-camera.py` contains **hardcoded placeholder credentials and LAN IP literals** in source — a security smell if real values were ever committed; operators should treat it as a local diagnostic tool and rotate camera credentials if exposed.
- **This summary contains no secrets**, private keys, connection strings with passwords, or `.env` contents.

## 10. Operational picture

**Local development / production run:**

```bash
pip install -r requirements.txt
# create .env with RTSP, TOKEN, CHAT_ID
python app.py --use-telegram
```

On Raspberry Pi, README suggests `python3 app.py`. Optional `--show-video` for local debugging with OpenCV window (press `q` to quit loop).

**Deployment:** No GitHub Actions, Dockerfile, or systemd unit in tree — manual long-running process on edge host. Process auto-retries RTSP connection every 15 seconds on failure; critical errors sleep 20 seconds before restart attempt.

**Hardware constraints:** README explicitly targets Raspberry Pi 3; `fps` default of 5 reflects CPU budget. OpenCV codec fallback loop (`mp4v`, `avc1`, `H264`, `XVID`) accommodates platform encoder availability.

**Logging:** Console at configured level; files at DEBUG with daily rotation and 7-day retention under `logs/`.

## 11. Open questions / unknowns

- Whether `find-camera.py` credentials are placeholders or were ever real — file should be audited before any public fork reuse.
- Default `use_telegram=True` in `config.py` vs README stating default `False` — code default wins at argparse `store_true` with `default=True` (Telegram on unless changed); README may be stale.
- No CI, linting, or automated tests — quality and regression safety unknown.
- No pinned Python minor version (`.python-version` absent).
- `notes/` content and purpose unknown (gitignored).
- No container or process-manager recipes for production hardening (restart policies, resource limits).
