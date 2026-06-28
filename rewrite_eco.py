"""
Rewrite all existing articles through The Footprint's environmental lens.
Assigns Tanner or Nathan as author. Applies the 5-part ecological format.

Usage:
    python rewrite_eco.py
"""

import os
import re
import random
import anthropic
from pathlib import Path
from datetime import date
from dotenv import load_dotenv

load_dotenv()

CONTENT_DIR = Path(__file__).parent / "content"
ASTRO_DIR = Path(__file__).parent / "astro-site" / "src" / "content" / "articles"
API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
MODEL = os.getenv("CLAUDE_WRITING_MODEL", "claude-opus-4-7")

AUTHORS = {
    "tanner_south": {
        "name": "Tanner South",
        "title": "Co-Founder & Environmental Infrastructure Reporter",
        "focus": "water consumption, land use, carbon emissions, power sourcing, greenwashing accountability"
    },
    "nathan_south": {
        "name": "Nathan South",
        "title": "Co-Founder & Environmental Science Correspondent",
        "focus": "biological impact, watershed hydrology, thermal pollution, ecosystem disruption, soil health"
    }
}

REWRITE_PROMPT = """You are rewriting a data center news article for The Footprint, an environmentally focused data center publication co-founded by two brothers — a conservationist and a molecular biologist.

AUTHOR: {author_name}, {author_title}
AUTHOR FOCUS: {author_focus}

REWRITE THIS ARTICLE using the following 5-part ecological structure. Use ONLY facts present in the original. Do not invent data. If environmental metrics (water usage, PUE, emissions) are not in the original article, write 'Not publicly disclosed' in those fields.

USE THIS EXACT STRUCTURE:

# [Ecologically specific headline — frames the story around environmental impact, not just the announcement]

### 1. THE ECOLOGICAL DEVELOPMENT BRIEF
[2-3 paragraphs synthesizing the core facts. Focus on scale, location, timeline. Each paragraph 3-5 sentences.]

### 2. WATER & COOLING IMPACT ANALYSIS
[2-3 paragraphs on water footprint, cooling method, local hydrology. If not in source, note what hasn't been disclosed and why that matters.]

### 3. POWER GRID & EMISSIONS PROFILE
[2-3 paragraphs on energy source, MW demand, carbon footprint, and critical examination of any net-zero claims.]

### 4. SUSTAINABILITY METRICS
| Ecological & Technical Metric | Project Specification |
| :--- | :--- |
| Power Capacity & PUE Goal | [from article or 'Not disclosed'] |
| Cooling Method & Water Usage | [from article or 'Not disclosed'] |
| Energy Source Profile | [from article or 'Not disclosed'] |
| Land Use & Footprint | [from article or 'Not disclosed'] |
| Carbon / Net-Zero Timeline | [from article or 'Not disclosed'] |
| Regulatory Status | [from article or 'Not disclosed'] |

### 5. LAND CONSERVATION & COMMUNITY IMPACT
[2-3 paragraphs on land use, community impact, any opposition. Close on your sharpest environmental observation.]

RULES:
- Never copy distinctive phrases from the original
- Never invent facts not in the source
- Write in {author_name}'s voice — environmentally grounded, specific, accountable
- Output ONLY the article. No preamble.

ORIGINAL ARTICLE TO REWRITE:
{article_body}"""


def parse_frontmatter(content: str):
    if not content.startswith("---"):
        return {}, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    fm_text = parts[1]
    body = parts[2].strip()

    fm = {}
    for line in fm_text.strip().split("\n"):
        if ":" in line:
            key, _, val = line.partition(":")
            fm[key.strip()] = val.strip().strip('"')
    return fm, body


def rewrite_article(filepath: Path, author_key: str):
    author = AUTHORS[author_key]
    print(f"\nRewriting: {filepath.name}")
    print(f"  Author: {author['name']}")

    content = filepath.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(content)

    if not body.strip():
        print("  → Empty body, skipping.")
        return

    client = anthropic.Anthropic(api_key=API_KEY)
    prompt = REWRITE_PROMPT.format(
        author_name=author["name"],
        author_title=author["title"],
        author_focus=author["focus"],
        article_body=body
    )

    print(f"  → Sending to {MODEL}...")
    message = client.messages.create(
        model=MODEL,
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    new_body = message.content[0].text.strip()

    # Extract new title from H1
    title_match = re.search(r'^#\s+(.+)$', new_body, re.MULTILINE)
    new_title = title_match.group(1).strip() if title_match else fm.get("title", "Untitled")
    body_only = new_body[title_match.end():].strip() if title_match else new_body

    # New excerpt from first real paragraph
    paragraphs = [p.strip() for p in body_only.split('\n\n')
                  if p.strip() and not p.strip().startswith('#') and not p.strip().startswith('|')]
    raw_excerpt = re.sub(r'[*_`#]', '', paragraphs[0]) if paragraphs else new_title
    raw_excerpt = raw_excerpt.replace('"', "'")
    if len(raw_excerpt) > 200:
        raw_excerpt = raw_excerpt[:200].rsplit(' ', 1)[0].rstrip('.,;:') + '...'

    new_frontmatter = f"""---
title: "{new_title.replace('"', "'")}"
date: {fm.get('date', date.today().isoformat())}
author: "{author['name']}"
authorKey: "{author_key}"
excerpt: "{raw_excerpt}"
category: "Sustainability"
tags: ["environmental impact", "data center sustainability", "water usage", "carbon emissions", "ecosystem"]
featured: {fm.get('featured', 'false')}
---

"""

    final_content = new_frontmatter + body_only + "\n"

    filepath.write_text(final_content, encoding="utf-8")

    # Sync to Astro
    astro_path = ASTRO_DIR / filepath.name
    astro_path.write_text(final_content, encoding="utf-8")

    print(f"  ✓ Done: {filepath.name}")


def main():
    if not API_KEY or API_KEY == "your_anthropic_api_key_here":
        print("ERROR: Add ANTHROPIC_API_KEY to your .env file first.")
        return

    articles = sorted(CONTENT_DIR.glob("*.md"))
    if not articles:
        print("No articles found in content/")
        return

    print(f"Rewriting {len(articles)} articles through the environmental lens...")
    print("Authors: Tanner South & Nathan South\n")

    author_keys = list(AUTHORS.keys())
    for i, filepath in enumerate(articles):
        # Alternate authors
        author_key = author_keys[i % 2]
        rewrite_article(filepath, author_key)

    print(f"\nAll {len(articles)} articles rewritten.")
    print("Commit with: git add content/ astro-site/src/content/articles/ && git commit -m 'rewrite: ecological lens, Tanner & Nathan South' && git push")


if __name__ == "__main__":
    main()
