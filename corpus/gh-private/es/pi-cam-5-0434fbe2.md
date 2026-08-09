---
id: pi-cam-5-0434fbe2
title: "Pi-Cam — async Telegram bot for RTSP capture on Raspberry Pi — 3. Product / idea"
visibility: private
importance: normal
source_repo: "pi-cam"
related: []
tags: ["pi-cam", "github", "private", "normal", "summary"]
---

## 3. Product / idea Pi-Cam is a single-process Python application (app.py) that boots on a Raspberry Pi, loads validated environment configuration, wires infrastructure helpers (notifier, cache), instantiates domain services, and starts Telegram long-polling. The mental model is **Telegram as the control plane**, **CommandManager as the orchestrator**, **RTSP services as the data plane**, and **Notifier as the cross-cutting observability channel** (console + optional Telegram push for system events). On /photo, the input layer acknowledges the user, asynchronously requests CommandType.CAPTURE_PHOTO, receives a filesystem path, sends the JPEG via reply_photo, and registers the file with the FIFO cache. Video commands differ only in duration (5 s or 20 s). /start_monitoring and /stop_monitoring toggle paired services: RTSP capture readiness plus a frame-differencing motion loop that can emit Telegram warnings when motion exceeds a sensitivity threshold. /status surfaces per-service run state and cumulative counters (motion events, photos, videos). Hardware context from README.md: Raspberry Pi 3+, optional 7-inch display, IP camera on Ethernet, Pi on Wi-Fi. RTSP credentials and LAN addressing live in operator .env (not committed); the README documents the expected variable shapes without this summary repeating live values.
