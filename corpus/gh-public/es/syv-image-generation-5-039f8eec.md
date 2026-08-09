---
id: syv-image-generation-5-039f8eec
title: "SyV Image Generation — ComfyUI portrait factory for Subordinación y Valor — P3 — Prompt quality must improve over time, not reset every session"
visibility: public
importance: high
source_repo: "syv-image-generation"
related: ["gh-syv-image-generation"]
tags: ["syv-image-generation", "github", "public", "high", "summary"]
---

### P3 — Prompt quality must improve over time, not reset every session - **Who hurts:** Repeat portrait operators and agents who would otherwise re-discover the same failures (photo drift under watercolor CFG, incompatible SDXL LoRAs on Z-Image, sub-optimal 704×960 softness). - **Pain today:** Human taste is implicit; failed prompt combos are forgotten; good combos are not systematically reused. Model paradigm shifted (Pony booru tags → Z-Image natural language + ConditioningZeroOut) making old habits harmful. - **How this repo answers:** prompts/whitelist.md is **calibration memory**: JSON combo entries in ## Buenos (rating ≥ 4) and ## Malos (rating ≤ 2), idempotent promotion from ranked inbox entries. docs/findings-acuarela-calibracion.md captures empirical style findings (CFG 2 for watercolor vs CFG 1 for photo, latent background rules, transparency/rembg notes). docs/z-image-turbo.md is the canonical model reference (resolution buckets, prompting law, LoRA compatibility). workflows/backup/ preserves historical experiment graphs without polluting active set. - **Out of scope:** Not automated ML feedback or RLHF — human rating in entry.md drives whitelist updates.
