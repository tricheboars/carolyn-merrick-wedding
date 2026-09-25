# Data: Ground transport (guest guidance)

Source of truth for the Travel page's "Getting around" section
(`web/src/_data/site.js` → `gettingAround`). **Verified 2026-07-02.**
**Re-verify every phone number ~July 2027** (small Maine cab companies fold; one dead
domain was found during this research).

## The rideshare reality (all primary-source verified)

- **Portland (+ PWM Jetport):** Uber/Lyft genuinely work. Official PWM pickup, in-app
  reservations up to 90 days ahead. Sources: Uber's Portland ME city page, Visit
  Portland transportation page, PWM ground-transportation page.
- **Brunswick / Bath:** officially covered, daytime OK, evenings thin. Bangor Daily
  News (2024-10-22) documented zero Ubers/Lyfts in downtown Brunswick at midnight and
  a taxi unreachable in ten calls; region described as a public-transit desert.
- **Harpswell peninsula:** effectively nothing. The town's transportation page lists
  only a residents-only volunteer ride network (3 business days notice). Harpswell is
  absent from Uber's Maine city list. A recent real wedding at The Harpswell Inn
  (herestotheharpers.com/travel) told guests Uber/Lyft are "not reliable options" and
  chartered a shuttle from the Fairfield in Brunswick.
- **The classic failure mode, confirmed:** you can get a ride TO the venue (a
  Brunswick/Portland driver takes the fare out), but no drivers are staged on the
  peninsula at night, so the ride home is the one that fails.

## On the site (verified operators)

| Name | Phone | Link | Notes |
|---|---|---|---|
| Brunswick Taxi | (207) 729-3688 | yelp.com/biz/brunswick-taxi-brunswick | The anchor. Family run since 1990, 1 Simpsons Point Rd. Covers Harpswell; 24h airport runs by arrangement; ~5:30am-1am daily, 2am Fri/Sat. No official site; verified via Amtrak Downeaster station page + Bowdoin transportation page + Yelp (June 2026) + FMCSA DOT 3288598. |
| Maine Limousine Service | 1-800-646-0068 | mainelimo.com | Prebooked private car/SUV; PWM transfers; **does wedding/group charters**. 25+ years, Scarborough. |
| Amtrak Downeaster | 1-800-USA-RAIL | amtrakdowneaster.com/stations/brunswick/ | Boston North Station → Brunswick (northern terminus), 5 round trips daily, ~3.5h; station at 16 Station Ave. Logan arrivals must cross Boston to North Station. |

## Backups (docs only, NOT on the site)

- **Ship City Taxi**, Bath, (207) 389-4235 — *unverified* (no official site; consistent
  across Yelp/YellowPages but 2026 operation unconfirmed). Call before recommending.
- **Maine Street Taxi**, Brunswick, (207) 449-8990 — *unverified*: its domain
  mainestreettaxi.com is DEAD on public DNS (checked 2026-07-02) though May 2026 Yelp
  reviews suggest it operates. Daytime only (8-8). Call to confirm before publishing.
- **HI5 LLC**, (207) 370-2323 — verified operating (24/7, dispatches from Biddeford)
  but mixed reviews; treat as last resort.
- **Concord Coach Lines** — 1 daily round trip stopping Brunswick + Bath, connects
  Logan/South Station (schedule effective 2026-05-31).
- **Metro BREEZ** — Portland↔Brunswick express bus, 6 Saturday round trips; leaves
  from Portland proper, not the Jetport.
- **Brunswick Link** (ex-"Brunswick Explorer") — weekdays only; useless for a Saturday
  wedding; leave off the site.
- **No Brunswick hotel runs an airport shuttle** (Fairfield Brunswick has none; the
  Hampton "Freeport/Brunswick" is in Freeport and only shuttles Freeport village).

## FOR THE COUPLE (decision)

Strongly consider a **chartered guest shuttle** for the reception end-of-night
(Brunswick hotel block ↔ the inn). Precedent: the last couple married at this venue
ran one (Fairfield ↔ venue). Maine Limousine Service does group charters. This
removes the whole no-ride-home problem in one stroke.


## Guest parking + shuttle stops (updated 2026-09-24)

Source: Mary Moore in the family chat, relayed by Patrick: "the shuttle will stop at
the Fairfield and the Hilton Spark and the Brunswick Hotel. Also, the new parking
site area will be at the Grange parking lot on 123, right past the corner market on
123 ... past Mountain Road ... but on the left." Replaces High Head Yacht Club.

- **Lot = Merriconeag Grange #425, 529 Harpswell Neck Rd (Route 123), North
  Harpswell.** 1918 hall, on the National Register since 2018 (Maine Historic
  Preservation Commission listing; Press Herald 2019-12-27). OSM way 1100682509.
- **Directions check (OSM geometry):** Route 123 runs NE→SW here. Mountain Road
  leaves 123 eastward at ~43.8233,-69.9639; the "corner market" at that corner is the
  **Vegetable Corner** grocery (OSM node 4962254721). The Grange sits ~150 m further
  south on the EAST side of 123, i.e. on the LEFT heading south from Brunswick. The
  venue turnoff (Lookout Point Rd) is ~2.5 mi further south.
- **Pin = 43.82181, -69.96522**, the middle of the gravel lot between the hall and
  123, placed by eye on Esri World Imagery (z19). The OSM building point
  (43.82200,-69.96492) lands on the hall's roof, so it's not used.
- **Links (site.parkingLot):** Apple `maps.apple.com/?ll=…&q=Wedding parking
  (Merriconeag Grange)` (Apple 301s it to `/place?coordinate=…&name=…` with the pin
  and label kept; the old form is kept because older iPhones open it natively);
  Google `google.com/maps/search/?api=1&query=lat,lon` (200).
