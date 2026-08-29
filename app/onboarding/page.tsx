'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/browser-supabase'

const capabilities=['AV Integration','Broadcast','LED','Audio','Camera','Streaming','Event Production','IT','CCTV','Digital Signage','Communications','Construction','Facilities','Automotive','Healthcare']
const looking=['Customers','Tenders','Projects','Partners','Dealers','Suppliers','Distributors']
const markets=['Sarawak','Sabah','Brunei','Kalimantan']

export default function OnboardingPage(){
  const router=useRouter()
  const [form,setForm]=useState({name:'',email:'',password:'',company:'',region:'Sarawak',website:'',description:'',capabilities:[] as string[],markets:['Sarawak'] as string[],looking_for:['Tenders','Projects'] as string[],brands:''})
  const [msg,setMsg]=useState('')
  const [busy,setBusy]=useState(false)
  const set=(k:string,v:unknown)=>setForm(x=>({...x,[k]:v}))
  const toggle=(k:'capabilities'|'markets'|'looking_for',v:string)=>set(k,form[k].includes(v)?form[k].filter(x=>x!==v):[...form[k],v])

  async function submit(e:React.FormEvent){e.preventDefault();if(form.capabilities.length===0){setMsg('Select at least one real company capability.');return}setBusy(true);setMsg('Creating your business account…')
    const {data,error}=await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{full_name:form.name,company_name:form.company,region:form.region,website:form.website,company_description:form.description,capabilities:form.capabilities,markets:form.markets,looking_for:form.looking_for,brands:form.brands.split(',').map(x=>x.trim()).filter(Boolean)}}})
    if(error){setMsg(error.message);setBusy(false);return}
    if(data.session){setMsg('Account created. Opening your Business Radar…');router.push('/dashboard');router.refresh();return}
    setMsg('Account created. Please confirm the email we sent you, then sign in. Your company profile is already prepared.');setBusy(false)
  }

  return <main className="section"><div className="container onboarding-wrap"><Link className="brand" href="/">BORNEO / BUSINESS</Link><div className="onboarding-grid"><div><div className="eyebrow">Join Borneo Business</div><h1 className="onboarding-title">Build a Radar around what your company can actually deliver.</h1><p className="lead small-lead">Your profile powers opportunity matching, partner discovery and revenue attribution. No fake match scores.</p><div className="onboarding-points"><span>01 · Verified public opportunity data</span><span>02 · Capability + market matching</span><span>03 · Private opportunity pipeline</span><span>04 · Real company network as it grows</span></div></div><form className="panel onboarding-form" onSubmit={submit}><div className="panel-title">Account</div><div className="form-grid"><label>Your name<input required value={form.name} onChange={e=>set('name',e.target.value)}/></label><label>Work email<input required type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></label><label>Password<input required minLength={8} type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Minimum 8 characters"/></label><label>Company name<input required value={form.company} onChange={e=>set('company',e.target.value)}/></label><label>Home market<select value={form.region} onChange={e=>set('region',e.target.value)}>{markets.map(x=><option key={x}>{x}</option>)}</select></label><label>Website<input value={form.website} onChange={e=>set('website',e.target.value)} placeholder="Optional"/></label></div><label>Company description<textarea rows={3} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="What does your company do?"/></label><label>Brands<input value={form.brands} onChange={e=>set('brands',e.target.value)} placeholder="Sony, Shure, Blackmagic Design…"/></label><div className="form-section"><b>Capabilities</b><div className="choice-grid">{capabilities.map(x=><button type="button" key={x} className={`choice ${form.capabilities.includes(x)?'selected':''}`} onClick={()=>toggle('capabilities',x)}>{x}</button>)}</div></div><div className="form-section"><b>Markets served</b><div className="choice-grid small-grid">{markets.map(x=><button type="button" key={x} className={`choice ${form.markets.includes(x)?'selected':''}`} onClick={()=>toggle('markets',x)}>{x}</button>)}</div></div><div className="form-section"><b>Looking for</b><div className="choice-grid">{looking.map(x=><button type="button" key={x} className={`choice ${form.looking_for.includes(x)?'selected':''}`} onClick={()=>toggle('looking_for',x)}>{x}</button>)}</div></div><button className="btn primary full" disabled={busy}>{busy?'Creating account…':'Create Business Account'}</button>{msg&&<p className="form-message">{msg}</p>}<p className="meta">Already a member? <Link className="source" href="/signin">Sign in</Link></p></form></div></div></main>
}
