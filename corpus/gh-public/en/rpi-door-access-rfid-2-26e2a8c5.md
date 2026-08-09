---
id: rpi-door-access-rfid-2-26e2a8c5
title: "rpi-door-access-rfid — Raspberry Pi RFID shower-door access control with admin panel — P1 — No automated enforcement of prepaid shower access"
visibility: public
importance: normal
source_repo: "rpi-door-access-rfid"
related: ["rpi-door-access-rfid"]
tags: ["rpi-door-access-rfid", "github", "public", "normal", "summary"]
---

### P1 — No automated enforcement of prepaid shower access - **Who hurts:** Truck-stop staff and truckers using paid shower facilities; operators who previously tracked usage on paper or by memory. - **Pain today:** Cards could be reused beyond paid limits, stale cards stayed valid indefinitely, and there was no reliable way to block inactive or expired credentials at the physical door. - **How this repo answers:** An async RFID polling loop ( in ) reads card UIDs every 500 ms and calls in . Validation runs in order: account exists → → not passed → . On grant: green LED, single beep, relay open for 5 seconds, one credit deducted, immutable access log written. On deny: red LED, differentiated buzzer pattern (3 beeps for out-of-credits, 1 long beep otherwise), reason recorded ( , , , ). - **Out of scope:** Payment processing, multi-door zones, anti-passback, card-cloning detection, cloud billing integration.
