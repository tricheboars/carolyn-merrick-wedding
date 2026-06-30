# 05 — SMS Cost Analysis (Twilio)

> Captured 2026-06-29. Pricing verified against Twilio's live US pricing page +
> 2026 A2P 10DLC fee reporting (sources at bottom). Goal: know what the SMS layer
> actually costs before we commit to it. **Bottom line: well under $100 for the
> whole engagement — likely ~$60 — if we use a verified toll-free number.**

## Verified pricing facts (US, June 2026)

| Item | Cost |
|---|---|
| SMS send **and** receive (base, per 160-char segment) | **$0.0083** each |
| Carrier pass-through fee (AT&T/T-Mobile/Verizon) | **+$0.003–$0.005**/segment |
| → All-in per segment | **~$0.011–$0.013** (use **$0.012**) |
| Local 10DLC number rental | **$1.15/mo** |
| Toll-free number rental | **$2.15/mo** |
| A2P 10DLC brand registration (sole proprietor) | **$4** one-time |
| A2P 10DLC campaign vetting | **$15** one-time |
| A2P 10DLC campaign monthly fee | **$1.50–$10/mo** |
| Toll-free verification | **free** (no Twilio fee; allow 1–3 weeks) |

Note: a "segment" is 160 GSM chars (or 70 if emoji/unicode). A text with a link +
details is often **2 segments** — budget ~1.5 avg.

## The number-type decision: Toll-free vs. 10DLC

US carriers require **registration** to send application-to-person SMS. Two paths:

- **10DLC (local number):** cheaper per-month number ($1.15), but you must register
  a **brand** ($4) + **campaign** ($15 vetting + $1.50–$10/mo ongoing). More setup,
  ongoing monthly campaign fee.
- **Toll-free (verified):** $2.15/mo number, **no brand/campaign registration and no
  monthly campaign fee** — just a free one-time verification form. Same per-message
  rates. Verification takes ~1–3 weeks and you should do it **early**; unverified
  toll-free is heavily throttled.

➡️ **For a one-off, low-volume wedding, toll-free wins** — it avoids the entire
10DLC registration overhead and the recurring campaign fee, for ~$1/mo more on the
number. The only cost is planning ahead for verification.

## Cost model

```
outbound_segments = recipients × broadcasts × avg_segments(1.5)
inbound_segments  = recipients × replies_per_recipient(~5)
message_cost      = (outbound + inbound) × $0.012
number_cost       = $2.15/mo × months_active(~14, mid-2026 → Aug-2027)
```

Assumptions: ~9 broadcasts over the engagement (save-the-date, RSVP open, 2
reminders, lodging, things-to-do, week-of, day-before, day-of) + two-way Q&A.

## Scenarios (whole engagement, toll-free path)

| Recipients (phones) | Msg segments | Message cost | Number (~14 mo) | **All-in total** |
|---|---|---|---|---|
| ~100 | ~1,850 | ~$22 | ~$30 | **~$52** |
| ~150 | ~2,775 | ~$33 | ~$30 | **~$63** |
| ~250 | ~4,625 | ~$56 | ~$30 | **~$86** |

10DLC path adds ~$33 of registration overhead (brand $4 + vetting $15 + ~$28
campaign fees over 14 mo) and saves ~$14 on the number → **net ~$20 more** than
toll-free, with more setup friction. Twilio's free trial credit (~$15) offsets
either path.

> **Takeaway:** SMS is cheap here — the cost is dominated by number rental +
> (avoided) registration, not per-message volume. Even a 250-guest wedding is
> < $90 total. The real "cost" is operational: provisioning + verification + opt-in
> consent handling, not dollars.

## Required regardless of path (compliance)

- **Opt-in consent**: only text guests who've opted in; store consent + timestamp.
- **STOP/HELP** auto-replies (Twilio Advanced Opt-Out handles this).
- One clear sender identity; include who it's from in early messages.

## Open inputs

- **Guest count / # of phone recipients** (one per household or per adult?) — sets
  the volume row above.
- Confirm Patrick will provision the Twilio account + fund it (min top-up ~$20).
- Decide **toll-free (recommended)** vs 10DLC and start verification early.

## Sources

- [Twilio US SMS pricing](https://www.twilio.com/en-us/sms/pricing/us)
- [Twilio A2P 10DLC fees (Help Center)](https://help.twilio.com/articles/1260803965530-What-pricing-and-fees-are-associated-with-the-A2P-10DLC-service-)
- [A2P 10DLC in 2026 — costs & how to skip it](https://tuco.ai/a2p-10dlc)
- [Twilio SMS API cost breakdown 2026](https://apidog.com/blog/twilio-sms-api-cost/)
