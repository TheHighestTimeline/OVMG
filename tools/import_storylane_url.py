#!/usr/bin/env python3
"""
import_storylane_url.py

General-purpose Storylane -> standalone walkthrough importer. Does for live
share URLs what import_storylane_pdf.py does for PDF exports: pulls the real
caption, hotspot position, and zoom state for every step, downloads the
screenshots, and runs the result through the exact same player template our
chrome-extension's Export button uses (build_player.js / playerTemplate.js)
so the output is pixel/behavior-identical to a manual export.

Why this works without a browser/click-walking: Storylane's /demo/{id} page
is server-rendered (Next.js) and embeds its full structured project data --
every page screenshot URL, the ordered flow of widgets (steps), each widget's
caption, tooltip position, hotspot offset (% of image), and zoom scalar -- in
a single <script id="__NEXT_DATA__"> JSON blob in the raw HTML. A plain GET
request is enough; no JS execution or click-stepping required.

Usage:
    pip install requests --break-system-packages
    python3 import_storylane_url.py https://app.storylane.io/share/<id> -o out_dir

Requires:
    - Python 3.8+
    - requests
    - Node.js (to run build_player.js, which lives next to this script)

Output:
    <out_dir>/assets/step-XXX.png   (downloaded screenshots, intro uses step 1)
    <out_dir>/steps.json            (intermediate data, useful for debugging)
    <out_dir>/index.html            (final standalone player, via build_player.js)
    <out_dir>/netlify.toml
    <out_dir>/README.md
"""

import argparse
import html as html_lib
import json
import os
import re
import subprocess
import sys
from urllib.parse import urlparse

try:
    import requests
except ImportError:
    sys.exit("Missing dependency: run `pip install requests --break-system-packages` first.")


def strip_html(s):
    if not s:
        return ""
    s = re.sub(r"<[^>]*>", "", s)
    s = html_lib.unescape(s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def share_url_to_demo_url(share_url):
    """Storylane share URLs (/share/{id}) redirect (via an iframe) to a
    server-rendered /demo/{id}? page that actually contains __NEXT_DATA__.
    Requesting /demo/{id}? directly skips the redirect entirely."""
    parsed = urlparse(share_url)
    guide_id = parsed.path.rstrip("/").split("/")[-1]
    return f"https://app.storylane.io/demo/{guide_id}?"


def fetch_next_data(demo_url, session):
    resp = session.get(demo_url, timeout=30)
    resp.raise_for_status()
    m = re.search(
        r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>',
        resp.text,
        re.DOTALL,
    )
    if not m:
        raise RuntimeError(
            "Could not find __NEXT_DATA__ on the page. Storylane may have "
            "changed their page structure -- inspect the HTML manually."
        )
    next_data = json.loads(m.group(1))
    raw = next_data["props"]["pageProps"]["ssResponseDataStr"]
    parsed = json.loads(raw)
    return parsed["data"]


def zoom_scalar_to_region(ox, oy, scalar):
    """Storylane's hotspot zoom is a scalar multiplier anchored at the
    hotspot's own offset point (ox, oy) -- no separate zoomOffset has been
    observed in practice, but if one shows up it should be added to ox/oy
    here before computing the region. Converts to our {x,y,w,h} percent
    region format (consumed unchanged by playerTemplate's applyZoomForStep)."""
    w = h = 100.0 / scalar
    x = max(0.0, min(100.0 - w, ox - w / 2))
    y = max(0.0, min(100.0 - h, oy - h / 2))
    return {"x": x, "y": y, "w": w, "h": h}


def extract_guide(entities):
    flows = entities.get("flows", {})
    widgets = entities.get("widgets", {})
    projects = entities.get("projects", {})

    flow = next(iter(flows.values()))
    project = next(iter(projects.values()))

    pages_by_id = {p["id"]: p for p in project.get("pages", [])}

    ordered_widgets = [widgets[wid] for wid in flow["widgets"]]

    intro_widget = next((w for w in ordered_widgets if w.get("kind") == "popup"), None)
    hotspot_widgets = [w for w in ordered_widgets if w.get("kind") == "hotspot"]

    steps = []
    for w in hotspot_widgets:
        root = (w.get("options") or {}).get("root") or {}
        cta = (w.get("options") or {}).get("cta") or {}
        desc_html = ((w.get("options") or {}).get("description") or {}).get("value")
        offset = root.get("offset") or {}
        ox, oy = offset.get("x"), offset.get("y")
        zoom_scalar = root.get("zoom")

        page = pages_by_id.get(w.get("page_id"))
        if not page:
            continue

        steps.append({
            "_page_id": page["id"],
            "image_url": page["file_url"],
            "clickX": ox,
            "clickY": oy,
            "title": "",
            "body": strip_html(desc_html),
            "position": cta.get("position") or "right",
            "tooltipWidth": None,
            "zoom": zoom_scalar_to_region(ox, oy, zoom_scalar) if zoom_scalar else None,
            "zoomReset": False,
            "annotations": [],  # hasSpotlight/spot/backdropRect not yet mapped --
                                 # extend here if a populated example is found.
        })

    intro_title = project.get("name") or "Walkthrough"
    if intro_widget:
        intro_desc = strip_html(
            ((intro_widget.get("options") or {}).get("description") or {}).get("value")
        )
        intro_title = intro_desc or intro_title

    return {
        "title": project.get("name") or "Walkthrough",
        "intro": {
            "enabled": True,
            "title": intro_title,
            "subtitle": "",
            "buttonText": (intro_widget or {}).get("cta") or "Start Demo",
        },
        "steps": steps,
    }


def download_assets(steps, out_dir, session):
    assets_dir = os.path.join(out_dir, "assets")
    os.makedirs(assets_dir, exist_ok=True)
    for i, step in enumerate(steps):
        filename = f"step-{i + 1:03d}.png"
        dest = os.path.join(assets_dir, filename)
        resp = session.get(step["image_url"], timeout=60)
        resp.raise_for_status()
        with open(dest, "wb") as f:
            f.write(resp.content)
        step["image"] = f"assets/{filename}"
        del step["image_url"]
        del step["_page_id"]
        print(f"  downloaded {filename}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", help="Storylane share URL, e.g. https://app.storylane.io/share/xxxx")
    parser.add_argument("-o", "--out", default="storylane_import", help="Output directory")
    parser.add_argument("--no-download", action="store_true",
                         help="Skip downloading images; reference Storylane's CDN URLs directly instead")
    args = parser.parse_args()

    os.makedirs(args.out, exist_ok=True)

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; OVMG-importer/1.0)"})

    demo_url = share_url_to_demo_url(args.url)
    print(f"Fetching {demo_url} ...")
    data = fetch_next_data(demo_url, session)

    guide = extract_guide(data["entities"])
    print(f"Found guide '{guide['title']}' with {len(guide['steps'])} steps.")

    if args.no_download:
        for step in guide["steps"]:
            step["image"] = step.pop("image_url")
            step.pop("_page_id", None)
    else:
        print("Downloading screenshots...")
        download_assets(guide["steps"], args.out, session)

    steps_json_path = os.path.join(args.out, "steps.json")
    with open(steps_json_path, "w", encoding="utf-8") as f:
        json.dump(guide, f, indent=2)
    print(f"Wrote {steps_json_path}")

    script_dir = os.path.dirname(os.path.abspath(__file__))
    build_player = os.path.join(script_dir, "build_player.js")
    subprocess.run(["node", build_player, steps_json_path, args.out], check=True)

    netlify_toml = """[build]\n  publish = "."\n\n[[headers]]\n  for = "/*"\n  [headers.values]\n    X-Frame-Options = "ALLOWALL"\n    Content-Security-Policy = "frame-ancestors *;"\n"""
    with open(os.path.join(args.out, "netlify.toml"), "w", encoding="utf-8") as f:
        f.write(netlify_toml)

    print(f"\nDone. Drag {args.out}/ onto https://app.netlify.com/drop to deploy.")


if __name__ == "__main__":
    main()
