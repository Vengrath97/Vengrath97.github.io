# Vengrath — vengrath97.github.io

A static GitHub Pages site for Vengrath's RPG campaigns, projects,
blog, and tools. No build step — plain HTML/CSS/JS.

## What changed in this rebuild

1. **New design, built from scratch.** A "GM's desk" identity —
   aged paper, ink, sealing-wax rust, pine green, brass hairlines —
   replacing the previous dark gothic-atelier look, unified across
   every page of the main site (homepage, Campaigns, Projects, Blog,
   AboutMe). See `templates/PAGE-TEMPLATE.md` for the pattern every
   page follows.
2. **Książęta Heartwell now points at its new wiki.** The project
   page at `pages/Projects/ksiazeta-heartwell/` links to
   `SecretProjects/Heartwell/` — the richer, GitHub-API-driven wiki —
   instead of the old `lore-compendium` (which has been removed).
3. **Cleaner architecture.**
   - `/css/` is split into `tokens → base → typography → layout →
     components → hero → responsive`, aggregated by `css/main.css`.
     The old duplicated `cards.css`/`panels.css` are gone.
   - All page content that used to live in scattered per-folder JSON
     files now lives in one place: `/data/projects.json`,
     `/data/campaigns.json`, `/data/blog-posts.json`,
     `/data/search-index.json`.
   - `js/site.js` is the one shared script for header/nav/search
     behaviour; each section has one small renderer script
     (`projects.js`, `campaigns.js`, `blog.js`) that turns its JSON
     into the shared card/list markup.
   - The previous `js/sliding-canvas.js` was an empty file (a dead
     script tag) — the Campaigns page now uses the same card grid as
     everywhere else instead.

## Repository move

Every hardcoded reference to the old repository
(`vengrathdm/vengrathdm.github.io`) has been updated to
`vengrath97/vengrath97.github.io` — this includes the Heartwell and
Echtra wiki article loaders, the AboutMe illustrations gallery
loader, `sitemap.xml`, and `robots.txt`. If you fork or rename the
repository again, search for `vengrath97` across the repo to find
every place that needs updating.

## What's intentionally untouched

- **`/SecretProjects/`** — five self-contained experiments
  (Heartwell wiki, Echtra wiki, Ships, two Charactermancers), each
  with its own CSS/JS/fonts. Not part of the unified design system,
  per request.
- **`pages/charactermancer/`** and
  **`pages/Projects/echtra-midst-the-sidhe/lore-compendium/`** — both
  are self-contained in-world tools/wikis with their own visual
  identity, kept separate for the same reason (see
  `templates/PAGE-TEMPLATE.md`, section 5, for details).

## Adding content

See `templates/PAGE-TEMPLATE.md` for the full guide. In short: new
campaigns/projects/posts are JSON entries in `/data/`, not hand-built
HTML cards.
