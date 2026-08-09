---
id: alvs-km-gw-0-1ddb2bed
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — ALVS km-gw"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---

# ALVS km-gw > **Problem thesis (required):** Grupo ALVS needs a knowledge-management web gateway (km-gw) that lets authenticated staff reach company information originating in Microsoft 365 and SharePoint without exposing those estates directly. This private repository is a production-oriented instance scaffolded from the astro-drf-aws template: an Astro 7 SSR frontend and a Django 6 + DRF backend on two AWS Fargate services, backed by PostgreSQL, gated by Cognito authentication and Django RBAC, with a ChatUI surface that is actually a security-conscious router (not a chatbot) and a vendored AI harness that enforces PRD, ADR, and API contracts on every change.
