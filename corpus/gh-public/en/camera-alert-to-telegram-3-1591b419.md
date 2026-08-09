---
id: camera-alert-to-telegram-3-1591b419
title: "Camera Alert to Telegram — IP camera motion detection with Telegram alerts — P2 — Remote evidence on demand"
visibility: public
importance: normal
source_repo: "camera-alert-to-telegram"
related: ["camera-alert-to-telegram"]
tags: ["camera-alert-to-telegram", "github", "public", "normal", "summary"]
---

### P2 — Remote evidence on demand - **Who hurts:** The same operator who received an alert but also wants ad-hoc verification ("show me now"). - **Pain today:** Logging into camera firmware or VPNing to a LAN viewer is slow on mobile. - **How this repo answers:** When Telegram integration is enabled, a polling bot exposes /photo, /clip5, and /clip20 commands that read from the in-memory rolling buffer and encode JPEG/MP4 on the fly, replying directly in the chat. - **Out of scope:** Live streaming, two-way audio, or multi-user role-based bot permissions.
