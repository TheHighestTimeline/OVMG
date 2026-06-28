"""Publisher Agent - formats and saves the final Markdown file."""
from crewai import Agent
from crewai.tools import tool
from pathlib import Path
import re
from datetime import date

CONTENT_DIR = Path(__file__).parent.parent / "content"


@tool("save_article")
def save_article(
    title: str,
    content: str,
    author_key: str,
    author_name: str,
    excerpt: str,
    category: str = "Infrastructure",
    tags: str = "data centers, technology"
) -> str:
    """
    Saves the article as a .md file with Astro-compatible frontmatter.
    Returns the saved file path.
    """
    CONTENT_DIR.mkdir(exist_ok=True)

    today = date.today().isoformat()

    # Build slug from title
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:60]
    filename = f"{today}-{slug}.md"
    filepath = CONTENT_DIR / filename

    # Clean excerpt
    clean_excerpt = excerpt.replace('"', "'").replace('\n', ' ')[:200]

    frontmatter = f"""---
title: "{title}"
date: {today}
author: "{author_name}"
authorKey: "{author_key}"
excerpt: "{clean_excerpt}"
category: "{category}"
tags: [{', '.join(f'"{t.strip()}"' for t in tags.split(','))}]
featured: false
---

"""
    full_content = frontmatter + content.strip()
    filepath.write_text(full_content, encoding="utf-8")

    print(f"[Publisher] Saved: {filepath}")
    return str(filepath)


def create_publisher(llm):
    return Agent(
        role="Content Publisher",
        goal="Format the final article with proper Astro frontmatter and save it as a Markdown file",
        backstory=(
            "You are a digital publishing specialist who ensures every article "
            "is properly formatted for the Astro static site generator. "
            "You write concise, accurate metadata and ensure the frontmatter is valid YAML."
        ),
        llm=llm,
        tools=[save_article],
        verbose=False,
        allow_delegation=False,
        max_iter=3
    )
