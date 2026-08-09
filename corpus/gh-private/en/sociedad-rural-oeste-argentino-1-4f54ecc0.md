---
id: sociedad-rural-oeste-argentino-1-4f54ecc0
title: "SROA — institutional website and moderated institutional blog — 1. Identity"
visibility: private
importance: normal
source_repo: "sociedad-rural-oeste-argentino"
related: []
tags: ["sociedad-rural-oeste-argentino", "github", "private", "normal", "summary"]
---

## 1. Identity | Field | Value | |-------|-------| | Org / repo | kodexArg/sociedad-rural-oeste-argentino | | Visibility | private | | Default branch | main | | One-line pitch | Official institutional website and moderated blog for the Sociedad Rural del Oeste Argentino — static/SSR pages, Django API, Google OAuth, contributor workflow, and AWS-hosted deployment. | | Audience | SROA members and allied entities, interested producers evaluating membership, journalists, public officials, general public interested in regional livestock policy, SROA staff (Staff role) and invited contributors (Contributor role), and AI agents working from AGENTS.md and docs/. | The GitHub repository description positions the project as the institutional site plus blog for SROA. Phase 1 (specification) produced a full documentation vault under docs/ with PRD, model, endpoints, architecture, infra, and twelve numbered ADRs. Phase 2 (implementation) is active: deliverable version **v1.1.1** per CHANGELOG.md (2026-05-28), including the horizontal full-viewport home wheel, SEO redirects, robots/sitemap, CI deploy hardening, and auth styling fixes. Canonical agent instructions live in AGENTS.md; CLAUDE.md is a symlink to that file. The .claude/ directory is listed in .gitignore and is not present in the shallow clone — agent SSOT is AGENTS.md plus skills/.
