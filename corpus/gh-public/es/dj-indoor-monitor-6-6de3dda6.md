---
id: dj-indoor-monitor-6-6de3dda6
title: "dj-indoor-monitor — Django IoT dashboard for indoor crop sensor monitoring — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "dj-indoor-monitor"
related: ["dj-indoor-monitor"]
tags: ["dj-indoor-monitor", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Edge ingest:** A Raspberry Pi with DHT22 on GPIO 4 posts {"sensor": "vege-oeste", "metric": "t", "value": 24.5} every 10 seconds; the API validates and inserts without requiring a pre-existing Sensor row. 2. **Operator dashboard:** User opens /charts/sensors/, selects a timeframe (1h, 4h, 1d), and HTMX triggers parallel POST /generate_sensor/ requests that return Plotly chart fragments per sensor/metric, grouped by room. 3. **External analytics:** A script or agent calls GET /api/data-point/timeframed/?timeframe=1H&sensors=vege-oeste,vege-este&aggregations=true to retrieve hourly min/max/mean/first/last without loading the web UI. 4. **Admin configuration:** Staff use Django admin (/admin/) to register rooms, sensors, and site key-value settings (SiteConfigurations).
