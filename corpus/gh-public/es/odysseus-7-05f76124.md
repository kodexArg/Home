---
id: odysseus-7-05f76124
title: "Odysseus — self-hosted AI workspace for chat, agents, and local model workflows — 3.1 North-star use cases"
visibility: public
importance: high
source_repo: "odysseus"
related: ["odysseus"]
tags: ["odysseus", "github", "public", "high", "summary"]
---

### 3.1 North-star use cases 1. **Daily AI workspace:** Operator runs docker compose up, logs in, connects Ollama or an API key in Settings, chats with RAG over personal documents, and saves outputs to the built-in editor. 2. **Local model lab:** Operator uses Cookbook to scan GPU/RAM, download a recommended quant, serve via llama.cpp or vLLM in tmux, and point chat sessions at the new endpoint — persisting caches across container restarts. 3. **Agentic productivity:** Admin enables agent mode; the agent triages email, creates todos with due-date reminders (ntfy/browser), drafts calendar events, and updates memory — while external Claude Code uses a scoped token for the same data via /api/codex/*. 4. **Deep research:** User kicks off a research job that searches the web (SearXNG), reads sources, and generates a cited report without leaving the workspace. 5. **Migration:** User imports memories, skills, and archive documents from another agent via the agent-migration.v1 manifest workflow.
