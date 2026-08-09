---
id: "kdx-pi-signage-2"
title: "KDX Pi Signage 2 — headless Raspberry Pi digital signage from Google Drive"
visibility: public
importance: normal
source_repo: "kdx-pi-signage-2"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags: ["python", "raspberry-pi", "digital-signage", "vlc", "google-drive", "hexagonal-architecture", "uv", "headless", "video-playback", "iot"]
problems_solved:
  - "Operators need unattended, always-on advertising video loops on a TV connected to a Raspberry Pi Lite (no desktop) without manual USB swaps or SSH intervention."
  - "Marketing or facilities teams update a shared cloud folder of videos and expect every Pi player to pick up additions, edits, and removals automatically without stopping playback."
  - "Developers need one codebase that runs on the Pi in production and on a Windows workstation for VLC and playback testing before deployment."
technologies:
  - "Python 3.8+"
  - "uv (package manager and runner)"
  - "python-vlc"
  - "Google Drive API client stack (google-api-python-client, google-auth)"
  - "Pydantic / pydantic-settings"
  - "tenacity (retry logic, declared)"
  - "yt-dlp (optional YouTube bonus)"
  - "pytest / ruff / black / mypy (dev)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# KDX Pi Signage 2

> **Problem thesis (required):** A multiplatform Python service that keeps a monitor fed with cyclically played advertising videos on a Raspberry Pi Lite (no desktop environment), synchronized from a remotely managed Google Drive folder, with continuous playback, background cache updates, structured audit logs, and graceful recovery from network or transfer failures — runnable anywhere via `uv run main.py`.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/kdx-pi-signage-2` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Headless digital-signage daemon that syncs video assets from Google Drive and plays them fullscreen via VLC on Raspberry Pi or Windows. |
| Audience | Operators running Pi-based TV signage; KDX developers maintaining playback and sync logic; future integrators who may call a planned minimal HTTP control API. |

## 2. Problems it solves

### P1 — Unattended signage on a headless Raspberry Pi

- **Who hurts:** Facilities or retail operators who mount a TV on a Raspberry Pi Lite without a desktop environment and cannot babysit playback.
- **Pain today:** Manual USB swaps, brittle cron jobs, or desktop-based players that break on reboot and offer no audit trail of what aired.
- **How this repo answers:** `main.py` boots an `Application` that wires `PlaybackService` to a `VLCPlayer` adapter configured for fullscreen, title-less, mouse-hidden headless output. A dedicated playback thread loops through a `Playlist`, waits on VLC state transitions (Opening → Playing → Ended), logs each start and completion, and moves to the next video without operator input. Signal handlers (`SIGTERM`, `SIGINT`) enable graceful shutdown suitable for systemd-style service deployment.
- **Out of scope:** Remote fleet management UI, multi-screen orchestration, transcoding, or content authoring.

### P2 — Cloud-managed playlist with local resilience

- **Who hurts:** Teams that curate videos in Google Drive and expect every Pi to mirror changes (new files, updates, deletions) without downtime.
- **Pain today:** Stale local copies, orphaned files after remote deletion, and sync jobs that block or interrupt the visible loop.
- **How this repo answers:** Architecture separates `VideoRepository` (sync) from `VideoPlayer` (display). `PlaybackService` runs sync on a background daemon thread at `SYNC_INTERVAL` seconds while playback continues on another thread. `GoogleDriveRepository` sketches delta sync: compare remote listing to local metadata under `cache/metadata/`, download new/changed assets into `videos/`, delete locals whose Drive IDs disappeared, and persist SHA-256 checksums per file. `tenacity` is declared for retry semantics on transient network failures.
- **Out of scope:** Real-time push webhooks from Drive (polling interval model only); DRM or encrypted streams.

### P3 — Cross-platform development before Pi deployment

- **Who hurts:** Developers who need to validate VLC bindings and video discovery on Windows before shipping to Linux ARM hardware.
- **Pain today:** Pi-only toolchains slow iteration; VLC path and plugin discovery differ wildly across OSes.
- **How this repo answers:** `infrastructure.py` auto-detects VLC install locations on Windows and Linux (with `VLC_DIR` override). When `GOOGLE_DRIVE_SYNC_ENABLED` is false, `main.py` falls back to a `LocalVideoRepository` scanning `test_videos/` (or `VIDEOS_DIR`) for `.mp4`, `.avi`, `.mov`, `.mkv`, `.webm`. `test_vlc.py` provides a six-step manual harness (import, instance, media player, file detection, load, short playback). `uv sync` standardizes dependency install on any host.
- **Out of scope:** Packaging as a PyPI library for third parties; containerized deployment manifests.

## 3. Product / idea

KDX Pi Signage 2 is a long-running Python process structured as a simplified hexagonal (ports-and-adapters) application. The **domain** (`app/core.py`) models `Video` entities (id, name, path, size, modified time, checksum, optional `drive_id`) and a `Playlist` with sequential or shuffle `get_next_video()`. The **application layer** (`app/application.py`) exposes `PlaybackService`, which owns cache directory initialization, playlist loading, a periodic sync loop, and a playback loop that delegates to the `VideoPlayer` port. The **infrastructure layer** (`app/infrastructure.py`) supplies `GoogleDriveRepository` and `VLCPlayer` concrete adapters behind interfaces in `app/interfaces.py`.

At runtime the mental model is: **one folder in the cloud is the source of truth → a local `videos/` mirror plus `cache/metadata/` sidecar JSON → VLC renders fullscreen on the attached display → logs under `logs/YYYY/MM/DD.log` record every sync and play event.** The entrypoint `main.py` performs dependency injection: read env config, choose Drive vs local repository, construct `PlaybackService`, start threads, and block the main thread (`signal.pause()` on Unix, sleep loop on Windows).

Documentation in `docs/` (Spanish prose) expands the intended production behavior: checksum-based delta sync, thread-safe queues, exponential backoff, and a future humble HTTP API for `curl`-driven operator commands — explicitly marked as not yet implemented.

### 3.1 North-star use cases

1. **Production Pi loop:** Operator sets `GOOGLE_DRIVE_SYNC_ENABLED=true`, provides Drive folder ID and service-account credentials path, runs `uv run main.py` as a service; TV plays an endless rotating playlist while background sync refreshes files every 30 seconds.
2. **Local dev / QA:** Developer drops sample clips into `test_videos/`, leaves sync disabled, runs `uv run main.py` or `python test_vlc.py` to validate VLC integration on Windows or Linux.
3. **Future operator control:** Planned minimal HTTP API (dependencies may be added later) to trigger skip, pause, or status queries without SSH — documented as in-progress empty surface.

### 3.2 Non-goals

- No FastAPI or HTTP server in the current tree (docs forbid implementing it yet).
- No desktop GUI or browser-based player — VLC direct-to-display only.
- No YouTube streaming in core path (optional `yt-dlp` extra reserved for future download-to-local workflow).
- Minimal inline code comments by project convention; narrative lives in `docs/` and README.
- No committed video binaries — `videos/`, `test_videos/`, and `cache/` contents are gitignored; only `.gitkeep` placeholders ship.

## 4. Technology stack

Derived from `pyproject.toml`, `uv.lock` (versions signal only), and `docs/03-technical-specifications.md`.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python ≥ 3.8 | `pyproject.toml` `requires-python` |
| Package manager | uv (`uv sync`, `uv run`) | `README.md`, `pyproject.toml`, `uv.lock` |
| Multimedia | VLC via `python-vlc` ≥ 3.0 | `pyproject.toml`, `app/infrastructure.py` `VLCPlayer` |
| Cloud sync | Google Drive API (google-api-python-client, google-auth, oauthlib, httplib2) | `pyproject.toml`, `GoogleDriveRepository` |
| Config / validation | pydantic ≥ 2, pydantic-settings ≥ 2 | `pyproject.toml` |
| Resilience | tenacity ≥ 8 | `pyproject.toml` |
| Async I/O | aiofiles ≥ 23 (declared; sync threading used in app code today) | `pyproject.toml` |
| Optional YouTube | yt-dlp ≥ 2023 (`[project.optional-dependencies] youtube`) | `pyproject.toml`, `README.md` |
| Dev / quality | pytest, pytest-asyncio, black, isort, mypy, ruff | `pyproject.toml` `[project.optional-dependencies] dev` |
| Build | hatchling | `pyproject.toml` `[build-system]` |
| Data | Local filesystem only (no database) | `app/application.py`, `docs/03-technical-specifications.md` |
| Infra / deploy | Manual / systemd on Pi; no CI workflows in repo | tree scan (no `.github/`) |
| AI / agents | None — no `.claude/`, `.agents/`, or skill trees present | tree scan |
| Tests | Manual `test_vlc.py` harness; pytest declared but no `tests/` package | `test_vlc.py`, `pyproject.toml` |

### 4.1 Notable dependencies (curated)

- `python-vlc` — binds to system VLC for headless fullscreen playback; core runtime dependency.
- `google-api-python-client` + `google-auth` — intended Drive folder listing, download, and credential handling for `GoogleDriveRepository`.
- `pydantic-settings` — aligns with env-driven configuration pattern documented in README and `[tool.kdx_pi_signage]`.
- `tenacity` — declared for exponential retry on network and transfer errors per technical specs.
- `aiofiles` — declared for potential async file operations during sync (not yet wired in application code).
- `yt-dlp` — optional extra for future YouTube-to-local ingestion bonus task described in `docs/01-project-overview.md`.

## 5. Repository map (abstraction)

Describe zones, not every file:

- **Entrypoints:** `main.py` — `Application` class, logging setup, config load, repository selection, service start, signal handling, `main()` CLI entry. Declared script `kdx-pi-signage` points at `kdx_pi_signage_2.main:main` though sources live at repo root (packaging layout partially scaffolded).
- **Domain / core:** `app/core.py` — `Video`, `Playlist` dataclasses and playlist navigation (sequential index or shuffle).
- **Application / use cases:** `app/application.py` — `PlaybackService` with `_sync_videos`, `_playback_loop`, thread lifecycle, `get_status()` dict.
- **Ports:** `app/interfaces.py` — abstract `VideoRepository`, `VideoPlayer`, `Logger`.
- **Adapters:** `app/infrastructure.py` — `GoogleDriveRepository` (sync skeleton with TODO markers), `VLCPlayer` (functional), cross-platform `_get_vlc_paths()` / `_configure_vlc_paths()`.
- **Package barrel:** `app/__init__.py` re-exports public types.
- **Manual test harness:** `test_vlc.py` — standalone six-test VLC validation script.
- **Docs vault:** `docs/01-project-overview.md`, `docs/02-architecture.md`, `docs/03-technical-specifications.md` — Spanish technical narrative, mermaid diagrams, env and cache schemas.
- **Content directories (gitignored contents):** `videos/` (Drive sync target), `test_videos/` (local dev clips), implied `cache/` and `logs/` created at runtime.
- **Agent scaffolding:** **Not present** — no `.claude/`, `.docs/`, `.agents/`, or `SKILL.md` trees in this repository.
- **Generated / vendor:** `uv.lock` exists for reproducible installs; contents not summarized. `__pycache__`, virtualenvs, and IDE folders are gitignored.

## 6. Configuration & contracts (no secrets)

Configuration flows from environment variables (loaded by uv from `[tool.kdx_pi_signage]` defaults in `pyproject.toml`) and optional `.env` (gitignored; README references `.env.example` but that file is not in the cloned tree).

| Variable | Purpose |
|----------|---------|
| `GOOGLE_DRIVE_FOLDER_ID` | Target Drive folder containing signage videos; required when sync enabled |
| `GOOGLE_APPLICATION_CREDENTIALS` | Filesystem path to Google service-account JSON; required when sync enabled |
| `GOOGLE_DRIVE_SYNC_ENABLED` | `"true"` selects `GoogleDriveRepository`; `"false"` uses local `test_videos/` scan |
| `VIDEOS_DIR` | Primary synced video directory (default `videos`) |
| `TEST_VIDEOS_DIR` | Local-only video folder when sync disabled (default in code falls back to `videos` if unset in `_load_configuration`) |
| `CACHE_DIR` | Metadata and temp workspace (default `cache`) |
| `LOGS_DIR` | Root for date-partitioned logs (default `logs`) |
| `SYNC_INTERVAL` | Seconds between background sync attempts (default `30`) |
| `LOG_LEVEL` | Logging verbosity (documented in README; `main.py` currently hardcodes INFO) |
| `VLC_VERBOSE_LEVEL` | VLC verbosity (default `0`) |
| `VLC_DIR` | Override path to VLC installation for plugin and library discovery |

`[tool.kdx_pi_signage]` in `pyproject.toml` also documents placeholder defaults for folder ID and credentials path — illustrative only, not live secrets.

Feature flags: sync on/off is the primary mode switch. No separate feature-flag module.

### 6.1 HTTP / API endpoints (when applicable)

**No HTTP surface is implemented.** The project overview explicitly states a future minimal API for operator commands (skip, status, etc.) must not be built yet. There are no route modules, OpenAPI specs, or web framework dependencies in `pyproject.toml`.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | — | **N/A — no HTTP server in current codebase** | — |

Planned future interface (documented only): humble REST or similar callable via command-line HTTP client for playback control — not present in source.

### 6.2 Other interfaces

- **CLI / process:** `uv run main.py` or `uv run kdx-pi-signage` (declared entry) starts the long-running daemon.
- **OS signals:** `SIGTERM` and `SIGINT` trigger graceful shutdown via `Application.handle_signal`.
- **VLC control:** Imperative API through `VLCPlayer.play(path)`, `stop()`, `get_state()`, `get_position()` / `set_position()`.
- **Repository contract:** `VideoRepository.get_videos()`, `sync_videos()`, `download_video()`, `delete_video()`.
- **Status introspection:** `PlaybackService.get_status()` returns running flag, playlist size, thread aliveness — programmatic only, not exposed over network.
- **Manual test CLI:** `python test_vlc.py` runs ordered VLC component checks and exits with status code.

## 7. Data & persistence

All persistence is **local filesystem** — no SQL, KV, or vector store.

| Store | Role |
|-------|------|
| `videos/` | Canonical local copies of Drive-synced media (gitignored contents) |
| `test_videos/` | Developer-local clips for offline mode |
| `cache/metadata/` | Per-video JSON sidecars (id, name, size, modified time, checksum, drive_id, local_path) — write path stubbed in `GoogleDriveRepository._save_metadata` |
| `cache/temp/` | Reserved for in-flight downloads and processing |
| `logs/YYYY/MM/DD.log` | Daily append-only audit logs mirroring console output |

**Entities:** `Video` (domain object), playlist ordering via `Playlist.videos` list. Remote Drive files map to `Video` with `drive_id` populated when sync is complete.

**Topology:** Edge device (Raspberry Pi or dev workstation) holds the full video cache; cloud (Google Drive) is authoritative when sync is enabled. Playback reads only local paths — network used by background sync thread, not per-frame streaming. Offline degradation: local-only mode continues looping `test_videos/` without network.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **`README.md`** — installation via `uv sync`, env var table, architecture layer summary, dev and YouTube optional extras, MIT license, Spanish section headers with English code conventions.
2. **`docs/01-project-overview.md`** — mission statement, problem narrative (Pi Lite + Drive + uninterrupted loop), file-oriented hexagonal layout, cache/sync/logging/VLC requirements, explicit API deferral, yt-dlp bonus note, `.gitignore` mandate.
3. **`docs/02-architecture.md`** — hexagonal layer responsibilities, mermaid architecture and class diagrams, data flows for sync and playback, repository and adapter patterns, error resilience tiers, threading strategy (main, sync, logger).
4. **`docs/03-technical-specifications.md`** — dependency versions, env and pyproject config shapes, cache directory layout, metadata JSON schema, log format and levels, Drive delta sync algorithm, VLC platform install notes, troubleshooting checklists.
5. **`.claude/`** — **not present** in repository; scan attempted, zero files.
6. **`.docs/`** — **not present** in repository; scan attempted, zero files.

No ADRs, PRDs, constitution files, or `.github` workflow docs exist in the shallow clone.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; summary contains no clone URLs or live credentials.
- **Auth model:** Google Drive access via service-account JSON path (`GOOGLE_APPLICATION_CREDENTIALS`) — file must live outside git; `.gitignore` excludes `.env*` and comments reference optional `credentials.json` ignore. No application-level user authentication because there is no HTTP API.
- **Secrets hygiene:** This summary includes **no** secret values, tokens, PEM material, or `.env` contents. Placeholder strings in `pyproject.toml` `[tool.kdx_pi_signage]` are documentation defaults only.
- **Filesystem exposure:** Logs may contain video filenames and paths; operators should treat log directories as operational data, not public.
- **VLC attack surface:** Plays only local files resolved through repository logic; no arbitrary URL playback in current `VLCPlayer` implementation.

## 10. Operational picture

**Local development:**

```bash
uv sync              # install production deps
uv sync --dev        # include pytest, ruff, black, mypy, isort
uv run main.py       # start signage daemon
python test_vlc.py   # manual VLC smoke tests
```

**Runtime modes:**

| Mode | Config | Behavior |
|------|--------|----------|
| Local / dev | `GOOGLE_DRIVE_SYNC_ENABLED=false` | Scans `TEST_VIDEOS_DIR` (or `videos`), builds inline `LocalVideoRepository`, no network |
| Production (intended) | `GOOGLE_DRIVE_SYNC_ENABLED=true` + Drive env vars | `GoogleDriveRepository` background sync + VLC loop |

**Deployment:** Docs assume an existing Raspberry Pi service running `main.py` under the operator home directory; Pi package installation is out of repo scope ("do not worry about installing packages on the Pi"). No GitHub Actions, Dockerfile, or wrangler config in tree — deployment is manual/systemd-oriented.

**Hardware constraints:**

- Target: Raspberry Pi Lite (no desktop), TV via HDMI, VLC installed via distro packages (`apt install vlc`).
- Development: Windows supported with VLC in standard install paths or `VLC_DIR` override.
- Fullscreen headless output requires appropriate video group / framebuffer permissions on Linux (documented in technical specs troubleshooting).

**Logging:** Dual handlers — console and `logs/<year>/<month>/<day>.log` with timestamped INFO lines for sync start/complete, play start, completion, errors.

## 11. Open questions / unknowns

- **`GoogleDriveRepository` implementation status:** `get_videos()`, Drive client init, metadata JSON load/save, and actual download/delete logic are TODO stubs returning empty lists or no-ops — production Drive sync is architected but not finished in the cloned `main` branch.
- **`.env.example`:** README instructs `cp .env.example .env` but no example file exists in the repository — operators must infer vars from README and `pyproject.toml`.
- **Packaging layout mismatch:** `[tool.hatch.build.targets.wheel]` references `src/kdx_pi_signage_2` but application code lives at repo root under `app/` — wheel build may be incomplete.
- **`get_status()` accuracy:** References `playlist.current_video` attribute that is not defined on `Playlist` — likely always `None` until implemented.
- **HTTP control API:** Documented as future work; no dependencies or routes added yet.
- **CI/CD:** No automated test or deploy pipeline visible in repo.
- **YouTube bonus:** `yt-dlp` optional dep declared; no integration code in `app/` yet.
- **pytest suite:** Dev dependency present; no `tests/` directory with automated cases beyond `test_vlc.py`.
