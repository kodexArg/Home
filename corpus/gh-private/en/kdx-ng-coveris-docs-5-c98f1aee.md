---
id: kdx-ng-coveris-docs-5-c98f1aee
title: "Coveris Documentation Portal — Angular docs site and QA harness — 3. Product / idea"
visibility: private
importance: normal
source_repo: "kdx-ng-coveris-docs"
related: []
tags: ["kdx-ng-coveris-docs", "github", "private", "normal", "summary"]
---

## 3. Product / idea The repository is a **two-layer artifact**: 1. **Documentation browser (kdx-coveris-docs/)** — A client-side Angular 21 application that serves static markdown from public/docs/ and renders it inside a PrimeNG shell with sidebar navigation, mobile drawer, skip links, and bilingual toggle. Hash-based routing (withHashLocation) supports static hosting. Default landing redirects to 00-home (“How Coveris Works”), a conceptual guide for non-technical readers explaining the coverage equation and organizational layers. 2. **QA harness (repo root)** — Operational reference (AGENTS.md) plus Python scripts invoked with uv run (inline PEP 723 dependencies). The full audit workflow spans intake → Brave CDP browser check → recon → ten parallel audit agents → terminal score table → optional HTML report. The **Coveris product** documented inside this portal is a SaaS **capacity planning platform for private clinics** (20–100 employees, multiple services). It replaces spreadsheet chaos when answering four staffing questions in real time: who has available hours, who holds required certifications, whether assignment triggers overtime, and post-assignment service coverage. The domain model centers on three pillars — **Demand** (org-unit tree with positions and required weekly hours), **Supply** (employees with contracts, tags, and lifecycle FSM), and **Bridge** (assignments
