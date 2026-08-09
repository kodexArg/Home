---
id: openclaw-3-a35f8686
title: "OpenClaw — personal multi-channel AI assistant — P2 — Multi-channel bot integration is engineering-heavy"
visibility: public
importance: high
source_repo: "openclaw"
related: ["openclaw"]
tags: ["openclaw", "github", "public", "high", "summary"]
---
### P2 — Multi-channel bot integration is engineering-heavy

- **Who hurts:** Solo developers and enthusiasts who want "text my bot on Telegram and WhatsApp" without maintaining six different SDK integrations, media pipelines, and routing rules.
- **Pain today:** Each channel (Baileys/WhatsApp, grammY/Telegram, Bolt/Slack, discord.js, signal-cli, BlueBubbles/iMessage, etc.) has different auth flows, webhook models, media limits, and group-mention semantics. Session continuity across channels is non-trivial.
- **How this repo answers:** Core channels live in (telegram, discord, slack, signal, imessage, web/WhatsApp, etc.); extension channels live in (msteams, matrix, zalo, nostr, voice-call, …). The Gateway normalizes inbound messages, applies routing/allowlist/pairing policies, runs the Pi agent runtime, and delivers replies back. wizard walks through gateway, workspace, channels, and skills setup. Multi-agent routing maps channels/accounts/peers to isolated agent workspaces.
- **Out of scope:** Building yet another generic chat SDK; wrapper channels around already-supported ones without a clear capability gap (per guardrails).
