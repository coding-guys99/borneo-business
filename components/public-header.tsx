'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useI18n } from '@/components/i18n'

export default function PublicHeader(){
  const [open,setOpen]=useState(false)
  const [languageOpen,setLanguageOpen]=useState(false)
  const {lang,setLang,t}=useI18n()
  const options:[string,'en'|'zh'|'ms'][]=[['中文','zh'],['English','en'],['Bahasa Melayu','ms']]
  function replayGuide(){
    localStorage.removeItem('borneo-public-tour-v2')
    window.dispatchEvent(new Event('borneo:open-guide'))
    setOpen(false)
  }
  return <header className="topbar"><div className="container nav">
    <Link className="brand" href="/">BORNEO / BUSINESS</Link>
    <nav className="navlinks"><Link href="/opportunities">{t('opportunities')}</Link><Link href="/market">{t('market')}</Link></nav>
    <div className="push desktop-actions"><Link className="btn" href="/signin">{t('signin')}</Link><Link className="btn primary" href="/onboarding">{t('join')}</Link></div>
    <button className={`hamburger ${open?'active':''}`} aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span/><span/><span/></button>
    <div className={`mobile-menu ${open?'open':''}`} aria-hidden={!open}>
      <Link href="/signin" onClick={()=>setOpen(false)}>{t('signin')}</Link>
      <Link href="/onboarding" onClick={()=>setOpen(false)}>{t('join')}</Link>
      <button className="mobile-menu-row" onClick={replayGuide}>{t('guide')}<span>↗</span></button>
      <button className="mobile-menu-row language-toggle" onClick={()=>setLanguageOpen(v=>!v)}>{t('language')}<span className={languageOpen?'chevron open':'chevron'}>⌄</span></button>
      <div className={`language-options ${languageOpen?'open':''}`}>{options.map(([label,value])=><button key={value} className={lang===value?'selected':''} onClick={()=>setLang(value)}>{label}{lang===value?' ✓':''}</button>)}</div>
    </div>
  </div></header>
}
