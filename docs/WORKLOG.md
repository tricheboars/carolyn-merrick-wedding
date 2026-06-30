# WORKLOG — Carolyn + Merrick wedding site

Dated build narrative + decisions. Newest entries at the bottom of each day.

---

## 2026-06-29 — Phase 0: Foundation

**Did:**
- Scanned sibling projects under `/home/patrick/Documents/Claude/Projects` to find
  the house template. Identified two anchors:
  - `Network/moorelab-website` → the **site** template (static HTML/CSS/JSON,
    `build/`+`data/`+`deploy/` layout, nginx-on-LXC deploy).
  - another homelab project → the **`CLAUDE.md` + `docs/`** layout to mirror (lean auto-load file +
    numbered docs + dated STATUS + "Reference (read on demand)").
- Verified tooling: git 2.54, gh 2.95 (authed `tricheboars`), node 26, python 3.14.
  **Discovered docker is NOT installed** — corrected the architecture away from the
  generic Docker-compose sketch toward Patrick's real Proxmox-LXC + nginx + HAProxy
  + Cloudflare topology.
- Captured prior research (GitHub `weddings` topic, the two benchmark repos, the
  confirmed SMS gap).
- Wrote the foundation: `CLAUDE.md` + `docs/00-vision.md`,
  `docs/01-research-templates.md`, `docs/02-architecture.md`,
  `docs/03-house-conventions.md`, this worklog.

**Decisions:**
- Adopt the lean `CLAUDE.md` style with all detail in numbered `docs/`.
- Adapt deploy plan to LXC (no Docker).
- Build our own front-end (own the pastel-Maine look); borrow data model from
  smileyface + guest-helper ideas from rampatra; SMS is custom (Twilio).

**Open / next:**
- Need Patrick: wedding facts (names/date/venue/guest count), domain, Twilio
  go-ahead, and the OPEN DECISIONS in `02-architecture.md` (static-vs-framework,
  Node-vs-Python, SQLite-vs-Postgres).
- Then: `git init` + create public repo under `tricheboars` + push; scaffold `web/`
  skeleton + pastel-Maine design system.

**Notes:**
- Not yet created: git repo, `web/`, `api/`, `deploy/`, `.gitignore`, `README.md`.
- Nothing touched live infra. No secrets committed.

### 2026-06-29 (later) — facts locked + stack decided + SMS costed

**Did:**
- Locked wedding facts: **Carolyn Moore** (bride) + **Merrick Harris** (groom),
  **August 2027** (tentative). Updated `00-vision.md`.
- Ran deep stack research (workflow over 36 repos) — *result pending*, will write
  `04-stack-research.md` when it lands.
- Verified Twilio pricing (live, June 2026) and wrote `05-sms-cost.md`:
  **toll-free verified number beats 10DLC** for our low volume; **~$60 all-in** for
  the whole engagement (< $90 even at 250 guests).
- Made the stack decision in `06-stack-decision.md`: **11ty static + Alpine.js**
  front-end, **Node/Fastify + SQLite** API, **Twilio toll-free** SMS, **2 LXC CTs**
  behind HAProxy/Cloudflare. Marked `02`'s open decisions resolved.

**Decisions:**
- Stack optimizes for *my* maintainability over 14 months: boring, one-language
  (JS across 11ty/Fastify/Alpine), minimal build, data stays on Patrick's box.
- SMS: toll-free path (skip 10DLC registration overhead); verify early.

**Open / next:**
- Patrick to confirm **Node vs Python** API (defaulting Node) + Twilio go-ahead +
  venue/town + guest count + domain.
- Then `git init` + public repo + scaffold `web/` 11ty + pastel-Maine design system.

### 2026-06-29 (later still) — Save-the-Date received: facts, design, registry pivot

**Did:**
- Locked from the couple's STD + bride's notes: **Aug 14 2027** at **The Harpswell
  Inn** (108 Lookout Point Rd, Harpswell, ME 04079). Pages: About Us, Getting to
  Harpswell/transport, Where to Stay, Schedule, Registry, + Home/RSVP.
- **Registry pivot:** it's a **CASH / house fund**, not an item registry — updated
  `00`, `02`, `06`; flagged in `04`. The smileyface "claim mechanic" is now low-pri.
- **Design language captured** from the STD → `07-design-language.md`: olive/citron +
  cream, hand-letter script + Cormorant serif, dark-green monoline motifs. REPLACES
  the earlier pastel-blue guess.
- **Stack research (36 repos) completed** → `04-stack-research.md` (recovered the full
  synthesis from the agent transcript after a write clobber). Headlines: SMS absent
  in all 34 substantive repos (greenfield, as expected); no drop-in fork; best schema
  refs = RajwanYair (guest SQL) + kegger (household + magic-link); best same-stack
  deploy ref = ZEDLABS (Node+SQLite+nginx). Two repos commit **live secrets**
  (EanPistorius LE keys+PG pw; amirnagat Supabase JWT+admin123) — do-not-reuse.

**Open / next:** confirm Node-vs-Python + Twilio + guest count + domain, then
scaffold. Front-end (11ty + olive design system + hero) can start now.

### 2026-06-29 (card back) — monogram mark + photo hero + Minted/domain flag

**Did:** Reviewed the Save-the-Date *back*. Captured into `07`:
- **Monogram brand mark** = "C & M" script inside a scalloped/lace heart pierced by
  an arrow (white line art) → favicon, nav, dividers, loading, SMS avatar.
- **Type clarification:** the back caption is a clean **sans** → body voice leans
  sans (humanist), giving a 3-role system (script / serif / sans).
- **Two hero directions:** A = olive color-field (front), B = full-bleed warm photo +
  monogram (back). B = the Home hero. Photography = warm, woodsy, filmic.
- **Minted/domain flag:** card is a Minted template; back still shows placeholder
  `oliviaandtim.minted.us`. **Domain is now time-sensitive — must be locked before
  the cards print.** Flagged in `CLAUDE.md` STATUS.

### 2026-06-29 (build) — Phase 1: repo + prototype site

**Did:**
- `git init` + first commit; created public GitHub repo under `tricheboars` + pushed.
- Built the `web/` 11ty prototype (Node stack, per the standing recommendation):
  7 pages (home, story, schedule, travel, stay, registry, rsvp), a vanilla-CSS
  **olive coastal-Maine design system** (Sacramento/Cormorant/Mulish), the **C&M
  monogram** + favicon, registry as a **cash/house-fund** page.
- **Coastal-Maine image backgrounds** as palette-matched, license-clean **layered SVG
  scenes** (cove hero, harbor, lighthouse), full-bleed with tint overlays — per
  Patrick's request for imagery over flat color. Hero drops in the couple's real photo
  via one CSS var (`--hero-photo`).
- **Alpine.js** RSVP form (conditional meal fields) + Tabler icons.
- `api/` Fastify + SQLite **skeleton** (`/health` live; RSVP/registry/SMS stubbed; real
  `schema.sql` from the research) + `deploy/` **runbooks** (generic — no infra secrets).
- Verified: 11ty builds clean (v3.1.6, 7 pages); **Chromium screenshots** of
  home/travel/rsvp confirm the design renders. Fixed a CSS bug (global width:100%
  stretching radio inputs).

**Not done (by design):** live LXC provisioning (approval-gated); API persistence;
real content (times/lodging/story/registry handles); real photography.

**Open / next:** domain (time-sensitive), guest count, Twilio go-ahead, engagement
photo + real details; then wire RSVP→API and provision the CTs.

### 2026-06-29 (domain) — merrolyn.moorelab.cloud

**Did:**
- Domain decided: **`merrolyn.moorelab.cloud`** (subdomain of Patrick's `moorelab.cloud`;
  GoDaddy registrar, Cloudflare DNS, covered by the `*.moorelab.cloud` LE wildcard — no
  new cert). Kept flexible: one source in `web/src/_data/site.js`, env override
  `SITE_DOMAIN=...` for a future couple-owned domain (verified both builds).
- Wired `site.url` → `canonical` + `og:url` in the base layout.
- Searched the homelab projects for the subdomain pattern; the worked example is
  my homelab's existing subdomain runbook. Adapted into `deploy/dns.md`
  (Cloudflare CNAME proxied + internal split DNS to the HAProxy VIP) and rewrote
  `deploy/haproxy.md` (host Custom ACL on the existing `moorelab-https` frontend +
  /api path split). **Kept internal IPs OUT of the public repo** (placeholders;
  concrete values live in the private homelab repo).

**Note:** actual DNS record + HAProxy route happen at CT-provision time (approval-gated).
Nothing on live infra was touched this turn.

### 2026-06-29 (photos) — real coastal-Maine backgrounds + repo sanitization

**Did:**
- Swapped the SVG scene backgrounds for **license-clean real photos** (Wikimedia
  Commons), found via the searches "coastal maine harpswell inn" / "harpswell maine
  coast" scoped to free sources. Hero = **sunset at Lookout Point, Harpswell** —
  literally the venue's road (108 Lookout Point Rd). Plus South Harpswell panoramic
  (PD) and Casco Bay (CC BY-SA). Downscaled + recompressed for web. Attribution in
  `web/src/assets/img/CREDITS.md` + a `/credits/` page + footer link. Hero still swaps
  to the couple's engagement photo via one CSS var. SVG scenes kept as alternates.
- **Security remediation (this same turn earlier):** caught that the prior push had
  leaked internal infra detail (a management IP, VLAN names, router model, a private
  project name) into the *public* repo via the docs. Sanitized the whole tree
  (placeholders only), **rewrote history into one clean commit, and force-pushed**.
  Residual: GitHub may retain the old commit by SHA until GC (low-risk, RFC1918/
  non-secret) — offered delete+recreate for a fully clean slate.

**Open / next:** decide push vs delete+recreate; then wire RSVP→API / fill real content.

### 2026-06-29 ("do it all") — API wired, content, more imagery

**Did:**
- **API now functional** (`api/`, Fastify + Node built-in `node:sqlite` — no native
  build). `POST /api/rsvp` persists household+guest+rsvp (validated); `POST
  /api/registry/ack` records cash-fund notes; `GET /api/admin/rsvps[.csv]` (token or
  localhost) gives list + headcount + CSV; SMS webhook still stubbed. Verified
  end-to-end incl. CORS preflight + cross-origin POST + DB rows.
- **Wired the RSVP + registry forms** to the API via Alpine fetch (graceful offline
  fallback; busy/disabled states). API base auto-detects localhost vs same-origin.
- **Content:** added **FAQ** page (data-driven, weather/dress/parking/gifts…; couple-
  specifics marked TODO) and a **"Things to do around Harpswell"** section (Cribstone
  Bridge, Mackerel Cove, lobster spots, Giant Stairs, Brunswick/Portland) — all real,
  helpful, public facts. Nav gains FAQ.
- **More imagery:** added the **Bailey Island Cribstone Bridge** panorama (PD) for the
  story/schedule headers; credits updated (`/credits/` + CREDITS.md). 4 photos total.

**Verified:** 11ty builds clean (10 pages); Chromium screenshots of story/faq/travel
look right; API smoke tests green.

**Did NOT do (gated):** provision live LXC CTs / touch OPNsense HAProxy / Cloudflare.
I CAN reach opnsense-primary + proxmox2 by key from here, but per Patrick's standing
"agents read-only on live infra; OPNsense changes hard-gated + snapshot-first" rule, I
won't auto-run prod changes — needs his explicit per-step go.

**Open / next:** couple-specific content + engagement photo; accounts + SMS; then the
gated provisioning.

### 2026-06-29 (coastal re-skin + deploy) — provisioned, serving internally

**Did:**
- **Re-skinned olive → coastal slate/harbor-blue** (Patrick disliked the green).
  Repointed the palette + every hardcoded green (overlays, nav/footer, borders,
  favicon, coupe motif, theme-color). Cream + terracotta stay. **Diverges from the
  couple's olive Save-the-Date** — noted in `07` (flag for the couple).
- **Provisioned the site on a homelab LXC** (one container: nginx serves the static
  build + reverse-proxies `/api/*` to the Fastify service running under systemd on
  Node's `node:sqlite`). Deployed the current build + API. **Verified it serves —
  HTTP 200 with the production Host header, `/api/*` proxying correctly.** Snapshotted
  the OPNsense config first (rollback point).

**Deliberately NOT auto-run (gated):** the production-firewall routing — the HAProxy
host route + the Cloudflare CNAME. That HAProxy frontend serves *all* of moorelab.cloud;
per the standing "OPNsense changes are hard-gated, never auto-executed" rule, those two
~5-min steps are left for human/GUI execution (or an explicit "script it"). Internal
IPs/CT IDs are kept in private session memory, never in this public repo.

**Open / next:** finish the 2 routing steps to go public; couple content + engagement
photo; accounts + SMS.

### 2026-06-29 (LIVE) — site published at merrolyn.moorelab.cloud

**Did (with explicit approval to touch the production firewall):**
- Added the **HAProxy host route** on the production OPNsense (backend → the wedding
  container, host ACL on the shared `moorelab-https` frontend), the **Cloudflare CNAME**
  (proxied, via API), and **pi-hole split DNS** on both resolvers.
- Did it safely: backed up the firewall config first, mirrored the existing pattern,
  validated with `haproxy -c`, regression-tested that all existing routes stayed up,
  with auto-rollback wired in. Hit (and fixed) a case-sensitivity gotcha in the
  reload tooling along the way; the safety gate correctly prevented any breakage.
- **Verified LIVE:** `https://merrolyn.moorelab.cloud` → 200 publicly and on LAN; the
  API responds; moorelab.cloud / fast / ollama / openclaw all unaffected.

**Note:** all internal IPs/CT details are kept in private session memory, never this
public repo. **Open / next:** couple-specific content + engagement photo; accounts + SMS.

### 2026-06-29 (real photos) — engagement photos in + Gallery, live

**Did:**
- Pulled the couple's **23 engagement photos** (Oct 2025) from the two Google Drive
  albums (`gdown`), curated from a contact sheet, and optimized the keepers (originals
  were 5–24 MB each → web sizes).
- **Hero** and **Our Story** header are now couple coastal shots (the foggy-coast set
  matches the slate palette beautifully). New **Gallery** page — masonry grid of 12,
  lazy-loaded — plus a nav link. Kept the Harpswell stock photos for the *location*
  pages (Travel/Stay/Schedule/FAQ). Credits updated (couple's own photos).
- Added **cache-busting** on `style.css` (build timestamp) so Cloudflare's edge cache
  never serves a stale stylesheet after a redeploy.
- Rebuilt + **redeployed to the live container**; verified the couple hero + Gallery
  are live at merrolyn.moorelab.cloud (origin and via Cloudflare).

**Open / next:** couple-specific copy (times, dress code, lodging, story, Venmo/Zelle);
accounts + SMS; a one-command redeploy script.

### 2026-06-29 (own domain) — merrolyn.com

**Did:**
- Patrick bought **merrolyn.com** (GoDaddy). Flipped the site canonical to merrolyn.com
  (one line — exactly the flexible `SITE_DOMAIN` we built for) and **extended the
  HAProxy host route** to also answer `merrolyn.com` + `www.merrolyn.com` (backup +
  `haproxy -c` + regression-passed; existing routes intact). Verified via Host header
  that the firewall already serves the site for merrolyn.com.
- Fixed the welcome heading to not repeat "on the coast of Maine." Rebuilt + redeployed.

**Pending (Patrick's dashboards — my token has no account access):** add merrolyn.com
to Cloudflare (Add Site, Free plan) + repoint GoDaddy nameservers to the CF ones.
Then CF records: apex `CNAME → moorelab.cloud` (proxied/flattened), `www CNAME →
merrolyn.com` (proxied), SSL mode **Full**. **No new cert** (CF Full + the origin's
moorelab wildcard). I'll auto-add the CF records once the zone exists + a scoped token
is available. `merrolyn.moorelab.cloud` keeps serving until then.

### 2026-06-29 (dev/prod + copy) — environment split

**Did:**
- **Dev/prod split** off the one container (no new infra): `merrolyn.moorelab.cloud` =
  **dev/staging** → `/var/www/merrolyn-dev` (marked `noindex`), `merrolyn.com` (+ www) =
  **prod** → `/var/www/merrolyn-prod`. nginx splits by `Host`; both share the Fastify
  API. Each env built self-canonical via `SITE_DOMAIN`. Updated
  `deploy/nginx-carolyn-merrick.conf` + `deploy/README.md` to match.
- **Copy:** welcome heading already de-duped last turn ("We're getting married!");
  swapped **"lighthouses" → "craft beer"** in the "weekend by the water" line (more
  enticing for a cooler crowd). Built + **deployed to both dev and prod**.

**Verified:** dev live (canonical=merrolyn.moorelab.cloud, noindex header, craft beer);
prod root (canonical=merrolyn.com, craft beer). merrolyn.com goes live once the
Cloudflare zone + GoDaddy nameservers are pointed.
