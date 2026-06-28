"""
Apify scraping tool for The Footprint.
Scrapes 15 approved sources across all site categories.
Groups related articles together so the Scout can synthesize multiple sources.
"""

import os
import re
import random
from apify_client import ApifyClient
from typing import Optional

# 15 sources spread across all categories
APPROVED_SOURCES = {
    # Infrastructure
    "https://www.datacenterdynamics.com/en/news/":       "Infrastructure",
    "https://www.datacenterknowledge.com/":              "Infrastructure",
    "https://www.datacenterfrontier.com/":               "Infrastructure",
    "https://edgeir.com/":                               "Infrastructure",
    "https://www.thestack.technology/category/data-centres/": "Infrastructure",

    # AI / Cloud
    "https://www.nextplatform.com/":                     "AI",
    "https://siliconangle.com/category/cloud/data-centers/": "Cloud",
    "https://arstechnica.com/tag/data-center/":          "Cloud",
    "https://venturebeat.com/category/ai/":              "AI",
    "https://www.theregister.com/data_centre/":          "Cloud",

    # Markets / Business
    "https://www.crn.com/news/data-center":              "Markets",
    "https://www.bisnow.com/national/data-center":       "Markets",

    # Sustainability
    "https://www.greenbiz.com/technology":               "Sustainability",
    "https://www.datacenterdynamics.com/en/analysis/":   "Sustainability",

    # Policy / Regulation
    "https://www.axios.com/technology":                  "Policy",
}


def extract_keywords(title: str) -> set[str]:
    """Pull meaningful keywords from a title for topic grouping."""
    stop_words = {
        "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "of",
        "with", "by", "from", "is", "are", "was", "has", "how", "why", "what",
        "new", "will", "can", "its", "as", "it", "be", "this", "that", "into",
        "data", "center", "centres", "centers", "datacenter",  # too common on this site
    }
    words = re.sub(r"[^a-zA-Z\s]", " ", title.lower()).split()
    return {w for w in words if len(w) > 3 and w not in stop_words}


def group_related_articles(articles: list[dict], min_overlap: int = 2) -> list[list[dict]]:
    """
    Group articles that share at least `min_overlap` keywords in their titles.
    Each group represents multiple sources covering the same story.
    Returns list of groups (each group is a list of 1-3 articles).
    """
    used = set()
    groups = []

    for i, article in enumerate(articles):
        if i in used:
            continue
        kw_i = extract_keywords(article["title"])
        group = [article]
        used.add(i)

        for j, other in enumerate(articles):
            if j in used or j == i:
                continue
            kw_j = extract_keywords(other["title"])
            overlap = kw_i & kw_j
            if len(overlap) >= min_overlap:
                group.append(other)
                used.add(j)
            if len(group) >= 3:  # cap at 3 sources per story
                break

        groups.append(group)

    return groups


def scrape_articles(num_articles: int = 4, apify_token: Optional[str] = None) -> list[dict]:
    """
    Scrape fresh articles from approved data center news sources.
    Returns a list of story dicts. Each dict may contain multiple source articles
    bundled under 'sources' for multi-source synthesis.

    Keys per item:
      url, title, body       — primary/lead article
      sources                — list of {url, title, body, source} for all related articles
      source                 — domain of lead article
      category               — inferred category
    """
    token = apify_token or os.getenv("APIFY_API_TOKEN")
    if not token:
        raise ValueError("APIFY_API_TOKEN not set in environment")

    client = ApifyClient(token)

    # Rotate through sources — pick 8 each run so we don't always hit the same ones
    all_urls = list(APPROVED_SOURCES.keys())
    selected_urls = random.sample(all_urls, min(8, len(all_urls)))

    print(f"[Apify] Scraping {len(selected_urls)} sources for {num_articles} story groups...")

    run_input = {
        "startUrls": [{"url": url} for url in selected_urls],
        "maxCrawlDepth": 2,
        "maxCrawlPages": 35,
        "crawlerType": "cheerio",
        "excludeUrlGlobs": [
            "**/tag/**", "**/author/**", "**/page/[2-9]/**",
            "**/search/**", "**/login/**", "**/subscribe/**",
            "**/about/**", "**/contact/**", "**/advertise/**",
            "**/privacy/**", "**/terms/**", "**/newsletter/**",
            "**/podcast/**", "**/video/**", "**/webinar/**",
        ],
        "htmlTransformer": "readableText",
        "removeCookieWarnings": True,
        "useSitemaps": False,
        "saveFiles": False,
        "saveScreenshots": False,
        "proxyConfiguration": {"useApifyProxy": True},
    }

    run = client.actor("apify/website-content-crawler").call(run_input=run_input)
    dataset = client.dataset(run["defaultDatasetId"])

    raw_articles = []
    for item in dataset.iterate_items():
        text = item.get("text", "").strip()
        url = item.get("url", "")
        title = item.get("metadata", {}).get("title", "").strip()

        if len(text) < 600:
            continue
        if not title or title.lower() in ["404", "not found", "page not found", "home"]:
            continue
        path = url.split("//")[-1].split("/", 1)[-1] if "//" in url else ""
        if len(path.strip("/")) < 5:
            continue

        source_domain = url.split("/")[2] if url.count("/") >= 2 else url
        category = next(
            (cat for src_url, cat in APPROVED_SOURCES.items() if source_domain in src_url),
            "Infrastructure"
        )

        raw_articles.append({
            "url": url,
            "title": title,
            "body": text[:8000],
            "source": source_domain,
            "category": category,
        })

    print(f"[Apify] Collected {len(raw_articles)} raw articles. Grouping by topic...")

    # Group related articles together
    groups = group_related_articles(raw_articles, min_overlap=2)

    # Build final story dicts — lead article + bundled sources
    stories = []
    for group in groups:
        lead = group[0]
        story = {
            "url": lead["url"],
            "title": lead["title"],
            "body": lead["body"],
            "source": lead["source"],
            "category": lead["category"],
            "sources": group,  # all related articles including lead
        }
        stories.append(story)

    # Shuffle and return enough for the batch
    random.shuffle(stories)
    selected = stories[:num_articles + 3]

    multi_source = sum(1 for s in selected if len(s["sources"]) > 1)
    print(f"[Apify] {len(selected)} stories ready. {multi_source} have multiple sources for synthesis.")
    return selected
