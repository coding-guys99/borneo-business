'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import MemberShell from '@/components/member-shell'
import { supabase } from '@/lib/browser-supabase'

type Company = { name:string; description:string|null; capabilities:string[]; markets:string[]; opportunity_markets:string[]; looking_for:string[] }

export default function GuidePage(){
  const [company,setCompany]=useState<Company|null>(null)
  const [savedCount,setSavedCount]=useState(0)
  const [finished,setFinished]=useState(false)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser(); if(!user){setLoading(false);return}
    const [{data:c},{count},{data:p}]=await Promise.all([
      supabase.from('companies').select('name,description,capabilities,markets,opportunity_markets,looking_for').eq('owner_id',user.id).limit(1).maybeSingle(),
      supabase.from('pipeline_items').select('id',{count:'exact',head:true}).eq('user_id',user.id),
      supabase.from('profiles').select('onboarding_completed').eq('id',user.id).maybeSingle()
    ])
    setCompany(c as Company|null);setSavedCount(count||0);setFinished(Boolean(p?.onboarding_completed));setLoading(false)
  })()},[])

  const checks=useMemo(()=>({identity:Boolean(company?.name&&company?.description),capability:Boolean(company?.capabilities?.length),market:Boolean(company?.opportunity_markets?.length),goal:Boolean(company?.looking_for?.length),saved:savedCount>0}),[company,savedCount])
  const completed=Object.values(checks).filter(Boolean).length
  async function finish(){const {data:{user}}=await supabase.auth.getUser();if(!user)return;await supabase.from('profiles').update({onboarding_completed:true}).eq('id',user.id);setFinished(true);window.location.assign('/dashboard')}

  return <MemberShell><main className="member-page"><div className="container narrow-wide">
    <div className="member-heading"><div><div className="eyebrow">GET STARTED</div><h1 className="page-title">Set up your company</h1><p className="sub">Complete the basic information first. Borneo Business will then show opportunities that are more relevant to your company.</p></div><div className="verified-badge">{loading?'Loading…':`${completed}/5 complete`}</div></div>
    <section className="panel" style={{marginBottom:18}}><div className="panel-title">How to use Borneo Business</div><p className="sub" style={{marginBottom:0}}>Add your company information, browse public opportunities, check whether the project suits your business, save the ones you want to follow and verify all formal requirements on the official source before submitting.</p></section>
    <div style={{display:'grid',gap:12}}>
      <GuideStep no="01" done={checks.identity} title="Add your company details" text="Company name, description, base and website help the platform understand what business you are in." href="/profile" action="Edit Company Profile"/>
      <GuideStep no="02" done={checks.capability} title="Choose what your company can deliver" text="Select real capabilities such as Broadcast, AV Integration, IT, CCTV, Construction or Event Production." href="/profile" action="Set Capabilities"/>
      <GuideStep no="03" done={checks.market} title="Choose where you want business" text="Select the markets where your company is willing to take projects." href="/profile" action="Choose Markets"/>
      <GuideStep no="04" done={checks.goal} title="Tell us what you are looking for" text="For example tenders, projects, customers or business partners." href="/profile" action="Set Business Goals"/>
      <GuideStep no="05" done={checks.saved} title="Save your first opportunity" text="Open an opportunity, check whether it is worth your time and choose Save Opportunity if you want to keep following it." href="/opportunities" action="Browse Opportunities"/>
    </div>
    <section className="panel" style={{marginTop:18}}><div className="panel-title">Need help with tender terms?</div><p className="meta">CIDB, UPKJ, MOF, JKR, RFQ, RFP and other common terms are explained in plain language.</p><div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}}><Link className="btn" href="/procurement-guide">Open Tender Guide</Link><button className="btn primary" onClick={finish}>{finished?'Open My Opportunities':'Finish setup'}</button><Link className="btn" href="/dashboard">Skip for now</Link></div></section>
  </div></main></MemberShell>
}

function GuideStep({no,done,title,text,href,action}:{no:string;done:boolean;title:string;text:string;href:string;action:string}){
  return <section className="panel" style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}><div style={{width:46,height:46,flex:'0 0 46px',borderRadius:8,border:'1px solid #DDE4EA',display:'grid',placeItems:'center',fontWeight:800,color:done?'#163B65':'#647181'}}>{done?'✓':no}</div><div style={{flex:'1 1 300px',minWidth:0}}><div className="panel-title" style={{marginBottom:5}}>{title}</div><p className="meta" style={{margin:0}}>{text}</p></div><Link className={done?'btn':'btn primary'} href={href}>{done?'Review':action}</Link></section>
}
