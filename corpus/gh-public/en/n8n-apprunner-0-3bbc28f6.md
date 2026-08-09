---
id: n8n-apprunner-0-3bbc28f6
title: "n8n-apprunner — n8n workflow automation on AWS App Runner — n8n-apprunner"
visibility: public
importance: normal
source_repo: "n8n-apprunner"
related: ["n8n-apprunner"]
tags: ["n8n-apprunner", "github", "public", "normal", "summary"]
---
## n8n-apprunner

> **Problem thesis (required):** This repository is a **minimal deployment wrapper** around upstream n8n — not a fork of n8n itself. It exists so kodexArg can run workflow automation on **AWS App Runner** without Docker: connect the GitHub repo, let App Runner consume , and get a production n8n instance backed by **RDS Postgres** with secrets pulled from **Secrets Manager**. The pain it attacks is operational friction (no custom container pipeline) plus the security gap of baking credentials into config files.
