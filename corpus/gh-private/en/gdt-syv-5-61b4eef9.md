---
id: gdt-syv-5-61b4eef9
title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — 3. Product / idea"
visibility: private
importance: high
source_repo: "gdt-syv"
related: []
tags: ["gdt-syv", "github", "private", "high", "summary"]
---
## 3. Product / idea

SyV is a **two-player, simultaneous (WEGO)** hex strategy game. Each turn represents four hours of operations. Before the first turn, both players deploy forces simultaneously and hidden in their deployment zones; the server validates and only then starts the turn cycle. The mental model: **Briefing:** Server computes world state and delivers a **different payload per player** — own force in full, enemy only as detected contacts, map deltas visible to that player, command-chain coverage (BFS from HQ per ADR-009). **Orders:** Entirely local on each client. Undo/reset freely. One message closes the phase. **Resolution:** Server executes both players' validated orders in initiative order (ADR-012), streaming events per scoped peer. Cycle repeats until victory (ADR-014, manual chapter 11).
