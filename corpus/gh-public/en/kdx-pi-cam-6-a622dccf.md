---
id: kdx-pi-cam-6-a622dccf
title: "kdx-pi-cam — async Telegram bot for RTSP camera motion alerts — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "kdx-pi-cam"
related: ["kdx-pi-cam"]
tags: ["kdx-pi-cam", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Passive motion alerting** — Operator sends /start once; bot runs indefinitely; motion sends 5 s clips to the configured chat during active hours. 2. **On-demand snapshot** — Operator sends /stream or /photo while monitoring is active to receive the latest buffered frame. 3. **Manual clip pull** — Operator sends /clip5 to receive the last five seconds of buffered video without waiting for motion. 4. **Operator health check** — /status confirms whether monitoring is running, RTSP is connected, and how many frames are buffered.
