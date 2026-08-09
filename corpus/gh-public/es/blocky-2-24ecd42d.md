---
id: blocky-2-24ecd42d
title: "blocky — fast local-network DNS proxy and ad-blocker — P1 — Network-wide ad and malware blocking without per-device software"
visibility: public
importance: normal
source_repo: "blocky"
related: ["blocky"]
tags: ["blocky", "github", "public", "normal", "summary"]
---

### P1 — Network-wide ad and malware blocking without per-device software - **Who hurts:** Households, small offices, and IoT-heavy networks where installing ad-blockers on phones, TVs, consoles, and smart-home gear is impractical or impossible. - **Pain today:** Browser extensions only protect one app. ISP or router DNS passes through ads, trackers, and known-malware domains. Consumer routers rarely offer flexible blocklist management, regex rules, or deep CNAME inspection. - **How this repo answers:** Blocky sits on the LAN as the DNS server (typically via DHCP). It loads external deny and allow lists (hosts-format, plain domain lists, regex), supports per-client-group block policies (e.g. kids vs. smart-home), periodically refreshes lists, and can block at query domain, response CNAME chain, or resolved IP against IP lists. Blocking can be toggled at runtime via REST API or CLI for temporary bypass. - **Out of scope:** Full firewall replacement, VPN service, DHCP server, or DHCP lease management — blocky is DNS-only; network devices must be pointed at it separately.
