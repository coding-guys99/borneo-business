'use client'

import { useEffect, useState } from 'react'
import type { ProcurementTerm } from '@/lib/procurement-terms'
import OfficialPdfButton from '@/components/official-pdf-button'

type Props={terms:ProcurementTerm[];sourceUrl?:string;reference?:string|null}

export default function ContextInfoDrawer({terms,sourceUrl,reference}:Props){
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    function onKey(e:KeyboardEvent){if(e.key==='Escape')setOpen(false)}
    window.addEventListener('keydown',onKey)
    return()=>window.removeEventListener('keydown',onKey)
  },[])
  if(!terms.length&&!sourceUrl)return null
  return <>
    <button className="context-info-button" type="button" aria-label="Open information" aria-expanded={open} onClick={()=>setOpen(true)}>i</button>
    <div className={`context-drawer-backdrop ${open?'open':''}`} onClick={()=>setOpen(false)} aria-hidden={!open}/>
    <aside className={`context-info-drawer ${open?'open':''}`} aria-hidden={!open}>
      <div className="context-drawer-inner">
        <div className="context-drawer-head">
          <div><div className="eyebrow">INFORMATION</div><h2>Project information</h2><p>Quick reference for names, abbreviations and the original public document.</p></div>
          <button className="context-drawer-close" type="button" aria-label="Close" onClick={()=>setOpen(false)}>×</button>
        </div>
        {sourceUrl&&<section className="context-document-section"><div><span className="context-section-label">OFFICIAL DOCUMENT</span><strong>Original public source</strong><p>Open or download the official source copy without searching through the agency website again.</p></div><OfficialPdfButton sourceUrl={sourceUrl} reference={reference}/></section>}
        {terms.length>0&&<div className="context-term-list">
          {terms.map(term=><article className="context-term" key={term.code}>
            <div className="context-term-code">{term.code}</div>
            <div><strong>{term.name}</strong>{term.localName&&<span className="context-local-name">{term.localName}</span>}<span className="context-zh-name">{term.zhName}</span><p>{term.description}</p></div>
          </article>)}
        </div>}
      </div>
    </aside>
  </>
}
