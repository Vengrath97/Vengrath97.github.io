#!/usr/bin/env python3
"""Generate the embedded local fallback in app.js from V/*.txt.

GitHub Pages and local HTTP servers read V/*.txt directly. A direct file://
preview cannot fetch those files because of browser security restrictions, so
this script keeps the fallback synchronized with V/.
"""
from pathlib import Path
import json, re

ROOT = Path(__file__).resolve().parents[1]
V = ROOT / "V"
APP = ROOT / "app.js"
manifest = json.loads((V / "index.json").read_text(encoding="utf-8"))
records = []
for filename in manifest:
    path = V / filename
    lines = path.read_text(encoding="utf-8").replace("\r", "").splitlines()
    if len(lines) < 4 or not lines[0].strip():
        print(f"Skipping invalid tile file: {filename}")
        continue
    records.append([line.strip() for line in lines[:4]] + [filename])

s = APP.read_text(encoding="utf-8")
pattern = r'const LOCAL_CONTENT = .*?;\n\nasync function loadContent\(\)\{'
replacement = 'const LOCAL_CONTENT = ' + json.dumps(records, ensure_ascii=False, indent=2) + ';\n\nasync function loadContent(){'
s2, count = re.subn(pattern, replacement, s, count=1, flags=re.S)
if count != 1:
    raise SystemExit("Could not find LOCAL_CONTENT block in app.js")
APP.write_text(s2, encoding="utf-8")
print(f"Embedded {len(records)} tile records into app.js")
