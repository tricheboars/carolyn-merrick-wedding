# Carolyn & Merrick — Wedding Website

The wedding website for **Carolyn Moore & Merrick Harris**, marrying **August 14, 2027**
at **The Harpswell Inn** in Harpswell, Maine.

**Live at [merrolyn.com](https://merrolyn.com)** (dev/staging runs separately, noindexed).
The domain is one variable: build with `SITE_DOMAIN=<host>` and everything (canonicals,
og tags, sitemap) follows from `web/src/_data/site.js`.

This is more than a one-page invite. It is built to genuinely help guests plan a trip
to coastal Maine, and everything factual on it is verified against primary sources
before it ships.

## What guests get

- **RSVP** wired to a real API (meal choice, dietary needs, plus-ones), built
  mobile-first since that is where guests fill it in.
- **Travel** with honest ground-transport guidance. Rideshare barely exists on the
  Harpswell peninsula, so the site says so, and gives tap-to-call taxi numbers and the
  Amtrak Downeaster option instead.
- **Stay**: verified booking links, from the inn's own eleven rooms to Brunswick
  hotels and Bailey Island cottage agencies.
- **Eat & Drink**: 21 restaurants across Harpswell, Brunswick's Maine Street, and
  Portland. Every one checked against its own website, with closed places weeded out.
- **Live Music**: an August 2027 calendar of shows around the wedding week, with the
  wedding day itself reserved. Fills in as Maine venues announce their summer slates.
- **Schedule, Our Story, Gallery, FAQ, Registry** (cash house fund), photo credits.
- Planned: guest accounts and a custom **SMS layer** (Twilio) for reminders, day-of
  logistics, and two-way questions. No wedding-site template offers this; it is the
  custom part of the build.

## Stack

| Layer | Tech |
|---|---|
| Site (`web/`) | [Eleventy](https://www.11ty.dev/) static site, hand-rolled CSS design system, [Alpine.js](https://alpinejs.dev/) (self-hosted) for the interactive bits |
| API (`api/`) | Node + [Fastify](https://fastify.dev/) with `node:sqlite`: RSVP, registry, admin list/CSV |
| SMS (planned) | [Twilio](https://www.twilio.com/) toll-free |
| Deploy | Separate dev and prod Proxmox LXC containers (nginx + Fastify each) behind HAProxy, fronted by Cloudflare |

Design language (harbor-blue and cream coastal Maine, hand-lettered script with a
Cormorant serif, the C&M monogram) comes from the couple's Save-the-Date. See
[`docs/07-design-language.md`](docs/07-design-language.md).

## House rules that shape the code

- **Verify, don't assume.** Facts on the site trace to primary sources; the research
  and its verification live in [`docs/data-*.md`](docs/) with re-check dates.
- **Human voice.** Guest-facing copy avoids AI-flavored filler. No em dashes.
- **Mobile is the main event.** The site was audited page-by-page at 320/390px with
  every finding independently reproduced before fixes shipped
  ([`docs/09-mobile-audit-2026-07.md`](docs/09-mobile-audit-2026-07.md)). Phones get
  right-sized images (the gallery went from 3.2MB to ~0.6MB on a phone).
- **Guest data stays server-side.** SQLite lives on the API container behind an admin
  token; nothing personal is in this repo, and secrets are never committed.

## Repo layout

```
carolyn+merrick/
├── CLAUDE.md        # project brain (lean; links into docs/)
├── docs/            # vision, architecture, design language, audits, verified data files, worklog
├── web/             # Eleventy guest-facing site
├── api/             # Fastify services (RSVP + registry live; accounts/SMS planned)
└── deploy/          # LXC + nginx + HAProxy runbooks (no real IPs; those stay private)
```

## Quick start (site)

```bash
cd web
npm install
npm run dev                                  # http://localhost:8080 with live reload
SITE_DOMAIN=merrolyn.com npx @11ty/eleventy  # production build -> web/_site/
```

## Quick start (API)

```bash
cd api
npm install
cp .env.example .env   # secrets go here, never in git
npm run dev            # Fastify on http://localhost:3000
```

## Status

**Live and in active build-out.** The site and API run in production at
[merrolyn.com](https://merrolyn.com). Recent milestones: a 50-agent mobile audit with
every fix verified on device widths, a researched guest guide (restaurants, transport,
lodging, attractions), and link-preview/icon polish. Next up: real registry handles,
the couple's own content, guest accounts, and the SMS layer.
[`docs/WORKLOG.md`](docs/WORKLOG.md) is the running log;
[`docs/08-guest-experience-roadmap.md`](docs/08-guest-experience-roadmap.md) is the roadmap.
