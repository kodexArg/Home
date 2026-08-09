---
id: rpi-door-access-rfid-4-2306e83d
title: "rpi-door-access-rfid — Raspberry Pi RFID shower-door access control with admin panel — P3 — Hardware-coupled code that cannot be developed off-device"
visibility: public
importance: normal
source_repo: "rpi-door-access-rfid"
related: ["rpi-door-access-rfid"]
tags: ["rpi-door-access-rfid", "github", "public", "normal", "summary"]
---
### P3 — Hardware-coupled code that cannot be developed off-device

- **Who hurts:** Developers and CI pipelines without a Raspberry Pi, MFRC522 reader, relay module, and GPIO wiring on every machine.
- **Pain today:** Raw GPIO code sprinkled through business logic makes x86 development impossible and hardware swaps painful.
- **How this repo answers:** Strict Open/Closed hardware abstraction (ADR 0001): abstract interfaces , , , in . in selects on Raspberry Pi (gpiozero, mfrc522) or elsewhere (stdout logging, no side effects). Domain workflows receive injected hardware — never imports GPIO directly. exercises the full stack with mock hardware and narrative seed data.
- **Out of scope:** AWS IoT Core sync (mentioned as future in but explicitly a non-goal in root v1.0).
