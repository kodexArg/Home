---
id: design-kodexarg-com-5-588a4b26
title: "design.kodexarg.com — kodexArg design system SSOT — 3. Product / idea"
visibility: private
importance: high
source_repo: "design.kodexarg.com"
related: []
tags: ["design.kodexarg.com", "github", "private", "high", "summary"]
---

## 3. Product / idea The mental model is **token SSOT + static styleguide + report artifact kit**. After clone and bun install, bun run dev serves the styleguide locally. bun run build prerenders to dist/; deploy pushes static assets to a Cloudflare Worker named kodexarg-design with a custom-domain route (configured in wrangler.jsonc). No Astro adapter — the site is fully static; Svelte 5 islands hydrate selectively. Two lineages unify in tokens.css (documented in file header): 1. **CV / document lineage** — mate and pullover scales, Oswald display + Source Sans 3 body, sober document feel, light theme opt-in. 2. **Presentation Orange** — warm charcoal dark canvas, one rationed orange accent, liminal emptiness, components as small lights. The **report lineage** is a deliberate sub-lineage: same ink/cream/orange values but Nunito + DM Mono typography (rounded humanist vs document type), lead orange #ff8c42 (relaxing terminal tone) with deeper #FF6A1A reserved for glow/halo — documented in docs/report-lineage/README.md.
