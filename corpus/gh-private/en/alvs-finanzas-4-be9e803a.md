---
id: alvs-finanzas-4-be9e803a
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — P3 — Bounded Microsoft 365 / SharePoint access from Django"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---
### P3 — Bounded Microsoft 365 / SharePoint access from Django

- **Who hurts:** Finanzas workflows that depend on Excel workbooks in SharePoint; teams that must not expose Graph tokens or client secrets to the browser.
- **Pain today:** Spreadsheets are authoritative but inaccessible to a web UI without fragile scripts, over-broad permissions, or frontend-held secrets.
- **How this repo answers:** implements **app-only** Graph reads ( via MSAL) for two demo endpoints ( , ) that return plain-text cell values from a configured workbook ( → "Hello", → "World"). The Astro home page ( ) SSR-fetches these via internal and displays a SharePoint connection card (Spanish UI copy for operators). and document the deliberate exception. A fuller delegated-OAuth plan lives in and for future four-endpoint JSON resource APIs.
- **Out of scope:** Full SharePoint CRUD, delegated user OAuth connect flow (planned but not fully implemented per the M365 plan), Cognito-as-Graph-IdP, or any Graph secrets on the frontend.
