---
id: alvs-km-gw-6-78c71a3f
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Authenticated operator opens the site** — OIDC login via Google through Cognito, Django session established, /api/me/ returns identity and groups, theme cookie set for flash-free SSR. 2. **Operator uses ChatUI to navigate** — types natural language, router returns a closed action (navigate/confirm) from the permission-filtered registry, audit row written, no generated prose. 3. **Backend reads M365/SharePoint** — app-only Graph token acquired, workbook cells or future ingestion endpoints serve data under Django auth, never exposing SharePoint URLs to unauthenticated clients. 4. **Developer or agent adds a feature** — checks PRD and ADRs, adds API row before code, writes BDD/TDD spec, passes harness hooks and guardian review, merges to main, promotes via prod branch deploy.
