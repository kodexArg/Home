---
id: coveris-7-2500def5
title: "Coveris — healthcare capacity planning for Argentine private clinics — 3.2 Non-goals"
visibility: private
importance: high
source_repo: "coveris"
related: []
tags: ["coveris", "github", "private", "high", "summary"]
---

### 3.2 Non-goals - Not open source — proprietary license; three named owners hold all rights (README.md). - Not a multi-tenant public marketplace in current scope — single-clinic configuration model with scope isolation via org units and roles. - Supabase Auth, Cloudflare D1, and Neon were explicitly rejected in migration ADRs — Postgres stays vendor-swappable via DSN only. - Mock data must not leak into production pages (ADR-022): only Django seed commands and the /showcase design system may consume mock-data/ and frontend/src/app/shared/mocks/.
