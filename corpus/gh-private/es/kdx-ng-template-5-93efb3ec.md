---
id: kdx-ng-template-5-93efb3ec
title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — 3. Product / idea"
visibility: private
importance: high
source_repo: "kdx-ng-template"
related: []
tags: ["kdx-ng-template", "github", "private", "high", "summary"]
---

## 3. Product / idea kdx-ng-template is a **monorepo blueprint** with two deployable surfaces and one contract file: The mental model is **decisions over files**. Cloning gives you a working auth vertical slice plus conventions for every future feature. New domain work follows the users app pattern: custom model → serializer → class-based views → URL includes → pytest coverage → Angular feature folder with lazy loadComponent routes. Frontend organization (frontend/src/app/): - core/ — guards (authGuard, noAuthGuard), functional interceptors (authInterceptor, errorInterceptor), AuthService with signal state, title strategy, selective preloading, global error handler. - layout/ — authenticated Shell and public PublicShell with PrimeNG Menubar. - features/ — lazy feature areas (dashboard, pricing). - auth/ — login card and login page. - showcase/ — design-system gallery (colors, typography, forms, data tables, overlays, etc.). - shared/ — reusable widgets (stat-cards, cookie-consent, not-found). - legal/ — privacy and terms pages. Backend organization (backend/): - config/ — split settings (base, local, production), ASGI, URL routing, security middleware (CSPMiddleware, PermissionsPolicyMiddleware, Api404Middleware). - apps/users/ — custom User model (UUID sub, email login, soft-delete via deleted_at), cookie JWT authentication, login/logout/refresh/me/account-delete/export
