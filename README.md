# Expert Desk

Two independent EU reference tools: a per diem lookup/counter, and an exchange rate converter. They don't mix — per diem is always EUR (the officially binding figure), currency conversion is its own separate panel.

## What it does

**Per diem**
- Search/browse — type to filter 194 countries and territories; click one to select it.
- Basic day counter — a plain +/− counter, default 1 day, running total updates live. No forms, no "Calculate" button to hunt for.
- Optional adjustments (collapsed by default, under "+ Add days from dates, or adjust for travel") — set the day count from a start/end date range instead of clicking, and/or apply the standard first/last-day-at-50% rule.
- Always shown in EUR — that's the only officially binding figure for a per diem claim.

**Exchange rates**
- Search/browse all 152 InforEuro currencies by code, name, or country.
- Click one, then convert either way: type an EUR amount to see it converted, or type an amount in the selected currency to see its EUR equivalent.

## Data

**Per diem** — European Commission, DG INTPA, "Current per diem rates", Decision C(2024)5405, effective for contracts concluded from **8 November 2024** (PRAG §2.5.5). Bundled in `data.js`. The Commission republishes this table periodically (previous versions: 2020, 2022, 2024) with no fixed schedule — check the [official table (PDF)](https://international-partnerships.ec.europa.eu/document/download/167fc5d8-015b-4a51-85b1-266891fbcc21_en?filename=per-diem-rates-20241108_en.pdf) before relying on it for a live claim, and refresh `data.js` when a new decision is published.

**Exchange rates** — European Commission, [InforEuro](https://commission.europa.eu/funding-and-tenders/procedures-guidelines-tenders/information-contractors-and-beneficiaries/exchange-rate-inforeuro_en) monthly accounting rates, bundled in `fx-rates.js` (loaded as a script, like `data.js` — no runtime fetch, so it works offline and from a saved copy). **Kept current automatically:** `.github/workflows/update-fx-rates.yml` runs on the 3rd of every month (and on manual dispatch from the Actions tab), pulls the month's rates from the EC's public API (`ec.europa.eu/budg/inforeuro/api/public/monthly-rates`), refuses to overwrite good data if the API returns an empty or partial list, commits only when the rates actually changed, and then triggers the Pages deploy so the live site picks up the new rates the same day.

## Removed from the earlier placeholder version

The old "Updates" (fake news feed) and "Insights" (client-side passcode lock, zero real security) sections were placeholder-only with no real content, so they've been dropped. If you want a real compliance-updates feed or a genuinely gated section, that's new scope — say so and it'll be built properly (real feed source, real auth), not restored as a placeholder.

## Running it

Open `index.html` in a browser, or serve the folder with any static file server. Everything, including exchange rates, works offline and straight from `file://`.

## Hosting

Deploys automatically to GitHub Pages on every push to `main`, via `.github/workflows/deploy-pages.yml`.

**One-time setup required:** in this repo's GitHub settings, go to **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.
