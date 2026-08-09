---
id: pi-cam-2-accffb33
title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — P1 — Remote camera access without a bespoke client"
visibility: private
importance: normal
source_repo: "pi-cam"
related: []
tags: ["pi-cam", "github", "private", "normal", "summary"]
---

### P1 — Remote camera access without a bespoke client - **Who hurts:** Someone with an IP camera on a local network and a Raspberry Pi gateway who wants quick visual checks from a phone while away from the LAN UI. - **Pain today:** Manufacturer apps are fragmented; browser RTSP viewers are awkward on mobile; writing one-off scripts ties capture logic directly to a chat handler and breaks under concurrent requests. - **How this repo answers:** A long-polling Telegram bot exposes , , and commands. Each command spawns an independent async task, delegates capture to an RTSP service (OpenCV for frames, FFmpeg for timed MP4 segments), and returns the media file in the chat. Per-user error handling prevents one failed capture from blocking others. - **Out of scope:** Cloud NVR hosting, multi-camera orchestration, PTZ control, live continuous streaming to Telegram, or a web dashboard.
