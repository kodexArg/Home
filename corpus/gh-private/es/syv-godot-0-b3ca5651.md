---
id: syv-godot-0-b3ca5651
title: "Subordinación y Valor — WEGO hex strategy (Godot 4.4 + FastAPI) — Subordinación y Valor (SyV-Godot)"
visibility: private
importance: normal
source_repo: "syv-godot"
related: []
tags: ["syv-godot", "github", "private", "normal", "summary"]
---
## Subordinación y Valor (SyV-Godot)

> **Problem thesis (required):** This repository is the **playable implementation workspace** for *Subordinación y Valor* (SyV), a 1v1 simultaneous-turn (WEGO) tactical strategy game on a hexagonal board. It exists to prove the core loop — secret order planning, simultaneous resolution, and state sync — with a **Godot 4.4 thin client** (rendering and input only) backed by an **authoritative server** that owns rules, validation, and deterministic combat. The target architecture is FastAPI + Redis + PostgreSQL behind Traefik; at summary time the tree is in **transitional MVP**: game logic and ENet RPCs run inside Godot headless server scripts, while the Python backend is scaffolded with health endpoints and dependency wiring but not yet the full game API described in the PRD.
