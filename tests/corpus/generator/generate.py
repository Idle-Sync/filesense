"""Writes the synthetic test corpus and manifest.json into tests/corpus.

Run with --stress to also write the large files into tests/corpus/stress/.
Output is deterministic: fixed random seed, fixed PDF creation date.
"""

import argparse
import hashlib
import io
import json
import random
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from fpdf import FPDF
from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageOps

CORPUS_DIR = Path(__file__).resolve().parent.parent
SEED = 20240101
PDF_CREATION_DATE = datetime(2024, 1, 1, tzinfo=timezone.utc)
A4_MM = (210, 297)
SCAN_DPI = 200
SCAN_PIXELS = (1654, 2339)
TEXT_PDF_FONT = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
SIPS = "/usr/bin/sips"

LOREM = (
    "File sizes shrink when the encoder spends fewer bits on detail the eye "
    "cannot see. Photographs tolerate heavy compression, screenshots do not, "
    "and scanned pages sit somewhere in between."
)


def draw_photo(width, height, seed):
    rng = random.Random(seed)
    gradient = Image.linear_gradient("L").resize((width, height))
    image = ImageOps.colorize(gradient, (20, 40, 110), (250, 170, 90))
    draw = ImageDraw.Draw(image)
    for _ in range(40):
        x = rng.randrange(width)
        y = rng.randrange(height)
        radius = rng.randrange(width // 40, width // 8)
        colour = (rng.randrange(256), rng.randrange(256), rng.randrange(256))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=colour)
    noise = Image.frombytes("L", (width, height), rng.randbytes(width * height))
    noise_rgb = noise.convert("RGB")
    return Image.blend(image, noise_rgb, 0.08)


def draw_scanned_page(page_number):
    font = ImageFont.load_default(size=44)
    image = Image.new("L", SCAN_PIXELS, 245)
    draw = ImageDraw.Draw(image)
    draw.text((150, 150), f"Scanned page {page_number}", fill=20, font=font)
    words = LOREM.split()
    for line_number in range(40):
        start = (line_number * 5 + page_number) % len(words)
        line = " ".join((words * 2)[start : start + 9])
        draw.text((150, 300 + line_number * 50), line, fill=40, font=font)
    return image


def jpeg_bytes(image, quality):
    buffer = io.BytesIO()
    image.save(buffer, "JPEG", quality=quality, optimize=True)
    return buffer.getvalue()


def new_pdf():
    pdf = FPDF(format=A4_MM)
    pdf.set_creation_date(PDF_CREATION_DATE)
    return pdf


def write_photo(path, width=1600, height=1200):
    draw_photo(width, height, SEED).save(path, "JPEG", quality=85)
    return {"width": width, "height": height}


def write_screenshot(path):
    width, height = 1280, 800
    font = ImageFont.load_default(size=28)
    image = Image.new("RGB", (width, height), (245, 246, 248))
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, width, 60), fill=(36, 41, 47))
    draw.rectangle((0, 60, 240, height), fill=(225, 228, 232))
    draw.rectangle((280, 100, 1240, 220), fill=(66, 133, 244))
    draw.rectangle((280, 260, 760, 700), fill=(255, 255, 255))
    draw.rectangle((800, 260, 1240, 700), fill=(52, 168, 83))
    draw.text((20, 14), "FileSense settings", fill=(255, 255, 255), font=font)
    for line_number in range(8):
        draw.text((300, 280 + line_number * 45), f"Option {line_number + 1}: enabled", fill=(30, 30, 30), font=font)
    image.save(path, "PNG", optimize=True)
    return {"width": width, "height": height}


def write_transparent_png(path):
    width, height = 800, 600
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.ellipse((100, 100, 500, 500), fill=(220, 50, 50, 200))
    draw.ellipse((300, 150, 700, 550), fill=(50, 90, 220, 160))
    draw.rectangle((350, 250, 450, 350), fill=(255, 255, 255, 255))
    image.save(path, "PNG", optimize=True)
    return {"width": width, "height": height}


def write_heic(path):
    if not Path(SIPS).exists():
        raise SystemExit(f"{SIPS} not found: HEIC output needs macOS")
    width, height = 1600, 1200
    with tempfile.TemporaryDirectory() as temp_dir:
        source = Path(temp_dir) / "photo.png"
        draw_photo(width, height, SEED + 1).save(source, "PNG")
        subprocess.run(
            [SIPS, "-s", "format", "heic", str(source), "--out", str(path)],
            check=True,
            capture_output=True,
        )
    return {"width": width, "height": height}


def write_text_pdf(path, pages=3):
    font_name = "CorpusFont"
    pdf = new_pdf()
    pdf.add_font(font_name, fname=str(TEXT_PDF_FONT))
    pdf.set_font(font_name, size=12)
    for page_number in range(1, pages + 1):
        pdf.add_page()
        pdf.cell(text=f"Text page {page_number}", new_x="LMARGIN", new_y="NEXT")
        for _ in range(12):
            pdf.multi_cell(0, 6, LOREM, new_x="LMARGIN", new_y="NEXT")
    pdf.output(str(path))
    return {"pages": pages}


def write_scanned_pdf(path, pages=3):
    pdf = new_pdf()
    for page_number in range(1, pages + 1):
        pdf.add_page()
        scan = jpeg_bytes(draw_scanned_page(page_number), 70)
        pdf.image(io.BytesIO(scan), x=0, y=0, w=A4_MM[0], h=A4_MM[1])
    pdf.output(str(path))
    return {"pages": pages}


def write_already_compressed(jpeg_path, pdf_path):
    width, height = 800, 600
    low_quality = jpeg_bytes(draw_photo(width, height, SEED + 2), 30)
    jpeg_path.write_bytes(low_quality)
    pdf = new_pdf()
    pdf.add_page()
    pdf.image(io.BytesIO(low_quality), x=0, y=0, w=A4_MM[0])
    pdf.output(str(pdf_path))
    return {"width": width, "height": height}, {"pages": 1}


def manifest_entry(relative_path, kind, generator, size, committed):
    data = (CORPUS_DIR / relative_path).read_bytes()
    entry = {
        "path": relative_path,
        "kind": kind,
        "generator": generator,
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }
    entry.update(size)
    entry["committed"] = committed
    return entry


def write_committed_files():
    entries = []

    def add(relative_path, kind, size, generator="pillow"):
        entries.append(manifest_entry(relative_path, kind, generator, size, True))

    add("photo.jpg", "photo", write_photo(CORPUS_DIR / "photo.jpg"))
    add("screenshot.png", "screenshot", write_screenshot(CORPUS_DIR / "screenshot.png"))
    add("transparent.png", "transparent_png", write_transparent_png(CORPUS_DIR / "transparent.png"))
    add("photo.heic", "heic", write_heic(CORPUS_DIR / "photo.heic"), generator="sips")
    add("text.pdf", "text_pdf", write_text_pdf(CORPUS_DIR / "text.pdf"), generator="fpdf2")
    add("scanned.pdf", "scanned_pdf", write_scanned_pdf(CORPUS_DIR / "scanned.pdf"), generator="fpdf2")
    jpeg_size, pdf_size = write_already_compressed(
        CORPUS_DIR / "already_compressed.jpg", CORPUS_DIR / "already_compressed.pdf"
    )
    add("already_compressed.jpg", "already_compressed", jpeg_size)
    add("already_compressed.pdf", "already_compressed", pdf_size, generator="fpdf2")
    return entries


def write_stress_files():
    stress_dir = CORPUS_DIR / "stress"
    stress_dir.mkdir(exist_ok=True)
    entries = []
    for megapixels, width, height in [(12, 4000, 3000), (24, 6000, 4000), (48, 8000, 6000)]:
        relative_path = f"stress/photo_{megapixels}mp.jpg"
        size = write_photo(CORPUS_DIR / relative_path, width, height)
        entries.append(manifest_entry(relative_path, "photo", "pillow", size, False))
    for pages in (10, 30, 100):
        relative_path = f"stress/scanned_{pages}p.pdf"
        size = write_scanned_pdf(CORPUS_DIR / relative_path, pages)
        entries.append(manifest_entry(relative_path, "scanned_pdf", "fpdf2", size, False))
    size = write_text_pdf(CORPUS_DIR / "stress/text_100p.pdf", 100)
    entries.append(manifest_entry("stress/text_100p.pdf", "text_pdf", "fpdf2", size, False))
    return entries


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--stress", action="store_true", help="also write the large untracked files")
    args = parser.parse_args()

    entries = write_committed_files()
    if args.stress:
        entries += write_stress_files()
    manifest_text = json.dumps(entries, indent=2) + "\n"
    (CORPUS_DIR / "manifest.json").write_text(manifest_text)


if __name__ == "__main__":
    main()
