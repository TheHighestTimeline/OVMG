"""
Add Unsplash hero images to all existing articles that don't have one.
Run once: python add_images.py

Updates both content/ and astro-site/src/content/articles/ in sync.
"""

import re
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).parent
CONTENT_DIR = PROJECT_ROOT / "content"
ASTRO_DIR = PROJECT_ROOT / "astro-site" / "src" / "content" / "articles"

sys.path.insert(0, str(PROJECT_ROOT))
from tools.unsplash_tool import fetch_unsplash_image


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Return (frontmatter_dict, body_text)."""
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    fm_lines = parts[1].strip().split("\n")
    fm = {}
    for line in fm_lines:
        if ":" in line:
            key, _, val = line.partition(":")
            fm[key.strip()] = val.strip().strip('"')
    return fm, parts[2].strip()


def parse_tags(raw: str) -> list[str]:
    """Parse tags from frontmatter string like '["a", "b"]'."""
    return re.findall(r'"([^"]+)"', raw)


def inject_image_frontmatter(text: str, image_meta: dict) -> str:
    """Insert image fields into the frontmatter block."""
    image_block = (
        f'image: "{image_meta["path"]}"\n'
        f'imageAlt: "{image_meta["alt"]}"\n'
        f'imageCreditName: "{image_meta["credit_name"]}"\n'
        f'imageCreditUrl: "{image_meta["credit_url"]}"\n'
        f'imageUnsplashUrl: "{image_meta["unsplash_url"]}"'
    )
    # Insert just before the closing ---
    return re.sub(r'(\n---\n)', f'\n{image_block}\n---\n', text, count=1)


def process_article(filepath: Path) -> bool:
    text = filepath.read_text(encoding="utf-8")

    # Skip if already has an image
    if "\nimage:" in text:
        print(f"  Skipping (already has image): {filepath.name}")
        return False

    fm, _ = parse_frontmatter(text)
    title = fm.get("title", "").strip('"')
    category = fm.get("category", "Infrastructure").strip('"')
    tags_raw = fm.get("tags", "[]")
    tags = parse_tags(tags_raw)

    # Build slug from filename (strip date prefix and .md)
    slug = filepath.stem  # e.g. 2026-05-05-microsoft-800mw-...

    print(f"\n  Fetching image for: {filepath.name}")
    image_meta = fetch_unsplash_image(title, slug, tags, category)

    if not image_meta:
        print(f"  No image found — skipping.")
        return False

    updated = inject_image_frontmatter(text, image_meta)

    # Write to both locations
    filepath.write_text(updated, encoding="utf-8")
    astro_path = ASTRO_DIR / filepath.name
    if astro_path.exists():
        astro_text = astro_path.read_text(encoding="utf-8")
        if "\nimage:" not in astro_text:
            astro_path.write_text(inject_image_frontmatter(astro_text, image_meta), encoding="utf-8")

    print(f"  Done: {filepath.name} → {image_meta['path']}")
    return True


def main():
    articles = sorted(CONTENT_DIR.glob("*.md"))
    if not articles:
        print("No articles found in content/")
        return

    print(f"Processing {len(articles)} articles...\n")
    updated = 0
    for article in articles:
        if process_article(article):
            updated += 1

    print(f"\n{updated} articles updated with images.")
    if updated > 0:
        print("\nNow commit and push:")
        print('  git add -A && git commit -m "images: add Unsplash hero images to all articles" && git push')


if __name__ == "__main__":
    main()
