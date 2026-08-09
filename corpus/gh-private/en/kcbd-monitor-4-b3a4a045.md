---
id: kcbd-monitor-4-b3a4a045
title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — P3 — Time-series visualization at scale without choking the API"
visibility: private
importance: high
source_repo: "kcbd-monitor"
related: []
tags: ["kcbd-monitor", "github", "private", "high", "summary"]
---
### P3 — Time-series visualization at scale without choking the API

- **Who hurts:** Operators requesting multi-day charts and the backend serving a ~7 GB readings table migrated from legacy TimescaleDB.
- **Pain today:** Raw point dumps would overwhelm browsers and API memory; the legacy system used TimescaleDB hypertables and server-side Plotly rendering.
- **How this repo answers:** Historical reads use pandas-based server-side resampling in via — one sensor per request, configurable timeframe buckets ( through ), optional min/max/mean/first/last aggregations, ~120-point display target, 7-day window cap, and admin-editable safety caps ( , ) stored in . Out-of-range values are filtered on read per metric catalog in . Chart rendering moved entirely to the browser via echarts Svelte islands.
- **Out of scope:** TimescaleDB or other proprietary time-series extensions (deliberately plain PostgreSQL on RDS); server-side chart image generation.
