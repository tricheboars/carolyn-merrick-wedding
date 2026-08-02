# Archived assets (kept in git, NOT shipped)

These files sit outside `web/src/`, so 11ty's passthrough copy never ships them to
the containers. They were moved here 2026-08-02 after an audit found nothing in the
site referenced them, yet ~770 KB was being copied to dev and prod on every deploy.

Nothing is deleted — move a file back into `web/src/assets/…` to use it again.

| File | What it is | Why it's here |
|---|---|---|
| `hero-couple.jpg` / `hero-couple-mobile.jpg` | Engagement portrait, once the home hero | Superseded by the tent photo (`gallery/g01.jpg`) as `--hero-photo` |
| `logo-monogram-wine.png` / `logo-wordmark-wine.png` | Wine-colored cuts of the couple's logo art | The site uses the white cuts on dark grounds; these are genuinely different art (verified, not duplicates), just unused |

Credits for the engagement photos remain in `web/src/assets/img/CREDITS.md`.
