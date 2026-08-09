---
id: kdx-pi-signage-2-3-74417125
title: "KDX Pi Signage 2 — headless Raspberry Pi digital signage from Google Drive — P2 — Cloud-managed playlist with local resilience"
visibility: public
importance: normal
source_repo: "kdx-pi-signage-2"
related: ["kdx-pi-signage-2"]
tags: ["kdx-pi-signage-2", "github", "public", "normal", "summary"]
---

### P2 — Cloud-managed playlist with local resilience - **Who hurts:** Teams that curate videos in Google Drive and expect every Pi to mirror changes (new files, updates, deletions) without downtime. - **Pain today:** Stale local copies, orphaned files after remote deletion, and sync jobs that block or interrupt the visible loop. - **How this repo answers:** Architecture separates VideoRepository (sync) from VideoPlayer (display). PlaybackService runs sync on a background daemon thread at SYNC_INTERVAL seconds while playback continues on another thread. GoogleDriveRepository sketches delta sync: compare remote listing to local metadata under cache/metadata/, download new/changed assets into videos/, delete locals whose Drive IDs disappeared, and persist SHA-256 checksums per file. tenacity is declared for retry semantics on transient network failures. - **Out of scope:** Real-time push webhooks from Drive (polling interval model only); DRM or encrypted streams.
