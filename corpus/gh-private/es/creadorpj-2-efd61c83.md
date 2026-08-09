---
id: creadorpj-2-efd61c83
title: "CreadorPJ — random character sheet generator for Subordinación y Valor — P1 — Slow, error-prone manual character creation at the table"
visibility: private
importance: normal
source_repo: "CreadorPJ"
related: []
tags: ["creadorpj", "github", "private", "normal", "summary"]
---

### P1 — Slow, error-prone manual character creation at the table - **Who hurts:** GMs improvising NPCs mid-session and players who want a pre-rolled character without studying the full rule corpus. - **Pain today:** SyV characters require class-specific attribute distributions (eight stats scaled by a "poder" slider), a subset of skills drawn from class tables with attribute bonuses, gender-inflected physical traits, trait (rasgo) eligibility gated on skill and attribute thresholds, and inventory items probabilistically tied to possessed skills. Doing this with pen and paper or ad-hoc dice takes minutes and invites arithmetic mistakes. - **How this repo answers:** randomizadores.py implements the full pipeline: randomizar_atributos applies class weight columns from clases.json with Gaussian noise and clamps 4–10; randomizar_habilidades samples from skills.json per class; randomizar_caracteristicas and randomizar_rasgos apply gender suffix rules (0/1 placeholders → o/a); randomizar_inventario rolls items keyed to skill names in inventario.json; rolls.py derives initiative (Percepción or Reflejos + 1o3d10 display) and defense (Destreza or Esquivar + 10). One GET to /generar produces a full sheet and auto-saves as ultimo.pickle. - **Out of scope:** Player character advancement, campaign tracking, networked multiplayer, or integration with the separate syv-game-system rules
