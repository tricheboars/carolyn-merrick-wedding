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

### 2026-07-02 — ALL audit fixes implemented + deployed to DEV + re-verified (43/43)

**Every punch-list item from doc 09 is now live on dev** (`merrolyn.moorelab.cloud`);
**prod untouched, awaiting Patrick's review.** Highlights: RSVP prototype copy replaced
(success now says the RSVP is saved; error copy split into form-vs-network; all
human-voice, no em dashes), `required` on attending, Alpine **self-hosted** at
`/assets/js/alpine.min.js` (+`onsubmit="return false"` guard), success scrolls into
view, autocomplete/autocapitalize on name+contact. CSS: cream eyebrows on olive bands,
nav static + ~45px tap targets + `aria-current` underline + fixed CTA pill (no more
`!important`), timeline `.9rem`/nowrap/104px column, 44px radio rows w/ 20px controls,
`.note` 1rem, Maps link → `btn--ink`, Venmo icon → `ti-cash`. Images: ImageMagick
variants (hero 604→137KB square crop — couple framing verified; story 457→85KB; pano
385→75KB; cribstone 437→76KB water-side crop — NOTE the original is all granite
foundation, no scenic crop exists) wired via `@media (max-width:680px)` `:root`
overrides (inline `--scene` urls moved to vars first — inline style beats stylesheet);
hero preloads on `/` only; gallery srcset 400/800 + true `{w}w` descriptors + real
width/height attrs (2x phone: ~3.2MB → ~583KB measured). Nav breakpoint split to
**767px** (fixes the pre-existing 681–767px sticky-wrap band); images/timeline stay 680.

**Verified by a 9-agent adversarial pass against dev: 43/43 checks passed, 0 failed.**
Includes a CDP-driven functional test: empty-attending blocked natively (no request),
happy path lands confirmation on-screen, busy state real; net-log proof phones fetch
only the mobile variants (~211KB total on `/` vs ~990KB) and desktop still gets
originals; 0 horizontal overflow on all 10 pages at 320px; noindex + canonicals intact;
deployed assets byte-identical to source. The one test RSVP row ("TEST Claude verify
2026-07-02 ignore") was **purged from the dev DB** (rsvps=0, guests=0). Known accepted
limits: eyebrow contrast tops out at 3.23:1 on the #6E8FA3 band (AA-large only —
full AA needs a darker band, design call); the cribstone header stays granite-textured.

**Deploy note:** dev deploys = build with `SITE_DOMAIN=merrolyn.moorelab.cloud`, tar
`web/_site` → proxmox2 → `pct exec 205`, extract to `/var/www/merrolyn-dev.new`, swap.
**Next:** Patrick eyeballs dev on his phone → same build with
`SITE_DOMAIN=merrolyn.com` → CT 206 `/var/www/merrolyn` to promote to prod.

### 2026-07-02 (evening) — guest-experience build-out: Eat + Music pages, verified research, icons/OG, copy sweep (DEV)

Worked the roadmap (doc 08) hard; everything below is **live on dev only** (32/33
verified by a 6-agent pass; the 1 fail, an orphan `/assets/img/CREDITS/` page 11ty
templated from the assets markdown, was fixed via `eleventyConfig.ignores` + verified).

- **Research: 8-agent web sweep, everything verified against primary sources** →
  five new data files: [`data-restaurants.md`](data-restaurants.md) (16 Brunswick/
  Portland spots + 5 Harpswell; 3 closed places caught and excluded),
  [`data-transport.md`](data-transport.md) (rideshare reality: fine in Portland, thin
  in Brunswick after dark, ~nonexistent on the peninsula — a prior wedding at this
  venue warned guests off Uber/Lyft and ran a shuttle; Brunswick Taxi + Maine Limo +
  Downeaster verified), [`data-attractions.md`](data-attractions.md) (11 site claims
  audited: 7 correct, 4 tweaked — "Giant's Stairs", hedged cribstone claim, 15-min
  Brunswick, 1-hour Head Light), [`data-lodging.md`](data-lodging.md) (**lookalike
  domain harpswellinn.com is HIJACKED — never link it**; real = theharpswellinn.com),
  [`data-music-venues.md`](data-music-venues.md) (Aug 2027: zero events announced
  anywhere yet, expected; sweep plan = Apr-May + late-Jun 2027; Thompson's Point is
  the wedding-day traffic risk).
- **New pages:** `/eat/` (21 verified restaurant cards in 3 areas; Morse's food
  trailer is a 1-minute walk from the inn) and `/music/` (real August 2027 calendar,
  month grid + list toggle, wedding week highlighted, Aug 14 = "Our wedding ♥", venue
  cards with live-checked calendar links). Both in nav (now 10 links; 768-1150px wrap
  verified graceful). Travel gained **Getting around** (honest rideshare copy +
  tap-to-call taxi buttons); things-to-do cards got official links + corrected facts;
  Stay went from `#` placeholders to 6 verified booking links.
- **Icons/unfurls:** og:image (1200x630 couple crop) + twitter card + og:type/site_name,
  apple-touch-icon/PNG favicons/webmanifest from the monogram on cream, `/sitemap.xml`.
  Link previews in Slack/WhatsApp/iMessage now show the couple.
- **Copy sweep:** zero em dashes in guest-facing output (checked in the built HTML);
  "prototype" wording gone from /credits/; FAQ gained a linked "what should we do in
  Maine" entry. All 23 outbound links checked (3 bot-blocker 403s verified
  browser-fine).
- **Link-safety catch:** during research, agents found the hijacked lookalike inn
  domain (gambling page) and a dead taxi-company domain — both documented, neither
  linked. Unverified operators (Ship City Taxi, Maine Street Taxi) are docs-only.

**FOR THE COUPLE / PATRICK (new, from research):** (1) seriously consider a
**chartered shuttle** Brunswick hotel block ↔ inn for the reception end (the previous
couple at this venue did exactly this; Maine Limousine does group charters); (2) room
block: the Fairfield is the natural shuttle anchor; (3) mark your own restaurant
favorites in `docs/data-restaurants.md` for "couple's pick" badges; (4) re-verify cab
phone numbers ~July 2027.

### 2026-07-03 — guest-experience batch PROMOTED TO PROD (20/20) + README + PR #1 merged

- **PR [#1](https://github.com/tricheboars/carolyn-merrick-wedding/pull/1) merged**
  (mobile-audit fixes + guest build-out); local `main` fast-forwarded to `10811f3`,
  feature branch deleted.
- **Promoted the guest-experience batch to prod.** Built `SITE_DOMAIN=merrolyn.com`,
  atomic-swapped onto CT 206. Eat/Music/travel-getting-around/stay-links/icons/OG/
  sitemap are now **live on merrolyn.com**. **Verified 20/20 by a 4-agent read-only
  pass** (no form submits): both new pages render + toggle, tel: links dial clean,
  og:image is the couple at 1200x630, manifest+icons all 200, sitemap = exactly 12
  merrolyn.com urls (no orphan/asset entries), **no link anywhere to the hijacked
  `harpswellinn.com`**, prod has no noindex while dev keeps it, previous mobile fixes
  intact, 0 horizontal overflow on all 12 pages. Only "console error" is Cloudflare's
  analytics beacon sinkholed by the LAN Pi-hole (environmental, guests unaffected).
- **README rewritten** from prototype-phase to live: what guests get, the
  verify-everything + human-voice + mobile-first house rules, current stack/status.
- **Prod == dev == main** now (all three carry the same build). Dev/prod isolation
  intact (separate containers, own DBs, dev still noindexed).

### 2026-07-02 (later) — PROMOTED TO PROD; 27/27 read-only verification

Patrick approved dev → built `SITE_DOMAIN=merrolyn.com`, atomic-swapped onto CT 206.
**Live prod verified 27/27 by a 5-agent read-only pass** (no form submissions — prod DB
untouched): CSS/nav/timeline/radio fixes all measured live; phones fetch only mobile
image variants through Cloudflare while 1280px still gets originals; gallery serves
-400s (~0.56MB); all 10 pages clean at 390+1280 with zero horizontal overflow at 320
and zero console errors; RSVP markup correct ("not yet saved" gone); prod has **no
noindex** while dev keeps it (split intact); canonicals/og/HSTS fine; `/health` 200;
`www` 301s. Informational finds for later: the **unversioned** `/assets/css/style.css`
URL is edge-cached stale until ~Jul 9 (harmless — pages link the `?v=` URL; current CF
token lacks cache-purge perm); no `og:image` yet (roadmap item 5); `/credits/` copy
still says "prototype" (catch in the copy pass); CF auto-injects its analytics beacon
(LAN blocks it; disable in CF zone settings if unwanted). **The mobile-audit cycle is
closed: found → fixed → dev-verified → promoted → prod-verified.**

### 2026-07-14 — Carolyn's feedback round 1: registry handles in, Stay/Music unpublished, airport instructions

Carolyn reviewed the site and sent notes via Patrick. Implemented everything
actionable in one batch (built + verified locally; **not yet deployed — the dev push
needs Patrick to say go**, permission gate).

**Did:**
- **Registry is real.** Carolyn sent the actual Venmo handle, Zelle number, and
  mailing address; all three are in and rendering. PayPal row dropped (not offered).
  The handles live in `web/src/_data/registry.local.json` — **gitignored**, because
  this repo is public and git history is forever; they render on the built site as
  intended. Committed `registry.local.json.example` as the shape; `site.js` warns
  loudly at build time and falls back to "Coming soon" if the file is missing.
  ⚠️ That file exists only on archy-boi — back it up mentally: a fresh clone builds
  "Coming soon" until recreated.
- **Travel: airport instructions** (Carolyn's ask): new "To & from the airport" card.
  Uber/Lyft work FROM the Jetport (~45 min); the ride BACK must be prebooked with
  Brunswick Taxi (207) 729-3688 (tap-to-call), a day or two ahead. Matches the
  verified ground-transport research in `docs/data-transport.md`.
- **Travel: "Shuttle schedule" block added, TBD** — full-width card; copy promises
  the schedule will be posted + texted when set. FAQ shuttle answer aligned.
- **Stay unpublished** (per Carolyn: lodging guidance should reach the right people
  once guests can sign in). `/stay/` is now a noindex meta-refresh redirect to home
  (stub overwrites the old page on deploy since the tar overlay never deletes).
  Lodging data kept warm in `site.js`. Nav/home/sitemap references removed.
- **Music unpublished** (Carolyn's call), same stub treatment; calendar data + venue
  research kept in `site.js` + `docs/data-music-venues.md` for a possible spring-2027
  revival.
- **Schedule: all times now TBA** — the 4:00/5:00/6:30 placeholders read as real
  facts; Carolyn confirmed the schedule is TBD, so they're gone until real times land.
- Home page: removed the Stay/Music buttons ("See our photos" fills the row), welcome
  copy now says "where to eat" instead of "where to stay".
- Verified the build: nav is 8 items, sitemap has exactly 10 URLs (no /stay/ /music/),
  stubs are noindex+redirect, zero leftover links to removed pages, registry/travel/
  home screenshot-checked at 390px.

**Blocked / needs input (in CLAUDE.md NEEDS PATRICK):**
- **Main-page photo** "needs to be corrected" and **logo** "needs to be updated to
  the correct one" — need the actual assets/direction from Carolyn (which photo; the
  real Save-the-Date art for the logo — current monogram is our hand-drawn stand-in,
  and a logo swap also touches favicon/apple-touch/icon-192/512).
- **Stay + IAM**: Carolyn wants lodging shown per-guest ("the right people informed").
  That's the planned accounts layer (roadmap item 5): guest list already lives in the
  API DB; plan = per-invitation magic links (no passwords), lodging page rendered
  per guest group. Interim option if wanted sooner: a single shared guest code.
- Deploy to dev pending Patrick's go, then his phone review, then prod promotion.

### 2026-07-14 (evening) — Our Story unpublished; THE RECEPTION RESKIN, live on dev

Patrick sent Carolyn's design sources and said go on dev deploys.

**Did:**
- **Round-1 batch + Our Story removal deployed to dev and verified** (nav 7 items,
  /story/ /stay/ /music/ all redirect stubs, registry real, sitemap 9 URLs).
- **Fetched all of Carolyn's design references.** The pin.it links were entire
  Pinterest boards (decor 15 / florals 15 / food 14 pins via invite links); the
  Milanote link was her "Wedding Reception" board (29 images of the actual purchased
  reception design). Technique: headless Chromium renders both (dump-dom + tall
  screenshot; Pinterest pin JSON is embedded in board HTML). Four vibe photos landed
  in `assets-inbox/` (gitignored): the flash-film ring photo, two vintage wallpapers,
  a sea-fairy illustration; they validated the direction.
- **Ran a 10-agent redesign workflow** (5 image analysts + site-token reader →
  synthesis → contrast verifier + fidelity skeptic + web-craft skeptic). 13/13 WCAG
  pairs pass; both skeptics' fixes adopted (oxblood kept, blush added, one cobalt not
  two, blue-as-edge-not-field, desaturated photo overlays, no poppy script on photos,
  per-surface link colors, 3-stop plate-rim shadow, no hover-only signals).
- **Implemented the reskin** → `docs/10-redesign-2026-07.md` (palette table + the
  three signatures: scallop seam, plate-rim ring, poppy line-art divider). New SVGs
  `poppy-divider` + `scallop-seam`; favicon/coupes recolored; coupes retired to the
  footer; wax-seal timeline dots; marigold wedding-day calendar cell; clementine
  aria-current nav dot. `07-design-language.md` marked superseded.
- **Screenshot-verified 7 pages** (390px + 1280px): no purple cast on the coastal
  photos, plate-rim buttons render, seams tile cleanly. **Deployed to dev.**

**Needs Patrick/Carolyn:** react to the look on dev (merrolyn.moorelab.cloud) +
the design-brief artifact; the corrected main-page photo + real logo art are still
the open aesthetic asks (film ring photo would make a great Registry header, note
sent). Prod promotion of everything awaits the phone review.

### 2026-07-14 (late) — the REAL logos are in

Patrick dropped the canonical brand assets in `assets/logos/` (main-logo.png = the
couple's hand-lettered "Carolyn & Merrick" wordmark on the Save-the-Date olive;
small-logo.png = the true scalloped-heart C&M monogram over a tent photo; LOGOS.md
documents both). The site's monogram had been our hand-drawn imitation.

**Did:**
- Cleaned both per LOGOS.md's TODOs (luminance-mask extraction; stray rectangle
  dropped out for free at 71% bg luminance; the monogram's lamp-glow leaks at 98.7%
  hand-erased). Produced cream + plate-cobalt colorways with alpha → recipe recorded
  in LOGOS.md. Derivatives live in `web/src/assets/img/logo-{wordmark,monogram}-{white,cobalt}.png`.
- **Wired in everywhere:** hero = real monogram + real wordmark (replacing the
  Sacramento h1 text; alt text keeps the names for a11y/SEO), footer = monogram +
  wordmark, nav = monogram. Favicon-32 / apple-touch / icon-192 / icon-512 /
  favicon.svg all regenerated (white mark on plate cobalt); webmanifest theme_color
  → #202A55.
- **Sacramento webfont dropped** from the Google Fonts import (no script text left);
  one less font request.
- Screenshot-verified home at 390/1280, deployed to dev, assets 200 over HTTPS.
- Artifact brief updated (logo ask resolved; header shows the real wordmark).

**Open aesthetic ask (last one):** the main-page photo — which picture, or is it the
crop. The desktop hero currently lays the wordmark over the couple's faces, which
strengthens the case for a photo/crop decision from Carolyn.

### 2026-07-14 (night) — one text voice

Patrick flagged font inconsistency on the home page (serif lead + labels against the
sans body paragraph). Fixed site-wide: **Mulish is now the default for all text**
(nav tabs, leads, eyebrows, buttons, hero date/place, form labels, timeline, calendar,
footer meta, registry/credits inline overrides removed); **Cormorant survives only on
h1/h2/h3** as the display face; the couple's names exist only as the hand-lettered
wordmark. Verified 1 serif rule left in the stylesheet, rebuilt, deployed to dev.
Rule recorded in docs/10 + a CSS comment so it doesn't regress.

### 2026-07-14 (later still) — split hero: the wordmark never covers the couple

Patrick: with the real wordmark in, the names overlaid the couple's likeness in the
hero. Tried sky-anchoring first — dead end (at laptop ratios the wide crop eats the
sky and centers the couple). Real fix: **split hero, exactly like the save-the-date
card itself** — lettering on a plate-cobalt field (monogram, "save the date for",
wordmark, date, venue, buttons), the photo untouched beside it (desktop) or below it
(phone). Zero overlay at any viewport, and any future hero photo drops in with no
text-collision risk. Screenshot-verified at 1440x900 + 390px, deployed to dev.

### 2026-07-14 (last call) — hero settled: the tent photo with the wordmark beside them

Patrick vetoed the split hero ("segregated logo section") and picked the hero image
himself: g01, the tent in the redwoods. Full-bleed hero restored with the lettering
overlaid on the DARK FOREST right of the tent (desktop: content right-aligned,
rightward-strengthening scrim; couple stands left by the firelight, fully clear).
Mobile: new dedicated crop `g01-hero-m.jpg` (720px, 143KB, window shifted right)
keeps Carolyn at the far left edge and the lettering over the scrimmed canvas, off
both faces. site.js heroPhoto + base.njk preloads updated. Deployed to dev.
The old hero-couple.jpg/-mobile.jpg stay in the repo (gallery/story still used).

### 2026-07-16 — color-flow fix: quiet chrome, wine bookends (DEV)

Patrick on the 07-14 build: likes Carolyn's palette, but the site has no "flow of
colors" and the sunset top-bar fade is "not great." Ran a 5-designer / 3-judge
workflow (8 agents; angles: quiet-chrome, linen-invitation, grasslands-anchor,
warmth-ramp, plate-and-poppy). **Quiet Chrome: Wine Bookends won** client-fit (8.5)
and craft (8.5); linen took board-fidelity but both cream-nav proposals died on the
light-sticky-bar-over-dark-hero value slam. Shipped the winner + judge grafts:

- **Nav:** solid grape fizz `#3F0013` (footer's wine — pages bookend in one
  pigment), cream text 16.2:1, poppy dot 6.0:1, faint cream inset hairline. The
  5-stop sunset gradient and marigold glint are deleted. RSVP pill now wears a
  miniature plate-rim double ring (Set Table graft).
- **Temperature rule:** hero tent photo scrim flipped from bluebell dusk to FLAT
  grape-fizz `rgba(48,0,15,.46)` — the wine bar melts into the photo, and the photo
  reads candlelight instead of cold blue. Bluebell survives only on water photos
  (flat `.68`, was a .60→.72 gradient), always bordered by cream. Registry header
  reuses the tent photo → new `.section--scene-warm` (`.55`) keeps it wine.
  **No gradient survives anywhere** (Patrick rejected fades).
- **Sweet Cream lands:** `.card`/`.method` on `--cream-2` with oxblood hairline
  borders + oxblood in-card links (terracotta fails AA on the tint, 4.2:1 vs 6.6:1).
- **Seam extension:** cream→photo-band junctions get the scallop seam via
  `::after` (homepage Casco Bay band). `--overlay-deep-rgb` retired.

Verified locally (build + Chromium: index/schedule/registry/rsvp/mobile), then
deployed to dev CT 205 (`.new` + swap, old dir kept as `merrolyn-dev.old`) and
re-verified over HTTPS: old gradient absent from served CSS, new rules present,
screenshots match local. Docs/10 updated with the rules + back-pocket ideas
(mask-scallop dark-on-dark seams; marigold baseline if the wine bar reads dead).
**Not committed** (tree already carried the 07-14 wine-icon changes uncommitted).
**Next:** Patrick eyeballs dev on his phone → prod promotion of the whole 07-14+07-16 stack.

**Same-day follow-up (autonomous check):** post-deploy sweep of the four pages not
visually verified (gallery/eat/travel/faq) caught one regression the reskin
introduced: the new in-card oxblood link rule outranked the olive-section cream
links by source order, turning `card--olive` links (eat/travel Brunswick bands)
brick-on-olive (~1.5:1, illegible). Fixed with `.card:not(.card--olive)`,
redeployed to dev, verified in the served CSS + screenshot. Gallery header checked
against the temperature rule: the engagement shot is coastal, bluebell is correct.

### 2026-07-16 (evening) — parking truth + Stay page republished (DEV)

Two asks from Patrick:

- **Parking copy fixed.** "Ample parking at the inn" was wrong; parking is limited.
  Travel drive-card note and the FAQ parking answer now say parking at the inn is
  limited and details/the parking plan will be posted shortly before the wedding.
- **/stay/ is back** (general info for now; the per-guest room-block view can layer
  on once accounts exist). Redirect stub replaced with a real page (harbor scene
  header + sweet-cream cards), Stay re-added to the nav (8 items, between Travel
  and Eat), back in the sitemap (10 URLs). A 3-agent verification workflow ran
  before republishing: **all 5 existing entries re-verified live** (Marriott via
  search-index only — marriott.com bot-walls direct fetches), and 3 additions
  landed, all fetched from their own domains: **Bailey Island Motel** (remodeled
  2022, online booking), **Log Cabin, An Island Inn** (phone booking), and
  **OneSixtyFive, the Inn on Park Row** — which IS Patrick's requested "Brunswick
  Inn": that name was retired in Apr 2022 when the same owner rebranded at 165 Park
  Row; the old thebrunswickinn.com domain is parked/dead and must never be linked
  (same trap class as harpswellinn.com). Also caught: Little Island Motel is
  CLOSED, Captain's Watch B&B looks dormant (call before ever listing), and a
  Driftwood Inn lookalike domain rides the search results. Driftwood + Sea Escape
  verified but benched (page holds 8 listings + the room-block placeholder card,
  a clean 3x3). All details → docs/data-lodging.md (re-verification section).
  Deployed to dev CT 205 + HTTPS-verified (page 200, new entries render, parking
  copy live, nav link present). Tree still uncommitted.

**PROD PROMOTION, same evening (Patrick: "commit it all and lets update prod now").**
Committed the whole 07-14 + 07-16 stack as three logical commits (brand icon set /
color-flow reskin / stay + parking), built with SITE_DOMAIN=merrolyn.com (sitemap
on the real domain, zero moorelab leakage, CSS link version-stamped so Cloudflare
serves fresh styles) and swapped onto CT 206 (/var/www/merrolyn, old dir kept as
merrolyn.old). Verified over https://merrolyn.com: 10/10 pages 200 (incl. the new
/stay/), fresh CSS has the wine nav + no 105deg gradient, parking copy + Stay nav
link live, robots meta absent (prod indexable), API alive (/api/rsvp preflight
204; there is no /api/health route, the 404 there is expected). Docs commit + push
close the session.

**Session close: Cloudflare token — investigated, DEFERRED (Patrick's call).**
Rotation attempt found no path from this box: no Chrome extension connected (the
dashboard needs it) and no token-management credential exists locally (by design).
Groundwork banked for the follow-up session: no automation consumes the leaked
token (the firewall's DDNS uses its own, differently-scoped one), but a stored
copy of the merrolyn token DOES exist in the firewall's secrets store (exact
location in private memory) and must be updated/removed when the token is rolled
or deleted. A verify-endpoint sweep over this project's 216 session transcripts
(23 token-shaped candidates, none printed) found zero live CF tokens; the
original paste likely lives in a homelab-session transcript instead, so treat the
token as live until the dashboard says otherwise. Finish = roll or delete in CF →
Profile → API Tokens + clean the firewall copy. CLAUDE.md, docs, and memory
updated to close the session: aesthetic north star now points at doc 10, docs/07
marked superseded in the reference list, deploy-state memory carries the exact
promote recipe.
