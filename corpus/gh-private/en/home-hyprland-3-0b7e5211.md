---
id: home-hyprland-3-0b7e5211
title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — P2 — Dual-GPU + dual-monitor Hyprland stability"
visibility: private
importance: normal
source_repo: "home-hyprland"
related: []
tags: ["home-hyprland", "github", "private", "normal", "summary"]
---

### P2 — Dual-GPU + dual-monitor Hyprland stability - **Who hurts:** Operators on NVIDIA (card0) + amdgpu (card1) with landscape primary on one GPU and portrait on another — a layout prone to EGL import failures, phantom cursors, blanked panels after idle, and broken CRTC after DPMS. - **Pain today:** Default Hyprland/NVIDIA env vars insufficient; automatic DPMS blanks both panels; batching two hl.monitor() calls races DRM page-flip; layer-shell clients (hyprpaper, AGS bar) keep stale geometry after scale changes; AGS dies after monitor storms unless supervised. - **How this repo answers:** hypr/hyprland.lua sets AQ_DRM_DEVICES, AQ_FORCE_LINEAR_BLIT, NVIDIA VA-GLX env, cursor policy (hardware cursors + CPU buffer, default monitor on portrait). hypr/hypridle.conf disables automatic DPMS listeners; wake runs hypr-monitor-heal after-sleep. bin/hypr-monitor-heal implements hard rules (never DPMS portrait, sequential modesets, soft-hotplug). bin/hypr-zoom-toggle toggles portrait scale 1.0 ↔ 1.5 with settle delay and layer resync. systemd/user/ags-hyprland.service restarts AGS with GSK_RENDERER=gl. Super+Shift+O binds manual heal. - **Out of scope:** General NVIDIA driver support for all distros; single-GPU simplified layouts; automatic DPMS on portrait without ADR-level review.
