import Link from 'next/link'
import { getOpportunities, getPlatformMetrics } from '@/lib/data'
import PublicHeader from '@/components/public-header'
import WelcomeTour from '@/components/welcome-tour'
import SiteFooter from '@/components/site-footer'
import { T } from '@/components/i18n'

export default async function Home() {
  const [all, metrics] = await Promise.all([getOpportunities(), getPlatformMetrics()])
  const opportunities=all.filter(o=>o.region==='Sarawak')
  const latest = opportunities.slice(0, 6)
  return <>
    <PublicHeader/><WelcomeTour mode="public"/>
    <main>
      <section className="hero"><div className="container"><div className="eyebrow">Sarawak Business Intelligence Network</div><h1><T k="headline"/></h1><p className="lead"><T k="lead"/></p><p><Link className="btn primary" href="/opportunities"><T k="enterMarket"/></Link></p><div className="kpis"><div className="kpi"><strong>{opportunities.length}</strong><span><T k="sarawakIndexed"/></span></div><div className="kpi"><strong>{metrics.verified_deals}</strong><span><T k="verifiedDeals"/></span></div><div className="kpi"><strong>RM{Number(metrics.verified_business_generated).toLocaleString()}</strong><span><T k="verifiedBusiness"/></span></div><div className="kpi"><strong>1</strong><span><T k="focusedMarket"/></span></div></div></div></section>
      <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow"><T k="officialSourceIntel"/></div><h2><T k="latest"/></h2></div><Link className="source" href="/opportunities"><T k="viewAll"/> →</Link></div><div className="grid">{latest.map(o=><article className="card" key={o.id}><div className="eyebrow">{o.opportunity_type} · Sarawak</div><Link className="title link-title" href={`/opportunities/${o.id}`}>{o.title}</Link><div className="meta">{o.buyer}<br/><T k="closing"/> {o.closing_date ?? '—'}</div><div className="tags"><span className="tag">{o.industry ?? 'General'}</span></div><div className="card-actions"><Link className="btn primary small" href={`/opportunities/${o.id}`}><T k="viewProject"/></Link><a className="btn small" href={o.source_url} target="_blank" rel="noreferrer"><T k="officialSite"/> ↗</a></div></article>)}</div></div></section>
    </main><SiteFooter/>
  </>
}
