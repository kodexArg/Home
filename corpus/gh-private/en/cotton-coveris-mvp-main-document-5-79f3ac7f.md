---
id: cotton-coveris-mvp-main-document-5-79f3ac7f
title: "Coveris MVP — interactive ADR study and architecture documentation — 3. Product / idea"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp-main-documentation"
related: []
tags: ["cotton-coveris-mvp-main-documentation", "github", "private", "high", "summary"]
---

## 3. Product / idea The repository is **not an application** — it is a **documentation product** consisting of one self-contained static web page and three companion markdown research reports. The mental model is a **decision-support atlas** for a larger integration effort: 1. **Browse** the ADR landscape (what exists on the target branch vs what Coveris-e proposes). 2. **Filter** by conflict, verdict, or topic to find blockers. 3. **Read** priority-ranked themes (8 topics from OrgUnit agnosticism through StaffingPlanLine). 4. **Drill into** full ADR text for the highest-risk items without cloning the main repo. 5. **Consult** standalone findings for the two most contentious design questions (manager modeling, weekly/monthly boundary). The interactive page ( , ~104 KB) is a zero-dependency single-file SPA: dark-theme CSS, responsive sidebar with mobile drawer, client-side Markdown renderer ( function), expandable ADR cards, accordion for full texts, and JavaScript data structures ( , , , ) holding all catalog metadata. It references ADR files in the main repo by relative path ( ) for entries without embedded full text — those links assume co-deployment context but the page is self-sufficient for the 15+ ADRs with inline blocks. The three files are the **authoritative long-form analysis**; the HTML is the navigable index built from that analysis plus metadata from the main
