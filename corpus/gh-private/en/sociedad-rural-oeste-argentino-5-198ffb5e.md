---
id: sociedad-rural-oeste-argentino-5-198ffb5e
title: "SROA — institutional website and moderated institutional blog — 3. Product / idea"
visibility: private
importance: normal
source_repo: "sociedad-rural-oeste-argentino"
related: []
tags: ["sociedad-rural-oeste-argentino", "github", "private", "normal", "summary"]
---

## 3. Product / idea The system is a **two-application product** on a **single public hostname**, split by path at the load balancer: Astro serves all non-API pages (SSR for authenticated routes; build-time limitation led to SSR-only mode per frontend/astro.config.mjs comments), while Django serves /api/*, /admin/, OAuth account routes, and /ws/* WebSockets. The mental model is **backend-first business logic** (ADR-007): Astro renders and proxies; Django owns validation, authorization, Markdown-to-HTML rendering for bodies, email triggers, and realtime fan-out. Public visitors browse institutional content, blog posts, and active events. Registered users comment with reactions. Contributors draft/publish posts and moderate comments on their own posts. Staff moderate all content, manage invitations, and configure editorial reactions/pages in Django admin. The home page (v1.0.0+) is a horizontal "wheel" of full-viewport scenes (hero → events → blog → join CTA) with keyboard, wheel, swipe, and caret navigation — a signature UX differentiator documented in CHANGELOG.md and AGENTS.md. Authentication never stores tokens in the frontend: session cookies issued by Django/allauth after Cognito-brokered Google OAuth. Astro middleware calls GET /api/auth/whoami/ server-side before rendering protected routes. Mutations flow as HTML form POST → Astro SSR route → server-to-server DRF with
