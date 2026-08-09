---
id: scrappermdzol-5-3c159cdc
title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — 3. Product / idea"
visibility: private
importance: normal
source_repo: "ScrapperMDZOL"
related: []
tags: ["scrappermdzol", "github", "private", "normal", "summary"]
---

## 3. Product / idea The mental model is **"filtered crawl → JSON file"**: run a single Scrapy command with keyword arguments, wait for the crawl to finish, and read . There is no web server, database, or deployment manifest—the entire product is the spider logic plus committed sample output. The project layout follows standard scaffolding under : 1. **Listing pass** ( spider ): XPath over homepage headline anchors; apply ban-list and keyword filters. 2. **Article pass** ( ): XPath extraction of epigraph and body; light string cleanup for paragraph boundaries. 3. **Export**: Per-spider set , , , and . Each spider truncates its feed file to empty at import time before crawling. A second spider ( ) is structurally similar but targets a completely different site (US government historical collections reading room). It walks collection index links and exports , , and to . It uses a custom string identifying itself as a learning crawl. This spider shares the project boilerplate but is not integrated with the Mendoza news workflow.
