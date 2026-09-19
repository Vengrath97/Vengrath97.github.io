# Glass Grid — GitHub Pages

The site is split into structure, styling, behavior, and one-file-per-tile content.

## Add a tile
Create one file in `V/`, for example `V/research.txt`: 

```text
Research
Reference
graphics/research.jpg
subpages/research.html
```

The four lines are: title, tag, graphic path, destination link. Then add the filename to `V/index.json`. No JavaScript changes are needed.

`app.js` loads the manifest and each tile file in the browser. This is a static GitHub Pages architecture; use GitHub Pages or a local HTTP server rather than opening `index.html` directly with `file://`.
