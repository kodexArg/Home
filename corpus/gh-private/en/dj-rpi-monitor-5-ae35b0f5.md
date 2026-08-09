---
id: dj-rpi-monitor-5-ae35b0f5
title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — 3.1 North-star use cases"
visibility: private
importance: low
source_repo: "dj-rpi-monitor"
related: []
tags: ["dj-rpi-monitor", "github", "private", "low", "summary"]
---

### 3.1 North-star use cases 1. **Edge ingest:** A Raspberry Pi POSTs {"rpi": "pi-vege-01", "t": 24.3, "h": 62.1} (timestamp optional; defaults to timezone.now()). Server responds 201 with {"message": "Data received"}. 2. **Operator glance:** User opens /development/ and sees Plotly temperature/humidity lines plus a table of readings from the last ten minutes, auto-refreshing every two seconds. 3. **Programmatic read:** A script calls GET /api/sensor-data/300/ to fetch rows from the last 300 seconds, or filters by rpi when the view supports it via kwargs. 4. **Local dev iteration:** Developer runs manage.py runserver with .env supplying SECRET_KEY, optional DEBUG, and database overrides — no compose file required.
