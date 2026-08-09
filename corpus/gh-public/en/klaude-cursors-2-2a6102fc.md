---
id: klaude-cursors-2-2a6102fc
title: "Klaude Cursors — Bibata-based rounded cursor theme with Claude coral accent — P1 — Missing coral-accent Bibata color variant"
visibility: public
importance: normal
source_repo: "klaude-cursors"
related: ["klaude-cursors"]
tags: ["klaude-cursors", "github", "public", "normal", "summary"]
---

### P1 — Missing coral-accent Bibata color variant - **Who hurts:** Linux users who prefer Bibata's compact, material-rounded cursor shapes but want the warm Claude coral (#D97757, RGB 217/119/87) instead of Bibata's Ice, Amber, or other official palettes. - **Pain today:** Upstream Bibata ships multiple colorways and a full clickgen build pipeline, but none targets this specific coral tone. Manually recoloring hundreds of PNG frames (including 54-frame animated wait/watch cursors) is tedious and error-prone; hue shifts can break anti-aliased edges and brightness gradients baked into the Ice master set. - **How this repo answers:** The bitmaps/Klaude/ tree holds 164 recolored PNG sources. recolor.py implements a deterministic white-pixel replacement algorithm: pixels with all RGB channels ≥ 185 are mapped to coral while preserving per-pixel brightness via averaged scaling, leaving non-whiteish pixels untouched for shadow and outline fidelity. The shipped cursors/ directory contains finished Xcursor 1.0 binaries so consumers never run the recolor step. - **Out of scope:** Windows .cur / macOS .car cursor packs; non-Bibata cursor geometries; dynamic per-app cursor injection (contrast with IDE-level chrome repos like kdx-cursor-forced-theme).
