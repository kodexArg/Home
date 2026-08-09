---
id: alvs-registros-libros-societario-0-8a8dfe34
title: "ALVS Registro de Libros Societarios — corporate registry web application for Grupo ALVS — ALVS Registro de Libros Societarios"
visibility: private
importance: high
source_repo: "ALVS-REGISTROS-LIBROS-SOCIETARIOS-KODEXARG"
related: []
tags: ["alvs-registros-libros-societarios-kodexarg", "github", "private", "high", "summary"]
---
## ALVS Registro de Libros Societarios

> **Problem thesis (required):** Grupo ALVS maintains corporate registry operations for client entities — statutory books and folios, shareholder cap tables, governing-body officers, assembly checklists, compliance reminders and filings, and litigation dockets — historically through the legacy REGISTROS application. This repository is the migration to the kodexArg template: a private, authenticated web application where PostgreSQL is the system of record, Django enforces per-entity read/write grants on top of Cognito login, the Astro SSR frontend renders Spanish operator copy, and a governed harness keeps API, ADR, and documentation discipline as the surface grows by addition.
