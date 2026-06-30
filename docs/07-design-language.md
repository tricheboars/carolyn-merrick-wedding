# 07 — Design Language (coastal-Maine whimsy, olive edition)

> **Source of truth: the couple's actual Save-the-Date** (received 2026-06-29).
> This OVERRIDES the earlier "pastel fog-blue / sea-glass" guess in `00-vision.md`.
> The real direction is warmer and earthier: **olive/citron + cream + champagne**,
> hand-lettered script, and dark-green hand-drawn line art. We have **both card
> sides**: the olive *front* (color-field hero) and the photo *back* (monogram + warm
> couple photo). Add both to `web/assets/` as canonical reference. The card is a
> **Minted template** — its back still shows Minted's placeholder URL.

## Mood

Warm, earthy, **whimsical but elegant**, editorial. A relaxed, slightly retro
coastal-Maine warmth — olive green + cream + a champagne/terracotta glow, hand-drawn
single-line illustrations, lots of negative space. Hand-touched, not cluttered.
"Pastel whimsy" reads here as **muted/earthy whimsy**, not baby pastels.

## Palette (pulled from the Save-the-Date)

| Token | Hex | Role |
|---|---|---|
| `--olive` | `#A8AC6A` | Primary background (the STD green) |
| `--olive-deep` | `#8E9456` | Hover/contrast olive, subtle fills |
| `--cream` | `#FBF8EC` | Script + text on olive; alt section background |
| `--forest` | `#4F5A2E` | Hand-drawn line art, footer, deep accents |
| `--ink` | `#2F3320` | Warm near-black — body text on cream sections |
| `--terracotta` | `#B26A3C` | Warm accent (from the photo's jacket tones) |
| `--brick` | `#8E2F2A` | Rare pop (the red sweater) — use *very* sparingly |
| `--amber` | `#C9963F` | Soft highlight / link underline |

**Contrast rule (a11y):** cream-on-olive is gorgeous but **low contrast** — reserve
it for **large decorative display** (script names, hero). For any body/critical text
use `--ink` on `--cream`, or `--cream` on `--forest`, to clear WCAG AA. See
`design:accessibility-review` before launch.

## Typography

- **Display script** — looping, monoline, hand-lettered (the "Carolyn & Merrick"
  feel). Free Google-Font candidates to trial: **Sacramento** (monoline loops,
  closest), **Mr Dafoe**, **Estonia**, **Norican**. For an exact match we may want a
  licensed hand-letter face. **Usage:** names, "Save the Date", big section
  flourishes — **large only, never body, never critical info.**
- **Serif (information voice)** — **Cormorant Garamond**: elegant, high-contrast.
  Used for headings, and **UPPERCASE + generous letter-spacing** for labels (dates,
  place names) exactly like the STD's `8.14.27` / `HARPSWELL, ME`.
- **Body / utility** — the card *back* caption is a clean **sans-serif**, so the
  information/body voice leans sans. Use a quiet **humanist sans** (e.g. Mulish /
  Nunito Sans) for paragraphs, nav, forms, and captions; keep Cormorant for elegant
  headings/labels. Net: **3 roles — script display · serif headings · sans body.**
- **Pairing rule:** *script for emotion, serif for information.* Never set body copy
  in the script.

## Motifs — hand-drawn monoline line art (in `--forest`)

The STD's champagne coupes are the anchor. Build a small **coastal-Maine line-art
set** in the same single-stroke style: pine sprig, lobster, sailboat, lighthouse,
oyster, wildflower, Casco Bay map squiggle. Use as accents, dividers, and section
markers. Keep them sparse and consistent (one weight, one green).

## Monogram, hero & photography (from the card *back*)

**The monogram is the brand mark.** A looping **"C & M"** script sits inside a
**scalloped/lace heart pierced by Cupid's arrow**, in white line art. Make this the
reusable mark everywhere: **favicon, nav badge, section dividers, loading state, the
SMS sender avatar, email/footer sign-off.** Single weight — `--cream` on dark/photo,
`--forest` on light.

**Two hero directions — use both:**
- **A · Color field** (card *front*): olive bg, script names, serif details, coupe
  motif. Calm, typographic → interior section headers.
- **B · Photo-forward** (card *back*): full-bleed warm couple photo + the white
  monogram and a short line overlaid. Cinematic → the **Home hero**.

**Photography direction:** warm, cinematic, woodsy/coastal — firelight, tents,
redwoods/pines, candid closeness, a filmic warm grade. Source 3–6 for hero, gallery,
and section breaks.

**Minted / domain note:** the printed card is a Minted template whose back still
shows the placeholder **`oliviaandtim.minted.us`**. Our custom site keeps matching
this aesthetic — but **the real domain must be locked before the cards print** so
guests are sent to our site, not a placeholder. → time-sensitive (see `CLAUDE.md`).

## Layout principles

- Generous negative space; **asymmetric**, editorial placement.
- Photos as **framed "windows"** (subtle rounded corners), occasionally overlapped
  by script set at a slight rotation — echoing the STD.
- Mobile-first; the hero collapses gracefully to a single column.
- Section rhythm: alternate olive and cream backgrounds for pacing.

## Motion budget (house style = small)

Gentle only: fade/slide-in on scroll, a soft hover-lift on cards, and optionally a
**line-art "draw-in"** (SVG stroke-dashoffset) for the motifs. No parallax, no
auto-carousels, no neon.

## Starter CSS tokens

```css
:root {
  --olive:#A8AC6A; --olive-deep:#8E9456; --cream:#FBF8EC; --forest:#4F5A2E;
  --ink:#2F3320; --terracotta:#B26A3C; --brick:#8E2F2A; --amber:#C9963F;

  --font-script:"Sacramento", cursive;          /* trial vs Mr Dafoe/Estonia */
  --font-serif:"Cormorant Garamond", Georgia, serif;
  --font-body:"EB Garamond", Georgia, serif;

  --step-label: clamp(.8rem, .7rem + .3vw, .95rem);   /* tracked uppercase */
  --step-h:     clamp(2rem, 1.4rem + 3vw, 3.5rem);
  --step-script:clamp(3rem, 2rem + 7vw, 7rem);
  --section-pad: clamp(72px, 11vh, 150px);
  --radius: 10px;
}
```

## Where this shows up

Hero, save-the-date echo, section dividers, the registry "house fund" card, RSVP
form styling, and the travel/lodging cards all draw from these tokens. The full
front-end is built in `web/` per the stack in [`06-stack-decision.md`](06-stack-decision.md).
