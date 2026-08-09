---
id: template-angular-21-csr-primeng-8-6accead5
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — 4. Technology stack"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---

## 4. Technology stack Derived from package.json, angular.json, .nvmrc, .postcssrc.json, and README.md. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Node 22.22.2; TypeScript 5.9 strict; ES2022 target | .nvmrc, tsconfig.json, package.json | | Frontend framework | Angular 21.2 — standalone, OnPush, signals, zoneless-ready tests | package.json, src/app/app.ts, src/app/app.spec.ts | | UI library | PrimeNG 21.1.x, Aura preset via @primeuix/themes | package.json, src/app/app.config.ts | | Styling | Tailwind CSS 4.1.x, @tailwindcss/postcss, tailwindcss-primeui | package.json, src/styles.css, .postcssrc.json | | HTTP client | HttpClient + httpResource() ready (no sample resource in seed) | src/app/app.config.ts, skills kdx-angular-http | | Build | @angular/build:application (esbuild), @angular/build:dev-server | angular.json | | Tests | Vitest 4.x + JSDOM, @angular/build:unit-test | package.json, angular.json, tsconfig.spec.json | | Formatter | Prettier 3.8 with Angular HTML parser | .prettierrc | | Package manager | npm 10.8.2 (declared in packageManager field) | package.json | | AI / agents | Claude skills (9), Angular CLI MCP | .claude/skills/, .agents/skills/, .mcp.json | | Infra / deploy | Not configured (Amplify paths gitignored for future use) | .gitignore, routing skill prose |
