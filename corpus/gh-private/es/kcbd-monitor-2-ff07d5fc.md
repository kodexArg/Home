---
id: kcbd-monitor-2-ff07d5fc
title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — P1 — No centralized, continuous environmental visibility"
visibility: private
importance: high
source_repo: "kcbd-monitor"
related: []
tags: ["kcbd-monitor", "github", "private", "high", "summary"]
---

### P1 — No centralized, continuous environmental visibility - **Who hurts:** Indoor cultivation operators managing multiple rooms with heterogeneous Raspberry Pi sensor devices. - **Pain today:** Without a centralized system, operators rely on spot checks, handheld meters, or memory — missing gradual drifts, catching problems only after visual plant stress, and lacking historical evidence for post-mortems or cycle planning. - **How this repo answers:** Authenticated high-frequency ingestion stores every reading in a PostgreSQL time-series table. A public endpoint exposes the most recent value per (sensor, metric) pair for wall-display dashboards; authenticated endpoints serve history, resampled charts, room/sensor catalogs, and on-the-fly VPD. The Astro frontend polls these endpoints and renders gauges, traffic-light banding, and echarts time-series client-side. - **Out of scope:** Actuation/control of HVAC or irrigation; agronomic prescriptions; real-time WebSocket push (MVP uses polling); multi-tenant SaaS.
