---
id: n8n-apprunner-8-45079d4f
title: "n8n-apprunner — n8n workflow automation on AWS App Runner — 4. Technology stack"
visibility: public
importance: normal
source_repo: "n8n-apprunner"
related: ["n8n-apprunner"]
tags: ["n8n-apprunner", "github", "public", "normal", "summary"]
---

## 4. Technology stack Derived from package.json, apprunner.yaml, and README.md only. Lockfile present (package-lock.json) but not ingested — versions taken from manifests. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Node.js >=20.19 <25 (engines); App Runner nodejs22 runtime | package.json engines; apprunner.yaml runtime | | Application | n8n ^1.101.0 (workflow automation platform) | package.json dependencies | | Data | PostgreSQL via DB_TYPE=postgresdb + RDS host env vars | apprunner.yaml run.env | | Infra / deploy | AWS App Runner (config-file mode), GitHub source | apprunner.yaml, README.md | | Secrets | AWS Secrets Manager bindings | apprunner.yaml run.secrets; README.md | | Local dev | dotenv-cli wrapping n8n start | package.json scripts / devDependencies | | Tests | Placeholder (echo "No tests") | package.json scripts.test |
