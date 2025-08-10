import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { initTheme } from './lib/theme'
import AppShell from './routes/AppShell'
import Dashboard from './routes/Dashboard'
import Projects from './routes/Projects'
import Sources from './routes/Sources'
import Queue from './routes/Queue'
import Runs from './routes/Runs'
import Exporter from './routes/Exporter'
import Settings from './routes/Settings'
import './index.css'
initTheme()
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route element={<AppShell/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/sources" element={<Sources/>}/>
        <Route path="/queue" element={<Queue/>}/>
        <Route path="/runs" element={<Runs/>}/>
        <Route path="/export" element={<Exporter/>}/>
        <Route path="/settings" element={<Settings/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
)
