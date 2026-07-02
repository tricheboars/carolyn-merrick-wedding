# 09 — Mobile/Responsive Audit (2026-07-01)

**Method.** 50-agent workflow against live `https://merrolyn.com`: 14 auditors (one per
page at 320px + 390px, headless-Chromium screenshots read slice by slice, plus four
specialists: shared nav/chrome, static CSS, image weight, RSVP form UX), then one
adversarial verifier per finding, instructed to refute and to reproduce every number
independently (own screenshots, CDP measurements, `curl`/`magick` checks against source).
Result: **35 raw findings → 34 confirmed, 1 plausible** (its verifier died on a rate
limit; the mechanism was confirmed in source afterward), **0 refuted**. Verifiers
adjusted several severities and corrected four suggested fixes that would not have
worked as written (CSS-cascade and sizing gotchas, noted below). Read-only audit:
nothing was changed or deployed, and no test RSVPs were written to prod.

**Bottom line.** Nothing is broken-broken: every page renders single-column, nothing
overflows horizontally at 320px, text over photos stays legible thanks to the tints,
and the viewport meta is correct. The real issues are (1) stale prototype copy and
missing guards on the RSVP form, (2) a handful of site-wide CSS papercuts (one contrast
bug repeated on five pages, nav height/tap targets, schedule timeline), and (3) image
weight: multi-MB pages on cellular because every photo ships at desktop resolution.

All file references below are relative to the repo root. After any fix: rebuild per env
and redeploy both containers per `deploy/README.md`.

---

## P1 — RSVP correctness (do these first)

### 1. Live success message tells guests their RSVP was "not yet saved" (medium)
Prod `web/src/rsvp.njk` line 78 renders: *"Your reply was captured by the prototype
(not yet saved)."* The API **does** save. Line 72's note mentions "the static preview".
Both are leftovers from the pre-API prototype, live on merrolyn.com today.
**Fix:** rewrite line 78 to real copy (e.g. "Your RSVP is saved. Thank you!"), do not
promise a confirmation text until Twilio ships; trim line 72 to "Your reply goes
straight to the couple's guest list." (or gate the dev warning behind the existing
`SITE_DOMAIN` branch in `web/src/_data/site.js`). While in there, the error copy on
line ~70 starts "Hmm —": rewrite per the no-em-dash copy rule.

### 2. Attending radios have no `required` (medium)
Skipping "Will you join us?" submits, gets a real HTTP 400, and shows the guest the
*misleading* "couldn't reach the server" network error. Native validation fires before
Alpine's `@submit.prevent` (verified), so the fix is markup-only.
**Fix:** add `required` to both radios in `web/src/rsvp.njk` lines 35-36. Optionally
split the handler's catch: `!r.ok` → "please check your answers", reserve the network
copy for a thrown fetch.

### 3. Alpine loads only from the jsdelivr CDN; if it fails, Send silently discards the RSVP (low, data-loss)
With Alpine absent, the button does a native GET, reloading the page and wiping the
form.
**Fix:** self-host: `curl -o web/src/assets/js/alpine.min.js
https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js` (passthrough copy already
covers `src/assets`), point `web/src/_includes/layouts/base.njk` line 19 at
`/assets/js/alpine.min.js` with the same cache-bust pattern as the CSS, and add
`onsubmit="return false"` to the form tag (`rsvp.njk` line 16) as a pre-Alpine guard.
Do NOT use `action="#"` (still navigates). Tabler icons CSS on line 16 is the same CDN
but fails cosmetically only.

### 4. PLAUSIBLE: success confirmation can land off-screen after submit (unverified live)
`x-show="!sent"` swaps the tall form for a short success block; the page height
collapses and scroll clamps toward the footer on small phones. Mechanism confirmed in
source; not reproduced live because that would write a fake RSVP to the prod DB.
**Fix (cheap, defensive):** on success, scroll to the confirmation
(`$nextTick(() => el.scrollIntoView())` or `window.scrollTo(0,0)`).

### 5. Contact field fights mobile keyboards (medium)
`#contact` ("Email or mobile") is bare `type="text"`: no autocomplete, autocapitalize
on, autocorrect mangling emails.
**Fix:** `web/src/rsvp.njk` line 30: add `autocapitalize="none" autocorrect="off"
spellcheck="false" autocomplete="email"` (pragmatic single-field choice); line 25: add
`autocomplete="name"` to the name input. Long-term: split email/tel fields (needs a
matching `api/` payload change).

---

## P2 — Site-wide CSS papercuts (one session, one stylesheet)

### 6. Eyebrow labels invisible on every blue header band (medium; 5 findings collapsed)
`.eyebrow` is terracotta `#B26A3C` on the `#6E8FA3` band: **1.22:1 contrast** (needs
4.5:1). Hits `/rsvp/` ("Kindly reply"), `/travel/`, `/stay/`, `/credits/`,
`/schedule/`. A cream override exists only for `.section--scene`.
**Fix (one line):** next to `style.css:187` add
`.section--olive .eyebrow{ color:var(--cream); }` at **full opacity**. Verifiers
proved the tempting `opacity:.85` variant wastes contrast (2.78:1 vs 3.23:1, the max
any light color reaches on this band; strict AA would need a darker band or a
bigger/bolder label, a separate design call).

### 7. Sticky stacked nav eats 21-31% of small phones; worst on the RSVP form (medium; 3 findings)
Header is ~178px tall at 320px (~147px at 390px) and stays pinned; with the keyboard
open on `/rsvp/`, ~130px of form remains visible.
**Fix (minimal, verified):** in the existing `@media (max-width:680px)` block
(`style.css:199-202`) add `position:static;` to `.nav` so it scrolls away. Better UX
later: Alpine hamburger in `web/src/_includes/partials/nav.njk` keeping a single ~56px
sticky row (monogram + toggle + RSVP pill); Alpine is already on every page.

### 8. Nav tap targets ~34px with 10-12px gaps (medium; 2 findings)
Anchors are `display:inline`, so padding alone will not fix it (verifier caught this).
**Fix:** in the 680px block: `.nav__links a{ display:inline-block; padding:10px 12px;
font-size:.9rem; }` and tighten `.nav__links{ gap:8px 4px; }` → rows compute to
~44-45px.

### 9. No active-page indicator in the nav (low)
Eight identical uppercase links; guests cannot tell which page they are on.
**Fix:** `nav.njk` line 7: add `{% if item.url == page.url %} aria-current="page"
{% endif %}` (URLs verified to match Eleventy's `page.url` exactly), then
`.nav__links a[aria-current="page"]{ border-color:var(--cream); opacity:1; }` after
the hover rule (`style.css:96`), piggybacking on the existing transparent
border-bottom.

### 10. Nav RSVP CTA pill missing its bottom border (low)
The primary CTA looks clipped at every width (specificity/`!important` casualty).
**Fix:** replace `.nav__cta{...}` (`style.css:97-100`) with
`.nav__links a.nav__cta{ border:1.5px solid var(--cream); border-radius:var(--radius);
padding:7px 16px; }`, dropping both `!important`s (specificity checked, hover
preserved).

### 11. Schedule timeline: faint 12.5px day labels, "SAT, AUG" / orphaned "14" wrap in every row (medium; 2 findings)
The only which-day indicator across a Fri-Sun weekend is the smallest, faintest text on
the page (2.64:1) and wraps badly in the 90px mobile column.
**Fix:** `style.css:150` `.timeline .d` → `font-size:.9rem; letter-spacing:.08em;
opacity:1;` and in the 680px block widen to `grid-template-columns:100px 1fr` +
`.timeline .d{ white-space:nowrap; }` (both measured to fit together comfortably).

### 12. Attending radio rows: 29px tall, 13px circles, dead gap between opposite answers (low; 2 findings)
**Fix:** `style.css:170-171`: swap `margin:8px 0` for `padding:8px 0; margin:0`
(whole ~45px row clickable, gap gone) and size the input `width:20px; height:20px`
(the existing `width:auto` must be replaced in place; a lower-specificity rule loses).

### 13. `.note` fine print renders 14.7px (low)
Below the 16px mobile floor; carries real info (times may change; also styles the RSVP
status/error messages).
**Fix:** `style.css:172`: `.92rem` → `1rem`. (Verifier note: the suggested
`max(1rem,.92rem)` is dead code, just use `1rem`; still reads smaller than the 17px
body.)

### 14. "Open in Maps", the travel page's only content action, is 21px tall (low)
**Fix:** `web/src/travel.njk` line 34: use the existing button styles, but the
`btn--ink` variant (bare `.btn` is cream-on-cream on the card and near-invisible;
verifier caught it): `<a class="btn btn--ink" href="...">Open in Maps →</a>` → ~48px
target.

### 15. Venmo card icon is blank: `ti-brand-venmo` does not exist in Tabler v3 (low)
**Fix:** `web/src/_data/site.js` line 104: use a glyph verified present in the exact
CDN CSS (`ti-cash`, `ti-brand-cashapp`, `ti-currency-dollar`), or inline a Venmo SVG in
`registry.njk` line 21. House rule going forward: check any new `ti-brand-*` name
against the CDN CSS first.

---

## P3 — Image weight (one asset-pipeline session; ~7 findings collapsed)

Every photo ships at desktop resolution to phones. Measured on live prod: home
**~990KB** of eager CSS-background JPEGs (hero-couple.jpg 604KB/2400px +
south-harpswell-pano.jpg 385KB, which cannot lazy-load as a CSS background even
below the fold, verified via net-log); story-couple.jpg 457KB/2200px (~8x the needed
pixels at 390px); cribstone-bridge.jpg 437KB/2600x645, which also center-crops to
abstract granite on portrait (the bridge is unrecognizable); gallery **~3.2MB** of
1000-1500px originals rendered into ~168px cells (Cloudflare is NOT converting formats;
verified with browser Accept headers). No srcset, no preload, no mobile variants
anywhere.

### 16. Scene/hero backgrounds: generate mobile variants + media-query var overrides
Recipes verified by the agents (sizes measured):
- `magick hero-couple.jpg -gravity center -crop 1600x1600+0+0 +repage -resize 1000x1000
  -quality 72 -strip hero-couple-mobile.jpg` — **portrait-leaning crop, not a plain
  downscale**: `.hero` is `min-height:86vh` + `cover`, so height constrains (~780x1452
  device px at 390@2x). ~100-150KB.
- `magick south-harpswell-pano.jpg -resize 1300x -quality 75 south-harpswell-pano-m.jpg`
  (~100KB); `magick story-couple.jpg -resize 900x -quality 78 story-couple-900.jpg`
  (measured 85KB, an 82% saving); cribstone: crop framed on the bridge span, then
  `-resize 800x -quality 72` (add new files to `assets/img/CREDITS.md`).
  `casco-bay.jpg` (117KB) needs nothing.
- Wire-up: add to (or alongside) the 680px block:
  `@media (max-width:680px){ :root{ --hero-photo:url(...mobile.jpg);
  --scene-harbor:url(...); --scene-lighthouse:url(...); --scene-story:url(...); } }`.
  Registry's banner reuses `--hero-photo`, so it comes along free.
- **Cascade gotcha (verifier-caught):** `/story/` and `/gallery/` set
  `--scene:url(...)` in an **inline style**, which beats any stylesheet override.
  Move it to a var reference first: define `--scene-story` next to the others in
  `:root`, and change those two templates' line 6 to `style="--scene:var(--scene-story)"`
  (schedule/travel already use vars and need no edit).
- LCP: add media-scoped preloads in `base.njk` head (before the stylesheet link):
  `<link rel="preload" as="image" href="/assets/img/hero-couple-mobile.jpg"
  media="(max-width:680px)">` + the desktop twin. Recompressing the 2200px story
  original in place is NOT worth it (q78 saves only 2%; downsize dimensions instead).

### 17. Gallery: srcset + real width/height attributes
- Variants: `for g in web/src/assets/img/gallery/g*.jpg`: `-resize 400x` → `-400.jpg`,
  `-resize 800x` → `-800.jpg` (or adopt `@11ty/eleventy-img`; site is 11ty v3).
- `gallery.njk` line 18: `src="...-800.jpg"` + `srcset="...-400.jpg 400w, ...-800.jpg
  800w, {{ p.src }} 1500w"` + `sizes="(max-width:560px) 45vw, 260px"` (matched to the
  measured 168px cells; keep the `<a href>` full-res original as the tap-through).
  Cuts a full gallery scroll from ~3.2MB to roughly 500-700KB on a 2x phone.
- Stop the masonry column-jumping during lazy-load: add real intrinsic dims to each
  entry in `site.js:86-99` and emit `width`/`height` on the img. Verified dims:
  g01 1500x995, g02 1200x1500, g03 995x1500, g04 1500x995, g05 995x1500, g06 995x1500,
  g07-g12 1000x1500. No CSS change needed (`width:100%;height:auto` makes them an
  aspect-ratio hint). Do not use one uniform ratio; it is wrong for 10 of 12 photos.

---

## What's solid

No horizontal overflow at 320px on any page, correct viewport meta, single-column
layouts that fundamentally work, legible text over every photo band, working
RSVP → API → CSV path, and license-clean images. Zero of the 35 findings were refuted:
the site is healthy, it just needs a copy fix, a CSS papercut session, and an image
diet before guests start opening it on phones. Fix order: P1 (an evening), P2 (an
evening), P3 (a lazy Saturday with `magick`).
