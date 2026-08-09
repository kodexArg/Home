---
id: template-angular-21-csr-primeng-2-ea59b86d
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — P1 — Empty Angular CLI output lacks the kodexArg UI stack"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---

### P1 — Empty Angular CLI output lacks the kodexArg UI stack - **Who hurts:** Developers starting a new CSR Angular app who need PrimeNG components, Tailwind utilities, and a coherent theme—not bare app.component scaffolding. - **Pain today:** The default Angular workspace has no PrimeNG provider, no Tailwind v4 @import/@plugin wiring, no tailwindcss-primeui bridge, and no src/theme.css SSOT for brand tokens. Each project reinvents providePrimeNG, PostCSS config, and global styles. - **How this repo answers:** Pre-configured app.config.ts registers providePrimeNG({ theme: { preset: Aura } }), provideHttpClient(), provideAnimationsAsync(), and router features (withComponentInputBinding, withInMemoryScrolling). src/styles.css imports Tailwind v4 and the PrimeUI plugin; src/theme.css centralizes @theme tokens and :root CSS variables per AGENTS.md. A minimal Home route proves dark-surface styling via PrimeNG CSS variables (var(--p-surface-950)). - **Out of scope:** Server-side rendering (SSR), backend APIs, authentication, database layers, or deployment IaC—the routing skill *documents* AWS Amplify patterns as guidance for downstream apps but this template ships no amplify/ tree or CI deploy workflow.
