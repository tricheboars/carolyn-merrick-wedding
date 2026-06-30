# DNS — `merrolyn.moorelab.cloud`

Current host: **`merrolyn.moorelab.cloud`** (a subdomain of Patrick's existing
`moorelab.cloud`, registered at GoDaddy, DNS on Cloudflare). The `*.moorelab.cloud`
Let's Encrypt **wildcard already covers it — no new certificate.**

> If the couple buy their own domain later, this whole flow changes to that
> registrar/zone, and the site rebuilds with `SITE_DOMAIN=theirdomain.com`
> (single source of truth — see `web/src/_data/site.js`).

Two places need a record (same pattern as the existing `ollama` / `openclaw`
subdomains). The worked example and concrete internal IPs live in the **private**
homelab repo, not here.

## 1. Cloudflare (public)

`moorelab.cloud` zone → DNS → Add record:

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `merrolyn` |
| Target | `moorelab.cloud` |
| Proxy | **Proxied** (orange cloud) |
| TTL | Auto |

CNAME-to-apex inherits the apex A record (DDNS-updated by OPNsense).

```bash
dig +short merrolyn.moorelab.cloud   # expect Cloudflare proxy IPs, not the WAN IP
```

## 2. Internal split DNS

So LAN clients resolve to the internal HAProxy VIP (keeps traffic on-LAN, avoids
hairpin NAT). On the internal resolvers, map the host to the VIP, restart, and sync
them — the exact servers + sync helper are in the private homelab repo.

```
<HAPROXY_VIP> merrolyn.moorelab.cloud
```

```bash
dig +short @<INTERNAL_DNS> merrolyn.moorelab.cloud   # expect <HAPROXY_VIP>
```

Then proceed to [`haproxy.md`](haproxy.md).
