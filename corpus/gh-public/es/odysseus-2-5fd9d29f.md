---
id: odysseus-2-5fd9d29f
title: "Odysseus — self-hosted AI workspace for chat, agents, and local model workflows — P1 — Fragmented personal AI and productivity stack"
visibility: public
importance: high
source_repo: "odysseus"
related: ["odysseus"]
tags: ["odysseus", "github", "public", "high", "summary"]
---

### P1 — Fragmented personal AI and productivity stack - **Who hurts:** Individuals and small teams who use separate products for chat, notes, email triage, calendar, document editing, and local model experimentation — and who cannot or will not route all of that through a cloud provider. - **Pain today:** Context does not travel between tools; research outputs land in chat logs instead of documents; email and calendar live outside the agent's reach; switching between Ollama terminals, web UIs, and file editors breaks flow; cloud AI consoles retain conversation and attachment data on vendor infrastructure. - **How this repo answers:** Ships a single FastAPI application with a unified browser UI ( ) covering chat/agent sessions, deep research, document editor, email inbox, notes/todos, calendar (with CalDAV), gallery/image tools, memory/skills management, and settings — all persisting under a configurable tree. The agent loop ( , ) connects LLM providers to tools (filesystem, shell, web fetch/search, MCP, notes, email, calendar) with owner-scoped authorization and prompt-injection hardening ( ). - **Out of scope:** Multi-tenant SaaS hosting for unrelated customers; fully sandboxed agent execution (shell/filesystem confinement is an acknowledged gap per ); replacing dedicated enterprise mail or calendaring suites at scale.
