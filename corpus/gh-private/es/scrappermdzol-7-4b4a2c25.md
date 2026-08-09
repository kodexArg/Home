---
id: scrappermdzol-7-4b4a2c25
title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — 3.2 Non-goals"
visibility: private
importance: normal
source_repo: "ScrapperMDZOL"
related: []
tags: ["scrappermdzol", "github", "private", "normal", "summary"]
---

### 3.2 Non-goals - No REST/HTTP API surface; CLI-only invocation. - No authentication, rate-limit coordination beyond Scrapy defaults, or distributed crawl (Scrapyd deploy stanza is commented out in scrapy.cfg). - MdzolItem in items.py is an empty Scrapy Item class; spiders yield plain dicts instead of typed items. - ITEM_PIPELINES and custom middlewares are **not enabled** in settings.py; pipelines.py and middlewares.py are stock stubs only. - No CI/CD, Docker, or production deployment configuration present in tree.
