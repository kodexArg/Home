---
id: commce-2-ea7386e4
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — P1 — Fragmented internal communications on the slot floor"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---

### P1 — Fragmented internal communications on the slot floor - **Who hurts:** MCE supervisors and technicians coordinating daily changes (machine moves, maintenance windows, policy notes) across shifts. - **Pain today:** Updates spread through informal channels with no persistent, searchable record tied to authenticated staff accounts. - **How this repo answers:** The Comunicaciones app provides a minimal **blog-style post list** (Post model: title up to 35 chars, text body, author FK to AUTH_USER_MODEL, create_date). Authenticated users can create posts via post_new; all users can browse post_list and post_detail. Posts are registered in Django admin. Navigation is shared with the other modules via top-level nav buttons. - **Out of scope:** Threaded discussions, attachments, push notifications, email digests, or role-based visibility per post.
