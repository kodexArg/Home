---
id: syv-godot-6-6fbb6266
title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — 3. Product / idea"
visibility: private
importance: normal
source_repo: "syv-godot"
related: []
tags: ["syv-godot", "github", "private", "normal", "summary"]
---

## 3. Product / idea SyV-Godot is a **1v1 WEGO hex tactics game** branded *Subordinación y Valor* (project.godot config name). Players issue secret orders during a planning phase; when both commit, the server resolves all orders simultaneously and pushes the new battlefield state. The MVP supports **hot-seat** play on one machine: the client manages player handoff locally while the server treats connections uniformly (PRD.md §9). The **target mental model** (from README and PRD): **Current implementation split:** - **Godot client path:** scripts/main.gd detects --client / --server / headless mode. Client loads scenes/game/game_screen.tscn, connects via NetworkManager ENet to port 7777. client_game_manager.gd bridges UI actions to RPCs. - **Godot server path:** scenes/server/server_main.tscn hosts server_game_manager.gd. Can run headless with --server or spawn as child process (export builds only; editor warns to run server manually). - **Python backend path:** backend/src/main.py exposes FastAPI with CORS for Godot, lifespan logging, and health routes only. Package layout reserves api/, core/, models/, schemas/, services/ but modules are empty __init__.py stubs. The game ships Kenney CC0 assets under assets/hexagons/, assets/kenney_hexagon-kit/, assets/kenney_board-game-icons/, and assets/fonts/ for MVP visuals.
