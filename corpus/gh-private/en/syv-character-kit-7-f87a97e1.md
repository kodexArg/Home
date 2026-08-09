---
id: syv-character-kit-7-f87a97e1
title: "SyV Character Kit — PRD, canonical sheets, and character mocks — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "syv-character-kit"
related: []
tags: ["syv-character-kit", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Implementer** reads API.md + MODEL.md + docs/hoja-modelo.md and builds a REST service that serves ephemeral characters, canonizes them, records milestones, and manages squads — seeding tag_catalogo from tags/**/*.md at startup. 2. **Battle motor developer** reads gddr/02-motor-batalla.md, docs/atributos-y-efectos.md, and docs/escuadra-modelo.md to resolve squad-vs-squad encounters using portable percentage/delta modifiers, loading the two canonical squads (cazadores_de_ricardo, columna_mansilla) as fixtures. 3. **Narrative curator / AI agent** edits mock character notes or tag catalog entries under AGENTS.md rules, runs scripts/validar_escuadras.py for consistency, and uses Obsidian Bases in bases/ to browse rosters — without touching forbidden lore repos.
