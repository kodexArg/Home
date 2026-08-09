---
id: dj-crudo-0-b249cfd4
title: "dj-crudo — Django WiFi captive portal and survey CRUD — dj-crudo"
visibility: private
importance: normal
source_repo: "dj-crudo"
related: []
tags: ["dj-crudo", "github", "private", "normal", "summary"]
---

# dj-crudo > **Problem thesis (required):** dj-crudo is a private, minimal **Django CRUD application** born from the desire to replace a Google Form with something self-hosted ("because I'm a simple man with simple needs"). In practice it serves two overlapping purposes: a **WiFi captive portal** branded "KM1107 - WiFi Portal" where visitors authenticate via Google OAuth before seeing a connected message, and a **survey intake system** that stores personal data (name, email, phone, birth date, nationality, document, comment) in PostgreSQL. A distinctive — and deliberately dangerous — **host pipe bridge** lets the container send shell commands to the host through a FIFO at /pipe, with the stated goal of managing **iptables** on the host from inside Docker. The repo is small, Spanish/Portuguese/English-facing, Docker-first, and carries 2022-era dependencies with hardcoded dev credentials and no CI pipeline.
