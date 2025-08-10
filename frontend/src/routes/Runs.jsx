import React from 'react'
import { Section, Input, Button } from '../lib/ui'
async function fetchRuns({status,from,to}){ const base=(import.meta.env.VITE_API_BASE||'http://127.0.0.1:8000'); const qs=new URLSearchParams(); if(status) qs.set('status',status); if(from) qs.set('from',from); if(to) qs.set('to',to); const r=await fetch(base+'/runs?'+qs.toString()); return await r.json() }
export default function Runs(){ const [status,setStatus]=React.useState(''); const [from,setFrom]=React.useState(''); const [to,setTo]=React.useState(''); const [rows,setRows]=React.useState([]); const [loading,setLoading]=React.useState(false)
  async function load(){ setLoading(true); try{ setRows(await fetchRuns({status,from,to})) } finally{ setLoading(false) } }
  React.useEffect(()=>{ load() },[])
  return <Section title="Runs" actions={<Button onClick={load}>Filter</Button>}>
    <div className="grid md:grid-cols-4 gap-3 mb-3">
      <div><label className="block text-xs text-slate-600 dark:text-slate-300">Status</label><select className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm" value={status} onChange={e=>setStatus(e.target.value)}><option value="">Any</option><option value="queued">Queued</option><option value="running">Running</option><option value="done">Done</option><option value="error">Error</option></select></div>
      <div><label className="block text-xs text-slate-600 dark:text-slate-300">From (ISO)</label><Input value={from} onChange={e=>setFrom(e.target.value)} placeholder="2025-08-01"/></div>
      <div><label className="block text-xs text-slate-600 dark:text-slate-300">To (ISO)</label><Input value={to} onChange={e=>setTo(e.target.value)} placeholder="2025-08-31"/></div>
    </div>
    {loading? <div className="text-sm text-slate-600 dark:text-slate-300">Loading…</div> :
      <div className="overflow-auto border border-slate-200 dark:border-slate-700 rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300"><tr>
            <th className="text-left px-3 py-2">ID</th><th className="text-left px-3 py-2">Started</th><th className="text-left px-3 py-2">Finished</th><th className="text-left px-3 py-2">Status</th><th className="text-left px-3 py-2">Notes</th>
          </tr></thead>
          <tbody>{rows.map((r)=>(<tr key={r.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900/20 dark:even:bg-slate-900/10">
              <td className="px-3 py-2">{r.id}</td><td className="px-3 py-2">{r.started_at}</td><td className="px-3 py-2">{r.finished_at||'—'}</td><td className="px-3 py-2">{r.status}</td><td className="px-3 py-2">{r.notes||''}</td>
          </tr>))}</tbody>
        </table>
      </div>}
  </Section>
}
