# Data: Music venues + the concert-sweep plan

Source of truth for `web/src/_data/site.js` → `music.venues` and the `/music/`
calendar. Venue calendar URLs fetched live **2026-07-02**.

## The Aug 7-21, 2027 probe result

**Zero events announced anywhere yet** for the wedding window (clean "nothing yet,"
not a coverage gap). Furthest-out public listing in greater Portland today:
2027-02-07 (Merrill via PortTIX).

## Verified venue calendars (on the site)

| Venue | Calendar URL | Announcement horizon observed |
|---|---|---|
| State Theatre (Portland) | statetheatreportland.com/events/ | ~5 months |
| Thompson's Point | **thompsonspoint.com**/events/ (old thompsonspointmaine.com 301s here) | summer series announced rolling, late winter → spring |
| Merrill Auditorium | porttix.com (official ticketer) | ~7 months; season is Sept-May, August quiet |
| Aura | auramaine.com/**aura-calendar-tickets**/ (the /events/ path 404s) | ~6 weeks |
| Portland House of Music | portlandhouseofmusic.com/calendar (or their Prekindle page) | 1-3 months |
| Bandsintown | bandsintown.com/c/portland-me (+ /c/brunswick-me) | aggregator; 403s to bots, fine in browsers |
| JamBase | jambase.com/concerts/us/maine/concerts-in-portland-me-area | aggregator, loads clean |

## The sweep plan (do this, two passes)

1. **April-May 2027:** catches Thompson's Point's summer lineup + State Theatre's
   August shows. Populate `music.events` in site.js (shape:
   `{ day, title, venue, city, time, url }`), day 14 stays empty.
2. **Late June / early July 2027:** catches Aura, PHOM, and stragglers via
   Bandsintown/JamBase. Also re-verify every ticket link before the final deploy.

## Planning note for Patrick + the couple

**Thompson's Point is the most likely source of a big outdoor show on the actual
wedding weekend.** If one lands on Sat Aug 14, 2027, expect Portland-area lodging
pressure and southbound traffic that evening; factor into the room block and any
shuttle timing.
