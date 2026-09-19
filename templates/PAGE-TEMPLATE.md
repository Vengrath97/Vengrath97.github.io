# How every page on the main site is built

This site is plain static HTML on GitHub Pages — there is no build step,
so "template" here means *a pattern you copy*, not a file that gets
compiled. Follow this pattern and every new page stays visually and
structurally consistent automatically, because it's all reading from
the same `/css/main.css` and the same `/js/site.js`.

## 1. Skeleton every page shares

```html
<!doctype html>
<html lang="pl" data-root="RELATIVE_PATH_TO_SITE_ROOT/">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#F1ECE0">
  <meta name="description" content="ONE_SENTENCE_SUMMARY">
  <title>PAGE_TITLE — Vengrath</title>
  <link rel="canonical" href="https://vengrath97.github.io/FULL/PATH/">
  <link rel="stylesheet" href="RELATIVE_PATH_TO_SITE_ROOT/css/main.css">
  <!-- add ONE page-specific stylesheet only if this page needs it,
       e.g. css/project.css or css/reading.css -->
</head>
<body>
  <header class="site-header">
    <a class="wordmark" href="RELATIVE_PATH_TO_SITE_ROOT/">Vengrath<span class="wordmark__mark">.</span></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav">
      <a class="site-nav__link" href=".../pages/Campaigns/">Kampanie</a>
      <a class="site-nav__link" href=".../pages/Projects/">Projekty</a>
      <a class="site-nav__link" href=".../pages/Blog/">Blog</a>
      <a class="site-nav__link" href=".../pages/AboutMe/">O mnie</a>
      <a class="site-nav__link" href=".../pages/charactermancer/">Charactermancer</a>
    </nav>
    <div class="header-tools"></div>
  </header>

  <main>
    ... page content, built from the components in css/components.css ...
  </main>

  <footer class="site-footer">...</footer>

  <script src="RELATIVE_PATH_TO_SITE_ROOT/js/site.js"></script>
  <!-- add page-specific scripts (e.g. projects.js) after site.js -->
</body>
</html>
```

The `data-root` attribute on `<html>` is the one thing you must set
correctly per page — it tells `site.js` and every data-fetch how many
`../` to prepend, regardless of how deep the page lives. Root pages use
`./`, one level deep uses `../`, two levels deep `../../`, etc.

## 2. Adding a new campaign or project

Do **not** create a new HTML card by hand. Add one object to
`/data/campaigns.json` or `/data/projects.json` — the existing
`campaigns.js` / `projects.js` render the card automatically, and the
global search will pick it up once you also add an entry to
`/data/search-index.json`.

## 3. Adding a new blog post

1. Add an entry to `/data/blog-posts.json`.
2. Create `pages/Blog/posts/YOUR-SLUG/index.html` using the `.article`
   layout from `css/reading.css` (copy an existing post as a starting
   point).
3. Add it to `/data/search-index.json` if you want it searchable
   site-wide (it already appears in the Blog archive regardless).

## 4. Adding a whole new top-level section

1. Create `pages/YourSection/index.html` using the skeleton above.
2. Add a link to it in the shared nav block on **every** existing page
   (there is no includes system, so this is the one manual step a new
   section requires) — or point that link at a redirect page during a
   transition period.
3. Add an entry to `/data/search-index.json`.
4. Add its URL to `/sitemap.xml`.

## 5. What never uses this system

Everything under `/SecretProjects/` is a self-contained mini-app with
its own CSS/JS/fonts and is intentionally excluded from this design
system, per the site owner's request. Don't link `css/main.css` or
`js/site.js` into anything in that folder.

Two things living *inside* `/pages/` follow the same exception, on
purpose, because they are self-contained in-world tools/wikis rather
than content pages:

- `pages/charactermancer/` — a full gothic "character dossier" app
  with its own fonts and theme (`styles.css`, `navigation.css`,
  `atmosphere.css`). Only its small `.site-home-link` "back to
  Vengrath" element is meant to interoperate with the rest of the
  site; everything else is its own world.
- `pages/Projects/echtra-midst-the-sidhe/lore-compendium/` — Echtra's
  lore wiki, themed independently (`lore-wiki.css`, Celtic vellum/moss
  palette). Its header/nav are plain HTML+inline styles rather than
  `site-header`/`site.js`, so it doesn't depend on `css/main.css` at
  all.

If either of these should be pulled into the unified design later,
treat it as a small standalone project: keep `lore.js` /
`charactermancer` app logic untouched and only replace their outer
chrome and stylesheet.
