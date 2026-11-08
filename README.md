# Expert Desk

Two small reference tools for EU international cooperation work:

- **Per diem:** European Commission (DG INTPA) rates for 194 countries and territories, with a day counter. Always shown in EUR.
- **Exchange rates:** InforEuro monthly rates for 152 currencies, converted in either direction.

Static site, no dependencies. Open `index.html` in a browser; it works offline.

## Data

- **Per diem:** DG INTPA, Decision C(2024)5405, valid for contracts concluded from 8 November 2024. Stored in `data.js`. The Commission republishes the table on no fixed schedule, so check the [official table](https://international-partnerships.ec.europa.eu/document/download/167fc5d8-015b-4a51-85b1-266891fbcc21_en?filename=per-diem-rates-20241108_en.pdf) before using it for a live claim.
- **Exchange rates:** [InforEuro](https://commission.europa.eu/funding-and-tenders/procedures-guidelines-tenders/information-contractors-and-beneficiaries/exchange-rate-inforeuro_en) monthly accounting rates, stored in `fx-rates.js`. A GitHub Actions workflow refreshes them on the 3rd of each month and keeps the old data if the API returns an incomplete list.

## Hosting

GitHub Pages, deployed by workflow on every push to `main`. In the repo settings, Pages → Source must be set to **GitHub Actions**.
