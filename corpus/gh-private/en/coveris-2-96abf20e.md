---
id: coveris-2-96abf20e
title: "Coveris — healthcare capacity planning for Argentine private clinics — P1 — Fragmented staffing data blocks real-time coverage decisions"
visibility: private
importance: high
source_repo: "coveris"
related: []
tags: ["coveris", "github", "private", "high", "summary"]
---

### P1 — Fragmented staffing data blocks real-time coverage decisions - **Who hurts:** HR managers and service chiefs at private clinics (roughly 20–100 employees, 3–15 services) responsible for filling uncovered shifts. - **Pain today:** Answering “who can cover this shift, with the right certifications, without blowing overtime?” requires opening multiple spreadsheets, calling supervisors, and checking paper certification folders. Data goes stale because sheets are edited without coordination. The clinic already has contracts, schedules, reductions, and licenses — but they are not unified. - **How this repo answers:** Coveris models **OrgUnit** (configurable-depth tree), **Position** (weekly hour demand per unit, optional tag requirements), and **Employee** (FSM lifecycle with tag-based eligibility). **Assignment** links supply to demand with preview of hour impact. **Coverage** and **Hours Ledger** compute obligated vs assigned balances in real time, rolling up the org tree. Managers operate through Angular feature routes ( , , , , etc.) backed by a contract-first REST API ( ). - **Out of scope:** Full hospital information systems, patient scheduling, payroll execution, and generic HRIS replacement. Notifications to employees and advanced granular permissions are deferred beyond MVP boundaries in the PRD.
