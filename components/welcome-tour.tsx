'use client'

import { useEffect,useMemo,useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n'

type Slide={icon:string;title:string;body:string;cta?:string;href?:string}

const slidesByLang={
 en:{public:[
  {icon:'👋',title:'Welcome to Borneo Business',body:'Find real business opportunities across Sarawak and understand what each project is about before opening the official procurement notice.'},
  {icon:'🔎',title:'Understand projects quickly',body:'Each opportunity has a simplified brief, buyer, reference, closing date, likely requirements and a direct official-source link.'},
  {icon:'🏢',title:'Build a company profile',body:'Tell us what your company can deliver so opportunities can be compared with your business.'},
  {icon:'🤝',title:'Find partners when you need them',body:'If a project needs capabilities you do not have, use Business Partners to identify potential partners.'},
  {icon:'📈',title:'Keep track of serious opportunities',body:'Save opportunities you care about and record whether you are considering, preparing, submitted, won or not won.',cta:'Browse Sarawak Opportunities',href:'/opportunities'}],member:[
  {icon:'👋',title:'Welcome to My Opportunities',body:'This area organizes Sarawak opportunities around your company profile.'},
  {icon:'1',title:'Complete Company Profile',body:'Add your company description, capabilities and service markets.',cta:'Open Company Profile',href:'/profile'},
  {icon:'2',title:'Review relevant opportunities',body:'Open a project and understand the scope before deciding whether to pursue it.',cta:'Browse Opportunities',href:'/opportunities'},
  {icon:'3',title:'Save serious opportunities',body:'Keep the opportunities you care about in Saved Opportunities.',cta:'Open Saved Opportunities',href:'/pipeline'},
  {icon:'4',title:'Record outcomes',body:'Record the next step and final result so your company has one clear view of active opportunities.',cta:'Open My Opportunities',href:'/dashboard'}]},
 zh:{public:[
  {icon:'👋',title:'欢迎使用 Borneo Business',body:'在砂拉越找到真实公开商机，先用简单方式了解项目，再进入官方标案网站确认。'},
  {icon:'🔎',title:'快速看懂一个项目',body:'每个商机都会整理采购单位、编号、截止日期、可能需求与官方来源。'},
  {icon:'🏢',title:'建立公司资料',body:'告诉平台你的公司能做什么，之后就可以把商机和你的公司能力进行对照。'},
  {icon:'🤝',title:'需要时寻找合作伙伴',body:'如果项目需要你没有的能力，可以到“合作伙伴”寻找可能一起合作的企业。'},
  {icon:'📈',title:'把重要商机保存起来',body:'保存值得关注的商机，并记录考虑中、准备中、已提交、已赢得或未赢得。',cta:'浏览砂拉越商机',href:'/opportunities'}],member:[
  {icon:'👋',title:'欢迎进入“我的商机”',body:'这里会根据你的公司资料整理砂拉越商机。'},
  {icon:'1',title:'完成公司资料',body:'加入公司简介、能力与可服务市场。',cta:'打开公司资料',href:'/profile'},
  {icon:'2',title:'查看相关商机',body:'先看懂项目内容，再决定要不要跟进。',cta:'浏览商机',href:'/opportunities'},
  {icon:'3',title:'保存真正想跟进的项目',body:'把有兴趣的商机放进“已保存商机”。',cta:'打开已保存商机',href:'/pipeline'},
  {icon:'4',title:'记录后续结果',body:'记录下一步与最后结果，让公司清楚知道目前有哪些商机正在处理。',cta:'打开我的商机',href:'/dashboard'}]},
 ms:{public:[
  {icon:'👋',title:'Selamat datang ke Borneo Business',body:'Cari peluang perniagaan sebenar di Sarawak, fahami projek secara ringkas dan semak notis perolehan rasmi apabila bersedia.'},
  {icon:'🔎',title:'Fahami projek dengan cepat',body:'Setiap peluang mempunyai ringkasan, agensi, rujukan, tarikh tutup, keperluan yang mungkin dan pautan rasmi.'},
  {icon:'🏢',title:'Bina profil syarikat',body:'Nyatakan keupayaan syarikat anda supaya peluang boleh dibandingkan dengan perniagaan anda.'},
  {icon:'🤝',title:'Cari rakan niaga bila perlu',body:'Jika projek memerlukan keupayaan yang anda tiada, gunakan Rakan Niaga untuk mencari syarikat yang sesuai.'},
  {icon:'📈',title:'Simpan peluang penting',body:'Simpan peluang yang penting dan rekodkan sama ada sedang dipertimbang, disediakan, dihantar, menang atau tidak menang.',cta:'Lihat Peluang Sarawak',href:'/opportunities'}],member:[
  {icon:'👋',title:'Selamat datang ke Peluang Saya',body:'Bahagian ini menyusun peluang Sarawak mengikut profil syarikat anda.'},
  {icon:'1',title:'Lengkapkan Profil Syarikat',body:'Tambah penerangan, keupayaan dan pasaran perkhidmatan syarikat.',cta:'Buka Profil Syarikat',href:'/profile'},
  {icon:'2',title:'Semak peluang berkaitan',body:'Fahami skop projek sebelum membuat keputusan.',cta:'Lihat Peluang',href:'/opportunities'},
  {icon:'3',title:'Simpan peluang penting',body:'Simpan peluang yang anda mahu ikuti dalam Peluang Disimpan.',cta:'Buka Peluang Disimpan',href:'/pipeline'},
  {icon:'4',title:'Rekod keputusan',body:'Rekod langkah seterusnya dan keputusan akhir supaya syarikat mempunyai gambaran yang jelas tentang peluang aktif.',cta:'Buka Peluang Saya',href:'/dashboard'}]}
} as Record<'en'|'zh'|'ms',{public:Slide[];member:Slide[]}>

export default function WelcomeTour({mode='public'}:{mode?:'public'|'member'}){
 const {lang,t}=useI18n(); const slides=useMemo(()=>slidesByLang[lang][mode],[lang,mode])
 const key=mode==='member'?'borneo-member-tour-v2':'borneo-public-tour-v2'
 const [open,setOpen]=useState(false); const [i,setI]=useState(0)
 useEffect(()=>{if(typeof window!=='undefined'&&!localStorage.getItem(key))setOpen(true);const show=()=>{setI(0);setOpen(true)};window.addEventListener('borneo:open-guide',show);return()=>window.removeEventListener('borneo:open-guide',show)},[key])
 function close(){localStorage.setItem(key,'done');setOpen(false)}
 if(!open)return null
 const s=slides[i],last=i===slides.length-1
 const closeLabel=lang==='zh'?'关闭指南':lang==='ms'?'Tutup panduan':'Close guide'
 return <div className="tour-backdrop"><div className="tour-modal" role="dialog" aria-modal="true">
   <button className="tour-close" aria-label={closeLabel} onClick={close}>×</button>
   <div className="tour-icon">{s.icon}</div><h2>{s.title}</h2><p>{s.body}</p>
   <div className="tour-dots">{slides.map((_,n)=><span key={n} className={n===i?'active':''}/>)}</div>
   {s.href&&last?<Link className="btn primary tour-next" href={s.href} onClick={close}>{s.cta||t('start')}</Link>:<button className="btn primary tour-next" onClick={()=>last?close():setI(v=>v+1)}>{last?t('start'):t('next')}</button>}
   {i>0&&<button className="tour-back" onClick={()=>setI(v=>v-1)}>{t('back')}</button>}
 </div></div>
}
