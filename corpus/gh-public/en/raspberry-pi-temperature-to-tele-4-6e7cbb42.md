---
id: raspberry-pi-temperature-to-tele-4-6e7cbb42
title: "raspberry-pi-temperature-to-telegram — Raspberry Pi DHT sensor logger with Telegram remote monitoring — P3 — Hardware-coupled sensor code that blocks off-device"
visibility: public
importance: normal
source_repo: "raspberry-pi-temperature-to-telegram"
related: ["raspberry-pi-temperature-to-telegram"]
tags: ["raspberry-pi-temperature-to-telegram", "github", "public", "normal", "summary"]
---

### P3 — Hardware-coupled sensor code that blocks off-device development - **Who hurts:** Developers working on Telegram handlers, charting, or database logic on a laptop without a Raspberry Pi, DHT sensor, or GPIO wiring. - **Pain today:** imports fail off-device; every test requires physical hardware; CI cannot exercise the ingestion loop. - **How this repo answers:** Both and branch on the environment variable: when , they import (real reads with retry logic); otherwise they import , which generates slowly drifting random temperature and humidity values. Sensor type (DHT11 vs DHT22) and GPIO pin are configured via and env vars in . This lets the full stack — scheduler inserts, chart generation, Telegram replies — run on any machine with MariaDB and Python deps installed. - **Out of scope:** Mock camera capture off-device (OpenCV still runs for ; will fail or capture wrong device without a camera).
