---
id: astro-drf-aws-6-9ea386e7
title: "astro-drf-aws — Astro SSR + Django DRF template on AWS Fargate — 3.1 North-star use cases"
visibility: public
importance: high
source_repo: "astro-drf-aws"
related: ["astro-drf-aws"]
tags: ["astro-drf-aws", "github", "public", "high", "summary"]
---

### 3.1 North-star use cases 1. **Clone and run locally:** docker compose --profile full up -d — Postgres, Django with hot reload, Astro dev server; dev login at /accounts/dev-login/ when DEBUG + AUTH_DEV_MODE; smoke via tests/test_docker_compose.py or start-dev-server skill + chrome-devtools MCP (kodex user only). 2. **Add a backend feature:** Row in docs/API.md → TDD in docs/tdds/ → models/views → guardian astro-drf-aws-api review → pytest green → PR to main. 3. **Add a user-facing feature:** BDD in docs/bdds/ → frontend work via kdx-astro-7 skill → showcase-ready Svelte components (adr-23) → browser verification. 4. **Deploy to production:** Merge to prod branch → deploy-prod.yml runs backend/frontend tests, builds ECR images tagged <env>-<full-git-sha>, runs migrate task, updates ECS services. 5. **Operate the chat router:** Authenticated admins or ai_operators POST utterances; router returns navigate/confirm/escalate/NO_MATCH; assistant answers with page-scoped context on /, /chatui/, /showcase/components/, /profile/.
