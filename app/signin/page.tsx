'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/browser-supabase'

export default function SignInPage(){
  const router=useRouter(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState('')
  async function submit(e:React.FormEvent){e.preventDefault();setMsg('Signing in…');const {error}=await supabase.auth.signInWithPassword({email,password});if(error){setMsg(error.message);return}router.push('/dashboard')}
  return <main className="section"><div className="container" style={{maxWidth:520}}><Link className="brand" href="/">BORNEO / BUSINESS</Link><div className="card" style={{marginTop:28}}><div className="eyebrow">Member access</div><h1 className="page-title">Sign in</h1><p className="sub">Open your Business Radar and pipeline.</p><form onSubmit={submit}><p><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:'100%',height:44,padding:'0 12px',border:'1px solid #CBD5DF',borderRadius:6}}/></p><p><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{width:'100%',height:44,padding:'0 12px',border:'1px solid #CBD5DF',borderRadius:6}}/></p><button className="btn primary" style={{width:'100%'}}>Sign In</button></form>{msg&&<p className="meta">{msg}</p>}<p className="meta">No account? <Link className="source" href="/onboarding">Join the network</Link></p></div></div></main>
}
