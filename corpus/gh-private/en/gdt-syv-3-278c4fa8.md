---
id: gdt-syv-3-278c4fa8
title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — P2 — Trustworthy multiplayer fog-of-war"
visibility: private
importance: high
source_repo: "gdt-syv"
related: []
tags: ["gdt-syv", "github", "private", "high", "summary"]
---

### P2 — Trustworthy multiplayer fog-of-war - **Who hurts:** Multiplayer strategy developers who cannot rely on client-side filtering to hide enemy positions — any leaked state is exploitable. - **Pain today:** Client-side fog-of-war is trivially bypassed by memory inspection or packet sniffing. Broadcasting full state and hiding it in UI is insecure. - **How this repo answers:** ADR-005 mandates **scope server-side**: the server never serializes information outside a player's scope. Briefing messages (S→C*) are **individualized per peer** via rpc_id(peer, …) — not a broadcast of the same packet. Enemy contacts appear only as opaque IDs with fidelity stamps (FIRM, STALE, CONTACT), never with true composition or morale. The protocol/ directory is the auditable contract: every server→client message declares a **Nota de scope** clause. Triangulation intelligence (post–"El Fin de los Secretos" setting) is computed server-side and scoped per receiving player (ADR-015, ADR-020). - **Out of scope:** Anti-cheat for modified clients beyond architectural non-leakage; matchmaking and player authentication (future production concerns per docs/ARCHITECTURE.md).
