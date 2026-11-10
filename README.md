# DFIR Notes

A clean Jekyll blog for GitHub Pages. Every post is listed on the home page (grouped by year, with a live filter),
and the footer shows what you're listening to via ListenBrainz.

## Setup

1. Create a repo named `USERNAME.github.io` (or any name for a project site) and push these files.
2. Edit `_config.yml`: `title`, `author`, `url`, `baseurl`, social links, and `listenbrainz.username`.
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.

GitHub builds the site automatically on every push.

## Writing posts

Add Markdown files to `_posts/` named `YYYY-MM-DD-some-title.md`:

```markdown
---
title: "Memory forensics with Volatility 3"
date: 2026-11-10 09:00:00 -0500
tags: [memory, volatility]
---

Your content here.
```

Tags appear on the home page and are searchable with the filter box.

## Now playing

The widget calls the public ListenBrainz API from the visitor's browser (no token, nothing secret in the repo):

- `/1/user/<username>/playing-now` — shown with an animated "Now playing" badge
- falls back to `/1/user/<username>/listens?count=1` — shown as "Last played · 2 hours ago"
- album art comes from the Cover Art Archive when the listen has a MusicBrainz release ID

It refreshes every `listenbrainz.refresh` seconds (minimum 30) and pauses while the tab is in the background.
Leave `username` blank to hide it.

## Run locally

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000.

## Files

```
_config.yml            site settings
_layouts/default.html  page shell (header, footer, now playing)
_layouts/home.html     landing page with every post
_layouts/post.html     single post
_layouts/page.html     static pages (About, 404)
_includes/             head + now-playing widget
assets/css/style.css   all styles, light/dark aware
assets/js/             now-playing + post filter
_posts/                your posts
```
