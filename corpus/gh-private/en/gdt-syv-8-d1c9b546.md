---
id: gdt-syv-8-d1c9b546
title: "Subordinación y Valor — simultaneous turn-based hex strategy in Godot 4.4.1 — 4. Technology stack"
visibility: private
importance: high
source_repo: "gdt-syv"
related: []
tags: ["gdt-syv", "github", "private", "high", "summary"]
---

## 4. Technology stack Derived from README.md, AGENTS.md, docs/ARCHITECTURE.md, ADRs, and skills-lock.json. No package.json, Cargo.toml, or project.godot on main at summary time. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Godot 4.4.1, GDScript | README.md, AGENTS.md, ADR-002, ADR-003 | | Renderer | GL Compatibility | AGENTS.md | | Frontend (planned) | Godot client scenes — UI, hex presentation, input | docs/ARCHITECTURE.md § Estructura | | Backend (planned) | Godot headless --headless, same GDScript | ADR-003, docs/ARCHITECTURE.md | | Networking | ENet localhost (prototype); Steam Networking Sockets (production) | ADR-006, ADR-007, docs/ARCHITECTURE.md | | Data / content | YAML premade squads; ADR-defined entity model | docs/premade-squads/, ADR-009 | | Docs / decisions | Markdown ADRs 001–024, game manual, vision synthesis | docs/adr/, docs/manual/, docs/vision/ | | AI / agents | Claude skills: godot-*, gdt-notion, gdt-notion-backlog-review, kdx-agent-changelog | .claude/skills/, skills/, AGENTS.md | | Backlog | Notion database via MCP (10-field locked schema) | .claude/skills/gdt-notion/SKILL.md | | License | GPL v3 | LICENSE | | Tests | Not present in tree | — |
