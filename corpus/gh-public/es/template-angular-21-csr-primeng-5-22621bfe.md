---
id: template-angular-21-csr-primeng-5-22621bfe
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — 3. Product / idea"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---

## 3. Product / idea The repository is a **clone-and-customize template**, not a deployed product. Mental model: **one CSR SPA shell + provider graph + style pipeline + agent rulebook**. After cloning, a developer replaces the placeholder Home component, adds feature routes and standalone components, and extends src/theme.css for brand tokens. Agents are expected to invoke kdx-design-system-use before any UI work, then delegate to domain skills (kdx-angular-component, kdx-angular-forms, etc.). Every new component should ship with a co-located *.spec.ts using provideZonelessChangeDetection(). The default landing page (src/app/home/home.ts) is intentionally minimal: centered Spanish welcome text on a near-black PrimeNG surface background—visual proof that Aura tokens, host styling, and Tailwind layout classes coexist.
