---
id: python-telegram-bot-mcp-5-25b39bf9
title: "python-telegram-bot-mcp — MCP bridge for Telegram Bot API via python-telegram-bot — 3. Product / idea"
visibility: public
importance: normal
source_repo: "python-telegram-bot-mcp"
related: ["python-telegram-bot-mcp"]
tags: ["python-telegram-bot-mcp", "github", "public", "normal", "summary"]
---

## 3. Product / idea The **central idea** is a thin **stdio MCP server** that sits between an MCP client (e.g. Claude Code) and Telegram's cloud Bot API: After implementation, an operator will configure the MCP server in their client (e.g. ~/.claude.json), set TELEGRAM_BOT_TOKEN, and invoke tools like send_message or get_me from the agent. Each tool call translates to a single telegram.Bot method invocation; responses return structured JSON (full API response vs summarized — decision pending in PDR.md). The server is **stateless**: no message store, no disk persistence for media, no Application handlers. **Planned module layout** (from PDR.md Fase 0 — not yet in tree): | Path | Role | |------|------| | src/telegram_mcp/__main__.py | CLI entry: python -m telegram_mcp | | src/telegram_mcp/server.py | MCP server bootstrap (FastMCP or official mcp SDK) | | src/telegram_mcp/bot.py | Lazy singleton telegram.Bot | | src/telegram_mcp/config.py | Env-based config (TELEGRAM_BOT_TOKEN, LOG_LEVEL) | | src/telegram_mcp/tools/ | Category modules: info, messaging, media, interactive, etc. |
