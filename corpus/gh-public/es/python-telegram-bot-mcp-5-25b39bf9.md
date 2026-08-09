---
id: python-telegram-bot-mcp-5-25b39bf9
title: "python-telegram-bot-mcp — MCP bridge for Telegram Bot API via python-telegram-bot — 3. Product / idea"
visibility: public
importance: normal
source_repo: "python-telegram-bot-mcp"
related: ["python-telegram-bot-mcp"]
tags: ["python-telegram-bot-mcp", "github", "public", "normal", "summary"]
---
## 3. Product / idea

The **central idea** is a thin **stdio MCP server** that sits between an MCP client (e.g. Claude Code) and Telegram's cloud Bot API: After implementation, an operator will configure the MCP server in their client (e.g. ), set , and invoke tools like or from the agent. Each tool call translates to a single method invocation; responses return structured JSON (full API response vs summarized — decision pending in ). The server is **stateless**: no message store, no disk persistence for media, no handlers. **Planned module layout** (from Fase 0 — not yet in tree):

| Path | Role | |------|------| | | CLI entry: | | | MCP server bootstrap (FastMCP or official SDK) | | | Lazy singleton | | | Env-based config ( , ) | | | Category modules: , , , , etc. |
