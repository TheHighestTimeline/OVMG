#!/bin/bash
# DataCenter Pulse - One-time setup script
# Run: bash setup.sh

echo "========================================"
echo "  DataCenter Pulse Setup"
echo "========================================"

# Create Python virtual environment
python -m venv venv
source venv/bin/activate || . venv/Scripts/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create content directory
mkdir -p content
mkdir -p astro-site/src/content/articles

# Copy .env
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env - please add your APIFY_API_TOKEN"
fi

# Check Ollama
if command -v ollama &> /dev/null; then
    echo "Ollama found. Pulling llama3 model..."
    ollama pull llama3
else
    echo "WARNING: Ollama not found. Install from https://ollama.ai"
fi

# Initialize git if not already done
if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "initial commit: DataCenter Pulse newsroom"
  echo "Git initialized. Push to GitHub when ready."
fi

# Install Astro dependencies
echo "Installing Astro dependencies..."
cd astro-site
npm install
cd ..

echo ""
echo "========================================"
echo "  Setup complete!"
echo ""
echo "  Next steps:"
echo "  1. Edit .env and add your APIFY_API_TOKEN"
echo "  2. Push to GitHub: git remote add origin YOUR_REPO_URL && git push -u origin main"
echo "  3. Connect Netlify to your GitHub repo"
echo "  4. Run: python scheduler.py"
echo "========================================"
