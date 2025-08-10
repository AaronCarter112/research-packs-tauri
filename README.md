# 📦 Research Packs

**Cross-platform desktop app for turning videos and online sources into structured, high-quality research packs — fast.**  
Built with **Tauri + React + FastAPI**, designed for researchers, journalists, educators, and content creators.

---

## 🚀 Features

- **Multi-source Input**: Add links manually or import via CSV (drag & drop supported)  
- **Live Progress**: Real-time updates via Server-Sent Events  
- **AI-Powered Processing**: Choose between **OpenAI**, **Hugging Face**, or **LM Studio** APIs  
- **Structured Exports**: CSV/JSON with schema, source URLs, timestamps, and confidence scores  
- **Run History**: Filterable logs with rerun support  
- **Offline-First**: Local SQLite database with optional cloud sync  
- **One-Click Build**: Tauri packaging for Windows (.msi/.exe), macOS (.dmg), and Linux (.deb/.rpm)  
- **Customizable Thresholds**: Entity extraction confidence levels and translation settings  
- **Privacy-Focused**: No telemetry unless you enable it  

---

## 📥 Installation

### Prebuilt Binaries
Check the [Releases](../../releases) page for the latest signed builds:
- **Windows**: `.exe` installer or `.msi`
- **macOS**: `.dmg` (notarized)
- **Linux**: `.deb` / `.rpm`

### Build from Source
```bash
git clone https://github.com/AaronCarter112/research-packs-tauri.git
cd research-packs-tauri
npm install
npm run tauri build



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
