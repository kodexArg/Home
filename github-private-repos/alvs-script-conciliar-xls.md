---
id: "alvs-script-conciliar-xls"
title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas"
visibility: private
importance: normal
source_repo: "alvs-script-conciliar-xls"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["alvs", "python", "pandas", "tkinter", "excel", "xlsx", "mercado-pago", "cobranzas", "conciliacion", "desktop", "accounting", "private"]
problems_solved:
  - "ALVS operators must reconcile Mercado Pago payment exports against two separate Cobranzas Electrónicas ledgers (KM1151 and Las Bóvedas) plus an internal Planilla 1 transfer sheet — a tedious manual cross-check in spreadsheets."
  - "Unmatched or mismatched transactions (amount drift, timestamp drift, orphan cobranza rows) are hard to spot when juggling four Excel sources with different layouts and header offsets."
  - "Finance review needs a single annotated result workbook plus residue files listing cobranza rows that never matched any Mercado Pago operation."
technologies:
  - "Python 3"
  - "pandas"
  - "openpyxl (via pandas Excel I/O)"
  - "tkinter (stdlib GUI)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# alvs-script-conciliar-xls

> **Problem thesis (required):** This private repository is a **local desktop utility** for ALVS internal accounting: it ingests four Excel exports — Mercado Pago activity, Planilla 1 (Transferencias sheet), and two Cobranzas Electrónicas files (KM1151 and Las Bóvedas) — and produces a reconciled Mercado Pago ledger annotated with match status, amount/time deltas, and source labels, plus two residue workbooks for unmatched cobranza rows. The tool replaces repetitive manual VLOOKUP-style work with a guided tkinter GUI and a deterministic three-pass matching pipeline implemented in `logic.py`.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/alvs-script-conciliar-xls` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Python desktop app that conciliates Mercado Pago operations against KM1151, Las Bóvedas cobranzas, and Planilla 1, writing annotated Excel outputs and orphan-residue files. |
| Audience | Internal ALVS finance / cobranzas operators who export spreadsheets from Mercado Pago and electronic-collection systems; kodexArg maintainers who run or extend the script locally. |

## 2. Problems it solves

### P1 — Multi-source payment reconciliation for Mercado Pago

- **Who hurts:** ALVS operators responsible for verifying that Mercado Pago settlements align with internal Cobranzas Electrónicas records from two distinct collection channels (KM1151 and Las Bóvedas).
- **Pain today:** Each source uses a different Excel layout (cobranza files skip six header rows; Planilla 1 uses a named sheet with currency-formatted amounts). Manually comparing `Operación Relacionada` in Mercado Pago against `Transacción` in cobranza exports is slow and error-prone across hundreds of rows.
- **How this repo answers:** `logic.py` filters Mercado Pago to relevant operation types (`Cobro`, `Ingreso de dinero`, `Dinero recibido`), then runs sequential matching: first KM1151 cobranzas, then Las Bóvedas cobranzas (by transaction ID), then Planilla 1 (for still-unmatched rows). Each match annotates the result row with conciliation label, counterpart amount/date, and computed deltas. Unmatched Mercado Pago rows are marked `No Conciliado`.
- **Out of scope:** Live API integration with Mercado Pago or cobranza backends; automated scheduling; multi-user server deployment; currency conversion beyond what the source spreadsheets already encode.

### P2 — Surfacing amount and timestamp discrepancies

- **Who hurts:** Reviewers who must distinguish clean matches from near-matches that need human follow-up.
- **Pain today:** A transaction ID match with a peso difference or a payment timestamp skewed by several minutes can look "matched" in a naive join but still indicate data or timing issues.
- **How this repo answers:** `marcar_coincidencias_cobranzas` computes `Dif Importe` (Mercado Pago import minus cobranza `Cobrado`) and `Dif Minutos` (payment date minus cobranza `Fecha`). Thresholds flag `revisar importe` when absolute amount delta exceeds 1 unit, and `revisar fecha` when minute delta exceeds 10 (default tolerance). Planilla 1 matching uses a separate amount tolerance of 15 units before flagging `Planilla 1 - revisar monto`.
- **Out of scope:** Automatic correction of discrepancies; dispute resolution workflows; audit trail beyond the generated Excel columns.

### P3 — Orphan cobranza residue extraction

- **Who hurts:** Operators who must also identify cobranza rows that were never tied to any Mercado Pago operation in the export window.
- **Pain today:** Focusing only on Mercado Pago leaves "extra" cobranza entries invisible unless a second manual pass is done.
- **How this repo answers:** After matching, `extract_non_conciliated` pulls rows from each cobranza DataFrame where `Conciliado` remained false, producing `cobranzas_km1151_residuo.xlsx` and `cobranzas_bovedas_residuo.xlsx` alongside the main `conciliacion_result.xlsx`.
- **Out of scope:** Reverse-matching Planilla 1 orphans; merging residue files across periods; alerting or ticketing.

## 3. Product / idea

The mental model is a **single-session desktop ETL + reconciliation pipeline**:

1. Operator launches `gui.py`, which opens a tkinter window titled "Conciliación de Cobranzas".
2. Four file-picker fields collect paths to: Mercado Pago export, Planilla 1 workbook, Cobranzas KM1151, Cobranzas Las Bóvedas (all `.xlsx`).
3. "Ejecutar Proceso" imports and normalizes each source into pandas DataFrames (`gui.py` import helpers), then delegates to `process_logic` in `logic.py`.
4. On success, three Excel files are written to the process working directory: main conciliation result and two cobranza residue files. A success dialog and scrollable log panel provide operator feedback.

The reconciliation engine is intentionally **sequential and priority-ordered**: cobranza channels are tried before Planilla 1, and KM1151 before Las Bóvedas. A Mercado Pago row already matched in an earlier pass is not reconsidered in later passes (Planilla matching only runs when `Conciliación` is still empty).

### 3.1 North-star use cases

1. **Monthly close review** — Operator exports four spreadsheets from Mercado Pago and internal cobranza systems, runs the tool once, and distributes `conciliacion_result.xlsx` to finance for sign-off.
2. **Exception hunting** — Reviewer filters result rows labeled `revisar importe` or `revisar fecha` to prioritize manual investigation.
3. **Orphan cobranza audit** — Operator opens `cobranzas_km1151_residuo.xlsx` or `cobranzas_bovedas_residuo.xlsx` to find electronic-collection entries with no Mercado Pago counterpart in the selected period.

### 3.2 Non-goals

- No web UI, HTTP API, database, or cloud deployment artifacts are present.
- No README, dependency manifest, or CI pipeline — the repo assumes a local Python environment with pandas and Excel support already available.
- Input Excel templates are not versioned in-repo (the `excels/` directory is gitignored); only example **output** workbooks are committed at repo root.
- Agent harness directories (`.claude/`, `.docs/`) are absent — this is a standalone operator script, not an agent-governed harness project.

## 4. Technology stack

Derived from source imports and file layout only; no `requirements.txt`, `pyproject.toml`, or lockfile exists in the tracked tree.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (type hints use `tuple[...]` and `DataFrame \| None` syntax) | `gui.py`, `logic.py` |
| Data processing | pandas | `import pandas as pd` in both modules |
| Excel I/O | pandas `read_excel` / `to_excel` (typically backed by openpyxl) | `gui.py` import helpers, `generate_output` |
| GUI | tkinter + `scrolledtext`, `filedialog`, `messagebox` | `gui.py` |
| Backend / API | none | no HTTP modules |
| Data | in-memory DataFrames only; file-based Excel | `logic.py`, `gui.py` |
| Infra / deploy | local desktop execution | no CI, Docker, or IaC |
| AI / agents | none | `.claude/` not present |
| Tests | none evident | no `tests/` or test configs |

### 4.1 Notable dependencies (curated)

- `pandas` — core tabular engine for import, merge logic, filtering, and Excel export.
- `tkinter` (stdlib) — file selection UI, log panel, and process trigger; no external GUI framework.
- `datetime` / `timedelta` — minute-delta computation between Mercado Pago payment time and cobranza fecha (`logic.py`).

## 5. Repository map (abstraction)

- **Entrypoints:** `gui.py` (`run_application`, `if __name__ == "__main__"`) — operator-facing launcher; `logic.py` (`process_logic`) — reconciliation orchestration callable from GUI.
- **Domain / core:** `logic.py` — `inicializar_df_resultado`, `marcar_coincidencias_cobranzas`, `marcar_coincidencias_planilla`, `finalizar_resultado`, `extract_non_conciliated`.
- **Adapters:** `gui.py` import helpers — `import_mercado_pago`, `import_cobranza_electronica`, `import_planilla_1` — encapsulate per-source Excel parsing quirks (skip rows, sheet name, column normalization).
- **Docs vaults:** none (`docs/`, `.docs/`, ADRs, README all absent).
- **Agent scaffolding:** none (`.claude/` not present).
- **Example outputs (committed):** `conciliacion_result.xlsx`, `cobranzas_km1151_residuo.xlsx`, `cobranzas_bovedas_residuo.xlsx` — sample run artifacts at repo root; binary contents not ingested for this summary.
- **Gitignored zones (not read):** `excels/`, `pb/`, `conciliacion.xlsx`, `venv/`, `.env/`, `__pycache__/`, editor configs per `.gitignore`.

## 6. Configuration & contracts (no secrets)

No environment variables, feature flags, or external service bindings. The application is fully offline and path-driven via GUI file pickers.

**Expected input schemas (from import helpers):**

| Source | Key columns / conventions | Import notes |
|--------|---------------------------|--------------|
| Mercado Pago | `Tipo de Operación`, `Operación Relacionada`, `Importe`, `Fecha de Pago` | Full sheet read; date parsed as ISO `YYYY-MM-DDTHH:MM:SSZ` |
| Cobranzas Electrónicas (KM1151 / Las Bóvedas) | `Transacción`, `Cobrado`, `Fecha` | `skiprows=6`; drop non-numeric `Transacción` rows (totals) |
| Planilla 1 | Sheet `Transferencias`: `Nro Operación`, `Importe`, `Fecha`, `Planilla` | `skiprows=1`; strip `$` and `,` from Importe strings |

**Output files (written to cwd on run):**

| File | Contents |
|------|----------|
| `conciliacion_result.xlsx` | Filtered Mercado Pago rows with conciliation annotations |
| `cobranzas_km1151_residuo.xlsx` | KM1151 cobranza rows not matched |
| `cobranzas_bovedas_residuo.xlsx` | Las Bóvedas cobranza rows not matched |

**Result DataFrame columns added by logic:** `Conciliación`, `Importe C.E.`, `Fecha C.E.`, `Dif Importe`, `Dif Minutos`, `Planilla`.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP surface**. It is a local tkinter desktop application with file-picker inputs and filesystem Excel outputs. There is no REST API, CLI subcommand interface beyond running `python gui.py`, OpenAPI spec, or network listeners.

### 6.2 Other interfaces

- **GUI workflow:** Select four `.xlsx` inputs → click "Ejecutar Proceso" → read log panel → open generated workbooks from working directory.
- **Programmatic hook:** `process_logic(log_widget, df_mercado_pago, df_planilla_1, df_km1151, df_las_bovedas)` in `logic.py` accepts pre-loaded DataFrames (designed for GUI integration, not documented as a standalone library API).
- **Dead code note:** `generate_no_conciliados_output` in `gui.py` references an `output_entry` widget that is not wired in `run_application` — appears to be an unfinished alternate export path.

## 7. Data & persistence

All data lives **in-memory** as pandas DataFrames during a run. Persistence is **write-only Excel export** to the current working directory. No database, KV store, or cloud object storage.

**Reconciliation state tracking:** cobranza and planilla DataFrames gain a transient `Conciliado` boolean column during processing to support residue extraction; this column is not part of the exported residue schema (only unmatched rows are exported).

**Topology:** single-machine, offline, operator workstation. Input files are read from user-selected paths; outputs land beside the process cwd (typically the directory from which `gui.py` was launched).

## 8. Docs & agent memory (required scan)

Scanned paths and findings:

1. **Root README** — not present.
2. **`docs/**`** — not present.
3. **`.docs/**`** — not present (directory does not exist).
4. **ADR / PRD / constitution** — not present.
5. **`.claude/**`** — not present (directory does not exist).
6. **Inline documentation** — Spanish docstrings and comments in `logic.py` and `gui.py` describe matching rules, tolerances, and import assumptions; UI strings are Spanish (`Conciliación de Cobranzas`, file-picker labels, success/error dialogs).
7. **`.gitignore`** — documents ignored zones: Python bytecode, virtualenvs, `excels/`, `pb/`, `conciliacion.xlsx`, editor folders, logs.

**Evidence paths used:** `logic.py`, `gui.py`, `.gitignore`, committed sample output filenames at repo root.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` — internal ALVS tooling; summary contains no clone URLs or credentials.
- **Auth model:** none — local desktop app with no authentication, authorization, or network calls.
- **Data sensitivity:** processes financial transaction exports (amounts, transaction IDs, dates) entirely on the operator machine; no telemetry or upload path in code.
- **Secrets:** no `.env`, API keys, tokens, or credential files in the tracked tree. `.gitignore` excludes `.env/` and virtualenv directories. This summary contains no secrets.

## 10. Operational picture

**Local run (inferred — no README):**

1. Ensure Python 3 with `pandas` (and an Excel engine such as `openpyxl`) installed.
2. From the repo directory: `python gui.py` (or `python3 gui.py`).
3. Select the four input `.xlsx` files via GUI buttons.
4. Click "Ejecutar Proceso".
5. Collect `conciliacion_result.xlsx`, `cobranzas_km1151_residuo.xlsx`, and `cobranzas_bovedas_residuo.xlsx` from the working directory.

**Deployment:** none — no GitHub Actions, Dockerfile, or wrangler config. The committed sample output files suggest the tool has been run at least once and outputs were checked into version control (unusual for generated artifacts; operators may prefer regenerating locally).

**Hardware constraints:** standard desktop/laptop; no GPU or special peripherals required. GUI fixed geometry `850x500` pixels.

## 11. Open questions / unknowns

- **Dependency pinning:** no `requirements.txt` or `pyproject.toml` — exact pandas / openpyxl versions used in production are unknown.
- **Python version floor:** modern type-hint syntax suggests 3.10+, but no `.python-version` file exists.
- **Input template stability:** cobranza `skiprows=6` and Planilla 1 `Transferencias` sheet layout are hard-coded; unknown whether export formats from Mercado Pago or cobranza systems have changed since authoring.
- **Committed output workbooks:** `conciliacion_result.xlsx`, `cobranzas_km1151_residuo.xlsx`, and `cobranzas_bovedas_residuo.xlsx` at repo root appear to be example run outputs rather than inputs — intent (fixture vs accidental commit) is not documented.
- **`generate_no_conciliados_output`:** function exists in `gui.py` but is not connected to the UI — purpose and target workflow unclear.
- **ALVS naming context:** "KM1151" and "Las Bóvedas" are treated as distinct cobranza channels per code labels; organizational mapping to physical locations or systems is not documented in-repo.
- **Agent / docs vault:** `.claude/` and `.docs/` directories do not exist in this repository; no agent harness or hidden documentation vault to summarize.
