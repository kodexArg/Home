---
id: python-telegram-bot-mcp-4-8832acc6
title: "python-telegram-bot-mcp — MCP bridge for Telegram Bot API via python-telegram-bot — P3 — Unsafe \"enable everything\" MCP surface for ~80+ Bot methods"
visibility: public
importance: normal
source_repo: "python-telegram-bot-mcp"
related: ["python-telegram-bot-mcp"]
tags: ["python-telegram-bot-mcp", "github", "public", "normal", "summary"]
---

### P3 — Unsafe "enable everything" MCP surface for ~80+ Bot methods - **Who hurts:** Security-conscious deployers and testers who must validate each tool before exposing it to an autonomous agent. - **Pain today:** Dumping all methods into MCP at once yields a huge callable surface without incremental test coverage; file-upload semantics (URL vs file_id vs local path) and verbose API responses add operational risk. - **How this repo answers:** phases delivery from scaffolding (Fase 0) through messaging, media, chat management, inline/callback, webhooks/files, and payments/forums (Fases 1–6). Each phase has explicit success criteria and defers risky choices (e.g. local filesystem paths for media) until URL and paths are proven. - **Out of scope:** Receiving inbound updates (polling/webhooks as a consumer) in initial phases — send-only first; inbound update handling is explicitly marked as future work in .
