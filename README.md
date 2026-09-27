# Expert Desk

A searchable, browsable EU per diem reference tool, plus a day-count calculator.

## What it does

- **Per diem search/browse** — type to filter 194 countries and territories; click one to see its daily subsistence allowance and calculate a mission total (with the standard first/last-day-at-50% rule).
- **Currency conversion** — EUR is the only officially binding figure, but the app also shows live-converted amounts in any currency the ECB publishes (via [frankfurter.app](https://www.frankfurter.app/), no API key). If the conversion service is unreachable, it falls back to EUR-only rather than showing a stale or wrong number.
- **Day-count calculator** — inclusive day count between two dates, for mission planning.

## Data

Rates are the real, current EU figures: **European Commission, DG INTPA — "Current per diem rates"**, Decision C(2024)5405, effective for contracts concluded from **8 November 2024**. Governing rules: PRAG §2.5.5.

- [Official table (PDF)](https://international-partnerships.ec.europa.eu/document/download/167fc5d8-015b-4a51-85b1-266891fbcc21_en?filename=per-diem-rates-20241108_en.pdf)
- Bundled in `data.js`. The Commission republishes this table periodically (previous versions: 2020, 2022, 2024) — check the source link before relying on it for a live claim, and re-run this refresh when a new decision is published.

## Removed from the earlier placeholder version

The old "Updates" (fake news feed) and "Insights" (client-side passcode lock, zero real security) sections were placeholder-only with no real content, so they've been dropped to keep this tool honest and focused. If you want a real compliance-updates feed or a genuinely gated section, that's a new build, not a restore — say so and it can be added properly (real feed source, real auth).

## Running it

Open `index.html` in a browser, or serve the folder with any static file server. Currency conversion needs network access; everything else works offline.

## Hosting

Deploys automatically to GitHub Pages on every push to `main`, via `.github/workflows/deploy-pages.yml`.

**One-time setup required:** in this repo's GitHub settings, go to **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
