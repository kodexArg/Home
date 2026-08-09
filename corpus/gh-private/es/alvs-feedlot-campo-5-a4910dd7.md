---
id: alvs-feedlot-campo-5-a4910dd7
title: "ALVS Feedlot Campo — feedlot traceability and client accounting — P4 — Role-safe multi-tenant visibility"
visibility: private
importance: high
source_repo: "alvs-feedlot-campo"
related: []
tags: ["alvs-feedlot-campo", "github", "private", "high", "summary"]
---

### P4 — Role-safe multi-tenant visibility - **Who hurts:** Boarding clients ( ) who must never see another client's animals or balance; staff who need full-yard read access. - **Pain today:** Screen-level hiding is fragile; a single API leak exposes competitor data. - **How this repo answers:** Cognito authenticates; Django Groups authorize ( ). Six operational roles in map to per-area DRF permission classes. are confined to their bound via and — mismatches return 403, fail-closed ( , , ). - **Out of scope:** Cognito-group-based RBAC; per-establishment object ACLs beyond current client binding (noted as open design in ).
