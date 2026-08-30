'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/browser-supabase'
import { useI18n } from '@/components/i18n'

const copy={
 en:{eyebrow:'Member access',title:'Sign in',sub:'Open your saved opportunities, business partners and company profile.',email:'Work email',password:'Password',signing:'Signing in…',button:'Sign In',noAccount:'No account?',create:'Create a business account',unable:'Unable to sign in'},
 zh:{eyebrow:'会员登录',title:'登录',sub:'查看已保存商机、合作伙伴和公司资料。',email:'工作邮箱',password:'密码',signing:'正在登录…',button:'登录',noAccount:'还没有帐号？',create:'建立企业帐号',unable:'无法登录'},
 ms:{eyebrow:'Akses ahli',title:'Log masuk',sub:'Buka peluang yang disimpan, rakan niaga dan profil syarikat anda.',email:'E-mel kerja',password:'Kata laluan',signing:'Sedang log masuk…',button:'Log Masuk',noAccount:'Belum ada akaun?',create:'Cipta akaun perniagaan',unable:'Tidak dapat log masuk'}
} as const

export default function SignInPage(){
  const router=useRouter(); const {lang}=useI18n(); const c=copy[lang]
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState(''); const [busy,setBusy]=useState(false)
  async function submit(e:React.FormEvent){
    e.preventDefault();setBusy(true);setMsg(c.signing)
    const {data,error}=await supabase.auth.signInWithPassword({email,password})
    if(error||!data.user){setMsg(error?.message||c.unable);setBusy(false);return}
    const next=typeof window!=='undefined'?new URLSearchParams(window.location.search).get('next'):null
    if(next){window.location.assign(next);return}
    const {data:profile}=await supabase.from('profiles').select('onboarding_completed').eq('id',data.user.id).maybeSingle()
    window.location.assign(profile?.onboarding_completed?'/dashboard':'/guide')
  }
  return <main className="section"><div className="container" style={{maxWidth:520}}><Link className="brand" href="/">BORNEO / BUSINESS</Link><div className="card" style={{marginTop:28}}><div className="eyebrow">{c.eyebrow}</div><h1 className="page-title">{c.title}</h1><p className="sub">{c.sub}</p><form onSubmit={submit}><p><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={c.email} aria-label={c.email} style={{width:'100%',height:44,padding:'0 12px',border:'1px solid #CBD5DF',borderRadius:6}}/></p><p><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={c.password} aria-label={c.password} style={{width:'100%',height:44,padding:'0 12px',border:'1px solid #CBD5DF',borderRadius:6}}/></p><button className="btn primary" style={{width:'100%'}} disabled={busy}>{busy?c.signing:c.button}</button></form>{msg&&<p className="form-message">{msg}</p>}<p className="meta">{c.noAccount} <Link className="source" href="/onboarding">{c.create}</Link></p></div></div></main>
}
