---
id: alvs-finanzas-5-81a21bb5
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — 3. Product / idea"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---

## 3. Product / idea The mental model is **harness-first, two-service web app**: **Authentication:** Cognito hosted UI performs OIDC; Django exchanges the code, verifies the ID token (PyJWT + JWKS), get_or_creates a custom User keyed on sub, and opens a **Django DB session** (not bearer tokens in the browser). **Authorization:** Django Groups + DRF permission classes only — Cognito groups/claims are explicitly banned (docs/AUTH.md, adr-10-auth). Local dev can use /accounts/dev-login/ when both DEBUG and AUTH_DEV_MODE are true; deploy checks hard-fail if either leaks into production images. **Frontend interactivity ladder** (docs/FRONTEND.md): server HTML first → HTMX fragments from Django → Svelte islands only when client state demands it. The repo includes shadcn-svelte components, a ChatInput showcase, and middleware-level Cache-Control: no-store backstop. **Caching doctrine** (docs/CACHE.md, adr-06-cache): no Redis ever; DatabaseCache + explicit HTTP headers + narrow LocMem/module caches only. **Fork relationship:** alvs-finanzas retains upstream remote to astro-drf-aws; kdx-fork-sync skill cherry-picks compatible upstream commits. Project slug in docs/glossary is alvs-finanzas, but the **live ephemeral deploy inventory** (docs/INVENTORY.md, deploy-prod.yml) still references the prior astro-drf-aws slug until resources are re-provisioned under the new name.
