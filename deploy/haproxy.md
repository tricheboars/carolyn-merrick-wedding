# HAProxy — route `merrolyn.moorelab.cloud`

OPNsense primary runs the active HAProxy. The existing **`moorelab-https`** frontend
(LE wildcard `*.moorelab.cloud`) already terminates TLS for every subdomain — we just
add a backend + a host ACL. Cloudflare proxies in front (see [`dns.md`](dns.md)).

> The worked example + concrete internal IPs/CT IDs live in the **private** homelab
> repo — placeholders below.
> **Back up `config.xml` first; one restore + reload reverts everything.**

## Backends

| Backend | Target |
|---|---|
| `merrolyn-web` | `<WEB_CT_IP>:80` (nginx, static site) |
| `merrolyn-app` | `<APP_CT_IP>:3000` (Fastify) |

## ACLs (Custom ACL — the `hdr` GUI type renders empty, known gotcha)

| Name | Custom ACL |
|---|---|
| `acl-host-merrolyn` | `hdr(host) -i merrolyn.moorelab.cloud` |
| `acl-path-api` | `path_beg -i /api/ /sms-webhook` |

## Rules (first match wins — order above the default fallthrough)

| Rule | Condition | Backend |
|---|---|---|
| `rule-merrolyn-api` | `acl-host-merrolyn` AND `acl-path-api` | `merrolyn-app` |
| `rule-merrolyn-web` | `acl-host-merrolyn` | `merrolyn-web` |

Attach both to the `moorelab-https` public service, API rule first. Apply.

## Verify

```bash
# internal (before/independent of Cloudflare)
curl -ks -H 'Host: merrolyn.moorelab.cloud' https://<HAPROXY_VIP>/ | grep -i Carolyn
# public, after DNS
curl -sL https://merrolyn.moorelab.cloud/            | grep -i Carolyn
curl -s  https://merrolyn.moorelab.cloud/api/health
# regression — existing routes must still work
for h in moorelab.cloud ollama.moorelab.cloud openclaw.moorelab.cloud; do
  curl -sk -o /dev/null -w "$h %{http_code}\n" "https://$h/"; done
```

## Rollback

Restore the pre-change `config.xml` backup → `configctl template reload
OPNsense/Haproxy && configctl haproxy restart`.
