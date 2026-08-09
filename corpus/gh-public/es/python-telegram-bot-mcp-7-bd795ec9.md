---
id: python-telegram-bot-mcp-7-bd795ec9
title: "python-telegram-bot-mcp — MCP bridge for Telegram Bot API via python-telegram-bot — 3.2 Non-goals"
visibility: public
importance: normal
source_repo: "python-telegram-bot-mcp"
related: ["python-telegram-bot-mcp"]
tags: ["python-telegram-bot-mcp", "github", "public", "normal", "summary"]
---

### 3.2 Non-goals - **Not a user-client MCP** — no Telethon, no phone auth, no personal account sessions (ADR.md alternatives table). - **Not inbound update processing** in early phases — no polling loop or webhook receiver for agent-side "read my Telegram" (PDR.md decision table). - **Not persistent state** — no database, no message archive on disk (PDR.md conventions). - **Not Application / handler framework usage** — direct telegram.Bot calls only (PDR.md conventions). - **Not enabling all ~80+ methods at launch** — phased categories per ADR-002.
