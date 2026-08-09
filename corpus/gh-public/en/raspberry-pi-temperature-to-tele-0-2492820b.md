---
id: raspberry-pi-temperature-to-tele-0-2492820b
title: "raspberry-pi-temperature-to-telegram — Raspberry Pi DHT sensor logger with Telegram remote monitoring — raspberry-pi-temperature-to-telegram"
visibility: public
importance: normal
source_repo: "raspberry-pi-temperature-to-telegram"
related: ["raspberry-pi-temperature-to-telegram"]
tags: ["raspberry-pi-temperature-to-telegram", "github", "public", "normal", "summary"]
---
## raspberry-pi-temperature-to-telegram

> **Problem thesis (required):** A headless Raspberry Pi with a DHT11 or DHT22 sensor can measure temperature and humidity locally, but the operator is rarely at the device. This repository turns that Pi into a self-contained edge appliance: it samples the sensor every five seconds, persists readings to a local MariaDB table, and exposes a Telegram bot for remote commands — current measurement, a 48-hour temperature chart, and a live camera snapshot. A demo mode with simulated sensor values allows development and testing without GPIO hardware. No web server, no cloud dependency, no GUI on the Pi.
