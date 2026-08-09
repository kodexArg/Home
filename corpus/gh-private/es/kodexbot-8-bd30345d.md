---
id: kodexbot-8-bd30345d
title: "kodexBot — offline Hyprland voice dictation and command station — 4. Technology stack"
visibility: private
importance: high
source_repo: "kodexBot"
related: []
tags: ["kodexbot", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.11–3.12, managed by uv | pyproject.toml requires-python, uv.lock | | Package manager | uv (hatchling wheel build) | pyproject.toml, AGENTS.md §5 | | STT | faster-whisper large-v3-turbo, int8_float16 CUDA; CPU fallback + runtime OOM demote | pyproject.toml, src/kodexbot/stt.py, docs/bench.md | | VAD | Silero VAD 6.x, ONNX on CPU | pyproject.toml, src/kodexbot/vad.py | | Audio capture | sounddevice → PipeWire, 16 kHz mono | src/kodexbot/audio.py, REQUIREMENTS.md | | Intent / routing | Regex rules → OpenAI-compatible LLM → whitelist router | src/kodexbot/rules.py, interpreter.py, router.py | | Session memory | sqlite-vec (pinned pre-v1) | src/kodexbot/stack.py, adr/adr-05-stack.md | | Compositor integration | hyprctl Lua dispatch, wtype/ydotool typing | src/kodexbot/actions.py, contrib/hyprland-binds.lua | | Desktop UI | AGS KodexbotChip polling state SSOT | contrib/ags-kodexbot-chip.ts, adr/adr-08-interface.md | | TTS (fixtures / planned feedback) | Piper voices | pyproject.toml, scripts/download-models.sh | | Reserved / optional | hassil (template matching), openwakeword (optional extra) | pyproject.toml optional-deps | | CUDA runtime | nvidia-cublas-cu12, nvidia-cudnn-cu12 preloaded for CUDA 13 hosts | pyproject.toml,
