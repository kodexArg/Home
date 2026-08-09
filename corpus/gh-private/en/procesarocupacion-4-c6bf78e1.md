---
id: procesarocupacion-4-c6bf78e1
title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — 3. Product / idea"
visibility: private
importance: normal
source_repo: "ProcesarOcupacion"
related: []
tags: ["procesarocupacion", "github", "private", "normal", "summary"]
---
## 3. Product / idea

The repository is a **small, script-first data-ingestion utility** with no web UI, API, or packaging layer. The mental model is: *mailbox → filter CSV attachments → write files locally → mark email as processed*. Two Python entrypoints exist: 1. ** (functional path):** Uses the third-party library ( , ) for a concise fetch-and-move loop. This is the script that actually runs end-to-end. 2. ** (incomplete prototype):** Uses Python's standard and modules with a function that begins attachment walking but is syntactically incomplete (truncated expression) and never finishes the download logic. It appears to be an earlier or abandoned approach. The repo doubles as a **sample data vault**: twenty-six CSV files from November 2020 through January 2021 are checked in, giving consumers concrete examples of both file families without needing live mailbox access.
