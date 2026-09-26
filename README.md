# Expert Desk

A dashboard for expert missions: calculators, compliance updates, and a gated deep-insights section.

## Structure

- **Tools** (open) — per diem calculator, day-count calculator
- **Updates** (open) — key facts / compliance news feed
- **Insights** (gated) — compliance checklist, deeper analysis, behind a placeholder passcode lock

## Status: MVP with placeholder data

Everything works, but the actual figures/content are stand-ins:

- **Per diem rates** (`PER_DIEM_RATES` in `app.js`) are made-up numbers, not real EU/UN daily subsistence allowance figures. Replace with your actual rate table.
- **Updates feed** (`UPDATES` in `app.js`) is placeholder text. Replace with real items, or wire it to a real news/compliance source later.
- **Insights lock** is a client-side passcode (`UNLOCK_CODE` in `app.js`, default `expertdesk`) — **not real security**. Anyone can read the source and see the code. Fine as a placeholder gate; not something to rely on if this ever needs to actually restrict paying users. Real gating needs a backend.
- **Compliance checklist** items are generic placeholders — replace with your real checklist.

Data (checklist state, unlock status) persists to `localStorage` only — per-browser, not synced or shared.

## Running it

Open `index.html` in a browser, or serve the folder with any static file server.

## Hosting

Deploys automatically to GitHub Pages on every push to `main`, via `.github/workflows/deploy-pages.yml`.

**One-time setup required:** in this repo's GitHub settings, go to **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**.

## Roadmap

- Swap in real per diem rates and update sources
- Real auth/paywall for Insights, once this needs to actually restrict access
- Real persistence (a database) so checklist/unlock state isn't stuck to one browser
