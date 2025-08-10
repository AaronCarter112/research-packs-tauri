import React from 'react'
import { Section, Button } from '../lib/ui'
import { api } from '../lib/api'
import { connectSSE } from '../lib/sse'
export default function Queue(){ const [items,setItems]=React.useState([]); const [preview,setPreview]=React.useState(null); const [progress,setProgress]=React.useState({pct:0,msg:'idle'}); const [log,setLog]=React.useState([])
  async function refresh(){ const r=await api.getQueue(); setItems(r.items||[]) }
  async function start(){ setLog(l=>[...l,{t:Date.now(),m:'Starting…'}]); await api.startQueue(5) }
  React.useEffect(()=>{ refresh(); const off=connectSSE(ev=>{ try{ const data=JSON.parse(ev.data); if(data.type==='progress') setProgress({pct:data.pct||0,msg:data.msg||''}); if(data.type==='preview') setPreview(data.preview); if(data.type==='log') setLog(l=>[...l,{t:Date.now(),m:data.message}]) }catch{} }); return off },[])
  return <>
    <Section title="Queue" actions={<div className="flex gap-2"><Button onClick={refresh}>Refresh</Button><Button onClick={start}>Start</Button><Button variant="ghost" onClick={()=>api.cancelRun()}>Cancel</Button><Button variant="ghost" onClick={()=>api.resumeRun()}>Resume</Button></div>}>
      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-3"><div className="h-3 bg-indigo-600 transition-all" style={{width:`${progress.pct}%`}}/></div>
      <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">{progress.msg}</div>
      <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-200 max-h-32 overflow-auto mb-3">{(items||[]).map((x,i)=><li key={i} className="truncate">{x}</li>)}</ul>
      <div className="text-xs bg-slate-50 dark:bg-slate-900/40 border dark:border-slate-700 rounded-xl p-2 h-28 overflow-auto">{log.map((l,i)=><div key={i}>{new Date(l.t).toLocaleTimeString()}: {l.m}</div>)}</div>
    </Section>
    <Section title="Preview"><pre className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl overflow-auto text-xs">{JSON.stringify(preview||{},null,2)}</pre></Section>
  </>
}
