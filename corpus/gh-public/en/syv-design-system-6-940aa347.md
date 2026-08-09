---
id: syv-design-system-6-940aa347
title: "SyV Design System — Diseño Verde cross-platform token and component library — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "syv-design-system"
related: ["gh-syv-design-system"]
tags: ["syv-design-system", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Token change propagation** — Designer or agent edits tokens/syv.tokens.json, regenerates syv_tokens.dart and syv.tokens.css, and all SyV apps pick up the same olive, celeste, spacing, and motion values. 2. **Web app integration** — An Astro or Svelte 5 app imports three CSS layers (syv.tokens.css, fonts.css, base.css) plus copies or links Syv*.astro / Syv*.svelte components for instant SyV chrome. 3. **Agent onboarding** — An AI assistant reads INDEX.md first for SSOT flow, token tables, component parity matrix, and regeneration notes; CLAUDE.md adds design rules and ecosystem inheritance from the parent SyV workspace. 4. **Design sync** — Tokens and components serve as the durable deliverable for pushing to Claude Design artifacts; showcase.html provides a volatile static specimen (explicitly not trusted as SSOT).
