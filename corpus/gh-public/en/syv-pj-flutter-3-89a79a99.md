---
id: syv-pj-flutter-3-89a79a99
title: "SyV PJ Flutter — universe-facing character viewer and Diseño Verde mobile client — P2 — Domain logic must not be duplicated in the UI repo"
visibility: public
importance: normal
source_repo: "syv-pj-flutter"
related: ["gh-syv-pj-flutter"]
tags: ["syv-pj-flutter", "github", "public", "normal", "summary"]
---

### P2 — Domain logic must not be duplicated in the UI repo - **Who hurts:** Maintainers of syv-pj (contracts), syv-pj-api (motor), and agents that might otherwise copy Pydantic shapes into Dart by hand. - **Pain today:** Flutter apps often embed business rules (tag validation, attribute derivation, procedural generation), which diverges from the Python motor and breaks reproducible seeds. SyV explicitly separates *what a personaje is* from *how it is shown*. - **How this repo answers:** Permanent constraints in PRD.md, AGENTS.md, and docs/REQUIREMENTS.md: **no backend**, **read-only** toward domain (F-3), HTTP-only data from syv-pj-api (F-2), consult syv-pj before inventing fields (agent rule 2). Ecosystem summaries in docs/ecosystem/ document the exact API routes and PersonajeOut JSON the UI will deserialize — the app is a client, not a second motor. - **Out of scope:** Porting the 8-phase generation pipeline, D1/SQLite access, hito mutation logic, or catalog authoring.
