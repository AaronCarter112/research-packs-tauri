from __future__ import annotations
import pandas as pd, json, pathlib, time
def to_timecode(seconds: float) -> str:
    try:
        s=int(round(float(seconds))); h=s//3600; m=(s%3600)//60; sec=s%60; return f"{h:02d}:{m:02d}:{sec:02d}"
    except Exception: return '00:00:00'
def write_exports(rows, dest_folder: str, project_name: str, tool_version: str = '0.7') -> str:
    dest=pathlib.Path(dest_folder); dest.mkdir(parents=True, exist_ok=True)
    flat=[]; 
    for r in rows:
        flat.append({
            'video_id': r.get('video_id'),'video_url': r.get('video_url'),'title': r.get('title'),
            'channel_name': r.get('channel_name'),'channel_url': r.get('channel_url'),'publish_date': r.get('publish_date'),
            'duration': r.get('duration'),'category': r.get('category'),'tags': r.get('tags'),
            'language': r.get('language'),'translated': int(bool(r.get('translated'))),
            'summary_short': r.get('summary_short'),'summary_long': r.get('summary_long'),
            'key_points': '; '.join([kp.get('text','') for kp in r.get('key_points',[])]),
            'timecoded_points': json.dumps({to_timecode(kp.get('t',0)): kp.get('text','') for kp in r.get('key_points',[])}, ensure_ascii=False),
            'entities_people': ', '.join(r.get('entities',{}).get('people',[])),
            'entities_orgs': ', '.join(r.get('entities',{}).get('orgs',[])),
            'entities_places': ', '.join(r.get('entities',{}).get('places',[])),
            'entity_confidence_scores': json.dumps(r.get('entities',{}).get('scores',{}), ensure_ascii=False),
            'external_links': ', '.join(r.get('external_links',[])),
            'citations': ', '.join(r.get('citations',[])),
            'processing_date': r.get('processing_date'),'tool_version': tool_version,
        })
    df=pd.DataFrame(flat); stamp=time.strftime('%Y-%m-%d_%H-%M-%S')
    base=f'dataset_{project_name}_{stamp}'; csv_path=dest/f'{base}.csv'; json_path=dest/f'{base}.json'; md_path=dest/f'{base}.md'
    df.to_csv(csv_path, index=False, encoding='utf-8'); json_path.write_text(json.dumps(rows, ensure_ascii=False, indent=2))
    lines=[f'# Research Pack — {project_name} — {stamp}','',f'Rows: {len(rows)}','']
    for r in rows[:50]: lines += [f"## {r.get('title')} ({r.get('video_url')})",'',r.get('summary_short',''),'']
    md_path.write_text('\n'.join(lines)); return str(csv_path)
