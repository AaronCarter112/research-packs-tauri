import React from 'react'
import { Section, Button } from '../lib/ui'
import { api } from '../lib/api'
export default function Exporter(){ const [lastPath,setLastPath]=React.useState(''); async function run(){ const r=await api.exportNow(['csv','json','md']); setLastPath(r.path) }
  return <Section title="Export Builder" actions={<Button onClick={run}>Export</Button>}>
    <div className="text-sm text-slate-700 dark:text-slate-300">Export the last processed rows to CSV/JSON/MD in the configured project folder.</div>
    {lastPath && <div className="pt-2 text-xs font-mono">{lastPath}</div>}
  </Section>
}
