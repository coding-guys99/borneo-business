import { getOpportunities } from '@/lib/data'
import OpportunitiesExplorer from '@/components/opportunities-explorer'
import OpportunitiesMarketIntro from '@/components/opportunities-market-intro'
import PublicHeader from '@/components/public-header'
import WelcomeTour from '@/components/welcome-tour'

export default async function OpportunitiesPage(){
  const opportunities=(await getOpportunities()).filter(o=>o.region==='Sarawak')
  return <><PublicHeader/><WelcomeTour mode="public"/><main className="section"><div className="container"><OpportunitiesMarketIntro count={opportunities.length}/><OpportunitiesExplorer opportunities={opportunities}/></div></main></>
}
