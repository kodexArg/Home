---
id: kdx-pi-signage-4-3178436b
title: "kdx-pi-signage — autonomous Raspberry Pi 3 A+ digital-signage video looper — P3 — Silent failures on unattended kiosk hardware"
visibility: public
importance: normal
source_repo: "kdx-pi-signage"
related: ["kdx-pi-signage"]
tags: ["kdx-pi-signage", "github", "public", "normal", "summary"]
---

### P3 — Silent failures on unattended kiosk hardware - **Who hurts:** Operators who cannot physically visit the screen when playback stalls overnight. - **Pain today:** A single corrupt file or VLC glitch can leave a black screen indefinitely; empty directories cause idle hangs without clear telemetry. - **How this repo answers:** SignageSystem._main_loop tracks _consecutive_errors; after max_retries (default 3) it re-scans the directory and resets the counter. VLC end/error events route through callbacks (_on_video_end, _on_video_error). **loguru** writes rotating logs (signage.log, errors.log) plus stderr warnings; systemd captures stdout/stderr to journal with identifier kdx-pi-signage. Service unit sets RestartSec=10, burst limits, and ProtectSystem=strict hardening. - **Out of scope:** Remote alerting (email, Telegram), health HTTP endpoint, automatic video transcoding/repair, thermal throttling logic in-app.
