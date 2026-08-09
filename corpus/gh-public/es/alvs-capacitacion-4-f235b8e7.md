---
id: alvs-capacitacion-4-f235b8e7
title: "ALVS Capacitación IA — interactive Astro presentation and executive workshop kit — P3 — Branded in-room presentation infrastructure"
visibility: public
importance: normal
source_repo: "alvs-capacitacion"
related: ["alvs-capacitacion"]
tags: ["alvs-capacitacion", "github", "public", "normal", "summary"]
---

### P3 — Branded in-room presentation infrastructure - **Who hurts:** Anyone presenting AI content on a corporate monitor who needs fullscreen keyboard navigation, ALVS visual identity, and slide components reusable across workshop iterations. - **Pain today:** PowerPoint exports are static; reveal animations and logo grids for vendor landscapes are tedious to maintain; deploying a deck to a shareable URL requires ad-hoc hosting choices. - **How this repo answers:** implements a single-page deck with Alpine.js: arrow keys, space, and swipe advance slides; toggles fullscreen; a progress bar and slide counter persist. Slide components ( , , , ) accept props for titles, accent highlighting, KPI stats, and closing contact. defines the ALVS palette (dark navy, cyan accent, Space Grotesk typography) via Tailwind v4 . builds static output to for AWS Amplify Hosting. specifies four additional components ( , , , ) and a progressive-reveal feature for a 21-slide "El presente de la AI" narrative—roadmap beyond the current minimal . - **Out of scope:** Multi-user collaboration, presenter notes synced to attendee devices, or server-side analytics on slide views.
