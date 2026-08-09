---
id: "pymceocup"
title: "PyMceOcup — Casino Mendoza slot occupancy ETL"
visibility: private
importance: low
source_repo: "PyMceOcup"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags: ["python", "pandas", "imap", "csv", "excel", "casino", "occupancy", "etl", "mendoza", "slot-machines"]
problems_solved:
  - "Manual daily collection of slot-machine occupancy CSV reports delivered by email into a single analyzable workbook."
  - "Fragmented per-day device occupation files that must be merged before reporting or trend analysis."
technologies:
  - "Python 3"
  - "pandas"
  - "imap_tools"
  - "Excel (openpyxl or equivalent writer)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# PyMceOcup

> **Problem thesis (required):** A small Python toolkit for **Casino Mendoza** (MCE) operations that automates two offline data chores: pulling daily occupancy CSV attachments from a corporate IMAP inbox, and consolidating many per-day `daily-device_ocupation` CSV files into one Excel workbook (`ocupacion.xlsx`). The repository is a legacy, script-only ETL snapshot from mid-2021 with no web UI, no tests, and no dependency manifest.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/PyMceOcup` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Fetch slot occupancy CSVs from email and merge them into a single Excel report for Mendoza casino floor monitoring. |
| Audience | Internal casino operations / monitoring staff; whoever maintained the `monitoreo` mailbox workflow circa 2021. |

## 2. Problems it solves

### P1 — Email-delivered CSVs require manual download

- **Who hurts:** Monitoring operators responsible for daily slot-floor occupancy reports at Casino Mendoza.
- **Pain today:** Occupancy data arrives as CSV attachments in a shared IMAP inbox. Without automation, someone must open each message, save attachments locally, and track which messages were already processed.
- **How this repo answers:** `download_emails.py` connects to the Mendoza Central corporate mail server via IMAP (`imap_tools.MailBox`), iterates inbox messages, saves any attachment whose filename ends in `.csv`, and moves fully processed messages to an `INBOX.Procesados` folder. A one-second sleep between messages reduces server throttling risk.
- **Out of scope:** Parsing or validating CSV contents; scheduling (no cron/systemd); secure credential management (credentials are currently hardcoded in source — see §9).

### P2 — Many daily occupation files need one consolidated report

- **Who hurts:** Analysts or supervisors who need cross-day, cross-device occupancy trends rather than isolated daily CSVs.
- **Pain today:** The `csvs/` directory accumulates hundreds of files in two naming conventions. The `*-daily-device_ocupation.csv` files are one row per device per day with hourly percentage columns — useless for spreadsheet pivoting until merged.
- **How this repo answers:** `join_csvs.py` scans `./csvs`, filters filenames ending in `ocupation.csv`, loads each with pandas, concatenates into a single DataFrame, and writes `ocupacion.xlsx` (sheet `ocup`, two-decimal float formatting, empty-string NA replacement).
- **Out of scope:** Merging the alternate `Mendoza_Sesion_YYYYMMDD.csv` session reports (different schema, not handled by `join_csvs.py`); deduplication; incremental updates; database loading.

## 3. Product / idea

PyMceOcup is not a deployable service. It is a **two-script ETL pair** plus a large static dataset:

1. **Ingest path** — `download_emails.py` is the upstream fetcher: IMAP → local CSV files (written to the working directory, not automatically into `csvs/`).
2. **Transform path** — `join_csvs.py` is the downstream aggregator: `csvs/*-daily-device_ocupation.csv` → `ocupacion.xlsx`.
3. **Data lake** — `csvs/` holds ~306 committed CSV snapshots (167 session reports + 139 daily occupation files) spanning roughly March–August 2021, plus an ~8 MB pre-built `ocupacion.xlsx`.
4. **Placeholder** — `app.py` exists but is empty (0 bytes); no Flask/Django/FastAPI application was implemented.

The mental model is **mailbox → flat files → Excel workbook**, entirely batch-oriented and run on an operator workstation.

### 3.1 North-star use cases

1. Operator runs `download_emails.py` after shift change to pull new occupancy CSV attachments and archive processed mail.
2. Analyst runs `join_csvs.py` after CSVs are placed in `csvs/` to regenerate the master Excel occupancy sheet.
3. Supervisor opens `ocupacion.xlsx` (or individual `Mendoza_Sesion_*` CSVs) for floor utilization review.

### 3.2 Non-goals

- No HTTP API, dashboard, or real-time monitoring.
- No automated scheduling or orchestration.
- No handling of the `Mendoza_Sesion_*` CSV schema in the join script.
- No README beyond a one-line title; no formal docs vault.
- No agent/Claude instruction trees (`.claude/` absent).

## 4. Technology stack

No `requirements.txt`, `pyproject.toml`, or `Pipfile` is present. Dependencies are inferred from import statements only.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 | `.gitignore` (standard Python template); GitHub `primaryLanguage` |
| Data processing | pandas | `join_csvs.py` |
| Email / IMAP | imap_tools | `download_emails.py` |
| Excel output | pandas Excel writer (requires openpyxl or xlsxwriter at runtime) | `join_csvs.py` → `to_excel` |
| Frontend / API | none | `app.py` empty |
| Data | flat CSV + XLSX on disk | `csvs/`, `ocupacion.xlsx` |
| Infra / deploy | none (manual scripts) | no CI, Docker, or IaC |
| AI / agents | none | `.claude/` not present |
| Tests | none | no test configs |

### 4.1 Notable dependencies (curated)

- `pandas` — CSV ingestion, concatenation, and Excel export in `join_csvs.py`.
- `imap_tools` — high-level IMAP client for mailbox login, fetch, attachment extraction, and folder move in `download_emails.py`.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `download_emails.py` — IMAP attachment downloader (upstream ingest).
  - `join_csvs.py` — CSV-to-Excel merger (downstream transform).
  - `app.py` — empty stub; no runnable application.
- **Domain / core:** logic lives entirely in the two scripts above; no package layout, `src/`, or modules.
- **Adapters:** IMAP adapter via `imap_tools.MailBox`; filesystem adapter via `os.listdir` and `open()` / `pd.read_csv`.
- **Data store:** `csvs/` — committed historical extracts; `ocupacion.xlsx` — generated aggregate output checked into the repo.
- **Docs vaults:** none. No `docs/`, `.docs/`, ADRs, or PRDs.
- **Agent scaffolding:** `.claude/` not present; no `SKILL.md` or harness files.
- **Generated / vendor:** `__pycache__/` and virtualenv paths are gitignored; vim swap files (`.download_emails.py.swp`, `.join_csvs.py.swp`) are present in the tree but are editor artifacts, not application code.

## 6. Configuration & contracts (no secrets)

### Environment / credentials (shapes only)

`download_emails.py` expects IMAP connectivity configured **inline in source** (not via environment variables):

| Setting | Purpose |
|---------|---------|
| IMAP host | Corporate mail server hostname |
| Username | Monitoring mailbox account |
| Password | Mailbox password (**hardcoded in repo — security risk; rotate and externalize**) |
| Initial folder | `INBOX` |
| Processed folder | `INBOX.Procesados` (messages moved after all attachments saved) |

`join_csvs.py` has no configuration: paths are relative (`./csvs`, `ocupacion.xlsx`).

`.env` and virtualenv directories are listed in `.gitignore` and were not inspected.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP surface**. There is no web server, REST router, or OpenAPI spec. All interaction is via CLI script execution.

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| `download_emails.py` | Run with Python; connects IMAP, prints `subject - filename` per saved CSV, moves processed mail. |
| `join_csvs.py` | Run with Python from repo root; reads `csvs/*ocupation.csv`, writes `ocupacion.xlsx`. |
| IMAP | Fetch all messages; filter attachments by `.csv` extension; 1 s delay per message. |

## 7. Data & persistence

**Stores:** local filesystem only — no database, KV, or cloud object storage.

**CSV schemas (column names only, from headers):**

1. **`Mendoza_Sesion_YYYYMMDD.csv`** — per-machine session snapshot:
   `sala`, `numero`, `identificacion`, `modelo`, `denominacion`, `fecha`, `hora`, `porcentaje`, `credjugado`, `credganado`, `credpagmanu`, `credcajon`, `partidas`, `credbilletes`, `jackpot`, `ticketin`, `ticketout`, `ticketinpromo`, `ticketoutpromo`.
   Represents slot machine credit/play metrics for Casino Mendoza floor devices (roulette and other models).

2. **`YYYYMMDD-daily-device_ocupation.csv`** — per-device hourly occupancy:
   `ocupation_begin_date_time`, `device_id`, `device_identification`, `device_desc`, `hour_10` … `hour_05`, `ocupation_average`.
   Each row is one device-day with percentage occupancy per hour and a daily average.

**Topology:** entirely offline batch ETL on a single machine. Email server is remote (IMAP); all analytical data is flat files in-repo. Last Git push was 2021-08-20, so the dataset is a frozen historical archive.

## 8. Docs & agent memory (required scan)

| Source | Result |
|--------|--------|
| `README.md` | Present; contains only the title `# PyMceOcup` — no usage instructions. |
| `docs/**` | Not present. |
| `.docs/**` | Not present (scan attempted). |
| `.claude/**` | Not present (scan attempted). |
| ADR / PRD / constitution | Not found. |

**Evidence paths used:** `README.md`, `download_emails.py`, `join_csvs.py`, `app.py`, `.gitignore`, `csvs/` (header sampling only), `ocupacion.xlsx` (existence/size only).

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` — internal Mendoza casino monitoring tooling; this summary does not link clone URLs.
- **Critical finding:** `download_emails.py` contains **plaintext IMAP credentials** (host, username, password) committed to version control. This summary intentionally omits all credential values. Credentials should be rotated, removed from history, and loaded from environment variables or a secrets manager before any reuse.
- **Data sensitivity:** CSV and Excel files contain operational casino metrics (device IDs, credit volumes, occupancy percentages) for a named venue — treat as business-confidential.
- **Auth model:** IMAP username/password only; no OAuth, API tokens, or session cookies elsewhere.
- **Gitignore compliance:** `.env`, `venv/`, `__pycache__/`, and standard Python artifact paths are ignored; their contents were not read.

## 10. Operational picture

**Local run (inferred):**

```bash
# Install deps manually (no manifest):
# pip install pandas imap_tools openpyxl

python download_emails.py   # fetch new CSV attachments from IMAP inbox
python join_csvs.py         # rebuild ocupacion.xlsx from csvs/*ocupation.csv
```

**Deployment:** none observed — no GitHub Actions, Dockerfile, or wrangler config. Scripts appear designed for manual execution on an operator PC with network access to the corporate IMAP server.

**Hardware constraints:** none documented; lightweight Python/pandas workload suitable for any standard desktop.

**Repository activity:** last push 2021-08-20; status is **legacy / frozen**.

## 11. Open questions / unknowns

- Whether `download_emails.py` was ever run in production on a schedule, or only ad hoc.
- Why `app.py` was added empty — planned web UI never implemented?
- Whether `Mendoza_Sesion_*` CSVs were meant to be merged by a separate script never committed.
- Exact Python version and dependency versions used in 2021 (no lockfile).
- Whether IMAP credentials in `download_emails.py` are still valid (assume compromised due to repo exposure).
- Who owns ongoing Mendoza occupancy reporting after this repo was abandoned.
