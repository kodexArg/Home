---
id: dj-rpi-monitor-2-9b4398fa
title: "dj-rpi-monitor — lightweight Django IoT dashboard for Raspberry Pi temperature and humidity — P1 — Minimal central ingest for Raspberry Pi temp/humidity"
visibility: private
importance: low
source_repo: "dj-rpi-monitor"
related: []
tags: ["dj-rpi-monitor", "github", "private", "low", "summary"]
---
### P1 — Minimal central ingest for Raspberry Pi temp/humidity

- **Who hurts:** Someone standing up a Raspberry Pi with a DHT-style sensor who needs a place to POST readings without provisioning PostgreSQL, TimescaleDB, Docker, or a multi-metric schema.
- **Pain today:** Each device logs locally, or scripts write to ad-hoc files; there is no shared API contract, no timestamped history queryable from a browser, and no single identifier ( ) to distinguish multiple Pis on the same network.
- **How this repo answers:** A single DRF accepts with , , (temperature °C), and (humidity %). Valid rows persist via into the model. on the same endpoint returns recent rows, optionally filtered by time window ( path segment) and by query parameter. Logging uses loguru at DEBUG on successful ingest.
- **Out of scope:** Soil moisture, light, CO₂, VPD derivation, room/sensor registry, authenticated ingestion, rate limiting, or multi-tenant isolation.
