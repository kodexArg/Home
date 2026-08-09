---
id: gdt-syv-0-08e71dfb
title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — Subordinación y Valor (SyV)"
visibility: private
importance: high
source_repo: "gdt-syv"
related: []
tags: ["gdt-syv", "github", "private", "high", "summary"]
---

# Subordinación y Valor (SyV) > **Problem thesis (required):** Subordinación y Valor is a private Godot 4.4.1 project for a simultaneous turn-based strategy game on a multi-level hexagonal grid, set in a post-apocalyptic Argentina (2178). The player is not an omniscient puppeteer but a Commander in a static HQ, issuing orders over a radio chain that can fail, arrive late, or be intercepted. The repository's central engineering bet is an **authoritative headless Godot server** that shares GDScript with the client, enforces **per-player scope** for fog-of-war at the protocol layer, and runs a strict **Briefing → Orders → Resolution** turn cycle. At the time of this summary, the tree is overwhelmingly **design and specification** — twenty-four accepted ADRs, a full game manual, network protocol contracts, and premade squad data — with **no committed Godot source trees** ( , , ) yet on .
