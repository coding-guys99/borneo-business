'use client'
import {useI18n} from '@/components/i18n'
import type {OpportunityRefreshStatus} from '@/lib/data'

function formatKuching(value:string|null|undefined,lang:string){
 if(!value)return '—'
 const locale=lang==='zh'?'zh-CN':lang==='ms'?'ms-MY':'en-GB'
 return new Intl.DateTimeFormat(locale,{timeZone:'Asia/Kuching',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value))
}

export default function OpportunitiesMarketIntro({count,refreshStatus}:{count:number;refreshStatus:OpportunityRefreshStatus}){
 const {lang}=useI18n()
 const copy={
  en:{eyebrow:'Sarawak · Business Opportunities',title:'Opportunities',sub:'Government, institutional and business opportunities in one searchable market. Every record remains traceable to its published source.',tracked:'Opportunities tracked',updated:'Last updated',newToday:'New today',scanned:'Records scanned',healthy:'Updated successfully',failed:'Update issue',pending:'Awaiting first update',source:'Source'},
  zh:{eyebrow:'砂拉越 · 商业机会',title:'商机',sub:'把政府、机构与企业公开商机放在同一个可搜索市场中，每一笔资料都保留原始发布来源。',tracked:'已追踪商机',updated:'最后更新',newToday:'今日新增',scanned:'本次扫描',healthy:'更新成功',failed:'更新异常',pending:'等待首次更新',source:'资料来源'},
  ms:{eyebrow:'Sarawak · Peluang Perniagaan',title:'Peluang',sub:'Peluang kerajaan, institusi dan perniagaan dihimpunkan dalam satu pasaran yang boleh dicari, dengan setiap rekod kekal boleh dijejaki kepada sumber asal.',tracked:'Peluang dijejaki',updated:'Kemas kini terakhir',newToday:'Baharu hari ini',scanned:'Rekod diimbas',healthy:'Kemas kini berjaya',failed:'Isu kemas kini',pending:'Menunggu kemas kini pertama',source:'Sumber'}
 } as const
 const c=copy[lang]
 const latest=refreshStatus.latest
 const state=latest?.status==='success'?'success':latest?.status==='failed'?'failed':'pending'
 const stateText=state==='success'?c.healthy:state==='failed'?c.failed:c.pending
 return <div className="market-intro-block">
  <div className="section-head"><div><div className="eyebrow">{c.eyebrow}</div><h1 className="page-title">{c.title}</h1><p className="sub">{c.sub}</p></div></div>
  <div className="refresh-status-strip" aria-label="Data refresh status">
   <div><span>{c.tracked}</span><strong>{count}</strong></div>
   <div><span>{c.updated}</span><strong>{formatKuching(latest?.finished_at??refreshStatus.source?.last_success_at,lang)}</strong></div>
   <div><span>{c.newToday}</span><strong>{refreshStatus.newToday}</strong></div>
   <div><span>{c.scanned}</span><strong>{latest?.records_scanned??'—'}</strong></div>
   <div className={`refresh-health ${state}`}><span>{c.source}</span><strong>{refreshStatus.source?.name??'Sarawak eTender'}</strong><small>{stateText}</small></div>
  </div>
 </div>
}
