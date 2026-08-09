---
id: kodexbot-5-87328a05
title: "kodexBot — offline Hyprland voice dictation and command station — 3. Product / idea"
visibility: private
importance: high
source_repo: "kodexBot"
related: []
tags: ["kodexbot", "github", "private", "high", "summary"]
---

## 3. Product / idea kodexBot is a **standalone Python system service with a compositor face**, not a plugin or skill. The mental model is a dual-lane pipeline behind a three-state FSM, always visible through an AGS bar chip when active. When the operator hits the hard switch, a daemon spawns, publishes state to a runtime JSON file, and begins capturing 16 kHz mono audio from PipeWire. Silero VAD opens a gate on speech and closes an utterance after sustained silence. Each utterance is transcribed by faster-whisper, pushed to the session stack, and routed: commands execute through hyprctl (Hyprland 0.55 Lua API) or wtype; remaining head text is typed only in dictating (green) mode. In listening (orange) mode, commands still run but nothing is typed. Toggling off tears down the process completely. The **harness** is as important as the code: PRD.md is required context on every agent session; adr/ entries are binding law scanned by frontmatter before edits; bdds/ hold LLM-arbitrated Gherkin contracts; skills/ exposes procedural agent recipes via .agents/skills symlink.
