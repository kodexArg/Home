---
id: cowsay-6-4b92299c
title: "cowsay — deterministic ASCII cow renderer for AI agents — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "cowsay"
related: ["cowsay"]
tags: ["cowsay", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Chat cowsay mode:** User says /cowsay; agent resolves SKILL_ROOT, computes wrap width from COLUMNS / stty, pipes full answer through bin/cowsay, displays stdout only. 2. **One-shot render:** User says /cowsay hello world or pipes CLI text; binary renders once without entering persistent mode. 3. **Art swap:** User names a stem from -l (default, moose, tux bundled); agent runs --set-cow <stem> and confirms with a rendered message showing the new animal. 4. **Local CLI / scripting:** Developer runs printf 'moo' | bin/cowsay or bin/cowsay -l without any agent involved. 5. **Custom cows:** Operator drops *.cow into cows/ or sets COWPATH; dialog logic unchanged.
