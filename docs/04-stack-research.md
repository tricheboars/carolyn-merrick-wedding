# 04 — Deep Stack Research (what we can build off of)

> Generated 2026-06-29 by a 36-repo deep-read workflow: one agent per repo read the
> **actual dependency manifests** via `gh api` (not topic tags), then synthesis + an
> adversarial completeness critic. 36 profiled / **34 substantive**.
>
> ⚠️ **Editor's note (read first):** the couple have since decided the **registry is a
> CASH / house fund**, not an item registry — so the "registry claim mechanic"
> praised below is now **lower priority** (we want a tasteful contributions page, not
> an item catalogue). Everything else — RSVP schema, household accounts, SMS audience
> filtering, reverse-proxy notes — still applies. See
> [`06-stack-decision.md`](06-stack-decision.md) · [`00-vision.md`](00-vision.md).

---

# Stack Research: 36 Wedding-Website Repos

_Synthesis for our build: a production wedding website for a coastal-Maine wedding, with a custom pastel-whimsy frontend we own, per-household accounts, structured RSVP, a claimable gift registry, an admin panel, a custom Twilio SMS layer, and deployment to a Proxmox LXC running nginx behind HAProxy (OPNsense) + Cloudflare — Node or Python API, SQLite or Postgres, **no Docker**._

---

## 1. Executive summary

1. **No repo has SMS. Confirmed across all 36.** Every profile grepped for twilio/vonage/nexmo/messagebird/plivo/aws-sns and found nothing. The closest "guest reach" mechanisms are email (MailKit, nodemailer, SendGrid, Resend, FastAPI SMTP worker), Telegram bot (`ZEDLABS`), Meta WhatsApp Cloud API (`RajwanYair`), and client-side `wa.me`/EmailJS deep-links. **Our Twilio layer — save-the-dates, RSVP nudges, day-of alerts, two-way Q&A — is greenfield and must be built ourselves.** The best transferable design is `RajwanYair`'s `waba-bulk-send` (batched recipients + template + per-recipient results, rate-limited, DNC list) and `EanPistorius`'s DB-backed email queue (status/retry/sent_at state machine) — both map almost 1:1 onto a Twilio nudge queue.

2. **No repo is a drop-in fork for our feature set.** The single most feature-complete reference — `smileyface12349/wedding-website` — nails every advanced feature we need (household accounts, configurable RSVP with meal/dietary, registry-with-claim, admin/export, email blasts) but is **C#/Blazor**, mismatching both our Node/Python preference and our intent to own a custom frontend. It is a **data-model and feature-design blueprint to reimplement**, not code to deploy.

3. **The strongest same-stack references are `ZEDLABS` (Node + SQLite, ships its own nginx.conf + PM2→systemd recipe) and `Soccerbeats` (Next.js 16 + Postgres, rich data models + a rare drag-drop seating chart).** Both hit our exact runtime targets and have clean, idempotent migration patterns worth lifting. Neither has guest accounts, registry-claim, or SMS — but their backends and ops patterns are the closest to what we'll write.

4. **The best portable data models come from four repos:** `smileyface12349` (registry claim state machine + column-based RSVP schema), `RajwanYair` (an excellent Postgres/SQLite-ready guest table with status/meal/dietary/accessibility/transport/plus-ones), `Soccerbeats` (structured JSONB dietary-per-attendee + party_members), and `elkrammer/kegger` (party-as-household → N guests with a passwordless ksuid magic-link RSVP pattern). Combine these.

5. **The "claim" mechanic is rare and only one repo does it properly:** `smileyface12349`'s `RegistryItem` + `RegistryItemClaim` (Available→Pending→Claimed→Completed→Received state machine, MaxQuantity, multiple fulfillment methods). Every other "registry" in the corpus is a static bank-account/Venmo display card with copy-to-clipboard — no reservation logic. This is our reference; everyone else just confirms the gap.

6. **Hostability splits cleanly into three buckets.** Pure-static sites (~half the corpus) drop onto nginx trivially but give us zero backend. Self-hosted fullstack monoliths (`ZEDLABS`, `Soccerbeats`, `smileyface12349`, `EanPistorius`) fit our LXC as a systemd service — these are the ones worth studying. BaaS/serverless apps (Supabase/Firebase/Google-Sheets/Cloudflare-Workers/Vercel) are a **different deployment model** and would need their backends rewritten wholesale.

---

## 2. Architecture clusters

### Cluster A — Fullstack monolith (self-hostable; our target shape)
**Members:** `smileyface12349/wedding-website` (C#/Blazor + EF Core SQLite), `ZEDLABS-TEKNOLOGI-INDONESIA/wedding-invitation` (Astro SSR + Node + better-sqlite3), `Soccerbeats/weddingwebsite` (Next.js 16 + Postgres), `indiesurya/wedding-invitation-app` (Laravel 8 + MySQL), `Syafwan000/noshi` (Laravel 12 + SQLite), `PaungPhet` (Laravel 12 + Filament).

**Typical stack:** server-rendered or SSR frontend + an app server + a relational DB in one deployable unit.

**Pros for us:** This is the shape we're building. The Node/SQLite and Node/Postgres members (`ZEDLABS`, `Soccerbeats`) have directly portable data layers, migration discipline, admin/export patterns, and (in `ZEDLABS`) a complete nginx + process-manager deploy recipe.

**Cons for us:** `smileyface12349` is C#/Blazor (wrong language, frontend doesn't transfer); the three Laravel members are PHP/php-fpm (off our Node/Python preference). The frontends are all themes we'll discard since we own ours.

**Hostability on nginx/LXC (no Docker):** Excellent for the Node members. `ZEDLABS` runs as `node dist/server/entry.mjs` on port 5432 → systemd unit + its bundled `nginx.conf` reverse-proxy → slots behind HAProxy/Cloudflare. `Soccerbeats` uses Next.js `output:'standalone'` → `node server.js` as a systemd service after stripping its Docker/Portainer layer (Postgres is a hard dep). `smileyface12349` is `dotnet publish` + systemd + nginx (README recommends exactly this) but needs the .NET 9 runtime and is the wrong language for us. The Laravel members need php-fpm + a DB — runnable but off-stack.

### Cluster B — Headless API + SPA
**Members:** `dewanakl/undangan-api` (PHP/Kamu + MySQL/Postgres), `dewanakl/undangan` (frontend-only, closed backend), `sakeenah/template` (Hono/Node + Postgres, also CF Workers), `fauzialz/amifauzi.com-open` (Remix + Google Sheets), `EanPistorius/pist` (FastAPI/Python + Postgres), `RezkyRizaldi/wedding-rudi-shella` (Nuxt/Nitro + MongoDB + Pusher), `elkrammer/kegger` (Go/Echo + Postgres), `APAInsular/invited-front` + `invited-back` (React CRA + Laravel/MySQL on AWS Vapor).

**Typical stack:** a static or SSR SPA talking to a separate REST API; DB usually Postgres or MySQL.

**Pros for us:** Clean separation matches our plan (own static-ish frontend + Node/Python API). `EanPistorius` is **our exact target language** (Python/FastAPI + Postgres) with a textbook models/schemas/repositories/services/workers layering and a DB-backed email queue. `sakeenah` has a clean Zod-validated, feature-folder Hono/Node backend and a good multi-tenant data model. `elkrammer` has the best passwordless household magic-link RSVP pattern. `invited-back/-front` ship a detailed Zod `WeddingSchema` + guest/attendant (plus-ones/dietary) model.

**Cons for us:** Several backends are wrong-language (PHP `undangan-api`, Go `kegger`, PHP `invited-back`) or absent/closed (`dewanakl/undangan`, `invited-front`). Some are BaaS-coupled (`amifauzi` Sheets, `RezkyRizaldi` Mongo+Pusher). `kegger` is archived (Jan 2023) with an EOL Vue 2 frontend.

**Hostability on nginx/LXC:** `EanPistorius` fits cleanly (uvicorn systemd + Postgres + static Next build) once its Docker-compose/certbot layer is dropped — **but its repo commits live Let's Encrypt keys and a Postgres password; do not reuse those.** `sakeenah` self-host path (`node`/`bun` Hono service + static `dist/`) fits; its default path is CF Workers (serverless, skip). `kegger` is a single Go binary + static Vue build (fits, but Go/archived). PHP and Mongo/Pusher members are off-stack.

### Cluster C — SPA + BaaS (Firebase / Supabase / Sheets)
**Members:** `amirnagat/-wedding-rsvp` (Supabase), `MDF05/wedding-invitation-1` (static CSV, Supabase only on roadmap), `RajwanYair/Wedding` (Supabase + Deno edge functions), `juhonamnam/wedding-invitation` (static + optional Go/SQLite companion), `Hitesh297/react-portfolio` (Google Apps Script), `parta99/pawiwahan` (Firebase + external Express + Sheets), `knm8643/wedding-public` (EmailJS).

**Typical stack:** static SPA reaching a managed backend (Supabase Postgres, Firebase, Google Sheets/Apps Script) directly from the browser, often with the anon key in client code.

**Pros for us:** `RajwanYair` is a rich pattern/data-model donor despite being an admin/planner tool (see §4). A few personalization and export ideas are reusable.

**Cons for us:** The BaaS model is the **opposite** of our self-hosted SQLite/Postgres-on-LXC target — adopting any of these means rewriting the backend entirely. Multiple have **committed live secrets** (`amirnagat`: live Supabase URL + anon JWT + `admin123`; `RajwanYair`: keys are server-side, cleaner). `RajwanYair`'s backend is Supabase + ~12 Deno edge functions — not portable as-is.

**Hostability on nginx/LXC:** The static frontends serve trivially; the **backends do not map** to our infra without a full reimplementation. Treat as reference-only.

### Cluster D — Static SSG (Astro / Next / Gatsby / Nuxt export)
**Members:** `idindrakusuma/thekusuma` (Gatsby 2), `LeeKyuHyuk` (Next export), `Koketso1999/our-day` (Next export + Google Form RSVP), `ourkk/wedding-day` (Astro 6 + Tailwind v4), plus `danangekal` (Vue 2 build).

**Typical stack:** static-export framework → `dist/`/`out/` of HTML/JS/CSS, deployed to GitHub Pages/Netlify/Vercel.

**Pros for us:** Excellent nginx fit. `ourkk/wedding-day` is a clean, modern **Astro 6 + Tailwind v4** reference for the static/marketing portions (hero, schedule, venue/maps, gallery, **FAQ accordion from a typed `FAQCategory[]`**, config-as-data) and shows the deploy workflow. `thekusuma` has a strong per-guest QR e-ticket + day-of check-in concept.

**Cons for us:** Zero backend — every dynamic feature (RSVP, accounts, registry, admin, SMS) must be built alongside. Gatsby 2 / Vue 2 members are EOL.

**Hostability on nginx/LXC:** Trivial (`astro build`/`next build` → static dir → nginx docroot). Useful as the static shell of a static-frontend + private-API split.

### Cluster E — Pure static invitation / CMS (low value)
**Members:** `rampatra` (BS3/jQuery + Apps Script), `daengdoang`, `vinitshahdeo`, `NgodingSolusi` (GitHub-Issues-as-DB), `shyamjos`, `archakNath`, `jeyraof/rosy.day`, `knm8643`, `mesinkasir/weddingonline` (GetSimple PHP CMS), `scanurag/ShineOnYourDay` (README-only, empty).

**Typical stack:** hand-written HTML/CSS/jQuery or a flat-file CMS; "RSVP" is a WhatsApp deep-link, a Google Sheet, or (in `NgodingSolusi`) public GitHub Issues.

**Pros/cons for us:** Brochure-ware. Value is limited to IA/section checklists, countdown/calendar/maps deep-link idioms, and floral-divider aesthetic cues. No data models, no auth, no registry, no SMS. `mesinkasir` and `scanurag` are effectively useless (PHP flat-file CMS; empty repo). Several are unlicensed or carry GPL/AGPL/non-commercial template terms.

**Hostability:** Trivial static fit, but they don't differentiate — any static output fits nginx.

---

## 3. Comparison matrix (substantive repos)

★ = GitHub stars (where noted in profiles; "—" if not stated). Fork-fit is the profile's `forkSuitability` (1–5).

| Repo | ★ | Frontend | Backend | DB | RSVP | Registry | Auth | Admin | SMS | License | Fit |
|---|---|---|---|---|---|---|---|---|---|---|---|
| smileyface12349/wedding-website | — | Blazor/.NET 9 + MudBlazor | C# ASP.NET Core | SQLite (EF, →PG) | ✓ | ✓ (claim) | ✓ household | ✓ | ✗ | NOASSERTION | 4 |
| ZEDLABS/wedding-invitation | — | Astro 7 + React 19 | Node (Astro SSR) | SQLite (better-sqlite3) | ✓ | ✗ | ✗ (shared admin) | ✓ | ✗ | MIT | 4 |
| Soccerbeats/weddingwebsite | 1 | Next.js 16 + React 19 | Node (Next routes) | Postgres | ✓ | ✓ (no claim) | ✗ (name lookup) | ✓ | ✗ | none | 4 |
| sakeenah/template | — | React 18 + Vite | Hono/Node (or CF Worker) | Postgres | ✓ | ✗ | ✗ (base64-URL) | ✗ | ✗ | Apache-2.0 | 3 |
| EanPistorius/pist | — | Next.js 16 + React 19 | Python FastAPI | Postgres | ✓ | ✗ | ✗ | ✗ | none | 3 |
| RajwanYair/Wedding | — | Vanilla JS + Vite | Supabase Deno edge fns | Supabase PG | ✓ | ✓ (thanks-track) | ✗ (admin allowlist) | ✓ | ✗ | MIT | 3 |
| elkrammer/kegger | 4 | Vue 2 + Buefy | Go/Echo | Postgres | ✓ | ✗ | ✗ (ksuid magic-link) | ✓ | ✗ | MIT | 2 |
| amirnagat/-wedding-rsvp | — | React 18 (1-file) | none (Supabase REST) | Supabase PG | ✓ | ✗ | ✗ (`admin123`) | ✓ | ✗ | ambiguous | 2 |
| MDF05/wedding-invitation-1 | — | Vue 3 + Tailwind | none (static CSV) | none | ✓ (wa.me) | ✓ (static cards) | ✗ | ✗ | ✗ | MIT | 2 |
| juhonamnam/wedding-invitation | — | React 19 + SASS | none / Go companion | none / SQLite | ✓ | ✗ | ✗ (per-post pw) | ✗ | ✗ | MIT | 2 |
| fauzialz/amifauzi.com-open | 65 | Remix/React | Node (Remix, Vercel) | Google Sheets | ✗ | ✗ | ✗ (Google sign-in) | ✗ | ✗ | none | 2 |
| dewanakl/undangan-api | — | none (API) | PHP/Kamu | MySQL/PG/Mongo | ✓ (guestbook) | ✗ | ✗ (single admin) | ✓ | ✗ | MIT | 2 |
| dewanakl/undangan | — | Vanilla JS + Bootstrap | none (closed SaaS) | none | ✓ (guestbook) | ✗ | ✗ (admin only) | ✓ | ✗ | MIT | 2 |
| RezkyRizaldi/wedding-rudi-shella | — | Nuxt 3 (ssr off) | Node (Nitro) | MongoDB | ✗ | ✗ | ✗ | ✗ | ✗ | none | 2 |
| Syafwan000/noshi | — | Blade + Livewire 3 | PHP Laravel 12 | SQLite | ✗ (QR check-in) | ✗ | ✗ (shared admin) | ✓ | ✗ | MIT | 2 |
| indiesurya/wedding-invitation-app | 14 | Blade + Livewire 2 | PHP Laravel 8 | MySQL | ✓ (guestbook) | ✗ | ✗ (single admin) | ✓ | ✗ | MIT (inherited) | 1 |
| PaungPhet/PaungPhet | 3 | Blade + Filament | PHP Laravel 12 | MySQL/PG/SQLite | ✗ | ✗ | ✗ (slug URL) | ✓ | ✗ | AGPL-3.0 + ARR | 2 |
| parta99/pawiwahan | — | Vue 3 / BS5 | none (Firebase+Express) | Firebase/Sheets | ✓ (Sheets) | ✗ | ✓ (Google) | ✗ | ✗ | MIT (attrib.) | 2 |
| idindrakusuma/thekusuma | — | Gatsby 2 + React 16 | none (static) | none (JSON) | ✗ | ✗ | ✓ (URL ?code=) | ✗ | ✗ | MIT | 2 |
| MDF/Koketso1999/our-day | — | Next 15 export | none (static) | none (Google Form) | ✓ (form) | ✗ | ✗ | ✗ | ✗ | none | 2 |
| ourkk/wedding-day | — | Astro 6 + Tailwind v4 | none (static) | none | ✗ | ✗ | ✗ | ✗ | ✗ | CC0-1.0 | 2 |
| rampatra/wedding-website | — | BS3 + jQuery | none (Apps Script) | Google Sheets | ✓ | ✗ | ✗ (MD5 client) | ✗ | ✗ | GPL-3.0 | 2 |
| Hitesh297/react-portfolio | — | React 18 + Vite | none (external) | none | ✗ | ✗ | ✗ | ✗ | ✗ | none | 2 |
| knm8643/wedding-public | 13 | Vue 3 + Vite | none (EmailJS) | none | ✗ | ✗ | ✗ | ✗ | ✗ | MIT | 2 |
| jeyraof/rosy.day | — | Vanilla HTML/JS | none (static) | none | ✗ | ✗ | ✗ | ✗ | ✗ | none | 2 |
| LeeKyuHyuk/wedding-invitation | — | Next 14 export + AntD | none (static) | none (JSON) | ✗ | ✗ | ✗ | ✗ | ✗ | MIT | 1 |
| daengdoang/simple-wedding | — | Bulma + jQuery | none (static) | none | ✗ (wa.me) | ✗ | ✗ | ✗ | ✗ | MIT | 2 |
| NgodingSolusi/rehan-maulidan | 218 | BS3 + jQuery | none (GitHub Issues) | none | ✗ (issues) | ✗ | ✗ | ✗ | ✗ | none | 2 |
| vinitshahdeo/Wedding-Invitation | — | jQuery + Sakura | none (static) | none | ✗ | ✗ | ✗ | ✗ | ✗ | AGPL-3.0 | 1 |
| shyamjos/wedding-website | — | BS3 + jQuery | none (static) | none | ✗ | ✗ | ✗ | ✗ | ✗ | none | 2 |
| danangekal/wedding-invitation | — | Vue 2 + UIkit | none (static) | none | ✗ | ✗ | ✗ | ✗ | ✗ | none | 1 |
| mesinkasir/weddingonline | — | PHP templates + BS | PHP GetSimple CMS | flat-file XML | ✗ | ✗ | ✗ (single admin) | ✓ | ✗ | none | 1 |
| APAInsular/invited-front | — | React 19 CRA | none (Laravel API) | none (MySQL) | ✓ | ✗ | ✗ (couple/admin) | ✓ | ✗ | none | 2 |
| APAInsular/invited-back | 0 | none (API) | PHP Laravel 10 | MySQL (→PG) | ✗ | ✗ | ✗ (couple/admin) | ✓ | ✗ | MIT (ambiguous) | 2 |

(`archakNath`, `scanurag` are non-substantive and omitted; `archakNath` is a dead-button static template, `scanurag` is a README-only empty repo.)

**Reading the matrix:** Only `smileyface12349` shows ✓ across RSVP + registry + auth + admin (and it's C#). Only `smileyface12349` has a true registry **claim** mechanic. **SMS is ✗ in every single row.** The same-stack ✓-admin Node members are `ZEDLABS`, `Soccerbeats` (and `EanPistorius` for the Python API shape).

---

## 4. What we can build off of, by layer

### Frontend approach + components/ideas to borrow
**Approach:** Build our own pastel-whimsy/coastal-Maine frontend. Recommended shape: a **static-frontend + private-API split** — render the marketing/static portions (hero, story, schedule, venue/maps, gallery, FAQ, travel/lodging) as a fast static or SSR site, and have the dynamic portions (login, RSVP, registry-claim, admin) call our own API. `juhonamnam`'s `STATIC_ONLY` toggle (`src/env.ts`) is a clean model for gracefully degrading to a static archive when the API is absent — useful behind HAProxy.

Specific borrowables (patterns, not wholesale code — note licenses in §6):
- **Astro + Tailwind v4 static skeleton & FAQ data model** — `ourkk/wedding-day`: component decomposition (Hero, ScheduleSection, VenueSection, GallerySection, **FAQSection driven by a typed `FAQCategory[]` of {q,a}** → accordion), `config.ts` centralizing metadata/dates (dayjs)/SEO, and a clean two-event schedule that maps onto a Maine welcome-party + ceremony weekend.
- **Per-guest personalized link / cover-gate** — `MDF05` (Pinia `guestStore` matching CSV slug → `isInvited`), `fauzialz` (`?to=` query param greeting), `thekusuma` (`?code=` → printable QR e-ticket), `parta99` (`?to=` deep-link). These map directly onto our per-household magic-link SMS deep-links.
- **Story/scene + reveal animation** — `Koketso1999/our-day` (swipe/tap/auto-advance story engine, `ClientOnly` hydration-safe wrapper), and IntersectionObserver scroll-reveals (`knm8643`, `jeyraof`, `juhonamnam` `lazyDiv`).
- **Gallery** — `fauzialz`'s masonry/justified-layout algorithm (`compute-layout.ts`, binary-heap + dijkstra) is genuinely good and worth lifting; `Hitesh297`'s IndexedDB image-cache for remote galleries; Swiper + lightbox patterns are everywhere (`MDF05`, `RezkyRizaldi`, `knm8643`).
- **Calendar/maps idioms** — `rampatra` (`ouical.js` Google/Apple/Outlook/Yahoo add-to-calendar), `shyamjos` (dual venue map iframes), `MDF05`/`daengdoang` (Google Calendar + Maps/Waze deep-links), `EanPistorius` (`maplibre-gl`/`react-map-gl` — no Google key needed, good for our travel/venue map).
- **Lazy-image aspect-ratio reservation** — `jeyraof` (`data-src`+`data-ratio` placeholder).

### Backend + DATA MODEL for accounts / RSVP / registry
**Backend shape:** Adopt the **layered API** from `EanPistorius/pist` (FastAPI: `models / schemas / repositories / services / workers`) if we go Python, or the **feature-folder Hono layout** from `sakeenah` (routes + Zod schema + spec per feature, central `AppError`/`onError`, lazy cached `pg` pool) if we go Node. Both are clean, tested templates to extend.

**Guest/household + RSVP data model — combine these:**
- **`RajwanYair`** (`supabase/migrations/001_create_tables.sql`) is the **richest, near-drop-in guests table**: `status` (pending/confirmed/declined/maybe), `side`, `group`, `meal` (regular/vegetarian/vegan/gluten_free/kosher), `meal_notes`, `accessibility`, `transport`, `count`/`children` (plus-ones), `table_id`, `vip`, `tags` JSONB, `history` JSONB, `rsvp_date`/`rsvp_source`. Its migration discipline (RLS, triggers, audit_log, soft_delete, delivery_tracking, event_id scoping) is a good schema-evolution template.
- **`elkrammer/kegger`** for **household grouping + passwordless access**: `parties (household) 1→N guests` with FK cascade; guest carries `plus_one` bool, `is_attending`, `invitation_id` (a **ksuid** emailed as a magic link `/invite/:invite_id`), `invitation_sent`/`invitation_opened` timestamps; `/findinvite/:email` resolver. This is exactly our per-household-access-without-real-passwords pattern, and the `invitation_opened` tracking idea feeds SMS/email open metrics. A key/value settings table holds runtime event config.
- **`Soccerbeats`** for **structured per-attendee dietary**: `rsvps.dietary_restrictions` as a JSONB array `{name, note, vegetarian, vegan, gluten_free, nut_allergy}`, plus `guest_list` (`party_size`, `side`, `party_members` JSONB, `rsvp_status`, `plus_one_name`, `invited`). Its **idempotent migration pattern** (`ALTER … ADD COLUMN IF NOT EXISTS` + DO-block backfills) is a good template, as is server-side party-size validation and the verify→prefill-existing-RSVP loop.
- **`smileyface12349`** for the **RSVP schema design**: column-based answer model (`RsvpDataColumn` ids) with FreeText/Select/MultiSelect question types, an "Other" free-text auxiliary column, separate Yes/No question sets, and a **server-side `Validator` delegate** (e.g. vegan auto-implies vegetarian + dairy-free; block chicken if vegetarian). Also: Account-with-multiple-Guests (household) modeling + `HasLoggedIn` activity tracking + `AccountLog` for admin "recent activity".
- **`invited-back`/`invited-front`** for a clean relational shape and a Zod schema: `User(couple) → Wedding → Guest → Attendant[]` (one invited Guest row, N Attendant plus-one rows with name/age/allergy/feeding/extraInfo), plus a Zod `WeddingSchema` with FoodType/DressCode enums and an Events[] itinerary. (Add an `attending`/`mealChoice` field to Attendant — it's missing there.)

**Real per-guest accounts:** None of these implement real per-household logins — most are admin-only auth, name lookups, or magic-link tokens. **Adopt the magic-link/token model** (`kegger` ksuid, `Syafwan000` opaque `identifier` slug, `thekusuma` `?code=`) as our primary low-friction household access, and add a server-side session on top. **Avoid the anti-patterns**: client-side MD5 invite gates (`rampatra`), `admin123` in client JS (`amirnagat`), per-post passwords (`juhonamnam`). For the **admin panel**, take the bcrypt + JWT access/refresh pair (`kegger`) or `Soccerbeats`'s `jose` JWT gate on `/admin` — but **don't** copy `Soccerbeats`'s pattern of reusing `ADMIN_PASSWORD` as the JWT signing secret, or `ZEDLABS`'s unsigned `"true"` cookie.

**Admin export:** `Soccerbeats` and `ZEDLABS` both ship CSV/PDF export (papaparse/jspdf/file-saver/jszip); `dewanakl/undangan-api` has a tidy `/stats` + `/download` + access-key-rotation admin spec; `amirnagat` has a nice UTF-8-BOM CSV split (all/attending/not-attending) so Excel opens special chars correctly.

### The registry "claim" mechanic — best reference
**`smileyface12349/wedding-website` is the only proper reference.** Steal its two-table design:
- `RegistryItem` — `MaxQuantity`, `Priority`, multiple `PurchaseMethods`, and `AllowBringOnDay`/`DeliverToUs`/`MoneyTransfer` flags.
- `RegistryItemClaim` — `UserId`, `Quantity`, `FulfillmentMethod`, `ClaimedAt`/`CompletedAt`/`ReceivedAt`.
- Together they yield a clean **Available → Pending → Claimed → Completed → Received** state machine.

Every other "registry" in the corpus is a static display card (bank account, Venmo/CashApp/Zelle/PayPal/Bit/PayBox deep-links) with copy-to-clipboard — `MDF05`, `Soccerbeats`, `RajwanYair` (mark-received/thanks tracking, no guest-facing reservation), `parta99`, `RezkyRizaldi`, `knm8643`. Useful UX touch to keep: the copy-to-clipboard "claim" affordance (`knm8643`, `RezkyRizaldi`) repurposed for our real claim buttons; `RajwanYair`'s `getRegistryStats` + gift-thanks tracking for the admin side.

### i18n / gallery / guestbook / calendar / maps niceties — best references
- **i18n:** `smileyface12349` (EmailVariable + EmailFilters audience system — reuse the concept for SMS targeting), `RajwanYair` (i18n parity tooling), `invited-front` (per-page JSON translation files + `usePageTranslation` hook + `LanguageContext`), `kegger` (per-language template files + `invitation_lang` column). _(We're English-default, so this is secondary.)_
- **Gallery:** `fauzialz` (justified masonry algorithm — lift wholesale), `Hitesh297` (IndexedDB remote-image cache), Swiper+lightbox everywhere.
- **Guestbook (if we add one):** `dewanakl/undangan-api` threaded-comment model (`parent_id` self-ref + likes keyed by uuid, cascade delete) is the cleanest; `RezkyRizaldi` Nitro+Prisma `/api/wish` aggregates counts in one endpoint; `juhonamnam` offset/limit pagination; `parta99`'s nested reply UX. Store `ip`+`user_agent` per submission for spam triage (`dewanakl`).
- **Calendar:** `rampatra` (`ouical.js` multi-provider), `Koketso1999`/`NgodingSolusi` (`.ics` / add-to-calendar-button), `MDF05` (Google Calendar deep-link).
- **Maps:** `EanPistorius` (`maplibre-gl`/`react-map-gl`, no API key), `shyamjos` (dual-venue embed pattern).

### SMS — confirmed absent; what we build ourselves
**Confirmed: 0 of 36 repos have any SMS/voice integration.** Every profile checked twilio/vonage/nexmo/messagebird/plivo/aws-sns and found nothing. This entire layer is ours to build. Design it by porting two patterns:
- **Queue + state machine** — `EanPistorius`'s DB-backed `email` table (`status` queued/sending/sent/failed, `retry_count`, `error`, `sent_at`) with a long-poll worker → **swap `EmailSender` for a `TwilioSender`, identical retry/status machinery.** This becomes our nudge/day-of-alert outbox.
- **Bulk send + templating + DNC** — `RajwanYair`'s `waba-bulk-send` (batch of recipients + template + per-recipient results, rate-limited to 30/invocation, variable hints via `wa-messaging.js`), plus `whatsapp-scheduler` and a `whatsapp-dnc` do-not-contact list. This maps almost 1:1 onto Twilio audience filtering + scheduled nudges + opt-out compliance.
- **Audience filtering** — `smileyface12349`'s `EmailFilters` (RsvpStatusFilter, NumGuestsFilter) and EmailVariable (FirstNames/GroupedNames/NumGuests) for targeted sends → reuse for "text everyone who hasn't RSVP'd."
- **Two-way Q&A** — greenfield: a Twilio inbound webhook → store in a `messages` table keyed to household (mirror the guestbook threading from `dewanakl`), surface in the admin panel.
- **Deep-links** — every personalized-link pattern (`kegger` ksuid, `thekusuma` `?code=`, `?to=`) becomes the magic-link we text in save-the-dates.

### Deploy fit — what drops cleanly onto nginx/LXC + Node/Python systemd
- **Cleanest same-stack recipes:** `ZEDLABS` ships its own `nginx.conf` reverse-proxy + a PM2 `ecosystem.config.cjs` we convert to a systemd unit (Node + SQLite file, no external DB). `Soccerbeats` → Next.js `output:'standalone'` `node server.js` as a systemd service against Postgres (strip Docker/Portainer). `EanPistorius` → uvicorn systemd + Postgres + static Next build (strip Docker-compose/certbot **and its committed secrets**). `sakeenah` self-host → Hono `node` service + static `dist/`.
- **Reverse-proxy correctness:** Adopt `smileyface12349`'s `ForwardedHeaders` (X-Forwarded-For/Proto) setup for our HAProxy/OPNsense + Cloudflare chain — whatever framework we pick needs the equivalent trust-proxy config.
- **Static shell:** Any Astro/Next-export (`ourkk`, `Koketso1999`) builds to a dir nginx serves directly — good for our marketing pages.
- **Skip:** anything Docker-required as the only path (`Soccerbeats`, `EanPistorius` compose — but both have non-Docker fallbacks), CF Workers (`sakeenah` default), Supabase/Firebase/Sheets backends (Cluster C, `amifauzi`), and php-fpm apps (the Laravel/PHP members).

---

## 5. Top references to keep open (ranked)

1. **`smileyface12349/wedding-website`** — _the feature & data-model bible._ Only repo with household accounts + configurable RSVP + **registry claim state machine** + admin/export + email-blast audience filtering, all cleanly modeled. Take: `RegistryItem`/`RegistryItemClaim` claim design, the column-based RSVP schema + server-side validators, household-account modeling, EmailFilters→SMS-audience concept, ForwardedHeaders setup. (C#/Blazor — reimplement, don't fork; strip the non-commercial Amsterdam font + AI-generated backgrounds.)
2. **`RajwanYair/Wedding`** — _the best portable guest schema + the SMS-queue blueprint._ Take: the `001_create_tables.sql` guests table (status/side/meal/dietary/accessibility/transport/plus-ones), migration discipline, and the `waba-bulk-send`/scheduler/DNC bulk-outreach design to model our Twilio layer on. (Backend is Supabase+Deno — reference only.)
3. **`Soccerbeats/weddingwebsite`** — _same-stack (Node+Postgres) data models + the one rare advanced asset._ Take: JSONB per-attendee dietary model, idempotent migrations, party-size-validated RSVP flow, JWT-gated admin + CSV/PDF export, and the `@xyflow/react`+`@dnd-kit` **drag-drop seating chart** (rare in this corpus). (No license — reimplement patterns, don't copy files.)
4. **`ZEDLABS/wedding-invitation`** — _the cleanest no-Docker Node deploy recipe._ Take: better-sqlite3 data layer, key/value `config` table for no-redeploy content edits, in-memory rate limiter, RSVP write-hook (swap Telegram→Twilio at the same injection point), per-guest invitation-link manager, and the `nginx.conf` + process-manager→systemd template. MIT.
5. **`EanPistorius/pist`** — _our exact target language (Python/FastAPI + Postgres), cleanly layered._ Take: models/schemas/repositories/services/workers structure, the **DB-backed outbound queue with retry/status** (→ Twilio outbox), upsert-on-RSVP logic, maplibre maps, Alembic scaffolding. (No license + **committed live TLS keys/DB password** — read patterns, copy nothing verbatim.)

_Runner-up:_ **`elkrammer/kegger`** for the household→guests schema + ksuid magic-link RSVP UX (archived/Go, schema only). **`ourkk/wedding-day`** for the Astro+Tailwind v4 static shell + typed FAQ accordion. **`sakeenah`** for the Hono feature-folder backend if we go Node.

---

## 6. License & risk cautions

- **Copyleft (don't copy code verbatim):** `rampatra` is **GPL-3.0**; `vinitshahdeo` and `PaungPhet` are **AGPL-3.0** (network-use disclosure clause). `PaungPhet` additionally asserts "All Rights Reserved / commercial license required" on top of AGPL — legally hazardous; ideas only.
- **No license = all-rights-reserved (legally unsafe to copy):** `Soccerbeats`, `EanPistorius`, `amifauzi`, `Hitesh297`, `RezkyRizaldi`, `jeyraof`, `danangekal`, `shyamjos`, `NgodingSolusi`, `Koketso1999`, `mesinkasir`, `scanurag`, `invited-front`, and `amirnagat` (README claims MIT but no LICENSE file). Reimplement patterns; get permission before lifting files.
- **Non-standard / bundled-asset terms:** `smileyface12349` is NOASSERTION (fine for personal use, read it) and bundles a **non-commercial-only Amsterdam font** + **AI-generated background images** — strip before any prod build. `sakeenah` is Apache-2.0 (GitHub mislabels as NOASSERTION) — safe with NOTICE. `parta99` and `NgodingSolusi` require keeping author/credit footers. `Syafwan000` and `Hitesh297`/`thekusuma`/`danangekal` bundle copyrighted or personal photo/IP assets (Doraemon, couples' real photos) — never reuse. We're building our own art, so asset reuse is moot anyway.
- **Committed secrets (do NOT reuse these files):** `EanPistorius` commits **live Let's Encrypt private keys + a hardcoded Postgres password**; `amirnagat` commits a **live Supabase URL + anon JWT** and `admin123`; `RezkyRizaldi` exposes `PUSHER_SECRET` client-side; `mesinkasir` commits an admin API key + SHA-1 password hash; `parta99` has a real bank account name in source. Default-credential smells: `Soccerbeats` (`P@ssw0rd`), `ZEDLABS` (`P@ssw0rd`), `kegger` (`admin@admin.com`/`admin`), `Syafwan000` (`admin`/`password`).
- **Insecure auth anti-patterns to avoid:** client-side MD5 invite gates (`rampatra`), client-checked `admin123` (`amirnagat`), world-writable RLS `using(true)` (`amirnagat`), unauthenticated `DELETE /wishes/:id` + wide-open CORS (`sakeenah`), unsigned `"true"` admin cookie (`ZEDLABS`), `ADMIN_PASSWORD` reused as JWT secret (`Soccerbeats`).
- **BaaS / serverless lock-in (backend won't port to our LXC):** Supabase (`RajwanYair`, `amirnagat`, `MDF05`-roadmap), Firebase (`parta99`), Google Sheets/Apps Script (`amifauzi`, `rampatra`, `Hitesh297`), Cloudflare Workers (`sakeenah` default), Vercel-serverless (`amifauzi`), MongoDB+Pusher (`RezkyRizaldi`), EmailJS (`knm8643`, `Koketso1999`). Public GitHub-Issues-as-DB (`NgodingSolusi`) leaks RSVPs publicly.
- **Abandoned / EOL stacks:** `kegger` (archived Jan 2023, Vue 2 EOL, Go), `thekusuma` (Gatsby 2 EOL), `danangekal` (Vue 2 + webpack 3, 2021), `indiesurya` (Laravel, 2022, "many features broken on deploy"), `mesinkasir` (GetSimple CMS abandoned upstream), `scanurag` (empty repo).

---

## 7. Final recommendation

**Adopt a fullstack-monolith-ish self-hosted stack split into a static-rendered frontend + a private API, deployed as a single systemd service (plus nginx static docroot) on the LXC.**

**Concrete stack:**
- **Frontend (ours):** a static/SSR site we own — **Astro + Tailwind** is the cleanest modern reference here (`ourkk/wedding-day`) and outputs a static `dist/` that nginx serves trivially; the dynamic pages (login, RSVP, registry, admin) call our API. Use the `STATIC_ONLY`-style graceful-degradation split (`juhonamnam`) so the static shell survives if the API is down.
- **Backend + DB — pick one of two, both proven in-corpus on our infra:**
  - **Node + better-sqlite3 (or Postgres):** model the deploy on **`ZEDLABS`** (ships nginx.conf + PM2→systemd, SQLite file, RSVP write-hook for our Twilio injection point) and the API structure on **`sakeenah`**'s Zod feature-folder Hono layout.
  - **Python + FastAPI + Postgres:** model on **`EanPistorius`** (layered models/schemas/repositories/services/workers + the DB-backed outbound queue we repurpose for Twilio). This best matches a stated Python preference and gives us the queue for free.
  - Either way: **SQLite is fine to start** (single-event, low concurrency — `ZEDLABS`/`smileyface12349` prove it), with a clean migration path to Postgres (`Soccerbeats`/`RajwanYair`/`EanPistorius` show the Postgres shape).
- **Data models (the load-bearing borrow):** Base the **guests/household table on `RajwanYair`** (status/meal/dietary/accessibility/transport/plus-ones) + **`elkrammer/kegger`'s** party→guests + **ksuid magic-link** access; **per-attendee dietary as JSONB from `Soccerbeats`**; **RSVP question/validator design from `smileyface12349`**; **registry from `smileyface12349`'s `RegistryItem`/`RegistryItemClaim` claim state machine** (the only real claim reference). Real household login = magic-link token + server session; admin = bcrypt+JWT (`kegger`/`Soccerbeats`, minus their secret-reuse mistakes).
- **SMS (greenfield, ours):** a Twilio outbox built on **`EanPistorius`'s** queue/retry/status table + **`RajwanYair`'s** bulk-send/scheduler/DNC design + **`smileyface12349`'s** audience filters, with an inbound webhook → household-keyed `messages` thread for two-way Q&A surfaced in admin.
- **Deploy:** systemd-managed API + nginx static docroot, `ForwardedHeaders`/trust-proxy configured for HAProxy/OPNsense + Cloudflare (`smileyface12349`), no Docker. `ZEDLABS`'s nginx.conf is the starting template.

**Which repo informs which layer:**

| Layer | Primary | Secondary |
|---|---|---|
| Static frontend shell + FAQ | `ourkk/wedding-day` | `juhonamnam` (static toggle), `Koketso1999` (scenes) |
| Gallery | `fauzialz` (masonry algo) | `Hitesh297` (image cache) |
| API structure | `sakeenah` (Node/Hono) **or** `EanPistorius` (Python/FastAPI) | `ZEDLABS` (Node/SQLite) |
| Guest/household + RSVP schema | `RajwanYair` + `elkrammer/kegger` | `Soccerbeats` (JSONB dietary), `smileyface12349` (validators) |
| Registry **claim** | `smileyface12349` | (no other real reference) |
| Auth (magic-link + admin) | `kegger` (ksuid) + `Soccerbeats` (JWT) | `Syafwan000`/`thekusuma` (token slugs) |
| Admin / export / seating | `Soccerbeats` (export + seating chart) | `ZEDLABS`, `dewanakl/undangan-api` (admin spec) |
| Twilio SMS layer | `EanPistorius` (queue) + `RajwanYair` (bulk/DNC) | `smileyface12349` (audience filters) |
| Deploy (nginx/LXC) | `ZEDLABS` (nginx.conf + systemd) | `smileyface12349` (ForwardedHeaders) |

---

## Verification — adversarial critique

I don't actually have the JSON in a file, and re-creating it via heredoc is error-prone with this much data. I have everything I need to review directly from the profiles in the prompt. Let me just do the manual count carefully by reading the data.

Counting the `fullName` entries in the raw data: smileyface12349, dewanakl/undangan-api, amirnagat, dewanakl/undangan, rampatra, MDF05, fauzialz, RajwanYair, ZEDLABS, sakeenah/mrofisr, mesinkasir, Soccerbeats, idindrakusuma/thekusuma, Hitesh297, daengdoang, juhonamnam, indiesurya, LeeKyuHyuk, Koketso1999, scanurag (non-sub), archakNath (non-sub), vinitshahdeo, NgodingSolusi, elkrammer, parta99, shyamjos, PaungPhet, danangekal, EanPistorius, RezkyRizaldi, Syafwan000, knm8643, jeyraof, ourkk, APAInsular/invited-front, APAInsular/invited-back.

That's 36 total. Non-substantive: scanurag, archakNath = 2. So **34 substantive**, not 36.

The SMS evidence: dewanakl/undangan-api notes "Code-search API calls were blocked by GitHub rate-limit" but had manifest+tree+schema. That's the one caveat worth flagging.

I have enough to write the verification note.

---

# Verification Note — Stack Research Report

## 1. Claims not supported by the profiles (errors / overreach)

**"SMS: confirmed absent in all 36 repos — every profile grepped..."** — Two errors in one sentence:
- **Count is wrong.** There are 36 *total* repos but only **34 substantive** ones. Two profiles (`scanurag/ShineOnYourDay`, `archakNath/wedding-invitation-website`) are flagged `"substantive": false`. `scanurag` is **README-only with no source code at all** — its SMS evidence field literally says *"no manifests or source files exist in the repo... none... possible to verify against code."* So SMS was **not** verified by grep in all 36; in at least one it was unverifiable by construction. Correct the claim to "absent across all 34 substantive repos; the 2 non-substantive repos have no code to grep."
- **"every profile grepped" is an overstatement.** `dewanakl/undangan-api` explicitly states *"Code-search API calls were blocked by GitHub rate-limit"* — it fell back to manifest + full tree + schema inspection (still conclusive, but not a grep/code-search). The report should not imply uniform code-search coverage.

**"Registry 'claim' mechanic exists in exactly one repo: smileyface12349."** — Mostly right but slightly overreaching. `RajwanYair` is profiled as having *"a 'mark received / thanks' tracking concept but not a guest-facing 'claim' reservation mechanic"*, and `Soccerbeats`/`MDF05` carry `registry:true` with no claim. So smileyface is the only true **reserve/claim** mechanic — accurate — but the report should say "the only guest-facing claim/reserve mechanic," not imply others have no registry concept at all. Minor; the nuance is already in the profiles.

**Everything else in the "Key findings" block checks out** against the profiles: EanPistorius commits live Let's Encrypt keys + Postgres password `Pistorius1234`; amirnagat commits live Supabase URL + anon JWT + `admin123`; ZEDLABS ships nginx.conf + PM2; smileyface is C#/Blazor; EanPistorius/RajwanYair queue+bulk-outreach are the SMS-port models. No fabrication detected.

## 2. Under-represented / missing repos & patterns

- **`Syafwan000/noshi` and `idindrakusuma/thekusuma` QR check-in pattern** — both implement a per-guest opaque token → `/ticket/{id}` magic-link → day-of QR scan. `ZEDLABS` also has a QRCode generator + InvitationManager. This is a recurring, directly-portable **per-household magic-link + day-of check-in** cluster that the summary doesn't surface. Worth its own line given Patrick wants per-household access without full accounts.
- **`PaungPhet` and `Syafwan000` "slug-as-magic-link + opened/seen status flip"** — a cheap read-receipt pattern (no auth) that complements kegger's ksuid approach. Under-represented.
- **`APAInsular/invited-front`+`invited-back`** — the only repos with a **Zod-validated RSVP schema including FoodType/DressCode enums + nested `attendants[]` plus-ones + `/confirm-attendance` endpoint**. As a *data-model* donor for plus-ones/dietary this rivals RajwanYair and should appear in the "best portable guest schema" line, not just RajwanYair + kegger.
- **`ZEDLABS`'s DB-backed key/value `config` table** (edit all copy/dates without redeploy) and `Soccerbeats`/`elkrammer`/`PaungPhet` settings-table variants — a consistent "runtime-configurable content" pattern worth a matrix row.

## 3. Stack / architecture coverage

Coverage is genuinely broad — no major gap. Architectures all represented:
- **C#/Blazor**: smileyface12349 (1, the feature leader)
- **PHP/Laravel/CMS**: undangan-api, mesinkasir, indiesurya, PaungPhet, Syafwan000, invited-back (6) — well covered
- **Astro/SSG**: ZEDLABS, ourkk + Next/Gatsby SSG (LeeKyuHyuk, Koketso1999, idindrakusuma) — covered
- **Supabase/Firebase BaaS**: amirnagat, RajwanYair, parta99, MDF05, knm8643 — covered
- **Vue/Nuxt**: MDF05, RezkyRizaldi, danangekal, knm8643, parta99 — covered
- **Go backends**: juhonamnam (companion), elkrammer — covered
- **Node+SQLite / Node+Postgres / Python+Postgres**: ZEDLABS, Soccerbeats, sakeenah, EanPistorius — the on-target stacks, covered

One thing worth noting explicitly: **no Python-stack repo has structured RSVP+registry** (EanPistorius is RSVP-only, no registry/claim/plus-ones). If the report implies a Python reference covers the data model, that's a gap — the rich schemas all live in C#/Postgres-SQL/Go/PHP repos. Confirm the report's §7 mapping doesn't overstate EanPistorius's coverage.

## 4. Is "SMS: none found" safe?

**Yes, safe.** The evidence fields are consistent and method-diverse: dependency-manifest grep + full recursive file-tree inspection + schema/column inspection, repeated across all 34. The dominant pattern (WhatsApp `wa.me` deep-links, Telegram Bot, EmailJS, SendGrid/Resend email) is well-explained as the *reason* SMS is absent — not a blind spot. The one method-caveat (`undangan-api` GitHub rate-limit) is compensated by tree+schema inspection. Conclusion holds; just stop claiming a uniform grep was run everywhere.

## 5. Mis-calibrated forkSuitability scores

- **`RajwanYair` = 3 looks low given its actual value to us.** Its `001_create_tables.sql` is described as *"excellent and nearly drop-in for Postgres/SQLite"* with the most complete guest schema surveyed (status/side/meal/dietary/accessibility/transport/plus-ones), PLUS the `waba-bulk-send`/scheduler/**DNC** bulk-outreach design that the report itself names as the #1 SMS-layer model. As a *pattern/data-model donor* — which is explicitly how we're using everything — it arguably deserves **4**, on par with ZEDLABS/Soccerbeats. The "3" reflects "bad direct fork," but the report's own thesis is that nothing is a direct fork. Flag the rubric inconsistency.
- **`smileyface12349` = 4 is defensible but is effectively our #1 reference** (only registry-claim + richest RSVP/email-blast/household design). If the matrix sorts by score, ensure it isn't ranked below same-scored Node repos — it's the single most important *design* donor despite the C# mismatch.
- **`EanPistorius` = 3** is fair, but pair it with the caveat that it has *no registry and no structured RSVP* — don't let the "Python/on-target-stack" halo overrate it as a data-model source.
- Low scores (1–2) for the static/brochure/EOL repos all look correctly calibrated.

## 6. Concrete next probes (top 2 repos)

**`smileyface12349/wedding-website` (design/data-model leader):**
1. Read the registry models — `RegistryItem.cs` + `RegistryItemClaim.cs` (and the EF migration that defines them) to extract the exact state machine (Available→Pending→Claimed→Completed→Received) and FK/quantity constraints for our claim table.
2. Read the RSVP schema — `RsvpDataColumn`/question-type definitions and the **server-side Validator delegate** (the "vegan auto-implies vegetarian+dairy-free, block chicken if vegetarian" logic) — this is the dietary-dependency logic we'd otherwise reinvent.
3. Read the email-blast layer — `EmailVariable` + `EmailFilters` (RsvpStatusFilter/NumGuestsFilter) + `MailKitEmailSender.cs`; this is the audience-filtering design to lift straight onto the Twilio SMS targeting layer.
4. Read `Account`/`Guest` (household) model + `AccountLog`/`HasLoggedIn` for the per-household + activity-tracking shape.

**`RajwanYair/Wedding` (schema + SMS-pattern leader):**
5. Read `supabase/migrations/001_create_tables.sql` (full guest schema) plus the soft-delete/audit/event-scoping migrations (004, 009/015, 018) for the schema-evolution template.
6. Read `supabase/functions/waba-bulk-send` + `whatsapp-scheduler` + `whatsapp-dnc` + `wa-messaging.js` — the batch/rate-limit(30/invocation)/templating/**DNC list**/per-recipient result-tracking design that maps ~1:1 onto our Twilio queue. Cross-reference `EanPistorius`'s `email` table (status/retry_count/error/sent_at + polling worker) for the persistence half.

*(Note: I verified these claims against the provided profile text only; I did not have repo access to confirm the profiles themselves are accurate to the source code.)*


## Appendix — all 36 repos by fork-suitability (from profile data)

| fit | pattern | repo | SMS | one-line: what to steal |
|---|---|---|---|---|
| 4 | fullstack-monolith | smileyface12349/wedding-website | ✗ | 1) The registry claim data model: RegistryItem (MaxQuantity, Priority, multiple PurchaseMethods, AllowBringOnDay/DeliverToUs/MoneyTransfer flags) + Re |
| 4 | fullstack-monolith | ZEDLABS-TEKNOLOGI-INDONESIA/wedding-invitation | ✗ | (1) The whole DB-backed config pattern: a key/value `config` table seeded with DEFAULT_CONFIG + getConfig/setConfig + admin-only /api/config/full — le |
| 4 | fullstack-monolith | Soccerbeats/weddingwebsite | ✗ | 1) DATA MODELS: the guest_list schema (party_size, side, party_members JSONB, rsvp_status, plus_one_name, invited) and the rsvps table with dietary_re |
| 3 | SPA+BaaS(Firebase/Supabase) | RajwanYair/Wedding | ✗ | 1) The GUEST DATA MODEL is excellent and nearly drop-in for Postgres/SQLite: supabase/migrations/001_create_tables.sql — guests table with status(pend |
| 3 | headless-api+spa | sakeenah-wedding/template (upstream: mrofisr/sakeenah) | ✗ | Backend architecture worth copying nearly verbatim: the feature-folder Hono layout (routes + Zod schema + spec per feature), Zod-validated params/quer |
| 3 | headless-api+spa | EanPistorius/pist | ✗ | 1) The backend layering: models / schemas / repositories / services / workers separation in FastAPI - clean template to extend our richer RSVP+registr |
| 2 | headless-api+spa | dewanakl/undangan-api | ✗ | Concrete, language-agnostic patterns worth borrowing: (1) The middleware stack in app/Middleware — RateLimitMiddleware, CsrfMiddleware, CorsMiddleware |
| 2 | SPA+BaaS(Firebase/Supabase) | amirnagat/-wedding-rsvp | ✗ | A few small patterns worth a glance, not code to lift: (1) the minimal RSVP data shape and the Supabase RLS policy idea (anon insert/select) as a star |
| 2 | headless-api+spa | dewanakl/undangan | ✗ | 1) The `js/connection/request.js` fluent fetch wrapper is genuinely nice: chainable .withCache(ttl)/.withForceCache/.withRetry(exponential backoff)/.w |
| 2 | static+google-sheets | rampatra/wedding-website | ✗ | (1) The 'submit RSVP to a serverless endpoint from a static page' pattern — swap Google Apps Script for our own Node/Python API on the LXC. (2) The ad |
| 2 | SPA+BaaS(Firebase/Supabase) | MDF05/wedding-invitation-1 | ✗ | 1) Personalized-link guest pattern: CSV with id/name/slug/type/pax + a Pinia guestStore that fetches the CSV, matches the guest by slug/name and gates |
| 2 | static+google-sheets | fauzialz/amifauzi.com-open | ✗ | Concrete reusable pieces (all frontend, framework-agnostic React/TS): (1) the masonry Gallery in app/components/Gallery — a real justified-layout algo |
| 2 | SSG(Astro/Next/Gatsby/Nuxt) | idindrakusuma/thekusuma | ✗ | 1) The guest data model: api/guest-data.json rows of {code, name, desc, shift, isAttended, updatedBy, isExchanged, exchangedAt, exchangedBy} — a clean |
| 2 | SPA+BaaS(Firebase/Supabase) | Hitesh297/react-portfolio | ✗ | Three self-contained, framework-light component patterns worth a look as references (not wholesale): (1) CountDownTimer.jsx — simple wedding countdown |
| 2 | static-invitation | daengdoang/simple-wedding-invitation | ✗ | Section composition/IA for a one-pager invite (hero with names+date, countdown-to-D-day, ceremony/reception time-and-place blocks, gallery, divider-fl |
| 2 | SPA+BaaS(Firebase/Supabase) | juhonamnam/wedding-invitation | ✗ | 1) The STATIC_ONLY env pattern (src/env.ts) — gracefully degrade to a static archive (offlineGuestBook.json) when no backend is present; good for a pu |
| 2 | SSG(Astro/Next/Gatsby/Nuxt) | Koketso1999/our-day | ✗ | Concrete borrowable patterns (not data models — it has none): (1) the story/scene navigation engine — WeddingStory.tsx orchestrating swipe/tap/hold/au |
| 2 | static-invitation | NgodingSolusi/the-wedding-of-rehan-maulidan | ✗ | Mostly aesthetic/UX inspiration, not code: (1) the SVG floral corner-decoration system (images/background/flowers/*.svg positioned per corner) and wav |
| 2 | headless-api+spa | elkrammer/kegger | ✗ | Data model and RSVP flow are the real value. Schema: parties (household) 1->N guests with FK cascade; guest carries first/last, email, plus_one bool,  |
| 2 | SPA+BaaS(Firebase/Supabase) | parta99/pawiwahan | ✗ | Three small ideas worth borrowing, not code: (1) the per-guest URL personalization pattern — a ?to=Guest%20Name query param that renders the invitee's |
| 2 | static-invitation | shyamjos/wedding-website | ✗ | The simplyCountdown/clock.js timezone-aware countdown pattern (moment.tz target date) for our save-the-date hero. The Magnific Popup gallery lightbox  |
| 2 | fullstack-monolith | PaungPhet/PaungPhet | ✗ | Three concrete, framework-agnostic ideas worth borrowing as patterns (not code, given the license): (1) Per-guest personalized invite via unguessable  |
| 2 | SPA+BaaS(Firebase/Supabase) | RezkyRizaldi/wedding-rudi-shella | ✗ | (1) The Nitro server-route + Prisma pattern (server/api/wish.get.ts aggregates counts: total, totalAttend, totalMiss in one endpoint) is a clean minim |
| 2 | fullstack-monolith | Syafwan000/noshi-wedding-invitation | ✗ | Two concrete ideas: (1) The per-guest invitation-ticket pattern: each guest gets a unique opaque `identifier` (slug/token) used as a public URL `/tick |
| 2 | SPA+BaaS(Firebase/Supabase) | knm8643/wedding-public | ✗ | Frontend interaction patterns only: (1) IntersectionObserver-driven scroll-reveal animations (used across components like GiftOrigin) — clean, depende |
| 2 | static-invitation | jeyraof/rosy.day | ✗ | Frontend/UX patterns only: (1) the lazy-image pattern — img uses a placeholder with data-src + data-ratio so layout reserves aspect-ratio space before |
| 2 | SSG(Astro/Next/Gatsby/Nuxt) | ourkk/wedding-day | ✗ | Borrow the Astro component decomposition (Hero, Invitation, ScheduleSection, VenueSection, GalleryHead, FAQSection, ThemeSection, Footer) as a clean l |
| 2 | headless-api+spa | APAInsular/invited-front | ✗ | Concrete borrowables: (1) The Zod WeddingSchema (src/schemas/WeddingSchema.js) — a clean data model for couple names, wedding date (with future-date r |
| 2 | headless-api+spa | APAInsular/invited-back | ✗ | Borrow the relational data model, not the code: User(couple)->hasMany Wedding; Wedding hasMany Guest; Guest hasMany Attendant is a clean way to model  |
| 1 | wordpress/cms | mesinkasir/weddingonline | ✗ | Essentially nothing technical. At most: (1) the page inventory as a content checklist — Acara (event/schedule), Gift, Map, Chat/contact, Welcome — con |
| 1 | fullstack-monolith | indiesurya/wedding-invitation-app | ✗ | Only loose conceptual cues, no code: (1) the admin-CMS decomposition into per-section content models (Banner, Story, Event, Gallery, Location, Countdo |
| 1 | SSG(Astro/Next/Gatsby/Nuxt) | LeeKyuHyuk/wedding-invitation | ✗ | Very little of substance. (1) The typed content-config pattern: a single src/data.json validated by a src/types.ts Data type drives all page content — |
| 1 | other | scanurag/ShineOnYourDay | ✗ | (not substantive: A README-only showcase repo for "Vow Venue," a marriage-hall/banquet booking pla) |
| 1 | static-invitation | archakNath/wedding-invitation-website | ✗ | (not substantive: A single-page static HTML/CSS/JS wedding invitation template (a Wix-template clo) |
| 1 | static-invitation | vinitshahdeo/Wedding-Invitation | ✗ | Essentially nothing substantive. The only mildly reusable snippets are trivial and better written from scratch: (1) the vanilla-JS setInterval countdo |
| 1 | static-invitation | danangekal/wedding-invitation | ✗ | Almost nothing load-bearing. At most: (1) the section breakdown/IA as a checklist of brochure sections (Home/hero, Profile/couple, Story timeline, Gal |
