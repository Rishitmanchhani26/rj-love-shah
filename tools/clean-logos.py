#!/usr/bin/env python3
"""Cut brand logos out of their white / fake-checkerboard backgrounds and export them evenly sized.
Run: python3 tools/clean-logos.py  (reads the client's drive folder, writes assets/img/logos/*.webp)"""
import pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "drive-download-20261107T130346Z-1-001"
OUT = ROOT / "assets/img/logos"
OUT.mkdir(parents=True, exist_ok=True)

LOGOS = {  # output name: source file
    "reliance": "images (2).jfif",
    "hero": "9-90489_hd-png-hero-motocorp-logo-transparent-png.png",
    "kotak": "png-clipart-kotak-mahindra-bank-logo-horizontal-bank-logos-thumbnail.png",
    "bmw": "9b98fe7973d0cb009e68fee1a586417a.jpg",
    "gujarat-titans": "Gujarat-Titans-Logo.png",
    "coca-cola": "images (1).jfif",
    "sbi-life": "images (1).png",
    "swati": "images (2).png",
    "zydus": "images.png",
    # official logos downloaded from the brands' own websites (8 Nov 2026), kept in assets/raw/brand-logos
    "adani": "../assets/raw/brand-logos/adani-logo.png",
    "welspun": "../assets/raw/brand-logos/welspun-word-logo.png",
    "nuvoco": "../assets/raw/brand-logos/nuvoco-logo.png",
}
BOX = (360, 150)  # every logo fits inside this box


def remove_edge_background(rgba: np.ndarray) -> np.ndarray:
    """Make light, low-saturation pixels connected to the image edge transparent."""
    rgb = rgba[..., :3].astype(int)
    light = (rgb.min(axis=2) > 175) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 24)
    bg = np.zeros_like(light)
    bg[0, :], bg[-1, :], bg[:, 0], bg[:, -1] = light[0, :], light[-1, :], light[:, 0], light[:, -1]
    while True:  # grow the edge region through light pixels only
        grown = bg.copy()
        grown[1:, :] |= bg[:-1, :]; grown[:-1, :] |= bg[1:, :]
        grown[:, 1:] |= bg[:, :-1]; grown[:, :-1] |= bg[:, 1:]
        grown &= light
        if (grown == bg).all():
            break
        bg = grown
    out = rgba.copy()
    out[..., 3] = np.where(bg, 0, out[..., 3])
    # soften the cut edge: light pixels touching the background become partly transparent
    edge = np.zeros_like(bg)
    edge[1:, :] |= bg[:-1, :]; edge[:-1, :] |= bg[1:, :]; edge[:, 1:] |= bg[:, :-1]; edge[:, :-1] |= bg[:, 1:]
    edge &= ~bg
    soft = np.clip((255 - rgb.min(axis=2)) / 90.0, 0, 1)
    out[..., 3] = np.where(edge, (out[..., 3] * soft).astype(np.uint8), out[..., 3])
    return out


for name, file in LOGOS.items():
    im = Image.open(SRC / file).convert("RGBA")
    arr = np.array(im)
    if arr[..., 3].min() == 255:  # no real transparency: cut the background out
        arr = remove_edge_background(arr)
    im = Image.fromarray(arr)
    bbox = im.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    im = im.crop(bbox)
    im.thumbnail(BOX, Image.LANCZOS)
    im.save(OUT / f"{name}.webp", "WEBP", lossless=False, quality=90, method=6)
    print(f"{name:15s} {im.size}  {(OUT / f'{name}.webp').stat().st_size // 1024} KB")
