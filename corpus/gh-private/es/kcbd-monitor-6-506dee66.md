---
id: kcbd-monitor-6-506dee66
title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "kcbd-monitor"
related: []
tags: ["kcbd-monitor", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Operator morning check** — open the dashboard (/), see per-room gauges with cold/optimal/hot band coloring from latest readings, identify any out-of-range metric within seconds. 2. **Trend diagnosis** — on /sensores, pick a sensor and timeframe; timeframed/ returns resampled multi-metric series rendered as echarts line charts; active-sensor window hides stale devices. 3. **VPD assessment** — on /vpd, view per-sensor VPD computed from latest t+h pairs against agronomic bands (propagation, vegetation, flowering phases). 4. **Technician provisioning** — register Room and Sensor entries in Django admin; new device readings appear under the correct room on next poll without code deploy. 5. **Field device ingest** — Raspberry Pi runs clients/raspberry-pi/rpi-sensor-service.py, batches readings, flushes offline buffers atomically (max 1000 per request). 6. **Agent-assisted development** — consult API.md first for live endpoint behavior, docs/ENDPOINTS.md for contract design, docs/MODEL.md for schema, docs/DOMAIN.md for business rules; ADRs in docs/ADRS/ govern all non-trivial decisions.
