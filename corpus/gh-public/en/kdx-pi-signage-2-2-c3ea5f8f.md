---
id: kdx-pi-signage-2-2-c3ea5f8f
title: "KDX Pi Signage 2 — headless Raspberry Pi digital signage from Google Drive — P1 — Unattended signage on a headless Raspberry Pi"
visibility: public
importance: normal
source_repo: "kdx-pi-signage-2"
related: ["kdx-pi-signage-2"]
tags: ["kdx-pi-signage-2", "github", "public", "normal", "summary"]
---

### P1 — Unattended signage on a headless Raspberry Pi - **Who hurts:** Facilities or retail operators who mount a TV on a Raspberry Pi Lite without a desktop environment and cannot babysit playback. - **Pain today:** Manual USB swaps, brittle cron jobs, or desktop-based players that break on reboot and offer no audit trail of what aired. - **How this repo answers:** boots an that wires to a adapter configured for fullscreen, title-less, mouse-hidden headless output. A dedicated playback thread loops through a , waits on VLC state transitions (Opening → Playing → Ended), logs each start and completion, and moves to the next video without operator input. Signal handlers ( , ) enable graceful shutdown suitable for systemd-style service deployment. - **Out of scope:** Remote fleet management UI, multi-screen orchestration, transcoding, or content authoring.
