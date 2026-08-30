'use client'

import {useEffect,useState} from 'react'
import {supabase} from '@/lib/browser-supabase'

const categories=[
  ['function','Function issue / 功能问题'],
  ['bug','Bug / 页面或功能错误'],
  ['data','Wrong or outdated data / 资料错误或过期'],
  ['translation','Translation issue / 翻译问题'],
  ['billing','Subscription & billing / 订阅与付款'],
  ['account','Account & login / 帐号与登入'],
  ['suggestion','Suggestion / 建议'],
  ['other','Other / 其他'],
] as const

export default function SupportPage(){
  const [category,setCategory]=useState('function')
  const [subject,setSubject]=useState('')
  const [description,setDescription]=useState('')
  const [email,setEmail]=useState('')
  const [pageUrl,setPageUrl]=useState('')
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')

  useEffect(()=>{setPageUrl(document.referrer||window.location.href);supabase.auth.getUser().then(({data})=>{if(data.user?.email)setEmail(data.user.email)})},[])

  async function submit(e:React.FormEvent){
    e.preventDefault();setBusy(true);setMessage('')
    const {data:{user}}=await supabase.auth.getUser()
    const {error}=await supabase.from('support_requests').insert({user_id:user?.id??null,category,subject:subject.trim(),description:description.trim(),page_url:pageUrl.trim()||null,email:email.trim()||null,status:'submitted'})
    if(error)setMessage(`Unable to submit: ${error.message}`)
    else{setMessage('Submitted. Thank you — your report has been recorded.');setSubject('');setDescription('')}
    setBusy(false)
  }

  return <main className="section"><div className="container support-layout">
    <section><div className="eyebrow">SUPPORT</div><h1 className="page-title">How can we help?</h1><p className="sub">Report a problem, incorrect information, account issue or suggestion. Choose the closest category so it can be reviewed properly.</p>
      <form className="panel support-form" onSubmit={submit}>
        <label>Issue type<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label>
        <label>Subject<input required minLength={3} maxLength={160} value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Briefly describe the issue"/></label>
        <label>Description<textarea required minLength={5} maxLength={5000} rows={7} value={description} onChange={e=>setDescription(e.target.value)} placeholder="What happened? What did you expect to happen?"/></label>
        <div className="support-two"><label>Email <span>optional</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/></label><label>Related page <span>optional</span><input value={pageUrl} onChange={e=>setPageUrl(e.target.value)} placeholder="https://..."/></label></div>
        <div className="support-submit"><button className="btn primary" disabled={busy}>{busy?'Submitting…':'Submit report'}</button>{message&&<span className="meta">{message}</span>}</div>
      </form>
    </section>
    <aside><div className="panel support-side"><div className="panel-title">Before reporting</div><p>For tender deadlines, eligibility, submission instructions and legal requirements, always verify the official procurement notice first.</p><p>If Borneo Business shows different information, choose <strong>Wrong or outdated data</strong> so we can review the source record.</p></div></aside>
  </div></main>
}
