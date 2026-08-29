import { getOpportunities } from '@/lib/data'
import PublicHeader from '@/components/public-header'
import WelcomeTour from '@/components/welcome-tour'

export default async function MarketPage() {
  const opportunities = (await getOpportunities()).filter(o=>o.region==='Sarawak')
  const industries = new Set(opportunities.map(o => o.industry).filter(Boolean)).size
  const buyers = new Set(opportunities.map(o => o.buyer).filter(Boolean)).size
  const open = opportunities.filter(o=>!o.closing_date||o.closing_date>=new Date().toISOString().slice(0,10)).length
  return <><PublicHeader/><WelcomeTour mode="public"/><main className="section"><div className="container"><div className="eyebrow">Sarawak market intelligence</div><h1 className="page-title">Sarawak opportunity coverage</h1><p className="sub">The first launch market is Sarawak. Sabah and Brunei are intentionally hidden while we deepen Sarawak buyer, project and supplier coverage.</p><div className="market-grid"><div className="market-card"><strong>{opportunities.length}</strong><span>Sarawak records indexed</span></div><div className="market-card"><strong>{open}</strong><span>Currently open in our database</span></div><div className="market-card"><strong>{buyers}</strong><span>Public buyers observed</span></div><div className="market-card"><strong>{industries}</strong><span>Industries classified</span></div></div></div></main></>
}
