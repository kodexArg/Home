---
id: alvs-corporate-books-3-e3947667
title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — P2 — Unsafe exposure of M365/SharePoint data to the public web"
visibility: private
importance: high
source_repo: "alvs-corporate-books"
related: []
tags: ["alvs-corporate-books", "github", "private", "high", "summary"]
---

### P2 — Unsafe exposure of M365/SharePoint data to the public web - **Who hurts:** IT security, platform owners, and executives responsible for information governance. - **Pain today:** Publishing company registers or compliance data directly from SharePoint risks anonymous access, inconsistent RBAC, and no unified audit trail at the application layer. - **How this repo answers:** The PRD (docs/constitution/PRD.md) mandates that SharePoint/M365 information reaches the web only through this authenticated AWS tier. Cognito (federated Google IdP) authenticates; Django Groups and per-entity permissions authorize. Microsoft Graph is used app-only (apps/m365) for controlled reads (demo hello/world cells and the capability layer), with secrets in AWS Secrets Manager per docs/VARIABLES.md. Media uses S3 presigned URLs; audit logs and notifications live in apps/platform. - **Out of scope:** Replacing SharePoint as the document system of record; this app brokers and presents governed subsets.
