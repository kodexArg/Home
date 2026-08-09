---
id: syv-godot-7-4c4930ec
title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "syv-godot"
related: []
tags: ["syv-godot", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Hot-seat MVP:** Two players alternate on one PC — P1 plans orders, commits; transition screen; P2 plans and commits; server processes WEGO turn; both see resolution animation and updated unit positions. 2. **Online 1v1 (planned):** Two Godot clients connect to FastAPI-backed game room via JWT-authenticated WebSocket; Redis holds active game state; PostgreSQL persists matches and accounts. 3. **Agent-assisted development:** Coding agents use .agent/skills/godot-tools to validate scripts headlessly, inspect scenes, and run .agent/scripts/verify_setup.sh to confirm Godot, directory structure, and Kenney assets.
