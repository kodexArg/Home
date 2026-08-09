---
id: kdx-ng-template-6-fddf576e
title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — 3. Product / idea (2)"
visibility: private
importance: high
source_repo: "kdx-ng-template"
related: []
tags: ["kdx-ng-template", "github", "private", "high", "summary"]
---

endpoints, admin, management commands (create_superuser, seed_mock_users), comprehensive pytest suite. Auth uses **httpOnly cookies** (not Authorization: Bearer headers). Angular sends withCredentials: true; the browser attaches access_token and refresh_token cookies. APP_INITIALIZER calls checkAuth() which hydrates from GET /api/auth/me/ with refresh retry. Production target uses SameSite=None; Secure=True for cross-origin Amplify ↔ App Runner; local dev uses SameSite=Lax.
