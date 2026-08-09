---
id: qa-reports-5-7dd09cc9
title: "qa-reports — Public HTML archive for multi-agent QA audit deliverables — 3. Product / idea"
visibility: public
importance: normal
source_repo: "qa-reports"
related: ["qa-reports"]
tags: ["qa-reports", "github", "public", "normal", "summary"]
---

## 3. Product / idea This repository is a **read-only publication layer**, not an application or audit runner. The mental model is a funnel: Each published file is a **self-contained audit dossier**. A typical full audit opens with project identity (name, subtitle, date, target deployment, source repository reference, auditor label, stack summary, scope list, auth notes when applicable), then renders category scores on a 0–10 scale with color-coded bars. Findings appear in domain sections ordered by severity, each tagged with a stable ID prefix (S-xx Security, A-xx Accessibility, P-xx Performance, E-xx SEO, C-xx Code, FN-xx Functional, D-xx Dependencies, R-xx Compliance, O-xx Operations, FW-xx Framework). The report closes with a launch verdict (READY, READY WITH RESERVES, or NOT READY), narrative verdict note, and prioritized remediation lists. template.html retains {{PLACEHOLDER}} tokens for agent-driven compilation—project name, dates, scores, finding blocks, verdict class, and action tiers—serving as the SSOT layout spec. qa-help-and-workflow.html is the operator-facing companion: Mermaid diagrams for the seven-phase workflow, the ten-agent parallel fan-out, authentication tiers, scoring formulas, folder structure of the upstream QA workspace, and browser-testing conventions (Brave CDP + agent-browser). Current archive contents (as of clone) span early 2026 audits for HR
