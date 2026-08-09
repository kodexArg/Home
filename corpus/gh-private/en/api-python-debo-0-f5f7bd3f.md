---
id: api-python-debo-0-f5f7bd3f
title: "API Python DEBO — read-only MSSQL facade for YPF station operations — API Python DEBO"
visibility: private
importance: high
source_repo: "api-python-debo"
related: []
tags: ["api-python-debo", "github", "private", "high", "summary"]
---
## API Python DEBO

> **Problem thesis (required):** This repository specifies and will implement a **read-only API facade** (CQRS-style read model) over the transactional MSSQL database **DEBO**, which backs two YPF-branded fuel stations under a single legal entity. Today the repo is **specification-complete but code-absent** ( , , and do not exist yet). The pain it attacks: internal analysts, collections staff, and commercial users cannot safely or consistently pull fuel-volume reports, client balances, portfolio summaries, and invoice-aging data without opening DEBO directly — where turn boundaries cross midnight, balances are computed not stored, and naming is ambiguous across ~28k clients. The planned service exposes Spanish JSON endpoints with Bearer API-key auth, never mutates DEBO, and deploys eventually as a Windows Service co-located with SQL.
