---
id: syv-character-kit-2-c8331497
title: "SyV Character Kit — PRD, canonical sheets, and character mocks — P1 — No portable, stack-agnostic character contract for SyV"
visibility: private
importance: high
source_repo: "syv-character-kit"
related: []
tags: ["syv-character-kit", "github", "private", "high", "summary"]
---

### P1 — No portable, stack-agnostic character contract for SyV - **Who hurts:** Teams building battle engines, lore galleries, scenario generators, and narrative tooling across the SyV ecosystem. - **Pain today:** Each consumer invented its own character shape, tag vocabulary, and persistence rules. Stats, ranks, equipment, and squad membership diverged silently between repos. Integrations required ad-hoc translation layers and broke when one side renamed a field. - **How this repo answers:** Publishes synchronized contracts in PRD.md, API.md, MODEL.md, and docs/* — character sheet schema (hoja-modelo), tag system (tag-modelo), squad schema (escuadra-modelo), attribute vocabulary (atributos-y-efectos), and 28 mapped user stories (docs/user-stories.md). The HTTP surface is specified but not implemented here; implementers choose their own stack. - **Out of scope:** Running API server, database, authentication, UI, or deployment. Those belong to downstream application repos.
