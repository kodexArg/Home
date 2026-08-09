---
id: "procesar-ocupacion"
title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports"
visibility: private
importance: normal
source_repo: "ProcesarOcupacion"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "legacy"
related: []
tags: ["python", "imap", "csv", "casino", "occupation", "email-automation", "mendoza", "slot-machines", "monitoring"]
problems_solved:
  - "Casino operations teams receive daily device-occupation CSV reports as email attachments and need them saved locally without manual mailbox work."
  - "Occupation and session telemetry from gaming-floor devices must be collected from a shared monitoring mailbox and archived for downstream analysis."
technologies:
  - "Python 3"
  - "imap_tools (third-party IMAP client)"
  - "stdlib imaplib / email (alternate prototype)"
  - "CSV (daily device occupation + session exports)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ProcesarOcupacion

> **Problem thesis (required):** This repository automates retrieval of **casino device-occupation CSV files** that arrive as email attachments in a Mendoza Central monitoring mailbox. It exists so operators do not have to manually download, rename, and file daily occupancy reports and related session exports. The repo also retains a historical archive of downloaded CSV snapshots (late 2020 through early 2021) alongside the harvesting scripts.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/ProcesarOcupacion` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Python IMAP scripts that pull CSV occupation reports from a casino monitoring inbox, save attachments to disk, and move processed messages to a processed folder. |
| Audience | Internal casino / ALVS operators, monitoring staff, and anyone maintaining Mendoza Central occupancy reporting workflows. |

## 2. Problems it solves

### P1 — Manual download of daily occupation CSV attachments

- **Who hurts:** Monitoring staff and analysts who need per-device hourly occupancy percentages for the gaming floor.
- **Pain today:** Occupation reports are emailed automatically from upstream systems; someone must open the mailbox, identify CSV attachments, save them locally, and avoid re-processing the same messages.
- **How this repo answers:** `main.py` connects to the Mendoza Central IMAP server, iterates inbox messages, writes every `.csv` attachment to the working directory using its original filename, and moves fully processed messages to `INBOX.Procesados` so they are not fetched again.
- **Out of scope:** Parsing, aggregating, visualizing, or loading CSV data into a database. No scheduling, alerting, or validation of CSV contents.

### P2 — Archiving session-level slot telemetry alongside occupancy

- **Who hurts:** Operations teams comparing device occupancy trends with per-machine financial/session metrics (credits played, jackpots, ticket in/out).
- **Pain today:** Session exports (`Mendoza_Sesion_*.csv`) and daily occupation files (`*-daily-device_ocupation.csv`) accumulate in email and are easy to lose or duplicate.
- **How this repo answers:** The committed CSV corpus in the repo root demonstrates the expected artifact shapes and date range; the IMAP harvester saves new attachments with their source filenames for later offline use.
- **Out of scope:** Merging occupation and session datasets, reconciling device IDs across file types, or real-time dashboards.

## 3. Product / idea

The repository is a **small, script-first data-ingestion utility** with no web UI, API, or packaging layer. The mental model is: *mailbox → filter CSV attachments → write files locally → mark email as processed*.

Two Python entrypoints exist:

1. **`main.py` (functional path):** Uses the third-party `imap_tools` library (`MailBox`, `AND`) for a concise fetch-and-move loop. This is the script that actually runs end-to-end.
2. **`imap.py` (incomplete prototype):** Uses Python's standard `imaplib` and `email` modules with a `revisar()` function that begins attachment walking but is syntactically incomplete (truncated `part.get` expression) and never finishes the download logic. It appears to be an earlier or abandoned approach.

The repo doubles as a **sample data vault**: twenty-six CSV files from November 2020 through January 2021 are checked in, giving consumers concrete examples of both file families without needing live mailbox access.

### 3.1 North-star use cases

1. Operator runs `main.py` on a schedule (cron or manual) to pull the latest daily `*-daily-device_ocupation.csv` attachment(s) from the monitoring inbox.
2. Analyst clones the repo (or copies saved CSVs) to study hourly occupancy columns (`hour_10` … `hour_05`, `ocupation_average`) per `device_id` / `device_identification`.
3. Historical reviewer inspects `Mendoza_Sesion_*.csv` rows for roulette machines: credits played/won, manual payouts, jackpots, ticket in/out, and occupancy percentage at snapshot time.

### 3.2 Non-goals

- No REST/HTTP service, CLI argument parsing, or configuration-file indirection.
- No dependency manifest (`requirements.txt`, `pyproject.toml`) — `imap_tools` must be installed manually.
- No tests, CI/CD, Docker, or deployment manifests.
- No transformation pipeline beyond saving raw attachment bytes.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (shebang `#!/usr/bin/python`) | `main.py`, `imap.py` |
| Email / IMAP | `imap_tools` (active); `imaplib` + `email` (prototype) | `main.py`, `imap.py` |
| Data format | CSV (comma-separated, header row) | `20210122-daily-device_ocupation.csv`, `Mendoza_Sesion_20210115.csv` |
| Frontend | none | — |
| Backend / API | none (batch script) | — |
| Data | Local filesystem (CSV files in repo root) | `*.csv` files |
| Infra / deploy | Manual execution; no CI detected | tree scan |
| AI / agents | none | `.claude/` absent |
| Tests | none | — |

### 4.1 Notable dependencies (curated)

- `imap_tools` — high-level IMAP client used by `main.py` for login, fetch, attachment extraction, and folder move operations.
- `imaplib` (stdlib) — lower-level SSL IMAP used in the unfinished `imap.py` prototype.
- `email` (stdlib) — message parsing in `imap.py`.

## 5. Repository map (abstraction)

- **Entrypoints:** `main.py` (primary harvester), `imap.py` (broken prototype).
- **Domain / core:** Attachment filtering logic (filename ends with `csv`), write-to-disk, and post-process mailbox move in `main.py`.
- **Adapters:** IMAP over SSL to Mendoza Central mail host (hardcoded in source — should be externalized).
- **Docs vaults:** `README.md` only (title line). No `docs/`, `.docs/`, ADRs, or PRDs present.
- **Agent scaffolding:** `.claude/` not present; no skills or harness files.
- **Data archive:** Root-level `*-daily-device_ocupation.csv` (22 files) and `Mendoza_Sesion_*.csv` (5 files) — committed sample/historical exports, not generated by the scripts in-repo.

## 6. Configuration & contracts (no secrets)

Configuration is **inline in Python source** (a security anti-pattern). At abstraction level, the following settings exist and should be moved to environment variables or a secrets manager in any revived deployment:

| Setting (conceptual) | Purpose |
|----------------------|---------|
| IMAP host | Mendoza Central mail server hostname |
| IMAP username | Monitoring mailbox login |
| IMAP password | Mailbox credential (currently hardcoded — must be rotated and removed from source) |
| Initial folder | `INBOX` |
| Processed folder | `INBOX.Procesados` (move target after all attachments saved) |

**Never commit or echo real credential values.** The repository historically contained plaintext passwords in `main.py` and `imap.py`; summaries and RAG indexes must reference only setting *names* and purposes.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP surface**. There is no web server, Workers route, or OpenAPI spec. All interaction is via direct Python script execution against IMAP.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | — | N/A — no HTTP API | — |

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| CLI — `main.py` | Run with Python interpreter; prints each saved attachment (`subject - filename`); prints `done` on completion. |
| CLI — `imap.py` | Invokes `revisar()` at import time; incomplete and not suitable for production use. |
| IMAP | SSL login, `INBOX` fetch all messages, extract `.csv` attachments, move to `INBOX.Procesados`. |

## 7. Data & persistence

**Persistence model:** flat CSV files written to the script's current working directory (same directory as the scripts in this repo layout).

### Daily device occupation files (`*-daily-device_ocupation.csv`)

- **Grain:** one row per device per `ocupation_begin_date_time`.
- **Key columns:** `device_id`, `device_identification`, `device_desc`, hourly occupancy percentages (`hour_10` through `hour_05`), `ocupation_average`.
- **Semantics:** Hour columns hold percentage occupancy for each clock hour; `ocupation_average` is the daily average.

### Session export files (`Mendoza_Sesion_YYYYMMDD.csv`)

- **Grain:** one row per gaming device snapshot.
- **Key columns:** `sala`, `numero`, `identificacion`, `modelo`, `denominacion`, `fecha`, `hora`, `porcentaje`, financial counters (`credjugado`, `credganado`, `credpagmanu`, `credcajon`, `partidas`, `credbilletes`, `jackpot`, `ticketin`, `ticketout`, promo ticket fields).
- **Semantics:** Roulette session telemetry for Casino Mendoza floor machines at a point-in-time stamp.

**Topology:** Offline batch — no database, object store, or edge worker. Email server is the upstream source; local disk is the sink.

## 8. Docs & agent memory (required scan)

| Source | Finding |
|--------|---------|
| `README.md` | Contains only the project title `# ProcesarOcupacion`; no usage instructions, install steps, or architecture notes. |
| `docs/` | Not present. |
| `.docs/` | Not present (scanned — directory does not exist). |
| `.claude/` | Not present (scanned — directory does not exist). |
| ADR / PRD / constitution | Not present. |
| GitHub repo description (hint) | "descarga ficheros de ocupación csv" — aligns with IMAP CSV harvest purpose. |

Behavioral documentation is effectively **the Python source itself** plus the CSV column headers in committed sample files.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` — internal Mendoza Central / kodexArg tooling; do not treat as a public product or link clone instructions in downstream RAG as if it were open source.
- **Auth model:** IMAP username/password against a dedicated monitoring mailbox. No OAuth, API tokens, or session cookies.
- **Critical security debt:** Both `main.py` and `imap.py` embed plaintext mailbox credentials in source. These must be treated as compromised, rotated on the mail server, and removed from the repository history before any wider sharing. This summary intentionally contains **no** passwords, tokens, or connection strings.
- **Data sensitivity:** Committed CSVs contain operational casino metrics (device IDs, financial counters, occupancy). They are business-sensitive even though they are not authentication secrets.
- **This summary contains no secrets.**

## 10. Operational picture

### Local development / execution

1. Install Python 3 and the `imap_tools` package (no pinned version in-repo).
2. Run `python main.py` from the repository root (or any directory where CSV output should land).
3. Expect new `*.csv` files to appear alongside the script and processed emails to move to `INBOX.Procesados`.

There is no documented virtualenv, `Makefile`, or `bun`/`npm` workflow. `imap.py` should not be run in production without completing and testing it.

### Deployment

No GitHub Actions, Cloudflare Workers, Docker, or cron manifests were found. Deployment is assumed to be **manual or ad-hoc scheduled** on a machine with network access to the Mendoza Central IMAP host.

### Hardware constraints

None evident — lightweight IMAP client suitable for any general-purpose host.

## 11. Open questions / unknowns

- Whether `main.py` or `imap.py` is the canonical script today (only `main.py` is complete).
- Who schedules the harvester and on what cadence (daily cron vs on-demand).
- Whether `INBOX.Procesados` folder creation is manual or automatic on the mail server.
- Intended downstream consumer of saved CSVs (BI tool, spreadsheet, custom ETL) — not documented.
- Why sample CSVs through January 2021 are committed but no newer files appear (repo may be abandoned or data collection moved elsewhere).
- No `requirements.txt` — exact `imap_tools` version used in production is unknown.
- Whether credentials in source are still valid or have been rotated since last commit.
