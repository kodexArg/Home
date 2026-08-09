---
id: kdx-ng-coveris-docs-3-093d9d93
title: "Coveris Documentation Portal — Angular docs site and QA harness — P2 — Inconsistent QA audit methodology"
visibility: private
importance: normal
source_repo: "kdx-ng-coveris-docs"
related: []
tags: ["kdx-ng-coveris-docs", "github", "private", "normal", "summary"]
---

### P2 — Inconsistent QA audit methodology - **Who hurts:** QA engineers and agents tasked with pre-release quality gates on Coveris or similar Angular/marketing sites. - **Pain today:** Ad-hoc checklists, non-reproducible findings, no shared severity taxonomy or weighted scoring, and manual report assembly. - **How this repo answers:** Root defines a **10-area audit framework** (Security/OWASP, Accessibility/WCAG 2.2 AA, Performance/Core Web Vitals, SEO, Code Quality, Functional Testing, Dependencies, Compliance/GDPR, Operations/CI, Framework-Specific). Finding ID prefixes ( , , …), severity levels, evidence requirements, and a weighted scoring formula produce READY / READY WITH RESERVES / NOT READY verdicts. Nine Python scripts in automate HTTP security scans, link checks, SEO audits, dependency audits, operations checks, browser auth tests, finding extraction, test generation, and HTML report compilation via . pins third-party agent skills ( , ) for intake and browser workflows. - **Out of scope:** Scripts are utilities for authorized audits; they do not modify target sites. Reports directory and cloned target repos are gitignored. No CI workflow is checked into this repo.
