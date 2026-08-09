---
id: astro-cv-2-f210be6f
title: "astro-cv — Astro static CV/resume site replacing the legacy SvelteKit portfolio — P1 — SvelteKit is heavier than a static CV needs"
visibility: public
importance: normal
source_repo: "astro-cv"
related: ["astro-cv"]
tags: ["astro-cv", "github", "public", "normal", "summary"]
---

### P1 — SvelteKit is heavier than a static CV needs - **Who hurts:** The CV owner and anyone maintaining a personal resume site that changes infrequently but must stay visually polished and deploy reliably. - **Pain today:** The prior SvelteKit CV couples runtime framework concerns (hydration, adapter config, client bundles) to what is fundamentally a printable document with light interactivity (sidebar toggle, skill tree collapse, maximize mode). That raises build complexity and migration friction for a site whose primary job is to present structured career data. - **How this repo answers:** Rebuild on **Astro with static output** — pages compile to HTML/CSS with minimal client JavaScript (Flowbite loaded inline for planned interactive controls). astro.config.mjs uses default static behavior with Tailwind via the Vite plugin. Deployment target is GitHub Pages (workflow planned, not yet committed). - **Out of scope:** A dynamic CMS, authenticated admin panel, server-side rendering for personalized views, or replicating a full application shell.
