---
id: rpi-temp-2-7e396aa4
title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — P1 — Edge sensor data needs a simple live chart"
visibility: private
importance: normal
source_repo: "rpi-temp"
related: []
tags: ["rpi-temp", "github", "private", "normal", "summary"]
---

### P1 — Edge sensor data needs a simple live chart - **Who hurts:** Operators running Raspberry Pi nodes that log environmental readings into a central database but lack a turnkey visualization layer. - **Pain today:** Raw rows in MySQL are not actionable at a glance; exporting to spreadsheets or wiring Grafana is heavier than needed for a single-room monitor. - **How this repo answers:** A Flask app exposes GET /get, which pulls the 100 most recent rows from tb_temperatura, drops humidity values above 110 (treated as sensor error), serializes to JSON, and a Chart.js front page plots temperature and humidity over time. - **Out of scope:** Alerting, multi-tenant auth, long-term analytics, sensor ingestion (assumed to happen elsewhere into MySQL).
