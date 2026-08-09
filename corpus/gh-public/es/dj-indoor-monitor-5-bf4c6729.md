---
id: dj-indoor-monitor-5-bf4c6729
title: "dj-indoor-monitor — Django IoT dashboard for indoor crop sensor monitoring — 3. Product / idea"
visibility: public
importance: normal
source_repo: "dj-indoor-monitor"
related: ["dj-indoor-monitor"]
tags: ["dj-indoor-monitor", "github", "public", "normal", "summary"]
---

## 3. Product / idea The mental model is a **three-tier loop**: (1) **edge collectors** on Raspberry Pi read hardware on intervals defined in YAML and POST JSON payloads to the API; (2) **Django + TimescaleDB** persist atomic rows and serve both REST queries and HTML fragments; (3) **browser dashboard** loads skeleton pages via SSR, then HTMX lazy-loads Plotly chart HTML per sensor/metric. Physical structure is modeled as **Room → Sensor** (relational), while telemetry is stored as denormalized **DataPoint** rows keyed by sensor name string. At read time, optional joins sensor names to rooms via in-memory maps ( in ). Derived metrics include **VPD (Vapor Pressure Deficit)** computed from temperature and humidity in dedicated views ( , documented in and ).
