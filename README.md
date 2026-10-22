# Casefile for Jekyll

A port of the Casefile Hugo theme. It produces the same pages, the same URLs, the same CSS, and the same case IDs as the Hugo version.

Every post is listed on the home page, grouped by year, so readers can scan or Ctrl+F the whole archive. Each post gets a short case ID: the first 8 hex characters of the SHA-256 of its path.

- No JavaScript (except the optional now-playing line), no web fonts, no images. CSS is inlined, so each page is a single request.
- Automatic light and dark mode.
- Needs only Jekyll itself. No Gemfile, no extra gems.

## Install

This folder is a complete site. Copy it, edit `_config.yml`, and build:

```bash
cp -r casefile-jekyll myblog && cd myblog
jekyll serve          # preview at http://localhost:4000
jekyll build          # output in _site/
```

## Writing posts

Posts go in `_posts/` and are named `YYYY-MM-DD-slug.md`. The file name sets the date and the URL (`/posts/slug/`). `post-template.md` is a starting point to copy.

Front matter fields the theme uses:

| Field | Purpose |
|---|---|
| `title`, `tags` | Shown in the index and post header |
| `description` | One-line summary under the title on the index |
| `toc: true` | Collapsible contents list for long posts |
| `author` | Override the site author for one post |
| `lastmod` | Shows a "Revised" date if different from the post date |
| `case_id` | Override the generated case ID |

### `artifact` tag

```
{% artifact name="NTUSER.DAT" path="C:\Users\jdoe\NTUSER.DAT" source="disk01.E01" sha256="..." %}
Notes in markdown.
{% endartifact %}
```

Supports `name`, `path`, `source`, `md5`, `sha1`, `sha256`.

## Config (`_config.yml`)

| Key | | |
|---|---|---|
| `title`, `description` | | Site name; intro line on the home page and meta description |
| `author` | site title | Footer and post byline |
| `show_descriptions` | false | Show post descriptions in the index |
| `footer` | | Extra footer text (markdown) |
| `menu` | | Header links (`name`, `url`) |
| `listenbrainz` | | See below |

Keep `permalink: /posts/:title/` and the `defaults` block so posts use the post layout and the same URLs as the Hugo version.

## Now playing (ListenBrainz)

Shows a "Now playing" or "Last played" line under the author's name on each post. The visitor's browser asks ListenBrainz directly, so the Pi does no extra work. The script is about 2 KB, inlined, on post pages only, and left out entirely when no username is set.

1. Create a free account at listenbrainz.org, then link Spotify under Settings → Music Services.
2. Set in `_config.yml`:

```yaml
listenbrainz:
  username: your-listenbrainz-name
  mode: recent        # "now" = only while playing; "recent" = fall back to last played
  max_age_hours: 24   # in recent mode, hide anything older than this
```

If ListenBrainz is down, slow (5 s timeout), or nothing recent has played, the line stays hidden. Track names are inserted as plain text, never HTML.

Privacy: this publishes your listening activity in real time. `mode: now` reveals less; delete the block to turn it off.

## What the plugin does

`_plugins/casefile.rb` adds the pieces Hugo has built in: the SHA-256 filter for case IDs, the `/tags/<tag>/` pages, the table of contents, tag sorting, CSS minifying, and the `artifact` tag. Plain `jekyll build` runs it automatically.

GitHub Pages' built-in builder doesn't run custom plugins. To host there, build with a GitHub Actions workflow instead.

## Running on a Raspberry Pi Zero W

1. **Getting Jekyll.** `sudo apt install jekyll` on Raspberry Pi OS. This is the same 4.3.x Jekyll this theme was tested with, and needs nothing else.
2. **Building.** Ruby is slow on the Zero's single ARMv6 core, so builds take noticeably longer than on a laptop. Building on your laptop and copying the result over is faster and spares the SD card:

```bash
jekyll build
rsync -a --delete _site/ pi@raspberrypi.local:/var/www/html/
```

3. **Serving.** Don't use `jekyll serve` in production. Serve the built files with a static server:

```bash
sudo apt install lighttpd
jekyll build -d /var/www/html
```
