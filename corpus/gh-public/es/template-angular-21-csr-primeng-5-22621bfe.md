---
id: template-angular-21-csr-primeng-5-22621bfe
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — 3. Product / idea"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---
## 3. Product / idea

The repository is a **clone-and-customize template**, not a deployed product. Mental model: **one CSR SPA shell + provider graph + style pipeline + agent rulebook**. After cloning, a developer replaces the placeholder component, adds feature routes and standalone components, and extends for brand tokens. Agents are expected to invoke before any UI work, then delegate to domain skills ( , , etc.). Every new component should ship with a co-located using . The default landing page ( ) is intentionally minimal: centered Spanish welcome text on a near-black PrimeNG surface background—visual proof that Aura tokens, host styling, and Tailwind layout classes coexist.
