---
id: kcbd-monitor-0-66d7990e
title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — kcbd-monitor"
visibility: private
importance: high
source_repo: "kcbd-monitor"
related: []
tags: ["kcbd-monitor", "github", "private", "high", "summary"]
---
## kcbd-monitor

> **Problem thesis (required):** kcbd-monitor exists to replace a production legacy indoor-environment monitoring system with a **decoupled, secure, headless architecture** that continuously ingests IoT sensor readings (temperature, humidity, light, substrate), stores them as durable time series grouped by cultivation room, and surfaces live dashboards plus historical charts — including derived agronomic indicators like Vapor Pressure Deficit (VPD) — so growers and technicians can see whole-facility state at a glance, spot drifts before crop damage, and trust that only authorized devices can write data. The refactor preserves the legacy domain logic while eliminating the monolith's security and scalability risks.
