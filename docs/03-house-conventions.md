# 03 — House Conventions (how Patrick sets up his sites)

> Captured 2026-06-29 by scanning the sibling projects under
> `/home/patrick/Documents/Claude/Projects`. This is the template to match so this
> project feels like the rest of Patrick's work.

## Templates we draw from

This project sits alongside Patrick's other homelab projects (kept private). Two
patterns from them shape this repo:

- a **static site template** (plain HTML/CSS/JSON, `build/`+`data/`+`deploy/`
  subfolders, nginx-on-LXC deploy) — the model for `web/`;
- a lean **`CLAUDE.md` + numbered `docs/`** layout — the model for how this repo's
  brain is organized.

The concrete source projects, their paths, and any infra detail stay in the private
homelab repos — not enumerated here.

## ★ Site template: `Network/moorelab-website`

A personal landing/showcase for `moorelab.cloud`. Conventions to copy:

- **Static-first, no framework.** Plain `index.html` + `style.css` + `projects.json`.
  Pages render by `fetch()`-ing the JSON — **JSON is the single source of truth for
  content**, no build step. There's literally a "Why not React/Next.js" section: a
  small site is faster/easier as static HTML + a tiny `fetch()`.
- **Subfolder layout:** `build/` (helper scripts), `data/` (content seeds),
  `deploy/` (nginx conf + CT-setup runbook + HAPROXY.md), `thumbs/`, `fonts/`.
- **Design language is documented in CLAUDE.md**: explicit palette, font choice,
  spacing tokens (`clamp()`), and a deliberately small "motion budget."
- **Cache-busting** via `?v=YYYYMMDD` query on the stylesheet link.
- **Local dev:** `python3 -m http.server 8000` (note: `fetch()` needs a real HTTP
  server; `file://` won't work).
- **Cute touch:** nginx maps curl/wget User-Agents to an ANSI `cli.txt` so
  `curl moorelab.cloud` returns a terminal version. (Not needed for the wedding
  site, but shows the level of polish expected.)

## ★ CLAUDE.md + docs/ layout

The exact pattern (mirrored from another homelab project) Patrick asked us to use:

- **`CLAUDE.md` is lean and auto-loads.** Opens with `# NAME — tagline` and the note
  that detail lives in `docs/` (read on demand).
- A dated **`## STATUS (YYYY-MM-DD) — single source of truth`** block near the top.
- Safety/danger and **Canonical facts** sections where relevant.
- A **`## Reference (read on demand)`** section at the bottom that links each doc as
  `[`docs/NN-name.md`](docs/NN-name.md)` — **numbered** files (`01-…`, `02-…`,
  `04-…`), plus `GOTCHAS.md`, `REFERENCE.md`, `WORKLOG.md`.
- Mentions the cross-session harness memory index `MEMORY.md`.

## Deployment topology (Patrick's real infra — IMPORTANT)

- **No Docker on the homelab.** Deploys are **Proxmox LXC containers** running nginx,
  fronted by **HAProxy on OPNsense** (LE wildcard TLS), with **Cloudflare** DNS/proxy
  in front. DDNS via OPNsense.
- Static files live at `/var/www/<site>/` on the CT; push via `pct push` (or rsync
  to the Proxmox host then `pct push`), then `nginx -t && systemctl reload nginx`.
- CTs are tiny Debian 12 LXCs (1 vCPU / 512MB) on the site VLAN, static IPs.
- **Live infra is sensitive.** Real creds + the concrete IPs/VLANs live ONLY in the
  **private homelab repo** — never in this (public) repo. Public copy must not leak
  internal network detail (house rule: "no VLAN/IP info in public").

## Conventions checklist for THIS project

- [x] Lean `CLAUDE.md` + numbered `docs/` (this folder).
- [x] Dated STATUS block as single source of truth.
- [x] `WORKLOG.md` for the dated build narrative.
- [ ] Static-first `web/` with content driven by a JSON file.
- [ ] `deploy/` runbook cloned/adapted from `moorelab-website/deploy/`.
- [ ] Document the pastel-Maine design language (palette, fonts, motion budget).
- [ ] `.gitignore` adapted from moorelab (+ `.env`, DB files, secrets).
- [ ] Keep secrets out of git; public copy leaks no infra detail.

## Tooling on archy-boi (verified 2026-06-29)

`git 2.54` · `gh 2.95` (authed as **tricheboars**) · `node 26` · `npm 11` ·
`python 3.14`. **No docker.** Commit identity: Patrick Moore
`<36495234+tricheboars@users.noreply.github.com>`.
