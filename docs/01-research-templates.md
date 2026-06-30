# 01 — Research: Existing Wedding-Site Templates

> Source: scan of GitHub's `weddings` topic (50 public repos) + close reads of the
> top candidates' READMEs. Captured 2026-06-29. Goal: find the best starting
> blocks and learn what the field does / doesn't do.

## TL;DR

- The topic is mostly **single-use static invitation pages**. Two repos are worth
  real attention; one Python option is worth noting.
- **The decisive finding: NONE of them do SMS / text messaging.** Our headline
  "very helpful for guests / text message capabilities" feature is **custom work we
  build ourselves** (Twilio or similar). Scope it as first-class.

## 🥇 rampatra/wedding-website — the polish benchmark

- **~1.8k★, 1.1k forks. Static HTML / SCSS / JS. Updated Oct 2025. GPL-3.0.**
- **Best-in-class for polish + guest-helpfulness.** Standout features:
  - Slick, fully **responsive** design.
  - **RSVP** that writes straight to a **Google Sheet** (no backend needed).
  - **Email alert** when someone RSVPs.
  - **Add-to-Calendar** across four calendar apps.
  - One-tap **"Book a ride to the venue"** (Uber) button.
  - YouTube venue video + Google Map embed.
  - Runs **completely free** on GitHub Pages + Google Sheets.
- **What it lacks for us:** no per-guest logins, no gift registry, no real
  database. It's a static site with a shared invite code.
- **Steal:** the guest-helper ideas (add-to-calendar, ride button, map, RSVP UX)
  and the "static + tiny integrations" philosophy — which matches our house style.

## 🥈 smileyface12349/wedding-website — the feature benchmark

- **C# / Blazor + .NET 9 + Entity Framework. Updated daily (active). Custom license.**
- **Closest match to "much more advanced."** Features:
  - **Individual guest logins** (or one account per household) gating RSVPs.
  - Fully customizable **RSVP form** + response analysis (CSV export).
  - **Custom gift registry** — items from *any* retailer, no fees; guests claim
    items with their accounts.
  - Admin panel with guest-activity insights.
  - Big library of pre-built, **re-themeable** homepage sections (timeline, venue
    showcase, travel, accommodation, dress code, gallery, contacts, to-do list).
  - Real **database** (EF + migrations).
- **Tradeoffs:** heavier .NET/Blazor stack; some bundled assets are non-commercial
  / AI-generated (license-flagged). We won't ship its assets.
- **Steal:** the **data model + feature set** (accounts, RSVP schema, registry
  "claim" mechanic, admin views). Reimplement clean in our own stack/theme.

## 🥉 russeaap/django-wedding — the Python option

- Django-powered wedding site **and guest-management system**. Older, smaller.
- Relevant because the box is Python-friendly (3.14) and several of Patrick's other
  apps are Python. A Django/Flask backend would sit comfortably here. Worth a closer
  look if we choose a Python API.

## Other notables (lower priority)

- `NgodingSolusi/the-wedding-of-rehan-maulidan` (SCSS) and several Indonesian
  `undangan` invitation templates — pretty, but single-page invites.
- `APAInsular/invited-front` + `invited-back` (React + Laravel) — a digital-
  invitation platform split front/back; more than we need.

## Strategy that falls out of the research

> **Steal rampatra's guest-helper ideas + smileyface/django's account-and-registry
> data model, but build our OWN front-end** so we fully own the pastel-Maine look,
> and **add the SMS layer ourselves** since nothing in the field provides it.

This is reflected in the architecture → [`02-architecture.md`](02-architecture.md).

## Reference links

- Topic: https://github.com/topics/weddings
- https://github.com/rampatra/wedding-website
- https://github.com/smileyface12349/wedding-website
- https://github.com/russeaap/django-wedding
