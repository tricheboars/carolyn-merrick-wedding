# api/ — services

Node + Fastify + **SQLite via Node's built-in `node:sqlite`** (no native build), plus
`exceljs` for the couple's spreadsheet download. Runs as a `systemd` service on the
App LXC, behind HAProxy at `/api/*` and `/sms-webhook`. Guest data + secrets stay on
the box, never committed (`.gitignore`).

## Status

Functional. Live endpoints:

| Method + path | Does |
|---|---|
| `GET /health` | liveness |
| `GET /api/info` | couple/date/venue |
| `POST /api/rsvp` | persist an RSVP (household + guest + rsvp), validated; re-submit updates |
| `POST /api/registry/ack` | record a cash-fund "I sent a gift" note |
| `POST /api/auth/login` | the couple's sign-in: passphrase → 30-day HttpOnly cookie |
| `POST /api/auth/logout` | clear that cookie |
| `GET /api/auth/session` | is this browser signed in? |
| `GET /api/admin/rsvps` | list + headcount (admin) |
| `GET /api/admin/rsvps.csv` | RSVP CSV (admin) |
| `GET /api/admin/registry` | gift notes (admin) |
| `GET /api/admin/registry.csv` | gift notes CSV (admin) |
| `GET /api/admin/export` | the couple's spreadsheet: one .xlsx, RSVPs + Gift notes sheets (admin) |
| `POST /sms-webhook` | Twilio inbound — **stubbed** until the number is live |

**Admin auth fails closed.** A request that sends `x-admin-token` is judged on that
header alone (Patrick, scripts); any other request needs the sign-in cookie. There is
no localhost fallback: with `ADMIN_TOKEN` unset the token path refuses everything, and
with `SESSION_SECRET` / `ADMIN_PASSPHRASE` unset the sign-in answers 503. Sign-in is
rate-limited 10 tries per 15 minutes per client address (a household behind
Cloudflare shares one), and the passphrase is compared after
lowercasing and collapsing punctuation, so a phone's autocapitalising does not lock
the couple out.

**Every response is `Cache-Control: private, no-store`.** Cloudflare caches by URL
extension and `.csv`/`.xlsx` are on its default list; without this header an
authenticated CSV download was served from the edge to anyone for 4 hours
(reproduced on dev, 2026-09-06). The spreadsheet route has no extension on top of that.

The guest-facing side of the sign-in is `web/src/admin.njk` (merrolyn.com/admin):
the couple read the list right on the page, and the spreadsheet is a button.

## Run

```bash
npm install            # fastify + dotenv + exceljs (pure JS — no compiler needed)
cp .env.example .env   # set ADMIN_TOKEN, SESSION_SECRET, ADMIN_PASSPHRASE (+ Twilio later)
npm run dev            # http://localhost:3000/health
```

DB auto-creates at `data/app.db` from `schema.sql` on boot (gitignored). Quote the
passphrase in `.env` (`ADMIN_PASSPHRASE="four plain words"`): systemd's
`EnvironmentFile` and dotenv both strip the quotes, and an unquoted multi-word value
breaks anything that `source`s the file.

`npm audit` reports one moderate finding in `uuid` (a transitive dependency of
`exceljs`, buffer bounds in v3/v5/v6 generation). The API only writes workbooks and
never calls those functions; accepted until exceljs updates.

## Next

1. Accounts — per-household `invite_code` → signed session (gate RSVPs).
2. SMS — Twilio send helpers + audience filters (by RSVP status) + the inbound
   webhook with STOP/HELP consent. See [`../docs/05-sms-cost.md`](../docs/05-sms-cost.md).

Schema + rationale: [`schema.sql`](schema.sql),
[`../docs/06-stack-decision.md`](../docs/06-stack-decision.md).
