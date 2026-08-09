---
id: kdx-pi-cam-5-a49e1c7b
title: "kdx-pi-cam — async Telegram bot for RTSP camera motion alerts — 3. Product / idea"
visibility: public
importance: normal
source_repo: "kdx-pi-cam"
related: ["kdx-pi-cam"]
tags: ["kdx-pi-cam", "github", "public", "normal", "summary"]
---

## 3. Product / idea The mental model is a **long-running single-process edge agent**: one RTSP input, one Telegram output, one chat destination. There is no HTTP server, database, or message bus in the shipped code. main.py is the CLI entry (kdx-pi-cam script alias in pyproject.toml). It sets up logging, enforces single-instance via PID file, starts CacheManager background cleanup, spawns BotHandler polling in a thread, and blocks on asyncio.sleep(inf). BotHandler owns the lifecycle: on /start, it sets monitoring = True, calls video_processor.start_capture(), and launches _monitor_motion as an asyncio task that polls every second. Motion triggers clip generation and send_video; quiet hours skip sends but still log. RTSP connection failures invoke an optional error_callback that posts a warning message to the chat after three consecutive failures.
