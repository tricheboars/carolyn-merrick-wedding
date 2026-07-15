# Carolyn & Merrick — Site Logos

These are the **canonical, important** brand assets for the site. Do not replace or
regenerate without explicit sign-off.

## Files

| File | Role | Source dimensions | Description |
|------|------|-------------------|-------------|
| `main-logo.png` | **Main logo** | 684 × 612 | Full "Carolyn & Merrick" hand-lettered wordmark. Use in the site header / hero. |
| `small-logo.png` | **Small logo / icon** | 342 × 364 (≈square) | "C & M" scalloped-heart monogram with arrow. Use for the favicon, nav icon, and any compact placement. |

## Usage notes

- **main-logo.png** — the wordmark. Primary logo wherever there's room for the full name.
- **small-logo.png** — the monogram. Icon-sized contexts (favicon, tab icon, footer mark, social avatar).
- Both are PNGs with alpha (RGBA).

## Known cleanup TODOs (originals as delivered)

- `main-logo.png` has a small stray dark rectangle in the top-right corner that should be removed.
- `small-logo.png` still carries its original photo background (warm tent scene) behind the heart; may want a transparent or solid-background version for web use.
- Consider generating SVG and multi-size PNG/ICO exports for production.

## Production derivatives (generated 2026-07-14, live in `web/src/assets/img/`)

Both cleanup TODOs above are done in the derivatives (originals untouched):

| File | From | Notes |
|------|------|-------|
| `logo-wordmark-white.png` / `-cobalt.png` | main-logo | background + stray rectangle removed via luminance mask; recolored cream `#FBF8EC` / plate cobalt `#2F2C8E`. White = hero + footer (dark grounds); cobalt = light grounds. |
| `logo-monogram-white.png` / `-cobalt.png` | small-logo | tent photo removed (lamp-glow leaks hand-erased); same two colorways. White = nav/hero/footer. |
| `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `svg/favicon.svg` | small-logo | white monogram centered on plate cobalt. |

Regeneration recipe (ImageMagick): `-colorspace gray -level 78%x96%` (wordmark) or
`-level 80%x98%` + erase lamp-glow rects (monogram) → mask; then
`-colorspace sRGB -alpha copy -channel RGB -fill <hex> -colorize 100 +channel -trim`.
