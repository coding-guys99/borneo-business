'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Opportunity } from '@/lib/data'

const divisions=['Kuching','Samarahan','Serian','Sri Aman','Betong','Sarikei','Sibu','Mukah','Bintulu','Kapit','Miri','Limbang']
function detectDivision(o:Opportunity){
 const hay=`${o.title} ${o.buyer}`.toLowerCase()
 const aliases:Record<string,string[]>= {Kuching:['kuching','petra jaya','padawan','matang','siburan'],Samarahan:['samarahan','asajaya','sebuyau','simunjan','sadong jaya'],Serian:['serian','tebakang'], 'Sri Aman':['sri aman','lubok antu'],Betong:['betong','saratok','pusa'],Sarikei:['sarikei','julau','meradong'],Sibu:['sibu','kanowit','selangau'],Mukah:['mukah','daro','dalat','matu','tanjung manis'],Bintulu:['bintulu','sebaugh','sebauh','tatau','tubau'],Kapit:['kapit','song','belaga','bukit mabong'],Miri:['miri','bekenu','marudi'],Limbang:['limbang','lawas']}
 for(const d of divisions) if((aliases[d]||[d.toLowerCase()]).some(k=>hay.includes(k))) return d
 return 'Other / Statewide'
}

export default function OpportunitiesExplorer({ opportunities }: { opportunities: Opportunity[] }){
  const [query,setQuery]=useState('')
  const [division,setDivision]=useState('All divisions')
  const [industry,setIndustry]=useState('All')
  const [status,setStatus]=useState('All')
  const availableDivisions=['All divisions',...Array.from(new Set(opportunities.map(detectDivision))).sort()]
  const industries=['All',...Array.from(new Set(opportunities.map(x=>x.industry??'General'))).sort()]
  const today=new Date().toISOString().slice(0,10)
  const filtered=useMemo(()=>opportunities.filter(o=>{
    const hay=`${o.title} ${o.buyer} ${o.reference??''}`.toLowerCase()
    const open=!o.closing_date||o.closing_date>=today
    return (!query||hay.includes(query.toLowerCase()))&&(division==='All divisions'||detectDivision(o)===division)&&(industry==='All'||(o.industry??'General')===industry)&&(status==='All'||(status==='Open'?open:!open))
  }),[opportunities,query,division,industry,status,today])

  return <><div className="filter-bar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search project, buyer or reference…"/><select value={division} onChange={e=>setDivision(e.target.value)}>{availableDivisions.map(x=><option key={x}>{x}</option>)}</select><select value={industry} onChange={e=>setIndustry(e.target.value)}>{industries.map(x=><option key={x}>{x}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option><option>Open</option><option>Closed</option></select></div><div className="results-line">{filtered.length} Sarawak projects</div><div className="table-wrap"><div className="table"><div className="row head"><div>Division</div><div>Project</div><div>Buyer</div><div>Type</div><div>Action</div></div>{filtered.map(o=><div className="row" key={o.id}><div><b>{detectDivision(o)}</b></div><div><Link className="table-link" href={`/opportunities/${o.id}`}>{o.title}</Link><div className="meta">{o.reference??'—'} · {o.industry??'General'} · closes {o.closing_date??'—'}</div></div><div>{o.buyer}</div><div>{o.opportunity_type}</div><div><Link className="btn small primary" href={`/opportunities/${o.id}`}>View project</Link></div></div>)}</div></div></>
}
