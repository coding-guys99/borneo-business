import {notFound} from 'next/navigation'
import {getBuyerByName,getOpportunityAwards,getOpportunityById} from '@/lib/data'
import {assessBid,type CompanyProfile} from '@/lib/matching'
import {createServerSupabase} from '@/lib/supabase-server'
import {buyerDisplayName,contextualTerms} from '@/lib/procurement-terms'
import {getOfficialTenderSnapshot} from '@/lib/official-tender-source'
import {extractTenderIntelligence} from '@/lib/tender-intelligence'
import {accessTierForUser,type AccessTier} from '@/lib/access-tier'
import OpportunityDetailView from '@/components/opportunity-detail-view'
import OpportunityPublicDetailView from '@/components/opportunity-public-detail-view'
import OpportunityFreeDetailView from '@/components/opportunity-free-detail-view'
import TenderIntelligencePanel from '@/components/tender-intelligence-panel'

export default async function OpportunityDetailPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params
 const opportunity=await getOpportunityById(id)
 if(!opportunity||opportunity.region!=='Sarawak')notFound()
 const [awards,snapshot,buyerLink]=await Promise.all([getOpportunityAwards(id),getOfficialTenderSnapshot(opportunity.source_url),getBuyerByName(opportunity.buyer)])
 const buyerInfo=buyerDisplayName(opportunity.buyer)
 const officialText=[...snapshot.fields.flatMap(f=>[f.label,f.value]),...snapshot.content].join(' ')
 const pageTerms=contextualTerms({buyer:opportunity.buyer,title:opportunity.title,reference:opportunity.reference,extraText:officialText})
 let company:CompanyProfile|null=null
 let accessTier:AccessTier='public'
 try{
  const supabase=await createServerSupabase()
  const {data:{user}}=await supabase.auth.getUser()
  accessTier=accessTierForUser(user?.email)
  if(user){
   const {data}=await supabase.from('companies').select('region,capabilities,markets,opportunity_markets,looking_for').eq('owner_id',user.id).order('created_at',{ascending:true}).limit(1).maybeSingle()
   if(data)company={region:data.region,capabilities:data.capabilities??[],markets:data.markets??[],opportunity_markets:data.opportunity_markets??[],looking_for:data.looking_for??[]}
  }
 }catch{}
 if(accessTier==='public')return <OpportunityPublicDetailView opportunity={opportunity} awards={awards} buyerInfo={{display:buyerInfo.display,fullName:buyerInfo.fullName}} pageTerms={pageTerms} snapshot={snapshot}/>
 if(accessTier==='free')return <OpportunityFreeDetailView opportunity={opportunity} awards={awards} buyerInfo={{display:buyerInfo.display,fullName:buyerInfo.fullName}} pageTerms={pageTerms} snapshot={snapshot}/>
 const assessment=assessBid(opportunity,company)
 const intelligence=extractTenderIntelligence(opportunity,snapshot)
 const today=new Date().toISOString().slice(0,10)
 const isOpen=!opportunity.closing_date||opportunity.closing_date>=today
 const hasAward=awards.length>0
 return <div className="subscribed-tender-page">
  <div className="section subscribed-tender-intro" style={{paddingBottom:0}}><div className="container tender-detail-v2">
   <header className="tender-title-block subscribed-primary-title"><div className="eyebrow">PUBLIC PROCUREMENT · SARAWAK</div><h1>{opportunity.title}</h1><div className="tender-head-meta"><span className={`status-pill ${hasAward?'awarded':isOpen?'open':'closed'}`}>{hasAward?'Awarded':isOpen?'Open':'Closed'}</span><span>{opportunity.reference??'—'}</span><span>{buyerInfo.display}</span><span>{opportunity.closing_date??'—'}</span></div></header>
   <TenderIntelligencePanel data={intelligence}/>
  </div></div>
  <OpportunityDetailView opportunity={opportunity} awards={awards} assessment={assessment} companyPresent={Boolean(company)} buyerInfo={{display:buyerInfo.display,fullName:buyerInfo.fullName}} buyerLink={buyerLink?{slug:buyerLink.slug,canonical_name:buyerLink.canonical_name}:null} pageTerms={pageTerms} snapshot={snapshot}/>
 </div>
}
