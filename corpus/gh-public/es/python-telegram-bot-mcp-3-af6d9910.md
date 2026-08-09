---
id: python-telegram-bot-mcp-3-af6d9910
title: "python-telegram-bot-mcp — MCP bridge for Telegram Bot API via python-telegram-bot — P2 — No 1:1 MCP mapping to the dominant Python Telegram library"
visibility: public
importance: normal
source_repo: "python-telegram-bot-mcp"
related: ["python-telegram-bot-mcp"]
tags: ["python-telegram-bot-mcp", "github", "public", "normal", "summary"]
---

### P2 — No 1:1 MCP mapping to the dominant Python Telegram library - **Who hurts:** Python-first teams and agent harness authors who already document bots with python-telegram-bot and want MCP tools that mirror official method names and parameters. - **Pain today:** Agents either call raw HTTPS Bot API endpoints (reimplementing serialization and error handling) or use non-Python MCP stacks (telegraf, grammY). Documentation for MCP tools does not align with the library's method reference. - **How this repo answers:** ADR-002 defines **strict naming**: → MCP tool with the same primitive parameters; complex types like pass as JSON strings deserialized server-side. Operators can use python-telegram-bot docs as the tool reference. - **Out of scope:** Replacing python-telegram-bot's handler model for long-running polling bots inside this MCP server — planned design uses directly for **outbound, stateless API calls**.
