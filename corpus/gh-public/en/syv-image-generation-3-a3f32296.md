---
id: syv-image-generation-3-a3f32296
title: "SyV Image Generation — ComfyUI portrait factory for Subordinación y Valor — P2 — Generated images without metadata are useless for iteration"
visibility: public
importance: high
source_repo: "syv-image-generation"
related: ["gh-syv-image-generation"]
tags: ["syv-image-generation", "github", "public", "high", "summary"]
---

### P2 — Generated images without metadata are useless for iteration - **Who hurts:** Operators rerunning batches, agents comparing styles, and future LoRA trainers who need paired image+caption datasets. - **Pain today:** ComfyUI dumps PNGs into its output directory with filename prefixes only. Without seed, workflow, checkpoint, sampler, CFG, and literal prompt text, results cannot be reproduced or explained. Bulk raw exports bloat git if committed blindly. - **How this repo answers:** Each curated delivery is a folder with ** + ** (prompt literals, generation metadata, empty block for the user). imports recent PNGs from ComfyUI output into ** ** (gitignored bulk scratch). documents end-to-end conventions: slug format, seed mandatory, full literal prompts. Batch scripts write structured JSON to for dry-runs ( , comparison pages, galerías). - **Out of scope:** Not a general DAM or cloud image CDN. Selected previews in inbox are intentionally small and curated, not every raw frame.
