import {notFound} from 'next/navigation'
import {getBuyerByName,getOpportunityAwards,getOpportunityById} from '@/lib/data'
import {assessBid,type CompanyProfile} from '@/lib/matching'
import {createServerSupabase} from '@/lib/supabase-server'
import {buyerDisplayName,contextualTerms} from '@/lib/procurement-terms'
import {getOfficialTenderSnapshot} from '@/lib/official-tender-source'
import OpportunityDetailView from '@/components/opportunity-detail-view'
import OpportunityPublicDetailView from '@/components/opportunity-public-detail-view'

export default async function OpportunityDetailPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params
 const opportunity=await getOpportunityById(id)
 if(!opportunity||opportunity.region!=='Sarawak')notFound()
 const [awards,snapshot,buyerLink]=await Promise.all([
  getOpportunityAwards(id),
  getOfficialTenderSnapshot(opportunity.source_url),
  getBuyerByName(opportunity.buyer)
 ])
 const buyerInfo=buyerDisplayName(opportunity.buyer)
 const officialText=[...snapshot.fields.flatMap(f=>[f.label,f.value]),...snapshot.content].join(' ')
 const pageTerms=contextualTerms({buyer:opportunity.buyer,title:opportunity.title,reference:opportunity.reference,extraText:officialText})
 let company:CompanyProfile|null=null
 let signedIn=false
 try{
  const supabase=await createServerSupabase()
  const {data:{user}}=await supabase.auth.getUser()
  signedIn=Boolean(user)
  if(user){
   const {data}=await supabase.from('companies').select('region,capabilities,markets,opportunity_markets,looking_for').eq('owner_id',user.id).order('created_at',{ascending:true}).limit(1).maybeSingle()
   if(data)company={region:data.region,capabilities:data.capabilities??[],markets:data.markets??[],opportunity_markets:data.opportunity_markets??[],looking_for:data.looking_for??[]}
  }
 }catch{}
 if(!signedIn)return <OpportunityPublicDetailView opportunity={opportunity} awards={awards} buyerInfo={{display:buyerInfo.display,fullName:buyerInfo.fullName}} pageTerms={pageTerms} snapshot={snapshot}/>
 const assessment=assessBid(opportunity,company)
 return <OpportunityDetailView opportunity={opportunity} awards={awards} assessment={assessment} companyPresent={Boolean(company)} buyerInfo={{display:buyerInfo.display,fullName:buyerInfo.fullName}} buyerLink={buyerLink?{slug:buyerLink.slug,canonical_name:buyerLink.canonical_name}:null} pageTerms={pageTerms} snapshot={snapshot}/>
}
