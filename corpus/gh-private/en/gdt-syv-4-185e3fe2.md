---
id: gdt-syv-4-185e3fe2
title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — P3 — Single codebase for client presentation and authoritative server"
visibility: private
importance: high
source_repo: "gdt-syv"
related: []
tags: ["gdt-syv", "github", "private", "high", "summary"]
---

### P3 — Single codebase for client presentation and authoritative server - **Who hurts:** Small teams building turn-based multiplayer who would otherwise maintain parallel rule implementations (e.g., GDScript client + Python/Rust server) that inevitably diverge. - **Pain today:** Split stacks double every rule change and multiply test surface. Hybrid proxy architectures add premature ops complexity. - **How this repo answers:** ADR-003 commits to **Godot 4.4.1 headless** as the authoritative backend, sharing shared/ GDScript with the client. ADR-008 defines the intended layout: shared/ (rules, hex grid, units), client/ (UI, rendering, input), server/ (headless arbiter, turn resolution), protocol/ (message contract). ADR-007 allows a listen-server prototype on localhost with ENet (ADR-006), migrating later to Steam Networking Sockets without renaming RPCs. Turn phases are discrete — the server is idle during the local Orders phase (ADR-004). - **Out of scope:** Actual Godot project scaffolding on main at summary time — directories are specified but not yet present in the clone. Containerized production deploy and Steam SDK integration are documented as future phase only.
