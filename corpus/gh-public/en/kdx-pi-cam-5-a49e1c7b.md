---
id: kdx-pi-cam-5-a49e1c7b
title: "kdx-pi-cam — async Telegram bot for RTSP camera motion alerts — 3. Product / idea"
visibility: public
importance: normal
source_repo: "kdx-pi-cam"
related: ["kdx-pi-cam"]
tags: ["kdx-pi-cam", "github", "public", "normal", "summary"]
---

## 3. Product / idea The mental model is a **long-running single-process edge agent**: one RTSP input, one Telegram output, one chat destination. There is no HTTP server, database, or message bus in the shipped code. is the CLI entry ( script alias in ). It sets up logging, enforces single-instance via PID file, starts background cleanup, spawns polling in a thread, and blocks on . owns the lifecycle: on , it sets , calls , and launches as an asyncio task that polls every second. Motion triggers clip generation and ; quiet hours skip sends but still log. RTSP connection failures invoke an optional that posts a warning message to the chat after three consecutive failures.
