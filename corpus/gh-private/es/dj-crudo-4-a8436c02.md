---
id: dj-crudo-4-a8436c02
title: "dj-crudo — Django WiFi captive portal and survey CRUD — P3 — Container-to-host command execution for firewall control"
visibility: private
importance: normal
source_repo: "dj-crudo"
related: []
tags: ["dj-crudo", "github", "private", "normal", "summary"]
---

### P3 — Container-to-host command execution for firewall control - **Who hurts:** Developers deploying Django in Docker on a host that also runs the network edge (e.g., a Raspberry Pi or gateway box) who want the app to influence host iptables without SSH sidecars. - **Pain today:** Containers cannot normally modify host firewall rules. SSH or a privileged sidecar adds operational complexity. - **How this repo answers:** config/pipe.py defines run_on_pipe(cmd) which writes a command string into /hostpipe (bind-mounted from host /pipe). On the host, pipe_line.sh loops forever executing eval "$(cat /pipe)". Docker Compose mounts /pipe:/hostpipe on the web service. settings.py imports run_on_pipe and includes a commented example # run_on_pipe("iptables -L"). The README explicitly warns about the security implications ("what can possible go wrong with it"). - **Out of scope:** Command allowlisting, audit logging, privilege separation, seccomp profiles, and any production-grade remote execution framework. This is a proof-of-concept bridge, not a hardened control plane.
