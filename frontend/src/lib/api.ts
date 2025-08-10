export type Infer<T>=T extends (x:any)=>x is infer R?R:never
export const zStr=(v:any):v is string=>typeof v==='string'
export const zBool=(v:any):v is boolean=>typeof v==='boolean'
export const zObj=(shape:Record<string,(x:any)=>boolean>)=>(v:any):v is Record<string,any>=>{ if(typeof v!=='object'||v===null) return false; for(const k in shape) if(!shape[k](v[k])) return false; return true }
export const zArr=<T>(item:(x:any)=>x is T)=>(v:any):v is T[]=>Array.isArray(v)&&v.every(item)
const API_BASE=(import.meta as any).env?.VITE_API_BASE||'http://127.0.0.1:8000'
async function http<T>(path:string, init?:RequestInit, guard?:(v:any)=>v is T):Promise<T>{ const res=await fetch(API_BASE+path,{headers:{'Content-Type':'application/json'},...init}); if(!res.ok) throw new Error(`HTTP ${res.status}`); const data=await res.json(); if(guard && !guard(data)) throw new Error('Schema validation failed for '+path); return data as T }
export type Health={ok:boolean;version:string;llm_provider?:string;openai_base?:string;openai_model?:string;hf_model?:string;local_enabled?:boolean}
const isHealth=zObj({ok:zBool,version:zStr})
export type Queue={items:string[]}
const isQueue=zObj({items:(v:any)=>zArr(zStr)(v)})
export type LLMModels={data:{id:string;object:string}[]}
const isLLMModels=(v:any)=>typeof v==='object'&&v!==null&&Array.isArray(v.data)
export const api={
  health:()=>http<Health>('/health',undefined,isHealth),
  createProject:(body:any)=>http('/projects',{method:'POST',body:JSON.stringify(body)}),
  addSources:(items:string[])=>http<Queue>('/sources',{method:'POST',body:JSON.stringify({items})},isQueue),
  getQueue:()=>http<Queue>('/queue',undefined,isQueue),
  startQueue:(limit=5)=>http('/queue/start',{method:'POST',body:JSON.stringify({limit})}),
  exportNow:(formats=['csv','json','md'])=>http<{path:string}>('/export',{method:'POST',body:JSON.stringify({formats})}),
  llmSetConfig:(payload:any)=>http('/config/llm',{method:'POST',body:JSON.stringify(payload)}),
  llmModels:()=>http<LLMModels>('/llm/models',undefined,isLLMModels),
  cancelRun:()=>http('/runs/cancel',{method:'POST'}),
  resumeRun:()=>http('/runs/resume',{method:'POST'}),
}
