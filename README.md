# Niyantran Chronicle

A modular static newsletter built with Eleventy. The sponsor, editorial, and signup areas are independent components, while every briefing lives in its own Markdown file.

## Local preview

```bash
npm install
npm run dev
```

Open `http://localhost:8080`.

## Production build

```bash
npm run build
```

The deployable site is generated in `_site/`.

The build also produces an email-client-safe edition at `_site/email/index.html`. It uses the same article data as the website, but replaces the web layout with a 640px table structure, inline styling, email-safe fonts, and absolute image and article URLs.

## Netlify

Connect this repository to Netlify. The included `netlify.toml` sets the build command to `npm run build` and the publish directory to `_site`.

See `EDITORIAL.md` for the daily publishing workflow.
See `EMAIL.md` before sending an edition through an email platform.
