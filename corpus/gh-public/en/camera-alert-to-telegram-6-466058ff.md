---
id: camera-alert-to-telegram-6-466058ff
title: "Camera Alert to Telegram — IP camera motion detection with Telegram alerts — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "camera-alert-to-telegram"
related: ["camera-alert-to-telegram"]
tags: ["camera-alert-to-telegram", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Set-and-forget alerting** — Operator configures mask + sensitivity, enables Telegram, runs python app.py; sustained motion yields a clip in chat within the configured alert window. 2. **Motion snapshot mode** — With motion_picture enabled, first motion in a cooldown window sends a JPEG before the full clip workflow completes. 3. **On-demand check-in** — Operator sends /photo or /clip5 from Telegram to verify the scene without waiting for motion.
