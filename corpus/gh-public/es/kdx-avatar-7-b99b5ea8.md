---
id: kdx-avatar-7-b99b5ea8
title: "kdx-avatar — live camera-to-avatar adapter with blank-video and service failover — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "kdx-avatar"
related: ["gh-kdx-avatar"]
tags: ["kdx-avatar", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **UC-02 — Healthy avatar path:** Operator starts adapter; export device becomes available; status reports avatar; consumers receive non-blank avatar frames driven by the camera via SnekStudio. 2. **UC-03 — Blank-video failover:** SnekStudio exits unexpectedly; export continues with valid blank frames; service process remains running; status reports blank. 3. **UC-04 — Service controllable after puppet failure:** Operator can query status and restart-puppet without full host reboot; on success mode returns to avatar. 4. **UC-05 — Clean stop:** Operator stops adapter; export released; no orphan SnekStudio or exclusive camera holders. 5. **UC-06 — Device policy:** Adapter never binds the sibling kdx-share loopback device (/dev/video10); uses video11 labeled kdx-avatar.
