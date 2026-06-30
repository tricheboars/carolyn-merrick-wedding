# 06 — Stack Decision (the stack I'll manage)

> Decided 2026-06-29. Patrick: "your stack recommendations are important since you
> will be managing the stack." So this optimizes for what's **stable, boring, and
> debuggable by me over a 14-month build**, fits your real infra (Proxmox LXC +
> nginx + HAProxy + Cloudflare, **no Docker**), and delivers the advanced features
> (accounts, RSVP, registry, admin, SMS). Cross-checked against the stack research
> in [`04-stack-research.md`](04-stack-research.md).

## The decision, in one table

| Layer | Choice | Why (manageability-first) |
|---|---|---|
| **Frontend** | Hand-built **static site**, semantic HTML + a custom pastel-Maine CSS design system | We own the look; fastest, most durable; trivially served by nginx; no framework to rot. Matches the `moorelab-website` house pattern. |
| **Templating** | **Eleventy (11ty)** SSG (Node) → outputs plain static HTML | A multi-page wedding site benefits from layouts/partials/collections. 11ty is boring, Node-native, ships **zero JS to the browser**, builds to `/var/www`. The one justified build step. |
| **Interactive bits** | **Alpine.js** (~15 KB, no build) for the RSVP form + the cash-registry "I sent a gift" note | Small islands of interactivity without a SPA. No bundler, no hydration headaches. |
| **API** | **Node + Fastify** as a systemd service on an App LXC | Node 26 is installed; one language across SSG + API + browser; Twilio's Node SDK is first-class; Fastify is light with built-in schema validation. |
| **Database** | **SQLite** via `better-sqlite3` (one file on the App CT) | One wedding's data is tiny. Zero DB server to run; backup = copy the file. Postgres only if we ever need concurrent scale (we won't). |
| **Auth** | Per-household **invite code → signed session cookie**; magic-link option; separate admin password/passkey | No guest passwords. Borrows the per-household account idea from `smileyface12349`. |
| **SMS** | **Twilio** (Node SDK) + **verified toll-free number**; inbound webhook in the API | Cheapest/simplest for low volume — see [`05-sms-cost.md`](05-sms-cost.md). |
| **Deploy** | **2 LXC CTs**: Web (nginx static) + App (Fastify + SQLite + Twilio), behind HAProxy + Cloudflare | Reuses your existing front door; mirrors the `moorelab` deploy ritual. |
| **Tooling** | plain `npm`, **Prettier**; GitHub repo under `tricheboars` | Minimal moving parts. |

## Why not the obvious alternatives

- **Why not Next.js / a React SPA?** Overkill and higher maintenance: a build
  pipeline that rots, a server runtime or serverless to babysit, hydration
  complexity — for a site that's 90% static content with two small interactive
  forms. Static + Alpine islands is far easier for me to keep alive for 14 months.
- **Why not Python/FastAPI?** Genuinely fine, and matches your other Python
  repos. I chose Node so the **whole stack is one language**
  (11ty + Fastify + Alpine), which lowers my context-switching cost and pairs
  naturally with Twilio's JS SDK. **If you'd prefer Python, say so — FastAPI +
  Jinja templates is a clean swap and I'll adopt it without complaint.**
- **Why not Firebase/Supabase (BaaS)?** Several survey repos use them, but they're a
  hosting model that doesn't fit your self-hosted LXC infra and adds vendor lock-in
  + a third-party data home for guests' personal info. We keep data on your box.
- **Why not PHP (the big undangan/Laravel cluster)?** Would need php-fpm on the CT;
  off-language for us. We'll still mine those repos for **ideas**, not stack.

## Request topology (how the two CTs split traffic)

```
<domain>/            → Web CT  (nginx → /var/www/carolyn-merrick, 11ty output)
<domain>/api/*       → App CT  (Fastify :PORT, systemd)        — RSVP, registry, auth, admin
<domain>/sms-webhook → App CT  (Fastify)                       — Twilio inbound (two-way Q&A)
```

## What this commits me to building

1. `web/` — 11ty project: layouts, the pastel-Maine design system, content in
   data files; pages: Home, Story, Schedule, Travel & Lodging, Things to Do, FAQ,
   Gallery, RSVP, Registry.
2. `api/` — Fastify service: SQLite schema + migrations; endpoints for auth
   (invite code/magic-link), RSVP (meal/dietary/plus-ones), the **cash-registry
   contributions / acknowledgement** flow, admin (view/export), and the Twilio
   webhook + send helpers.
3. `deploy/` — Web CT + App CT setup runbooks (cloned from `moorelab/deploy`),
   nginx conf, systemd unit, HAProxy route notes, Cloudflare DNS.

## Status of this decision

- **Committed**, pending two confirmations from Patrick:
  1. **Node vs Python** for the API (I chose Node; Python is a one-word override).
  2. Toll-free SMS path + Twilio provisioning (see `05`).
- The in-flight stack research (`04`) will attach **specific reference repos to
  each layer** (e.g. whose RSVP schema / registry-claim code to mirror); this
  decision's shape won't change based on it — only the borrowed details will.
