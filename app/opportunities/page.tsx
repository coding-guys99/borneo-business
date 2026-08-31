import { getOpportunities } from '@/lib/data'
import OpportunitiesExplorer from '@/components/opportunities-explorer'
import PublicHeader from '@/components/public-header'
import WelcomeTour from '@/components/welcome-tour'
import { T } from '@/components/i18n'

export default async function OpportunitiesPage(){
  const opportunities=(await getOpportunities()).filter(o=>o.region==='Sarawak')
  return <><PublicHeader/><WelcomeTour mode="public"/><main className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Sarawak · Business Opportunities</div><h1 className="page-title"><T k="opportunities"/></h1><p className="sub">Government, institutional and business opportunities in one searchable market. Current records remain source-traceable. ({opportunities.length})</p></div></div><OpportunitiesExplorer opportunities={opportunities}/></div></main></>
}
