---
id: kdx-pi-signage-2-6-5a5a0705
title: "KDX Pi Signage 2 — headless Raspberry Pi digital signage from Google Drive — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "kdx-pi-signage-2"
related: ["kdx-pi-signage-2"]
tags: ["kdx-pi-signage-2", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Production Pi loop:** Operator sets GOOGLE_DRIVE_SYNC_ENABLED=true, provides Drive folder ID and service-account credentials path, runs uv run main.py as a service; TV plays an endless rotating playlist while background sync refreshes files every 30 seconds. 2. **Local dev / QA:** Developer drops sample clips into test_videos/, leaves sync disabled, runs uv run main.py or python test_vlc.py to validate VLC integration on Windows or Linux. 3. **Future operator control:** Planned minimal HTTP API (dependencies may be added later) to trigger skip, pause, or status queries without SSH — documented as in-progress empty surface.
