---
id: raspberry-pi-temperature-to-tele-6-eada38f4
title: "raspberry-pi-temperature-to-telegram — Raspberry Pi DHT sensor logger with Telegram remote monitoring — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "raspberry-pi-temperature-to-telegram"
related: ["raspberry-pi-temperature-to-telegram"]
tags: ["raspberry-pi-temperature-to-telegram", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Deploy on Pi** — Install MariaDB, clone repo to /App, configure .env with DB credentials and ISRPI=yes, wire DHT sensor to configured GPIO pin, enable kweed.service, interact with the bot from Telegram. 2. **Check current conditions** — Send /measure to receive device-local timestamp, temperature (°C), and humidity (%). 3. **Review trends** — Send /chart to receive a PNG line chart of hourly-averaged temperature over the last 48 hours, with outlier trimming (1st–99th percentile on temperature). 4. **Visual check** — Send /picture to capture and receive a JPEG from the default video device. 5. **Develop off-device** — Set ISRPI to anything other than yes, run app.py locally with MariaDB; simulated sensor values populate the database for chart testing.
