import {notFound} from 'next/navigation'
import {getBuyerAwards,getBuyerBySlug,getBuyerOpportunities} from '@/lib/data'
import BuyerProfileView from '@/components/buyer-profile-view'

export default async function BuyerPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params
 const buyer=await getBuyerBySlug(slug)
 if(!buyer)notFound()
 const [ops,awards]=await Promise.all([getBuyerOpportunities(buyer.canonical_name),getBuyerAwards(buyer.canonical_name)])
 const winners=new Map<string,{count:number;slug:string|null}>()
 for(const a of awards){
  if(!a.awarded_company)continue
  const current=winners.get(a.awarded_company)||{count:0,slug:null}
  winners.set(a.awarded_company,{count:current.count+1,slug:a.award_companies?.slug||current.slug})
 }
 const top=[...winners.entries()].map(([name,data])=>({name,...data})).sort((a,b)=>b.count-a.count).slice(0,10)
 return <BuyerProfileView buyer={buyer} ops={ops} awards={awards} top={top}/>
}
