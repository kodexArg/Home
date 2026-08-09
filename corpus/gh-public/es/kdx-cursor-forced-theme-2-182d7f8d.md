---
id: kdx-cursor-forced-theme-2-182d7f8d
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — P1 — Theme API limits vs. forced chrome styling"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---

### P1 — Theme API limits vs. forced chrome styling - **Who hurts:** Developers using Cursor Agents / Glass mode who want Presentation Orange (ink/cream/orange/teal) instead of Cursor's default cool grays and sky-blue accents; teams aligning desktop Hyprland + AGS chrome with IDE appearance. - **Pain today:** VS Code and extension color themes cannot set radial backgrounds, remap Glass CSS variables on / , transparent auxiliary bars, or composer-specific surfaces (human message cards vs. sunken prompt input). Cursor's Agents Window hard-codes cool grays that hide intended glow recipes. - **How this repo answers:** Split source CSS under defines tokens, backgrounds, icons, hairlines, and prompt-input rules targeting both and classic selectors. concatenates parts into ; injects that bundle as between HTML comment markers in the live . - **Out of scope:** Editor syntax highlighting themes (handled separately by / ); Codium-only glow (see companion repo ); AppImage installs where app files are read-only.
