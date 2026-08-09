---
id: syv-pj-flutter-7-c31bbb45
title: "SyV PJ Flutter — universe-facing character viewer and Diseño Verde mobile client — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "syv-pj-flutter"
related: ["gh-syv-pj-flutter"]
tags: ["syv-pj-flutter", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Generate and view a personaje** — User picks facción/rango on home, motor returns ephemeral PersonajeOut from GET /generar, ficha screen renders identidad, atributos, tags, historia, derived fields (fatiga_max, filiacion, etc.) using only syv_ui widgets. 2. **Browse canonized roster** — Listado navigates to persisted slugs; detail via GET /personaje/{slug}; historial via GET /personaje/{slug}/historial. 3. **Design-system QA** — Developer or agent opens *diseño verde* showcase to verify token regressions and component parity with upstream syv-design-system before shipping new ficha sections. 4. **Agent iteration loop (Stage 2, planned)** — Python uv harness seeds local motor responses or drives integration tests while AI agents modify UI under explicit user instruction (agent rules currently **forbid** silent edits to lib/, pubspec.yaml, tests).
