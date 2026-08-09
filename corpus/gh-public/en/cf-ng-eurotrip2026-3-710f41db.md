---
id: cf-ng-eurotrip2026-3-710f41db
title: "Eurotrip 2026 — Angular trip companion on Cloudflare — P2 — Need for a living itinerary that updates in production without local database staging"
visibility: public
importance: normal
source_repo: "cf-ng-eurotrip2026"
related: ["cf-ng-eurotrip2026"]
tags: ["cf-ng-eurotrip2026", "github", "public", "normal", "summary"]
---

### P2 — Need for a living itinerary that updates in production without local database staging - **Who hurts:** The repo owner-developer iterating quickly while the trip is underway or being refined pre-departure. - **Pain today:** Traditional apps assume local dev databases, migration review cycles, and separate staging—too heavy for a personal trip site that must reflect reality within hours. - **How this repo answers:** Production-only D1 workflow: data changes via npm run db / wrangler d1 execute --remote, plus 118 versioned SQL files under migrations/ applied automatically on deploy. CI runs migrate → build → deploy → smoke against live API invariants. docs/db-workflow.md documents schema, limits, and recovery (D1 Time Travel + markdown rebuild). - **Out of scope:** Multi-tenant staging environments, offline-first sync, or collaborative real-time editing by arbitrary public users.
