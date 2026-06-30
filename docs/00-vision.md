# 00 — Vision & Brief

> Source: Patrick's kickoff for the Carolyn + Merrick wedding site. Captured
> 2026-06-29. This is the "why" and the "what good looks like." Facts marked
> **[TODO]** are awaiting Patrick.

## The one-liner

A wedding website for Patrick's sister that is **much more advanced than most
wedding sites and genuinely helpful to guests** — including **text-message (SMS)
capabilities** — wrapped in a **pastel-whimsy, clean, coastal-Maine** aesthetic.
"In some ways the most PROD site we've ever made."

## The couple & event

- **Bride:** **Carolyn Moore** (Patrick's sister).
- **Groom:** **Merrick Harris**.
- **Date:** **August 14, 2027** (8.14.27).
- **Venue:** **The Harpswell Inn** — 108 Lookout Point Rd, **Harpswell, ME 04079**
  (coastal, Casco Bay / midcoast Maine).
- **Approx guest count:** **[TODO]** (drives DB sizing + SMS cost — see
  [`05-sms-cost.md`](05-sms-cost.md)).

## Pages the couple asked for (bride's notes, 2026-06-29)

1. **About Us / Our Story**
2. **Getting to Harpswell / Transportation**
3. **Where to Stay** (lodging)
4. **Schedule of Events**
5. **Registry → cash / house fund** ("just have people send us money for our house")

Plus the core we add: **Home** (hero + key info) and **RSVP**. FAQ + Gallery optional.
Visual direction comes from the Save-the-Date → [`07-design-language.md`](07-design-language.md).

## What "more advanced / very helpful for guests" means

The bar is higher than a one-page invite. Guest-helpfulness features we're aiming
at (final scope TBD with Patrick):

- **RSVP** with meal choice, dietary restrictions, plus-ones, and per-guest or
  per-household accounts.
- **Cash registry / house fund** — the couple are collecting **money toward their
  house**, not a traditional item registry: a tasteful contributions page
  (Venmo/Zelle/etc.) + an optional "we sent a gift" note for thank-yous. **No item
  catalogue or claim mechanic.**
- **Travel & lodging** built for *coastal Maine logistics* — drive times, ferries
  if relevant, recommended places to stay, airport guidance.
- **Things to do** in the area (lobster, lighthouses, hikes, the good coffee).
- **Schedule / timeline** of events with day-of clarity.
- **FAQ**, **gallery**, **their story**.
- **SMS layer (the differentiator):** save-the-date blasts, RSVP-deadline nudges,
  week-of logistics, day-of alerts ("shuttle leaves at 4"), and two-way guest Q&A.

## Aesthetic north star

Set by the couple's **Save-the-Date** (the real source of truth): warm
**olive/citron green + cream**, looping hand-lettered **script** + an elegant
**serif**, and dark-green **hand-drawn line art**. Earthy, whimsical, editorial —
muted whimsy, not baby pastels. Full palette/type/motifs →
[`07-design-language.md`](07-design-language.md). *(Supersedes the original
"pastel fog-blue" guess.)*

## Operating principles (from Patrick)

- **Research before building.** Patrick explicitly wants research + a settled plan
  before we stand up containers. (We did the research → `01-research-templates.md`;
  the plan lives in `02-architecture.md`.)
- **Template from our own past work** where it helps — match the house conventions
  rather than reinventing (`03-house-conventions.md`).
- **Track progress in a public GitHub repo.**
- **Keep `CLAUDE.md` lean**; all detail in `docs/`.

## Definition of done (v1 north star, not a commitment)

A deployed, themeable, mobile-first site on Patrick's infra where a guest can land,
understand the event, plan their Maine trip, RSVP, contribute to the house fund, and
receive/return SMS — all looking like the prettiest thing on the coast.

## Open questions for Patrick

1. ✅ Names/roles, date, and venue — answered.
2. Approx **guest count** (and for SMS: one phone per household or per adult)?
3. **Node vs Python** for the API? (defaulting to Node — see
   [`06-stack-decision.md`](06-stack-decision.md).)
4. Good to provision a **Twilio** toll-free number for SMS (opt-in consent handled)?
5. **Domain name** for the site? (e.g. `carolynandmerrick.com`.)
