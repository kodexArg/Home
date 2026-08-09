---
id: n8n-apprunner-6-a5f0dce8
title: "n8n-apprunner — n8n workflow automation on AWS App Runner — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "n8n-apprunner"
related: ["n8n-apprunner"]
tags: ["n8n-apprunner", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **First deploy:** Create Secrets Manager entries and optional RDS Postgres → attach IAM role to App Runner service → connect GitHub repo kodexArg/n8n-apprunner, branch main, runtime *Use configuration file* → configure console health check HTTP /healthz → service becomes reachable on the App Runner-assigned hostname. 2. **Local workflow authoring:** Clone repo, npm install, add .env with required n8n variables, npm run dev, open n8n on local port 5678 (per README). 3. **Config iteration:** Adjust non-secret env in apprunner.yaml (log level, timezone, security toggles), push to main, let App Runner redeploy — rotate secrets in Secrets Manager without code changes.
