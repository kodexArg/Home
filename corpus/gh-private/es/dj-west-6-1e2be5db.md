---
id: dj-west-6-1e2be5db
title: "dj-west — Django inventory and point-of-sale for Argentine retail — 3. Product / idea (2)"
visibility: private
importance: normal
source_repo: "dj-west"
related: []
tags: ["dj-west", "github", "private", "normal", "summary"]
---

**single Python process**: Waitress serves WSGI; WhiteNoise serves compressed static files from staticfiles/ after collectstatic. No Nginx sidecar. App Runner build compiles Tailwind and collects statics before run.
