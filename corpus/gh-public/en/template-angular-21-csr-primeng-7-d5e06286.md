---
id: template-angular-21-csr-primeng-7-d5e06286
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — 3.2 Non-goals"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---

### 3.2 Non-goals - **SSR or hybrid rendering** — CSR only; routing skill text mentions Amplify CSR hosting but no SSR adapters ship here. - **NgModules, NgRx, NGXS** — skills explicitly forbid module-based architecture and RxJS-first state (RxJS reserved for HTTP interop only). - **Jasmine, Karma, Jest** — Vitest is the sole unit-test runner (angular.json uses @angular/build:unit-test). - **Reactive Forms / template-driven forms / ngModel** — Signal Forms API is mandatory per kdx-angular-forms. - **TanStack Query or alternate data libraries** — httpResource() and resource() are the prescribed fetch primitives. - **Production deploy pipeline in-repo** — no .github/workflows; .gitignore anticipates future AWS Amplify artifacts but none are committed. - **Bundled docs/ vault** — skills reference docs/08-primeng.md and docs/09-tailwind4.md from sibling kodexArg projects; those files are **not present** in this template tree (see §11).
