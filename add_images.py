# DataCenter Pulse

An automated data center news website powered by CrewAI multi-agent pipelines, Ollama (local LLM), Apify scraping, and Astro for the front end. Publishes 3 original, AI-written articles per day to a Netlify-hosted site, completely free (except Apify scraping credits).

---

## Architecture

```
Apify Scraper → Scout Agent → Strategist Agent → Journalist Agent → Publisher Agent
                                                                          ↓
                                                              content/*.md (local)
                                                                          ↓
                                                          astro-site/src/content/articles/
                                                                          ↓
                                                              git commit + push → GitHub
                                                                          ↓
                                                              Netlify auto-deploy
```

**Agents:**
- **Scout** – Extracts core news facts from raw scraped content
- **Strategist** – Develops the editorial angle and writes a brief
- **Journalist** – Writes a 400-word original article in the author's voice
- **Publisher** – Formats with Astro frontmatter and saves as Markdown

**Authors:** Jordan Reed, Maya Chen, Marcus Webb, Priya Nair (rotating)

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Python | 3.11+ | `python --version` |
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| Ollama | Latest | [ollama.ai](https://ollama.ai) |
| Git | Any | For auto-publishing |

---

## First-Time Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/datacenter-pulse.git
cd datacenter-pulse
```

### 2. Run the automated setup script

```bash
bash setup.sh
```

This will:
- Create a Python virtual environment (`venv/`)
- Install all Python dependencies from `requirements.txt`
- Copy `.env.example` → `.env`
- Pull the `llama3` model via Ollama (if Ollama is installed)
- Initialize git and make the initial commit
- Install Astro npm dependencies

### 3. Manual setup (if you prefer not to use setup.sh)

```bash
# Python environment
python -m venv venv
source venv/bin/activate          # Mac/Linux
# OR
venv\Scripts\activate             # Windows

pip install -r requirements.txt

# Astro site
cd astro-site
npm install
cd ..
```

---

## Environment Variables

Edit the `.env` file in the project root:

```bash
# Required
APIFY_API_TOKEN=your_apify_token_here

# Optional (these are the defaults)
OLLAMA_MODEL=llama3
OLLAMA_BASE_URL=http://localhost:11434

# Set this after creating your GitHub repo
GITHUB_REPO_URL=https://github.com/yourusername/datacenter-pulse.git
```

---

## Apify Setup

1. Sign up or log in at [console.apify.com](https://console.apify.com)
2. Go to **Settings → Integrations → API tokens**
3. Copy your API token
4. Paste it in `.env` as `APIFY_API_TOKEN`

The project uses the **Apify Website Content Crawler** actor (`apify/website-content-crawler`). Each daily run costs a small amount of Apify credits (typically < $0.10).

---

## Ollama Setup

Ollama runs the LLM locally — no API costs, no rate limits.

```bash
# 1. Install Ollama
# Mac: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh
# Windows: download from https://ollama.ai/download

# 2. Start Ollama (keep this running in background)
ollama serve

# 3. Pull the llama3 model (one-time, ~4.7GB download)
ollama pull llama3

# 4. Verify it works
ollama run llama3 "Hello, test"
```

**Using a different model:** Edit `OLLAMA_MODEL` in `.env`. Any model listed in `ollama list` will work. `llama3.2` or `mistral` are good alternatives if you want faster runs.

---

## GitHub Repository Setup

```bash
# 1. Create a new repo on github.com (keep it public for free Netlify)
# 2. Connect your local project

git remote add origin https://github.com/yourusername/datacenter-pulse.git
git branch -M main
git push -u origin main
```

---

## Netlify Deployment

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
2. Connect your GitHub account and select the `datacenter-pulse` repo
3. Set build settings:
   - **Base directory:** `astro-site`
   - **Build command:** `npm run build`
   - **Publish directory:** `astro-site/dist`
4. Click **Deploy site**

Netlify will auto-deploy every time your GitHub repo is pushed to (which happens automatically each time an article is published).

The `netlify.toml` file in `astro-site/` handles these settings automatically.

---

## Running the Scheduler

The scheduler publishes 3 articles per day at random times between 9am–5pm ET.

```bash
# Activate your virtual environment first
source venv/bin/activate

# Start the scheduler (keep this running)
python scheduler.py
```

To run it persistently in the background on Mac/Linux:

```bash
nohup python scheduler.py > scheduler.log 2>&1 &
```

---

## Running a Manual Test

To immediately publish one article (useful for testing your setup):

```bash
source venv/bin/activate
python main.py 1
```

To publish 3 articles right now:

```bash
python main.py 3
```

---

## Adding More News Sources

Edit `tools/apify_tool.py` and add URLs to the `APPROVED_SOURCES` list:

```python
APPROVED_SOURCES = [
    "https://www.datacenterdynamics.com",
    # Add your source here:
    "https://www.yoursource.com/news/",
    ...
]
```

Keep sources to major, reputable publications. The scraper randomly picks 8 sources per run.

---

## Project Structure

```
datacenter-pulse/
├── agents/             # CrewAI agents (Scout, Strategist, Journalist, Publisher)
├── authors/            # Author profiles and writing styles
├── tools/              # Apify scraper + Git publisher utilities
├── content/            # Generated .md articles (local staging area)
├── astro-site/         # Full Astro website
│   ├── src/
│   │   ├── components/ # Header, Footer, ArticleCard
│   │   ├── layouts/    # BaseLayout
│   │   ├── pages/      # All routes
│   │   └── content/    # Article Markdown files (published here)
│   └── public/         # Static assets
├── main.py             # Orchestrator — runs the full pipeline
├── scheduler.py        # APScheduler — fires pipeline on a daily schedule
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variable template
└── setup.sh            # One-time setup script
```

---

## Troubleshooting

**`ollama: command not found`**
Install Ollama from [ollama.ai](https://ollama.ai). On Mac: `brew install ollama`.

**`APIFY_API_TOKEN not set`**
Make sure `.env` exists and contains your token. Don't commit `.env` to git.

**`git push failed`**
Ensure you've added a GitHub remote (`git remote add origin ...`) and authenticated. Use a Personal Access Token if prompted for a password.

**`Error: Cannot find package 'astro'`**
Run `cd astro-site && npm install` to install Astro dependencies.

**Articles not appearing on site**
The Astro build reads from `astro-site/src/content/articles/`. The git publisher copies files there and pushes. Check that `git push` succeeded in `scheduler.log`.

**Ollama timeout / slow responses**
llama3 needs ~8GB RAM. If your machine is slow, try `ollama pull llama3.2:1b` (smaller model) and set `OLLAMA_MODEL=llama3.2:1b` in `.env`.

**Netlify build fails**
Check that **Base directory** in Netlify settings is set to `astro-site`. The `netlify.toml` file should handle this automatically.

---

## License

MIT — use it, fork it, build on it.
