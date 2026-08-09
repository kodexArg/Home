---
id: openclaw-2-881b5042
title: "OpenClaw — personal multi-channel AI assistant — P1 — AI assistants locked to one UI and one cloud"
visibility: public
importance: high
source_repo: "openclaw"
related: ["openclaw"]
tags: ["openclaw", "github", "public", "high", "summary"]
---
### P1 — AI assistants locked to one UI and one cloud

- **Who hurts:** Power users who live in WhatsApp, Telegram, Slack, and iMessage but want one coherent AI helper; privacy-conscious operators who refuse to route all conversations through a SaaS dashboard.
- **Pain today:** ChatGPT/Claude web UIs are siloed. Per-channel DIY bots require separate auth, session logic, and model wiring. Cloud assistants retain conversation data on vendor infrastructure.
- **How this repo answers:** OpenClaw runs a **local Gateway** (default loopback port 18789) that multiplexes WebSocket RPC, HTTP APIs, Control UI, and channel adapters. Users talk to the assistant on existing messaging surfaces; transcripts and config live under . Model auth supports OAuth subscriptions (Anthropic, OpenAI) and API keys with failover profiles.
- **Out of scope:** Multi-tenant hosted assistant SaaS, team-wide shared knowledge bases without local operator control, or replacing enterprise IT helpdesk products.
