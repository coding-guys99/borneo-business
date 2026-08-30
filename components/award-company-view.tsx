'use client'

import Link from 'next/link'
import {useMemo} from 'react'
import {useI18n} from '@/components/i18n'
import type {OpportunityAward} from '@/lib/data'

type Company={canonical_name:string}
function money(value:number|null,currency:string,lang:'en'|'zh'|'ms'){if(value==null)return lang==='zh'?'未公开':lang==='ms'?'Tidak didedahkan':'Not disclosed';try{return new Intl.NumberFormat('en-MY',{style:'currency',currency,maximumFractionDigits:0}).format(value)}catch{return `${currency} ${value.toLocaleString()}`}}
function daysSince(value:string|null){if(!value)return Number.POSITIVE_INFINITY;const d=new Date(value);if(Number.isNaN(d.getTime()))return Number.POSITIVE_INFINITY;return Math.floor((Date.now()-d.getTime())/86400000)}
const copy={
 en:{back:'← Opportunities',eyebrow:'COMPANY INTELLIGENCE · SARAWAK',lead:'Observed public procurement history for this company. Use it to understand where the company has appeared, which buyers awarded work, and how recent the activity is.',activity:'Observed award activity',active:'Recently awarded',moderate:'Awarded in the past year',quiet:'No recent award observed',activeText:'At least one indexed public award was published within the last 90 days.',moderateText:'Indexed public awards exist, but none were published in the last 90 days.',quietText:'No recent award activity is visible in the records currently indexed.',observed:'Observed awards',buyers:'Observed buyers',tender:'Tender awards',quotation:'Quotation awards',latest:'Latest award',value:'Disclosed award value',relationships:'Buyer relationships',relationshipNote:'Buyers that appear most often in this company’s indexed public award history.',awardsWith:'observed awards',activityTitle:'Recent award history',activityNote:'These are public award/result records, not self-reported company projects.',date:'Date',project:'Project / award',buyer:'Buyer / procuring agency',type:'Type',amount:'Value',official:'Official result',record:'Award record',none:'No indexed award history is available for this company yet.',public:'Observed public data',trust:'This page reflects only public award records currently indexed by Borneo Business. It is not a complete legal, financial or commercial profile of the company. Verify individual records with the linked official source.',platform:'Platform analysis',platformNote:'Recency labels and buyer-frequency counts are calculated from indexed public records and are not official company ratings.'},
 zh:{back:'← 返回商机',eyebrow:'公司情报 · 砂拉越',lead:'根据公开采购中标记录整理这家公司的活动。可以用来了解它曾在哪里中标、哪些采购方曾把项目授予它，以及最近是否仍有中标活动。',activity:'公开中标活跃度',active:'近期有中标',moderate:'过去一年有中标',quiet:'近期未观察到中标',activeText:'目前已收录资料中，最近 90 天内至少有一笔公开中标结果。',moderateText:'可以看到历史公开中标记录，但最近 90 天内没有新的已收录中标结果。',quietText:'在当前已收录公开资料中，没有观察到近期中标活动。',observed:'公开中标记录',buyers:'合作过的采购方',tender:'Tender 中标',quotation:'Quotation 中标',latest:'最近中标',value:'已披露中标金额',relationships:'采购方关系',relationshipNote:'根据这家公司当前已收录的公开中标历史，统计出现次数较多的采购方。',awardsWith:'笔公开中标',activityTitle:'近期中标历史',activityNote:'以下是公开中标／结果资料，不是公司自行填写的项目履历。',date:'日期',project:'项目／中标记录',buyer:'采购方／发标单位',type:'类型',amount:'金额',official:'官方结果',record:'中标记录',none:'目前还没有这家公司的已收录中标历史。',public:'公开资料观察',trust:'本页只反映 Borneo Business 当前已收录的公开中标结果，不代表该公司完整的法律、财务或商业履历。个别记录请以官方来源为准。',platform:'平台分析',platformNote:'近期活跃度与采购方出现次数由平台根据公开记录计算，不是官方公司评级。'},
 ms:{back:'← Kembali ke peluang',eyebrow:'RISIKAN SYARIKAT · SARAWAK',lead:'Sejarah perolehan awam yang diperhatikan untuk syarikat ini. Gunakan halaman ini untuk melihat pembeli yang pernah menganugerahkan kerja dan sejauh mana aktiviti terkini.',activity:'Aktiviti anugerah diperhatikan',active:'Dianugerahkan baru-baru ini',moderate:'Dianugerahkan dalam setahun lalu',quiet:'Tiada anugerah terkini diperhatikan',activeText:'Sekurang-kurangnya satu anugerah awam yang diindeks diterbitkan dalam 90 hari lalu.',moderateText:'Anugerah awam terdahulu wujud tetapi tiada rekod baharu dalam 90 hari lalu.',quietText:'Tiada aktiviti anugerah terkini kelihatan dalam rekod yang kini diindeks.',observed:'Anugerah diperhatikan',buyers:'Pembeli diperhatikan',tender:'Anugerah tender',quotation:'Anugerah sebut harga',latest:'Anugerah terkini',value:'Nilai anugerah didedahkan',relationships:'Hubungan pembeli',relationshipNote:'Pembeli yang paling kerap muncul dalam sejarah anugerah awam syarikat ini.',awardsWith:'anugerah diperhatikan',activityTitle:'Sejarah anugerah terkini',activityNote:'Ini ialah rekod anugerah/keputusan awam, bukan projek yang dilaporkan sendiri oleh syarikat.',date:'Tarikh',project:'Projek / anugerah',buyer:'Pembeli / agensi perolehan',type:'Jenis',amount:'Nilai',official:'Keputusan rasmi',record:'Rekod anugerah',none:'Belum ada sejarah anugerah diindeks untuk syarikat ini.',public:'Data awam diperhatikan',trust:'Halaman ini hanya mencerminkan rekod anugerah awam yang kini diindeks oleh Borneo Business. Ia bukan profil undang-undang, kewangan atau komersial syarikat yang lengkap. Sahkan rekod individu dengan sumber rasmi.',platform:'Analisis platform',platformNote:'Label aktiviti dan kiraan kekerapan pembeli dikira daripada rekod awam yang diindeks dan bukan penilaian rasmi syarikat.'}
} as const

export default function AwardCompanyView({company,history}:{company:Company;history:OpportunityAward[]}){
 const {lang}=useI18n();const c=copy[lang]
 const tenderCount=history.filter(x=>x.procurement_type==='Tender').length
 const quotationCount=history.filter(x=>x.procurement_type==='Quotation').length
 const disclosed=history.filter(x=>x.awarded_value!=null)
 const total=disclosed.reduce((s,x)=>s+(x.awarded_value??0),0)
 const latestAward=history.map(x=>x.award_date).filter(Boolean).sort().reverse()[0]??null
 const age=daysSince(latestAward)
 const activity=age<=90?{label:c.active,text:c.activeText,tone:'active'}:age<=365?{label:c.moderate,text:c.moderateText,tone:'moderate'}:{label:c.quiet,text:c.quietText,tone:'quiet'}
 const buyerCounts=useMemo(()=>{const m=new Map<string,number>();for(const a of history){if(a.buyer)m.set(a.buyer,(m.get(a.buyer)||0)+1)}return [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8)},[history])
 return <main className="section"><div className="container company-intelligence">
   <Link className="source" href="/opportunities">{c.back}</Link>
   <header className="company-hero"><div><div className="eyebrow">{c.eyebrow}</div><h1>{company.canonical_name}</h1><p className="lead">{c.lead}</p></div><div className={`company-activity ${activity.tone}`}><span>{c.activity}</span><strong>{activity.label}</strong><p>{activity.text}</p></div></header>

   <section className="company-facts" aria-label={c.public}>
     <div><span>{c.observed}</span><strong>{history.length}</strong></div>
     <div><span>{c.buyers}</span><strong>{buyerCounts.length}</strong></div>
     <div><span>{c.tender}</span><strong>{tenderCount}</strong></div>
     <div><span>{c.quotation}</span><strong>{quotationCount}</strong></div>
     <div><span>{c.latest}</span><strong>{latestAward||'—'}</strong></div>
     <div><span>{c.value}</span><strong>{disclosed.length?money(total,'MYR',lang):lang==='zh'?'未公开':lang==='ms'?'Tidak didedahkan':'Not disclosed'}</strong></div>
   </section>

   <section className="company-section"><div className="company-section-head"><div><div className="eyebrow">{c.public}</div><h2>{c.relationships}</h2><p>{c.relationshipNote}</p></div></div>{buyerCounts.length?<div className="company-buyer-list">{buyerCounts.map(([name,count])=><div key={name}><strong>{name}</strong><span>{count} {c.awardsWith}</span></div>)}</div>:<p className="meta">{c.none}</p>}<div className="company-analysis-note"><strong>{c.platform}</strong><span>{c.platformNote}</span></div></section>

   <section className="company-section"><div className="company-section-head"><div><div className="eyebrow">{c.public}</div><h2>{c.activityTitle}</h2><p>{c.activityNote}</p></div><strong className="company-count">{history.length}</strong></div>{history.length?<div className="company-award-list">{history.map(a=><article key={a.id}><div><span>{c.date}</span><strong>{a.award_date??'—'}</strong></div><div className="company-award-project">{a.opportunity_id?<Link href={`/opportunities/${a.opportunity_id}`}><strong>{a.tender_title??a.tender_reference??c.record}</strong></Link>:<strong>{a.tender_title??a.tender_reference??c.record}</strong>}<span>{a.tender_reference??a.award_reference??'—'}</span></div><div><span>{c.buyer}</span><strong>{a.buyer??'—'}</strong></div><div><span>{c.type}</span><strong>{a.procurement_type}</strong></div><div><span>{c.amount}</span><strong>{money(a.awarded_value,a.currency,lang)}</strong></div>{a.source_url?<a className="company-source-link" href={a.source_url} target="_blank" rel="noreferrer">{c.official} ↗</a>:null}</article>)}</div>:<p className="meta">{c.none}</p>}</section>

   <div className="source-trust-note"><strong>{c.public}</strong><span>{c.trust}</span></div>
 </div></main>
}
