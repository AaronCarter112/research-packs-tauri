from fastapi import APIRouter, Query
from .. import db
from ..run_manager import RUN
from ..event_bus import BUS
router=APIRouter(prefix='/runs', tags=['runs'])
@router.get('')
def list_runs(status: str|None = Query(None), from_: str|None = Query(None, alias='from'), to: str|None = Query(None)):
    q="SELECT id, project_id, started_at, finished_at, status, notes FROM runs WHERE 1=1"; args=[] 
    if status: q+=" AND status = ?"; args.append(status)
    if from_: q+=" AND started_at >= ?"; args.append(from_)
    if to: q+=" AND started_at <= ?"; args.append(to)
    q+=" ORDER BY id DESC LIMIT 200"
    with db.get_conn() as c:
        rows=c.execute(q, tuple(args)).fetchall(); return [dict(r) for r in rows]
@router.post('/cancel')
async def cancel_run(): RUN.cancel(); await BUS.publish({'type':'log','message':'Run cancelled by user'}); return {'ok':True}
@router.post('/resume')
async def resume_run(): RUN.clear(); await BUS.publish({'type':'log','message':'Run resume requested'}); return {'ok':True}
