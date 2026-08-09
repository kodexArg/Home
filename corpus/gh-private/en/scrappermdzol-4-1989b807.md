---
id: scrappermdzol-4-1989b807
title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — P3 — Section noise reduction on a mixed-content homepage"
visibility: private
importance: normal
source_repo: "ScrapperMDZOL"
related: []
tags: ["scrappermdzol", "github", "private", "normal", "summary"]
---

### P3 — Section noise reduction on a mixed-content homepage - **Who hurts:** Operators who want hard-news filters but would otherwise follow lifestyle or syndicated links that share the same listing layout. - **Pain today:** The homepage mixes /estilo lifestyle paths and third-party syndication prefixes with core news; a naive "follow all links" crawl wastes bandwidth and pollutes output. - **How this repo answers:** BAN_LINKS in mdzol_spider.py drops any listing link whose href starts with banned prefixes (lifestyle section path and an external syndication prefix) before filter evaluation. - **Out of scope:** Dynamic section discovery, robots.txt section parsing, or per-section spider configuration files.
