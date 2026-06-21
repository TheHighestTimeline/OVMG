#!/usr/bin/env python3
"""
import_storylane_pdf.py — Convert an exported Storylane PDF walkthrough into a
Walkthrough Recorder project file that the Chrome extension's "Import" button
can load directly into the editor.

WHY THIS EXISTS
Storylane's PDF export is just one raster screenshot per page plus a small
separate raster "spotlight" image laid on top of it, and a caption banner
above the screenshot. There's no extractable text layer. This script:

  1. Pulls the real embedded screenshot image out of each page (not a
     re-rendered/recompressed copy) — pixel-accurate.
  2. Finds the small spotlight-dot image on the same page and computes its
     center as a percentage of the screenshot's bounding box — this becomes
     the step's clickX/clickY, and is also written as a 'spotlight'
     annotation so the imported step already shows the highlight circle.
  3. Best-effort OCRs the caption banner above the screenshot (if Tesseract
     is installed) to pre-fill the step's caption text. If OCR isn't
     available, the caption is left blank — it's a 30-second retype per step
     in the editor, and the screenshot + click position (the parts that are
     tedious to redo by hand) are already pixel-accurate.

USAGE
    pip install pymupdf pillow pytesseract      # pytesseract optional
    python import_storylane_pdf.py "My Storylane Export.pdf" "My Project Name"

Output: "<pdf-name>-import.json" next to the PDF. Open the extension popup,
click "Import Storylane PDF...", and pick that JSON file.
"""

import sys
import os
import re
import json
import base64
import io

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit(
        "Missing dependency 'pymupdf'.\n"
        "Install it with:  pip install pymupdf pillow pytesseract"
    )

try:
    from PIL import Image
except ImportError:
    sys.exit("Missing dependency 'pillow'. Install it with:  pip install pillow")

try:
    import pytesseract
    HAVE_OCR = True
except ImportError:
    HAVE_OCR = False


def find_screenshot_and_spotlight(page):
    """Return (screenshot_info, spotlight_info) image dicts from page.get_image_info(xrefs=True).
    The screenshot is the image with the largest area; the spotlight is the
    smallest near-square image that overlaps the screenshot's bbox.
    Returns (None, None) if no images found."""
    infos = page.get_image_info(xrefs=True)
    if not infos:
        return None, None

    def area(info):
        b = info["bbox"]
        return max(0, b[2] - b[0]) * max(0, b[3] - b[1])

    infos_sorted = sorted(infos, key=area, reverse=True)
    screenshot = infos_sorted[0]
    spotlight = None
    sb = screenshot["bbox"]

    for info in infos_sorted[1:]:
        b = info["bbox"]
        w, h = b[2] - b[0], b[3] - b[1]
        if w <= 0 or h <= 0:
            continue
        # Spotlight overlays are small and roughly square, and sit inside the screenshot
        cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
        inside = sb[0] <= cx <= sb[2] and sb[1] <= cy <= sb[3]
        small_and_square = w < 80 and h < 80 and 0.5 < (w / h if h else 0) < 2.0
        if inside and small_and_square:
            spotlight = info
            break

    return screenshot, spotlight


def extract_image_bytes(page, xref):
    doc = page.parent
    base = doc.extract_image(xref)
    return base["image"], base["ext"]


def ocr_caption(page, screenshot_bbox, dpi=200):
    if not HAVE_OCR:
        return ""
    try:
        # Render just the strip above the screenshot (the caption banner)
        zoom = dpi / 72.0
        rect = fitz.Rect(0, 0, page.rect.width, max(0, screenshot_bbox[1]))
        if rect.height < 5:
            return ""
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, clip=rect)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        text = pytesseract.image_to_string(img).strip()
        return text
    except Exception:
        return ""


def split_caption(raw_text, step_number):
    """Strip a leading '<n>. ' step-number prefix Storylane adds, and split
    into a short title + the remainder as body."""
    text = raw_text.strip().replace("\n", " ")
    prefix = f"{step_number}."
    if text.startswith(prefix):
        text = text[len(prefix):].strip()
    if not text:
        return "", ""
    words = text.split(" ")
    if len(words) <= 10:
        return text, ""
    return " ".join(words[:10]) + "…", text


def parse_intro_text(raw_text):
    """Storylane's first PDF page is usually a cover slide: a title, a
    description paragraph, a 'Total steps: N' line, and (oddly) a preview of
    step 1's own caption — all OCR'd as one blob. Split it into an intro
    title + subtitle, dropping the boilerplate lines, so it maps onto the
    project's intro slide instead of becoming a fake Step 1 with a centered,
    meaningless hotspot."""
    blocks = [b.strip() for b in raw_text.split("\n\n") if b.strip()]
    blocks = [
        b for b in blocks
        if not re.match(r"^Total steps:\s*\d+", b, re.I)
        and not re.match(r"^\d+\.\s", b)
    ]
    if not blocks:
        return "", ""
    title = blocks[0].replace("\n", " ").strip()
    subtitle = " ".join(b.replace("\n", " ").strip() for b in blocks[1:])
    return title, subtitle


DEFAULT_SPOTLIGHT_STYLE = {
    "opacity": 0.85,
    "borderColor": "#FFFFFF",
    "borderWidth": 2,
    "radius": 4
}


def build_step(page_index, screenshot, spotlight, img_bytes, img_ext, caption_title, caption_body):
    sb = screenshot["bbox"]
    sw, sh = sb[2] - sb[0], sb[3] - sb[1]

    if spotlight:
        spb = spotlight["bbox"]
        cx = ((spb[0] + spb[2]) / 2 - sb[0]) / sw * 100 if sw else 50
        cy = ((spb[1] + spb[3]) / 2 - sb[1]) / sh * 100 if sh else 50
        cx = max(0, min(100, cx))
        cy = max(0, min(100, cy))
        ann_w = (spb[2] - spb[0]) / sw * 100 if sw else 6
        ann_h = (spb[3] - spb[1]) / sh * 100 if sh else 6
        annotations = [{
            "id": f"ann_import_{page_index}",
            "type": "spotlight",
            "x": cx - ann_w / 2,
            "y": cy - ann_h / 2,
            "w": ann_w,
            "h": ann_h,
            "style": dict(DEFAULT_SPOTLIGHT_STYLE)
        }]
    else:
        cx, cy = 50, 50
        annotations = []

    mime = "image/png" if img_ext == "png" else f"image/{img_ext}"
    b64 = base64.b64encode(img_bytes).decode("ascii")

    return {
        "id": f"step_import_{page_index}",
        "imageDataUrl": f"data:{mime};base64,{b64}",
        "clickX": round(cx, 2),
        "clickY": round(cy, 2),
        "targetText": "",
        "targetSelector": "",
        "pageUrl": "",
        "pageTitle": "",
        "timestamp": 0,
        "tooltipTitle": caption_title,
        "tooltipBody": caption_body,
        "tooltipPosition": "bottom",
        "tooltipWidth": None,
        "zoom": None,
        "leadCapture": None,
        "annotations": annotations
    }


def main():
    if len(sys.argv) < 2:
        sys.exit('Usage: python import_storylane_pdf.py "path/to/storylane.pdf" ["Project Name"]')

    pdf_path = sys.argv[1]
    if not os.path.isfile(pdf_path):
        sys.exit(f"File not found: {pdf_path}")

    project_name = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(os.path.basename(pdf_path))[0]

    if not HAVE_OCR:
        print("[note] pytesseract/Tesseract not found — captions will be left blank for you to fill in.")

    doc = fitz.open(pdf_path)
    steps = []
    skipped = 0
    intro = None

    for i, page in enumerate(doc):
        screenshot, spotlight = find_screenshot_and_spotlight(page)
        if not screenshot:
            skipped += 1
            continue

        caption_raw = ocr_caption(page, screenshot["bbox"])

        # The first page is often a cover slide (title + description +
        # "Total steps: N"), not an actual step — it has no spotlight and
        # nothing's been added yet. Route it into the project's intro slide
        # instead of faking a Step 1 with a centered hotspot.
        if i == 0 and not spotlight and not steps:
            intro_title, intro_subtitle = parse_intro_text(caption_raw)
            if intro_title or intro_subtitle:
                intro = {"enabled": True, "title": intro_title, "subtitle": intro_subtitle,
                         "buttonText": "Start Demo", "customBackgroundImage": None}
                print(f"  page 1: detected as cover/intro slide -> \"{intro_title}\"")
                continue
            # no usable text (e.g. OCR unavailable) — fall through and treat as a step

        img_bytes, img_ext = extract_image_bytes(page, screenshot["xref"])
        title, body = split_caption(caption_raw, i + 1)

        step = build_step(i + 1, screenshot, spotlight, img_bytes, img_ext, title, body)
        steps.append(step)
        print(f"  step {i + 1}: image {len(img_bytes)} bytes, "
              f"click=({step['clickX']}%, {step['clickY']}%), "
              f"caption={'OCR ok' if title else '(blank)'}")

    if skipped:
        print(f"[note] skipped {skipped} page(s) with no embedded screenshot image (likely title/closing slides).")

    out = {
        "projectName": project_name,
        "steps": steps
    }
    if intro:
        out["intro"] = intro

    out_path = os.path.splitext(pdf_path)[0] + "-import.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f)

    print(f"\nWrote {len(steps)} step(s) to: {out_path}")
    print('Now open the extension popup, click "Import Storylane PDF...", and pick that file.')


if __name__ == "__main__":
    main()
