---
id: dj-indoor-monitor-0-6424d333
title: "dj-indoor-monitor — Django IoT dashboard for indoor crop sensor monitoring — dj-indoor-monitor"
visibility: public
importance: normal
source_repo: "dj-indoor-monitor"
related: ["dj-indoor-monitor"]
tags: ["dj-indoor-monitor", "github", "public", "normal", "summary"]
---

# dj-indoor-monitor > **Problem thesis (required):** This repository is a **Django monolith** that solves indoor-crop environmental monitoring at the intersection of edge IoT and time-series analytics. Raspberry Pi devices (and similar edge nodes) POST raw sensor readings to a REST API; data lands in TimescaleDB-backed PostgreSQL with write-optimized schema choices; operators query latest values, time-bucketed aggregates, and interactive charts (temperature, humidity, soil moisture, light, VPD) through a server-rendered dashboard powered by HTMX and Plotly. The system prioritizes **fast ingestion** and **read-time aggregation** (Pandas resampling) over pre-computed rollups. As of the README, the **web dashboard is temporarily in maintenance** while the **REST API remains operational** for collection and external queries.
