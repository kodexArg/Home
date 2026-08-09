---
id: rpi-door-access-rfid-3-28ab2486
title: "rpi-door-access-rfid — Raspberry Pi RFID shower-door access control with admin panel — P2 — No audit trail or real-time operator visibility"
visibility: public
importance: normal
source_repo: "rpi-door-access-rfid"
related: ["rpi-door-access-rfid"]
tags: ["rpi-door-access-rfid", "github", "public", "normal", "summary"]
---

### P2 — No audit trail or real-time operator visibility - **Who hurts:** Front-desk staff resolving disputes; operators who need to know immediately when a card is denied at the door. - **Pain today:** Access events were invisible to staff away from the door; admin actions and RFID swipes had no structured, searchable history. - **How this repo answers:** Two persistence layers: access_logs (every grant/deny at the reader) and audit_logs (immutable system-wide trail for admin and system actions — user/company/card CRUD, recharges, batch blanquear, RFID events). KPI stats (compute_kpi in app/api/stats.py) aggregate grant/deny rates by day, week, and month. Server-Sent Events at /sse/events stream HTML fragments to the dashboard sidebar via a SQLite-backed EventBroadcaster (app/core/events.py), so all worker processes and browser tabs see the same live feed. - **Out of scope:** Remote monitoring, email/Telegram alerts, export to external SIEM, multi-user RBAC.
