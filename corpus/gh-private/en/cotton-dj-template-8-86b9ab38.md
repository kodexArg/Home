---
id: cotton-dj-template-8-86b9ab38
title: "Cotton Django Template — opinionated Django 5 starter for component-driven HTMX apps on AWS — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "cotton-dj-template"
related: []
tags: ["cotton-dj-template", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Clone and run** — Developer copies template, has auth (django-allauth + Google OAuth), cotton component library, Tailwind 4, and HTMX working within minutes (docs/installation.md target: < 3 minutes to first runserver). 2. **Add a feature via Spec Kit** — Developer runs /speckit-specify → /speckit-plan → /speckit-tasks → /speckit-implement; AI creates models, views, cotton components, and HTMX templates while respecting the constitution. 3. **Deploy to AWS** — Operator builds Docker image, pushes to ECR, deploys ECS Fargate task with Secrets Manager env injection; ALB health checks hit /health/. 4. **Extend component library** — Developer adds reusable <c-ui.*>, <c-forms.*>, <c-feedback.*>, <c-navigation.*> components under /templates/cotton/ without exterior margins.
