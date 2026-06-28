"""
Unsplash image fetcher.
Searches for a relevant photo based on article keywords and saves it locally.
Free tier: 50 requests/hour — more than enough for 3 articles/day.

Unsplash API terms require linking back to the photographer and Unsplash.
We store that credit in the frontmatter and display it on the article page.
"""

import os
import re
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "")
IMAGES_DIR = Path(__file__).parent.parent / "astro-site" / "public" / "images" / "articles"

# Fallback search terms if article keywords don't return results
CATEGORY_FALLBACKS = {
    "Infrastructure": ["data center server room", "server rack", "data center"],
    "AI": ["artificial intelligence computing", "gpu cluster", "data center AI"],
    "Cloud": ["cloud computing data center", "network infrastructure", "server"],
    "Sustainability": ["renewable energy data center", "solar power", "green energy"],
    "Markets": ["technology business", "data center investment", "infrastructure finance"],
    "Policy": ["technology policy", "government technology", "regulation technology"],
}


def build_search_query(title: str, tags: list[str], category: str) -> str:
    """Build a focused search query from the article metadata."""
    # Pull meaningful words from title (skip stop words)
    stop_words = {"the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
                  "for", "of", "with", "by", "from", "is", "are", "was", "has",
                  "have", "that", "this", "it", "as", "its", "just", "how", "why",
                  "what", "can", "will", "may", "not", "be", "been", "do", "does"}
    title_words = [w for w in re.sub(r"[^a-zA-Z\s]", "", title.lower()).split()
                   if w not in stop_words and len(w) > 3]

    # Combine with most relevant tag
    key_terms = title_words[:3]
    if tags:
        key_terms.append(tags[0])

    query = " ".join(key_terms[:4])

    # Always bias toward data center imagery
    if "data center" not in query.lower():
        query = f"data center {query}"

    return query


def fetch_unsplash_image(title: str, slug: str, tags: list[str], category: str) -> dict | None:
    """
    Fetch a relevant image from Unsplash and save it to the Astro public folder.
    Returns image metadata dict or None if it fails.
    """
    if not UNSPLASH_ACCESS_KEY or UNSPLASH_ACCESS_KEY == "your_unsplash_key_here":
        print("[Unsplash] No API key set — skipping image fetch.")
        return None

    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    query = build_search_query(title, tags, category)
    print(f"[Unsplash] Searching: '{query}'")

    headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}
    params = {
        "query": query,
        "orientation": "landscape",
        "content_filter": "high",
        "per_page": 5,
    }

    try:
        resp = requests.get(
            "https://api.unsplash.com/search/photos",
            headers=headers,
            params=params,
            timeout=10
        )
        resp.raise_for_status()
        data = resp.json()
        results = data.get("results", [])

        # Try fallback if no results
        if not results:
            fallback = CATEGORY_FALLBACKS.get(category, ["data center server"])[0]
            print(f"[Unsplash] No results, trying fallback: '{fallback}'")
            params["query"] = fallback
            resp = requests.get(
                "https://api.unsplash.com/search/photos",
                headers=headers,
                params=params,
                timeout=10
            )
            resp.raise_for_status()
            results = resp.json().get("results", [])

        if not results:
            print("[Unsplash] No images found.")
            return None

        photo = results[0]
        image_url = photo["urls"]["regular"]  # 1080px wide — good for web
        photographer = photo["user"]["name"]
        photographer_url = photo["user"]["links"]["html"]
        unsplash_photo_url = photo["links"]["html"]
        alt_description = photo.get("alt_description") or photo.get("description") or title

        # Download and save the image
        img_filename = f"{slug}.jpg"
        img_path = IMAGES_DIR / img_filename

        img_resp = requests.get(image_url, timeout=20)
        img_resp.raise_for_status()
        img_path.write_bytes(img_resp.content)

        # Trigger Unsplash download endpoint (required by their API terms)
        download_url = photo["links"]["download_location"]
        requests.get(download_url, headers=headers, timeout=5)

        print(f"[Unsplash] Saved: {img_filename} (photo by {photographer})")

        return {
            "path": f"/images/articles/{img_filename}",
            "alt": alt_description,
            "credit_name": photographer,
            "credit_url": f"{photographer_url}?utm_source=datacenter_pulse&utm_medium=referral",
            "unsplash_url": f"{unsplash_photo_url}?utm_source=datacenter_pulse&utm_medium=referral",
        }

    except Exception as e:
        print(f"[Unsplash] Error: {e}")
        return None
