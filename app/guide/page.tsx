'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import MemberShell from '@/components/member-shell'
import { supabase } from '@/lib/browser-supabase'

type Company = { name:string; description:string|null; capabilities:string[]; markets:string[]; opportunity_markets:string[]; looking_for:string[] }

export default function GuidePage(){
  const [company,setCompany]=useState<Company|null>(null)
  const [pipelineCount,setPipelineCount]=useState(0)
  const [finished,setFinished]=useState(false)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser(); if(!user){setLoading(false);return}
    const [{data:c},{count},{data:p}]=await Promise.all([
      supabase.from('companies').select('name,description,capabilities,markets,opportunity_markets,looking_for').eq('owner_id',user.id).limit(1).maybeSingle(),
      supabase.from('pipeline_items').select('id',{count:'exact',head:true}).eq('user_id',user.id),
      supabase.from('profiles').select('onboarding_completed').eq('id',user.id).maybeSingle()
    ])
    setCompany(c as Company|null);setPipelineCount(count||0);setFinished(Boolean(p?.onboarding_completed));setLoading(false)
  })()},[])

  const checks=useMemo(()=>({
    identity:Boolean(company?.name && company?.description),
    capability:Boolean(company?.capabilities?.length),
    market:Boolean(company?.opportunity_markets?.length),
    goal:Boolean(company?.looking_for?.length),
    pipeline:pipelineCount>0,
  }),[company,pipelineCount])
  const completed=Object.values(checks).filter(Boolean).length

  async function finish(){
    const {data:{user}}=await supabase.auth.getUser();if(!user)return
    await supabase.from('profiles').update({onboarding_completed:true}).eq('id',user.id)
    setFinished(true)
    window.location.assign('/dashboard')
  }

  return <MemberShell><main className="member-page"><div className="container narrow-wide">
    <div className="member-heading"><div><div className="eyebrow">Welcome to Borneo Business</div><h1 className="page-title">Set up your Business Radar</h1><p className="sub">Five practical steps. Complete the essentials first, then the platform starts working around your company.</p></div><div className="verified-badge">{loading?'Loading…':`${completed}/5 complete`}</div></div>

    <section className="panel" style={{marginBottom:18}}><div className="panel-title">How this works</div><p className="sub" style={{marginBottom:0}}>You tell us what your company does and where you want business. The platform matches public opportunities, helps you find partners, and lets you track each opportunity through to a won or lost outcome.</p></section>

    <div style={{display:'grid',gap:12}}>
      <GuideStep no="01" done={checks.identity} title="Complete your company identity" text="Add a clear company description, base, website and business identity. Buyers will eventually use this public business profile to discover suppliers." href="/profile" action="Edit Company Profile"/>
      <GuideStep no="02" done={checks.capability} title="Tell us what you can actually deliver" text="Select real capabilities such as Broadcast, AV Integration, IT, CCTV or Event Production. These fields drive matching — not a fake AI percentage." href="/profile" action="Set Capabilities"/>
      <GuideStep no="03" done={checks.market} title="Choose where you want opportunities" text="Your company can be based in Sarawak while watching several Borneo markets. Select Sarawak, Sabah, Brunei and/or Kalimantan independently." href="/profile" action="Choose Opportunity Markets"/>
      <GuideStep no="04" done={checks.goal} title="Choose what you are looking for" text="Customers, tenders, projects, partners, dealers, suppliers or distributors. This changes what the platform should prioritise for you." href="/profile" action="Set Business Goals"/>
      <GuideStep no="05" done={checks.pipeline} title="Save your first opportunity" text="Open Opportunities, choose something relevant and save it to Pipeline. From there track Interested → Contacted → Quoted → Won / Lost." href="/opportunities" action="Browse Opportunities"/>
    </div>

    <section className="panel" style={{marginTop:18}}><div className="panel-title">You can change this anytime</div><p className="meta">Finishing the guide does not lock your settings. Company Profile remains editable and your Radar updates from the latest saved data.</p><div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}}><button className="btn primary" onClick={finish}>{finished?'Open Business Radar':'Finish setup & open Radar'}</button><Link className="btn" href="/dashboard">Skip for now</Link></div></section>
  </div></main></MemberShell>
}

function GuideStep({no,done,title,text,href,action}:{no:string;done:boolean;title:string;text:string;href:string;action:string}){
  return <section className="panel" style={{display:'grid',gridTemplateColumns:'56px minmax(0,1fr) auto',gap:16,alignItems:'center'}}>
    <div style={{width:46,height:46,borderRadius:8,border:'1px solid #DDE4EA',display:'grid',placeItems:'center',fontWeight:800,color:done?'#163B65':'#647181'}}>{done?'✓':no}</div>
    <div><div className="panel-title" style={{marginBottom:5}}>{title}</div><p className="meta" style={{margin:0}}>{text}</p></div>
    <Link className={done?'btn':'btn primary'} href={href}>{done?'Review':action}</Link>
  </section>
}
