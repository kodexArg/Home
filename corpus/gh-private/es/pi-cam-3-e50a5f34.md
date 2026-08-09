---
id: pi-cam-3-e50a5f34
title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — P2 — Resource-bounded edge hardware with ephemeral media"
visibility: private
importance: normal
source_repo: "pi-cam"
related: []
tags: ["pi-cam", "github", "private", "normal", "summary"]
---
### P2 — Resource-bounded edge hardware with ephemeral media

- **Who hurts:** Raspberry Pi 3+ deployments with limited storage and CPU where uncapped snapshot/video accumulation fills the SD card.
- **Pain today:** Naive capture scripts write files indefinitely; blocking I/O in the bot thread stalls other users.
- **How this repo answers:** enforces a FIFO cap (default 10 files) under a configurable directory. Capture and FFmpeg work run in thread-pool executors to keep the asyncio event loop responsive. System FFmpeg uses preset for short clips to reduce encode latency on weak hardware.
- **Out of scope:** Long-term archival, object storage upload, or transcoding pipelines.
