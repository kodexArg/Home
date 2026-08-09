---
id: kodexbot-3-aa231c2b
title: "kodexBot — offline Hyprland voice dictation and command station — P2 — Unified dictation + commands without duplicate daemons"
visibility: private
importance: high
source_repo: "kodexBot"
related: []
tags: ["kodexbot", "github", "private", "high", "summary"]
---

### P2 — Unified dictation + commands without duplicate daemons - **Who hurts:** The same desktop that previously ran two separate voice services (dictation and voice-live) with two state files, two AGS indicators, and conflicting Super+D binds. - **Pain today:** Two long-lived audio processes compete for the mic; bar widgets lie or conflict; toggling "off" does not reliably release resources; operators cannot tell whether the system is dictating, listening-only, or absent. - **How this repo answers:** One daemon (kodexbot) with a hard switch (Super+D = toggle off/listening), mode toggle (Super+Shift+D = listening ↔ dictating), atomic JSON state SSOT in $XDG_RUNTIME_DIR, and an AGS chip that polls every 150 ms. Off means no process, no state file, no chip — not a paused state. M5 cutover retired legacy dictate/voice-live binds and indicators on the target machine. - **Out of scope:** Multi-user or multi-seat orchestration; D-Bus service exposure (Unix socket IPC is sufficient for one compositor).
