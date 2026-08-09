---
id: home-hyprland-4-11353b42
title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — P3 — Desktop affordances on an AGS bar (no GNOME session)"
visibility: private
importance: normal
source_repo: "home-hyprland"
related: []
tags: ["home-hyprland", "github", "private", "normal", "summary"]
---

### P3 — Desktop affordances on an AGS bar (no GNOME session) - **Who hurts:** Hyprland session users who lose GNOME’s idle inhibit, volume UI, and quick access to host services (local LLM API) when the bar is custom. - **Pain today:** Gtk.Application.inhibit is a no-op without gnome-session; stock GTK scales break on layer-shell + GSK GL; audio topology on this host maps HDMI to headphones and motherboard jack to speakers — not discoverable from generic widgets. - **How this repo answers:** AGS bar on portrait HDMI-A-2 only (ags/app.ts, ags/widget/Bar.tsx). **Caffeine** (ags/widget/caffeine.ts): FSM driving systemd-inhibit for idle/sleep block. **Local LLM** (ags/widget/LocalLlm.tsx): scans host GGUF dir, writes selection file, manages local-llm.service, readiness via OpenAI-compatible /v1/models probe, VRAM header via nvidia-smi, 90s load timeout for 8 GB GPU. **Volume**: custom gesture track (not Gtk.Scale) + WirePlumber endpoint classification for speakers/mute/headphones cycle. **Bar mode**: always → temp → hidden with edge peek and Super+B / ags request IPC. Helper scripts cover screenshots (grim+slurp), recording (wf-recorder), reveal-all windows, screen share (kdx-share). - **Out of scope:** Packaging local-llm itself (lives under host ~/Services/local-llm/); voice stack (dictation/live binds commented paused in hyprland.lua); capture toggle panel in bar (commented
