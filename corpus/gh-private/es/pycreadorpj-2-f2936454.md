---
id: pycreadorpj-2-f2936454
title: "PyCreadorPJ — Random character generator for Rápido y Fácil (Subordinación y Valor) — P1 — Tedious NPC stat rolling at the table"
visibility: private
importance: normal
source_repo: "PyCreadorPJ"
related: []
tags: ["pycreadorpj", "github", "private", "normal", "summary"]
---
### P1 — Tedious NPC stat rolling at the table

- **Who hurts:** GMs preparing or running *Subordinación y Valor* sessions who need multiple NPCs with valid RyF stats, skills, and gear.
- **Pain today:** Rolling attributes per class weight tables, sampling skills from large nested JSON, matching inventory to skills, and computing initiative/defense by hand is repetitive and easy to get wrong mid-session.
- **How this repo answers:** implements the full randomization pipeline: class-weighted attributes scaled by a "poder" slider (1–10), skill sampling from , inventory keyed off possessed skills via , Spanish name generation from INE-frequency CSVs, and dice formulas in for initiative (1o3d10) and defense (Esquivar + 10). The route runs the pipeline and auto-saves to .
- **Out of scope:** Player character sheet PDF export, campaign management, multiplayer sync, or rules validation for editions other than this module's data files.
