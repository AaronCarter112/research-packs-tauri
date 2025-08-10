from __future__ import annotations
from typing import Dict, Any
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import yt_dlp
from langdetect import detect, LangDetectException
def fetch_metadata(url: str) -> Dict[str, Any]:
    ydl_opts={'quiet':True,'skip_download':True,'forcejson':True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info=ydl.extract_info(url, download=False)
    return {'video_id':info.get('id'),'video_url':f"https://youtu.be/{info.get('id')}",'title':info.get('title'),
            'channel_name':info.get('channel'),'channel_url':info.get('channel_url'),'publish_date':info.get('upload_date'),
            'duration':info.get('duration'),'category':(info.get('categories') or [None])[0],'tags':','.join(info.get('tags') or [])}
def fetch_transcript(video_id: str) -> Dict[str, Any]:
    try:
        tr_list=YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        text=' '.join([seg['text'] for seg in tr_list if seg['text'].strip()])
        timeline=[{'t':seg['start'],'text':seg['text']} for seg in tr_list]
        return {'text':text,'timeline':timeline,'language':'en','source':'manual_or_auto'}
    except (TranscriptsDisabled, NoTranscriptFound):
        try:
            tr_list=YouTubeTranscriptApi.list_transcripts(video_id).find_generated_transcript(['en']).fetch()
            text=' '.join([seg['text'] for seg in tr_list if seg['text'].strip()])
            timeline=[{'t':seg['start'],'text':seg['text']} for seg in tr_list]
            return {'text':text,'timeline':timeline,'language':'en','source':'auto'}
        except Exception:
            return {'text':'','timeline':[],'language':None,'source':'none'}
def detect_language(text:str)->str|None:
    if not text.strip(): return None
    try: return detect(text)
    except LangDetectException: return None
