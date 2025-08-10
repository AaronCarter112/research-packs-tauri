from __future__ import annotations
from typing import Dict, Any
from fastapi import APIRouter, HTTPException
import requests
from .llm_providers import cfg
router=APIRouter(prefix='/llm', tags=['llm'])
@router.get('/models')
def list_models()->Dict[str,Any]:
    base=(cfg.openai_base or 'https://api.openai.com').rstrip('/'); url=f"{base}/v1/models"
    headers={'Authorization':f"Bearer {cfg.openai_api_key}"} if cfg.openai_api_key else {}
    try:
        r=requests.get(url,headers=headers,timeout=15); r.raise_for_status(); j=r.json()
        if isinstance(j,dict) and 'data' in j: return {'data':[{'id':m.get('id'),'object':m.get('object','model')} for m in j['data']]}
        if isinstance(j,list): return {'data':[{'id':m.get('id') or m.get('name'),'object':'model'} for m in j]}
        return {'data':[]}
    except Exception as e: raise HTTPException(status_code=502, detail=f'Model list failed: {e}')
@router.get('/health')
def llm_health()->Dict[str,Any]:
    base=(cfg.openai_base or 'https://api.openai.com').rstrip('/')
    try: requests.get(base,timeout=5); return {'ok':True,'base':base}
    except Exception as e: return {'ok':False,'base':base,'error':str(e)}
