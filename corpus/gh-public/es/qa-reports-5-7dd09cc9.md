---
id: qa-reports-5-7dd09cc9
title: "qa-reports — Public HTML archive for multi-agent QA audit deliverables — 3. Product / idea"
visibility: public
importance: normal
source_repo: "qa-reports"
related: ["qa-reports"]
tags: ["qa-reports", "github", "public", "normal", "summary"]
---
## 3. Product / idea

This repository is a **read-only publication layer**, not an application or audit runner. The mental model is a funnel: Each published file is a **self-contained audit dossier**. A typical full audit opens with project identity (name, subtitle, date, target deployment, source repository reference, auditor label, stack summary, scope list, auth notes when applicable), then renders category scores on a 0–10 scale with color-coded bars. Findings appear in domain sections ordered by severity, each tagged with a stable ID prefix ( Security, Accessibility, Performance, SEO, Code, Functional, Dependencies, Compliance, Operations, Framework). The report closes with a launch verdict ( , , or ), narrative verdict note, and prioritized remediation lists. retains tokens for agent-driven compilation—project name, dates, scores, finding blocks, verdict class, and action tiers—serving as the SSOT layout spec. is the operator-facing companion: Mermaid diagrams for the seven-phase workflow, the ten-agent parallel fan-out, authentication tiers, scoring formulas, folder structure of the upstream QA workspace, and browser-testing conventions (Brave CDP + ). Current archive contents (as of clone) span early 2026 audits for HR and SDGD projects under the owner prefix and a March 2026 full audit for , plus iterative re-runs on the same target where remediation was re-tested.
