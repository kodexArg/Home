---
id: python-telegram-bot-mcp-6-5352ec25
title: "python-telegram-bot-mcp — MCP bridge for Telegram Bot API via python-telegram-bot — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "python-telegram-bot-mcp"
related: ["python-telegram-bot-mcp"]
tags: ["python-telegram-bot-mcp", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Agent sends a text message:** Claude Code calls MCP tool send_message with chat_id and text; server returns message_id confirmation from Telegram. 2. **Operator smoke-test:** Run mcp dev or connect Claude Code after Fase 0; initialize succeeds and capabilities list grows per phase. 3. **Rich outbound content (Fase 2+):** Agent sends photo (URL or file_id), poll, location, or sticker through dedicated tools without custom HTTP glue. 4. **Chat administration (Fase 3+):** Agent queries get_chat, moderates with ban_chat_member, or pins messages via mapped tools — within bot permissions.
