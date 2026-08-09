---
id: pymceocup-2-0d99432c
title: "PyMceOcup — Casino Mendoza slot occupancy ETL — P1 — Email-delivered CSVs require manual download"
visibility: private
importance: low
source_repo: "PyMceOcup"
related: []
tags: ["pymceocup", "github", "private", "low", "summary"]
---

### P1 — Email-delivered CSVs require manual download - **Who hurts:** Monitoring operators responsible for daily slot-floor occupancy reports at Casino Mendoza. - **Pain today:** Occupancy data arrives as CSV attachments in a shared IMAP inbox. Without automation, someone must open each message, save attachments locally, and track which messages were already processed. - **How this repo answers:** download_emails.py connects to the Mendoza Central corporate mail server via IMAP (imap_tools.MailBox), iterates inbox messages, saves any attachment whose filename ends in .csv, and moves fully processed messages to an INBOX.Procesados folder. A one-second sleep between messages reduces server throttling risk. - **Out of scope:** Parsing or validating CSV contents; scheduling (no cron/systemd); secure credential management (credentials are currently hardcoded in source — see §9).
