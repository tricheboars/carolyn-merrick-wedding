# 02 — Architecture & Plan

> Captured 2026-06-29. This is the "what are we building and how does it deploy."
> Adapted to Patrick's **real** infrastructure (discovered by scanning siblings —
> see `03-house-conventions.md`), not the generic Docker sketch from early chat.
> **Docker is NOT installed on archy-boi.** Patrick deploys to Proxmox LXC
> containers behind nginx → HAProxy (OPNsense) → Cloudflare.

## Services (logical breakdown)

### ① Web — guest-facing site
The thing guests see. Olive/coastal-Maine theme (see
[`07-design-language.md`](07-design-language.md)), mobile-first. Pages (from the
couple): **Home** · **About Us / Our Story** · **Schedule of Events** · **Getting to
Harpswell / Transportation** · **Where to Stay** · **Registry (cash / house fund)** ·
**RSVP** · *(FAQ + Gallery optional)*.

### ② Registry / services — API + database
The "advanced" layer templates only partly cover:
- Per-guest (or per-household) **accounts**.
- **RSVP**: attending y/n, meal choice, dietary, plus-ones, song requests, notes.
- **Cash registry / house fund**: a tasteful contributions page (Venmo/Zelle/PayPal
  + mailing option) with an optional "I sent a gift" acknowledgement so the couple
  can track thank-yous. **No item catalogue / no claim mechanic** — the couple are
  collecting money toward their house.
- **Admin views**: who's RSVP'd, headcount, dietary rollup, contributions, CSV export.

### ③ Notifications — SMS (our custom differentiator)
Twilio (or similar). Outbound: save-the-dates, RSVP-deadline nudges, week-of
logistics, day-of alerts. Inbound: two-way guest Q&A via a Twilio webhook the API
answers. **Requires:** a Twilio account + number, and **opt-in consent handling**
(store consent + provide STOP/HELP). No template provides any of this.

### ④ Edge — reverse proxy + TLS
Fits Patrick's existing front door: HAProxy on OPNsense terminates TLS (LE
wildcard), Cloudflare DNS in front. A new hostname routes to the web CT; the
`/api/*` path routes to the app CT.

## Deploy mapping to Patrick's real infra

```
internet
   │  ▼ <wedding-domain>  (Cloudflare → public IP, OPNsense DDNS)
edge router :443 → OPNsense
   │  ▼ HAProxy (LE wildcard, host/path ACLs)
   ├─ <domain>/           → Web CT      (nginx, static site)   [new LXC]
   ├─ <domain>/api/*      → App CT       (Node or Python API)  [new LXC]
   └─ <domain>/sms-webhook→ App CT       (Twilio inbound)      [same App CT]
                                   │
                                   ▼ DB (SQLite file on the App CT, or Postgres CT)
```

- **Web CT** = clone of the `moorelab-website` pattern: Debian LXC, nginx, static
  files at `/var/www/<site>/` on the site VLAN. Same deploy ritual (`pct push` /
  `deploy/` runbook).
- **App CT** = the new piece Patrick doesn't have yet: a long-running API service
  (systemd unit) + DB + Twilio. Lightweight (1 vCPU / 512MB–1GB).
- This **reuses Patrick's whole front door** (HAProxy, Cloudflare, LE) — we're just
  adding CTs and routes. No Docker needed.

## Proposed repo structure (mirrors house style)

```
carolyn+merrick/
├── CLAUDE.md
├── README.md                 # public-facing project intro
├── .gitignore                # adapt moorelab's (+ .env, db files, secrets)
├── docs/                     # all research + planning (this folder)
├── web/                      # ① guest-facing site (static-first)
│   ├── index.html
│   ├── style.css             # pastel-Maine design system
│   ├── content.json          # single source of truth for editable copy
│   ├── pages/                # story, travel, registry, faq, gallery…
│   ├── assets/               # imagery, fonts, favicons, og-image
│   ├── build/                # helper scripts (house pattern)
│   └── data/                 # seed content
├── api/                      # ② + ③ registry/RSVP/SMS service
│   ├── (Node/Express or Python/FastAPI — see OPEN DECISIONS)
│   ├── schema/               # DB schema + migrations
│   └── README.md
└── deploy/                   # nginx conf, CT setup runbook, HAProxy notes,
                              # systemd unit for the API (house pattern)
```

## OPEN DECISIONS — ✅ RESOLVED 2026-06-29 → see [`06-stack-decision.md`](06-stack-decision.md)

> Settled: **static 11ty + Alpine.js** front-end, **Node/Fastify** API (pending
> Patrick's Node-vs-Python nod), **SQLite**, **Twilio toll-free** for SMS. The
> recommendations below are kept for the reasoning trail.

1. **Front-end: static-first vs. framework.**
   - *Recommend:* **static HTML/CSS/JS + a little vanilla JS** (matches house
     style, fast, easy to host on an nginx CT). Use a framework only if the
     registry/RSVP UI gets genuinely app-like.
2. **API language: Node vs. Python.**
   - *Recommend:* **Node/Express** (node 26 is here, pairs naturally with a JS
     front-end and Twilio's SDK). Python/FastAPI is a fine alternative and matches
     your other repos — your call.
3. **Database: SQLite vs. Postgres.**
   - *Recommend:* **SQLite** for v1 (a single file on the App CT — trivial backup,
     plenty for one wedding's guest list). Move to a Postgres CT only if we want
     multi-service or heavier admin analytics.
4. **SMS provider: Twilio vs. alternative.**
   - *Recommend:* **Twilio** (best docs/SDK, easy two-way webhook). Needs an
     account + number + consent handling. Confirm you're good to provision.
5. **Domain name** for the site (drives Cloudflare + LE + HAProxy host ACL).

## Build sequence (once decisions land)

1. `git init`, commit the foundation (CLAUDE.md + docs/), create the public repo
   under `tricheboars`, push.
2. Scaffold `web/` skeleton + the pastel-Maine **design system** in `style.css`
   (this is the fun, visible first deliverable; can start before backend decisions).
3. Wire editable content via `content.json` (house pattern: render from JSON).
4. Build `api/`: schema → accounts → RSVP → registry → admin → SMS.
5. `deploy/`: Web CT (clone moorelab runbook) → App CT (new systemd service) →
   HAProxy route → Cloudflare DNS → smoke test.

> Note: step 2 (the visible front-end + theme) doesn't depend on the backend
> decisions, so we can start there immediately after the repo exists if Patrick
> wants momentum while finalizing 1–5 above.
