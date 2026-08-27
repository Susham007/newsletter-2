# Daily publishing guide

## Add an article

1. Copy an existing file in `src/articles/` and give it a short, URL-friendly filename.
2. Put its image in `src/assets/images/`.
3. Update the front matter at the top of the Markdown file.
4. Write the article below the second `---` line.
5. Run `npm run build`, then commit and push. Netlify publishes the new build automatically.

## Front matter fields

```yaml
layout: layouts/article.njk
title: The public headline
dek: One clear sentence explaining why the story matters.
date: 2026-08-28
category: Analysis
image: /assets/images/example.jpg
imageWidth: 1200
imageHeight: 750
imageAlt: A factual description of the image
imageCredit: Photographer or source
source: Primary source used for the reporting
featured: false
status: published
order: 5
format: story
theme: blue
```

- `status`: use `published` to show the article or `archived` to remove it from the homepage without deleting it.
- `format`: use `lead`, `data`, or `story`. Keep one published `lead` at a time.
- `order`: lower numbers appear first inside their format.
- `theme`: use `blue`, `purple`, or `red` for the small category label only.
- `image`: required for `lead` and `story`; omit it for a compact `data` briefing.
- `imageWidth` and `imageHeight`: the source image dimensions. They prevent layout shift in web and email clients.
- `stat`: add a short figure to a `data` briefing or the lead evidence line.

## Remove or archive an article

Change `status: published` to `status: archived`. The article file remains available for future reference, but it is removed from the homepage on the next build.

## Change the sponsor or signup copy

- Sponsor settings: `src/_data/ad.json`
- Signup copy and endpoint: `src/_data/signup.json`
- Publication name, issue, and date: `src/_data/site.json`
