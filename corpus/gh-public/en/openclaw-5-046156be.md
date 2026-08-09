---
id: openclaw-5-046156be
title: "OpenClaw — personal multi-channel AI assistant — 3. Product / idea"
visibility: public
importance: high
source_repo: "openclaw"
related: ["openclaw"]
tags: ["openclaw", "github", "public", "high", "summary"]
---
## 3. Product / idea

OpenClaw's mental model is **Gateway-centric orchestration**: After , the Gateway runs as a user service (launchd/systemd). The embedded **Pi agent** (derived from pi-mono) executes tools (read/exec/edit/browser/canvas/cron/sessions) inside a configurable workspace ( , default ). Bootstrap files ( , , , , ) inject persona and operating instructions on new sessions. **Skills** (AgentSkills-compatible folders) teach tool usage; **plugins** extend Gateway RPC, HTTP routes, CLI commands, and tools. **Nodes** (iOS/Android/macOS) expose camera, screen recording, location, notifications, and Canvas to the agent. **Voice Wake** and **Talk Mode** add always-on speech via ElevenLabs on supported platforms.
