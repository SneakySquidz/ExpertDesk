# Expert Desk

A searchable, browsable EU per diem reference tool with a simple day counter.

## What it does

- **Per diem search/browse** — type to filter 194 countries and territories; click one to select it.
- **Basic day counter** — a plain +/− counter, default 1 day, running total updates live. No forms, no "Calculate" button to hunt for.
- **Optional adjustments** (collapsed by default, under "+ Add days from dates, or adjust for travel") — set the day count from a start/end date range instead of clicking, and/or apply the standard first/last-day-at-50% rule.
- **Currency conversion** — EUR is the only officially binding figure; the app also shows any of the 152 currencies InforEuro publishes, converted at the current month's official rate.

## Data

**Per diem** — European Commission, DG INTPA, "Current per diem rates", Decision C(2024)5405, effective for contracts concluded from **8 November 2024** (PRAG §2.5.5). Bundled in `data.js`. The Commission republishes this table periodically (previous versions: 2020, 2022, 2024) with no fixed schedule — check the [official table (PDF)](https://international-partnerships.ec.europa.eu/document/download/167fc5d8-015b-4a51-85b1-266891fbcc21_en?filename=per-diem-rates-20241108_en.pdf) before relying on it for a live claim, and refresh `data.js` when a new decision is published.

**Currency** — European Commission, [InforEuro](https://commission.europa.eu/funding-and-tenders/procedures-guidelines-tenders/information-contractors-and-beneficiaries/exchange-rate-inforeuro_en) monthly accounting rates, bundled in `fx-rates.json`. This file is **kept current automatically**: `.github/workflows/update-fx-rates.yml` runs on the 3rd of every month (and on manual dispatch), pulls the live rates from the EC's public API (`ec.europa.eu/budg/inforeuro/api/public/monthly-rates`), and commits the update if the figures changed. No client-side network call at runtime — the browser only reads the bundled file, so it works offline too (rates just won't be newer than the last scheduled run).

## Removed from the earlier placeholder version

The old "Updates" (fake news feed) and "Insights" (client-side passcode lock, zero real security) sections were placeholder-only with no real content, so they've been dropped. If you want a real compliance-updates feed or a genuinely gated section, that's new scope — say so and it'll be built properly (real feed source, real auth), not restored as a placeholder.

## Running it

Open `index.html` in a browser, or serve the folder with any static file server. `fx-rates.json` is fetched same-origin — opening `index.html` directly via `file://` will fail that one fetch (falls back to EUR-only); serving the folder (or GitHub Pages) works fully.

## Hosting

Deploys automatically to GitHub Pages on every push to `main`, via `.github/workflows/deploy-pages.yml`.

**One-time setup required:** in this repo's GitHub settings, go to **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
