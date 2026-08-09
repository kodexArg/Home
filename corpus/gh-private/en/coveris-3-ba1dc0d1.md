---
id: coveris-3-ba1dc0d1
title: "Coveris — healthcare capacity planning for Argentine private clinics — P2 — No single source of truth for demand vs supply"
visibility: private
importance: high
source_repo: "coveris"
related: []
tags: ["coveris", "github", "private", "high", "summary"]
---
### P2 — No single source of truth for demand vs supply

- **Who hurts:** Clinic leadership and operations teams trying to see service-level staffing health at a glance.
- **Pain today:** Demand (how many hours each service needs) and offer (who is actually available after contracts, leave, and reductions) are tracked in different artifacts. Coverage status (vacant, partial, covered, surplus) cannot be computed consistently.
- **How this repo answers:** The backend splits domain apps explicitly: (positions, org units, staffing plans), (hours ledger computations), (assignment FSM + audit), (certifications/contracts as typed tags per ADR-019). Business rules engine ( ) evaluates eligibility at assignment time. Weekly structure and monthly scheduling modules extend demand planning beyond static positions.
- **Out of scope:** Institution-specific collective bargaining rule engines — the system is agnostic; each clinic configures its own structure and tags.
