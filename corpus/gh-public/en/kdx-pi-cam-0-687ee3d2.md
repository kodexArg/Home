---
id: kdx-pi-cam-0-687ee3d2
title: "kdx-pi-cam — async Telegram bot for RTSP camera motion alerts — kdx-pi-cam"
visibility: public
importance: normal
source_repo: "kdx-pi-cam"
related: ["kdx-pi-cam"]
tags: ["kdx-pi-cam", "github", "public", "normal", "summary"]
---

# kdx-pi-cam > **Problem thesis (required):** kodexArg needs a **single-camera, edge-deployable surveillance notifier** that connects to one RTSP stream, buffers recent frames, detects motion via classical computer vision (frame differencing), and pushes short video clips or photos to a designated Telegram chat on demand or on trigger. The operator controls monitoring with simple bot commands ( , , , , ) from a phone — no web dashboard, no multi-tenant cloud, no NVR UI. The stack targets Raspberry Pi–class hardware: async capture loop, CPU throttling when load exceeds 80%, rotating log files, and a size-bounded local cache for generated media.
