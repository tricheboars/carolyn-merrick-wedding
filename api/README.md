# api/ — services

Node + Fastify + **SQLite via Node's built-in `node:sqlite`** (no native build).
Runs as a `systemd` service on the **App LXC**, behind HAProxy at `/api/*` and
`/sms-webhook`. Guest data + secrets stay on the box, never committed (`.gitignore`).

## Status

Functional. Live endpoints:

| Method + path | Does |
|---|---|
| `GET /health` | liveness |
| `GET /api/info` | couple/date/venue |
| `POST /api/rsvp` | persist an RSVP (household + guest + rsvp), validated |
| `POST /api/registry/ack` | record a cash-fund "I sent a gift" note |
| `GET /api/admin/rsvps` | list + headcount (token or localhost) |
| `GET /api/admin/rsvps.csv` | CSV export (token or localhost) |
| `POST /sms/webhook` | Twilio inbound — **stubbed** until the number is live |

Admin routes require header `x-admin-token: $ADMIN_TOKEN`; if no token is set they
fall back to localhost-only.

## Run

```bash
npm install            # fastify + dotenv (pure JS — no compiler needed)
cp .env.example .env   # set ADMIN_TOKEN + Twilio creds when ready
npm run dev            # http://localhost:3000/health
```

DB auto-creates at `data/app.db` from `schema.sql` on boot (gitignored).

## Next

1. Accounts — per-household `invite_code` → signed session (gate RSVPs).
2. Admin UI page (read the JSON/CSV behind auth).
3. SMS — Twilio send helpers + audience filters (by RSVP status) + the inbound
   webhook with STOP/HELP consent. See [`../docs/05-sms-cost.md`](../docs/05-sms-cost.md).

Schema + rationale: [`schema.sql`](schema.sql),
[`../docs/06-stack-decision.md`](../docs/06-stack-decision.md).
