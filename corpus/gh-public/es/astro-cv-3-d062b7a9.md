---
id: astro-cv-3-d062b7a9
title: "astro-cv — Astro static CV/resume site replacing the legacy SvelteKit portfolio — P2 — CV content locked inside components"
visibility: public
importance: normal
source_repo: "astro-cv"
related: ["astro-cv"]
tags: ["astro-cv", "github", "public", "normal", "summary"]
---

### P2 — CV content locked inside components - **Who hurts:** The author updating experience entries, certifications, or project metadata; future i18n work for Spanish/English toggles; agents tasked with content edits without breaking layout. - **Pain today:** In the legacy SvelteKit CV, career data lives inside component markup. Adding a project or certification requires editing UI files, increasing diff noise and merge conflicts when multiple agents work in parallel. - **How this repo answers:** CLAUDE.md defines a **content-driven architecture** — all CV data will live under src/data/ as structured TypeScript/JSON/YAML modules (profile.ts, experience.ts, education.ts, skills.ts, projects.ts). Components become pure presenters. This directory does not exist in the tree yet; porting content from SvelteKit is an explicit Phase 0 checklist item. - **Out of scope:** A headless CMS integration, database-backed CV, or real-time collaborative editing.
