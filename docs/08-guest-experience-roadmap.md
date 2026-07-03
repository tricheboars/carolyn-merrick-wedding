# 08 — Guest-Experience Roadmap

Captured 2026-07-01 from Patrick's idea list. These are the post-audit to-dos for making
the site genuinely useful to guests, in rough priority order. Wedding day is
**Saturday, August 14, 2027** at The Harpswell Inn.

House rule that applies to everything below: **all guest-facing data gets verified
against primary sources and linked to the official site** (venue page, ticket page,
restaurant page). No unverified facts on the live site. And every researched dataset is
**backed as markdown in `docs/`** (see item 8) so `web/src/_data/site.js` is rebuilt
from a reviewed source of truth, not from memory.

---

## 1. Live-music concert calendar (research + visual calendar)

A browsable calendar of concerts and live music for the wedding window:
**Aug 7 to Aug 21, 2027**, deliberately showing **nothing on Aug 14** (that day is taken).

- Coverage: Portland (State Theatre, Thompson Point, Merrill Auditorium, Portland House
  of Music, Aura), Brunswick, Bath, and really anywhere in Maine with live music worth
  the drive. Include local/bar bands, not just ticketed venues.
- Sources: venue calendars first (primary source), then aggregators (JamBase,
  Bandsintown, Portland Press Herald listings) for discovery. Every event links to the
  venue page and the ticket page.
- Presentation: a visual calendar view, not a list dump.
- **Timing constraint:** venues generally announce shows 2 to 6 months out, so almost
  nothing for Aug 2027 is bookable yet. Build the calendar UI + data format now with
  placeholder/sample data, run the real research sweep in **spring 2027**, and re-verify
  every listing before the site points guests at it.

## 2. Restaurant guide (the couple's picks)

Restaurants Carolyn + Merrick actually like, each linked to its official site.

- Featured areas: **Maine Street in Brunswick** and **Portland**; Harpswell-local spots
  welcome too.
- Needs from the couple: their list. Then verify each is still open, link site + menu +
  reservation page, note distance from the Inn.

## 3. Better mobile version (in flight)

The 2026-07-01 mobile audit (this session) produced a verified punch list; apply the
fixes and re-verify on device widths. Findings live in the WORKLOG entry and the audit
report. Biggest themes: image weight (multi-MB pages on cellular), the eyebrow-label
contrast bug on every blue header band, schedule timeline wrapping, RSVP form tap
targets and mobile keyboard behavior, nav height on small phones.

## 4. Calendar views + guest-added events

Several calendar views (month, week, agenda/list), including one where **guests can add
their own events** (arrival plans, group dinners, boat trips) so others can see who is
going and join in.

- Depends on the **guest accounts layer** (already planned alongside SMS).
- **Privacy rule:** guest-added plans are visible to signed-in guests only, never on the
  public site. A public "who is away from home on which dates" board is the one feature
  on this list that would be a real privacy mistake (see item 10).

## 5. Icons + link previews (app-quality polish)

Current state (verified in `web/src/_includes/layouts/base.njk`): SVG favicon and
`og:title/og:description/og:url` exist; **`og:image` is missing** (so Slack, WhatsApp,
iMessage unfurl with no photo) and there is **no apple-touch-icon / PNG fallback / web
manifest** (so saving to a phone home screen gets a generic icon).

- Add: `og:image` (wide engagement photo, ~1200x630), `og:type`, Twitter card tags,
  per-page overrides where it matters (RSVP, Schedule).
- Add: `apple-touch-icon` (180px PNG of the C&M monogram), PNG favicon fallbacks,
  optionally a minimal `site.webmanifest` with maskable icons.

## 6. Getting around: Uber, Lyft, and Maine reality

Honest transport guidance for guests, because rideshare in Maine is not like a city:

- Portland: Uber/Lyft generally fine. Brunswick/Bath: thin. **Harpswell/Lookout Point:
  assume no rideshare on demand**, especially late at night; you can get dropped off and
  then have no ride home.
- Publish: local cab companies with phone numbers (verified), advice to schedule pickups
  ahead, hotel shuttle options if any, and a designated-driver nudge for the reception.
- All of it verified before publishing (call/check each cab company, spring 2027).

## 7. Data accuracy + linking pass

Site-wide sweep: verify every fact currently on the site (addresses, distances, times,
names), and make every restaurant, event, venue, and attraction a direct link to its
official page (site, tickets, menu, maps). No dead ends, no "google it yourself".

## 8. Research data backed as markdown in `docs/`

Every researched dataset (concerts, restaurants, transport, lodging) lives as a
reviewed markdown file under `docs/` (e.g. `docs/data-concerts.md`,
`docs/data-restaurants.md`) with source links and a verified-on date. The site's
`web/src/_data/site.js` is generated/updated from those files, never the other way
around. This keeps the site rebuildable and the facts auditable.

## 9. Copy pass: human voice

Sweep all site copy for AI-sounding language and typographic tells, **em dashes
especially**. Plain, warm, couple's-voice copy: short sentences, no "nestled",
"stunning", "delve", "elevate" filler, no em-dash asides. This applies to all future
copy too, not just a one-time cleanup.

## 10. Privacy posture (Carolyn's question)

Assessment as of 2026-07-01. Short version: **what the site publishes today is normal
wedding-site exposure and fine; the care needs to go into the upcoming features.**

Public today: the couple's names, the date, venue name/address, engagement photos, a
times-TBA schedule. That is exactly what the printed save-the-dates broadcast anyway,
and it is the standard trade-off every wedding site makes.

Ranked honestly:

1. **Guest PII is the crown jewel, and it is already handled right.** RSVP data (names,
   contact, meals, notes) stays server-side behind an admin token; the June audit
   confirmed the repo and site leak none of it. The future SMS layer adds phone numbers:
   same discipline, plus a plan to purge the DB after the wedding.
2. **The guest-added calendar is the biggest new surface.** It would publish who is away
   from home on which dates. Gate it behind guest accounts/invite code; never public.
3. **Registry handles (when they land).** Public Venmo/PayPal handles invite scam
   requests and, on Venmo, expose the friends list unless the account is set to private.
   Recommend: set Venmo privacy to private before publishing the handle, and warn the
   couple about lookalike payment-request scams.
4. **The empty-house signal.** The site announces where the couple and family will be on
   Aug 14, 2027. Modest risk since no home addresses appear anywhere; keep it that way
   (no home towns beyond what is public, no "we live in X" copy).
5. **Scraping/indexing.** Prod is indexable; expect wedding-vendor spam and archive
   copies of the photos (Wayback, image search) that persist forever. If the couple
   wants the pretty landing public but the logistics private, the standard middle ground
   is a **shared passcode printed on the invitation** gating schedule detail, lodging
   blocks, and the gallery. Cheap to add; decide before the invitations print.
6. **RSVP endpoint abuse.** The POST endpoint is public; rate-limit it (HAProxy or
   Fastify) and consider a honeypot field so pranksters/bots can't flood fake RSVPs.

Decision for Carolyn: keep names/date/venue public (it is on paper already), keep guest
data server-side (already true), gate anything that reveals guest movements or payment
handles, and pick public-vs-passcode for schedule detail + gallery before invitations.

---

## Dependencies / sequencing

- Items 5, 7, 9 are cheap and independent: do them with the mobile-audit fixes.
- Item 2 blocks on the couple's restaurant list; item 1's research blocks on venues
  announcing (spring 2027); both need the item 8 data-file convention first.
- Item 4 blocks on the accounts layer (planned with SMS).
- Item 10 needs a decision from Carolyn on the passcode-gate question.
