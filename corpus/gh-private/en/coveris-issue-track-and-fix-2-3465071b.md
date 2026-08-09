---
id: coveris-issue-track-and-fix-2-3465071b
title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — P1 — Inconsistent, slow GitHub issue triage for Coveris"
visibility: private
importance: high
source_repo: "coveris-issue-track-and-fix"
related: []
tags: ["coveris-issue-track-and-fix", "github", "private", "high", "summary"]
---
### P1 — Inconsistent, slow GitHub issue triage for Coveris

- **Who hurts:** Coveris maintainers and on-call engineers managing issues in the target application repository ( by default).
- **Pain today:** Each issue requires manual reading of descriptions, cross-referencing product docs in Obsidian, grepping the Angular/Django codebase, and subjective judgment about severity and fix effort before anyone starts coding.
- **How this repo answers:** The Tracker agent ( ) fetches the live issue via , injects an Obsidian vault index from the target repo's tree, connects to Obsidian MCP for contextual knowledge graph navigation, inspects code read-only in the configured workspace, and returns a structured (original issue text, tracker addendum with root cause, , ). The Router ( ) normalizes those fields into a binary effort/severity matrix and either defers high/high combinations or routes to the Fixer.
- **Out of scope:** Fully automated merge or CI gating; issues requiring architectural redesign are deferred or marked for humans.
