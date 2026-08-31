'use client'
import {useI18n} from '@/components/i18n'

export default function OpportunitiesMarketIntro({count}:{count:number}){
 const {lang}=useI18n()
 const copy={
  en:{eyebrow:'Sarawak · Business Opportunities',title:'Opportunities',sub:'Government, institutional and business opportunities in one searchable market. Every record remains traceable to its published source.'},
  zh:{eyebrow:'砂拉越 · 商业机会',title:'商机',sub:'把政府、机构与企业公开商机放在同一个可搜索市场中，每一笔资料都保留原始发布来源。'},
  ms:{eyebrow:'Sarawak · Peluang Perniagaan',title:'Peluang',sub:'Peluang kerajaan, institusi dan perniagaan dihimpunkan dalam satu pasaran yang boleh dicari, dengan setiap rekod kekal boleh dijejaki kepada sumber asal.'}
 } as const
 const c=copy[lang]
 return <div className="section-head"><div><div className="eyebrow">{c.eyebrow}</div><h1 className="page-title">{c.title}</h1><p className="sub">{c.sub} ({count})</p></div></div>
}
