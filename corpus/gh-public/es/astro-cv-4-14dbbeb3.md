---
id: astro-cv-4-14dbbeb3
title: "astro-cv — Astro static CV/resume site replacing the legacy SvelteKit portfolio — P3 — Multi-agent development needs scaffolding before features"
visibility: public
importance: normal
source_repo: "astro-cv"
related: ["astro-cv"]
tags: ["astro-cv", "github", "public", "normal", "summary"]
---
### P3 — Multi-agent development needs scaffolding before features

- **Who hurts:** AI agents and human reviewers coordinating parallel feature branches for layout, sidebar, print CSS, accessibility, and deployment.
- **Pain today:** Starting a greenfield UI repo without agent instructions leads to inconsistent conventions, missed a11y/i18n requirements, and ad-hoc CI specs.
- **How this repo answers:** acts as the project constitution (goals, design reference, phased plan, deployment requirements). Three mirrored agent skill trees ( , , ) ship seven locked skills via : Astro usage, Tailwind patterns, accessibility, i18n localization, GitHub Actions workflow specification, technical writing, and TypeScript best practices. Workflow spec: feature branches per component, isolated worktrees when possible, main context coordinates reviews.
- **Out of scope:** A general-purpose agent framework; runtime MCP servers inside the CV site itself.
