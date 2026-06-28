"""
The Footprint - Main Newsroom Orchestrator
3 articles per day. 4 authors rotate — one sits out each day, randomly.
"""

import os
import sys
import re
import random
from pathlib import Path
from datetime import date
from dotenv import load_dotenv

load_dotenv()

from crewai import Crew, Task, LLM
from agents.scout import create_scout
from agents.strategist import create_strategist
from agents.journalist import create_journalist
from authors.profiles import AUTHORS, AUTHOR_LIST
from tools.apify_tool import scrape_articles
from tools.git_publisher import publish_article
from tools.unsplash_tool import fetch_unsplash_image
from tools.plagiarism_check import check_plagiarism, log_plagiarism_result

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")
OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_WRITING_MODEL = os.getenv("CLAUDE_WRITING_MODEL", "claude-opus-4-7")

CONTENT_DIR = Path(__file__).parent / "content"
ASTRO_CONTENT_DIR = Path(__file__).parent / "astro-site" / "src" / "content" / "articles"


def get_ollama_llm():
    """Local Ollama — used for Scout and Strategist (fact extraction, no writing)."""
    return LLM(
        model=f"ollama/{OLLAMA_MODEL}",
        base_url=OLLAMA_URL,
        temperature=0.3,
    )


def get_claude_llm():
    """Claude Opus via Anthropic API — used ONLY for the Journalist writing step."""
    if not ANTHROPIC_API_KEY or ANTHROPIC_API_KEY == "your_anthropic_api_key_here":
        print("[Warning] No Anthropic API key set — falling back to Ollama for writing.")
        return get_ollama_llm()
    return LLM(
        model=f"anthropic/{CLAUDE_WRITING_MODEL}",
        api_key=ANTHROPIC_API_KEY,
    )


def get_todays_authors(articles_per_run: int = 2) -> list[str]:
    """
    1 article per author per day — always [tanner_south, nathan_south],
    posted in random order so it doesn't feel robotic.
    """
    roster = AUTHOR_LIST.copy()  # ["tanner_south", "nathan_south"]
    random.shuffle(roster)

    print(f"[Newsroom] Today's lineup:")
    for i, a in enumerate(roster, 1):
        print(f"  Article {i}: {AUTHORS[a]['name']}")

    return roster


def save_article_to_file(article_text: str, author_key: str, author_name: str, image_meta: dict | None = None) -> str | None:
    """Save article text to .md with Astro frontmatter. Returns filepath."""
    CONTENT_DIR.mkdir(exist_ok=True)

    today = date.today().isoformat()

    # Extract H1 title
    title_match = re.search(r'^#\s+(.+)$', article_text, re.MULTILINE)
    if title_match:
        title = title_match.group(1).strip()
        body = article_text[title_match.end():].strip()
    else:
        lines = [l.strip() for l in article_text.split('\n') if l.strip()]
        title = lines[0].replace('#', '').strip() if lines else "Untitled"
        body = article_text.strip()

    # Slug
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:60]
    filename = f"{today}-{slug}.md"
    filepath = CONTENT_DIR / filename

    # Excerpt from first real paragraph
    paragraphs = [p.strip() for p in body.split('\n\n') if p.strip() and not p.strip().startswith('#')]
    raw_excerpt = re.sub(r'[*_`]', '', paragraphs[0]).replace('"', "'") if paragraphs else title
    if len(raw_excerpt) > 200:
        raw_excerpt = raw_excerpt[:200].rsplit(' ', 1)[0].rstrip('.,;:') + '...'
    excerpt = raw_excerpt

    # Category from author topics
    author = AUTHORS[author_key]
    topic_category_map = {
        "sustainability": "Sustainability", "energy": "Sustainability", "policy": "Policy",
        "renewable": "Sustainability", "water": "Sustainability",
        "M&A": "Markets", "market": "Markets", "investment": "Markets",
        "REIT": "Markets", "finance": "Markets",
        "AI": "AI", "cloud": "Cloud",
        "colocation": "Infrastructure", "hyperscale": "Infrastructure",
        "power": "Infrastructure", "cooling": "Infrastructure",
    }
    category = "Infrastructure"
    for topic in author["topics"]:
        for key, cat in topic_category_map.items():
            if key.lower() in topic.lower():
                category = cat
                break

    tags = ', '.join(f'"{t}"' for t in author["topics"][:4])

    # Build image frontmatter lines
    image_lines = ""
    if image_meta:
        image_lines = (
            f'image: "{image_meta["path"]}"\n'
            f'imageAlt: "{image_meta["alt"].replace(chr(34), chr(39))}"\n'
            f'imageCreditName: "{image_meta["credit_name"]}"\n'
            f'imageCreditUrl: "{image_meta["credit_url"]}"\n'
            f'imageUnsplashUrl: "{image_meta["unsplash_url"]}"\n'
        )

    frontmatter = f"""---
title: "{title.replace('"', "'")}"
date: {today}
author: "{author_name}"
authorKey: "{author_key}"
excerpt: "{excerpt}"
category: "{category}"
tags: [{tags}]
featured: false
{image_lines}---

"""
    filepath.write_text(frontmatter + body, encoding="utf-8")
    print(f"[Main] Saved: {filepath.name}")

    # Also write to Astro content folder so Netlify picks it up
    ASTRO_CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    astro_filepath = ASTRO_CONTENT_DIR / filename
    astro_filepath.write_text(frontmatter + body, encoding="utf-8")
    print(f"[Main] Synced to Astro: {filename}")

    return str(filepath)


def run_article_pipeline(article: dict, author_key: str) -> str | None:
    """Scout -> Strategist -> Journalist pipeline."""
    author = AUTHORS[author_key]
    ollama_llm = get_ollama_llm()
    claude_llm = get_claude_llm()

    print(f"\n{'='*60}")
    print(f"  Story: {article['title'][:55]}")
    print(f"  Writer: {author['name']} — {author['title']}")
    print(f"  Scout/Strategist: Ollama/{OLLAMA_MODEL}  |  Journalist: {CLAUDE_WRITING_MODEL}")
    print(f"{'='*60}\n")

    scout      = create_scout(ollama_llm)
    strategist = create_strategist(ollama_llm)
    journalist = create_journalist(claude_llm, author)

    # Build multi-source content block for the Scout
    sources = article.get("sources", [article])
    source_blocks = []
    for i, src in enumerate(sources, 1):
        source_blocks.append(
            f"--- SOURCE {i}: {src['source']} ---\n"
            f"Title: {src['title']}\n"
            f"URL: {src['url']}\n\n"
            f"{src['body'][:4000]}"
        )
    combined_sources = "\n\n".join(source_blocks)
    source_count = len(sources)
    synthesis_note = (
        f"You have {source_count} source article(s) covering this story. "
        + ("Synthesize across all of them — pull unique facts from each and note contradictions."
           if source_count > 1 else "Extract every concrete fact available.")
    )

    scrape_task = Task(
        description=(
            f"{synthesis_note}\n\n"
            f"{combined_sources}\n\n"
            "Extract the REAL news. Every bullet must contain at least one concrete fact. "
            "Ignore ads, navigation, related articles, and boilerplate. "
            "If multiple sources agree on a fact, note that. "
            "If they contradict each other, flag it explicitly."
        ),
        agent=scout,
        expected_output=(
            "8-12 bullet points. Each bullet contains a specific fact. "
            "Covers: what happened, key numbers, who's involved, quotes, why now, what's at stake. "
            "If multiple sources: ends with SYNTHESIS NOTE revealing what the combination shows."
        )
    )

    analyze_task = Task(
        description=(
            "Using the Scout's fact brief, develop the editorial angle for this story.\n\n"
            "YOU MUST PRODUCE:\n"
            "1. THESIS (one sentence): The single arguable claim this article will prove\n"
            "2. ANGLE: Which story frame fits best and why\n"
            "3. OPENING HOOK: A specific suggested first sentence\n"
            "4. KEY TENSION: The conflict at the heart of this story\n"
            "5. NUMBERS TO FEATURE: The 2-3 most powerful figures from the brief\n"
            "6. WHAT TO AVOID: Any PR framing or spin to cut through\n\n"
            f"Tailor this for {author['name']}, whose expertise is "
            f"{', '.join(author['topics'][:3])}. "
            "Be opinionated. Vague briefs produce vague articles."
        ),
        agent=strategist,
        expected_output=(
            "A sharp editorial brief with thesis, angle, hook, tension, "
            "featured numbers, and spin-busting notes. 200-250 words."
        ),
        context=[scrape_task]
    )

    write_task = Task(
        description=(
            f"Write a The Footprint environmental analysis article as {author['name']}, {author['title']}.\n\n"
            "USE THE STRATEGIST'S BRIEF for thesis, angle, and key tensions.\n\n"
            "The Footprint covers data center infrastructure through a strict ecological lens. "
            "This is not a standard tech news article. It is an environmental accountability piece.\n\n"

            "USE THIS EXACT 5-PART STRUCTURE:\n\n"

            "# [Headline]\n"
            "Ecologically specific. Makes a claim about environmental impact, not just the announcement. "
            "Example: not 'Microsoft Opens 500MW Campus' but "
            "'Microsoft's 500MW Virginia Campus Will Drain 1.2 Million Gallons Daily From an Already-Stressed Watershed'\n\n"

            "### 1. THE ECOLOGICAL DEVELOPMENT BRIEF\n"
            "2-3 paragraphs synthesizing the core facts from ALL provided sources. "
            "Focus on scale, timeline, and location. Attribute the primary breaking news source explicitly: "
            "'As first reported by [outlet]...' "
            "Each paragraph 3-5 sentences. No copied phrasing from sources.\n\n"

            "### 2. WATER & COOLING IMPACT ANALYSIS\n"
            "2-3 paragraphs. Analyze the project's water footprint. "
            "Detail the cooling method (evaporative, closed-loop, air-cooled, liquid immersion). "
            "Estimate or report daily water consumption. Discuss the local hydrology — "
            "what watershed, river system, or aquifer is involved? "
            "What happens to the water downstream? Name the ecosystem.\n\n"

            "### 3. POWER GRID & EMISSIONS PROFILE\n"
            "2-3 paragraphs. Where does the power come from — fossil, nuclear, renewables, or grid mix? "
            "What is the facility's MW demand and projected annual carbon footprint? "
            "Examine any net-zero claims critically — what does their timeline actually require? "
            "Is the renewable energy sourced locally or through RECs purchased elsewhere?\n\n"

            "### 4. SUSTAINABILITY METRICS\n"
            "A clean markdown table of environmental and technical specs from the source material ONLY. "
            "Use this format exactly:\n"
            "| Ecological & Technical Metric | Project Specification |\n"
            "| :--- | :--- |\n"
            "| Power Capacity & PUE Goal | [from sources] |\n"
            "| Cooling Method & Water Usage | [from sources] |\n"
            "| Energy Source Profile | [from sources] |\n"
            "| Land Use & Footprint | [from sources] |\n"
            "| Carbon / Net-Zero Timeline | [from sources] |\n"
            "| Regulatory Status | [from sources] |\n"
            "Only include rows where the data exists in the source material. "
            "Write 'Not disclosed' if the company hasn't reported a metric.\n\n"

            "### 5. LAND CONSERVATION & COMMUNITY IMPACT\n"
            "2-3 paragraphs. What land was cleared or rezoned? Agricultural, wetland, forest, or corridor? "
            "Is there documented community pushback, legal challenges, or environmental group opposition? "
            "What is the noise, light, or traffic impact on surrounding areas? "
            "Close the entire article on your sharpest, most specific environmental observation — "
            "something that reframes the announcement and sticks with the reader.\n\n"

            "NON-NEGOTIABLE RULES:\n"
            "- 900-1100 words total\n"
            "- NEVER copy distinctive phrases, metaphors, or sentence structures from the source texts\n"
            "- ONLY use facts from the provided sources — do not invent data\n"
            "- If a metric is missing from sources, write 'Not disclosed by [company]' — never fabricate\n"
            "- Every paragraph minimum 3 sentences\n"
            "- Forbidden phrases: 'It is worth noting', 'In conclusion', 'Only time will tell'\n"
            "- Output ONLY the article. No preamble. No 'Here is the article:'"
        ),
        agent=journalist,
        expected_output=(
            "A 900-1100 word environmental analysis article. # H1 headline. "
            "5 sections using ### H3 headers. Sustainability metrics table. "
            "Ecologically grounded, source-verified facts only. "
            "Reads like serious environmental journalism. Ends on a sharp ecological observation."
        ),
        context=[scrape_task, analyze_task]
    )

    crew = Crew(
        agents=[scout, strategist, journalist],
        tasks=[scrape_task, analyze_task, write_task],
        verbose=False
    )

    try:
        result = crew.kickoff()
        article_text = str(result.raw) if hasattr(result, 'raw') else str(result)

        if len(article_text.strip()) < 200:
            print("[Main] Article too short, skipping.")
            return None

        # --- Plagiarism guardrail ---
        plagiarism_log = Path(__file__).parent / "plagiarism.log"
        plag_result = check_plagiarism(
            generated_article=article_text,
            source_content=article["body"],
            article_title=article["title"]
        )
        log_plagiarism_result(plag_result, log_path=str(plagiarism_log))

        if plag_result["status"] == "REJECT":
            print("[Main] Article rejected by plagiarism check. Skipping.")
            return None

        # --- Fetch Unsplash image ---
        tags_list = [t.strip() for t in author["topics"][:4]]
        image_meta = fetch_unsplash_image(
            title=article_text.split("\n")[0].replace("#", "").strip(),
            slug=re.sub(r"[^a-z0-9]+", "-",
                        article_text.split("\n")[0].replace("#", "").strip().lower()).strip("-")[:60],
            tags=tags_list,
            category=author.get("topics", ["Infrastructure"])[0]
        )

        filepath = save_article_to_file(article_text, author_key, author["name"], image_meta)
        if filepath:
            publish_article(filepath)
            return filepath

    except Exception as e:
        print(f"[Main] Pipeline error: {e}")
        return None


def run_daily_batch(articles_per_run: int = 3):
    print("\n[The Footprint] Starting daily newsroom run...")

    try:
        articles = scrape_articles(num_articles=articles_per_run + 3)
    except Exception as e:
        print(f"[Main] Scraping failed: {e}")
        return

    if not articles:
        print("[Main] No articles fetched.")
        return

    authors_today = get_todays_authors(articles_per_run)
    random.shuffle(articles)

    published = 0
    for article, author_key in zip(articles[:articles_per_run], authors_today):
        filepath = run_article_pipeline(article, author_key)
        if filepath:
            published += 1
        print(f"[Main] Progress: {published}/{articles_per_run} published\n")

    print(f"\n[The Footprint] Done. Published {published} articles today.")


if __name__ == "__main__":
    articles_count = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    run_daily_batch(articles_per_run=articles_count)
