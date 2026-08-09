---
id: dj-indoor-monitor-3-6802cd72
title: "dj-indoor-monitor — Django IoT dashboard for indoor crop sensor monitoring — P2 — Write-optimized time-series storage with read-time analytics"
visibility: public
importance: normal
source_repo: "dj-indoor-monitor"
related: ["dj-indoor-monitor"]
tags: ["dj-indoor-monitor", "github", "public", "normal", "summary"]
---
### P2 — Write-optimized time-series storage with read-time analytics

- **Who hurts:** Developers who model with foreign keys to and hit referential-integrity and lock contention under high-frequency writes from dozens of edge nodes.
- **Pain today:** ORM-heavy ingestion paths slow POST throughput; pre-aggregating every interval at write time multiplies storage and pipeline complexity; chart UIs either load too many raw points or require a separate analytics warehouse.
- **How this repo answers:** is a **string field**, not an FK to , deliberately decoupling ingestion from room/sensor registry ( , ). Composite indexes on , , and related combinations optimize range scans. Read paths use **Pandas resampling** in ( ) and chart views ( , with downsampling to ~120 points via ). Philosophy: **ingest raw, aggregate on read**.
- **Out of scope:** Real-time streaming (Kafka, WebSockets push to browsers); long-term cold archival to object storage; ML-based anomaly detection.
