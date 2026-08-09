---
id: syv-map-4-ddc47a52
title: "syv-map — Living cartographic editor for the SyV universe (Ciudad Dársena) — P3 — Lightweight local persistence without a dedicated backend"
visibility: public
importance: normal
source_repo: "syv-map"
related: ["gh-syv-map"]
tags: ["syv-map", "github", "public", "normal", "summary"]
---
### P3 — Lightweight local persistence without a dedicated backend

- **Who hurts:** Solo authors who want "edit all the time" locally without provisioning Postgres, auth, or Cloudflare bindings—yet need durability beyond .
- **Pain today:** Pure static GeoJSON in requires manual file replacement after every edit session; browser is fragile and was explicitly removed from this codebase.
- **How this repo answers:** Astro API routes ( ) backed by in provide CRUD for layer metadata and GeoJSON payloads. plus act as **seed canon**; and the UI action re-import disk seeds into SQLite. A committed ships working state in-repo. Schema is plain SQLite designed to port to Cloudflare D1 later (driver swap only).
- **Out of scope:** Portable GeoJSON export button (PRD option A)—not implemented yet. Production edge deployment with D1—future work.
