# api/ — services (skeleton)

Node + Fastify + SQLite. Runs as a `systemd` service on the **App LXC**, behind
HAProxy at `/api/*` and `/sms-webhook`. Guest data and secrets stay on the box and
are never committed (`.gitignore`).

## Status

Skeleton. Live today: `GET /health`, `GET /api/info`. Stubbed (501): `POST
/api/rsvp`, `POST /api/registry/ack`, `POST /sms/webhook`. The schema
(`schema.sql`) is the real target data model.

## Run

```bash
npm install            # fastify + better-sqlite3 (native build) + dotenv
cp .env.example .env
npm run dev            # http://localhost:3000/health
```

`better-sqlite3` is optional at boot — if it isn't installed, the server still
starts in "skeleton mode" (no DB) so `/health` works.

## Roadmap (build order)

1. Accounts — per-household `invite_code` → signed session cookie (+ magic-link).
2. RSVP — persist to `rsvps`, link to household, fire a confirmation SMS.
3. Registry — record cash-fund acknowledgements for thank-yous.
4. Admin — guest list, headcount, dietary rollup, CSV export.
5. SMS — Twilio send helpers + audience filters (RSVP status) + inbound webhook
   with STOP/HELP consent handling.

See [`../docs/02-architecture.md`](../docs/02-architecture.md) and
[`../docs/06-stack-decision.md`](../docs/06-stack-decision.md).
