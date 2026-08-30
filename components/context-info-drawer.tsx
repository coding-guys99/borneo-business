'use client'

import {useEffect,useState} from 'react'
import {useI18n} from '@/components/i18n'
import type {ProcurementTerm} from '@/lib/procurement-terms'
import OfficialPdfButton from '@/components/official-pdf-button'

type Props={terms:ProcurementTerm[];sourceUrl?:string;reference?:string|null}
const copy={
 en:{open:'Open information',eyebrow:'INFORMATION',title:'Project information',lead:'Quick reference for agencies, abbreviations, registration grades, qualification terms and the original public document.',close:'Close',doc:'OFFICIAL DOCUMENT',original:'Original public source',docText:'Open or download the official source copy without searching through the agency website again.'},
 zh:{open:'打开说明',eyebrow:'说明',title:'术语与官方资料',lead:'快速查看本页出现的机构、缩写、公司注册等级、资格术语与官方来源。',close:'关闭',doc:'官方文件',original:'官方公开来源',docText:'直接打开或下载官方来源资料，不需要再到政府网站重新寻找。'},
 ms:{open:'Buka maklumat',eyebrow:'MAKLUMAT',title:'Maklumat projek',lead:'Rujukan ringkas untuk agensi, singkatan, gred pendaftaran, istilah kelayakan dan dokumen awam asal.',close:'Tutup',doc:'DOKUMEN RASMI',original:'Sumber awam asal',docText:'Buka atau muat turun salinan sumber rasmi tanpa mencarinya semula di laman agensi.'}
} as const

export default function ContextInfoDrawer({terms,sourceUrl,reference}:Props){
 const [open,setOpen]=useState(false);const {lang}=useI18n();const c=copy[lang]
 useEffect(()=>{function onKey(e:KeyboardEvent){if(e.key==='Escape')setOpen(false)}window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[])
 if(!terms.length&&!sourceUrl)return null
 return <>
  <button className="context-info-button" type="button" aria-label={c.open} aria-expanded={open} onClick={()=>setOpen(true)}>i</button>
  <div className={`context-drawer-backdrop ${open?'open':''}`} onClick={()=>setOpen(false)} aria-hidden={!open}/>
  <aside className={`context-info-drawer ${open?'open':''}`} aria-hidden={!open}><div className="context-drawer-inner">
   <div className="context-drawer-head"><div><div className="eyebrow">{c.eyebrow}</div><h2>{c.title}</h2><p>{c.lead}</p></div><button className="context-drawer-close" type="button" aria-label={c.close} onClick={()=>setOpen(false)}>×</button></div>
   {sourceUrl&&<section className="context-document-section"><div><span className="context-section-label">{c.doc}</span><strong>{c.original}</strong><p>{c.docText}</p></div><OfficialPdfButton sourceUrl={sourceUrl} reference={reference??null}/></section>}
   {terms.length>0&&<div className="context-term-list">{terms.map(term=><article className="context-term" key={term.code}><div className="context-term-code">{term.code}</div><div><strong>{term.name}</strong>{term.localName&&<span className="context-local-name">{term.localName}</span>}<span className="context-zh-name">{term.zhName}</span><p>{lang==='zh'?(term.descriptionZh??term.description):lang==='ms'?(term.descriptionMs??term.description):term.description}</p></div></article>)}</div>}
  </div></aside>
 </>
}
