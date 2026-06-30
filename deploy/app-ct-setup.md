# App CT — Fastify service (systemd)

The new piece (no equivalent in moorelab). Debian LXC running the `api/` service.

## Provision

- Debian 12 unprivileged LXC, 1 vCPU / 1 GB / 8 GB disk, on the site VLAN.
- Static IP `<APP_CT_IP>`.
- Install Node LTS (nodesource) + build tools for `better-sqlite3`:
  `apt install -y build-essential python3`.

## Deploy the app

```bash
# copy api/ to the CT (e.g. /opt/carolyn-merrick-api), then:
cd /opt/carolyn-merrick-api
npm ci --omit=dev
cp .env.example .env   # fill SESSION_SECRET + Twilio creds (keep mode 600)
```

## systemd

Copy `carolyn-merrick-api.service` to `/etc/systemd/system/`, then:

```bash
systemctl daemon-reload
systemctl enable --now carolyn-merrick-api
systemctl status carolyn-merrick-api
curl -s http://<APP_CT_IP>:3000/health
```

## Backups

SQLite lives at `/opt/carolyn-merrick-api/data/app.db`. Back it up with a nightly
`sqlite3 .backup` (or PBS file backup). It holds guest PII — keep it off any public
path and out of git.

## Secrets

`.env` (Twilio + session secret) stays on the CT, mode 600. Never commit it. The
canonical secret store is the private homelab `.secrets/`.
