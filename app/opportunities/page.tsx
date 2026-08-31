import { getOpportunities, getOpportunityRefreshStatus } from '@/lib/data'
import OpportunitiesExplorer from '@/components/opportunities-explorer'
import OpportunitiesMarketIntro from '@/components/opportunities-market-intro'
import PublicHeader from '@/components/public-header'
import WelcomeTour from '@/components/welcome-tour'

export default async function OpportunitiesPage(){
  const [allOpportunities,refreshStatus]=await Promise.all([getOpportunities(),getOpportunityRefreshStatus()])
  const opportunities=allOpportunities.filter(o=>o.region==='Sarawak')
  return <><PublicHeader/><WelcomeTour mode="public"/><main className="section"><div className="container"><OpportunitiesMarketIntro count={opportunities.length} refreshStatus={refreshStatus}/><OpportunitiesExplorer opportunities={opportunities}/></div></main></>
}
