'use client'

import { useEffect,useMemo,useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n'

type Slide={icon:string;title:string;body:string;cta?:string;href?:string}

const slidesByLang={
 en:{public:[
  {icon:'👋',title:'Welcome to Borneo Business',body:'Find real business opportunities across Sarawak and understand what each project is about before opening the official procurement notice.'},
  {icon:'🔎',title:'Understand projects quickly',body:'Each opportunity has a simplified brief, buyer, reference, closing date, likely requirements and a direct official-source link.'},
  {icon:'🏢',title:'Build a company profile',body:'Tell us what your company can deliver. Your profile helps buyers discover you and improves opportunity matching.'},
  {icon:'🤝',title:'Find partners when you need them',body:'If a project needs capabilities you do not have, use the company network to identify potential partners.'},
  {icon:'📈',title:'Turn opportunities into business',body:'Save serious leads to Pipeline and track them through Contacted, Quoted, Won or Lost.',cta:'Browse Sarawak Opportunities',href:'/opportunities'}],member:[
  {icon:'👋',title:'Welcome to your Business Radar',body:'Your Radar prioritises Sarawak opportunities using your company profile.'},
  {icon:'1',title:'Complete Company Profile',body:'Add your company description, capabilities and service markets.',cta:'Open Company Profile',href:'/profile'},
  {icon:'2',title:'Review matched opportunities',body:'Open a project and understand the scope before deciding whether to pursue it.',cta:'Browse Opportunities',href:'/opportunities'},
  {icon:'3',title:'Save serious leads',body:'Move the opportunities you care about into Pipeline.',cta:'Open Pipeline',href:'/pipeline'},
  {icon:'4',title:'Record outcomes',body:'Track Contacted, Quoted, Won or Lost so the platform reflects real business activity.',cta:'Open Business Radar',href:'/dashboard'}]},
 zh:{public:[
  {icon:'👋',title:'欢迎使用 Borneo Business',body:'在砂拉越找到真实公开商机，先用简单方式了解项目，再进入官方标案网站确认。'},
  {icon:'🔎',title:'快速看懂一个标案',body:'每个商机都有简化项目简介、采购单位、编号、截止日期、可能需求与官方来源。'},
  {icon:'🏢',title:'建立公司资料',body:'告诉平台你的公司能做什么。公司资料可以让买方找到你，也会改善商机匹配。'},
  {icon:'🤝',title:'缺能力就找合作伙伴',body:'如果项目需要你没有的能力，可以通过公司网络找适合一起合作的企业。'},
  {icon:'📈',title:'把商机追到成交',body:'把值得跟进的标案存进 Pipeline，再追踪到 Contacted、Quoted、Won 或 Lost。',cta:'浏览砂拉越商机',href:'/opportunities'}],member:[
  {icon:'👋',title:'欢迎进入你的商机雷达',body:'Radar 会依照公司资料，优先显示适合你的砂拉越商机。'},
  {icon:'1',title:'完成公司资料',body:'加入公司简介、能力与可服务市场。',cta:'打开公司资料',href:'/profile'},
  {icon:'2',title:'查看匹配商机',body:'先看懂项目内容，再决定要不要跟进。',cta:'浏览商机',href:'/opportunities'},
  {icon:'3',title:'保存真正想跟进的项目',body:'把有兴趣的商机加入 Pipeline。',cta:'打开 Pipeline',href:'/pipeline'},
  {icon:'4',title:'记录结果',body:'追踪 Contacted、Quoted、Won 或 Lost，让平台累积真实商业结果。',cta:'打开商机雷达',href:'/dashboard'}]},
 ms:{public:[
  {icon:'👋',title:'Selamat datang ke Borneo Business',body:'Cari peluang perniagaan sebenar di Sarawak, fahami projek secara ringkas dan semak notis perolehan rasmi apabila bersedia.'},
  {icon:'🔎',title:'Fahami projek dengan cepat',body:'Setiap peluang mempunyai ringkasan, agensi, rujukan, tarikh tutup, keperluan yang mungkin dan pautan rasmi.'},
  {icon:'🏢',title:'Bina profil syarikat',body:'Nyatakan keupayaan syarikat anda. Profil membantu pembeli menemui anda dan meningkatkan padanan peluang.'},
  {icon:'🤝',title:'Cari rakan kongsi bila perlu',body:'Jika projek memerlukan keupayaan yang anda tiada, cari syarikat yang berpotensi menjadi rakan kongsi.'},
  {icon:'📈',title:'Tukar peluang kepada perniagaan',body:'Simpan peluang penting ke Pipeline dan jejaki hingga Contacted, Quoted, Won atau Lost.',cta:'Lihat Peluang Sarawak',href:'/opportunities'}],member:[
  {icon:'👋',title:'Selamat datang ke Radar Perniagaan',body:'Radar mengutamakan peluang Sarawak berdasarkan profil syarikat anda.'},
  {icon:'1',title:'Lengkapkan Profil Syarikat',body:'Tambah penerangan, keupayaan dan pasaran perkhidmatan syarikat.',cta:'Buka Profil Syarikat',href:'/profile'},
  {icon:'2',title:'Semak peluang yang sepadan',body:'Fahami skop projek sebelum membuat keputusan.',cta:'Lihat Peluang',href:'/opportunities'},
  {icon:'3',title:'Simpan prospek penting',body:'Masukkan peluang yang serius ke Pipeline.',cta:'Buka Pipeline',href:'/pipeline'},
  {icon:'4',title:'Rekod keputusan',body:'Jejaki Contacted, Quoted, Won atau Lost untuk merekod aktiviti perniagaan sebenar.',cta:'Buka Radar',href:'/dashboard'}]}
} as Record<'en'|'zh'|'ms',{public:Slide[];member:Slide[]}>

export default function WelcomeTour({mode='public'}:{mode?:'public'|'member'}){
 const {lang,t}=useI18n(); const slides=useMemo(()=>slidesByLang[lang][mode],[lang,mode])
 const key=mode==='member'?'borneo-member-tour-v2':'borneo-public-tour-v2'
 const [open,setOpen]=useState(false); const [i,setI]=useState(0)
 useEffect(()=>{if(typeof window!=='undefined'&&!localStorage.getItem(key))setOpen(true);const show=()=>{setI(0);setOpen(true)};window.addEventListener('borneo:open-guide',show);return()=>window.removeEventListener('borneo:open-guide',show)},[key])
 function close(){localStorage.setItem(key,'done');setOpen(false)}
 if(!open)return null
 const s=slides[i],last=i===slides.length-1
 return <div className="tour-backdrop"><div className="tour-modal" role="dialog" aria-modal="true">
   <button className="tour-close" aria-label="Close guide" onClick={close}>×</button>
   <div className="tour-icon">{s.icon}</div><h2>{s.title}</h2><p>{s.body}</p>
   <div className="tour-dots">{slides.map((_,n)=><span key={n} className={n===i?'active':''}/>)}</div>
   {s.href&&last?<Link className="btn primary tour-next" href={s.href} onClick={close}>{s.cta||t('start')}</Link>:<button className="btn primary tour-next" onClick={()=>last?close():setI(v=>v+1)}>{last?t('start'):t('next')}</button>}
   {i>0&&<button className="tour-back" onClick={()=>setI(v=>v-1)}>{t('back')}</button>}
 </div></div>
}
