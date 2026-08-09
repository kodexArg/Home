---
id: "multimedia-handler-for-rpi"
title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet"
visibility: private
importance: normal
source_repo: "multimedia-handler-for-rpi"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags:
  - "flask"
  - "python"
  - "raspberry-pi"
  - "multimedia"
  - "digital-signage"
  - "ffmpeg"
  - "video-management"
  - "wtforms"
  - "jinja2"
  - "bootstrap"
problems_solved:
  - "Operators of a Raspberry Pi multimedia signage fleet lack a single place to stage, convert, and distribute loopable MP4 clips to per-device folders that field players sync on a schedule."
  - "Static images (posters, stills) must become timed MP4 loops at multiple resolutions before they can play on signage hardware that expects video files, not raw images."
technologies:
  - "Python 3 (Flask 2.1.2)"
  - "Flask-WTF / WTForms 3"
  - "Jinja2 templates"
  - "Bootstrap 5 (CDN in base template)"
  - "ffmpeg (external CLI via subprocess)"
  - "Werkzeug secure_filename"
  - "opencv-python (declared in requirements; not referenced in core app modules reviewed)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# multimedia-handler-for-rpi

> **Problem thesis (required):** This repository is a small **local web console** for operators who run a fleet of Raspberry Pi–based multimedia signs. It solves the operational gap between “I have an image or clip idea” and “every designated player folder has the right MP4 loop, named consistently, at the right resolution.” The app converts uploaded still images into short MP4 videos with ffmpeg, copies the result into one or more per-device directories under a shared static tree, and provides a browser UI to browse what each device folder currently holds — with hooks for copy/delete rearrangement before players pick up changes on their periodic sync cycle (documented as roughly five minutes).

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/multimedia-handler-for-rpi` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Flask operator UI that turns images into loopable MP4s and distributes them into per–Raspberry Pi video folders for a multimedia signage network. |
| Audience | Internal operators / technicians curating content for Raspberry Pi signage endpoints; not end viewers of the signs themselves. |

## 2. Problems it solves

### P1 — Fleet video staging without per-device SSH

- **Who hurts:** Operators managing multiple Raspberry Pi multimedia players, each with its own local SSD and folder naming convention.
- **Pain today:** Without a central staging tool, distributing or rearranging clips means logging into individual devices or manually copying files into opaque folder trees; mistakes in naming or resolution break playback on signage players.
- **How this repo answers:** The app treats `static/videos/<device_folder>/` as the canonical staging area — one subdirectory per logical player. The **Converter** flow uploads an image, runs ffmpeg to produce an MP4 at a chosen resolution and duration, then `shutil.copy` distributes the output into every device folder selected via checkboxes. The **Videos** page scans those folders and renders a card grid per device so operators can see what is staged before players sync.
- **Out of scope:** Real-time push to devices; player-side sync implementation; authentication or multi-user audit trails; cloud hosting.

### P2 — Still images are not signage-ready video loops

- **Who hurts:** Content authors who supply JPG/PNG posters but whose players only loop MP4 files.
- **Pain today:** Manually invoking ffmpeg with correct `-loop`, duration (`-t`), and scale (`-s`) flags for each asset is error-prone and slow at fleet scale.
- **How this repo answers:** The `Converter` WTForms form captures image file, optional output name, duration in seconds (0–180, default 15 in template), orientation preset (`1920x1080`, `1080x1920`, `1280x720`, `720x1280`), and target device folders. `utils.ffmpeg` shells out a fixed ffmpeg recipe: loop input image, set duration and resolution, H.264 (`libx264`), scale filter, overwrite output. Processed source and output move to a `processed` subfolder under the converter staging path.
- **Out of scope:** Non-image sources (existing video transcoding pipelines); advanced ffmpeg filters beyond the default scale; batch CLI automation outside the web UI.

## 3. Product / idea

The mental model is **folder-sync signage**: a central machine (likely the operator’s workstation or a small server) exposes a Flask app. Device folders under `static/videos/` mirror what each Raspberry Pi will pull to its private SSD on a timer. Operators use two primary workflows:

1. **Create & distribute** — upload still → ffmpeg MP4 → copy to N device folders.
2. **Inspect & rearrange** — browse all devices’ staged clips in a table; intended copy/delete actions let operators reorganize before the next player sync.

The home page (`templates/home.html`) documents the five-minute sync latency expectation: new or deleted clips may not appear on physical signs until players re-read their folders.

Architecture is intentionally monolithic and filesystem-backed — no database, no queue, no API beyond the Flask routes. State lives entirely in directory listings and file copies.

### 3.1 North-star use cases

1. Operator uploads a promotional still, sets 15 seconds at 1920×1080, selects three RPi device folders, submits — ffmpeg runs, MP4 copies land in each folder, players sync within minutes.
2. Operator opens the Videos page to verify which clips are staged per device before a campaign goes live.
3. Operator uses the copy modal (partially wired) to duplicate a clip’s staging path reference toward another device folder.

### 3.2 Non-goals

- No README-declared production hardening, CI, or container packaging in tree.
- Delete / delete-all buttons render in `templates/videos.html` but server-side handlers for those actions are not implemented in `app.py` beyond logging POST `action` and `src`.
- `macro_copy` POST is accepted on `/vid` but no copy logic executes after `myprint`.
- Not a player runtime — only the operator-side content prep tool.

## 4. Technology stack

Derived from `requirements.txt`, `app.py`, `forms.py`, `utils.py`, and templates.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3, Flask 2.1.2 | `requirements.txt`, `app.py` |
| Web framework | Flask + Jinja2 3.1 | `app.py`, `templates/` |
| Forms / CSRF | Flask-WTF 1.0.1, WTForms 3 | `forms.py` |
| Frontend | Bootstrap 5 via CDN links in `templates/base.html` | `templates/base.html` |
| Media processing | ffmpeg CLI (subprocess, shell=True) | `utils.py` |
| Declared but unused in reviewed code | opencv-python 4.5, numpy 1.22 | `requirements.txt` only |
| Tooling / lint | autopep8, pycodestyle | `requirements.txt` |
| Data | Filesystem only (no SQL/ORM) | `utils.VIDEOS_PATH`, `utils.CONVERTER_PATH` |
| Infra / deploy | Local `app.run()` debug server | `app.py` `if __name__` block |
| Tests | None found | — |
| AI / agents | None (`.claude/` absent) | tree scan |

### 4.1 Notable dependencies (curated)

- `Flask` / `Flask-WTF` — minimal server-rendered operator UI with form validation and flash messages.
- `Werkzeug` — `secure_filename` on uploads; dev server.
- `ffmpeg` (system binary, not pip) — image-to-MP4 conversion invoked by `utils.ffmpeg`.
- `opencv-python` — listed in requirements; no import in `app.py`, `forms.py`, or `utils.py` as committed.

## 5. Repository map (abstraction)

- **Entrypoint:** `app.py` — Flask app, route handlers, `ffmpeg_convertion`, `video_list_as_json`.
- **Domain / core:** conversion orchestration (`ffmpeg_convertion`), device/video inventory (`video_list_as_json`), path constants in `utils.py`.
- **Forms layer:** `forms.py` — `Converter` FlaskForm with file upload, orientation select, duration integer, multi-checkbox device folders (choices populated from live `os.listdir(VIDEOS_PATH)` at import time).
- **Adapters:** `utils.ffmpeg` subprocess wrapper; `shutil.copy` / `copy2` for distribution and archival to `processed`.
- **Presentation:** `templates/` — `base.html` (layout, Bootstrap, flash footer), `header.html` (nav), `home.html`, `converter.html`, `videos.html` (modals for copy).
- **Static staging:** `static/converter/` — upload scratch + sample assets; `static/videos/` — per-device subfolders (contents gitignored per `.gitignore`).
- **Scratch / non-runtime:** `clipboard.txt` — pasted HTML/Jinja/editor settings snippets, not imported by app.
- **Docs vaults:** none — no `docs/`, `.docs/`, ADRs, or `.claude/` in tree.
- **Generated / vendor:** `videos/*` and `converter/*` ignored except committed sample files under `static/converter/`.

## 6. Configuration & contracts (no secrets)

- **Paths (code constants):** `BASE_PATH = Path(__file__).parent`; `VIDEOS_PATH = BASE_PATH / 'static' / 'videos'`; `CONVERTER_PATH = BASE_PATH / 'static' / 'converter'`.
- **Flask config:** `SECRET_KEY` set inline in `app.py` `__main__` block to a placeholder string (not suitable for production; treat as dev-only).
- **Debug:** `app.debug = True` when run as script.
- **Env files:** `.env` / `.venv` patterns gitignored; no `.env` committed.
- **ffmpeg CLI:** built dynamically with input path, `-t` seconds, `-s` orientation string, `libx264`, default vf `scale=iw/2:-1`, `-y` overwrite.

### 6.1 HTTP / API endpoints (when applicable)

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Home / welcome page explaining fleet workflows | none |
| `GET` | `/converter` | Render image-to-MP4 upload form; list device folders for checkboxes | none |
| `POST` | `/converter` | Validate form, save upload, run ffmpeg, copy MP4 to selected folders, redirect | none (Flask-WTF CSRF token via `hidden_tag`) |
| `GET` | `/vid` | Render per-device video card table from filesystem scan | none |
| `POST` | `/vid` | Accept `action` + `src` form fields; logs via `myprint`; copy/delete not fully implemented | none |

No REST JSON API, OpenAPI spec, or separate API module. Static video files served by Flask `static` at paths like `videos/<device>/<file>.mp4` (referenced in templates via `url_for('static', ...)`).

### 6.2 Other interfaces

- **CLI:** Run `python app.py` (or equivalent) to start embedded Flask dev server — no dedicated CLI entry in `pyproject` or `setup.py`.
- **ffmpeg:** External binary must be on `PATH`; invoked with `shell=True`.
- **Player sync:** Out-of-repo contract — each RPi player polls or rsyncs its folder on ~5-minute interval (described in `templates/home.html` and `converter.html`).

## 7. Data & persistence

- **Store:** Local filesystem only.
- **Layout:** `static/videos/<DEVICE_ID>/` holds MP4 (and potentially other video) files per signage endpoint; `static/converter/` holds uploads in flight and a `processed` archive after conversion.
- **Entities (implicit):** Device folder name (string key), video filename, derived display `tag` (filename stem, underscores → spaces, lowercased), `src` relative path `videos/<device>/<file>`.
- **Topology:** Single-host operator tool; Raspberry Pis are edge consumers that mirror folder contents to local SSD — offline-capable playback after sync. No cloud or central database in this repo.

## 8. Docs & agent memory (required scan)

Sources scanned and folded in:

1. **Root README** (`README.md`) — one-line description matching GitHub metadata: organizing videos for Raspberry Pi multimedia network display.
2. **`docs/**`** — not present.
3. **`.docs/**`** — not present (confirmed absent in clone).
4. **ADR / PRD / constitution** — not present.
5. **`.claude/**`** — not present (confirmed absent in clone).
6. **Inline docstrings** — `app.py` route and function docstrings describe converter and videos intent.
7. **UI copy** — `templates/home.html`, `converter.html` document sync latency and operator workflows.
8. **`clipboard.txt`** — draft Jinja/HTML fragments and editor settings; evidence of work-in-progress video table UI, not authoritative runtime docs.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — internal signage operations tooling; summary contains no clone URLs or credentials.
- **Auth model:** None on HTTP routes; anyone who can reach the Flask host can upload, convert, and view staged videos.
- **CSRF:** Flask-WTF provides form tokens on POST converter form; videos POST forms use manual hidden fields.
- **Secrets:** Placeholder `SECRET_KEY` in source; must not be reused in production. No `.env` or key material in tree.
- **Subprocess risk:** `ffmpeg` invoked via `shell=True` with interpolated paths — acceptable only in trusted operator LAN context; would need hardening for internet exposure.
- **Gitignore:** `videos/*` and `converter/*` exclude bulk media from VCS; summary does not quote ignored runtime contents.

## 10. Operational picture

- **Local dev:** Install deps from `requirements.txt` (pip-style pins); ensure ffmpeg on PATH; create `static/videos/<device>` subdirectories for each player; run `app.py` (debug server, default Flask port).
- **Deploy:** No GitHub Actions, Dockerfile, or systemd unit in repository — deployment method unknown; likely manual on an operator machine with network access to shared staging folders or NFS mount.
- **Hardware:** Targets Raspberry Pi multimedia sign fleet with local SSD storage; resolutions presets assume HD signage (1080p landscape/portrait, 720p variants).
- **Timing:** Operators must wait ~5 minutes after staging for players to reflect changes (documented in UI).

## 11. Open questions / unknowns

- Which process on each Raspberry Pi performs folder sync (rsync, cron, custom daemon) — not defined in this repo.
- Whether `static/videos` is NFS-mounted from the Flask host or manually rsynced — unknown.
- Full implementation status of copy/delete/delete-all on `/vid` POST — UI present, server logic incomplete.
- Why `opencv-python` and `numpy` are pinned in `requirements.txt` without imports in reviewed modules — possibly planned image preprocessing or leftover dependency.
- Production serving (gunicorn, reverse proxy, TLS) — not documented.
- Whether `trollgun` under `static/converter/` is a sample image without extension or another asset type — not analyzed (binary).
- Primary language flagged as HTML on GitHub likely due to template volume vs Python LOC — functionally a Python Flask app.
