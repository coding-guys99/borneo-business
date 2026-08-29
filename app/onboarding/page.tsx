'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/browser-supabase'

export default function OnboardingPage(){
  const router=useRouter(); const [form,setForm]=useState({name:'',email:'',password:'',company:'',region:'Sarawak',website:''}); const [msg,setMsg]=useState('')
  const set=(k:string,v:string)=>setForm(x=>({...x,[k]:v}))
  async function submit(e:React.FormEvent){e.preventDefault();setMsg('Creating account…');const {data,error}=await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{full_name:form.name}}});if(error){setMsg(error.message);return}if(data.user){await supabase.from('profiles').upsert({id:data.user.id,full_name:form.name});await supabase.from('companies').insert({owner_id:data.user.id,name:form.company,region:form.region,website:form.website||null,capabilities:[]})}setMsg('Account created. Check your email if confirmation is required.');router.push('/dashboard')}
  return <main className="section"><div className="container" style={{maxWidth:620}}><Link className="brand" href="/">BORNEO / BUSINESS</Link><div className="card" style={{marginTop:28}}><div className="eyebrow">Join the network</div><h1 className="page-title">Build your Business Radar</h1><p className="sub">Create your account and company profile.</p><form onSubmit={submit}>{[['name','Your name'],['email','Email'],['password','Password'],['company','Company name'],['website','Website (optional)']].map(([k,p])=><p key={k}><input required={k!=='website'} type={k==='password'?'password':k==='email'?'email':'text'} value={(form as any)[k]} onChange={e=>set(k,e.target.value)} placeholder={p} style={{width:'100%',height:44,padding:'0 12px',border:'1px solid #CBD5DF',borderRadius:6}}/></p>)}<p><select value={form.region} onChange={e=>set('region',e.target.value)} style={{width:'100%',height:44,padding:'0 12px',border:'1px solid #CBD5DF',borderRadius:6}}><option>Sarawak</option><option>Sabah</option><option>Brunei</option></select></p><button className="btn primary" style={{width:'100%'}}>Create Account</button></form>{msg&&<p className="meta">{msg}</p>}</div></div></main>
}
