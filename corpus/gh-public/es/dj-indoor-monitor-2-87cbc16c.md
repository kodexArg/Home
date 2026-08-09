---
id: dj-indoor-monitor-2-87cbc16c
title: "dj-indoor-monitor — Django IoT dashboard for indoor crop sensor monitoring — P1 — Centralized ingestion and query for distributed indoor sensors"
visibility: public
importance: normal
source_repo: "dj-indoor-monitor"
related: ["dj-indoor-monitor"]
tags: ["dj-indoor-monitor", "github", "public", "normal", "summary"]
---

### P1 — Centralized ingestion and query for distributed indoor sensors - **Who hurts:** Operators running multiple grow rooms with Raspberry Pi nodes reading DHT22 (temp/humidity), MCP3008 ADC (soil moisture, light), and similar hardware — each producing readings every few seconds with no shared store or API contract. - **Pain today:** Data siloed on individual devices, manual exports, or fragile scripts posting to inconsistent endpoints; no unified way to ask "what is the latest reading per sensor?" or "what was the hourly average last week?" - **How this repo answers:** Exposes a DRF DataPointViewSet at /api/data-point/ for CRUD ingestion (POST from edge services) plus custom actions /latest/ (last reading per sensor) and /timeframed/ (Pandas-based temporal aggregation with configurable buckets like 30T, 4H, 1D). Ships scripts/rpi_services/rpi-sensor-service.py and rpi-sensor-config.yaml as a reference edge collector that POSTs metric tuples (t, h, s, l) to one or more API URLs. - **Out of scope:** Device firmware OTA, greenhouse automation/actuator control, multi-tenant SaaS billing, cloud-managed IoT platforms (AWS IoT Core, etc.).
