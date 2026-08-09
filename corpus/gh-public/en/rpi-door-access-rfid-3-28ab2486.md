---
id: rpi-door-access-rfid-3-28ab2486
title: "rpi-door-access-rfid — Raspberry Pi RFID shower-door access control with admin panel — P2 — No audit trail or real-time operator visibility"
visibility: public
importance: normal
source_repo: "rpi-door-access-rfid"
related: ["rpi-door-access-rfid"]
tags: ["rpi-door-access-rfid", "github", "public", "normal", "summary"]
---
### P2 — No audit trail or real-time operator visibility

- **Who hurts:** Front-desk staff resolving disputes; operators who need to know immediately when a card is denied at the door.
- **Pain today:** Access events were invisible to staff away from the door; admin actions and RFID swipes had no structured, searchable history.
- **How this repo answers:** Two persistence layers: (every grant/deny at the reader) and (immutable system-wide trail for admin and system actions — user/company/card CRUD, recharges, batch blanquear, RFID events). KPI stats ( in ) aggregate grant/deny rates by day, week, and month. Server-Sent Events at stream HTML fragments to the dashboard sidebar via a SQLite-backed ( ), so all worker processes and browser tabs see the same live feed.
- **Out of scope:** Remote monitoring, email/Telegram alerts, export to external SIEM, multi-user RBAC.
