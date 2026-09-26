# Expert Desk

A dashboard for tracking experts, assignments and related notes.

## Status

Placeholder scaffold: static HTML/CSS/JS page with tab navigation (Dashboard / Experts / Assignments / Notes). No content wired up yet, no backend, no database — just the shell.

## Running it

Open `index.html` in a browser, or serve the folder with any static file server.

## Hosting

Deploys automatically to GitHub Pages on every push to `main`, via `.github/workflows/deploy-pages.yml`.

**One-time setup required:** in this repo's GitHub settings, go to **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**. After that, every push to `main` publishes automatically.

## Roadmap

- Define what each tab actually needs to hold/do
- Real persistence (a database) once the shape of the content is clear
