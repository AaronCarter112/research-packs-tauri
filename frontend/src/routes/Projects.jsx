import React from 'react'
import { Section, Input, Button } from '../lib/ui'
import { api } from '../lib/api'
export default function Projects(){ const [name,setName]=React.useState('My_Project'); const [exportFolder,setExportFolder]=React.useState(''); const [items,setItems]=React.useState([])
  async function create(){ const res=await api.createProject({name,export_folder:exportFolder||undefined}); setItems([res]) }
  return <Section title="Projects" actions={<Button onClick={create}>Create</Button>}>
    <div className="grid md:grid-cols-3 gap-3"><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Project name"/><Input value={exportFolder} onChange={e=>setExportFolder(e.target.value)} placeholder="Export folder (optional)"/></div>
    <div className="pt-4 text-sm">{items.length? <pre className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl overflow-auto">{JSON.stringify(items,null,2)}</pre> : <span className="text-slate-600 dark:text-slate-300">No projects created yet.</span>}</div>
  </Section>
}
