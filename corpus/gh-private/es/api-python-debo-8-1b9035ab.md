---
id: api-python-debo-8-1b9035ab
title: "API Python DEBO — read-only MSSQL facade for YPF station operations — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "api-python-debo"
related: []
tags: ["api-python-debo", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **US-001 — Weekly fuel sales:** GET /ventas/semana returns liters grouped by operational date, shift, and fuel type for the current Monday–now window. 2. **US-002 — Single-client AR:** Resolve client by code or name; return balance, total debt (balance + pending delivery notes), or running account statement anchored at last debt-free point. 3. **US-003 — Portfolio balances:** Paginated all-clients balance report matching DEBO's "Saldos de Clientes" export semantics. 4. **US-004 — Invoice aging:** Per-client or portfolio overdue invoices with mora interest, aging buckets (Corriente, 1-30, 31-60, 61-90, +90). 5. **US-000 — Cross-cutting auth:** Every endpoint requires Authorization: Bearer <token>; audit log per request.
