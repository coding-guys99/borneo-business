import Link from 'next/link'
import { getOpportunities, getPlatformMetrics } from '@/lib/data'

export default async function Home() {
  const [opportunities, metrics] = await Promise.all([getOpportunities(), getPlatformMetrics()])
  const latest = opportunities.slice(0, 6)
  return <>
    <header className="topbar"><div className="container nav"><div className="brand">BORNEO / BUSINESS</div><nav className="navlinks"><Link href="/opportunities">Opportunities</Link><Link href="/market">Market</Link></nav><div className="push"><Link className="btn" href="/signin">Sign In</Link> <Link className="btn primary" href="/onboarding">Join</Link></div></div></header>
    <main>
      <section className="hero"><div className="container"><div className="eyebrow">Borneo Business Intelligence Network</div><h1>See where business is happening across Borneo.</h1><p className="lead">Discover verified public opportunities, understand active buyers and build the right business connections across Sarawak, Sabah and Brunei.</p><p><Link className="btn primary" href="/opportunities">Explore Opportunities</Link></p><div className="kpis"><div className="kpi"><strong>{opportunities.length}</strong><span>Verified opportunities tracked</span></div><div className="kpi"><strong>{metrics.verified_deals}</strong><span>Verified deals</span></div><div className="kpi"><strong>RM{Number(metrics.verified_business_generated).toLocaleString()}</strong><span>Verified business generated</span></div><div className="kpi"><strong>3</strong><span>Borneo markets indexed</span></div></div></div></section>
      <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Live official-source data</div><h2>Latest opportunities</h2></div><Link className="source" href="/opportunities">View all →</Link></div><div className="grid">{latest.map(o=><article className="card" key={o.id}><div className="eyebrow">{o.opportunity_type} · {o.region}</div><div className="title">{o.title}</div><div className="meta">{o.buyer}<br/>Closing {o.closing_date ?? '—'}</div><div className="tags"><span className="tag">{o.industry ?? 'General'}</span><a className="tag" href={o.source_url} target="_blank" rel="noreferrer">Official source ↗</a></div></article>)}</div></div></section>
    </main><footer className="footer"><div className="container">Public-source intelligence with source attribution. Verified deal metrics are never fabricated.</div></footer>
  </>
}
