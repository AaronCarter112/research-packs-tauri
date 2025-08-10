const API_BASE=(import.meta as any).env?.VITE_API_BASE||'http://127.0.0.1:8000'
export function connectSSE(onMessage:(ev:MessageEvent)=>void){ const url=API_BASE.replace(/\/$/,'')+'/events'; const es=new EventSource(url); es.onmessage=onMessage; es.onerror=()=>{}; return ()=>es.close() }
