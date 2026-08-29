'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Opportunity } from '@/lib/data'

export default function OpportunitiesExplorer({ opportunities }: { opportunities: Opportunity[] }){
  const [query,setQuery]=useState('')
  const [region,setRegion]=useState('All')
  const [industry,setIndustry]=useState('All')
  const [status,setStatus]=useState('Open')
  const regions=['All',...Array.from(new Set(opportunities.map(x=>x.region))).sort()]
  const industries=['All',...Array.from(new Set(opportunities.map(x=>x.industry??'General'))).sort()]
  const today=new Date().toISOString().slice(0,10)
  const filtered=useMemo(()=>opportunities.filter(o=>{
    const hay=`${o.title} ${o.buyer} ${o.reference??''}`.toLowerCase()
    const open=!o.closing_date||o.closing_date>=today
    return (!query||hay.includes(query.toLowerCase()))&&(region==='All'||o.region===region)&&(industry==='All'||(o.industry??'General')===industry)&&(status==='All'||(status==='Open'?open:!open))
  }),[opportunities,query,region,industry,status,today])

  return <><div className="filter-bar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search opportunity, buyer or reference…"/><select value={region} onChange={e=>setRegion(e.target.value)}>{regions.map(x=><option key={x}>{x}</option>)}</select><select value={industry} onChange={e=>setIndustry(e.target.value)}>{industries.map(x=><option key={x}>{x}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)}><option>Open</option><option>Closed</option><option>All</option></select></div><div className="results-line">{filtered.length} results</div><div className="table-wrap"><div className="table"><div className="row head"><div>Region</div><div>Opportunity</div><div>Buyer</div><div>Type</div><div>Closing</div></div>{filtered.map(o=><div className="row" key={o.id}><div><b>{o.region}</b></div><div><Link className="table-link" href={`/opportunities/${o.id}`}>{o.title}</Link><div className="meta">{o.reference??'—'} · {o.industry??'General'}</div></div><div>{o.buyer}</div><div>{o.opportunity_type}</div><div>{o.closing_date??'—'}<br/><Link className="source" href={`/opportunities/${o.id}`}>Details →</Link></div></div>)}</div></div></>
}
