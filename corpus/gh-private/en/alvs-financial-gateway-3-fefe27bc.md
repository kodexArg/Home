---
id: alvs-financial-gateway-3-fefe27bc
title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — P2 — SharePoint data must not reach browsers without an auth tier"
visibility: private
importance: high
source_repo: "alvs-financial-gateway"
related: []
tags: ["alvs-financial-gateway", "github", "private", "high", "summary"]
---

### P2 — SharePoint data must not reach browsers without an auth tier - **Who hurts:** IT security, compliance, and treasury operators who need Excel-sourced figures without exposing M365 directly. - **Pain today:** Financial Excel files live in Microsoft 365. Serving them raw to a browser would bypass Django authorization and leak source workbooks. - **How this repo answers:** A confidential Entra app registration acquires app-only Graph tokens ( ) using three declared env vars ( , , ). Nine SharePoint workbooks ingest into PostgreSQL via (admin-gated). Every treasury read endpoint requires session auth plus Django group membership ( , , , or ). Responses are cached. - **Out of scope:** User-delegated Graph flows, write-back to SharePoint, or real-time Excel co-authoring. Scheduled ingestion via EventBridge → ECS RunTask is designed but not yet provisioned.
