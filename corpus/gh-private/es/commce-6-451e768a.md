---
id: commce-6-451e768a
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Shift handoff note:** Supervisor logs in, opens Comunicaciones, posts a short title/body announcement; next shift reads the list ordered by create_date. 2. **Machine floor walk:** Analyst opens Estadisticas → Listado de Máquinas, pages through DDBB25 to verify positions, salas, hold/devol, and game titles. 3. **Sala profitability glance:** Operator opens Beneficios intending to see per-sala win totals for the last 40 days (view prepares data; chart UI not wired to live JSON yet). 4. **Environmental check:** Technician opens Temperatura → 24hs or Semana, inspects Chart.js lines per RPi label and checks ultimo timestamp for staleness.
