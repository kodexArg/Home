---
id: kdx-pi-signage-8-145f8d7f
title: "kdx-pi-signage — autonomous Raspberry Pi 3 A+ digital-signage video looper — 4. Technology stack"
visibility: public
importance: normal
source_repo: "kdx-pi-signage"
related: ["kdx-pi-signage"]
tags: ["kdx-pi-signage", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.11 (requires >=3.9) | .python-version, pyproject.toml | | Media engine | VLC + python-vlc 3.x | video_player.py, pyproject.toml | | Config / models | Pydantic 2 (SystemConfig, VLCConfig, VideoInfo, Playlist, PlayerState) | config.py | | Filesystem watch | watchdog 3.x | video_scanner.py | | Logging | loguru (rotation, retention, zip compression) | logger.py | | Process supervision | systemd user unit | kdx-pi-signage.service | | Package manager | uv (uv sync, uv run) | pyproject.toml, service ExecStart | | Tests | pytest 7+, pytest-cov, mocks for VLC/watchdog | tests/, pyproject.toml [project.optional-dependencies].dev | | OS / hardware | Raspberry Pi OS Lite, Pi 3 A+ 512 MB, HDMI 1080p | README.md, .trae/documents/ | | CI / deploy | None in repo (manual Pi install) | no .github/ workflows |
