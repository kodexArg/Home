---
id: syv-game-system-2-8c7f8f14
title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — P1 — Platform lock-in before any implementation exists"
visibility: private
importance: normal
source_repo: "syv-game-system"
related: []
tags: ["syv-game-system", "github", "private", "normal", "summary"]
---
### P1 — Platform lock-in before any implementation exists

- **Who hurts:** Anyone who wants to prototype SyV on tabletop, then port to digital, without maintaining parallel rule documents or reverse-engineering informal notes.
- **Pain today:** Game design notes often live in ad-hoc docs, wikis, or engine-specific prototypes. Rules drift; data shapes are implied rather than specified; physical and digital versions diverge.
- **How this repo answers:** The README and state explicit **platform agnosticism**: logic is expressed only in Markdown, JSON Schema, Mermaid, and diagrams — never production code in Python, Rust, C#, etc. The directory defines abstract contracts for , , , , and that any runtime can validate against. The reglamento tree is the human SSOT; schemas are the machine SSOT.
- **Out of scope:** Any runnable game client, server, database, or CI pipeline. The single Python script in is a throwaway ASCII hex visualizer, not part of the design deliverable.
