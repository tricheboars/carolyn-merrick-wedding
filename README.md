# Carolyn & Merrick — Wedding Website

A small, fast, self-hosted wedding website for **Carolyn Moore & Merrick Harris** —
**August 14, 2027** at **The Harpswell Inn**, Harpswell, Maine.

Will live at **`merrolyn.moorelab.cloud`** — configurable via `SITE_DOMAIN` (one source
of truth in `web/src/_data/site.js`) if the couple buy their own domain later.

More than a one-page invite: it's built to genuinely help guests (travel & lodging
for coastal Maine, schedule, RSVP, a cash/house-fund registry) and includes a custom
**SMS** layer for reminders and two-way questions.

## Stack

| Layer | Tech |
|---|---|
| Site (`web/`) | [Eleventy](https://www.11ty.dev/) static site, vanilla CSS design system, [Alpine.js](https://alpinejs.dev/) for the few interactive bits |
| API (`api/`) | Node + [Fastify](https://fastify.dev/), SQLite — accounts, RSVP, registry, admin, SMS webhook |
| SMS | [Twilio](https://www.twilio.com/) (verified toll-free number) |
| Deploy | Two Proxmox LXC containers (nginx static + Fastify service) behind HAProxy + Cloudflare |

Design direction (olive/cream coastal-Maine, hand-lettered script + serif + sans,
the C&M monogram) comes from the couple's Save-the-Date — see
[`docs/07-design-language.md`](docs/07-design-language.md).

## Repo layout

```
carolyn+merrick/
├── CLAUDE.md        # project brain (lean; links into docs/)
├── docs/            # vision, research, architecture, stack decision, SMS cost, design
├── web/             # Eleventy guest-facing site  ← the prototype
├── api/             # Fastify services skeleton (accounts/RSVP/registry/SMS)
└── deploy/          # LXC + nginx + HAProxy runbooks
```

## Quick start (site)

```bash
cd web
npm install
npm run dev      # serves at http://localhost:8080 with live reload
npm run build    # outputs static site to web/_site/
```

## Quick start (API skeleton)

```bash
cd api
npm install
cp .env.example .env   # fill in Twilio + session secrets later
npm run dev            # Fastify on http://localhost:3000 (/health works today)
```

## Status

Prototype phase. The site shell, design system, coastal-Maine backgrounds, and the
monogram are in; the API is a skeleton; deployment is documented but not yet
provisioned. See [`docs/WORKLOG.md`](docs/WORKLOG.md) for the running log.

> Guest data and secrets are never committed — see `.gitignore`.
