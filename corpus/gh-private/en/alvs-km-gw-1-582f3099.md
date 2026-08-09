---
id: alvs-km-gw-1-582f3099
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — 1. Identity"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---

## 1. Identity | Field | Value | |-------|-------| | Org / repo | kodexArg/alvs-km-gw | | Visibility | private | | Default branch | main (integration); prod is the production promotion line | | One-line pitch | ALVS knowledge-management gateway — SharePoint and M365 data through an authenticated Django API to an Astro SSR frontend, with a Bedrock-backed navigation router and an agent harness that cannot be left. | | Audience | Grupo ALVS internal operators and admins; AI agents working through the project's harness; infrastructure operators deploying to shared ALVS AWS infrastructure in us-east-1. | The deploy workflow sets PROJECT_SLUG: alvs-km-gw, identifying this instance on shared ALVS infrastructure. Much of the documentation and seed defaults still carry the template reference slug astro-drf-aws (compose fallbacks, guardian agent names, some secret ARNs frozen at provisioning time per issue #129) — the repo is a forked template instance whose runtime identity is alvs-km-gw while inheriting the template's harness naming.
