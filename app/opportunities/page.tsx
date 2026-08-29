import Link from 'next/link'
import { getOpportunities } from '@/lib/data'

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities()
  return <>
    <header className="topbar"><div className="container nav"><Link className="brand" href="/">BORNEO / BUSINESS</Link><nav className="navlinks"><Link href="/opportunities">Opportunities</Link><Link href="/market">Market</Link></nav><div className="push"><Link className="btn" href="/signin">Sign In</Link></div></div></header>
    <main className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Public market</div><h1 className="page-title">Opportunities</h1><p className="sub">{opportunities.length} official-source procurement records across Borneo.</p></div></div><div className="table-wrap"><div className="table"><div className="row head"><div>Region</div><div>Opportunity</div><div>Buyer</div><div>Type</div><div>Closing</div></div>{opportunities.map(o=><div className="row" key={o.id}><div><b>{o.region}</b></div><div><b>{o.title}</b><div className="meta">{o.reference ?? '—'} · {o.industry ?? 'General'}</div></div><div>{o.buyer}</div><div>{o.opportunity_type}</div><div>{o.closing_date ?? '—'}<br/><a className="source" href={o.source_url} target="_blank" rel="noreferrer">Official source ↗</a></div></div>)}</div></div></div></main>
  </>
}
