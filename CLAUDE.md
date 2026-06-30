# Carolyn + Merrick — Maine Wedding Site

Our most PROD build yet: a wedding website for Patrick's sister that's far more
capable than a typical wedding site — guest-helpful, **SMS-capable**, with a real
guest registry and services layer. Aesthetic: **pastel whimsy, clean design,
coastal Maine** as the overriding artistic theme.

This file auto-loads — kept lean. Detail lives in [`docs/`](docs/) (read on demand).

---

## STATUS (2026-06-30) — single source of truth

- **Phase 2 — LIVE on the real domain.** Coastal **slate/harbor-blue** theme; site +
  working API live. **Engagement photos** in (couple hero + Our Story + a **Gallery**
  page; Harpswell stock kept for location pages). **merrolyn.com is now LIVE** —
  nameservers → Cloudflare ✅, Universal SSL ✅ (mode **Full**, keep non-strict), apex
  `CNAME → moorelab.cloud` (proxied) ✅, `www` 301→apex ✅; serves our prod site + live
  API globally via Cloudflare. **dev/prod are now SEPARATE containers** (own nginx +
  Fastify API + SQLite DB each): `merrolyn.moorelab.cloud` = **dev** (`noindex`),
  `merrolyn.com` = **prod** (clean DB). Deploy specifics (CT/IPs/CF zone) in private memory.
  All public `TODO`s **softened to "Coming soon"/"TBA"** (real values pending). **Gotcha
  (resolved):** the LAN Pi-holes had cached GoDaddy's old apex IP from before the CF
  cutover → both flushed; if merrolyn.com ever shows GoDaddy's "coming soon" page again,
  it's a stale client/DNS cache (hard-refresh / flush DNS), not the server.
- **Wedding facts:** **Carolyn Moore** (bride, Patrick's sister) + **Merrick Harris**
  (groom). **August 14, 2027** at **The Harpswell Inn**, 108 Lookout Point Rd,
  Harpswell, ME 04079 (coastal). **Registry = cash / house fund** (not item registry).
- **DONE:** Confirmed the house static-site + lean `docs/` layout. Wrote
  vision/research/architecture/house-conventions. **Stack DECIDED** →
  [`docs/06-stack-decision.md`](docs/06-stack-decision.md) (11ty + Alpine / Fastify +
  SQLite / Twilio toll-free, 2 LXC CTs). **SMS cost** ~$60 all-in →
  [`docs/05-sms-cost.md`](docs/05-sms-cost.md). **Deep stack research done** (36 repos)
  → [`docs/04-stack-research.md`](docs/04-stack-research.md). **Design language** from
  the Save-the-Date → [`docs/07-design-language.md`](docs/07-design-language.md).
  **Prototype BUILT & pushed:** 11ty `web/` (7 pages, olive coastal-Maine design
  system, layered SVG scene backgrounds, C&M monogram + favicon, Alpine RSVP form),
  Fastify+SQLite `api/` skeleton, `deploy/` runbooks. Builds clean (11ty v3.1.6),
  Chromium screenshots verified.
- **DONE+:** RSVP **wired to a working API** (Fastify + `node:sqlite`; RSVP + registry
  persist, admin list/CSV, verified end-to-end incl. CORS). Real **coastal-Maine photo
  backgrounds** (Lookout Point hero + South Harpswell + Casco Bay + Cribstone Bridge,
  license-clean, `/credits/`). Added **FAQ** + **Things to do** pages/content.
- **NEXT:** (1) **registry handles** — `/registry/` now shows **"Coming soon"**; drop in
  real Venmo/Zelle/PayPal/mail in `web/src/_data/site.js` + redeploy (build per env,
  see `deploy/README.md`); (2) **mobile site** — audit + polish the responsive layout on
  phones (guests will mostly browse/RSVP on mobile): check the hero, nav, schedule, RSVP
  form, and gallery at small widths, tap targets, and image sizes; (3) couple-specific
  content (exact times, dress code, lodging block, their story); (4) accounts + SMS layer;
  (5) optional `dev → prod` redirect; (6) optional: add merrolyn.com to the origin cert if
  you ever want CF SSL "Full (strict)". **Audited 2026-06-30** (12-agent pass): deployment
  healthy, repo clean of secrets, dev/prod isolation real — open content gap is registry handles.
- **NEEDS PATRICK:** **rotate the Cloudflare merrolyn.com DNS token** (it was pasted in
  chat during the cutover — roll/delete it in CF → Profile → API Tokens; the DNS change is
  already saved, so revoking changes nothing live); guest count; Twilio go-ahead; the real
  schedule/lodging/registry details; printed Save-the-Dates can now carry **merrolyn.com**.
  (API building in Node by default; Python still a one-word override.)

## Aesthetic direction (the north star)

Set by the couple's **Save-the-Date**: a warm **olive/citron green + cream**, a
looping hand-lettered **script** paired with an elegant **serif** (Cormorant), and
dark-green **hand-drawn line art** (champagne coupes → a coastal-Maine motif set).
Earthy, whimsical, editorial — "pastel whimsy" reads here as *muted/earthy* whimsy,
not baby pastels. Full palette + type + motifs →
[`docs/07-design-language.md`](docs/07-design-language.md).

## Architecture (summary — full detail in docs)

Multi-service, genuinely PROD, mapped to **Patrick's real infra (Proxmox LXC +
nginx + HAProxy + Cloudflare — NOT Docker, which isn't installed here):**
1. **Web** — guest-facing site (own clean themeable front-end; static-first per
   house style, framework only if dynamic needs demand it).
2. **Registry/services** — API + DB: per-guest accounts, RSVP + meal/dietary +
   plus-ones, gift registry.
3. **Notifications** — custom SMS (Twilio): save-the-dates, RSVP nudges, week-of
   logistics, day-of alerts, two-way guest Q&A. **No template provides this — it's
   our custom work.**
Full diagram, deploy mapping, and open decisions → [`docs/02-architecture.md`](docs/02-architecture.md).

## Canonical facts

- **Project root:** `/home/patrick/Documents/Claude/Projects/carolyn+merrick`
- **This box:** the homelab dev/admin host (management network). Docker **not
  installed**; deploys go to Proxmox LXC containers via nginx, fronted by HAProxy on
  OPNsense, with Cloudflare DNS. (Network specifics — IPs/VLANs — live in the private
  homelab repo, never here.) See [`docs/03-house-conventions.md`](docs/03-house-conventions.md).
- **Template to fork from:** `../Network/moorelab-website` (static HTML/CSS/JSON,
  `build/` + `data/` + `deploy/` subfolders, nginx CT deploy).
- **Git/GitHub:** authed as `tricheboars`. Commit identity: Patrick Moore
  `<36495234+tricheboars@users.noreply.github.com>`. Repo (public):
  `github.com/tricheboars/carolyn-merrick-wedding`.
- **Domain:** primary **`merrolyn.com`** (Patrick's own, GoDaddy registrar) → DNS via
  Cloudflare → HAProxy (CF "Full"; origin presents the moorelab wildcard, so no new
  cert). **Environments (host-split on one container):** `merrolyn.moorelab.cloud` =
  **dev/staging** (noindex), `merrolyn.com` = **prod**. One source: `web/src/_data/site.js`
  (`SITE_DOMAIN=` override). Add-a-domain steps in `deploy/dns.md` + `deploy/haproxy.md`.
- **Tooling here:** git 2.54, node 26, npm 11, python 3.14. No docker.

## Working agreements

- **Keep `CLAUDE.md` lean.** All research, planning, and design detail goes in
  `docs/` as separate numbered md files; link them here, don't inline them.
- **Update [`docs/WORKLOG.md`](docs/WORKLOG.md)** with a dated entry each working
  session, and refresh the STATUS block above.
- **Ask before irreversible / outward-facing steps** — pushing the repo public,
  deleting anything, anything touching live infra or sending real SMS.
- **Verify, don't assume.** Confirm paths/tooling exist before relying on them.

## Reference (read on demand — keeps this file cheap on context)

- [`docs/00-vision.md`](docs/00-vision.md) — the project brief, goals, guest-experience
  vision, and what "more advanced than most wedding sites" means.
- [`docs/01-research-templates.md`](docs/01-research-templates.md) — GitHub
  `weddings`-topic research: the two repos worth stealing from, the Python option,
  and the confirmed **SMS gap**.
- [`docs/02-architecture.md`](docs/02-architecture.md) — **start here for "what are
  we building"**: service breakdown, deploy mapping to Patrick's infra, proposed
  repo structure, and the OPEN DECISIONS awaiting Patrick.
- [`docs/03-house-conventions.md`](docs/03-house-conventions.md) — how Patrick sets
  up his other sites (the house static-site + docs/ template), captured so we match it.
- [`docs/04-stack-research.md`](docs/04-stack-research.md) — deep stack survey of 36
  wedding repos: clusters, comparison matrix, what to build off of by layer + critique.
- [`docs/05-sms-cost.md`](docs/05-sms-cost.md) — Twilio cost analysis; toll-free vs
  10DLC; ~$60 all-in.
- [`docs/06-stack-decision.md`](docs/06-stack-decision.md) — **the stack I'll
  manage** (11ty + Alpine / Fastify + SQLite / Twilio), with rationale.
- [`docs/07-design-language.md`](docs/07-design-language.md) — palette, type, and
  motifs from the couple's Save-the-Date (olive/cream, script + serif, line art).
- [`docs/WORKLOG.md`](docs/WORKLOG.md) — dated build narrative + decisions.
