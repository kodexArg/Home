---
id: commce-3-937b4e1b
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — P2 — Slot machine configuration and win telemetry locked in l"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---
### P2 — Slot machine configuration and win telemetry locked in legacy MySQL

- **Who hurts:** Fleet managers and analysts who need to see which machines sit in which sala, their hold/devol percentages, denominations, and aggregated wins without writing SQL.
- **Pain today:** Machine master data lives in and time-series coin-in/coin-out/win metrics in inside a MySQL database named (configured as Django database). These tables pre-exist; Django models are mirrors.
- **How this repo answers:** exposes **Listado de Máquinas** — a paginated table ( ) over showing id, position, sala, juego, fabricante, modelo, denomination, hold, devol, tipo with percentage formatting for hold/devol. **Beneficios** queries for the last ~40 days, aggregates grouped by , serializes to JSON in the view — though the template currently renders a **hardcoded Google Charts demo** instead of the live JSON payload (integration incomplete).
- **Out of scope:** Real-time slot telemetry ingestion, EGM protocol integration, regulatory reporting export, or write paths to machine configuration.
