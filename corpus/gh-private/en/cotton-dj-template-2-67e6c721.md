---
id: cotton-dj-template-2-67e6c721
title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — P1 — Decision fatigue and inconsistent Django project bootstrappin"
visibility: private
importance: normal
source_repo: "cotton-dj-template"
related: []
tags: ["cotton-dj-template", "github", "private", "normal", "summary"]
---

### P1 — Decision fatigue and inconsistent Django project bootstrapping - **Who hurts:** Solo developers and small teams starting new Django projects who must repeatedly choose UI libraries, auth packages, logging, env config, and deployment targets. - **Pain today:** Each new repo picks different stacks (React vs HTMX, pip vs poetry, scattered vs centralized templates), leading to incompatible conventions, slow onboarding, and no reusable component library. - **How this repo answers:** Documents and will ship a **single curated stack** with pinned dependency versions in docs/dependencies.md, a 19-phase implementation plan in docs/PRD.md, and a non-negotiable constitution.md that locks architectural choices (uv-only, Tailwind 4 exclusive, zero JS, two breakpoints, centralized templates). - **Out of scope:** General-purpose flexibility; multi-tenant SaaS; API-first backends; real-time WebSockets; CMS features.
