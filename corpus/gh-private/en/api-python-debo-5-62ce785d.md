---
id: api-python-debo-5-62ce785d
title: "API Python DEBO — read-only MSSQL facade for YPF station operations — 3. Product / idea"
visibility: private
importance: high
source_repo: "api-python-debo"
related: []
tags: ["api-python-debo", "github", "private", "high", "summary"]
---

## 3. Product / idea The central idea is an **API facade** — not a protocol proxy. The service **reads** DEBO, **applies business rules**, and **publishes JSON** for internal consumers. It is the query side of a lightweight CQRS split: DEBO remains authoritative for writes; this service is read-only.
