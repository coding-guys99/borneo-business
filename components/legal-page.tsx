import PublicHeader from '@/components/public-header'
import SiteFooter from '@/components/site-footer'

export type LegalSection={title:string;body:string[]}
export default function LegalPage({eyebrow,title,intro,sections,note}:{eyebrow:string;title:string;intro:string;sections:LegalSection[];note?:string}){
 return <><PublicHeader/><main className="section policy-page"><div className="container policy-container"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="lead policy-lead">{intro}</p>{note&&<div className="policy-notice">{note}</div>}<div className="policy-sections">{sections.map((s,i)=><section key={s.title}><div className="policy-number">{String(i+1).padStart(2,'0')}</div><div><h2>{s.title}</h2>{s.body.map((p,j)=><p key={j}>{p}</p>)}</div></section>)}</div><p className="meta policy-date">Last updated: 30 August 2026</p></div></main><SiteFooter/></>
}
