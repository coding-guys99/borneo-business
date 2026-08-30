'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import MemberShell from '@/components/member-shell'
import { supabase } from '@/lib/browser-supabase'

type Item={id:string;opportunity_id:string|null;stage:string;quoted_value:number|null;deal_value:number|null;currency:string;verified:boolean;notes:string|null;next_action:string|null;opportunities?:{title:string;buyer:string;region:string;closing_date:string|null}|null}
const stages=['New','Interested','Contacted','Quoted','Won','Lost']
const stageLabel:Record<string,string>={New:'Saved',Interested:'Considering',Contacted:'Contacted',Quoted:'Submitted / Quoted',Won:'Won',Lost:'Not Won'}

export default function PipelinePage(){
  const [items,setItems]=useState<Item[]>([])
  const [loading,setLoading]=useState(true)
  async function load(){const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from('pipeline_items').select('*,opportunities(title,buyer,region,closing_date)').eq('user_id',user.id).order('updated_at',{ascending:false});setItems((data as Item[]|null)??[]);setLoading(false)}
  useEffect(()=>{load()},[])
  async function update(id:string,patch:Partial<Item>){await supabase.from('pipeline_items').update(patch).eq('id',id);setItems(v=>v.map(x=>x.id===id?{...x,...patch}:x))}
  async function remove(id:string){await supabase.from('pipeline_items').delete().eq('id',id);setItems(v=>v.filter(x=>x.id!==id))}
  const wonValue=items.filter(x=>x.stage==='Won').reduce((s,x)=>s+Number(x.deal_value??0),0)

  return <MemberShell><main className="member-page"><div className="container"><div className="member-heading"><div><div className="eyebrow">MY OPPORTUNITIES</div><h1 className="page-title">Saved Opportunities</h1><p className="sub">Keep the opportunities you care about in one place and record what happened next.</p></div><Link className="btn primary" href="/opportunities">Find opportunities</Link></div>
    <div className="kpis member-kpis"><div className="kpi"><strong>{items.length}</strong><span>Saved</span></div><div className="kpi"><strong>{items.filter(x=>x.stage==='Quoted').length}</strong><span>Submitted / quoted</span></div><div className="kpi"><strong>{items.filter(x=>x.stage==='Won').length}</strong><span>Won</span></div><div className="kpi"><strong>RM{wonValue.toLocaleString()}</strong><span>Recorded won value</span></div></div>
    {loading?<div className="panel">Loading saved opportunities…</div>:items.length===0?<div className="empty-state"><h2>No saved opportunities yet</h2><p>Open an opportunity and choose Save Opportunity when you want to keep following it.</p><Link className="btn primary" href="/opportunities">Browse opportunities</Link></div>:<div className="pipeline-board">{stages.map(stage=><section className="pipeline-column" key={stage}><div className="pipeline-column-head"><b>{stageLabel[stage]}</b><span>{items.filter(x=>x.stage===stage).length}</span></div>{items.filter(x=>x.stage===stage).map(item=><article className="pipeline-card" key={item.id}><div className="pipeline-title">{item.opportunities?.title??'Saved opportunity'}</div><div className="meta">{item.opportunities?.buyer??'—'}<br/>{item.opportunities?.region??''}{item.opportunities?.closing_date?` · closes ${item.opportunities.closing_date}`:''}</div><label className="mini-label">Progress<select value={item.stage} onChange={e=>update(item.id,{stage:e.target.value})}>{stages.map(x=><option key={x} value={x}>{stageLabel[x]}</option>)}</select></label>{item.stage==='Quoted'&&<label className="mini-label">Quoted value<input type="number" value={item.quoted_value??''} onChange={e=>update(item.id,{quoted_value:e.target.value?Number(e.target.value):null})}/></label>}{item.stage==='Won'&&<label className="mini-label">Won value<input type="number" value={item.deal_value??''} onChange={e=>update(item.id,{deal_value:e.target.value?Number(e.target.value):null})}/></label>}<label className="mini-label">Next step<input value={item.next_action??''} onChange={e=>setItems(v=>v.map(x=>x.id===item.id?{...x,next_action:e.target.value}:x))} onBlur={e=>update(item.id,{next_action:e.target.value||null})} placeholder="Check documents / call buyer"/></label><div className="card-actions">{item.opportunity_id&&<Link className="source" href={`/opportunities/${item.opportunity_id}`}>Open</Link>}<button className="link-danger" onClick={()=>remove(item.id)}>Remove</button></div></article>)}</section>)}</div>}
  </div></main></MemberShell>
}
