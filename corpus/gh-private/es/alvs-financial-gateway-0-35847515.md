---
id: alvs-financial-gateway-0-35847515
title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — ALVS Financial Gateway"
visibility: private
importance: high
source_repo: "alvs-financial-gateway"
related: []
tags: ["alvs-financial-gateway", "github", "private", "high", "summary"]
---

# ALVS Financial Gateway > **Problem thesis (required):** Grupo ALVS operates daily treasury across sixteen companies — cash positions, payment circuits, third-party checks, intercompany balances — historically through the legacy GestiónFinanciera system and SharePoint Excel workbooks. This repository is the permanent replacement: an authenticated web application that ingests financial data from Microsoft 365 into PostgreSQL, computes positions once on the server, enforces segregation-of-duties on writes, and renders everything in Spanish for operators while keeping code and documentation in English. It is a production deployment on shared ALVS AWS infrastructure, not a throwaway template fork.
