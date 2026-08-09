---
id: syv-pj-4-a503dafd
title: "syv-pj — character contract module for Subordinación y Valor — P3 — Deterministic mechanics, seeded identity, living canon"
visibility: public
importance: normal
source_repo: "syv-pj"
related: ["gh-syv-pj"]
tags: ["syv-pj", "github", "public", "normal", "summary"]
---

### P3 — Deterministic mechanics, seeded identity, living canon - **Who hurts:** Procedural generators, QA testers, and canon curators who need reproducible drafts but irreversible narrative history once published. - **Pain today:** Random stat rolls make regression testing impossible; biography re-generation overwrites canon; there is no clear ephemeral-vs-canon lifecycle. - **How this repo answers:** **Eight-phase procedural flow** (docs/generacion-procedural.md): affiliation and identity are seeded; **attributes are deterministic** from rank tables in resources/rangos/ (zero randomness in cuerpo/mente/alma); tags are weighted draws from resources/catalogos/ and rules in resources/reglas/; historia prose is LLM-generated **once** and frozen at canonization. Ephemeral characters (identidad.slug: null) are reproducible via (semilla, faccion, rango); canonized characters gain an opaque 8-char patent slug and an append-only historial[] of milestones (combate, ascenso, agregar_tag, formacion_lealtad, etc.). POST /canonizar is idempotent on the seed tuple. - **Out of scope:** Milestone reversal, arbitrary editing of canonized sheets outside hitos, and versioning of frozen prose.
