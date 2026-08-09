---
id: apprunnertest2-0-1fbdca99
title: "AppRunner Test 2 — Django on AWS App Runner integration harness — AppRunner Test 2"
visibility: private
importance: normal
source_repo: "apprunnertest2"
related: []
tags: ["apprunnertest2", "github", "private", "normal", "summary"]
---

# AppRunner Test 2 > **Problem thesis (required):** kodexArg needs a **private, throwaway-but-real** Django application that deploys on **AWS App Runner's native Python 3.11 runtime** — no containers — while exercising the full AWS peripheral stack (RDS Postgres, S3, CloudFront, Secrets Manager). The repo is both a **deployment recipe** (apprunner.yaml + scripts/start.sh) and an **integration test harness** that aborts startup if configuration, connectivity, or S3 write/read checks fail. It is not a production product; it is the proving ground for ALVS-style Django hosting patterns before auth, API, and modern frontend work land.
