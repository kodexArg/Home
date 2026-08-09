---
id: cotton-coveris-mvp-4-2961c2fd
title: "Coveris — Healthcare Capacity Planning SaaS — P3 — Demo, staging, and agent-safe development without production data"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp"
related: []
tags: ["cotton-coveris-mvp", "github", "private", "high", "summary"]
---

### P3 — Demo, staging, and agent-safe development without production data - **Who hurts:** Developers, contributors, and AI agents implementing features against realistic clinic scenarios. - **Pain today:** Empty databases block UI work; copying production data risks privacy violations; inconsistent seeds break contract tests. - **How this repo answers:** YAML scenarios (clinic-bienestar, hospital-notti, clinica-francesa) hot-loaded via dev-gated API and Panel de Control UI; showcase route uses isolated mocks per ADR-022. Avatars sync from scenario folders to frontend assets without external image URLs. - **Out of scope:** Production tenant onboarding automation; multi-tenant SaaS billing (pricing page exists as product surface, not full billing backend in MVP scope).
