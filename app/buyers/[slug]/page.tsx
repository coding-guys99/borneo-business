import {notFound} from 'next/navigation'
import {getBuyerAwards,getBuyerBySlug,getBuyerOpportunities} from '@/lib/data'
import BuyerProfileView from '@/components/buyer-profile-view'

export default async function BuyerPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const buyer=await getBuyerBySlug(slug); if(!buyer)notFound()
 const [ops,awards]=await Promise.all([getBuyerOpportunities(buyer.canonical_name),getBuyerAwards(buyer.canonical_name)])
 const winners=new Map<string,number>(); for(const a of awards){if(a.awarded_company)winners.set(a.awarded_company,(winners.get(a.awarded_company)||0)+1)}
 const top=[...winners.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10) as [string,number][]
 return <BuyerProfileView buyer={buyer} ops={ops} awards={awards} top={top}/>
}
