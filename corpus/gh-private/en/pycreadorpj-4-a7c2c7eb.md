---
id: pycreadorpj-4-a7c2c7eb
title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — P3 — Spanish-first naming and trait grammar"
visibility: private
importance: normal
source_repo: "PyCreadorPJ"
related: []
tags: ["pycreadorpj", "github", "private", "normal", "summary"]
---
### P3 — Spanish-first naming and trait grammar

- **Who hurts:** GMs who want procedurally generated Spanish names and gender-inflected trait text without hand-editing.
- **Pain today:** Generic name generators ignore Spanish frequency distributions and gendered adjective endings required by RyF trait lists.
- **How this repo answers:** filters INE-derived name CSVs by age/power, weighted by frequency. reads and applies gender-specific suffix rules (Mujer/Hombre/Indeterminado placeholder patterns with / markers). Apellidos sampled from .
- **Out of scope:** Localization to other languages; official INE API integration (static CSV snapshots only).
