---
id: coveris-5-4fccba5e
title: "Coveris — healthcare capacity planning for Argentine private clinics — 3. Product / idea"
visibility: private
importance: high
source_repo: "coveris"
related: []
tags: ["coveris", "github", "private", "high", "summary"]
---
## 3. Product / idea

Coveris is a full-stack web application: an **Angular 21** single-page client talks to a **Django REST Framework** API over same-origin paths. The mental model is three domains — **demand**, **offer**, and **bridge** (assignments) — centered on the **organigram** (org tree). Without the tree there is no “where” for employees, positions, coverage, or hours. Users authenticate (SimpleJWT cookies locally; Cloudflare Access OIDC in production target), receive role-scoped visibility ( , , , per ADR-044/045) further constrained by (subtree scope per ADR-030). Managers design structure and demand in the Control Panel; operators view roster, coverage dashboards, scheduling grids, and economía cluster screens (productividad, costos, preliq, desempeño). The platform is **mid-migration** from AWS (Amplify + ECS Fargate + RDS + Cognito) to **Cloudflare** (Worker serves static Angular build, proxies and to a Django container, Supabase Postgres as ). and encode this target topology; GitHub Actions builds the SPA and deploys on pushes to .
