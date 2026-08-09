---
id: sdgd-2-2e4dd1e6
title: "SDGD — Healthcare HR Capacity Planning & Scheduling — P1 — Demand vs. offer blindness in hospital staffing"
visibility: private
importance: high
source_repo: "SDGD"
related: []
tags: ["sdgd", "github", "private", "high", "summary"]
---

### P1 — Demand vs. offer blindness in hospital staffing - **Who hurts:** HR administrators, hospital operations planners, and clinical service chiefs who must ensure services are covered without over- or under-staffing. - **Pain today:** Organigrams count people, not **hours and competencies**. Spreadsheets cannot reliably compute coverage after reductions (Circular 4, lactation, ministerial consignments, union leave), cross-grouping distribution for Régimen 38, or partial/vacant position states. - **How this repo answers:** A PostgreSQL schema models **positions** (demand), **employees** (offer), and **assignments** (the cross). Generated columns (e.g. ) and a DDD hours engine ( , value objects, period strategies) compute real vs. required hours. UI pages ( , , , ) expose CRUD and visual assignment flows with impact preview. - **Out of scope:** Full payroll processing, bidirectional integration with external SGA systems (only stable IDs for manual reconciliation), and multi-role workflows for department heads (planned post-MVP).
