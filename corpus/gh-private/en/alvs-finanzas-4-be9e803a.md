---
id: alvs-finanzas-4-be9e803a
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — P3 — Bounded Microsoft 365 / SharePoint access from Django"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---

### P3 — Bounded Microsoft 365 / SharePoint access from Django - **Who hurts:** Finanzas workflows that depend on Excel workbooks in SharePoint; teams that must not expose Graph tokens or client secrets to the browser. - **Pain today:** Spreadsheets are authoritative but inaccessible to a web UI without fragile scripts, over-broad permissions, or frontend-held secrets. - **How this repo answers:** backend/apps/m365/ implements **app-only** Graph reads (client_credentials via MSAL) for two demo endpoints (/api/m365/hello/, /api/m365/world/) that return plain-text cell values from a configured workbook (A1 → "Hello", C3 → "World"). The Astro home page (frontend/src/pages/index.astro) SSR-fetches these via internal BACKEND_API_URL and displays a SharePoint connection card (Spanish UI copy for operators). docs/API.md and adr-13-m365-graph document the deliberate AllowAny exception. A fuller delegated-OAuth plan lives in IMPLEMENTATION-PLAN-M365.md and M365-REQUIRED-VARIABLES-AND-SECRETS.md for future four-endpoint JSON resource APIs. - **Out of scope:** Full SharePoint CRUD, delegated user OAuth connect flow (planned but not fully implemented per the M365 plan), Cognito-as-Graph-IdP, or any Graph secrets on the frontend.
