"""
The Footprint - Daily Scheduler
Windows Task Scheduler runs this once at 9:00 AM.
It picks 3 random posting times between 9am-5pm ET,
then posts one article per author at each time and exits.
"""

import random
import time
import sys
from datetime import datetime, date
from pathlib import Path
from zoneinfo import ZoneInfo

# Always run from the project root regardless of where Task Scheduler calls from
PROJECT_ROOT = Path(__file__).parent.resolve()
sys.path.insert(0, str(PROJECT_ROOT))
import os
os.chdir(PROJECT_ROOT)

from dotenv import load_dotenv
load_dotenv(PROJECT_ROOT / ".env")

from main import run_article_pipeline, get_todays_authors, CONTENT_DIR
from tools.apify_tool import scrape_articles
from tools.git_publisher import publish_article
from authors.profiles import AUTHORS

ET = ZoneInfo("America/New_York")
LOG_FILE = Path(__file__).parent / "scheduler.log"


def log(msg: str):
    timestamp = datetime.now(ET).strftime("%Y-%m-%d %H:%M:%S ET")
    line = f"[{timestamp}] {msg}"
    print(line)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def pick_posting_times(count: int = 3) -> list[datetime]:
    """
    Pick `count` random posting times between 9am-5pm ET today.
    Times are guaranteed to be at least 45 minutes apart and in the future.
    """
    now = datetime.now(ET)
    today = now.date()

    # Available half-hour slots from 9:00 to 16:30
    slots = []
    for hour in range(9, 17):
        for minute in [0, 15, 30, 45]:
            dt = datetime(today.year, today.month, today.day,
                         hour, minute,
                         random.randint(0, 59),  # random seconds so it feels natural
                         tzinfo=ET)
            if dt > now:
                slots.append(dt)

    if len(slots) < count:
        log(f"WARNING: Only {len(slots)} future slots available today. Posting what we can.")
        count = len(slots)

    if count == 0:
        return []

    # Pick times that are at least 45 minutes apart
    chosen = []
    random.shuffle(slots)
    for slot in slots:
        too_close = any(abs((slot - c).total_seconds()) < 45 * 60 for c in chosen)
        if not too_close:
            chosen.append(slot)
        if len(chosen) == count:
            break

    # If we couldn't get enough spread-out slots, just take the first N
    if len(chosen) < count:
        chosen = sorted(slots)[:count]

    return sorted(chosen)


def sleep_until(target: datetime):
    """Sleep until the target time, logging a countdown."""
    now = datetime.now(ET)
    wait_seconds = (target - now).total_seconds()
    if wait_seconds <= 0:
        return
    wait_minutes = int(wait_seconds / 60)
    log(f"Sleeping {wait_minutes} minutes until {target.strftime('%I:%M %p ET')}...")
    time.sleep(wait_seconds)


def run():
    log("=" * 50)
    log("The Footprint daily run starting")
    log("=" * 50)

    articles_per_day = 2
    authors_today = get_todays_authors(articles_per_day)
    posting_times = pick_posting_times(articles_per_day)

    if not posting_times:
        log("No posting slots available today. Exiting.")
        return

    log(f"Today's authors: {[AUTHORS[a]['name'] for a in authors_today]}")
    log(f"Posting times:   {[t.strftime('%I:%M %p') for t in posting_times]}")

    # Scrape articles once upfront — enough for the whole day
    log("Scraping news sources...")
    try:
        articles = scrape_articles(num_articles=articles_per_day + 3)
    except Exception as e:
        log(f"Scraping failed: {e}")
        return

    if not articles:
        log("No articles found. Exiting.")
        return

    random.shuffle(articles)
    log(f"Fetched {len(articles)} articles to work from.")

    # Post one article at each scheduled time
    for i, (author_key, post_time) in enumerate(zip(authors_today, posting_times)):
        author_name = AUTHORS[author_key]["name"]
        article = articles[i % len(articles)]

        sleep_until(post_time)

        log(f"--- Article {i+1}/{len(posting_times)} ---")
        log(f"Author: {author_name}")
        log(f"Source: {article['title'][:60]}")

        try:
            filepath = run_article_pipeline(article, author_key)
            if filepath:
                log(f"Published: {Path(filepath).name}")
            else:
                log("Pipeline returned no article.")
        except Exception as e:
            log(f"Pipeline error: {e}")

    log("All articles written and committed for today.")
    log("Articles publish to the live site every 2 days via batched push.")
    log("=" * 50)


if __name__ == "__main__":
    run()
