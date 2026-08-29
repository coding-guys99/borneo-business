import { getOpportunities } from '@/lib/data'
import OpportunitiesExplorer from '@/components/opportunities-explorer'
import PublicHeader from '@/components/public-header'
import WelcomeTour from '@/components/welcome-tour'

export default async function OpportunitiesPage(){
  const opportunities=(await getOpportunities()).filter(o=>o.region==='Sarawak')
  return <><PublicHeader/><WelcomeTour mode="public"/><main className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Sarawak public market</div><h1 className="page-title">Opportunities</h1><p className="sub">Search {opportunities.length} official-source Sarawak procurement records. Open a project to understand the scope before visiting the official notice.</p></div></div><OpportunitiesExplorer opportunities={opportunities}/></div></main></>
}
