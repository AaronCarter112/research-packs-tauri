# Runbook
## Backend
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn processor.main:app --reload --app-dir backend

## Frontend
cd frontend
npm i
cp .env.example .env.local
npm run dev

## Packaging (Tauri)
cd frontend
npm run tauri:build

## Live progress
UI connects to /events (SSE).

## CSV import
Drag a CSV with a `url` header or raw URLs into Sources; or paste URLs.
