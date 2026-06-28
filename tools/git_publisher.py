"""
Git publisher - commits new .md files and pushes to GitHub.
Netlify auto-deploys on push.

Articles are committed locally every day but only pushed every 2 days,
so 4 articles (2 days worth) go live at once — one build every 2 days.
"""

import subprocess
from datetime import date
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "content"
ASTRO_CONTENT_DIR = Path(__file__).parent.parent / "astro-site" / "src" / "content" / "articles"
LAST_PUSH_FILE = Path(__file__).parent.parent / ".last_push_date"


def _should_push() -> bool:
    """Return True if it's been 2+ days since the last push."""
    if not LAST_PUSH_FILE.exists():
        return True
    try:
        last = date.fromisoformat(LAST_PUSH_FILE.read_text().strip())
        return (date.today() - last).days >= 2
    except Exception:
        return True


def _record_push():
    LAST_PUSH_FILE.write_text(date.today().isoformat())


def git_push(repo_root: Path) -> bool:
    result = subprocess.run(
        ["git", "push"],
        cwd=repo_root, capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"[Git] git push failed: {result.stderr}")
        return False
    print("[Git] Pushed to GitHub — Netlify build triggered.")
    _record_push()
    return True


def publish_article(filepath: str, force_push: bool = False) -> bool:
    """
    Copy article to astro-site, git add + commit.
    Only pushes if 2+ days have passed since last push (or force_push=True).
    Returns True on success.
    """
    try:
        src = Path(filepath)
        if not src.exists():
            print(f"[Git] File not found: {filepath}")
            return False

        # Copy to astro-site content dir
        ASTRO_CONTENT_DIR.mkdir(parents=True, exist_ok=True)
        dest = ASTRO_CONTENT_DIR / src.name
        dest.write_text(src.read_text(encoding="utf-8"), encoding="utf-8")

        repo_root = Path(__file__).parent.parent

        # Stage the file
        result = subprocess.run(
            ["git", "add", str(dest)],
            cwd=repo_root, capture_output=True, text=True
        )
        if result.returncode != 0:
            print(f"[Git] git add failed: {result.stderr}")
            return False

        # Commit locally
        commit_msg = f"publish: {src.stem}"
        result = subprocess.run(
            ["git", "commit", "-m", commit_msg],
            cwd=repo_root, capture_output=True, text=True
        )
        if result.returncode != 0:
            print(f"[Git] git commit failed: {result.stderr}")
            return False

        print(f"[Git] Committed: {src.name}")

        # Push only every 2 days (or if forced)
        if force_push or _should_push():
            git_push(repo_root)
        else:
            print("[Git] Holding push — will deploy with next batch.")

        return True

    except Exception as e:
        print(f"[Git] Error publishing: {e}")
        return False
