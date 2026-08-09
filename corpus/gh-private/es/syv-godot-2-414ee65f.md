---
id: syv-godot-2-414ee65f
title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — P1 — Authoritative WEGO without trusting the client"
visibility: private
importance: normal
source_repo: "syv-godot"
related: []
tags: ["syv-godot", "github", "private", "normal", "summary"]
---

### P1 — Authoritative WEGO without trusting the client - **Who hurts:** Multiplayer strategy developers building simultaneous-turn games where both players plan in secret and orders resolve at once — any client-side rule logic is exploitable. - **Pain today:** Thin-client architectures often stall at prototype because transport, order schemas, phase machines, and conflict resolution are intertwined in UI code. WEGO specifically requires hiding opponent orders during planning, then applying all committed orders in one deterministic pass. - **How this repo answers:** The PRD (.agent/docs/PRD.md) defines a five-phase server state machine — LOBBY → PLANNING → PROCESSING → OUTCOME → END — with OrderResolver validating and applying moves. Godot scripts already implement this loop in scripts/server/server_game_manager.gd and scripts/server/order_resolver.gd: orders queue during PLANNING, both players commit, PROCESSING runs resolver logic, OUTCOME broadcasts new state. NetworkManager exposes RPCs (submit_order_rpc, commit_turn_rpc, sync_state_rpc, notify_phase_change_rpc) so clients only send intents and receive scoped state. The long-term plan moves this logic into FastAPI with Redis cache and PostgreSQL persistence; backend/pyproject.toml already lists SQLAlchemy, asyncpg, redis, python-jose, and websockets for that migration. - **Out of scope:** Full SyV rule depth from the
