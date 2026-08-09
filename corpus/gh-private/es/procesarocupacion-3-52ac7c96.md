---
id: procesarocupacion-3-52ac7c96
title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — P2 — Archiving session-level slot telemetry alongside occupancy"
visibility: private
importance: normal
source_repo: "ProcesarOcupacion"
related: []
tags: ["procesarocupacion", "github", "private", "normal", "summary"]
---

### P2 — Archiving session-level slot telemetry alongside occupancy - **Who hurts:** Operations teams comparing device occupancy trends with per-machine financial/session metrics (credits played, jackpots, ticket in/out). - **Pain today:** Session exports ( ) and daily occupation files ( ) accumulate in email and are easy to lose or duplicate. - **How this repo answers:** The committed CSV corpus in the repo root demonstrates the expected artifact shapes and date range; the IMAP harvester saves new attachments with their source filenames for later offline use. - **Out of scope:** Merging occupation and session datasets, reconciling device IDs across file types, or real-time dashboards.
