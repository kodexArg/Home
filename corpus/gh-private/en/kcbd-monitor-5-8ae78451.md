---
id: kcbd-monitor-5-8ae78451
title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — 3. Product / idea"
visibility: private
importance: high
source_repo: "kcbd-monitor"
related: []
tags: ["kcbd-monitor", "github", "private", "high", "summary"]
---

## 3. Product / idea kcbd-monitor is the **greenfield rewrite** of the ALVS indoor monitoring product. Physical Raspberry Pi devices report single-character metric codes (t temperature, h humidity, l light, s substrate) with float values and timestamps. The backend stores these as DataPoint rows where sensor is a free string (not a foreign key) for write efficiency; room membership resolves on-read by crossing DataPoint.sensor with the Sensor catalog table linked to Room entities. The mental model is **three runtime tiers plus edge devices**: 1. **Sensor clients** — periodic HTTPS POST batches to /api/data-point/ with Bearer ingest auth. 2. **Headless API** — Django 6 + DRF on ECS Fargate, PostgreSQL on shared ALVS RDS, Django admin for low-frequency catalog/config CRUD. 3. **Static frontend** — Astro 7 builds to static HTML/JS; Svelte 5 islands handle interactivity (charts, polling, login, shadcn-svelte UI). Deployed via Amplify; refreshes data by visibility-aware polling, not WebSockets. Both dev and prod environments are live. The legacy system continues in parallel until a planned pg_dump migration cutover (documented in docs/ARCHITECTURE.md §6). Current project phase is **2B — frontend implemented, gap-closing**: all 12 API endpoints ship; the Astro app has eight routes and 442 Vitest tests; active work is visual polish, sensor grouping, and closing remaining gap-list
