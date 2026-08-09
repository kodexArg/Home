---
id: scrappermdzol-2-5609a6a5
title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — P1 — Selective news monitoring without manual homepage scanning"
visibility: private
importance: normal
source_repo: "ScrapperMDZOL"
related: []
tags: ["scrappermdzol", "github", "private", "normal", "summary"]
---
### P1 — Selective news monitoring without manual homepage scanning

- **Who hurts:** Anyone tracking Mendoza regional news for specific topics (politics, economy, local events) who cannot afford to read every headline on the portal homepage.
- **Pain today:** The news homepage lists dozens of stories across sections; relevant items are buried among lifestyle and syndicated content. Manual refresh-and-scan is slow and inconsistent.
- **How this repo answers:** The spider loads the homepage, extracts all headline links via XPath, and accepts a runtime argument (comma-separated keywords). Only headlines whose text contains any filter substring (case-insensitive) trigger a follow-up request to the article page. Non-matching items are skipped at listing time.
- **Out of scope:** Real-time push notifications, scheduling/cron orchestration (not in repo), full-site archival, or semantic/NLP relevance ranking beyond simple substring match.
