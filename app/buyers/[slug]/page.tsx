import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getBuyerAwards,getBuyerBySlug,getBuyerOpportunities} from '@/lib/data'

export default async function BuyerPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const buyer=await getBuyerBySlug(slug); if(!buyer)notFound()
 const [ops,awards]=await Promise.all([getBuyerOpportunities(buyer.canonical_name),getBuyerAwards(buyer.canonical_name)])
 const winners=new Map<string,number>(); for(const a of awards){if(a.awarded_company)winners.set(a.awarded_company,(winners.get(a.awarded_company)||0)+1)}
 const top=[...winners.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10)
 return <main className="section"><div className="container policy-container"><Link className="source" href="/opportunities">← Opportunities</Link><div className="eyebrow">BUYER INTELLIGENCE · SARAWAK</div><h1>{buyer.canonical_name}</h1><p className="lead">Observed procurement activity from public records. Use this page to understand what this buyer is publishing and which companies have appeared in published award results.</p>
 <div className="stats-grid"><div><strong>{buyer.open_opportunities}</strong><span>Open opportunities</span></div><div><strong>{buyer.total_opportunities}</strong><span>Opportunities tracked</span></div><div><strong>{buyer.awards_published}</strong><span>Awards observed</span></div><div><strong>{buyer.unique_winners}</strong><span>Winning companies</span></div></div>
 <div className="panel"><div className="panel-title">Current opportunity signals</div>{ops.slice(0,12).map(o=><div className="history-row" key={o.id}><div><Link href={`/opportunities/${o.id}`}><strong>{o.title}</strong></Link><div className="meta">{o.reference||'No reference'} · {o.industry||'General'}</div></div><div><span className="award-label">Closing</span><strong>{o.closing_date||'—'}</strong></div></div>)}</div>
 {top.length>0&&<div className="panel"><div className="panel-title">Companies appearing most often in observed awards</div><p className="meta">Historical observation only. This does not imply preference, affiliation or future award likelihood.</p>{top.map(([name,count])=><div className="history-row" key={name}><strong>{name}</strong><span>{count} observed award{count===1?'':'s'}</span></div>)}</div>}
 <div className="panel"><div className="panel-title">Recent award activity</div>{awards.slice(0,20).map(a=><div className="history-row" key={a.id}><div><strong>{a.tender_title||a.tender_reference||'Award result'}</strong><div className="meta">{a.tender_reference||'—'} · {a.procurement_type}</div></div><div><span className="award-label">Successful tenderer</span><strong>{a.awarded_company}</strong></div><div><span className="award-label">Award date</span><strong>{a.award_date||'—'}</strong></div></div>)}</div>
 <div className="source-trust-note"><strong>Observed public data</strong><span>Counts are based on records currently indexed by Borneo Business, not the buyer's complete procurement history. Verify individual records with official sources.</span></div></div></main>
}
