#!/usr/bin/env python3
"""Cache-busting: stamp every local CSS/JS link in the site's HTML with ?v=<short hash of the file>.
When a stylesheet or script changes, its link changes too, so browsers fetch the new file instead of
showing new pages with an old cached stylesheet. Run before every deploy: python3 tools/version-assets.py
(safe to run more than once; build-event-pages.py runs it automatically)."""
import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP = {"assets", "tools", ".claude", "Claude Skills", ".git"}
LINK = re.compile(r'((?:href|src)=")([^"?#]*?assets/(?:css|js)/[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")')


def stamp(html_file: pathlib.Path) -> bool:
    text = html_file.read_text(encoding="utf-8")

    def repl(m):
        target = (html_file.parent / m.group(2)).resolve()
        if not target.is_file():
            return m.group(0)
        v = hashlib.md5(target.read_bytes()).hexdigest()[:8]
        return f"{m.group(1)}{m.group(2)}?v={v}{m.group(3)}"

    new = LINK.sub(repl, text)
    if new != text:
        html_file.write_text(new, encoding="utf-8")
        return True
    return False


for f in sorted(ROOT.rglob("*.html")):
    parts = f.relative_to(ROOT).parts
    if set(parts) & SKIP or any(p.startswith("drive-download") for p in parts):
        continue
    if stamp(f):
        print("versioned:", f.relative_to(ROOT))
