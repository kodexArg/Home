---
id: "scrapper-mdzol"
title: "ScrapperMDZOL — keyword-filtered Scrapy harvester for regional news"
visibility: private
importance: normal
source_repo: "ScrapperMDZOL"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags:
  - "python"
  - "scrapy"
  - "web-scraping"
  - "xpath"
  - "news"
  - "json-export"
  - "mendoza"
  - "cli"
  - "filtering"
problems_solved:
  - "Operators monitoring a regional Mendoza news portal need to pull only headlines matching specific keywords instead of manually scanning the full homepage feed."
  - "Downstream consumers (archival, alerting, or RAG ingestion) require structured JSON with headline, link, epigraph, and full article body—not just listing-page snippets."
  - "Lifestyle and off-topic sections pollute a general news crawl; the harvester must exclude known low-value URL prefixes before following article links."
technologies:
  - "Python 3"
  - "Scrapy (spider framework; used in code)"
  - "lxml (XPath parsing)"
  - "Twisted (Scrapy async stack; present in lockfile)"
  - "itemadapter (pipeline adapter stub)"
  - "JSON Feed export (Scrapy FEED_FORMAT)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ScrapperMDZOL

> **Problem thesis (required):** This repository is a small **Scrapy CLI application** that crawls a regional Mendoza news homepage, applies **comma-separated keyword filters** to headline text, follows matching article links, and exports structured JSON records (headline, relative link, epigraph, body). It exists to automate selective news monitoring—turning a noisy front-page feed into a filtered, machine-readable corpus—without building a full CMS integration or manual copy-paste workflow. A secondary experimental spider targets a US government historical reading-room index (unrelated domain) and appears to be a learning exercise bundled in the same project.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/ScrapperMDZOL` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Scrapy spiders that keyword-filter regional news headlines and export full-article JSON for offline use. |
| Audience | Internal operators or developers who need filtered news snapshots; anyone extending XPath selectors if the target site's HTML changes. |

## 2. Problems it solves

### P1 — Selective news monitoring without manual homepage scanning

- **Who hurts:** Anyone tracking Mendoza regional news for specific topics (politics, economy, local events) who cannot afford to read every headline on the portal homepage.
- **Pain today:** The news homepage lists dozens of stories across sections; relevant items are buried among lifestyle and syndicated content. Manual refresh-and-scan is slow and inconsistent.
- **How this repo answers:** The `mdzol` spider loads the homepage, extracts all `h2.news__title` headline links via XPath, and accepts a runtime `filters` argument (comma-separated keywords). Only headlines whose text contains any filter substring (case-insensitive) trigger a follow-up request to the article page. Non-matching items are skipped at listing time.
- **Out of scope:** Real-time push notifications, scheduling/cron orchestration (not in repo), full-site archival, or semantic/NLP relevance ranking beyond simple substring match.

### P2 — Structured article extraction for downstream JSON consumers

- **Who hurts:** Pipelines that ingest news into archives, dashboards, or RAG corpora and need consistent fields—not raw HTML dumps.
- **Pain today:** Listing pages expose only titles and links; full text requires visiting each article and parsing non-trivial DOM structure (epigraph in a `p.epigraph*` element, body paragraphs inside `div.modules-container` with mixed inline nodes).
- **How this repo answers:** After a filter match, `parse_link` fetches the article and populates four fields: `text` (headline), `link` (relative URL from listing), `epigraph` (cleaned single-line summary), and `body` (concatenated paragraph text with newline normalization and non-breaking-space cleanup). Output is written via Scrapy's built-in JSON feed exporter to `mdzol.json` in the working directory.
- **Out of scope:** Image/media extraction, author/byline metadata, publish-date parsing, deduplication across runs, or database persistence.

### P3 — Section noise reduction on a mixed-content homepage

- **Who hurts:** Operators who want hard-news filters but would otherwise follow lifestyle or syndicated links that share the same listing layout.
- **Pain today:** The homepage mixes `/estilo` lifestyle paths and third-party syndication prefixes with core news; a naive "follow all links" crawl wastes bandwidth and pollutes output.
- **How this repo answers:** `BAN_LINKS` in `mdzol_spider.py` drops any listing link whose href starts with banned prefixes (lifestyle section path and an external syndication prefix) before filter evaluation.
- **Out of scope:** Dynamic section discovery, robots.txt section parsing, or per-section spider configuration files.

## 3. Product / idea

The mental model is **"filtered crawl → JSON file"**: run a single Scrapy command with keyword arguments, wait for the crawl to finish, and read `mdzol.json`. There is no web server, database, or deployment manifest—the entire product is the spider logic plus committed sample output.

The project layout follows standard `scrapy startproject` scaffolding under `mdzol/`:

1. **Listing pass** (`mdzol` spider `parse`): XPath over homepage headline anchors; apply ban-list and keyword filters.
2. **Article pass** (`parse_link`): XPath extraction of epigraph and body; light string cleanup for paragraph boundaries.
3. **Export**: Per-spider `custom_settings` set `FEED_URI`, `FEED_FORMAT=json`, `FEED_EXPORT_ENCODING=utf-8`, and `MEMUSAGE_LIMIT_MB=1024`. Each spider truncates its feed file to empty at import time before crawling.

A second spider (`cia`) is structurally similar but targets a completely different site (US government historical collections reading room). It walks collection index links and exports `url`, `title`, and `body` to `cia.json`. It uses a custom `USER_AGENT` string identifying itself as a learning crawl. This spider shares the project boilerplate but is not integrated with the Mendoza news workflow.

### 3.1 North-star use cases

1. **Keyword snapshot** — `scrapy crawl mdzol -a filters=rusia,mariúpol` (example from committed sample data) produces a JSON array of matching articles with full text.
2. **Re-run after site change** — Developer adjusts XPath constants (`NEWS_LINK`, `NEWS_BODY`, etc.) in `mdzol_spider.py` when the news portal redesigns HTML class names.
3. **Experimental archive pull** — `scrapy crawl cia` harvests historical collection pages from the reading-room index (separate output file, currently empty in repo).

### 3.2 Non-goals

- No REST/HTTP API surface; CLI-only invocation.
- No authentication, rate-limit coordination beyond Scrapy defaults, or distributed crawl (Scrapyd deploy stanza is commented out in `scrapy.cfg`).
- `MdzolItem` in `items.py` is an empty Scrapy Item class; spiders yield plain dicts instead of typed items.
- `ITEM_PIPELINES` and custom middlewares are **not enabled** in `settings.py`; `pipelines.py` and `middlewares.py` are stock stubs only.
- No CI/CD, Docker, or production deployment configuration present in tree.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (inferred; no `.python-version` pinned) | Spider modules under `mdzol/mdzol/spiders/` |
| Crawl framework | Scrapy | `scrapy.cfg`, spider classes, `settings.py` |
| HTML parsing | lxml (XPath) | `requirements.txt` (`lxml==4.6.3`); XPath selectors in spiders |
| Async I/O | Twisted | `requirements.txt` (`Twisted==20.3.0`) |
| Item plumbing | itemadapter | `mdzol/mdzol/pipelines.py` import |
| Output format | JSON file feed | Spider `custom_settings` `FEED_FORMAT` / `FEED_URI` |
| Frontend | N/A | — |
| Backend / API | N/A (CLI only) | — |
| Data | Local JSON files | `mdzol/mdzol.json`, `mdzol/cia.json` |
| Infra / deploy | None in repo | No `.github/workflows`, Dockerfile, or IaC |
| AI / agents | None | `.claude/` absent (scanned) |
| Tests | None | No `tests/`, `pytest`, or CI config |

### 4.1 Notable dependencies (curated)

- **Scrapy** — Core spider/crawl engine (used throughout; oddly **not pinned** as a standalone line in `requirements.txt`).
- **lxml** — XPath evaluation against response HTML.
- **Twisted** — Scrapy's underlying networking reactor.
- **itemadapter** — Adapter interface referenced by generated pipeline/middleware stubs.
- **beautifulsoup4** — Listed in `requirements.txt` but **not imported** by project spiders (likely ambient from system freeze).

**Caveat:** `mdzol/requirements.txt` is a **full Ubuntu system `pip freeze`** (~170 packages including `ubuntu-drivers-common`, `terminator`, `jupyter`, `pygame`, etc.) rather than a minimal project manifest. Treat Scrapy/lxml/Twisted as the real runtime signal; the freeze is not a reliable install recipe for this repo alone.

## 5. Repository map (abstraction)

- **Entrypoints:** Scrapy CLI from `mdzol/` directory — spiders `mdzol` and `cia` in `mdzol/mdzol/spiders/`.
- **Domain / core:** Spider modules `mdzol_spider.py` (news filtering + extraction) and `cia_spider.py` (reading-room collections).
- **Adapters:** XPath selector constants at top of each spider; no separate adapter layer.
- **Configuration:** `mdzol/scrapy.cfg` (project name `mdzol`, settings module `mdzol.settings`); `mdzol/mdzol/settings.py` (robots obey, default Scrapy template).
- **Output artifacts:** `mdzol/mdzol.json` (61 lines, sample 2022 news articles), `mdzol/cia.json` (empty file).
- **Docs vaults:** Root `README.md` only (one line). No `docs/`, `.docs/`, ADRs, or PRDs.
- **Agent scaffolding:** `.claude/` **not present** (directory scan attempted). No `.agents/`, `SKILL.md`, or harness files.
- **Generated / vendor:** `mdzol/mdzol/__pycache__/` exists locally but is gitignored; not ingested.

## 6. Configuration & contracts (no secrets)

### Scrapy settings (`mdzol/mdzol/settings.py`)

| Setting | Value / state | Purpose |
|---------|---------------|---------|
| `BOT_NAME` | `mdzol` | Project identifier |
| `ROBOTSTXT_OBEY` | `True` | Honors target `robots.txt` |
| `SPIDER_MODULES` | `['mdzol.spiders']` | Spider discovery path |
| `ITEM_PIPELINES` | commented out | No post-processing pipeline active |
| `DOWNLOADER_MIDDLEWARES` | commented out | Stock middleware only |

### Per-spider `custom_settings` (`mdzol` spider)

| Key | Purpose |
|-----|---------|
| `FEED_URI` | Output filename (`mdzol.json`) |
| `FEED_FORMAT` | `json` |
| `FEED_EXPORT_ENCODING` | `utf-8` |
| `MEMUSAGE_LIMIT_MB` | `1024` — abort crawl if memory exceeds 1 GB |

### Spider runtime arguments

| Argument | Spider | Purpose |
|----------|--------|---------|
| `filters` | `mdzol` | Comma-separated keywords; **required at runtime** — spider calls `.split(',')` on `getattr(self, 'filters', None)` without a default guard |

### XPath contracts (`mdzol` spider)

| Constant | Target DOM |
|----------|------------|
| `NEWS_LINK` | `//h2[@class='news__title']/a/@href` |
| `NEWS_TEXT` | `//h2[@class='news__title']/a/text()` |
| `NEWS_EPIGRAPH` | `//p[starts-with(@class,'epigraph')]/text()` |
| `NEWS_BODY` | `//div[@class='modules-container']//p[not(@class)]//text()` |
| `BAN_LINKS` | Prefix list: lifestyle section path, external syndication prefix |

### Env vars

None documented. Standard `.env` patterns are gitignored; no `.env.example` in tree.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP server**. It is a **client-only** Scrapy crawl tool.

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| — | — | **N/A — no inbound HTTP surface** | — |

Outbound requests are made by Scrapy to external news and government sites per spider `start_urls` and followed links. No API keys or auth headers are configured.

### 6.2 Other interfaces

| Interface | Command / contract | Purpose |
|-----------|-------------------|---------|
| Scrapy CLI | `scrapy crawl mdzol -a filters=<comma-keywords>` | Run filtered news harvest → `mdzol.json` |
| Scrapy CLI | `scrapy crawl cia` | Run reading-room collection harvest → `cia.json` |
| JSON output schema (`mdzol`) | `{ text, link, epigraph, body }` | Per-article record |
| JSON output schema (`cia`) | `{ url, title, body }` | Per-collection-page record |

Working directory for commands: `mdzol/` (where `scrapy.cfg` lives).

## 7. Data & persistence

- **Stores:** None. All persistence is **flat JSON files** written in the crawl working directory.
- **Entities:** News article records (`text`, `link`, `epigraph`, `body`); CIA collection records (`url`, `title`, `body`).
- **Committed sample:** `mdzol/mdzol.json` holds ~15 articles (2022-era headlines, e.g. Mariúpol invasion coverage) demonstrating successful end-to-end extraction. `mdzol/cia.json` is empty (zero bytes).
- **Topology:** Single-machine, offline batch crawl. No cloud, edge, or database layer. Re-runs overwrite/truncate feed files at spider import.

## 8. Docs & agent memory (required scan)

| Source | Present? | Summary |
|--------|----------|---------|
| `README.md` | Yes | One-line: "Scrapping with filters to list (real) news from mdzol.com" |
| `docs/**` | No | — |
| `.docs/**` | No | Directory does not exist (scan attempted) |
| `.claude/**` | No | Directory does not exist (scan attempted) |
| ADR / PRD / constitution | No | — |
| `.github/workflows` | No | — |

**Evidence paths used:** `README.md`, `mdzol/mdzol/spiders/mdzol_spider.py`, `mdzol/mdzol/spiders/cia_spider.py`, `mdzol/mdzol/settings.py`, `mdzol/scrapy.cfg`, `mdzol/requirements.txt`, `mdzol/mdzol.json` (structure sample only).

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` — internal kodexArg tooling; this summary contains no clone URLs or credentials.
- **Auth model:** None. Outbound anonymous HTTP GETs only.
- **Robots compliance:** `ROBOTSTXT_OBEY = True` globally.
- **User-agent:** Default Scrapy UA for `mdzol` spider; `cia` spider sets a custom descriptive UA string.
- **Secrets:** No `.env`, tokens, or keys in tracked files. `.env` and `venv/` are gitignored.
- **Scraped content:** Committed `mdzol.json` contains publicly published news text; treat as sample output, not confidential data.
- **Risk note:** The `filters` spider argument has no validation; passing `None` (omitting `-a filters`) will raise at `.split(',')`. This is a footgun, not a security issue.

## 10. Operational picture

### Local development

```bash
cd mdzol
# Minimal install (recommended; requirements.txt is a system freeze):
pip install scrapy lxml itemadapter
scrapy crawl mdzol -a filters=keyword1,keyword2
# Output: ./mdzol.json
scrapy crawl cia
# Output: ./cia.json
```

No `Makefile`, `pyproject.toml`, or documented virtualenv setup. A fresh environment should **not** rely on `pip install -r requirements.txt` without curation.

### Deployment

No CI/CD, Scrapyd, cron, or container configuration found. Last commit: **2023-01-16** (`Update README.md`). Project appears **unmaintained / legacy**.

### Hardware constraints

`MEMUSAGE_LIMIT_MB=1024` per spider — crawl aborts if Scrapy memory extension reports >1 GB.

## 11. Open questions / unknowns

- **Minimal dependency set:** `requirements.txt` is a full-machine pip freeze; the authoritative Scrapy version at time of development is unknown.
- **Site HTML stability:** XPath selectors target specific class names (`news__title`, `modules-container`, `epigraph*`) that may have changed since 2022–2023; no automated test or health check exists.
- **`cia` spider purpose:** Appears experimental/learning (custom UA, empty output file); relationship to Mendoza news workflow is unclear—possibly accidental inclusion.
- **`filters` required:** No default or guard when `-a filters` is omitted; runtime `AttributeError` likely.
- **Scheduling:** How/when this was run in production (cron, manual) is not documented anywhere in tree.
- **Python version:** No `.python-version`, `pyproject.toml`, or engine constraint—exact Python 3.x minor version unknown.
