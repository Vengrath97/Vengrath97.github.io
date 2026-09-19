# Glass Grid — GitHub Pages + Local

The site uses one file per tile in `V/`. The same project works on GitHub Pages, through a local HTTP server, and by opening `index.html` directly.

## Tile content

Create one file in `V/`, for example `V/research.txt`:

```text
Research
Reference
graphics/research.svg
subpages/research.html
```

The four lines are:
1. Title
2. Tag
3. Graphic path
4. Destination link

Then add the filename to `V/index.json`.

## Running on GitHub Pages

Nothing special is required. GitHub Pages serves `V/index.json` and the individual `.txt` files, which the browser loads at runtime.

## Running locally

### Recommended: local HTTP server

From the project directory:

```bash
python3 -m http.server
```

Then open `http://localhost:8000/`.

### Directly opening index.html

This also works. Browsers normally block `fetch()` from `file://`, so the page detects that environment and uses the embedded fallback generated from the current `V/` contents.

If you change the files in `V/` and want those changes to appear when opening `index.html` directly, run:

```bash
python3 tools/build-local-fallback.py
```

The authoritative content remains the individual files in `V/`; the embedded data is only a local-preview compatibility layer.

## Adding a tile

1. Create `V/my-tile.txt`.
2. Put its filename in `V/index.json`.
3. Add its graphic under `graphics/`.
4. Set its destination in line 4.
5. Run `python3 tools/build-local-fallback.py` if you use direct `file://` preview.

No rendering/layout JavaScript changes are needed.
