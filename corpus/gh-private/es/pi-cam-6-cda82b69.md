---
id: pi-cam-6-cda82b69
title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "pi-cam"
related: []
tags: ["pi-cam", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Quick visual check:** Operator sends /photo from Telegram; bot captures one JPEG from the RTSP stream and replies in-thread within seconds. 2. **Incident clip:** Operator sends /clip5 or /clip20 to record a short MP4 segment for review or forwarding in chat. 3. **Passive monitoring:** Operator runs /start_monitoring; motion detection loops on downscaled frames, notifies via Notifier when motion percentage crosses sensitivity, and /stop_monitoring tears down services cleanly. 4. **Developer validation:** Maintainer runs uv run pytest on a workstation with FFmpeg installed; mocks substitute cv2, ffmpeg, and Telegram so no Pi or camera is required.
