---
id: alvs-km-gw-2-001fdec5
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — P1 — SharePoint and M365 data must not reach browsers without an auth tier"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---
### P1 — SharePoint and M365 data must not reach browsers without an auth tier

- **Who hurts:** ALVS staff who need company information from Microsoft 365; IT security and compliance teams responsible for data egress; operators building dashboards and tools on top of SharePoint-sourced content.
- **Pain today:** Financial and operational data lives in SharePoint workbooks and the broader M365 estate. Serving that material directly to a browser would bypass authorization, leak source files, and offer no centralized RBAC or audit surface.
- **How this repo answers:** The PRD ( ) states the north star: connect SharePoint securely through AWS so company information reaches the web only through this authenticated tier under Django RBAC. A confidential Entra app registration acquires app-only Graph tokens via using three declared env vars ( , , ). Demo endpoints ( , ) prove the Graph read path by fetching named workbook cells as plain text. Production expansion follows the same pattern: new domain apps and routes grow by addition while the harness stays fixed.
- **Out of scope:** Replacing SharePoint as a document system; anonymous public access; storing M365 credentials in the frontend (frontend tasks receive only non-secret variables).
