---
id: odysseus-4-f40d7b8d
title: "Odysseus — self-hosted AI workspace for chat, agents, and local model workflows — P3 — Safe external agent access to workspace data"
visibility: public
importance: high
source_repo: "odysseus"
related: ["odysseus"]
tags: ["odysseus", "github", "public", "high", "summary"]
---

### P3 — Safe external agent access to workspace data - **Who hurts:** Users of Claude Code, Codex, or other agentic IDEs who want their coding agent to manage Odysseus todos, read email, update memory, or launch Cookbook serves — without handing over admin cookies, SQLite paths, or unrestricted shell. - **Pain today:** Ad-hoc automation via raw database access or browser session hijacking breaks owner scoping and bypasses audit trails; agents confuse reminders (todos with due dates) with calendar events; integration docs are scattered. - **How this repo answers:** Scoped **Codex/Claude Agent API** under ( ) enforces per-token scopes (todos, email, memory, calendar, documents, cookbook). Integration skill packs ship in and with helper scripts and explicit safety rules (no SSH/SQLite bypass). API tokens are created in Settings → Integrations; capabilities are discoverable via . Agent migration from other systems uses a normalized manifest ( , ). - **Out of scope:** Replacing Odysseus's internal agent loop with an external agent runtime; unscoped public API access (auth is mandatory by default).
