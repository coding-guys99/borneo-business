'use client'

import { useEffect, useState } from 'react'
import MemberShell from '@/components/member-shell'
import { supabase } from '@/lib/browser-supabase'

const capabilityOptions = ['AV Integration','Broadcast','LED','Audio','Camera','Streaming','Event Production','IT','CCTV','Digital Signage','Communications','Construction','Facilities','Automotive','Healthcare']
const marketOptions = ['Sarawak','Sabah','Brunei','Kalimantan']
const lookingOptions = ['Customers','Tenders','Projects','Partners','Dealers','Suppliers','Distributors']

type Company = { id:string; name:string; region:string; website:string|null; description:string|null; capabilities:string[]; brands:string[]; markets:string[]; looking_for:string[]; is_verified:boolean }

export default function ProfilePage(){
  const [company,setCompany]=useState<Company|null>(null)
  const [fullName,setFullName]=useState('')
  const [message,setMessage]=useState('')
  const [saving,setSaving]=useState(false)

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser(); if(!user)return
    const [{data:p},{data:c}]=await Promise.all([
      supabase.from('profiles').select('full_name').eq('id',user.id).maybeSingle(),
      supabase.from('companies').select('*').eq('owner_id',user.id).order('created_at',{ascending:true}).limit(1).maybeSingle()
    ])
    setFullName(p?.full_name ?? '')
    setCompany((c as Company|null) ?? {id:'',name:'',region:'Sarawak',website:null,description:null,capabilities:[],brands:[],markets:['Sarawak'],looking_for:['Tenders','Projects'],is_verified:false})
  })()},[])

  function toggle(field:'capabilities'|'markets'|'looking_for',value:string){if(!company)return;setCompany({...company,[field]:company[field].includes(value)?company[field].filter(x=>x!==value):[...company[field],value]})}
  function set<K extends keyof Company>(key:K,value:Company[K]){if(company)setCompany({...company,[key]:value})}

  async function save(e:React.FormEvent){e.preventDefault();if(!company)return;setSaving(true);setMessage('Saving…')
    const {data:{user}}=await supabase.auth.getUser();if(!user)return
    const profileResult=await supabase.from('profiles').upsert({id:user.id,full_name:fullName})
    const payload={owner_id:user.id,name:company.name,region:company.region,website:company.website||null,description:company.description||null,capabilities:company.capabilities,brands:company.brands,markets:company.markets,looking_for:company.looking_for}
    const companyResult=company.id?await supabase.from('companies').update(payload).eq('id',company.id).select('*').single():await supabase.from('companies').insert(payload).select('*').single()
    if(profileResult.error||companyResult.error){setMessage(profileResult.error?.message||companyResult.error?.message||'Unable to save');setSaving(false);return}
    setCompany(companyResult.data as Company);setMessage('Profile saved. Your Radar will use these settings immediately.');setSaving(false)
  }

  return <MemberShell><main className="member-page"><div className="container narrow-wide"><div className="member-heading"><div><div className="eyebrow">Company intelligence profile</div><h1 className="page-title">Company Profile</h1><p className="sub">This is the data used to calculate real opportunity and partner matches.</p></div>{company?.is_verified&&<span className="verified-badge">Verified company</span>}</div>
    {!company?<div className="panel">Loading company profile…</div>:<form className="profile-form" onSubmit={save}>
      <section className="panel"><div className="panel-title">Identity</div><div className="form-grid"><label>Your name<input value={fullName} onChange={e=>setFullName(e.target.value)} required/></label><label>Company name<input value={company.name} onChange={e=>set('name',e.target.value)} required/></label><label>Home market<select value={company.region} onChange={e=>set('region',e.target.value)}>{marketOptions.map(x=><option key={x}>{x}</option>)}</select></label><label>Website<input value={company.website??''} onChange={e=>set('website',e.target.value)} placeholder="https://"/></label></div><label>Company description<textarea value={company.description??''} onChange={e=>set('description',e.target.value)} rows={4} placeholder="What does your company actually do?"/></label><label>Brands represented / supplied<input value={company.brands.join(', ')} onChange={e=>set('brands',e.target.value.split(',').map(x=>x.trim()).filter(Boolean))} placeholder="Sony, Blackmagic Design, Shure…"/></label></section>
      <section className="panel"><div className="panel-title">Capabilities</div><p className="meta">Select what your company can actually deliver. These directly affect match scores.</p><div className="choice-grid">{capabilityOptions.map(x=><button type="button" key={x} className={`choice ${company.capabilities.includes(x)?'selected':''}`} onClick={()=>toggle('capabilities',x)}>{x}</button>)}</div></section>
      <section className="panel"><div className="panel-title">Markets served</div><div className="choice-grid small-grid">{marketOptions.map(x=><button type="button" key={x} className={`choice ${company.markets.includes(x)?'selected':''}`} onClick={()=>toggle('markets',x)}>{x}</button>)}</div></section>
      <section className="panel"><div className="panel-title">Looking for</div><div className="choice-grid">{lookingOptions.map(x=><button type="button" key={x} className={`choice ${company.looking_for.includes(x)?'selected':''}`} onClick={()=>toggle('looking_for',x)}>{x}</button>)}</div></section>
      <div className="save-bar"><span className="meta">{message}</span><button className="btn primary" disabled={saving}>{saving?'Saving…':'Save Company Profile'}</button></div>
    </form>}
  </div></main></MemberShell>
}
