---
id: api-python-debo-7-aef5cf10
title: "API Python DEBO — read-only MSSQL facade for YPF station operations — Architecture mental model (planned)"
visibility: private
importance: high
source_repo: "api-python-debo"
related: []
tags: ["api-python-debo", "github", "private", "high", "summary"]
---

### Architecture mental model (planned) Hexagonal layout (from docs/PLAN-IMPLEMENTACION.md): domain/ (pure, no Pydantic), application/ + ports/ (use cases, contracts), adapters/ + infrastructure/ (FastAPI, pymssql, SQLite audit). Open/Closed + Strategy patterns isolate query strategies and partial debt-anchor algorithms behind ports; integration tests act as oracle for unresolved balance anchors.
