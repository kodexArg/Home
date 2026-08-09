---
id: odysseus-5-7a097b9b
title: "Odysseus — self-hosted AI workspace for chat, agents, and local model workflows — 3. Product / idea"
visibility: public
importance: high
source_repo: "odysseus"
related: ["odysseus"]
tags: ["odysseus", "github", "public", "high", "summary"]
---

## 3. Product / idea Odysseus is architected as a **single-process FastAPI server** (app.py) that orchestrates dozens of route modules, a large src/ domain layer, and a vanilla JS frontend served from static/. The mental model is an **admin console for a private AI lab**: authenticated users chat with models (local or API), optionally enable agent mode with tools, and use adjacent productivity surfaces (email, calendar, documents) that the same agent can act on when privileges allow. At startup, app.py wires middleware (CORS, gzip, security headers, request timeouts), initializes AuthManager, mounts ~40 routers, starts background schedulers (email pollers, scheduled tasks, cleanup), and serves HTML shell routes (/, /notes, /calendar, /cookbook, /email, etc.) that load feature-specific JS bundles. **Bundled infrastructure (Docker Compose):** the default stack runs four services — the Odysseus app, ChromaDB (vectors), SearXNG (web search), and ntfy (notifications). Loopback-only port binds are the safe default; operators opt into LAN/Tailscale exposure via APP_BIND and related env vars. **Agent execution path:** user message → routes/chat_routes.py → src/chat_processor.py / src/agent_loop.py → LLM via src/llm_core.py → tool dispatch via src/tool_execution.py and src/tool_implementations.py → admin-gated HTTP loopback for privileged tools (core/middleware.py internal token).
