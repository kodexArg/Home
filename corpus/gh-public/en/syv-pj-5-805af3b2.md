---
id: syv-pj-5-805af3b2
title: "syv-pj — character contract module for Subordinación y Valor — P4 — Lore vs. mechanics separation"
visibility: public
importance: normal
source_repo: "syv-pj"
related: ["gh-syv-pj"]
tags: ["syv-pj", "github", "public", "normal", "summary"]
---

### P4 — Lore vs. mechanics separation - **Who hurts:** Lore writers and mechanics authors who would otherwise duplicate faction articles or invent terminology in the character module. - **Pain today:** Character repos become second lore wikis; faction names drift from the universe bible; geography and chronology get re-invented per tool. - **How this repo answers:** docs/diegesis.md explicitly redirects universe context to the external **syv-docs** Obsidian vault (trasfondo, atlas, personajes notables, diégesis narratives). syv-pj holds **operational stereotypes** in resources/personajes/ (shallow molds for generators) while deep biography stays in syv-docs. AGENTS.md mandates universe fidelity — verify terminology against lore SSOT, do not invent geography or factions here. resources/facciones/*.md entries link to lore paths via doc: frontmatter fields without duplicating articles. - **Out of scope:** Owning the SyV universe bible, secondary lore factions (Pueblos del Pantano, Salvajes, Poseídos), or civilian characters without military specialty.
