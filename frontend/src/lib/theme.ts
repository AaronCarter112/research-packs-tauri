export function initTheme(){
  const saved=localStorage.getItem('rp_theme')
  const sysDark=globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)').matches
  const mode=(saved as 'dark'|'light') || (sysDark?'dark':'light')
  setTheme(mode)
}
export function setTheme(mode:'light'|'dark'){
  const root=document.documentElement
  if(mode==='dark') root.classList.add('dark'); else root.classList.remove('dark')
  localStorage.setItem('rp_theme', mode)
}
export function toggleTheme(){ const isDark=document.documentElement.classList.contains('dark'); setTheme(isDark?'light':'dark') }
