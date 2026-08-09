---
id: raspberry-pi-temperature-to-tele-2-5346555d
title: "raspberry-pi-temperature-to-telegram — Raspberry Pi DHT sensor logger with Telegram remote monitoring — P1 — No persistent, hands-free environmental logging on "
visibility: public
importance: normal
source_repo: "raspberry-pi-temperature-to-telegram"
related: ["raspberry-pi-temperature-to-telegram"]
tags: ["raspberry-pi-temperature-to-telegram", "github", "public", "normal", "summary"]
---

### P1 — No persistent, hands-free environmental logging on a Raspberry Pi - **Who hurts:** Operators with a Raspberry Pi and DHT11/DHT22 sensor who want continuous temperature and humidity history without manual polling or ad-hoc scripts. - **Pain today:** Reading the sensor interactively (e.g. via IPython) produces point-in-time values only; there is no scheduled ingestion, no durable store, and no way to review trends after the fact without building a separate pipeline. - **How this repo answers:** app.py starts an APScheduler BackgroundScheduler that calls db_inserts() from kweed_utils/db.py every five seconds. Each tick reads temperature and humidity (via kweed_utils/getth.py on real hardware or kweed_utils/getth_sim.py in demo mode) and inserts a row into the temphumi table in the rpi MariaDB database. The schema (installation/rpi.sql) stores temp, humi, and an auto-timestamped time column. A systemd unit (installation/kweed.service) keeps the process alive across reboots. - **Out of scope:** Multi-sensor networks, alerting thresholds, MQTT/HTTP ingestion APIs, cloud sync, data retention policies, or replication to remote databases (remote DB env vars exist for debug only).
