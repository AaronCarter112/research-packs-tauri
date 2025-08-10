import React from 'react'
export const Pill=({children}:{children:React.ReactNode})=>(<span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">{children}</span>)
export const Button=({children,onClick,variant='primary'}:{children:React.ReactNode,onClick?:()=>void,variant?:'primary'|'ghost'|'danger'})=>{
  const base='px-4 py-2 rounded-2xl text-sm font-medium shadow-sm transition'
  const variants={primary:'bg-indigo-600 hover:bg-indigo-700 text-white',ghost:'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700',danger:'bg-rose-600 hover:bg-rose-700 text-white'}
  return <button onClick={onClick} className={`${base} ${variants[variant]}`}>{children}</button>
}
export const Input=(p:any)=>(<input {...p} className={`w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${p.className||''}`} />)
export const Textarea=(p:any)=>(<textarea {...p} className={`w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${p.className||''}`} />)
export const Section=({title,children,actions}:{title:string,children:React.ReactNode,actions?:React.ReactNode})=>(
  <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur rounded-2xl shadow p-6 border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-3"><h2 className="text-xl font-semibold dark:text-slate-100">{title}</h2>{actions}</div>
    {children}
  </section>
)
