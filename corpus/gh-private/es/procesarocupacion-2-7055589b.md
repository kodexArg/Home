---
id: procesarocupacion-2-7055589b
title: "ProcesarOcupacion — IMAP harvester for casino device-occupation CSV reports — P1 — Manual download of daily occupation CSV attachments"
visibility: private
importance: normal
source_repo: "ProcesarOcupacion"
related: []
tags: ["procesarocupacion", "github", "private", "normal", "summary"]
---

### P1 — Manual download of daily occupation CSV attachments - **Who hurts:** Monitoring staff and analysts who need per-device hourly occupancy percentages for the gaming floor. - **Pain today:** Occupation reports are emailed automatically from upstream systems; someone must open the mailbox, identify CSV attachments, save them locally, and avoid re-processing the same messages. - **How this repo answers:** connects to the Mendoza Central IMAP server, iterates inbox messages, writes every attachment to the working directory using its original filename, and moves fully processed messages to so they are not fetched again. - **Out of scope:** Parsing, aggregating, visualizing, or loading CSV data into a database. No scheduling, alerting, or validation of CSV contents.
