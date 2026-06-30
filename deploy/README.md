# deploy/ — runbooks

> **Approval-gated.** These describe standing up the live containers on the homelab.
> They are written generically — real CT IDs / IPs / VLANs live in the **private**
> homelab repo, not here (this repo is public). Nothing here runs automatically.

## Topology

```
internet → Cloudflare (DNS/proxy) → HAProxy (OPNsense, TLS) ┬─ /            → Web CT  (nginx, static 11ty output)
                                                            ├─ /api/*       → App CT  (Fastify systemd)
                                                            └─ /sms-webhook → App CT  (Twilio inbound)
```

Two small Debian LXC containers:
- **Web CT** — nginx serving `web/_site` at `/var/www/carolyn-merrick/`.
- **App CT** — Node + Fastify (`api/`) as a `systemd` service + SQLite + Twilio.

## Host

**`merrolyn.moorelab.cloud`** for now (Patrick's wildcard `*.moorelab.cloud`, DNS on
Cloudflare). Flexible: the site's one domain source is `web/src/_data/site.js`
(override with `SITE_DOMAIN=...`), so a future couple-owned domain is a one-line change.

## Order

1. [`web-ct-setup.md`](web-ct-setup.md) — provision + serve the static site.
2. [`app-ct-setup.md`](app-ct-setup.md) — provision + run the API service.
3. [`dns.md`](dns.md) — Cloudflare CNAME + Pi-hole split DNS.
4. [`haproxy.md`](haproxy.md) — host/path routing on the `moorelab-https` frontend.
5. Verify end-to-end (internal + public + regression on existing routes).

Files here: `dns.md`, `haproxy.md`, `nginx-carolyn-merrick.conf`, `carolyn-merrick-api.service`.
