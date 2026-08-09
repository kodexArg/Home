---
id: template-angular-21-csr-primeng-6-89273e44
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Bootstrap a new frontend:** Clone template, run install and dev server, confirm black/white smoke-test home page, begin adding routed feature components under src/app/. 2. **Agent-driven feature work:** Agent reads kdx-design-system-use → picks PrimeNG primitives → implements standalone OnPush component with signal I/O → writes Vitest spec with PrimeNG test providers. 3. **HTTP-heavy feature:** Agent uses kdx-angular-http patterns (httpResource(), status switch templates with PrimeNG ProgressSpinner/Message) atop the pre-wired provideHttpClient(). 4. **Release hygiene:** Operator invokes kdx-version to draft CHANGELOG.md entries and annotated git tags (CHANGELOG is empty in the template seed).
