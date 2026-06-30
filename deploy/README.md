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

## Environments (dev / prod, one container, host-split)

| Env | Host | Webroot | Notes |
|---|---|---|---|
| **dev** | `merrolyn.moorelab.cloud` | `/var/www/merrolyn-dev` | staging; `noindex` |
| **prod** | `merrolyn.com` (+ `www`) | `/var/www/merrolyn-prod` | the real site |

nginx splits by `Host` (see `nginx-carolyn-merrick.conf`); both share the one Fastify
API on `:3000`. Each env is built self-canonical via the one domain source in
`web/src/_data/site.js`:

```bash
cd web
SITE_DOMAIN=merrolyn.moorelab.cloud npx @11ty/eleventy   # -> deploy to merrolyn-dev
SITE_DOMAIN=merrolyn.com            npx @11ty/eleventy   # -> deploy to merrolyn-prod
```

prod = `merrolyn.com` rides Cloudflare proxy (Full SSL) onto the same origin as
`*.moorelab.cloud`, so **no new cert** is needed.

## Order

1. [`web-ct-setup.md`](web-ct-setup.md) — provision + serve the static site.
2. [`app-ct-setup.md`](app-ct-setup.md) — provision + run the API service.
3. [`dns.md`](dns.md) — Cloudflare CNAME + Pi-hole split DNS.
4. [`haproxy.md`](haproxy.md) — host/path routing on the `moorelab-https` frontend.
5. Verify end-to-end (internal + public + regression on existing routes).

Files here: `dns.md`, `haproxy.md`, `nginx-carolyn-merrick.conf`, `carolyn-merrick-api.service`.
