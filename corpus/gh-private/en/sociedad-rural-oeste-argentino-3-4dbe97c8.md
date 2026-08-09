---
id: sociedad-rural-oeste-argentino-3-4dbe97c8
title: "SROA — institutional website and moderated institutional blog — P2 — Slow, non-owned channel for sector news and debate"
visibility: private
importance: normal
source_repo: "sociedad-rural-oeste-argentino"
related: []
tags: ["sociedad-rural-oeste-argentino", "github", "private", "normal", "summary"]
---
### P2 — Slow, non-owned channel for sector news and debate

- **Who hurts:** SROA communications staff, sector-facing contributors, and registered readers who want timely commentary on norms, prices, and institutional milestones.
- **Pain today:** Reactive communication through external media has short windows; there is no owned blog with governed public conversation under SROA moderation policy ( OB-05, OB-06).
- **How this repo answers:** entities power the blog and time-bounded posts (flagged via + ). Registered Google-authenticated users comment with mandatory editorial reactions (six-emoticon set). Comments publish immediately; and post-author roles can hide or delete per PRD §9. WebSocket islands push and events live ( §7, §4). Anti-spam in MVP is Google-verified accounts only (ADR-005).
- **Out of scope:** Nested comment threads, public JWT APIs, email notification of comments (in-app notifications only), and reverting hidden content without a new ADR.
