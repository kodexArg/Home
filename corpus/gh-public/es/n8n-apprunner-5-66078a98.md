---
id: n8n-apprunner-5-66078a98
title: "n8n-apprunner — n8n workflow automation on AWS App Runner — 3. Product / idea"
visibility: public
importance: normal
source_repo: "n8n-apprunner"
related: ["n8n-apprunner"]
tags: ["n8n-apprunner", "github", "public", "normal", "summary"]
---

## 3. Product / idea The repository contains **no application source code** beyond Node/npm manifests and AWS App Runner configuration. The mental model is: **GitHub repo → App Runner build → long-running n8n process on port 5678 → RDS Postgres for workflow state → Secrets Manager for credentials**. After deploy, operators use the standard n8n web UI and REST API (provided by the n8n package) to author workflows, webhooks, and integrations. This repo only bootstraps the runtime environment — host binding (N8N_HOST=0.0.0.0, N8N_PORT=5678), production hardening flags (N8N_BLOCK_ENV_ACCESS_IN_NODE, N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES, secure cookies), regional timezone (GENERIC_TIMEZONE=America/Argentina/Mendoza), JSON console logging, and Postgres DB_TYPE=postgresdb with SSL enabled. Local development mirrors production loosely: npm install, then npm run dev which runs dotenv -- n8n start so a local .env (gitignored) can supply secrets without touching apprunner.yaml.
