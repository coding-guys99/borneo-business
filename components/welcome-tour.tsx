'use client'

import { useEffect,useState } from 'react'
import Link from 'next/link'

type Slide={icon:string;title:string;body:string;cta?:string;href?:string}

const publicSlides:Slide[]=[
 {icon:'👋',title:'Welcome to Borneo Business',body:'See real business opportunities across Sarawak, understand what each project needs, and go back to the official procurement source when you are ready.'},
 {icon:'🔎',title:'Understand the project quickly',body:'Open any opportunity to see a plain-language brief, buyer, reference, closing date, likely scope and the official application channel.'},
 {icon:'🏢',title:'Build a company profile',body:'Tell us what your company can deliver and which Borneo markets you want. This powers opportunity and partner matching.'},
 {icon:'🤝',title:'Find partners when capability is missing',body:'If a project needs something your company does not provide, use the company network to identify possible partners instead of dropping the lead.'},
 {icon:'📈',title:'Track opportunities to real business',body:'Save opportunities into Pipeline and move them from Interested to Contacted, Quoted, Won or Lost. Verified results build the platform’s business graph.',cta:'Explore Sarawak Opportunities',href:'/opportunities'}
]
const memberSlides:Slide[]=[
 {icon:'👋',title:'Welcome to your Business Radar',body:'Your Radar uses your company profile to prioritise relevant Sarawak opportunities. You can change your business goals and target markets anytime.'},
 {icon:'1',title:'Complete Company Profile',body:'Add your company description, capabilities, markets served and the Borneo locations where you want opportunities.',cta:'Open Company Profile',href:'/profile'},
 {icon:'2',title:'Review matched opportunities',body:'Open a project to understand the scope first. Check the official notice before making any commercial decision.',cta:'Browse Opportunities',href:'/opportunities'},
 {icon:'3',title:'Save serious leads',body:'Use Save to Pipeline only for projects you may pursue. This keeps the Radar useful instead of becoming another tender list.',cta:'Open Pipeline',href:'/pipeline'},
 {icon:'4',title:'Record outcomes',body:'Move opportunities through Contacted, Quoted, Won or Lost. Won value is only counted when you record a real outcome.',cta:'Open Business Radar',href:'/dashboard'}
]

export default function WelcomeTour({mode='public'}:{mode?:'public'|'member'}){
 const slides=mode==='member'?memberSlides:publicSlides
 const key=mode==='member'?'borneo-member-tour-v2':'borneo-public-tour-v2'
 const [open,setOpen]=useState(false); const [i,setI]=useState(0)
 useEffect(()=>{if(typeof window!=='undefined'&&!localStorage.getItem(key))setOpen(true)},[key])
 function close(){localStorage.setItem(key,'done');setOpen(false)}
 if(!open)return null
 const s=slides[i],last=i===slides.length-1
 return <div className="tour-backdrop"><div className="tour-modal" role="dialog" aria-modal="true">
   <button className="tour-close" aria-label="Close guide" onClick={close}>×</button>
   <div className="tour-icon">{s.icon}</div><h2>{s.title}</h2><p>{s.body}</p>
   <div className="tour-dots">{slides.map((_,n)=><span key={n} className={n===i?'active':''}/>)}</div>
   {s.href&&last?<Link className="btn primary tour-next" href={s.href} onClick={close}>{s.cta||'Start'}</Link>:<button className="btn primary tour-next" onClick={()=>last?close():setI(v=>v+1)}>{last?'Start':'Next'}</button>}
   {i>0&&<button className="tour-back" onClick={()=>setI(v=>v-1)}>Back</button>}
 </div></div>
}
