---
id: odysseus-3-7312bf19
title: "Odysseus — self-hosted AI workspace for chat, agents, and local model workflows — P2 — Local model serving without terminal expertise"
visibility: public
importance: high
source_repo: "odysseus"
related: ["odysseus"]
tags: ["odysseus", "github", "public", "high", "summary"]
---

### P2 — Local model serving without terminal expertise - **Who hurts:** Self-hosters with GPUs or modest CPUs who want to run open-weight models locally but struggle with download paths, quant selection, serve backends (Ollama, vLLM, llama.cpp, SGLang), Docker GPU passthrough, and remote SSH model hosts. - **Pain today:** Model discovery is manual; VRAM/RAM fit is guesswork; serve jobs fail opaquely; Docker on macOS cannot use Metal GPU; container recreates wipe installed engines unless caches are persisted correctly. - **How this repo answers:** The **Cookbook** subsystem ( , , ) scans hardware ( ), ranks models ( ), downloads via HuggingFace, installs serve dependencies into persisted and volumes, manages tmux-backed serve sessions, and probes endpoints. Docker Compose documents GPU overlay files ( , ) and helper scripts ( , ). Settings UI exposes remote SSH server configuration with generated keys under . - **Out of scope:** Training or fine-tuning models; guaranteed SGLang reliability across all platforms (called out as roadmap work in ); managed cloud GPU provisioning.
