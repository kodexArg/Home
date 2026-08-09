---
id: kdx-pi-cam-4-e5c71598
title: "kdx-pi-cam — async Telegram bot for RTSP camera motion alerts — P3 — Bounded resource use on small Linux / Pi hosts"
visibility: public
importance: normal
source_repo: "kdx-pi-cam"
related: ["kdx-pi-cam"]
tags: ["kdx-pi-cam", "github", "public", "normal", "summary"]
---

### P3 — Bounded resource use on small Linux / Pi hosts - **Who hurts:** Edge operators running 24/7 capture on hardware with limited CPU, RAM, and SD-card wear concerns. - **Pain today:** Naive OpenCV loops peg CPU; unbounded temp video files fill disk; duplicate bot instances fight for the same Telegram token and RTSP connection. - **How this repo answers:** Capture loop throttles to ~10 FPS (asyncio.sleep(0.1)), backs off on read failures (5 s retry), and slows further when psutil.cpu_percent() exceeds 80%. CacheManager enforces CACHE_MAX_SIZE_MB by deleting oldest files in CACHE_DIR on a periodic interval. main.py writes a bot.pid file and refuses to start if another instance is alive. Rotating file logs via logging.handlers.RotatingFileHandler when LOG_TO_FILE is enabled. - **Out of scope:** GPU/NPU acceleration, hardware H.264 encode on Pi OMX, distributed scaling, Kubernetes deployment manifests.
