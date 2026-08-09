---
id: rpi-door-access-rfid-6-d8b9dc57
title: "rpi-door-access-rfid — Raspberry Pi RFID shower-door access control with admin panel — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "rpi-door-access-rfid"
related: ["rpi-door-access-rfid"]
tags: ["rpi-door-access-rfid", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Trucker at door** — Presents RFID ficha at MFRC522 reader; system grants or denies with LED/buzzer feedback and unlocks door relay for 5 seconds on success. 2. **Operator assigns card** — Logs into admin panel, creates or selects a client and company, scans card via USB reader at desk (auto-fills UID), sets credits and 24-hour default expiry, hands card to trucker. 3. **Operator recovers abandoned card** — Uses "blanquear" batch workflow to unlink cards from users so fichas can be re-issued; views audit log and KPI dashboard for today's deny reasons.
