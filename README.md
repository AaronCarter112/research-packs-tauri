# Research Packs v0.8 (Final)
Local-first desktop/web app that converts YouTube sources into clean research datasets.

## Features
- CSV import (drag/drop) with column mapping
- Live progress via SSE (/events)
- Run history with filters
- Pluggable LLMs: Local transformers, Hugging Face, OpenAI-compatible (LM Studio, OpenRouter, etc.)
- OpenAPI at /openapi.json
- One-click Tauri packaging

## Quickstart
1) Backend
```
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn processor.main:app --reload --app-dir backend
```
2) Frontend
```
cd frontend
npm i
cp .env.example .env.local
npm run dev
```
3) Configure LLM (optional)
```
curl -X POST http://127.0.0.1:8000/config/llm -H 'Content-Type: application/json' -d '{"provider":"lmstudio","openai_base":"http://localhost:1234","openai_model":"MyLocalModel"}'
```

## Packaged app (Tauri)
```
cd frontend
npm run tauri:build
```

## Exports
Outputs CSV/JSON/MD with timecoded points and entities to your project export folder.
