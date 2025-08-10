import React from 'react'
import { Section, Input, Button } from '../lib/ui'
import { api } from '../lib/api'
export default function Settings(){ const [provider,setProvider]=React.useState('local'); const [base,setBase]=React.useState('http://127.0.0.1:1234'); const [model,setModel]=React.useState('gpt-4o-mini'); const [models,setModels]=React.useState([])
  async function save(){ await api.llmSetConfig({provider, openai_base:base, openai_model:model}) }
  async function list(){ const m=await api.llmModels(); setModels(m.data||[]) }
  return <Section title="Settings">
    <div className="grid md:grid-cols-3 gap-3 items-end">
      <div><label className="block text-xs text-slate-600 dark:text-slate-300">Provider</label><select className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm" value={provider} onChange={e=>setProvider(e.target.value)}><option value="local">Local (Transformers)</option><option value="openai">OpenAI (compatible)</option><option value="lmstudio">LM Studio (OpenAI-compatible)</option><option value="hf">Hugging Face Inference API</option></select></div>
      <div><label className="block text-xs text-slate-600 dark:text-slate-300">Base URL (OpenAI‑compat)</label><Input value={base} onChange={e=>setBase(e.target.value)} placeholder="http://localhost:1234"/></div>
      <div><label className="block text-xs text-slate-600 dark:text-slate-300">Model</label><Input value={model} onChange={e=>setModel(e.target.value)} placeholder="gpt-4o-mini"/></div>
    </div>
    <div className="flex gap-2 pt-3"><Button onClick={save}>Save Provider</Button><Button variant="ghost" onClick={list}>List Models</Button></div>
    <div className="pt-3 text-sm text-slate-700 dark:text-slate-300">{models.length? <ul className="list-disc list-inside">{models.map((m,i)=>(<li key={i}>{m.id}</li>))}</ul> : <span className="text-slate-500 dark:text-slate-400">(no models listed)</span>}</div>
  </Section>
}
