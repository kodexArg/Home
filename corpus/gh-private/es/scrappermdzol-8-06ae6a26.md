---
id: scrappermdzol-8-06ae6a26
title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — 4. Technology stack"
visibility: private
importance: normal
source_repo: "ScrapperMDZOL"
related: []
tags: ["scrappermdzol", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (inferred; no .python-version pinned) | Spider modules under mdzol/mdzol/spiders/ | | Crawl framework | Scrapy | scrapy.cfg, spider classes, settings.py | | HTML parsing | lxml (XPath) | requirements.txt (lxml==4.6.3); XPath selectors in spiders | | Async I/O | Twisted | requirements.txt (Twisted==20.3.0) | | Item plumbing | itemadapter | mdzol/mdzol/pipelines.py import | | Output format | JSON file feed | Spider custom_settings FEED_FORMAT / FEED_URI | | Frontend | N/A | — | | Backend / API | N/A (CLI only) | — | | Data | Local JSON files | mdzol/mdzol.json, mdzol/cia.json | | Infra / deploy | None in repo | No .github/workflows, Dockerfile, or IaC | | AI / agents | None | .claude/ absent (scanned) | | Tests | None | No tests/, pytest, or CI config |
