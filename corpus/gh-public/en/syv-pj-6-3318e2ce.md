---
id: syv-pj-6-3318e2ce
title: "syv-pj — character contract module for Subordinación y Valor — 3. Product / idea"
visibility: public
importance: normal
source_repo: "syv-pj"
related: ["gh-syv-pj"]
tags: ["syv-pj", "github", "public", "normal", "summary"]
---

## 3. Product / idea The central idea is **documentation as the product**: implementers read PRD.md, MODEL.md, and API.md as binding contracts; curators maintain **machine-readable catalogs** under resources/ as the data SSOT adopted from the former syv-pj-api monolith (per CHANGELOG.md). The mental model: A character sheet has **three data classes** (docs/hoja-personaje.md): **persisted** fields (identity, attributes, tags, historia, historial, metadatos, extras), **derived-at-serve** fields (es_canon, fatiga_max, moral_max, fza_aportada, filiacion), and **volatile combat state** (explicitly out of scope — lives in the battle motor). The universe anchor: **year 2178**, eighteen years of war along the **Zanja de Alsina** in Patagonia; **Confederación Argentina** (regular squads, formal chain of command, clerical attachments) vs. **Ejército Rojo** (worker militias from Bahía Blanca, heterogeneous cells); **Anatema Mecánico** forbids field drones, computing, and smart weapons — coordination is voice, gesture, and pennant.
