---
id: camera-alert-to-telegram-2-82d27250
title: "Camera Alert to Telegram — IP camera motion detection with Telegram alerts — P1 — Unattended motion awareness"
visibility: public
importance: normal
source_repo: "camera-alert-to-telegram"
related: ["camera-alert-to-telegram"]
tags: ["camera-alert-to-telegram", "github", "public", "normal", "summary"]
---

### P1 — Unattended motion awareness - **Who hurts:** Property owners, small-site operators, or anyone with an IP camera who cannot monitor the feed 24/7. - **Pain today:** Commercial NVRs add cost and complexity; raw RTSP streams require a human viewer; simple motion-email setups lack rich mobile UX. - **How this repo answers:** Continuous background-subtraction motion detection (MOG2) runs over a user-defined mask region. Sustained motion crossing a frame-count threshold triggers an alert cycle: the rolling frame buffer is sliced into an MP4 clip centered on the first motion timestamp, saved locally, and sent to a configured Telegram chat. Optional instant JPEG snapshots fire on first motion with a cooldown to reduce spam. - **Out of scope:** Multi-camera orchestration, cloud object storage, person/vehicle classification, PTZ control, web dashboard, or enterprise access control.
