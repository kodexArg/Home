---
id: cowsay-2-c6c602ea
title: "cowsay — deterministic ASCII cow renderer for AI agents — P1 — Inconsistent agent-generated ASCII art"
visibility: public
importance: normal
source_repo: "cowsay"
related: ["cowsay"]
tags: ["cowsay", "github", "public", "normal", "summary"]
---

### P1 — Inconsistent agent-generated ASCII art - **Who hurts:** Users in cowsay mode, agent harness authors, and anyone expecting classic terminal cowsay aesthetics from an LLM. - **Pain today:** Models draw speech balloons and cows from memory. Box borders drift, alignment breaks with wide Unicode, cow faces change between turns, and thought-bubble stems do not match classic cowsay conventions. - **How this repo answers:** A bundled bin/cowsay composes lib/dialog.py (Unicode balloon, terminal-aware wrap) and lib/art.py (cowfile load, faces, active-cow persistence). SKILL.md and AGENTS.md mandate: never freehand art; always run the binary and show only stdout inside one fenced block. - **Out of scope:** General-purpose rich terminal UI, image generation, or replacing the agent's natural-language reasoning — only the final rendered artifact is standardized.
