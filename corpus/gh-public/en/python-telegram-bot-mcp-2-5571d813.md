---
id: python-telegram-bot-mcp-2-5571d813
title: "python-telegram-bot-mcp — MCP bridge for Telegram Bot API via python-telegram-bot — P1 — Telegram MCP servers that hijack user accounts instead of bots"
visibility: public
importance: normal
source_repo: "python-telegram-bot-mcp"
related: ["python-telegram-bot-mcp"]
tags: ["python-telegram-bot-mcp", "github", "public", "normal", "summary"]
---

### P1 — Telegram MCP servers that hijack user accounts instead of bots - **Who hurts:** Operators who want agents to post to Telegram channels or reply in bot-managed groups without handing a personal phone-authenticated session to an LLM toolchain. - **Pain today:** Community MCP servers such as sparfenyuk/mcp-telegram and chigwell/telegram-mcp route through **Telethon / MTProto**, acting as a **user client**. That requires phone number login, persistent session files, and grants the agent capabilities tied to a human account — far broader than Bot API scope and harder to revoke cleanly. - **How this repo answers:** ADR-001 commits to **Bot API only** via python-telegram-bot, authenticated with a **bot token** from BotFather (TELEGRAM_BOT_TOKEN). The agent's blast radius stays within what the bot is allowed to do (send to chats it knows, manage its own commands, etc.). - **Out of scope:** Reading arbitrary private chats the bot was never added to, impersonating users, or MTProto features absent from the Bot API.
