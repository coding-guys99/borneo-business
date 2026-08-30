'use client'

import { useEffect, useState } from 'react'
import type { ProcurementTerm } from '@/lib/procurement-terms'

export default function ContextInfoDrawer({terms}:{terms:ProcurementTerm[]}){
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    function onKey(e:KeyboardEvent){if(e.key==='Escape')setOpen(false)}
    window.addEventListener('keydown',onKey)
    return()=>window.removeEventListener('keydown',onKey)
  },[])
  if(!terms.length)return null
  return <>
    <button className="context-info-button" type="button" aria-label="Explain abbreviations on this page" aria-expanded={open} onClick={()=>setOpen(true)}>i</button>
    <div className={`context-drawer-backdrop ${open?'open':''}`} onClick={()=>setOpen(false)} aria-hidden={!open}/>
    <aside className={`context-info-drawer ${open?'open':''}`} aria-hidden={!open}>
      <div className="context-drawer-inner">
        <div className="context-drawer-head">
          <div><div className="eyebrow">PAGE TERMS</div><h2>Names & abbreviations</h2><p>Quick reference for organizations and common procurement terms shown on this page.</p></div>
          <button className="context-drawer-close" type="button" aria-label="Close" onClick={()=>setOpen(false)}>×</button>
        </div>
        <div className="context-term-list">
          {terms.map(term=><article className="context-term" key={term.code}>
            <div className="context-term-code">{term.code}</div>
            <div><strong>{term.name}</strong>{term.localName&&<span className="context-local-name">{term.localName}</span>}<span className="context-zh-name">{term.zhName}</span><p>{term.description}</p></div>
          </article>)}
        </div>
      </div>
    </aside>
  </>
}
