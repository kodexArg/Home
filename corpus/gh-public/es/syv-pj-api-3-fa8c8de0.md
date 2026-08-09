---
id: syv-pj-api-3-fa8c8de0
title: "SyV Personajes API — procedural character engine (FastAPI + Cloudflare Worker) — P2 — Ephemeral vs canonical lifecycle without losing reproducibility"
visibility: public
importance: high
source_repo: "syv-pj-api"
related: ["gh-syv-pj-api"]
tags: ["syv-pj-api", "github", "public", "high", "summary"]
---

### P2 — Ephemeral vs canonical lifecycle without losing reproducibility - **Who hurts:** Players and GMs who want to preview random characters, then commit a chosen sheet, and later apply campaign milestones. - **Pain today:** Random generation without stable keys produces duplicates; canonization without idempotency creates twin characters; milestone effects (ascensos, tag changes, attribute deltas) need a single authoritative sheet mutation path. - **How this repo answers:** and produce **efímeros** (no slug, empty history, ). assigns an opaque eight-character slug, stamps , and is **idempotent** on seed triples via a table. applies typed milestone effects (tag add/remove, attribute bumps, specialty changes, loyalty/nemesis tags) and returns the updated sheet. Encounter plates from support battle logging without persisting encounters server-side. - **Out of scope:** Full encounter/battle simulation, Diégesis graph projection, or player authentication.
