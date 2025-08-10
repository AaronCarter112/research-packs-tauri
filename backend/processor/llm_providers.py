from __future__ import annotations
import os, requests, json
class LLMConfig:
    def __init__(self):
        self.provider=os.getenv('RP_LLM_PROVIDER','local').lower()
        self.openai_api_key=os.getenv('OPENAI_API_KEY') or os.getenv('RP_OPENAI_API_KEY')
        self.openai_base=os.getenv('OPENAI_BASE_URL') or os.getenv('RP_OPENAI_BASE','https://api.openai.com')
        self.openai_model=os.getenv('OPENAI_MODEL','gpt-4o-mini')
        self.hf_api_key=os.getenv('HUGGINGFACEHUB_API_TOKEN') or os.getenv('RP_HF_API_KEY')
        self.hf_model=os.getenv('HF_MODEL','facebook/bart-large-cnn')
        self.local_enabled=os.getenv('RP_LOCAL_TRANSFORMERS','1')=='1'
cfg=LLMConfig()
def summarize_via_openai_compat(text:str,length:str='short')->str:
    if not cfg.openai_api_key and 'localhost' not in (cfg.openai_base or ''): raise RuntimeError('Missing OPENAI_API_KEY / RP_OPENAI_API_KEY')
    base=cfg.openai_base.rstrip('/'); url=f"{base}/v1/chat/completions"
    max_tokens=256 if length=='short' else 512 if length=='medium' else 896
    prompt=("Summarize the following transcript into a factual, neutral summary. Avoid hallucinations; do not add facts not present. Return 1–2 paragraphs and bullet key points if appropriate.\n\n"+f"TRANSCRIPT:\n{text[:12000]}")
    headers={'Content-Type':'application/json'}; 
    if cfg.openai_api_key: headers['Authorization']=f"Bearer {cfg.openai_api_key}"
    data={'model':cfg.openai_model,'messages':[{'role':'system','content':'You are a meticulous research assistant.'},{'role':'user','content':prompt}],'temperature':0.2,'max_tokens':max_tokens}
    r=requests.post(url,headers=headers,json=data,timeout=120); r.raise_for_status(); j=r.json(); return j['choices'][0]['message']['content'].strip()
def summarize_via_huggingface(text:str,length:str='short')->str:
    if not (cfg.hf_api_key and cfg.hf_model): raise RuntimeError('Missing HUGGINGFACEHUB_API_TOKEN or HF_MODEL')
    url=f"https://api-inference.huggingface.co/models/{cfg.hf_model}"
    headers={'Authorization':f"Bearer {cfg.hf_api_key}",'Content-Type':'application/json'}
    max_new_tokens=200 if length=='short' else 400 if length=='medium' else 700
    payload={'inputs':text[:12000],'parameters':{'max_new_tokens':max_new_tokens,'do_sample':False}}
    r=requests.post(url,headers=headers,json=payload,timeout=120); r.raise_for_status(); out=r.json()
    if isinstance(out,list) and out and 'summary_text' in out[0]: return out[0]['summary_text']
    if isinstance(out,list) and out and 'generated_text' in out[0]: return out[0]['generated_text']
    return str(out)[:2000]
