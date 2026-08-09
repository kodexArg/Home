---
id: kdx-ng-template-5-93efb3ec
title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — 3. Product / idea"
visibility: private
importance: high
source_repo: "kdx-ng-template"
related: []
tags: ["kdx-ng-template", "github", "private", "high", "summary"]
---

## 3. Product / idea kdx-ng-template is a **monorepo blueprint** with two deployable surfaces and one contract file: The mental model is **decisions over files**. Cloning gives you a working auth vertical slice plus conventions for every future feature. New domain work follows the app pattern: custom model → serializer → class-based views → URL includes → pytest coverage → Angular feature folder with lazy routes. Frontend organization ( ): - — guards ( , ), functional interceptors ( , ), with signal state, title strategy, selective preloading, global error handler. - — authenticated and public with PrimeNG Menubar. - — lazy feature areas ( , ). - — login card and login page. - — design-system gallery (colors, typography, forms, data tables, overlays, etc.). - — reusable widgets ( , , ). - — privacy and terms pages. Backend organization ( ): - — split settings ( , , ), ASGI, URL routing, security middleware ( , , ). - — custom model (UUID , email login, soft-delete via ), cookie JWT authentication, login/logout/refresh/me/account-delete/export endpoints, admin, management commands ( , ), comprehensive pytest suite. Auth uses **httpOnly cookies** (not headers). Angular sends ; the browser attaches and cookies. calls which hydrates from with refresh retry. Production target uses for cross-origin Amplify ↔ App Runner; local dev uses .
