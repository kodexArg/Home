---
id: syv-pj-flutter-2-6a42c578
title: "SyV PJ Flutter — universe-facing character viewer and Diseño Verde mobile client — P1 — No authoritative mobile surface for SyV character fichas"
visibility: public
importance: normal
source_repo: "syv-pj-flutter"
related: ["gh-syv-pj-flutter"]
tags: ["syv-pj-flutter", "github", "public", "normal", "summary"]
---

### P1 — No authoritative mobile surface for SyV character fichas - **Who hurts:** Anyone trying to *see* a SyV personaje after generation — writers, GMs, developers testing , and future players of SyV-adjacent games. - **Pain today:** Character data lives in HTTP JSON from the motor and in Markdown contracts in , but without a Flutter client each surface reinvents layout, stat visualization, and faction tone. Generic mobile UI does not convey the clerical-military, neon-glow, lowercase voice of the universe. - **How this repo answers:** Builds a **presentation-only** Flutter app organized by features ( , , ) with all visual chrome coming from — stat tiles ( , ), chips, cards, inputs, and the lockup. is the intentional blank canvas for the character sheet; already frames the universe and routes to generation and design-system inspection. Data will arrive from via a future HTTP seam documented in . - **Out of scope:** Generating, validating, canonizing, or persisting personajes; owning lore text (that is ); running a backend or database.
