---
id: syv-design-system-5-46885230
title: "SyV Design System — Diseño Verde cross-platform token and component library — 3. Product / idea"
visibility: public
importance: normal
source_repo: "syv-design-system"
related: ["gh-syv-design-system"]
tags: ["syv-design-system", "github", "public", "normal", "summary"]
---

## 3. Product / idea The central idea is **one SSOT, many targets, framework-agnostic design entities**. Tokens are born platform-neutral in JSON; frameworks are the final *how*, not parallel sources of truth. The aesthetic is **Diseño Verde** — matte military olive-drab 1978 as lead accent, warm near-black ink surfaces, institutional celeste and moss, amber and petróleo as second voices — evolved from the original *Diseño Naranja* (preserved as an ignored local sub-git snapshot, not tracked). Depth is never elevation shadow: it is **one off-center neon-green radial glow per surface** ( at 0.16 opacity), 1.5px hairline borders in , and small austere radii (sm 4 · md 6 · lg 12). Controls are squared and military; mobile-first breakpoints at 0 / 768 / 1024 logical px. The web layer ships eight mirrored components ( , , , , , , , ) in both and , consuming variables. Flutter parity is documented in but widget source lives externally; Flutter-only extras include , , . is domain-specific: a character-sheet attribute control for cuerpo / mente / alma on scale 2–7, with per-stat icons and palette voices (amber, petróleo/amethyst, celeste), editable pips, and keyboard arrows — tying the design system directly to the SyV tabletop RPG data model.
