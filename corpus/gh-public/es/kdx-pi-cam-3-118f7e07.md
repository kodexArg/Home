---
id: kdx-pi-cam-3-118f7e07
title: "kdx-pi-cam — async Telegram bot for RTSP camera motion alerts — P2 — Telegram as the control plane for edge camera ops"
visibility: public
importance: normal
source_repo: "kdx-pi-cam"
related: ["kdx-pi-cam"]
tags: ["kdx-pi-cam", "github", "public", "normal", "summary"]
---

### P2 — Telegram as the control plane for edge camera ops - **Who hurts:** Operators who already use Telegram daily and want start/stop monitoring and on-demand snapshots without SSH or a separate mobile app. - **Pain today:** SSH + ffmpeg one-liners are not phone-friendly; vendor apps are siloed per camera brand; scripting Telegram sends requires boilerplate for polling, handlers, and media upload. - **How this repo answers:** BotHandler registers command handlers on a python-telegram-bot Application: /start begins RTSP capture and background motion loop; /stop cancels monitoring; /stream and /photo send the latest buffered frame as a JPEG; /clip5 sends a 5-second clip; /status reports monitoring state, RTSP connectivity, and buffer depth. The bot runs polling in a dedicated thread while main.py keeps the asyncio event loop alive for cache cleanup. - **Out of scope:** Inline keyboards, multi-user ACL, group-chat role management, webhook mode behind reverse proxy (only polling is implemented).
