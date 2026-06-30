# Web CT — static site (nginx)

Clone of the `moorelab-website` deploy pattern: a tiny Debian LXC running nginx,
serving the built 11ty output. Replace `<…>` placeholders from the private homelab
notes.

## Provision (on the Proxmox host)

- Debian 12 unprivileged LXC, 1 vCPU / 512 MB / 4 GB disk, on the site VLAN.
- Static IP `<WEB_CT_IP>`; nameserver = the VLAN gateway.
- `apt install nginx`.

## Build & push the site

```bash
cd web && npm ci && npm run build          # outputs web/_site
# push to the CT (rsync to Proxmox host, then pct push — same as moorelab)
rsync -avz --delete web/_site/ <PROXMOX_HOST>:/tmp/cm-site/
ssh <PROXMOX_HOST> 'pct exec <WEB_CT> -- mkdir -p /var/www/carolyn-merrick && \
  tar -C /tmp/cm-site -cf - . | pct exec <WEB_CT> -- tar -C /var/www/carolyn-merrick -xf -'
```

## nginx

Copy `nginx-carolyn-merrick.conf` to `/etc/nginx/conf.d/` on the CT, then:

```bash
pct exec <WEB_CT> -- nginx -t && pct exec <WEB_CT> -- systemctl reload nginx
```

## Smoke test (from inside the lab)

```bash
curl -s -H 'Host: <DOMAIN>' http://<WEB_CT_IP>/ | grep -i 'Carolyn'
```

## Redeploy later

Re-run build + push. Consider a `deploy-web.sh` helper (see moorelab's
`deploy-moorelab.sh`).
