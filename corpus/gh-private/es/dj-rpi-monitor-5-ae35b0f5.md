---
id: dj-rpi-monitor-5-ae35b0f5
title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — 3.1 North-star use cases"
visibility: private
importance: low
source_repo: "dj-rpi-monitor"
related: []
tags: ["dj-rpi-monitor", "github", "private", "low", "summary"]
---
### 3.1 North-star use cases

1. **Edge ingest:** A Raspberry Pi POSTs (timestamp optional; defaults to ). Server responds with .
2. **Operator glance:** User opens and sees Plotly temperature/humidity lines plus a table of readings from the last ten minutes, auto-refreshing every two seconds.
3. **Programmatic read:** A script calls to fetch rows from the last 300 seconds, or filters by when the view supports it via kwargs.
4. **Local dev iteration:** Developer runs with supplying , optional , and database overrides — no compose file required.
