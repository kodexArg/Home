---
id: cotton-coveris-mvp-5-a90c48cc
title: "Coveris — Healthcare Capacity Planning SaaS — 3. Product / idea"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp"
related: []
tags: ["cotton-coveris-mvp", "github", "private", "high", "summary"]
---

## 3. Product / idea Coveris treats the **organigram** as the system nucleus: without org units there is no “where” for employees, positions, coverage, or hours. Institutions configure tree depth and labels; positions can exist at any level (not only leaves). **Demand** is expressed as positions with weekly hour requirements and optional tag requirements. **Supply** is employees with a six-state FSM lifecycle, typed tags (contract, qualification, certification, exception) that sum to an effective weekly hours pool, and assignments linking employee hours to positions. **Coverage** aggregates upward; **hours balance** (obligated − assigned) is the central metric—positive means available capacity, negative means overtime. Beyond the MVP core, the codebase implements **Capa 1** (productivity import, pre-liquidation, fractal labor cost, billing catalog) and **Capa 2** (talent review / 9-box desempeño), monthly scheduling, economía hub routes, and productivity audit FSM—documented in docs/goals/, docs/API.md, and extensive ADRs. Auth uses httpOnly cookie JWT locally (SimpleJWT) with a production path to Cognito JWT validation (ADR-008). Roles collapsed to ADMIN, MANAGER, AUDITOR, EMPLOYEE with orthogonal org-unit scope (scope_unit, ADR-030). Frontend is CSR-only Angular on Amplify; API on ECS Fargate behind ALB; RDS PostgreSQL.
