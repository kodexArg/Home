---
id: pihome-2-569cecc3
title: "PiHome — Django multimedia hub for Raspberry Pi — P1 — Pi-local multimedia without a cloud stack"
visibility: private
importance: normal
source_repo: "PiHome"
related: []
tags: ["pihome", "github", "private", "normal", "summary"]
---

### P1 — Pi-local multimedia without a cloud stack - **Who hurts:** Someone hosting photos, audio, or video on a Raspberry Pi who wants a minimal web front door instead of SSH and manual folder management. - **Pain today:** Files land in arbitrary directories with no shared naming scheme, no sort order for playlists or slideshows, and no single page to see what is on the device. - **How this repo answers:** The PiMedia Django app defines an ArchivosMultimedia model (name, order, auto date, file field) and exposes routes for listing (Listado/), structured add (Agregar/), and a scratch upload path (Subida/) that writes directly to filesystem storage without touching the database. - **Out of scope:** Streaming transcoding, CDN delivery, multi-user permissions beyond Django admin, mobile apps, or cloud sync.
