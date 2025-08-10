from fastapi import APIRouter
from ..settings import Sources
router=APIRouter(prefix='/sources', tags=['sources'])
STATE={'queue':[]}
@router.post('')
def add_sources(s: Sources):
    seen=set(STATE['queue'])
    for it in s.items:
        if it not in seen:
            STATE['queue'].append(it); seen.add(it)
    return {'items': STATE['queue']}
@router.get('/queue')
def get_queue(): return {'items': STATE['queue']}
