---
id: syv-pj-4-a503dafd
title: "syv-pj — character contract module for Subordinación y Valor — P3 — Deterministic mechanics, seeded identity, living canon"
visibility: public
importance: normal
source_repo: "syv-pj"
related: ["gh-syv-pj"]
tags: ["syv-pj", "github", "public", "normal", "summary"]
---
### P3 — Deterministic mechanics, seeded identity, living canon

- **Who hurts:** Procedural generators, QA testers, and canon curators who need reproducible drafts but irreversible narrative history once published.
- **Pain today:** Random stat rolls make regression testing impossible; biography re-generation overwrites canon; there is no clear ephemeral-vs-canon lifecycle.
- **How this repo answers:** **Eight-phase procedural flow** ( ): affiliation and identity are seeded; **attributes are deterministic** from rank tables in (zero randomness in / / ); tags are weighted draws from and rules in ; prose is LLM-generated **once** and frozen at canonization. Ephemeral characters ( ) are reproducible via ; canonized characters gain an opaque 8-char patent slug and an append-only of milestones ( , , , , etc.). is idempotent on the seed tuple.
- **Out of scope:** Milestone reversal, arbitrary editing of canonized sheets outside hitos, and versioning of frozen prose.
