---
id: kdx-pi-cam-2-76d18964
title: "kdx-pi-cam — async Telegram bot for RTSP camera motion alerts — P1 — No affordable push notifications from a single RTSP camera"
visibility: public
importance: normal
source_repo: "kdx-pi-cam"
related: ["kdx-pi-cam"]
tags: ["kdx-pi-cam", "github", "public", "normal", "summary"]
---

### P1 — No affordable push notifications from a single RTSP camera - **Who hurts:** Operators with one IP camera (door, grow room, garage) who want motion alerts on their phone without paying for cloud NVR subscriptions or running Blue Iris / ZoneMinder on a full PC. - **Pain today:** RTSP streams are viewable in VLC or vendor apps but do not push alerts; DIY scripts are fragile; commercial solutions bundle multi-camera licensing and cloud lock-in. - **How this repo answers:** opens the configured via OpenCV, maintains a circular frame buffer sized from (assumes ~10 FPS), and compares consecutive frames with grayscale absolute difference, thresholding, and contour area checks. On motion, generates a 5-second MP4 via FFmpeg and sends it through the Telegram Bot API. Cooldown ( ) and quiet hours ( / ) reduce notification spam. - **Out of scope:** Multi-camera orchestration, cloud video storage, person/vehicle ML classification, ONVIF discovery, web live-view UI, DVR playback timeline.
