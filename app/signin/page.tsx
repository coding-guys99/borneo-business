'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/browser-supabase'

export default function SignInPage(){
  const router=useRouter(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState(''); const [busy,setBusy]=useState(false)
  async function submit(e:React.FormEvent){
    e.preventDefault();setBusy(true);setMsg('Signing in…')
    const {data,error}=await supabase.auth.signInWithPassword({email,password})
    if(error||!data.user){setMsg(error?.message||'Unable to sign in');setBusy(false);return}
    const next=typeof window!=='undefined'?new URLSearchParams(window.location.search).get('next'):null
    if(next){window.location.assign(next);return}
    const {data:profile}=await supabase.from('profiles').select('onboarding_completed').eq('id',data.user.id).maybeSingle()
    window.location.assign(profile?.onboarding_completed?'/dashboard':'/guide')
  }
  return <main className="section"><div className="container" style={{maxWidth:520}}><Link className="brand" href="/">BORNEO / BUSINESS</Link><div className="card" style={{marginTop:28}}><div className="eyebrow">Member access</div><h1 className="page-title">Sign in</h1><p className="sub">Open your Business Radar, network and opportunity pipeline.</p><form onSubmit={submit}><p><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Work email" style={{width:'100%',height:44,padding:'0 12px',border:'1px solid #CBD5DF',borderRadius:6}}/></p><p><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{width:'100%',height:44,padding:'0 12px',border:'1px solid #CBD5DF',borderRadius:6}}/></p><button className="btn primary" style={{width:'100%'}} disabled={busy}>{busy?'Signing in…':'Sign In'}</button></form>{msg&&<p className="form-message">{msg}</p>}<p className="meta">No account? <Link className="source" href="/onboarding">Create a business account</Link></p></div></div></main>
}
