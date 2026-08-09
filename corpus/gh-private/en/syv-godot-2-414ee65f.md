---
id: syv-godot-2-414ee65f
title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — P1 — Authoritative WEGO without trusting the client"
visibility: private
importance: normal
source_repo: "syv-godot"
related: []
tags: ["syv-godot", "github", "private", "normal", "summary"]
---
### P1 — Authoritative WEGO without trusting the client

- **Who hurts:** Multiplayer strategy developers building simultaneous-turn games where both players plan in secret and orders resolve at once — any client-side rule logic is exploitable.
- **Pain today:** Thin-client architectures often stall at prototype because transport, order schemas, phase machines, and conflict resolution are intertwined in UI code. WEGO specifically requires hiding opponent orders during planning, then applying all committed orders in one deterministic pass.
- **How this repo answers:** The PRD ( ) defines a five-phase server state machine — LOBBY → PLANNING → PROCESSING → OUTCOME → END — with validating and applying moves. Godot scripts already implement this loop in and : orders queue during PLANNING, both players commit, PROCESSING runs resolver logic, OUTCOME broadcasts new state. exposes RPCs ( , , , ) so clients only send intents and receive scoped state. The long-term plan moves this logic into FastAPI with Redis cache and PostgreSQL persistence; already lists SQLAlchemy, asyncpg, redis, python-jose, and websockets for that migration.
- **Out of scope:** Full SyV rule depth from the design vault (squad hierarchies, tag pipelines, radio interception, fog-of-war scoping). Attack orders return "not implemented yet" in . Victory conditions and turn counter are stubbed ( hardcoded in state
