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
  {icon:'👋',title:'歡迎使用 Borneo Business',body:'在砂拉越找到真實公開商機，先用簡單方式了解專案，再進入官方標案網站確認。'},
  {icon:'🔎',title:'快速看懂一個標案',body:'每個商機都有簡化專案簡介、採購單位、編號、截止日期、可能需求與官方來源。'},
  {icon:'🏢',title:'建立公司資料',body:'告訴平台你的公司能做什麼。公司資料可以讓買方找到你，也會改善商機配對。'},
  {icon:'🤝',title:'缺能力就找合作夥伴',body:'如果專案需要你沒有的能力，可以透過公司網絡找適合一起合作的企業。'},
  {icon:'📈',title:'把商機追到成交',body:'把值得跟進的標案存進 Pipeline，再追蹤到 Contacted、Quoted、Won 或 Lost。',cta:'瀏覽砂拉越商機',href:'/opportunities'}],member:[
  {icon:'👋',title:'歡迎進入你的商機雷達',body:'Radar 會依照公司資料，優先顯示適合你的砂拉越商機。'},
  {icon:'1',title:'完成公司資料',body:'加入公司簡介、能力與可服務市場。',cta:'開啟公司資料',href:'/profile'},
  {icon:'2',title:'查看配對商機',body:'先看懂專案內容，再決定要不要追。',cta:'瀏覽商機',href:'/opportunities'},
  {icon:'3',title:'儲存真正想追的案子',body:'把有興趣的商機加入 Pipeline。',cta:'開啟 Pipeline',href:'/pipeline'},
  {icon:'4',title:'記錄結果',body:'追蹤 Contacted、Quoted、Won 或 Lost，讓平台累積真實商業結果。',cta:'開啟商機雷達',href:'/dashboard'}]},
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
