import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Pill, Button } from '../lib/ui'
import { toggleTheme } from '../lib/theme'
const Nav=({to,label})=>{ const loc=useLocation(); const active=loc.pathname===to; return <Link to={to} className={`px-3 py-2 rounded-xl text-sm ${active?'bg-indigo-600 text-white':'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{label}</Link> }
export default function AppShell(){
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6">
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Research Packs</h1><p className="text-slate-600 dark:text-slate-300 text-sm">Local-first YouTube → datasets</p></div>
        <div className="flex items-center gap-2"><Button variant="ghost" onClick={toggleTheme}>Toggle Theme</Button><Pill>v0.7</Pill></div>
      </header>
      <nav className="flex gap-2"><Nav to="/" label="Dashboard"/><Nav to="/projects" label="Projects"/><Nav to="/sources" label="Sources"/><Nav to="/queue" label="Queue"/><Nav to="/runs" label="Runs"/><Nav to="/export" label="Export"/><Nav to="/settings" label="Settings"/></nav>
      <div className="dark:text-slate-100"><Outlet/></div>
      <footer className="flex items-center justify-between text-xs text-slate-500 pt-2"><div className="dark:text-slate-300">© Research Packs — Local-first</div><div className="flex gap-2"><Pill>CSV</Pill><Pill>JSON</Pill><Pill>MD</Pill></div></footer>
    </div>
  </div>
}
