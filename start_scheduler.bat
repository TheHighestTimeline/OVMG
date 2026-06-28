@echo off
title DataCenter Pulse — Newsroom Scheduler
color 0A
setlocal

cd /d "%~dp0"

echo.
echo  ================================================
echo   DataCenter Pulse  ^|  Newsroom Scheduler
echo   3 articles/day ^| 9am-5pm ET ^| auto-publishes
echo  ================================================
echo.

REM ── Check Ollama is running ───────────────────────────────────
echo  [1/3] Checking Ollama (local LLM)...
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
  echo.
  echo  WARNING: Ollama doesn't appear to be running.
  echo  The Scout and Strategist agents use Ollama/mistral.
  echo  Start Ollama first, then re-run this script.
  echo.
  echo  To start Ollama: open a new terminal and run: ollama serve
  echo.
  pause
  exit /b 1
) else (
  echo  Ollama is running. Good.
)

REM ── Activate venv if it exists ────────────────────────────────
echo.
echo  [2/3] Activating Python environment...
if exist "venv\Scripts\activate.bat" (
  call venv\Scripts\activate.bat
  echo  venv activated.
) else (
  echo  No venv found — using system Python.
)

REM ── Launch scheduler ─────────────────────────────────────────
echo.
echo  [3/3] Starting scheduler...
echo.
echo  Articles will be published at random times between 9am-5pm ET.
echo  Logs are written to scheduler.log in this folder.
echo  Press Ctrl+C to stop.
echo.
echo  ================================================
echo.

python scheduler.py

echo.
echo  Scheduler stopped.
pause
