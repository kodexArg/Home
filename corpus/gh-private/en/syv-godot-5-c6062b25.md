---
id: syv-godot-5-c6062b25
title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — P3 — Hex grid and order primitives as tested building blocks"
visibility: private
importance: normal
source_repo: "syv-godot"
related: []
tags: ["syv-godot", "github", "private", "normal", "summary"]
---

### P3 — Hex grid and order primitives as tested building blocks - **Who hurts:** Implementers who need correct axial/cubic hex math and serializable order models before building board UI and combat. - **Pain today:** Hex coordinate bugs silently break movement validation; order dictionaries from RPCs need tolerant parsing across editor, hot-seat, and future HTTP clients. - **How this repo answers:** scripts/utils/hex_utils.gd implements axial ↔ cubic conversion, distance, neighbors, flat-top pixel mapping, and rounding. tests/test_hex_utils.gd is a headless MainLoop self-test. scripts/models/unit_data.gd, order_data.gd, hex_data.gd, and scripts/engine/game_state.gd define Resource-based domain types (unit types Infantry/Officer/Captain, order types MOVE/ATTACK/DEPLOY/DEFEND/CANCEL, map keyed by Vector2i). server_game_manager.gd parses heterogeneous target_coords (strings, arrays, dicts, Vector2i) from RPC payloads. scripts/tests/test_game_loop.gd simulates two-player connect → order → commit → resolution without a live network. - **Out of scope:** Full map generation, terrain modifiers, pathfinding beyond single-step moves, or gdUnit4 integration (mentioned in PRD as future; current Godot tests are lightweight scripts).
