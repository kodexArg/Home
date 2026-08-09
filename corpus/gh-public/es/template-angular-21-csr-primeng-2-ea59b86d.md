---
id: template-angular-21-csr-primeng-2-ea59b86d
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — P1 — Empty Angular CLI output lacks the kodexArg UI stack"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---

### P1 — Empty Angular CLI output lacks the kodexArg UI stack - **Who hurts:** Developers starting a new CSR Angular app who need PrimeNG components, Tailwind utilities, and a coherent theme—not bare scaffolding. - **Pain today:** The default Angular workspace has no PrimeNG provider, no Tailwind v4 / wiring, no bridge, and no SSOT for brand tokens. Each project reinvents , PostCSS config, and global styles. - **How this repo answers:** Pre-configured registers , , , and router features ( , ). imports Tailwind v4 and the PrimeUI plugin; centralizes tokens and CSS variables per . A minimal route proves dark-surface styling via PrimeNG CSS variables ( ). - **Out of scope:** Server-side rendering (SSR), backend APIs, authentication, database layers, or deployment IaC—the routing skill *documents* AWS Amplify patterns as guidance for downstream apps but this template ships no tree or CI deploy workflow.
