'use client'

import { useEffect, useMemo, useState } from 'react'
import MemberShell from '@/components/member-shell'
import { supabase } from '@/lib/browser-supabase'
import { partnerScore, type CompanyProfile } from '@/lib/matching'
import {useI18n} from '@/components/i18n'

type Company = CompanyProfile & { id:string; owner_id:string; name:string; website:string|null; description:string|null; capabilities:string[]; markets:string[]; looking_for:string[]; is_verified:boolean }
const copy={
 en:{eyebrow:'Business partners',title:'Business Partners',sub:'Partner suggestions use real company profiles already in the platform.',loading:'Loading company data…',complete:'Complete your company profile first',completeText:'Partner matching needs your capabilities and markets.',empty:'No partner profiles yet',emptyText:'Your account is ready. This page will populate as real companies join the platform.',capability:'Capability gap',market:'Shared market',intent:'Partner intent',opportunity:'Observed opportunity',fit:'partner fit',verified:'Verified',website:'Website',noDescription:'Company description not provided.'},
 zh:{eyebrow:'合作伙伴',title:'合作伙伴',sub:'合作伙伴建议只使用平台里真实存在的公司资料。',loading:'正在加载公司资料…',complete:'请先完成公司资料',completeText:'需要公司能力和市场资料，才能判断可能的合作关系。',empty:'目前还没有合作伙伴资料',emptyText:'你的帐号已经准备好。随着真实公司加入，这个页面会逐步出现资料。',capability:'能力互补',market:'共同市场',intent:'合作意向',opportunity:'公开商机',fit:'合作匹配',verified:'已验证',website:'网站',noDescription:'尚未提供公司简介。'},
 ms:{eyebrow:'Rakan niaga',title:'Rakan Niaga',sub:'Cadangan rakan niaga hanya menggunakan profil syarikat sebenar yang sudah ada dalam platform.',loading:'Memuatkan data syarikat…',complete:'Lengkapkan profil syarikat dahulu',completeText:'Padanan rakan niaga memerlukan keupayaan dan pasaran syarikat anda.',empty:'Belum ada profil rakan niaga',emptyText:'Akaun anda sudah sedia. Halaman ini akan diisi apabila syarikat sebenar menyertai platform.',capability:'Keupayaan pelengkap',market:'Pasaran bersama',intent:'Niat bekerjasama',opportunity:'Peluang diperhatikan',fit:'padanan rakan',verified:'Disahkan',website:'Laman web',noDescription:'Penerangan syarikat belum diberikan.'}
} as const

export default function NetworkPage(){
  const {lang}=useI18n();const c=copy[lang]
  const [own,setOwn]=useState<Company|null>(null);const [companies,setCompanies]=useState<Company[]>([]);const [loading,setLoading]=useState(true)
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {data}=await supabase.from('companies').select('*').order('created_at',{ascending:false});const rows=(data as Company[]|null)??[];setOwn(rows.find(x=>x.owner_id===user.id)??null);setCompanies(rows.filter(x=>x.owner_id!==user.id));setLoading(false)})()},[])
  const ranked=useMemo(()=>!own?[]:companies.map(co=>({company:co,match:partnerScore(own,co)})).sort((a,b)=>b.match.score-a.match.score),[own,companies])
  return <MemberShell><main className="member-page"><div className="container"><div className="member-heading"><div><div className="eyebrow">{c.eyebrow}</div><h1 className="page-title">{c.title}</h1><p className="sub">{c.sub}</p></div></div>{loading?<div className="panel">{c.loading}</div>:!own?<div className="empty-state"><h2>{c.complete}</h2><p>{c.completeText}</p></div>:ranked.length===0?<div className="empty-state"><h2>{c.empty}</h2><p>{c.emptyText}</p><div className="network-explainer"><span>{c.capability}</span><span>{c.market}</span><span>{c.intent}</span><span>{c.opportunity}</span></div></div>:<div className="grid">{ranked.map(({company:co,match})=><article className="card" key={co.id}><div className="score-row"><span className="match-score">{match.score}% {c.fit}</span>{co.is_verified&&<span className="status-dot">{c.verified}</span>}</div><div className="title">{co.name}</div><div className="meta">{co.region}{co.website&&<> · <a className="source" href={co.website} target="_blank" rel="noreferrer">{c.website}</a></>}<br/>{co.description||c.noDescription}</div><div className="tags">{co.capabilities.slice(0,5).map(x=><span className="tag" key={x}>{x}</span>)}</div><div className="why-match">{match.reasons.map(r=><span key={r}>✓ {r}</span>)}</div></article>)}</div>}</div></main></MemberShell>
}
