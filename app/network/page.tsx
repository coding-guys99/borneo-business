'use client'

import { useEffect, useMemo, useState } from 'react'
import MemberShell from '@/components/member-shell'
import { supabase } from '@/lib/browser-supabase'
import { partnerScore, type CompanyProfile } from '@/lib/matching'

type Company = CompanyProfile & { id:string; owner_id:string; name:string; website:string|null; description:string|null; capabilities:string[]; markets:string[]; looking_for:string[]; is_verified:boolean }

export default function NetworkPage(){
  const [own,setOwn]=useState<Company|null>(null)
  const [companies,setCompanies]=useState<Company[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();if(!user)return
    const {data}=await supabase.from('companies').select('*').order('created_at',{ascending:false})
    const rows=(data as Company[]|null)??[]
    setOwn(rows.find(x=>x.owner_id===user.id)??null)
    setCompanies(rows.filter(x=>x.owner_id!==user.id))
    setLoading(false)
  })()},[])

  const ranked=useMemo(()=>!own?[]:companies.map(c=>({company:c,match:partnerScore(own,c)})).sort((a,b)=>b.match.score-a.match.score),[own,companies])

  return <MemberShell><main className="member-page"><div className="container"><div className="member-heading"><div><div className="eyebrow">Business network</div><h1 className="page-title">Partner Network</h1><p className="sub">Recommendations only use real company profiles in the platform. No placeholder companies are invented.</p></div></div>
    {loading?<div className="panel">Loading verified network data…</div>:!own?<div className="empty-state"><h2>Complete your company profile first</h2><p>Partner matching needs your capabilities and markets.</p></div>:ranked.length===0?<div className="empty-state"><h2>No partner profiles yet</h2><p>Your account is ready. This page will populate as real companies join the network.</p><div className="network-explainer"><span>Capability gap</span><span>Shared market</span><span>Partner intent</span><span>Observed opportunity</span></div></div>:<div className="grid">{ranked.map(({company:c,match})=><article className="card" key={c.id}><div className="score-row"><span className="match-score">{match.score}% partner fit</span>{c.is_verified&&<span className="status-dot">Verified</span>}</div><div className="title">{c.name}</div><div className="meta">{c.region}{c.website&&<> · <a className="source" href={c.website} target="_blank" rel="noreferrer">Website</a></>}<br/>{c.description||'Company description not provided.'}</div><div className="tags">{c.capabilities.slice(0,5).map(x=><span className="tag" key={x}>{x}</span>)}</div><div className="why-match">{match.reasons.map(r=><span key={r}>✓ {r}</span>)}</div></article>)}</div>}
  </div></main></MemberShell>
}
