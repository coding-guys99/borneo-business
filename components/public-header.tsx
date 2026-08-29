'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PublicHeader(){
  const [open,setOpen]=useState(false)
  const [lang,setLang]=useState('English')
  return <header className="topbar"><div className="container nav">
    <Link className="brand" href="/">BORNEO / BUSINESS</Link>
    <nav className="navlinks"><Link href="/opportunities">Opportunities</Link><Link href="/market">Market</Link></nav>
    <div className="push desktop-actions"><Link className="btn" href="/signin">Sign In</Link><Link className="btn primary" href="/onboarding">Join</Link></div>
    <button className="hamburger" aria-label="Open menu" onClick={()=>setOpen(v=>!v)}><span/><span/><span/></button>
    {open&&<div className="mobile-menu">
      <Link href="/signin" onClick={()=>setOpen(false)}>Sign In</Link>
      <Link href="/onboarding" onClick={()=>setOpen(false)}>Join</Link>
      <div className="mobile-menu-label">Language</div>
      {['中文','English','Bahasa Melayu'].map(x=><button key={x} className={lang===x?'selected':''} onClick={()=>setLang(x)}>{x}{lang===x?' ✓':''}</button>)}
    </div>}
  </div></header>
}
