from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from . import db
from .llm_providers import cfg as LLM_CFG
from .llm_models import router as llm_router
from .routers import projects, sources, queue, runs
from .event_bus import BUS
app=FastAPI(title='Research Packs API', version='0.7.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
db.migrate()
app.include_router(llm_router)
app.include_router(projects.router)
app.include_router(sources.router)
app.include_router(queue.router)
app.include_router(runs.router)
@app.get('/health')
def health(): return {'ok':True,'version':app.version,'llm_provider':LLM_CFG.provider,'openai_base':LLM_CFG.openai_base,'openai_model':LLM_CFG.openai_model,'hf_model':LLM_CFG.hf_model,'local_enabled':LLM_CFG.local_enabled}
@app.post('/config/llm')
def set_llm_config(payload: dict): 
    for k,v in payload.items():
        if hasattr(LLM_CFG,k): setattr(LLM_CFG,k,v)
    return {'ok':True,'provider':LLM_CFG.provider}
@app.get('/events')
async def events():
    async def gen():
        async for q in BUS.subscribe():
            while True:
                msg=await q.get()
                yield {'event':'message','data': msg}
    return EventSourceResponse(gen())
