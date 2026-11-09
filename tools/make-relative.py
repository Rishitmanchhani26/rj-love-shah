#!/usr/bin/env python3
"""Rewrite root paths ("/assets/...", "/events/...", "/#contact") in the site's HTML files to relative
paths, so the site works at any address (GitHub Pages sub-folder, Netlify, the final domain).
Run: python3 tools/make-relative.py   (safe to run more than once)"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP = {"assets", "tools", ".claude", "Claude Skills", ".git"}


def prefix_for(path: pathlib.Path) -> str:
    depth = len(path.relative_to(ROOT).parts) - 1
    return "./" if depth == 0 else "../" * depth


def fix(html: str, pre: str) -> str:
    # attribute values that start with a single "/" (never "//" protocol-relative URLs)
    html = re.sub(r'((?:href|src|poster|srcset|imagesrcset|action|data-[\w-]+)=")/(?!/)', lambda m: m.group(1) + pre, html)
    # later entries inside srcset lists: ", /assets/..."
    html = re.sub(r'(,\s*)/(?=assets/)', lambda m: m.group(1) + pre, html)
    # inline style url(/...)
    html = re.sub(r'url\((["\']?)/(?!/)', lambda m: f"url({m.group(1)}{pre}", html)
    return html


for f in sorted(ROOT.rglob("*.html")):
    if set(f.relative_to(ROOT).parts) & SKIP or any(p.startswith("drive-download") for p in f.relative_to(ROOT).parts):
        continue
    old = f.read_text(encoding="utf-8")
    new = fix(old, prefix_for(f))
    if new != old:
        f.write_text(new, encoding="utf-8")
        print("relative paths:", f.relative_to(ROOT))
