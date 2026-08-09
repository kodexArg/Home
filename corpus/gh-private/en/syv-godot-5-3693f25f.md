---
id: syv-godot-5-3693f25f
title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — 3. Product / idea"
visibility: private
importance: normal
source_repo: "syv-godot"
related: []
tags: ["syv-godot", "github", "private", "normal", "summary"]
---
## 3. Product / idea

SyV-Godot is a **1v1 WEGO hex tactics game** branded *Subordinación y Valor* ( config name). Players issue secret orders during a planning phase; when both commit, the server resolves all orders simultaneously and pushes the new battlefield state. The MVP supports **hot-seat** play on one machine: the client manages player handoff locally while the server treats connections uniformly ( §9). The **target mental model** (from README and PRD): **Current implementation split:** - **Godot client path:** detects / / headless mode. Client loads , connects via ENet to port 7777. bridges UI actions to RPCs. - **Godot server path:** hosts . Can run headless with or spawn as child process (export builds only; editor warns to run server manually). - **Python backend path:** exposes FastAPI with CORS for Godot, lifespan logging, and health routes only. Package layout reserves , , , , but modules are empty stubs. The game ships Kenney CC0 assets under , , , and for MVP visuals.
