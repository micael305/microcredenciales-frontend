"""Generate the Open Graph share image (1200x630 PNG) for the credential portal.

This is the static, generic preview card shown when a verification link is
shared on LinkedIn / WhatsApp / X. It carries NO personal data — the
per-credential title and description are injected dynamically by the backend
Open Graph endpoint (respecting the privacy policy). This image is only the
branded, reusable banner.

Reproducible asset: run `py scripts/generate_og_image.py` to regenerate
`public/og-credencial.png`. Requires Pillow (`py -m pip install pillow`).

Fonts: Segoe UI (Windows). Override with FONT_DIR if running elsewhere.
"""
from __future__ import annotations

import os

from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1200, 630
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "public", "og-credencial.png")

FONT_DIR = os.environ.get("FONT_DIR", "C:/Windows/Fonts")
FONT_BOLD = os.path.join(FONT_DIR, "segoeuib.ttf")
FONT_REG = os.path.join(FONT_DIR, "segoeui.ttf")

# ── Palette (institutional blue + emerald "verified" accent) ──
BG_TOP = (4, 28, 58)
BG_BOTTOM = (12, 74, 132)
ACCENT = (16, 185, 129)
WHITE = (255, 255, 255)
MUTED = (183, 205, 232)
LABEL = (150, 182, 220)

MARGIN = 72


def _font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def _draw_tracked(draw, pos, text, font, fill, tracking):
    """Draw text with manual letter-spacing for a premium, kerned look."""
    x, y = pos
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill, anchor="lm")
        x += draw.textlength(ch, font=font) + tracking


def build() -> None:
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_TOP)
    draw = ImageDraw.Draw(img, "RGBA")

    # Vertical gradient background.
    for y in range(HEIGHT):
        t = y / (HEIGHT - 1)
        draw.line(
            [(0, y), (WIDTH, y)],
            fill=tuple(int(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3)),
        )

    # Decorative translucent concentric rings (subtle depth, right side).
    for radius, alpha in [(380, 14), (290, 20), (200, 26)]:
        draw.ellipse(
            [WIDTH - 150 - radius, 300 - radius, WIDTH - 150 + radius, 300 + radius],
            outline=(255, 255, 255, alpha),
            width=2,
        )

    # Top institutional label (letter-spaced).
    _draw_tracked(
        draw,
        (MARGIN, 86),
        "UTN · FACULTAD REGIONAL TUCUMÁN",
        _font(FONT_BOLD, 26),
        LABEL,
        tracking=3,
    )

    # "Verified" badge: emerald circle with a white check.
    cx, cy, r = 150, 300, 66
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ACCENT)
    draw.line(
        [(cx - 30, cy + 4), (cx - 8, cy + 26), (cx + 32, cy - 24)],
        fill=WHITE,
        width=15,
        joint="curve",
    )

    # Headline (two lines) + emerald underline.
    hx = 252
    draw.text((hx, 242), "Credencial", font=_font(FONT_BOLD, 92), fill=WHITE, anchor="lm")
    draw.text((hx, 342), "Verificada", font=_font(FONT_BOLD, 92), fill=WHITE, anchor="lm")
    underline_w = draw.textlength("Verificada", font=_font(FONT_BOLD, 92))
    draw.rounded_rectangle([hx, 396, hx + underline_w, 404], radius=4, fill=ACCENT)

    # Subline.
    draw.text(
        (hx, 444),
        "Respaldada en blockchain pública · Hyperledger Besu",
        font=_font(FONT_REG, 33),
        fill=MUTED,
        anchor="lm",
    )

    # Divider + footer.
    draw.line([(MARGIN, 536), (WIDTH - MARGIN, 536)], fill=(255, 255, 255, 45), width=2)
    draw.text(
        (MARGIN, 578),
        "portal-credenciales.utnpf.site",
        font=_font(FONT_BOLD, 30),
        fill=WHITE,
        anchor="lm",
    )
    draw.text(
        (WIDTH - MARGIN, 578),
        "Microcredenciales · Verificación pública",
        font=_font(FONT_REG, 26),
        fill=MUTED,
        anchor="rm",
    )

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    img.save(OUTPUT, "PNG", optimize=True)
    print(f"OK -> {os.path.abspath(OUTPUT)} ({img.size[0]}x{img.size[1]})")


if __name__ == "__main__":
    build()
