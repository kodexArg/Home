---
id: data-engineer-handbook-3-02b7ea5c
title: "Data Engineering Handbook — curated learning hub and bootcamp labs — P2 — Lack of structured hands-on practice for core DE skills"
visibility: public
importance: normal
source_repo: "data-engineer-handbook"
related: ["data-engineer-handbook"]
tags: ["data-engineer-handbook", "github", "public", "normal", "summary"]
---
### P2 — Lack of structured hands-on practice for core DE skills

- **Who hurts:** Learners who consume videos and reading lists but lack a reproducible local environment for dimensional modeling, SCD patterns, and analytical SQL.
- **Pain today:** Tutorials often assume ad-hoc database setup; students struggle with Docker, Postgres restore, and homework DDL without a shared baseline. Week 1 concepts (actor dimensions, quality classes, type-2 SCD) need sample data and query templates.
- **How this repo answers:** outlines a six-week curriculum (dimensional modeling, fact modeling, data quality, pipelines, Spark, Flink/Kafka, KPIs). ships Docker Compose for Postgres 14, a seed, targets ( , , , , , ), lecture-lab SQL under , seed DDL under , and with concrete assignment tasks on the dataset.
- **Out of scope:** Complete materials for weeks 2–6 (fact modeling homework marked "to be added" in introduction). No orchestration platform (Airflow/Dagster) lab in the current tree — only Week 1 dimensional modeling is fully present.
