---
id: welp-app-2-16cee076
title: "Welp App — internal purchase and payment workflow — P1 — Uncontrolled purchase/payment request flow"
visibility: private
importance: normal
source_repo: "welp-app"
related: []
tags: ["welp-app", "github", "private", "normal", "summary"]
---

### P1 — Uncontrolled purchase/payment request flow - **Who hurts:** End users, supervisors, managers, directors, technicians, and purchase managers across multiple business units (UDNs) and sectors who must coordinate buying and paying for goods/services. - **Pain today:** Without a centralized system, requests scatter across informal channels; approvals are hard to trace; budgets and invoices lack a single attachment store; nobody has a reliable queue of "what needs my action now." - **How this repo answers:** models tickets ( , , ) tied to , , and . Status transitions are declared in ( ) as a finite state machine with labels, allowed transitions, responsible roles, Mermaid diagram styling, and UI affordances (comment boxes, attachment uploads, amount inputs). Each transition creates rows forming an auditable timeline. filters visibility and powers a "needs attention" view based on role-specific status lists. - **Out of scope:** General ERP, inventory, vendor master data, accounting ledger posting, or external supplier portals. DRF is installed but no REST API surface is wired; the product is browser HTML, not a public API.
