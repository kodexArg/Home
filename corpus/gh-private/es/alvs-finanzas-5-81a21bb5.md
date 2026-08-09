---
id: alvs-finanzas-5-81a21bb5
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — 3. Product / idea"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---

## 3. Product / idea The mental model is **harness-first, two-service web app**: **Authentication:** Cognito hosted UI performs OIDC; Django exchanges the code, verifies the ID token (PyJWT + JWKS), s a custom keyed on , and opens a **Django DB session** (not bearer tokens in the browser). **Authorization:** Django Groups + DRF permission classes only — Cognito groups/claims are explicitly banned ( , ). Local dev can use when both and are true; deploy checks hard-fail if either leaks into production images. **Frontend interactivity ladder** ( ): server HTML first → HTMX fragments from Django → Svelte islands only when client state demands it. The repo includes shadcn-svelte components, a ChatInput showcase, and middleware-level backstop. **Caching doctrine** ( , ): no Redis ever; + explicit HTTP headers + narrow LocMem/module caches only. **Fork relationship:** retains remote to ; skill cherry-picks compatible upstream commits. Project slug in docs/glossary is , but the **live ephemeral deploy inventory** ( , ) still references the prior slug until resources are re-provisioned under the new name.
