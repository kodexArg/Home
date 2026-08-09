---
id: raspberry-pi-temperature-to-tele-4-6e7cbb42
title: "raspberry-pi-temperature-to-telegram — Raspberry Pi DHT sensor logger with Telegram remote monitoring — P3 — Hardware-coupled sensor code that blocks off-device"
visibility: public
importance: normal
source_repo: "raspberry-pi-temperature-to-telegram"
related: ["raspberry-pi-temperature-to-telegram"]
tags: ["raspberry-pi-temperature-to-telegram", "github", "public", "normal", "summary"]
---

### P3 — Hardware-coupled sensor code that blocks off-device development - **Who hurts:** Developers working on Telegram handlers, charting, or database logic on a laptop without a Raspberry Pi, DHT sensor, or GPIO wiring. - **Pain today:** adafruit_dht imports fail off-device; every test requires physical hardware; CI cannot exercise the ingestion loop. - **How this repo answers:** Both kweed_utils/db.py and kweed_utils/telegram_bot.py branch on the ISRPI environment variable: when ISRPI=yes, they import kweed_utils/getth.py (real adafruit_dht reads with retry logic); otherwise they import kweed_utils/getth_sim.py, which generates slowly drifting random temperature and humidity values. Sensor type (DHT11 vs DHT22) and GPIO pin are configured via DHT and BOARD env vars in getth.py. This lets the full stack — scheduler inserts, chart generation, Telegram replies — run on any machine with MariaDB and Python deps installed. - **Out of scope:** Mock camera capture off-device (OpenCV VideoCapture(0) still runs for /picture; will fail or capture wrong device without a camera).
