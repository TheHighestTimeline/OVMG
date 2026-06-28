"""
The Footprint Scheduler
Runs 3 articles per day at random times between 9am and 5pm.
Run this once when you boot your machine: python scheduler.py
"""

import time
import random
import logging
from datetime import datetime, timedelta
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("scheduler.log"),
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)

# How many articles to publish per day
ARTICLES_PER_DAY = 3

# Business hours window (24h format)
HOUR_START = 9
HOUR_END = 17

scheduler = BlockingScheduler(timezone="America/New_York")


def schedule_todays_runs():
    """
    Schedule ARTICLES_PER_DAY runs at random times within business hours today.
    Called once at startup and then at midnight each day.
    """
    now = datetime.now()
    scheduled_times = []

    for i in range(ARTICLES_PER_DAY):
        # Pick random hour and minute within business window
        hour = random.randint(HOUR_START, HOUR_END - 1)
        minute = random.randint(0, 59)

        # Ensure no two runs are within 1 hour of each other
        max_attempts = 50
        for _ in range(max_attempts):
            too_close = any(
                abs(hour * 60 + minute - (t[0] * 60 + t[1])) < 60
                for t in scheduled_times
            )
            if not too_close:
                break
            hour = random.randint(HOUR_START, HOUR_END - 1)
            minute = random.randint(0, 59)

        scheduled_times.append((hour, minute))

        run_time = now.replace(hour=hour, minute=minute, second=0, microsecond=0)

        # If time has passed today, skip (it'll be scheduled tomorrow via midnight reset)
        if run_time <= now:
            log.info(f"[Scheduler] Slot {i+1}: {hour:02d}:{minute:02d} already passed today, skipping")
            continue

        scheduler.add_job(
            run_pipeline,
            trigger="date",
            run_date=run_time,
            id=f"article_{i}_{now.date()}",
            replace_existing=True,
            misfire_grace_time=300
        )
        log.info(f"[Scheduler] Scheduled article {i+1} at {hour:02d}:{minute:02d}")

    log.info(f"[Scheduler] Today's schedule: {[f'{h:02d}:{m:02d}' for h, m in scheduled_times]}")


def run_pipeline():
    """Trigger one article pipeline run."""
    log.info("[Scheduler] Triggering article pipeline...")
    try:
        from main import run_daily_batch
        run_daily_batch(articles_per_run=1)
    except Exception as e:
        log.error(f"[Scheduler] Pipeline error: {e}")


def midnight_reset():
    """Re-schedule the next day's runs at midnight."""
    log.info("[Scheduler] Midnight reset - scheduling tomorrow's runs...")
    schedule_todays_runs()


if __name__ == "__main__":
    log.info("=" * 60)
    log.info("  The Footprint Scheduler Starting")
    log.info("  3 articles/day | 9am-5pm ET | Local Ollama LLM")
    log.info("=" * 60)

    # Schedule midnight reset
    scheduler.add_job(
        midnight_reset,
        CronTrigger(hour=0, minute=1),
        id="midnight_reset",
        replace_existing=True
    )

    # Schedule today's runs
    schedule_todays_runs()

    log.info("[Scheduler] Running. Press Ctrl+C to stop.")

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        log.info("[Scheduler] Stopped.")
