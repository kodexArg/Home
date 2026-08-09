---
id: rpi-temp-5-f65290c1
title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — 3. Product / idea"
visibility: private
importance: normal
source_repo: "rpi-temp"
related: []
tags: ["rpi-temp", "github", "private", "normal", "summary"]
---

## 3. Product / idea The mental model is a **read-mostly dashboard** sitting in front of an existing MySQL fact table. Raspberry Pi devices (implied by column name RPi and project naming) write temperature (Temperatura), humidity (Humedad), and timestamp (Fecha) rows into tb_temperatura. This app never ingests sensors directly—it only queries and presents. User flow: 1. Browser hits / → Jinja template chart.html loads Bootstrap, jQuery, Moment.js, and Chart.js from public CDNs. 2. Client-side JavaScript synchronously fetches GET /get (same origin, appended to current page URL). 3. JSON columns (RPi, Temperatura, Humedad, Fecha) are mapped into a dual-series line chart with time axis and y-axis suggested range 10–45 (°C-oriented scale). Production path: **nginx** terminates HTTP/HTTPS on ports 80/443 and uwsgi_passes to the weedapi-flask container on port 8080. The Flask Dockerfile CMD runs uwsgi app.ini (4 processes, 2 threads, socket :8080). A separate run.py exists for ad-hoc dev server on 0.0.0.0 (not used in the Docker CMD).
