---
id: kdx-pi-signage-6-cbf07bf2
title: "kdx-pi-signage — autonomous Raspberry Pi 3 A+ digital-signage video looper — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "kdx-pi-signage"
related: ["kdx-pi-signage"]
tags: ["kdx-pi-signage", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Fresh deploy:** Clone repo on Pi, uv sync, copy videos to videos/, enable systemd user service → fullscreen loop starts on boot. 2. **Content swap:** Operator SCPs a new promo.mp4 into videos/ while playing → watchdog detects change → playlist reloads without restart. 3. **Failure recovery:** Corrupt video causes three consecutive play errors → system re-scans directory, logs to errors.log, continues with remaining files after retry_delay seconds.
