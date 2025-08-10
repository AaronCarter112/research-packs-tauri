import React from 'react'
import { Section } from '../lib/ui'
import { api } from '../lib/api'
export default function Dashboard(){ const [health,setHealth]=React.useState(null); React.useEffect(()=>{ api.health().then(setHealth).catch(()=>setHealth(null)) },[])
  return <Section title="Status">{health? <div className="grid md:grid-cols-3 gap-3 text-sm">
    <div className="p-3 rounded-xl border bg-white dark:bg-slate-900/40 dark:border-slate-700">Version<br/><span className="font-mono">{health.version}</span></div>
    <div className="p-3 rounded-xl border bg-white dark:bg-slate-900/40 dark:border-slate-700">Provider<br/><span className="font-mono">{health.llm_provider||'local'}</span></div>
    <div className="p-3 rounded-xl border bg-white dark:bg-slate-900/40 dark:border-slate-700">OpenAPI<br/><a className="text-indigo-400" href={(import.meta.env.VITE_API_BASE||'http://127.0.0.1:8000')+'/openapi.json'} target="_blank">/openapi.json</a></div>
  </div> : <div className="text-slate-600 dark:text-slate-300">Backend not reachable.</div>}</Section>
}
