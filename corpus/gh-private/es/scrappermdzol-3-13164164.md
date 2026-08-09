---
id: scrappermdzol-3-13164164
title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news — P2 — Structured article extraction for downstream JSON consumers"
visibility: private
importance: normal
source_repo: "ScrapperMDZOL"
related: []
tags: ["scrappermdzol", "github", "private", "normal", "summary"]
---

### P2 — Structured article extraction for downstream JSON consumers - **Who hurts:** Pipelines that ingest news into archives, dashboards, or RAG corpora and need consistent fields—not raw HTML dumps. - **Pain today:** Listing pages expose only titles and links; full text requires visiting each article and parsing non-trivial DOM structure (epigraph in a p.epigraph* element, body paragraphs inside div.modules-container with mixed inline nodes). - **How this repo answers:** After a filter match, parse_link fetches the article and populates four fields: text (headline), link (relative URL from listing), epigraph (cleaned single-line summary), and body (concatenated paragraph text with newline normalization and non-breaking-space cleanup). Output is written via Scrapy's built-in JSON feed exporter to mdzol.json in the working directory. - **Out of scope:** Image/media extraction, author/byline metadata, publish-date parsing, deduplication across runs, or database persistence.
