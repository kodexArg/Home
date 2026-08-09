---
id: commce-3-937b4e1b
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — P2 — Slot machine configuration and win telemetry locked in l"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---

### P2 — Slot machine configuration and win telemetry locked in legacy MySQL - **Who hurts:** Fleet managers and analysts who need to see which machines sit in which sala, their hold/devol percentages, denominations, and aggregated wins without writing SQL. - **Pain today:** Machine master data lives in DDBB25 and time-series coin-in/coin-out/win metrics in TDATOS inside a MySQL database named slots (configured as Django default database). These tables pre-exist; Django models are managed = False mirrors. - **How this repo answers:** Estadisticas exposes **Listado de Máquinas** — a paginated django_tables2 table (DdbbTable) over Ddbb25 showing id, position, sala, juego, fabricante, modelo, denomination, hold, devol, tipo with percentage formatting for hold/devol. **Beneficios** queries Tdatos for the last ~40 days, aggregates Sum('field_win') grouped by field_sala, serializes to JSON in the view — though the template currently renders a **hardcoded Google Charts demo** instead of the live JSON payload (integration incomplete). - **Out of scope:** Real-time slot telemetry ingestion, EGM protocol integration, regulatory reporting export, or write paths to machine configuration.
