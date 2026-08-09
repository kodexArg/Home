---
id: kdx-pi-signage-2-5-b0a77b6f
title: "KDX Pi Signage 2 — headless Raspberry Pi digital signage from Google Drive — 3. Product / idea"
visibility: public
importance: normal
source_repo: "kdx-pi-signage-2"
related: ["kdx-pi-signage-2"]
tags: ["kdx-pi-signage-2", "github", "public", "normal", "summary"]
---

## 3. Product / idea KDX Pi Signage 2 is a long-running Python process structured as a simplified hexagonal (ports-and-adapters) application. The **domain** (app/core.py) models Video entities (id, name, path, size, modified time, checksum, optional drive_id) and a Playlist with sequential or shuffle get_next_video(). The **application layer** (app/application.py) exposes PlaybackService, which owns cache directory initialization, playlist loading, a periodic sync loop, and a playback loop that delegates to the VideoPlayer port. The **infrastructure layer** (app/infrastructure.py) supplies GoogleDriveRepository and VLCPlayer concrete adapters behind interfaces in app/interfaces.py. At runtime the mental model is: **one folder in the cloud is the source of truth → a local videos/ mirror plus cache/metadata/ sidecar JSON → VLC renders fullscreen on the attached display → logs under logs/YYYY/MM/DD.log record every sync and play event.** The entrypoint main.py performs dependency injection: read env config, choose Drive vs local repository, construct PlaybackService, start threads, and block the main thread (signal.pause() on Unix, sleep loop on Windows). Documentation in docs/ (Spanish prose) expands the intended production behavior: checksum-based delta sync, thread-safe queues, exponential backoff, and a future humble HTTP API for curl-driven operator commands — explicitly
