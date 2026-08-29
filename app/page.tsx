import Link from 'next/link'
import { getOpportunities, getPlatformMetrics } from '@/lib/data'
import PublicHeader from '@/components/public-header'
import WelcomeTour from '@/components/welcome-tour'

export default async function Home() {
  const [all, metrics] = await Promise.all([getOpportunities(), getPlatformMetrics()])
  const opportunities=all.filter(o=>o.region==='Sarawak')
  const latest = opportunities.slice(0, 6)
  return <>
    <PublicHeader/><WelcomeTour mode="public"/>
    <main>
      <section className="hero"><div className="container"><div className="eyebrow">Sarawak Business Intelligence Network</div><h1>See where business is happening across Sarawak.</h1><p className="lead">Discover official public opportunities, understand each project in plain language, identify active buyers and build the right business connections across Sarawak.</p><p><Link className="btn primary" href="/opportunities">Enter the Opportunity Market</Link></p><div className="kpis"><div className="kpi"><strong>{opportunities.length}</strong><span>Sarawak opportunities indexed</span></div><div className="kpi"><strong>{metrics.verified_deals}</strong><span>Verified deals</span></div><div className="kpi"><strong>RM{Number(metrics.verified_business_generated).toLocaleString()}</strong><span>Verified business generated</span></div><div className="kpi"><strong>1</strong><span>Focused market · Sarawak</span></div></div></div></section>
      <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Official-source project intelligence</div><h2>Latest Sarawak opportunities</h2></div><Link className="source" href="/opportunities">View all →</Link></div><div className="grid">{latest.map(o=><article className="card" key={o.id}><div className="eyebrow">{o.opportunity_type} · Sarawak</div><div className="title">{o.title}</div><div className="meta">{o.buyer}<br/>Closing {o.closing_date ?? '—'}</div><div className="tags"><span className="tag">{o.industry ?? 'General'}</span></div><div className="card-actions"><Link className="btn primary small" href={`/opportunities/${o.id}`}>View project</Link><a className="btn small" href={o.source_url} target="_blank" rel="noreferrer">Official site ↗</a></div></article>)}</div></div></section>
    </main><footer className="footer"><div className="container">Sarawak public-source intelligence with source attribution. Always verify requirements on the official procurement website.</div></footer>
  </>
}
