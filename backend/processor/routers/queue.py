from fastapi import APIRouter
from ..settings import QueueStart
from .. import transcripts, summarizer, ner, db
from ..event_bus import BUS
from ..run_manager import RUN
import time, asyncio, json
STATE={'queue':[]}
router=APIRouter(prefix='/queue', tags=['queue'])
@router.get('')
def list_queue(): return {'items': STATE['queue']}
@router.post('/start')
async def start(q: QueueStart):
    limit=q.limit or 5; items=STATE['queue'][:limit]
    if not items:
        await BUS.publish({'type':'log','message':'Queue empty'})
        return {'queue': STATE['queue'], 'preview': None}
    with db.get_conn() as c:
        c.execute("INSERT INTO runs(project_id,status,notes) VALUES((SELECT id FROM projects ORDER BY id DESC LIMIT 1), 'running', 'batch start')")
        run_id=c.execute("SELECT last_insert_rowid() as id").fetchone()['id']
    total=len(items); preview=None
    for i,url in enumerate(items, start=1):
        if RUN.is_cancelled():
            await BUS.publish({'type':'progress','pct':0,'msg':'Cancelled'}); break
        pct=round(100*i/total,1); await BUS.publish({'type':'progress','pct':pct,'msg':f'Processing {i}/{total}'})
        await BUS.publish({'type':'log','message':f'Fetch meta: {url}'})
        try:
            meta=transcripts.fetch_metadata(url); tr=transcripts.fetch_transcript(meta['video_id'])
            text=tr.get('text',''); short=summarizer.summarize_abstractive(text,'short'); long=summarizer.summarize_abstractive(text,'long')
            timeline=tr.get('timeline',[]); kps=[]; 
            for idx in [0, len(timeline)//3, (2*len(timeline))//3]:
                if 0<=idx<len(timeline): seg=timeline[idx]; kps.append({'t':seg.get('t',0),'text':seg.get('text','')})
            ents=ner.extract_entities(text)
            row={**meta,'summary_short':short,'summary_long':long,'key_points':kps,'entities':ents,'citations':[meta.get('video_url')],'processing_date': time.strftime('%Y-%m-%dT%H:%M:%SZ')}
            with db.get_conn() as c:
                pid=c.execute('SELECT id FROM projects ORDER BY id DESC LIMIT 1').fetchone()['id']
                c.execute("""
                    INSERT INTO videos(project_id, video_id, video_url, title, channel_name, channel_url, publish_date, duration, category, tags,
                                       language, translated, summary_short, summary_long, key_points, timecoded_points, entities_people, entities_orgs, entities_places,
                                       entity_confidence_scores, external_links, citations, processing_date, tool_version)
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (pid,row.get('video_id'),row.get('video_url'),row.get('title'),row.get('channel_name'),row.get('channel_url'),row.get('publish_date'),row.get('duration'),row.get('category'),row.get('tags'),
                 'en',0,row.get('summary_short'),row.get('summary_long'), json.dumps([kp.get('text') for kp in row.get('key_points',[])], ensure_ascii=False), json.dumps({kp.get('t'):kp.get('text') for kp in row.get('key_points',[])}, ensure_ascii=False), ', '.join(row.get('entities',{}).get('people',[])), ', '.join(row.get('entities',{}).get('orgs',[])), ', '.join(row.get('entities',{}).get('places',[])), json.dumps(row.get('entities',{}).get('scores',{}), ensure_ascii=False), '', ', '.join(row.get('citations',[])), row.get('processing_date'), '0.7'))
            if preview is None:
                preview={'title':meta.get('title'),'publish_date':meta.get('publish_date'),'channel_name':meta.get('channel_name'),'duration':meta.get('duration'),'summary_short':short,'key_points':kps,'entities':{k:v for k,v in ents.items() if k in ('people','orgs','places')},'citations':[meta.get('video_url')]}
                await BUS.publish({'type':'preview','preview':preview})
        except Exception as e:
            await BUS.publish({'type':'log','message':f'Error: {e}'})
        await asyncio.sleep(0.05)
    with db.get_conn() as c:
        c.execute("UPDATE runs SET status='done', finished_at=datetime('now') WHERE id=?", (run_id,))
    await BUS.publish({'type':'progress','pct':100,'msg':'Done'})
    return {'queue': STATE['queue'], 'preview': preview}
