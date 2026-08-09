---
id: python-telegram-bot-mcp-8-854ed393
title: "python-telegram-bot-mcp — MCP bridge for Telegram Bot API via python-telegram-bot — 4. Technology stack"
visibility: public
importance: normal
source_repo: "python-telegram-bot-mcp"
related: ["python-telegram-bot-mcp"]
tags: ["python-telegram-bot-mcp", "github", "public", "normal", "summary"]
---

## 4. Technology stack Current main contains **documentation only** (no manifests in tree). Stack below is **planned** per ADR.md, PDR.md, and README.md. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python >=3.10 | ADR.md dependencies table | | Telegram client | python-telegram-bot >=22.6 | README.md, ADR.md, PDR.md | | MCP SDK | mcp[cli] >=1.0 **or** FastMCP (pending) | PDR.md Fase 0, decision table | | Transport | MCP stdio | ADR.md architecture diagram | | Remote API | Telegram Bot API (HTTPS) | ADR.md, README.md | | Auth | Bot token via env var | ADR.md security, planned .env.example in PDR.md | | Logging | Python logging, level from LOG_LEVEL | PDR.md conventions | | Data | None (stateless) | PDR.md conventions | | Infra / deploy | Local stdio MCP; no CI or container files yet | tree scan — absent | | AI / agents | MCP tool surface for agent clients | ADR.md, PDR.md Fase 1 Claude config note | | Tests | Manual agent tests per phase; no test harness in tree | PDR.md success criteria |
