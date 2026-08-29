import Link from 'next/link'
import { getOpportunities } from '@/lib/data'
import OpportunitiesExplorer from '@/components/opportunities-explorer'

export default async function OpportunitiesPage(){
  const opportunities=await getOpportunities()
  return <><header className="topbar"><div className="container nav"><Link className="brand" href="/">BORNEO / BUSINESS</Link><nav className="navlinks"><Link href="/opportunities">Opportunities</Link><Link href="/market">Market</Link></nav><div className="push"><Link className="btn" href="/signin">Sign In</Link><Link className="btn primary" href="/onboarding">Join</Link></div></div></header><main className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Public market</div><h1 className="page-title">Opportunities</h1><p className="sub">Search {opportunities.length} official-source procurement records across Borneo.</p></div></div><OpportunitiesExplorer opportunities={opportunities}/></div></main></>
}
