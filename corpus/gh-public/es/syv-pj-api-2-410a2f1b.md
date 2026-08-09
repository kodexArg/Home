---
id: syv-pj-api-2-410a2f1b
title: "SyV Personajes API — procedural character engine (FastAPI + Cloudflare Worker) — P1 — Fragmented character logic across clients"
visibility: public
importance: high
source_repo: "syv-pj-api"
related: ["gh-syv-pj-api"]
tags: ["syv-pj-api", "github", "public", "high", "summary"]
---
### P1 — Fragmented character logic across clients

- **Who hurts:** Frontend authors, narrative designers, and agent builders who need consistent character data.
- **Pain today:** Faction ladders, attribute tables, weighted tag draws, and derived fields (fatigue caps, morale, affiliation strings) live in YAML/Markdown catalogs and procedural rules that would otherwise be reimplemented—or silently diverge—in every consumer.
- **How this repo answers:** A **ports-and-adapters** Python package ( ) loads catalogs from the submodule, runs a **seeded multi-phase generation pipeline** (~20 resolvers across affiliation, identity, attributes, training, equipment, bonds, and prose), computes derived fields in the domain layer, and returns payloads matching the HTTP contract. Contract tests ( ) lock behavior to (symlinked as ).
- **Out of scope:** Rendering character sheets, running ComfyUI jobs end-to-end, or owning the lore encyclopedia (that stays in and catalog data in ).
