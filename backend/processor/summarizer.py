from __future__ import annotations
from .llm_providers import cfg, summarize_via_openai_compat, summarize_via_huggingface
try:
    from transformers import pipeline
    _LOCAL = pipeline('summarization', model='facebook/bart-large-cnn', device=-1)
except Exception:
    _LOCAL = None
def summarize_abstractive(text:str,length:str='short')->str:
    if not text.strip(): return ''
    if cfg.provider in ('openai','openai_compat','lmstudio','openrouter'):
        try: return summarize_via_openai_compat(text,length)
        except Exception: pass
    if cfg.provider in ('hf','huggingface'):
        try: return summarize_via_huggingface(text,length)
        except Exception: pass
    if cfg.local_enabled and _LOCAL is not None:
        max_len=130 if length=='short' else 220 if length=='medium' else 350
        min_len=60 if length=='short' else 120 if length=='medium' else 200
        out=_LOCAL(text[:4000], max_length=max_len, min_length=min_len, do_sample=False)
        return out[0]['summary_text']
    sents=[s.strip() for s in text.replace('\n',' ').split('. ') if s.strip()]
    return '. '.join(sents[:5])
def summarize_extractive(text:str)->str:
    sents=[s.strip() for s in text.replace('\n',' ').split('. ') if s.strip()]
    return '. '.join(sents[:8])
