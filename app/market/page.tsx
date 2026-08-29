import Link from 'next/link'
import { getOpportunities } from '@/lib/data'

export default async function MarketPage() {
  const opportunities = await getOpportunities()
  const count = (region: string) => opportunities.filter(o => o.region === region).length
  const industries = new Set(opportunities.map(o => o.industry).filter(Boolean)).size
  return <>
    <header className="topbar"><div className="container nav"><Link className="brand" href="/">BORNEO / BUSINESS</Link><nav className="navlinks"><Link href="/opportunities">Opportunities</Link><Link href="/market">Market</Link></nav></div></header>
    <main className="section"><div className="container"><div className="eyebrow">Market intelligence</div><h1 className="page-title">Borneo market coverage</h1><p className="sub">Coverage is calculated directly from the live expoLink Supabase opportunity database.</p><div className="market-grid"><div className="market-card"><strong>{count('Sabah')}</strong><span>Sabah opportunities</span></div><div className="market-card"><strong>{count('Sarawak')}</strong><span>Sarawak opportunities</span></div><div className="market-card"><strong>{count('Brunei')}</strong><span>Brunei opportunities</span></div><div className="market-card"><strong>{industries}</strong><span>Industries classified</span></div></div></div></main>
  </>
}
