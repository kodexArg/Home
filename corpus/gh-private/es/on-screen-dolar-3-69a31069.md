---
id: on-screen-dolar-3-69a31069
title: "on-screen-dolar — fullscreen TV exchange-rate marquee with Telegram price updates — P2 — Remote price updates without sitting at the display PC"
visibility: private
importance: normal
source_repo: "on-screen-dolar"
related: []
tags: ["on-screen-dolar", "github", "private", "normal", "summary"]
---

### P2 — Remote price updates without sitting at the display PC - **Who hurts:** The person who knows the new rate but is not at the machine hooked to the TV. - **Pain today:** Walking to the display machine or using ad-hoc file shares to edit JSON is slow and error-prone during busy trading windows. - **How this repo answers:** bot.py implements a Telegram listener. Authorized users send messages in the form Cambiar <moneda> <precio> (Spanish command prefix configurable in the dialog dict). The bot validates currency keys against prices.json, writes the updated JSON, and replies with confirmation. The on-screen marquee picks up new values on its next read cycle. - **Out of scope:** Multi-tenant bot hosting, rate approval workflows, audit trails beyond log files, WhatsApp integration (listed as future roadmap only).
