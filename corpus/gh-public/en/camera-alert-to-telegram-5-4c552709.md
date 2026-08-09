---
id: camera-alert-to-telegram-5-4c552709
title: "Camera Alert to Telegram — IP camera motion detection with Telegram alerts — 3. Product / idea"
visibility: public
importance: normal
source_repo: "camera-alert-to-telegram"
related: ["camera-alert-to-telegram"]
tags: ["camera-alert-to-telegram", "github", "public", "normal", "summary"]
---

## 3. Product / idea The repository is a **single-process Python application** ( ) that combines three concerns in one asyncio runtime: 1. **Ingest** — opens the RTSP URL from configuration and reads frames at a controlled interval. 2. **Detect & buffer** — Each grayscale frame passes through a MOG2 background subtractor; contours inside the mask rectangle above a sensitivity area threshold count as motion. Frames land in a sized from FPS, clip length, and alert cooldown. 3. **Notify & interact** — When Telegram mode is on, the same process runs polling handlers alongside the capture loop. Alerts push MP4/JPEG media; commands pull from the shared buffer. Configuration splits **secrets** (RTSP URL, bot token, chat ID in ) from **tuning defaults** in , overridable via CLI flags. The main loop reconnects on stream failure and attempts graceful shutdown on signals. A separate utility script ( ) brute-forces common RTSP URL patterns against an IP range — useful during initial camera setup but not part of the runtime alert path.
