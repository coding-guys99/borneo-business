'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useI18n } from '@/components/i18n'
import { supabase } from '@/lib/browser-supabase'

const memberPrefixes=['/dashboard','/pipeline','/network','/profile','/guide']

export default function PublicHeader(){
  const pathname=usePathname()
  const isMember=memberPrefixes.some(p=>pathname===p||pathname.startsWith(`${p}/`))
  const [open,setOpen]=useState(false)
  const [languageOpen,setLanguageOpen]=useState(false)
  const {lang,setLang,t}=useI18n()
  const options:[string,'en'|'zh'|'ms'][]=[['简体中文','zh'],['English','en'],['Bahasa Melayu','ms']]
  function replayGuide(){localStorage.removeItem(isMember?'borneo-member-tour-v2':'borneo-public-tour-v2');window.dispatchEvent(new Event('borneo:open-guide'));setOpen(false)}
  async function signOut(){await supabase.auth.signOut();window.location.assign('/')}
  const memberLinks=[['/dashboard',t('radar')],['/pipeline',t('pipeline')],['/network',t('network')],['/profile',t('companyProfile')]]
  return <header className="topbar global-topbar"><div className="container nav">
    <Link className="brand" href={isMember?'/dashboard':'/'}>BORNEO / BUSINESS</Link>
    <nav className="navlinks">{isMember?memberLinks.map(([href,label])=><Link key={href} className={pathname===href?'active':''} href={href}>{label}</Link>):<><Link href="/opportunities">{t('opportunities')}</Link><Link href="/market">{t('market')}</Link></>}</nav>
    <div className="push desktop-actions">{isMember?<><button className="btn" onClick={replayGuide}>{t('guide')}</button><button className="btn" onClick={signOut}>{t('signout')}</button></>:<><Link className="btn" href="/signin">{t('signin')}</Link><Link className="btn primary" href="/onboarding">{t('join')}</Link></>}</div>
    <button className={`hamburger ${open?'active':''}`} aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span/><span/><span/></button>
    <div className={`mobile-menu ${open?'open':''}`} aria-hidden={!open}>
      {isMember?memberLinks.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>):<><Link href="/opportunities" onClick={()=>setOpen(false)}>{t('opportunities')}</Link><Link href="/market" onClick={()=>setOpen(false)}>{t('market')}</Link><Link href="/signin" onClick={()=>setOpen(false)}>{t('signin')}</Link><Link href="/onboarding" onClick={()=>setOpen(false)}>{t('join')}</Link></>}
      <button className="mobile-menu-row" onClick={replayGuide}>{t('guide')}<span>↗</span></button>
      <button className="mobile-menu-row language-toggle" onClick={()=>setLanguageOpen(v=>!v)}>{t('language')}<span className={languageOpen?'chevron open':'chevron'}>⌄</span></button>
      <div className={`language-options ${languageOpen?'open':''}`}>{options.map(([label,value])=><button key={value} className={lang===value?'selected':''} onClick={()=>setLang(value)}>{label}{lang===value?' ✓':''}</button>)}</div>
      {isMember&&<button onClick={signOut}>{t('signout')}</button>}
    </div>
  </div></header>
}
