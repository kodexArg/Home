---
id: raspberry-pi-temperature-to-tele-3-22a3a9b3
title: "raspberry-pi-temperature-to-telegram — Raspberry Pi DHT sensor logger with Telegram remote monitoring — P2 — Remote visibility without building a web dashboard"
visibility: public
importance: normal
source_repo: "raspberry-pi-temperature-to-telegram"
related: ["raspberry-pi-temperature-to-telegram"]
tags: ["raspberry-pi-temperature-to-telegram", "github", "public", "normal", "summary"]
---

### P2 — Remote visibility without building a web dashboard - **Who hurts:** Anyone who wants to check conditions at the Pi from a phone while away from the device — without hosting a web UI, configuring port forwarding, or installing a separate monitoring app. - **Pain today:** SSH is cumbersome on mobile; raw database queries require technical skill; there is no push or pull interface for "what is it right now?" or "show me the last two days." - **How this repo answers:** kweed_utils/telegram_bot.py runs a long-polling Telegram bot (python-telegram-bot v20 async API) alongside the database writer. Three slash commands are registered: /measure returns formatted current temperature and humidity as HTML text; /chart queries MariaDB, resamples the last 48 hours into hourly buckets, renders a Plotly line chart to PNG, and uploads it; /picture captures a frame from the default camera device via OpenCV and sends it as a photo. Non-command text messages echo back to the sender (debug/placeholder handler). Chat actions (typing, uploading photo/document) are sent while long operations run. - **Out of scope:** Multi-user authorization, command ACLs, push alerts on threshold breach, bot webhook mode (uses polling only), humidity on the chart (temperature only in current Plotly config).
