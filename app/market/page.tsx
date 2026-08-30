import { getOpportunities } from '@/lib/data'
import PublicHeader from '@/components/public-header'
import WelcomeTour from '@/components/welcome-tour'
import MarketSummary from '@/components/market-summary'

export default async function MarketPage() {
  const opportunities = (await getOpportunities()).filter(o=>o.region==='Sarawak')
  const industries = new Set(opportunities.map(o => o.industry).filter(Boolean)).size
  const buyers = new Set(opportunities.map(o => o.buyer).filter(Boolean)).size
  const open = opportunities.filter(o=>!o.closing_date||o.closing_date>=new Date().toISOString().slice(0,10)).length
  return <><PublicHeader/><WelcomeTour mode="public"/><main className="section"><div className="container"><MarketSummary records={opportunities.length} open={open} buyers={buyers} industries={industries}/></div></main></>
}
