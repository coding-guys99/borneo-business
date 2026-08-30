import type { Opportunity } from '@/lib/data'

export type CompanyProfile = {
  region: string
  capabilities: string[]
  markets: string[]
  opportunity_markets?: string[]
  looking_for: string[]
}

const capabilityMap: Record<string, string[]> = {
  'AV Integration': ['AV & Broadcast', 'Electronics'], Broadcast: ['AV & Broadcast'], LED: ['AV & Broadcast', 'Event & Signage'], Audio: ['AV & Broadcast'], Camera: ['AV & Broadcast'], Streaming: ['AV & Broadcast', 'ICT'], 'Event Production': ['Event & Signage', 'AV & Broadcast'], IT: ['ICT', 'Electronics', 'Communications'], CCTV: ['ICT', 'Electronics'], 'Digital Signage': ['Event & Signage', 'AV & Broadcast'], Communications: ['Communications', 'ICT'], Construction: ['Construction'], Facilities: ['Facilities', 'Furniture & Facilities'], Automotive: ['Automotive'], Healthcare: ['Healthcare'],
}

const keywordMap: Record<string, string[]> = {
  'AV Integration': ['audio','visual','av ','system integration'], Broadcast: ['broadcast','siaran langsung','camera','studio','television'], LED: ['led screen','display','screen'], Audio: ['pa system','microphone','audio','speaker'], Camera: ['camera','lens'], Streaming: ['streaming','live broadcast','siaran langsung'], 'Event Production': ['event','stage','dewan','majlis'], IT: ['ict','computer','server','network','tablet','ipad'], CCTV: ['cctv','surveillance','security camera'], 'Digital Signage': ['digital announcement','signage','display'], Communications: ['walkie talkie','communications','radio'], Construction: ['construction','pembinaan','jalan','road','bridge','jambatan','civil','building','bangunan'], Facilities: ['facility','facilities','maintenance','penyelenggaraan','repair','baikpulih'], Healthcare: ['hospital','medical','health','klinik'], Automotive: ['vehicle','automotive','kenderaan'],
}

export function matchOpportunity(opportunity: Opportunity, company: CompanyProfile) {
  const reasons:string[]=[]; let score=0; const industry=opportunity.industry??''; const title=opportunity.title.toLowerCase()
  const industryMatches=company.capabilities.filter(cap=>(capabilityMap[cap]??[]).includes(industry))
  if(industryMatches.length){score+=45;reasons.push(`${industryMatches[0]} capability`)}
  const keywordMatches=company.capabilities.filter(cap=>(keywordMap[cap]??[]).some(k=>title.includes(k)))
  if(keywordMatches.length){score+=industryMatches.length?15:35;reasons.push(`${keywordMatches[0]} keyword match`)}
  const targetMarkets=company.opportunity_markets?.length?company.opportunity_markets:company.markets
  if(opportunity.region===company.region||targetMarkets.includes(opportunity.region)){score+=25;reasons.push(`${opportunity.region} opportunity market`)}
  const wantsTender=company.looking_for.some(x=>['Tenders','Projects','Customers'].includes(x));if(wantsTender){score+=10;reasons.push('Matches business goal')}
  if(!industryMatches.length&&!keywordMatches.length&&industry&&company.capabilities.includes(industry)){score+=45;reasons.push(`${industry} capability`)}
  return {score:Math.min(score,100),reasons}
}

export type AssessmentItem={label:string;status:'positive'|'warning'|'negative'|'unknown';detail:string}
export type BidAssessment={label:'Strong Fit'|'Consider'|'Low Fit'|'Profile Required';summary:string;items:AssessmentItem[]}

export function assessBid(opportunity:Opportunity,company:CompanyProfile|null,today=new Date()):BidAssessment{
  if(!company)return {label:'Profile Required',summary:'Add your company capabilities and target markets to receive a transparent bid assessment.',items:[
    {label:'Capability alignment',status:'unknown',detail:'Company capability data is required.'},
    {label:'Eligibility',status:'unknown',detail:'Registration, grade and tender-specific eligibility must be verified in the official notice.'},
    {label:'Market coverage',status:'unknown',detail:`This opportunity is in ${opportunity.region}.`},
  ]}
  const title=opportunity.title.toLowerCase(); const industry=opportunity.industry??''
  const industryMatches=company.capabilities.filter(cap=>(capabilityMap[cap]??[]).includes(industry))
  const keywordMatches=company.capabilities.filter(cap=>(keywordMap[cap]??[]).some(k=>title.includes(k)))
  const capabilityMatches=Array.from(new Set([...industryMatches,...keywordMatches]))
  const targetMarkets=company.opportunity_markets?.length?company.opportunity_markets:company.markets
  const marketFit=opportunity.region===company.region||targetMarkets.includes(opportunity.region)
  const wantsBid=company.looking_for.some(x=>['Tenders','Projects','Customers'].includes(x))
  let days:number|null=null
  if(opportunity.closing_date){const close=new Date(`${opportunity.closing_date}T23:59:59Z`);days=Math.ceil((close.getTime()-today.getTime())/86400000)}
  const closed=days!==null&&days<0; const urgent=days!==null&&days>=0&&days<5
  const items:AssessmentItem[]=[
    {label:'Capability alignment',status:capabilityMatches.length?'positive':'warning',detail:capabilityMatches.length?`Matched company capability: ${capabilityMatches.join(', ')}.`:'No clear capability match can be established from the indexed title and category.'},
    {label:'Market coverage',status:marketFit?'positive':'negative',detail:marketFit?`${opportunity.region} is included in your company or opportunity markets.`:`${opportunity.region} is not currently included in your selected markets.`},
    {label:'Business objective',status:wantsBid?'positive':'warning',detail:wantsBid?'Your profile indicates interest in tenders, projects or customers.':'Your profile does not currently indicate tenders, projects or customers as a target.'},
    {label:'Deadline readiness',status:closed?'negative':urgent?'warning':'positive',detail:closed?'The listed closing date has passed.':days===null?'No closing date is available in the indexed record.':urgent?`Only ${days} day${days===1?'':'s'} remain. Confirm submission requirements immediately.`:`${days} day${days===1?'':'s'} remain before the listed closing date.`},
    {label:'Eligibility',status:'unknown',detail:'Tender registration, contractor grade, mandatory briefing and legal eligibility are not inferred. Verify them in the official notice.'},
  ]
  let label:BidAssessment['label']='Consider'
  if(closed||!marketFit)label='Low Fit'
  else if(capabilityMatches.length&&wantsBid&&!urgent)label='Strong Fit'
  const summary=label==='Strong Fit'?'The indexed information shows a clear commercial fit. Verify tender-specific eligibility before committing bid resources.':label==='Low Fit'?'The current profile or timing shows a material reason not to prioritise this opportunity.':'There is potential relevance, but one or more decision factors still require confirmation.'
  return {label,summary,items}
}

export function partnerScore(a:CompanyProfile,b:CompanyProfile){let score=0;const reasons:string[]=[];const sameMarket=a.region===b.region||a.markets.includes(b.region)||b.markets.includes(a.region)||a.markets.some(m=>b.markets.includes(m));if(sameMarket){score+=40;reasons.push('Shared market')}const overlap=a.capabilities.filter(x=>b.capabilities.includes(x));if(overlap.length){score+=20;reasons.push(`Shared ${overlap[0]} capability`)}const complementary=b.capabilities.filter(x=>!a.capabilities.includes(x));if(complementary.length){score+=30;reasons.push(`Adds ${complementary[0]}`)}if(a.looking_for.includes('Partners')){score+=10;reasons.push('Actively seeking partners')}return {score:Math.min(score,100),reasons}}
