# Carolyn + Merrick — Maine Wedding Site

Our most PROD build yet: a wedding website for Patrick's sister that's far more
capable than a typical wedding site — guest-helpful, **SMS-capable**, with a real
guest registry and services layer. Aesthetic: **pastel whimsy, clean design,
coastal Maine** as the overriding artistic theme.

This file auto-loads — kept lean. Detail lives in [`docs/`](docs/) (read on demand).

---

## STATUS (2026-07-14) — single source of truth

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
- **DONE 2026-07-14 (evening) — THE RECEPTION RESKIN + Our Story unpublished, LIVE
  ON DEV.** Carolyn shared her real reception design (Milanote board + 3 Pinterest
  boards + 4 vibe photos in `assets-inbox/`); a 10-agent analyze→synthesize→verify
  workflow produced the new design language → [`docs/10-redesign-2026-07.md`](docs/10-redesign-2026-07.md):
  **plate cobalt (#2F2C8E) + poppy on linen cream**, burnt-poppy accents grounded in
  oxblood, marigold/stem/blush garnish, three signatures (scallop plate-edge seams,
  plate-rim double-ring buttons, monoline poppy divider). 13/13 WCAG pairs verified;
  docs/07 marked superseded (olive survives only as `--stem`). `/story/` now a
  redirect stub like stay/music (nav is 7 items, sitemap 9 URLs). Awaiting
  Patrick/Carolyn reaction on dev before prod.
- **DONE 2026-07-14 (Carolyn's notes, round 1) — LIVE ON DEV** (Patrick said go;
  deployed to the dev CT + verified over HTTPS: stubs redirect, registry
  real, 5×TBA; prod promotion awaits his phone review): **registry handles are real**
  (Venmo/Zelle/mail; values live ONLY in gitignored `web/src/_data/registry.local.json`
  on this box — public repo keeps a "Coming soon" fallback + `.example`); **Stay +
  Music unpublished** (noindex redirect stubs overwrite the old pages on deploy; data
  kept warm in `site.js` — Stay returns once lodging can be shown per-guest, Music cut);
  **schedule times all TBA** (the 4:00/5:00/6:30 were placeholder guesses); travel got a
  **"To & from the airport"** card (Uber works FROM the Jetport; ride back = prebook
  Brunswick Taxi, tap-to-call) + a **"Shuttle schedule: TBD"** block. Still needed from
  Carolyn: the corrected main-page photo + the real logo art. → WORKLOG 07-14.
- **NEXT:** (1) ~~registry handles~~ **DONE 2026-07-14** (see above); (2) ~~mobile site~~ **DONE 2026-07-02: all 34 audit fixes LIVE ON PROD**
  (dev-verified 43/43, prod-verified 27/27 read-only; punch list in
  [`docs/09-mobile-audit-2026-07.md`](docs/09-mobile-audit-2026-07.md), verification in
  WORKLOG). Leftovers folded into the roadmap: `og:image`, "prototype" wording on
  `/credits/`, full copy pass; (3) **guest-experience roadmap** →
  [`docs/08-guest-experience-roadmap.md`](docs/08-guest-experience-roadmap.md):
  **LIVE ON PROD 2026-07-03** (built on dev, verified 32/33; promoted + re-verified
  20/20 read-only on merrolyn.com): `/eat/` (21 verified restaurants) + `/music/`
  (Aug-2027 calendar; listings sweep due spring 2027) + travel "Getting around"
  (rideshare truth + taxi tap-to-call) + stay real booking links +
  og:image/icons/manifest/sitemap + em-dash-free copy; research backed in
  `docs/data-*.md` (5 files). Still open: guest-added calendar (needs accounts),
  couple's restaurant picks (spring-2027 concert sweep paused: `/music/`
  unpublished 2026-07-14). ⚠️ never link
  `harpswellinn.com` (hijacked); real venue site = `theharpswellinn.com`;
  (4) couple-specific content (exact times, dress code, lodging block, their story);
  (5) accounts + SMS layer; (6) optional `dev → prod` redirect; (7) optional: add
  merrolyn.com to the origin cert if you ever want CF SSL "Full (strict)".
  **Audited 2026-06-30** (12-agent pass): deployment healthy, repo clean of secrets,
  dev/prod isolation real — open content gap is registry handles.
- **Copy rule (Patrick, 2026-07-01):** site copy must read human — no AI-sounding
  filler and **no em dashes** in guest-facing text.
- **NEEDS PATRICK:** **review dev on your phone → say go for prod promotion** of the
  07-14 content batch; **get from Carolyn:** the photo she wants
  on the main page + the real logo/Save-the-Date art (a logo swap also touches
  favicon/apple-touch/icon-192/512/og); **decide the Stay/IAM approach** (her ask =
  show lodging to the right people: full per-invitation magic-link accounts (roadmap
  item 5, guest registry already in the API) vs a simple shared guest code as interim);
  **rotate the Cloudflare merrolyn.com DNS token** (pasted in chat during the cutover —
  roll it in CF → Profile → API Tokens); guest count; Twilio go-ahead; real schedule
  times. **For the couple (from research, see WORKLOG 07-02):** chartered-shuttle
  decision (prior wedding at this venue ran one; the ride home is what fails on the
  peninsula — the site now promises a shuttle schedule), room block (Fairfield =
  natural shuttle anchor), their restaurant picks for "couple's pick" badges. Printed
  Save-the-Dates can carry **merrolyn.com**.

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
- [`docs/08-guest-experience-roadmap.md`](docs/08-guest-experience-roadmap.md) — the
  post-audit guest-experience to-dos (concert calendar, restaurants, guest calendars,
  icons/unfurls, rideshare, data-in-docs convention, copy pass, privacy assessment).
- [`docs/09-mobile-audit-2026-07.md`](docs/09-mobile-audit-2026-07.md) — the verified
  mobile-audit punch list (34 findings + validated fixes: RSVP copy/guards, CSS
  papercuts, image diet), ordered P1/P2/P3.
- [`docs/WORKLOG.md`](docs/WORKLOG.md) — dated build narrative + decisions.
