---
id: template-angular-21-csr-primeng-4-5a70ca27
title: "Angular 21 CSR starter — PrimeNG, Tailwind v4, Vitest, agent skills — P3 — AI agents write inconsistent Angular without enforced conventions"
visibility: public
importance: normal
source_repo: "template-angular-21-csr-primeng"
related: ["template-angular-21-csr-primeng"]
tags: ["template-angular-21-csr-primeng", "github", "public", "normal", "summary"]
---

### P3 — AI agents write inconsistent Angular without enforced conventions - **Who hurts:** Operators using Claude Code, Cursor, or similar agents on Angular repos where mixed patterns (NgModules, BehaviorSubject stores, Reactive Forms, Jasmine) slow reviews and break zoneless assumptions. - **Pain today:** Generic agent context lacks stack-specific rules; agents hallucinate PrimeNG APIs, skip tests, or import RxJS for state that should be signals. - **How this repo answers:** Nine linked skills under .claude/skills/ and a mirrored .agents/skills/ tree cover components, forms (Signal Forms API), HTTP (httpResource()), routing, signals, testing (Vitest + zoneless TestBed), design-system usage, Tailwind extension, and version/CHANGELOG tagging. AGENTS.md binds agents to src/theme.css as SSOT and defers feature work to skills. .mcp.json and .vscode/mcp.json wire the **Angular CLI MCP server** (build, devserver, test, modernize, e2e, documentation search, ai_tutor). - **Out of scope:** Hosting agent orchestration, RAG ingestion, or MCP servers beyond Angular CLI—the template only configures the Angular MCP entrypoint.
