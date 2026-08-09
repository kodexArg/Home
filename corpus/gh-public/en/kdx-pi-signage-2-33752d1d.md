---
id: kdx-pi-signage-2-33752d1d
title: "kdx-pi-signage — autonomous Raspberry Pi 3 A+ digital-signage video looper — P1 — No reliable headless video looper for Pi 3 A+"
visibility: public
importance: normal
source_repo: "kdx-pi-signage"
related: ["kdx-pi-signage"]
tags: ["kdx-pi-signage", "github", "public", "normal", "summary"]
---

### P1 — No reliable headless video looper for Pi 3 A+ - **Who hurts:** Operators who want a cheap, always-on signage screen without paying for commercial CMS licenses or running a full desktop environment on 512 MB RAM. - **Pain today:** Manual VLC playlists, cron jobs, or desktop autostart scripts are fragile: they require a window manager, consume RAM, and do not survive reboots or playback errors gracefully. Generic media servers are overkill and network-dependent. - **How this repo answers:** A single Python process (main.py → SignageSystem) orchestrates VLC via python-vlc with Pi-specific hardware decode flags, runs fullscreen on HDMI through DISPLAY=:0, and is installed as a **systemd user service** (kdx-pi-signage.service) with Restart=always, memory cap (MemoryMax=400M), and journal logging. Boot flow: auto-login user pi → service starts → scan → loop. - **Out of scope:** Multi-screen orchestration, remote content management, scheduling by time-of-day, audio playback, interactive touch UI, transcoding pipeline inside the app.
