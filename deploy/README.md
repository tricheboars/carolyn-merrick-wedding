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

## Environments (dev / prod — separate containers)

| Env | Host | Container | Webroot | Notes |
|---|---|---|---|---|
| **dev** | `merrolyn.moorelab.cloud` | dev web CT | `/var/www/merrolyn-dev` | staging; `noindex`; own API + DB (test data) |
| **prod** | `merrolyn.com` (+ `www`) | prod web CT | `/var/www/merrolyn` | the real site; own API + **clean** DB + own admin token |

Each environment is its **own LXC container** (own nginx + Fastify API + SQLite) so dev
traffic/data never touches prod. HAProxy routes by `Host` to the right container (see
`nginx-carolyn-merrick.conf` for the per-container server blocks). Each env is built
self-canonical via the one domain source in `web/src/_data/site.js`:

```bash
cd web
SITE_DOMAIN=merrolyn.moorelab.cloud npx @11ty/eleventy   # -> deploy to the DEV CT  (/var/www/merrolyn-dev)
SITE_DOMAIN=merrolyn.com            npx @11ty/eleventy   # -> deploy to the PROD CT (/var/www/merrolyn)
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
