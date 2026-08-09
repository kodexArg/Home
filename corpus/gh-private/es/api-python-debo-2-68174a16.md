---
id: api-python-debo-2-68174a16
title: "API Python DEBO — read-only MSSQL facade for YPF station operations — P1 — Safe read access to a live transactional DEBO database"
visibility: private
importance: high
source_repo: "api-python-debo"
related: []
tags: ["api-python-debo", "github", "private", "high", "summary"]
---

### P1 — Safe read access to a live transactional DEBO database - **Who hurts:** Internal staff who need reports without DB credentials or SQL literacy; operators who must not risk writes on the station management system's live database. - **Pain today:** DEBO is the system of record written by the station POS/back-office stack. Direct SQL access is dangerous, credentials are sensitive, and even read queries can lock or contend with live operations if done carelessly. - **How this repo answers:** Four-layer read-only defense (ADR 007): (1) MSSQL user with only; (2) TLS connection without write autocommit; (3) application repository exposing only parameterized SELECT paths; (4) server-side aggregation with / to avoid locking the operational DB. Code policy: **only SELECT**, never . Tests isolate DEBO via injectable fakes; integration tests are opt-in against the LAN SQL host. - **Out of scope:** Any write path, schema migration, replication, or replacement of DEBO as system of record.
