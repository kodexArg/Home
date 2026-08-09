---
id: design-kodexarg-com-4-36d6df00
title: "design.kodexarg.com — kodexArg design system SSOT — P3 — Polished one-file HTML reports for mobile sharing"
visibility: private
importance: high
source_repo: "design.kodexarg.com"
related: []
tags: ["design.kodexarg.com", "github", "private", "high", "summary"]
---

### P3 — Polished one-file HTML reports for mobile sharing - **Who hurts:** An operator who wants to turn markdown summaries into dark, branded HTML artifacts sent over WhatsApp and opened on phones — without a separate design pass each time. - **Pain today:** Generic HTML exports look off-brand; mermaid diagrams break on placeholder collisions; CDN-dependent assets fail in offline in-app webviews; light lavender mermaid theme variables render ugly on dark backgrounds. - **How this repo answers:** The vault distills Presentation Orange into (self-contained , Nunito + DM Mono type, mobile-first 480px column, progressive desktop enhancement). Five complete HTML templates ( , , , , ) serve as copy-paste specimens. defines the canonical block and classDef component kit ( , , , , ). documents Lucide inline SVG conventions for offline WhatsApp webviews. provides Tier-1 static lint (brace collision, bad state ids) and Tier-2 parse when available. preserves the original Presentation Orange spec without re-fetching auth-walled sources. - **Out of scope:** A markdown-to-HTML generator CLI in this repo (generation is expected via the skill elsewhere), email MIME packaging, or server-side report hosting.
