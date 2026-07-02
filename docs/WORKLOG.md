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

### 2026-06-29 (merrolyn.com DNS) — nameservers + SSL up; apex still points at GoDaddy

- Patrick switched GoDaddy nameservers to **Cloudflare** (`dayana`/`trey.ns.cloudflare.com`)
  and Cloudflare issued **Universal SSL** (mode **Full**). Verified externally: NS
  correct, apex + www resolve to CF, the edge cert is valid for `merrolyn.com`.
- **Snag:** `https://merrolyn.com` serves **GoDaddy's Website Builder** page, not our
  site. Cause: when you Add-Site, Cloudflare **auto-imports the registrar's existing
  records** — so the apex `A` still points at GoDaddy's IPs and CF proxies there.
  **Fix (in CF DNS for merrolyn.com):** set apex `@` → `CNAME moorelab.cloud`
  (proxied), `www` → `CNAME merrolyn.com` (proxied), and delete the GoDaddy `A`
  records. My CF token is scoped to moorelab.cloud only, so this needs Patrick's
  dashboard OR a merrolyn.com-scoped `Zone:DNS:Edit` token dropped on the firewall
  (exact path kept in private notes). HAProxy already answers merrolyn.com + www.

### 2026-06-29 (infra) — dev/prod split onto separate containers

**Did:** moved from one host-split container to **separate infra per environment**:
- **DEV** → the existing web CT (`merrolyn.moorelab.cloud`): own nginx + Fastify API +
  DB (keeps the test data), `noindex`.
- **PROD** → a **new** web CT (`merrolyn.com` + `www`): own nginx + Fastify API +
  **fresh clean DB** + its **own** admin token. Node 24.
- **HAProxy:** narrowed the dev ACL to `merrolyn.moorelab.cloud` → dev backend; added a
  **prod** server/backend/ACL (`merrolyn.com www.merrolyn.com`) → prod backend. Same
  safety gate (backup + `haproxy -c` + regression), zero downtime, moorelab/fast intact.

**Verified at origin:** dev → dev CT (canonical moorelab, noindex header, API up),
prod → prod CT (canonical merrolyn.com, API up, clean DB). Internal IPs/CT IDs stay in
private memory. Updated `deploy/README.md` + `deploy/nginx-carolyn-merrick.conf`.

### 2026-06-30 — merrolyn.com PUBLIC + 12-agent audit

**merrolyn.com is LIVE.** Patrick created a merrolyn.com-scoped Cloudflare token; with it
I fixed the apex via API: **deleted the two GoDaddy builder `A` records** (the apex was
proxying to GoDaddy's Website Builder), **added apex `CNAME → moorelab.cloud` (proxied)**;
`www` was already `CNAME → merrolyn.com`. Added a **`www → apex` 301** and a **`/health`
edge route** on the prod container. Verified globally: `https://merrolyn.com` serves our
site + live API (CF anycast at every public resolver), `www` 301s to apex, dev unaffected,
`moorelab`/`fast` intact. Email untouched (no MX; DMARC/_domainconnect left as-is). SSL
mode must stay **Full** (origin cert is `*.moorelab.cloud`, doesn't cover the apex —
Full-strict would break it).

**Multi-agent audit (12 agents, read-only).** Verdict: deployment **healthy**, dev/prod
isolation **real** (prod DB confirmed empty), HAProxy split correct, public repo **clean**
of IPs/secrets in tree + history, full RSVP→CSV API path works, all pages/images load.
Findings fixed: `/health` edge route (above). **Open item:** `/registry/` still renders
literal `@TODO` payment placeholders — now public, needs real handles. Audit also left a
couple test rows in the **dev** DB; purged afterward (prod never written).

### 2026-06-30 (late) — placeholder sweep + the Pi-hole gotcha; called it for the night

- **Softened every public `TODO`** to graceful copy (registry handles → "Coming soon",
  schedule unknown times → "TBA", story/travel/lodging/FAQ/RSVP-deadline → "coming soon /
  to be announced") in `web/src/_data/site.js` (+ fixed a stale "TODO" note in
  `schedule.njk`). Rebuilt **both** envs, redeployed (atomic swap), verified **0** `TODO`
  on the live prod pages. Real values still pending from the couple.
- **Pi-hole stale-cache gotcha (RESOLVED).** Patrick saw merrolyn.com still showing
  GoDaddy's parked "coming soon" page. Root cause: the LAN **Pi-holes had cached GoDaddy's
  old apex A record** (`76.223.105.230`) from before the Cloudflare nameserver cutover, so
  every LAN device was being sent straight to GoDaddy. Cloudflare itself was serving our
  site fine (`cf-cache-status: DYNAMIC`, no page rules). Fix: `pihole restartdns reload` on
  **both** pi-holes (`pihole`/`pihole2`) + local resolver flush → they now return the CF
  anycast IPs and serve our site. Remaining client-side: browser HTTP/DNS cache → hard
  refresh / incognito / cellular confirms. **Lesson:** after any registrar→Cloudflare
  cutover, flush the lab Pi-holes or expect a stale-cache period on the LAN.
- **End-of-night state:** merrolyn.com LIVE + correct on LAN and public; dev isolated;
  repo pushed (`8e84a2e`). Open: real registry handles; rotate the pasted CF DNS token.

### 2026-07-01 → 02 — Mobile audit (50 agents, verified) + guest-experience roadmap + privacy answer

**Mobile/responsive audit COMPLETE** → full punch list with validated fixes in
[`09-mobile-audit-2026-07.md`](09-mobile-audit-2026-07.md). Method: 14 auditors
(10 pages at 320/390px, live-prod Chromium screenshots, + nav/CSS/image/form
specialists), then one adversarial verifier per finding reproducing every number
independently. **35 raw → 34 confirmed, 1 plausible, 0 refuted.** Read-only; nothing
deployed, prod DB untouched. Run was interrupted twice by session usage limits and
resumed from the workflow journal both times (cached agents replayed free).
Headlines: **live prod RSVP success copy still says "captured by the prototype (not
yet saved)"** (it does save — stale prototype text, fix first); attending radios
missing `required` (misleading network-error message on 400); Alpine is CDN-only (a
failed load silently discards an RSVP on submit); terracotta eyebrow labels compute
to **1.22:1 contrast** on five pages (one-line cream fix); sticky stacked nav eats
21-31% of small phones; schedule day labels faint + orphan-wrapped; gallery ships
~3.2MB into 168px cells; every hero/scene photo is desktop-res (home ~990KB eager).
Verifiers corrected four fixes that would not have worked as written (inline-style
custom properties beat stylesheet overrides; `image-set()` picks by DPR not width;
plain padding on `display:inline` nav anchors; cream `.btn` invisible on cream cards).

**Roadmap captured** from Patrick's idea list →
[`08-guest-experience-roadmap.md`](08-guest-experience-roadmap.md): concert calendar
for Aug 7–21 2027 (nothing on the 14th; research lands spring 2027 when venues
announce), couple's restaurant guide (Brunswick Maine St + Portland), guest-addable
calendar views (behind auth, per privacy), icons + `og:image` (og tags exist but no
image; no apple-touch-icon), Uber/Lyft-in-Maine honesty page, accuracy + direct-link
pass, research data backed as md in `docs/`, and a **copy rule: no AI-sounding
language, no em dashes in guest-facing copy** (also in CLAUDE.md + memory).

**Privacy (Carolyn's question), short version:** current exposure = what the printed
save-the-dates already broadcast; guest PII already server-side behind the admin
token. Care goes into what's next: gate the guest-added calendar behind accounts
(never public "who's away when"), set Venmo private before publishing handles, decide
public-vs-passcode for schedule/gallery **before invitations print**, rate-limit the
RSVP POST, purge the DB after the wedding. Full write-up in doc 08 §10.
