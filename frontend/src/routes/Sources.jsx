import React from 'react'
import { Section, Textarea, Button } from '../lib/ui'
import { api } from '../lib/api'
function parseCSV(text){ const lines=text.split(/\r?\n/).filter(Boolean); const rows=lines.map(l=>l.split(',').map(s=>s.trim().replace(/^"|"$/g,''))); const header=rows.length?rows[0]:[]; const data=header.length?rows.slice(1):rows; return {header,data} }
export default function Sources(){ const [text,setText]=React.useState(''); const [queued,setQueued]=React.useState([]); const [drag,setDrag]=React.useState(false); const [header,setHeader]=React.useState([]); const [data,setData]=React.useState([]); const [urlCol,setUrlCol]=React.useState('')
  function ingestCSV(content){ const {header,data}=parseCSV(content); setHeader(header); setData(data); if(header?.length){ const guess=header.findIndex(h=>/url/i.test(h)); setUrlCol(guess>=0?String(guess):'0') } else { const urls=data.flatMap(r=>r).filter(Boolean); setText(t=>(t?(t+'\n'):'')+urls.join('\n')) } }
  function onDrop(e){ e.preventDefault(); setDrag(false); const f=e.dataTransfer.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>ingestCSV(String(r.result||'')); r.readAsText(f) }
  function applyMapping(){ if(!data.length) return; const idx=parseInt(urlCol||'0',10); const urls=data.map(row=>row[idx]).filter(Boolean); setText(t=>(t?(t+'\n'):'')+urls.join('\n')); setHeader([]); setData([]) }
  async function add(){ const lines=text.split('\n').map(s=>s.trim()).filter(Boolean); const res=await api.addSources(lines); setQueued(res.items||[]) }
  return <Section title="Sources" actions={<Button onClick={add}>Add to Queue</Button>}>
    <div onDragOver={e=>{e.preventDefault(); setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} className={`mb-2 p-4 border-2 border-dashed rounded-xl text-sm ${drag?'border-indigo-400 bg-indigo-50':'border-slate-300 bg-slate-50 dark:bg-slate-900/40 dark:border-slate-700'}`}>Drag & drop a CSV (map column below), or paste URLs.</div>
    {header.length>0 && (<div className="mb-3 p-3 border rounded-xl bg-white dark:bg-slate-900/30 dark:border-slate-700"><div className="text-sm font-medium mb-2">CSV Column Mapping</div><div className="flex items-end gap-3"><div className="flex-1"><label className="block text-xs text-slate-600 dark:text-slate-300">URL Column</label><select className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm" value={urlCol} onChange={e=>setUrlCol(e.target.value)}>{header.map((h,i)=>(<option key={i} value={String(i)}>{i}: {h}</option>))}</select></div><Button onClick={applyMapping}>Use Column</Button></div><div className="mt-3 max-h-40 overflow-auto text-xs"><table className="min-w-full"><thead><tr>{header.map((h,i)=>(<th key={i} className="text-left pr-3 pb-1">{h}</th>))}</tr></thead><tbody>{data.slice(0,8).map((r,ri)=>(<tr key={ri}>{r.map((c,ci)=>(<td key={ci} className="pr-3 py-0.5 whitespace-nowrap">{c}</td>))}</tr>))}</tbody></table></div></div>)}
    <Textarea rows={6} value={text} onChange={e=>setText(e.target.value)} />
    <div className="pt-3 text-sm text-slate-700 dark:text-slate-300">Queued: {queued.length}</div>
    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 max-h-60 overflow-auto mt-2">{(queued||[]).map((q,i)=><li key={i} className="truncate">{q}</li>)}</ul>
  </Section>
}
