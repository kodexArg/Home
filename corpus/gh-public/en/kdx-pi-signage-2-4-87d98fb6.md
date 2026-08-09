---
id: kdx-pi-signage-2-4-87d98fb6
title: "KDX Pi Signage 2 — headless Raspberry Pi digital signage from Google Drive — P3 — Cross-platform development before Pi deployment"
visibility: public
importance: normal
source_repo: "kdx-pi-signage-2"
related: ["kdx-pi-signage-2"]
tags: ["kdx-pi-signage-2", "github", "public", "normal", "summary"]
---

### P3 — Cross-platform development before Pi deployment - **Who hurts:** Developers who need to validate VLC bindings and video discovery on Windows before shipping to Linux ARM hardware. - **Pain today:** Pi-only toolchains slow iteration; VLC path and plugin discovery differ wildly across OSes. - **How this repo answers:** infrastructure.py auto-detects VLC install locations on Windows and Linux (with VLC_DIR override). When GOOGLE_DRIVE_SYNC_ENABLED is false, main.py falls back to a LocalVideoRepository scanning test_videos/ (or VIDEOS_DIR) for .mp4, .avi, .mov, .mkv, .webm. test_vlc.py provides a six-step manual harness (import, instance, media player, file detection, load, short playback). uv sync standardizes dependency install on any host. - **Out of scope:** Packaging as a PyPI library for third parties; containerized deployment manifests.
