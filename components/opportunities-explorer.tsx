'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Opportunity } from '@/lib/data'
import { useI18n } from '@/components/i18n'

const PAGE_SIZE=20
const divisions=['Kuching','Samarahan','Serian','Sri Aman','Betong','Sarikei','Sibu','Mukah','Bintulu','Kapit','Miri','Limbang']
function detectDivision(o:Opportunity){
 const hay=`${o.title} ${o.buyer}`.toLowerCase()
 const aliases:Record<string,string[]>= {Kuching:['kuching','petra jaya','padawan','matang','siburan'],Samarahan:['samarahan','asajaya','sebuyau','simunjan','sadong jaya'],Serian:['serian','tebakang'], 'Sri Aman':['sri aman','lubok antu'],Betong:['betong','saratok','pusa'],Sarikei:['sarikei','julau','meradong'],Sibu:['sibu','kanowit','selangau'],Mukah:['mukah','daro','dalat','matu','tanjung manis'],Bintulu:['bintulu','sebaugh','sebauh','tatau','tubau'],Kapit:['kapit','song','belaga','bukit mabong'],Miri:['miri','bekenu','marudi'],Limbang:['limbang','lawas']}
 for(const d of divisions) if((aliases[d]||[d.toLowerCase()]).some(k=>hay.includes(k))) return d
 return 'Other / Statewide'
}

export default function OpportunitiesExplorer({ opportunities }: { opportunities: Opportunity[] }){
  const {t}=useI18n()
  const [query,setQuery]=useState('')
  const [division,setDivision]=useState('ALL_DIVISIONS')
  const [industry,setIndustry]=useState('ALL')
  const [status,setStatus]=useState('ALL')
  const [page,setPage]=useState(1)
  const availableDivisions=Array.from(new Set(opportunities.map(detectDivision))).sort()
  const industries=Array.from(new Set(opportunities.map(x=>x.industry??'General'))).sort()
  const today=new Date().toISOString().slice(0,10)
  const filtered=useMemo(()=>opportunities.filter(o=>{
    const hay=`${o.title} ${o.buyer} ${o.reference??''}`.toLowerCase()
    const open=!o.closing_date||o.closing_date>=today
    return (!query||hay.includes(query.toLowerCase()))&&(division==='ALL_DIVISIONS'||detectDivision(o)===division)&&(industry==='ALL'||(o.industry??'General')===industry)&&(status==='ALL'||(status==='OPEN'?open:!open))
  }),[opportunities,query,division,industry,status,today])
  const totalPages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE))
  const currentPage=Math.min(page,totalPages)
  const pageItems=filtered.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE)

  useEffect(()=>{setPage(1)},[query,division,industry,status])
  useEffect(()=>{if(page>totalPages)setPage(totalPages)},[page,totalPages])

  function go(next:number){
    const target=Math.max(1,Math.min(totalPages,next))
    setPage(target)
    document.querySelector('.opportunities-results')?.scrollIntoView({behavior:'smooth',block:'start'})
  }
  const pageNumbers=Array.from({length:totalPages},(_,i)=>i+1)

  return <><div className="filter-bar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('search')}/><select value={division} onChange={e=>setDivision(e.target.value)}><option value="ALL_DIVISIONS">{t('all')} · {t('division')}</option>{availableDivisions.map(x=><option key={x} value={x}>{x}</option>)}</select><select value={industry} onChange={e=>setIndustry(e.target.value)}><option value="ALL">{t('all')} · {t('industry')}</option>{industries.map(x=><option key={x} value={x}>{x}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">{t('all')}</option><option value="OPEN">{t('open')}</option><option value="CLOSED">{t('closed')}</option></select></div><div className="results-line opportunities-results">{filtered.length} {t('results')} · {t('page')} {currentPage} / {totalPages}</div><div className="table-wrap"><div className="table"><div className="row head"><div>{t('division')}</div><div>{t('projectBrief')}</div><div>{t('buyer')}</div><div>{t('type')}</div><div>{t('details')}</div></div>{pageItems.map(o=><div className="row" key={o.id}><div><b>{detectDivision(o)}</b></div><div><Link className="table-link" href={`/opportunities/${o.id}`}>{o.title}</Link><div className="meta">{o.reference??'—'} · {o.industry??'General'} · {t('closing')} {o.closing_date??'—'}</div></div><div>{o.buyer}</div><div>{o.opportunity_type}</div><div><Link className="btn small primary" href={`/opportunities/${o.id}`}>{t('viewProject')}</Link></div></div>)}</div></div>{filtered.length>PAGE_SIZE&&<nav className="pagination" aria-label="Opportunity pages"><button className="pagination-arrow" onClick={()=>go(currentPage-1)} disabled={currentPage===1} aria-label={t('previousPage')}>←</button><div className="pagination-pages">{pageNumbers.map(n=><button key={n} className={`pagination-page ${n===currentPage?'active':''}`} onClick={()=>go(n)} aria-current={n===currentPage?'page':undefined}>{n}</button>)}</div><button className="pagination-arrow" onClick={()=>go(currentPage+1)} disabled={currentPage===totalPages} aria-label={t('nextPage')}>→</button></nav>}</>
}
