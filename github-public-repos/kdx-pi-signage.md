---
id: "kdx-pi-signage"
title: "kdx-pi-signage — autonomous Raspberry Pi 3 A+ digital-signage video looper"
visibility: public
importance: normal
source_repo: "kdx-pi-signage"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["raspberry-pi", "digital-signage", "vlc", "systemd", "python", "headless", "video-looper", "watchdog", "pydantic", "loguru", "uv", "embedded", "hardware"]
problems_solved:
  - "Operators need a set-and-forget digital-signage player on constrained Raspberry Pi 3 A+ hardware (512 MB RAM) that loops videos fullscreen over HDMI without a desktop GUI, manual playlist curation, or constant babysitting."
  - "Drop-folder signage workflows break when videos are added or removed on a live device — the player must detect filesystem changes and rebuild its playlist without restart or SSH intervention."
  - "Long-running kiosk-style players on Pi hardware fail silently (VLC crashes, corrupt files, empty directories) — the system must retry, re-scan, and self-recover under systemd supervision."
technologies:
  - "Python 3.11"
  - "VLC Media Player + python-vlc"
  - "watchdog (filesystem observer)"
  - "Pydantic 2"
  - "loguru"
  - "systemd user service"
  - "uv (package manager)"
  - "pytest"
  - "Raspberry Pi OS Lite"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# kdx-pi-signage

> **Problem thesis (required):** kodexArg needs a dedicated, headless digital-signage appliance for Raspberry Pi 3 A+ — not a general media center, CMS, or cloud-managed screen network. An operator drops MP4/AVI/MKV files into a local `videos/` folder, powers on the Pi, and gets continuous fullscreen HDMI playback with automatic playlist refresh, error recovery, and systemd-managed auto-start. The entire stack is optimized for 512 MB RAM: hardware-accelerated VLC (`mmal`/`mmal_vout`), audio disabled, dummy interface, and no GUI shell.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/kdx-pi-signage` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Autonomous digital-signage video looper for Raspberry Pi 3 A+ (VLC + systemd) with auto-scan and self-recovery. |
| Audience | Operators deploying Pi-based signage kiosks (home, retail, internal displays); developers maintaining the Python playback stack; agents reading kodexArg hardware docs. |

## 2. Problems it solves

### P1 — No reliable headless video looper for Pi 3 A+

- **Who hurts:** Operators who want a cheap, always-on signage screen without paying for commercial CMS licenses or running a full desktop environment on 512 MB RAM.
- **Pain today:** Manual VLC playlists, cron jobs, or desktop autostart scripts are fragile: they require a window manager, consume RAM, and do not survive reboots or playback errors gracefully. Generic media servers are overkill and network-dependent.
- **How this repo answers:** A single Python process (`main.py` → `SignageSystem`) orchestrates VLC via `python-vlc` with Pi-specific hardware decode flags, runs fullscreen on HDMI through `DISPLAY=:0`, and is installed as a **systemd user service** (`kdx-pi-signage.service`) with `Restart=always`, memory cap (`MemoryMax=400M`), and journal logging. Boot flow: auto-login user `pi` → service starts → scan → loop.
- **Out of scope:** Multi-screen orchestration, remote content management, scheduling by time-of-day, audio playback, interactive touch UI, transcoding pipeline inside the app.

### P2 — Stale playlists when content changes on disk

- **Who hurts:** Operators who update signage by copying files over SSH, USB, or rsync while the device is running.
- **Pain today:** Static playlists require service restarts; many loopers only scan once at startup and miss new or deleted files until manual intervention.
- **How this repo answers:** `VideoScanner` uses **watchdog** `Observer` on the configured video directory (non-recursive). `VideoFileHandler` reacts to create/delete/move events, debounces briefly, re-scans, and notifies `SignageSystem._on_directory_change`, which triggers `_refresh_playlist()` on a background thread. `PlaylistManager.load_videos_from_directory()` rebuilds the in-memory `Playlist` sorted by filename. Supported extensions: `.mp4`, `.avi`, `.mkv`, `.mov`, `.wmv`.
- **Out of scope:** Recursive subdirectory watching, cloud sync clients, versioned asset libraries, metadata-driven scheduling.

### P3 — Silent failures on unattended kiosk hardware

- **Who hurts:** Operators who cannot physically visit the screen when playback stalls overnight.
- **Pain today:** A single corrupt file or VLC glitch can leave a black screen indefinitely; empty directories cause idle hangs without clear telemetry.
- **How this repo answers:** `SignageSystem._main_loop` tracks `_consecutive_errors`; after `max_retries` (default 3) it re-scans the directory and resets the counter. VLC end/error events route through callbacks (`_on_video_end`, `_on_video_error`). **loguru** writes rotating logs (`signage.log`, `errors.log`) plus stderr warnings; systemd captures stdout/stderr to journal with identifier `kdx-pi-signage`. Service unit sets `RestartSec=10`, burst limits, and `ProtectSystem=strict` hardening.
- **Out of scope:** Remote alerting (email, Telegram), health HTTP endpoint, automatic video transcoding/repair, thermal throttling logic in-app.

## 3. Product / idea

The mental model is a **single-process kiosk controller** on bare Raspberry Pi OS Lite: no web server, no database, no window manager. Content lives as files on local disk; the app is the only "business logic."

`SignageSystem` (Facade) wires four collaborators at init:

1. **VideoScanner** (Observer) — validates and watches `video_dir`.
2. **PlaylistManager** (Strategy) — loads `VideoInfo` records, advances sequentially (shuffle available but not default).
3. **VideoPlayer** (Adapter) — wraps VLC instance with Pi-tuned args from `VLCConfig`.
4. **Logger** (Singleton) — centralized loguru setup.

The main thread runs `_main_loop`: if playlist empty, wait and retry; else play current video, block until VLC reports stopped, advance via `get_next_video()`, loop forever when `loop_enabled` (default true). Signal handlers (`SIGINT`, `SIGTERM`) call `stop()` for clean VLC release.

Design patterns are explicit in code and docs (Facade, Adapter, Strategy, Observer, Singleton) — the architecture doc in `.trae/documents/` mirrors the implementation.

### 3.1 North-star use cases

1. **Fresh deploy:** Clone repo on Pi, `uv sync`, copy videos to `videos/`, enable systemd user service → fullscreen loop starts on boot.
2. **Content swap:** Operator SCPs a new `promo.mp4` into `videos/` while playing → watchdog detects change → playlist reloads without restart.
3. **Failure recovery:** Corrupt video causes three consecutive play errors → system re-scans directory, logs to `errors.log`, continues with remaining files after `retry_delay` seconds.

### 3.2 Non-goals

- No GUI, no web admin panel, no REST API (explicitly headless per PRD in `.trae/documents/requisitos_producto_carteleria_pi.md`).
- No database or persistent state beyond log files and on-disk videos.
- Docs mention OpenCV/FFmpeg as future/transcode tooling; they are **not** runtime dependencies in `pyproject.toml` and are not imported in application code.
- `psutil` and `pillow` are declared in `pyproject.toml` but unused in current source — likely reserved or leftover.
- Network/WiFi configuration models appear in PRD examples only; no `NetworkConfig` class ships in `config.py`.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.11 (requires `>=3.9`) | `.python-version`, `pyproject.toml` |
| Media engine | VLC + python-vlc 3.x | `video_player.py`, `pyproject.toml` |
| Config / models | Pydantic 2 (`SystemConfig`, `VLCConfig`, `VideoInfo`, `Playlist`, `PlayerState`) | `config.py` |
| Filesystem watch | watchdog 3.x | `video_scanner.py` |
| Logging | loguru (rotation, retention, zip compression) | `logger.py` |
| Process supervision | systemd user unit | `kdx-pi-signage.service` |
| Package manager | uv (`uv sync`, `uv run`) | `pyproject.toml`, service `ExecStart` |
| Tests | pytest 7+, pytest-cov, mocks for VLC/watchdog | `tests/`, `pyproject.toml` `[project.optional-dependencies].dev` |
| OS / hardware | Raspberry Pi OS Lite, Pi 3 A+ 512 MB, HDMI 1080p | `README.md`, `.trae/documents/` |
| CI / deploy | None in repo (manual Pi install) | no `.github/` workflows |

### 4.1 Notable dependencies (curated)

- `python-vlc` — binds VLC for fullscreen hardware-decoded playback on Pi.
- `watchdog` — inotify-based directory monitoring for hot playlist updates.
- `pydantic` — validates config models and `VideoInfo` metadata at load time.
- `loguru` — structured rotating logs without stdlib logging boilerplate.
- `psutil` / `pillow` — declared but not referenced in application modules (unknown intent).

## 5. Repository map (abstraction)

- **Entrypoints:** `main.py` (`main()`, `SignageSystem` facade); systemd invokes `uv run python main.py` from project root.
- **Domain / core:** `config.py` (Pydantic models + `DEFAULT_SYSTEM_CONFIG` / `DEFAULT_VLC_CONFIG`); `playlist_manager.py` (`SequentialStrategy`, `ShuffleStrategy`, `PlaylistManager`).
- **Adapters:** `video_player.py` (VLC adapter with event callbacks); `video_scanner.py` (watchdog observer + `VideoFileHandler`).
- **Infrastructure:** `logger.py` (Singleton loguru setup); `kdx-pi-signage.service` (systemd contract).
- **Docs vaults:** `.trae/documents/` — architecture, PRD, install guide, complementary specs (Spanish). No `docs/`, `.docs/`, or `.claude/` directories present.
- **Tests:** `tests/unit/` (config, playlist, player, scanner, signage system); `tests/integration/test_full_system.py`; `tests/conftest.py` mocks `vlc` module globally.
- **Generated / vendor:** `uv.lock` (lockfile — not ingested); `logs/` and `videos/` are runtime dirs (gitignored for logs).

## 6. Configuration & contracts (no secrets)

Configuration is primarily **code defaults** in Pydantic models, documented in `pyproject.toml` under `[tool.kdx-pi-signage.*]`, and mirrored in the systemd unit. The app does **not** currently read `os.environ` — env vars in the service file are documentation/forward-compat hints rather than live overrides unless extended.

### SystemConfig (`config.py`)

| Setting | Default / range | Purpose |
|---------|-----------------|---------|
| `video_dir` | `/home/pi/kdx-pi-signage/videos` | Drop folder for media files |
| `log_dir` | `/home/pi/kdx-pi-signage/logs` | loguru output directory |
| `supported_formats` | `.mp4`, `.avi`, `.mkv`, `.mov`, `.wmv` | Extension filter |
| `refresh_interval` | 30 (5–300) | Documented scan interval (watchdog is primary) |
| `max_retries` | 3 (1–10) | Consecutive errors before re-scan |
| `retry_delay` | 5 seconds | Backoff between error retries |

### VLCConfig (`config.py`)

| Setting | Default | Purpose |
|---------|---------|---------|
| `interface` | `dummy` | Headless VLC |
| `fullscreen` | `true` | HDMI fullscreen |
| `enable_audio` | `false` | RAM savings |
| `video_output` | `mmal_vout` | Pi hardware video out |
| `codec` | `mmal` | Hardware decode |

### systemd environment (names only)

`DISPLAY`, `HOME`, `PATH`, `VIDEO_DIR`, `LOG_DIR`, `LOG_LEVEL` — set in `kdx-pi-signage.service`; shapes deployment, not dynamically loaded by current Python code.

### pyproject.toml hardware hints

`GPU_MEMORY=128`, `HDMI_FORCE_HOTPLUG`, `HDMI_MODE=16` (1080p60), overscan disable — operator applies via `/boot/config.txt` per docs, not automated by app.

### 6.1 HTTP / API endpoints (when applicable)

**No HTTP surface.** This is not a web application. There are no routes, OpenAPI specs, or listening ports. All control is via filesystem (add/remove videos), systemd (`systemctl --user`), or SSH log inspection.

Internal Python API (library-style, in-process only):

| Kind | Symbol | Purpose |
|------|--------|---------|
| Facade | `SignageSystem.start()` / `.stop()` / `.get_system_status()` | Lifecycle + status dict |
| Adapter | `VideoPlayer.play_video(path)` / `.is_playing()` | VLC control |
| Strategy | `PlaylistManager.get_next_video()` / `.set_shuffle_mode()` | Playlist navigation |
| Observer | `VideoScanner.start_monitoring(callback)` | Directory watch |

### 6.2 Other interfaces

- **CLI:** `python main.py` or `uv run python main.py` — blocks until SIGINT/SIGTERM.
- **systemd:** `kdx-pi-signage.service` — `Type=simple`, `Restart=always`, `RestartSec=10`, user `pi`, linger required (`loginctl enable-linger pi` per install doc).
- **Filesystem contract:** write video files to `videos/`; read logs from `logs/signage.log` and `logs/errors.log`.
- **Signals:** `SIGINT`, `SIGTERM` → graceful `SignageSystem.stop()`.

## 7. Data & persistence

- **No database.** All runtime state is in-memory (`Playlist`, VLC player state, error counters, watchdog cache `Set[str]`).
- **File storage:** Video assets on local microSD (or USB if operator mounts elsewhere and changes config — not default). Logs on disk with loguru rotation (10 MB main, 1 day error log).
- **Entities (in-memory):** `VideoInfo` (path, filename, size, extension, validity), `Playlist` (videos list, current_index, shuffle/loop flags), `PlayerState` (defined but lightly used).
- **Topology:** Fully offline edge device. No cloud sync, KV, or vector index. One Pi → one HDMI display. Network optional (SSH maintenance only).

## 8. Docs & agent memory (required scan)

| Source | Present | Summary |
|--------|---------|---------|
| `README.md` | yes | Primary operator doc (Spanish): install, usage, troubleshooting, architecture patterns, VLC tuning, ffmpeg transcode hints. |
| `.trae/documents/requisitos_producto_carteleria_pi.md` | yes | PRD: boot flow, module table, language conventions (code English, docs Spanish), hardware specs. |
| `.trae/documents/arquitectura_tecnica_carteleria_pi.md` | yes | Architecture diagrams (mermaid), internal class API sketches, Pydantic model reference, systemd snippet. |
| `.trae/documents/INSTALL.md` | yes | Step-by-step Pi install (apt packages, uv, systemd user unit, auto-login, GPU mem). |
| `.trae/documents/especificaciones_tecnicas_complementarias.md` | yes | Extended dev conventions, `.env` variable names (not wired in code), FFmpeg optimization models, hardware notes. |
| `.claude/` | **absent** | Scanned — directory does not exist in repo. |
| `.docs/` | **absent** | Scanned — directory does not exist in repo. |
| `docs/`, ADRs, CI | absent | No `docs/` tree, no ADR files, no `.github/` workflows. |

**Evidence paths used:** `README.md`, `.trae/documents/*.md`, `pyproject.toml`, `kdx-pi-signage.service`, `config.py`, `main.py`, `video_player.py`, `playlist_manager.py`, `video_scanner.py`, `logger.py`, `tests/conftest.py`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repo; no secrets committed. `.env` patterns are gitignored but example variable *names* appear in `.trae/documents/especificaciones_tecnicas_complementarias.md` — not loaded at runtime.
- **Auth model:** None. Physical access + SSH to Pi; auto-login user `pi` is intentional for kiosk mode (security trade-off documented in install guides).
- **systemd hardening:** `NoNewPrivileges`, `PrivateTmp`, `ProtectSystem=strict`, `ProtectHome=read-only` with `ReadWritePaths` limited to project dir.
- **This summary contains no secrets, keys, tokens, or `.env` values.**

## 10. Operational picture

### Local / device run

```bash
uv sync
mkdir -p videos logs
uv run python main.py          # foreground dev
systemctl --user start kdx-pi-signage.service   # production
journalctl --user -u kdx-pi-signage.service -f  # live logs
```

### Deploy

Manual on-device install per `README.md` and `.trae/documents/INSTALL.md`. No GitHub Actions, Wrangler, or container publish path in tree. Target hardware: **Raspberry Pi 3 A+**, 512 MB RAM, 32 GB+ microSD, 1920×1080 HDMI. Recommended video: H.264, 6–8 Mbps, 30 fps, hardware decode.

### Hardware constraints

GPU memory split (`gpu_mem=64`–`128`), audio disabled in VLC, `MemoryMax=400M` in systemd, `CPUQuota=80%`. Temperature and memory troubleshooting documented in README (`vcgencmd`, `free -h`).

## 11. Open questions / unknowns

- Whether `psutil` and `pillow` are planned features or stale dependencies — no imports found in application code.
- `SystemConfig` ignores systemd `VIDEO_DIR` / `LOG_DIR` env vars; changing paths requires code edit or Pydantic override — env-based config may be incomplete.
- PRD references classes (`SystemService`, `AutoLoginManager`, `HardwareConfig`, `DisplayManager`, `NetworkConfig`) not implemented as separate modules; auto-login is manual `raspi-config` only.
- Architecture doc lists OpenCV and FFmpeg-python as dependencies; not in `pyproject.toml` runtime deps.
- `ShuffleStrategy` exists but default boot path uses sequential playback; no CLI flag to toggle shuffle at runtime.
- No CI/CD — test status on clone unknown without running `uv run pytest` on a dev machine.
- Install doc service name (`kdx-signage.service`) differs slightly from shipped unit filename (`kdx-pi-signage.service`) — operator confusion possible.
