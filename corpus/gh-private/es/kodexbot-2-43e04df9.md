---
id: kodexbot-2-43e04df9
title: "kodexBot — offline Hyprland voice dictation and command station — P1 — Offline voice control on a VRAM-constrained Hyprland desktop"
visibility: private
importance: high
source_repo: "kodexBot"
related: []
tags: ["kodexbot", "github", "private", "high", "summary"]
---
### P1 — Offline voice control on a VRAM-constrained Hyprland desktop

- **Who hurts:** A Hyprland power user who wants dictation and spoken compositor commands without sending audio or transcripts to cloud STT/LLM services, and whose GPU has only 8 GB VRAM shared between desktop compositing and ML models.
- **Pain today:** Cloud assistants require network, keys, and privacy tradeoffs. Generic voice tools do not integrate with Hyprland workspace focus, key injection, or AGS state indicators. Running large STT and interpreter models simultaneously on 8 GB VRAM causes OOM unless carefully budgeted.
- **How this repo answers:** A single Python daemon owns the microphone and a three-state FSM (off / listening / dictating). Lane A runs Silero VAD → faster-whisper large-v3-turbo on CUDA (with CPU fallback on OOM) and types at the cursor via wtype/ydotool. Lane B scans every utterance through a regex fast path (~46 µs) then an OpenAI-compatible local LLM for paraphrases; only whitelist-validated actions reach hyprctl or key macros. Models are pinned, downloaded once via , and documented for Turing sm_75 (no bf16, no TensorRT-LLM).
- **Out of scope:** Wake word / always-on assistant personality, cloud fallback, GNOME/X11 support, managing the LLM server process, or free-form shell generation from model output.
