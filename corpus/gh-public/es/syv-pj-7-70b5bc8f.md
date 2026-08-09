---
id: syv-pj-7-70b5bc8f
title: "syv-pj — character contract module for Subordinación y Valor — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "syv-pj"
related: ["gh-syv-pj"]
tags: ["syv-pj", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Procedural cast generation (UC-G01–G05):** A generator requests GET /personaje?faccion=…&rango=…&semilla=…, previews ephemerals, then POST /canonizar to persist with a patent slug and open historial[]. 2. **Narrative diégesis (UC-D01–D06):** An author reads a canonized sheet, writes scenes consistent with tags and historia, registers narrative milestones via POST /personaje/{slug}/evento, and navigates faction/roster graphs via Obsidian wikilinks in example fichas. 3. **Battle/strategy consumption (UC-B*):** A combat motor pulls pruned fields (atributos, equipment tags, derived fza_aportada) without needing prose blocks. 4. **Visual portrait pipeline:** GET /personaje/{slug}/workflow returns a deterministic ComfyUI API-JSON graph (seed from character, LoRA stack from tags) per API.md and docs/prompt-imagen.md (referenced, not fully duplicated here). 5. **Catalog curation:** Editors add a new habilidad or equipo entry as a markdown file under resources/catalogos/; the /meta/{categoria} contract exposes it without code changes.
