"""
Plagiarism guardrail.
Checks generated articles against source content for two issues:

1. EXACT PHRASE COPYING — looks for verbatim sequences of 8+ words
   copied from the source into the generated article.

2. HIGH SIMILARITY — uses word overlap to measure how much of the
   generated article's vocabulary comes directly from the source.

If either threshold is breached, the article is flagged and logged.
A REJECT result means the pipeline skips the article rather than publishing.
"""

import re
from collections import Counter


def normalize(text: str) -> str:
    """Lowercase, strip punctuation, collapse whitespace."""
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def get_ngrams(text: str, n: int) -> set[str]:
    """Return all n-grams from normalized text as a set of strings."""
    words = normalize(text).split()
    return {" ".join(words[i:i+n]) for i in range(len(words) - n + 1)}


def word_overlap_ratio(generated: str, source: str) -> float:
    """
    What fraction of the generated article's unique words also appear in the source?
    High overlap = the article is too close to the source vocabulary.
    """
    gen_words = set(normalize(generated).split())
    src_words = set(normalize(source).split())

    # Remove very common English words from the check
    stop_words = {
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "is", "are", "was", "were", "has", "have",
        "had", "that", "this", "it", "as", "its", "be", "been", "do", "does",
        "did", "will", "would", "could", "should", "may", "might", "can", "not",
        "no", "if", "so", "we", "he", "she", "they", "their", "which", "who",
        "what", "when", "where", "how", "than", "then", "also", "said", "says",
        "new", "more", "all", "about", "up", "out", "over", "i", "you", "your"
    }
    gen_meaningful = gen_words - stop_words
    src_meaningful = src_words - stop_words

    if not gen_meaningful:
        return 0.0

    overlap = gen_meaningful & src_meaningful
    return len(overlap) / len(gen_meaningful)


def check_plagiarism(generated_article: str, source_content: str, article_title: str = "") -> dict:
    """
    Run both plagiarism checks. Returns a result dict with:
    - status: "PASS", "WARN", or "REJECT"
    - copied_phrases: list of verbatim phrases found (8+ words)
    - overlap_ratio: float 0-1
    - message: human-readable summary
    """
    result = {
        "status": "PASS",
        "copied_phrases": [],
        "overlap_ratio": 0.0,
        "message": "",
    }

    if not source_content or not generated_article:
        result["message"] = "Skipped — no source content to check against."
        return result

    # --- Check 1: Exact phrase copying (8-word n-grams) ---
    gen_ngrams = get_ngrams(generated_article, 8)
    src_ngrams = get_ngrams(source_content, 8)
    copied = gen_ngrams & src_ngrams

    # Filter out very generic industry phrases that appear everywhere
    generic_phrases = {
        "data center industry has seen significant",
        "the next few years as demand",
        "in the united states and around",
    }
    copied = {p for p in copied if p not in generic_phrases}
    result["copied_phrases"] = sorted(copied)

    # --- Check 2: Vocabulary overlap ---
    overlap = word_overlap_ratio(generated_article, source_content)
    result["overlap_ratio"] = round(overlap, 3)

    # --- Determine status ---
    if len(copied) >= 3 or overlap > 0.75:
        result["status"] = "REJECT"
        result["message"] = (
            f"REJECT: {len(copied)} exact phrases copied, {overlap:.0%} vocabulary overlap. "
            f"Article '{article_title}' is too close to source. Skipping."
        )
    elif len(copied) >= 1 or overlap > 0.60:
        result["status"] = "WARN"
        result["message"] = (
            f"WARN: {len(copied)} possible copied phrases, {overlap:.0%} vocabulary overlap. "
            f"Article '{article_title}' published but flagged for review."
        )
    else:
        result["status"] = "PASS"
        result["message"] = (
            f"PASS: 0 copied phrases, {overlap:.0%} overlap. Article is original."
        )

    return result


def log_plagiarism_result(result: dict, log_path=None):
    """Print result and optionally append to a log file."""
    status = result["status"]
    symbol = {"PASS": "✓", "WARN": "⚠", "REJECT": "✗"}.get(status, "?")
    print(f"[Plagiarism] {symbol} {result['message']}")

    if result["copied_phrases"]:
        print(f"[Plagiarism] Copied phrases found:")
        for phrase in result["copied_phrases"][:5]:  # Show first 5 max
            print(f"  → '{phrase}'")

    if log_path and result["status"] != "PASS":
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(f"{result['status']} | {result['message']}\n")
            for phrase in result["copied_phrases"]:
                f.write(f"  PHRASE: {phrase}\n")
            f.write("\n")
