---
id: scrappermdzol-6-b0e8aaaa
title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "ScrapperMDZOL"
related: []
tags: ["scrappermdzol", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Keyword snapshot** — scrapy crawl mdzol -a filters=rusia,mariúpol (example from committed sample data) produces a JSON array of matching articles with full text. 2. **Re-run after site change** — Developer adjusts XPath constants (NEWS_LINK, NEWS_BODY, etc.) in mdzol_spider.py when the news portal redesigns HTML class names. 3. **Experimental archive pull** — scrapy crawl cia harvests historical collection pages from the reading-room index (separate output file, currently empty in repo).
