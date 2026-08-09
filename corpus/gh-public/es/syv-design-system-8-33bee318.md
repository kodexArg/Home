---
id: syv-design-system-8-33bee318
title: "SyV Design System — Diseño Verde cross-platform token and component library — 4. Technology stack"
visibility: public
importance: normal
source_repo: "syv-design-system"
related: ["gh-syv-design-system"]
tags: ["syv-design-system", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | JSON (DTCG tokens), Dart, HTML/CSS, TypeScript (Svelte props) | tokens/syv.tokens.json, flutter/syv_tokens.dart, astro+svelte/svelte/*.svelte | | Frontend | Astro components, Svelte 5 (runes, $bindable, Snippet children) | astro+svelte/astro/, astro+svelte/svelte/ | | Mobile | Flutter token classes + external syv_ui package | flutter/syv_tokens.dart, cross-refs in INDEX.md | | Styling | CSS custom properties, scoped component <style> blocks | astro+svelte/syv.tokens.css, base.css, fonts.css | | Data | None — static design tokens only | — | | Infra / deploy | None in-repo; optional Bun dev preview (gitignored _preview-astro/) | .gitignore, INDEX.md §3 | | AI / agents | CLAUDE.md, INDEX.md as agent front door | CLAUDE.md, INDEX.md | | Tests | None evident | — |
