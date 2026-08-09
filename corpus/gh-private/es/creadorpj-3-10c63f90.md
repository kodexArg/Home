---
id: creadorpj-3-10c63f90
title: "CreadorPJ — random character sheet generator for Subordinación y Valor — P2 — Inconsistent application of Spanish name and demographic flavor"
visibility: private
importance: normal
source_repo: "CreadorPJ"
related: []
tags: ["creadorpj", "github", "private", "normal", "summary"]
---
### P2 — Inconsistent application of Spanish name and demographic flavor

- **Who hurts:** GMs who want culturally grounded Argentine/Spanish names and ages that correlate with the "poder" stat without inventing demographics from scratch.
- **Pain today:** Random name generators ignore census frequency and age curves; SyV's tone benefits from plausible local naming.
- **How this repo answers:** reads , , and , filters names by median age vs. poder, and accepts frequency-weighted sampling (up to = 500 retries). Optional overrides ( , , ) allow partial manual control from the "+opciones" form panel.
- **Out of scope:** Full character biography, H.I.T.O.S. narrative aspects, or faction assignment — only mechanical sheet fields and cosmetic traits.
