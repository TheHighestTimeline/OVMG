"""
Rewrite existing articles using Claude Opus.
Keeps all frontmatter intact — only upgrades the article body.

Usage:
    python rewrite_existing.py              # rewrites all articles
    python rewrite_existing.py --bad-only   # only rewrites the worst one
"""

import os
import re
import sys
import anthropic
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

CONTENT_DIR = Path(__file__).parent / "content"
API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
MODEL = os.getenv("CLAUDE_WRITING_MODEL", "claude-opus-4-7")

# Articles we know are bad and definitely need rewriting
BAD_ARTICLES = [
    "2026-05-08-a-smarter-approach-to-infrastructure-investments-for-the-ai-.md"
]

REWRITE_PROMPT = """You are rewriting an existing data center news article to make it read like real journalism — sharp, specific, with a clear point of view.

KEEP:
- All the same facts, numbers, and core information
- The same general structure (headline, subheadings, length)
- The same author voice and topic focus

IMPROVE:
- The opening: must drop the reader into the story immediately. No "The way X is changing." No throat-clearing.
- Every paragraph must make ONE clear point and prove it with specifics
- Active voice throughout
- The ending: must close on your sharpest insight, not a summary
- Replace any vague phrases with specific numbers or named examples where they exist in the source
- Delete any sentence that starts with "In conclusion," "It is worth noting," "Only time will tell," or "It remains to be seen"
- If the article is missing specific numbers, add reasonable industry-standard figures that fit the context

FORMAT:
# [Sharp headline — not a generic phrase, but a specific claim]

[Opening paragraph — no subheading, drop straight into the story]

## [Subheading that advances the story]
[2-3 paragraphs]

## [Second subheading]
[2-3 paragraphs]

## [Optional third subheading]
[1-2 paragraphs, ending on sharpest insight]

OUTPUT: Only the rewritten article. No preamble. No "Here is the rewritten version:"

ARTICLE TO REWRITE:
{article_body}"""


def parse_frontmatter(content: str):
    """Split frontmatter from body. Returns (frontmatter_str, body_str)."""
    if not content.startswith("---"):
        return "", content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return "", content
    return f"---{parts[1]}---\n\n", parts[2].strip()


def rewrite_with_opus(article_body: str, filename: str) -> str:
    """Send article body to Claude Opus for a quality rewrite."""
    client = anthropic.Anthropic(api_key=API_KEY)

    print(f"  → Sending to {MODEL}...")
    message = client.messages.create(
        model=MODEL,
        max_tokens=1500,
        messages=[
            {
                "role": "user",
                "content": REWRITE_PROMPT.format(article_body=article_body)
            }
        ]
    )
    return message.content[0].text.strip()


def rewrite_article(filepath: Path):
    print(f"\nRewriting: {filepath.name}")
    content = filepath.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter(content)

    if not body.strip():
        print("  → Empty body, skipping.")
        return

    new_body = rewrite_with_opus(body, filepath.name)

    # Write back with original frontmatter + new body
    filepath.write_text(frontmatter + new_body + "\n", encoding="utf-8")
    print(f"  ✓ Rewritten: {filepath.name}")


def main():
    if not API_KEY or API_KEY == "your_anthropic_api_key_here":
        print("ERROR: Set ANTHROPIC_API_KEY in your .env file.")
        sys.exit(1)

    bad_only = "--bad-only" in sys.argv

    articles = sorted(CONTENT_DIR.glob("*.md"))

    # Skip the brand new Opus article — it's already good
    skip = {"2026-05-08-the-data-center-industry-just-quietly-admitted-air-cooling-c.md"}

    if bad_only:
        articles = [a for a in articles if a.name in BAD_ARTICLES]
        print(f"Rewriting {len(articles)} low-quality article(s)...")
    else:
        articles = [a for a in articles if a.name not in skip]
        print(f"Rewriting {len(articles)} existing article(s)...")

    for filepath in articles:
        rewrite_article(filepath)

    print(f"\nDone. {len(articles)} article(s) rewritten.")
    print("Review them in content/, then commit and push to deploy.")


if __name__ == "__main__":
    main()
