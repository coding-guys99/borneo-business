export type ReuseClass='open-data'|'public-facts-only'|'manual-review'|'blocked'
export type PersonalDataRisk='low'|'review'|'high'
export type CrawlMethod='official-api-or-download'|'public-page-polled'|'manual-only'|'blocked'

export type SourceComplianceRule={
 id:string
 name:string
 host:string
 pathPrefix?:string
 reuseClass:ReuseClass
 reuseBasis:string
 attributionRequired:boolean
 personalDataRisk:PersonalDataRisk
 crawlMethod:CrawlMethod
 official:boolean
 rules:string[]
}

export const SOURCE_COMPLIANCE_RULES:SourceComplianceRule[]=[
 {
  id:'sarawak-open-data',name:'Sarawak Data',host:'data.sarawak.gov.my',reuseClass:'open-data',
  reuseBasis:'Sarawak Data states that datasets are licensed for reuse, transformation, combination and sharing, including commercial use. Dataset-specific licence and attribution requirements must still be preserved.',
  attributionRequired:true,personalDataRisk:'review',crawlMethod:'official-api-or-download',official:true,
  rules:['Prefer dataset/API/download access over scraping rendered pages.','Preserve dataset title, publisher, source URL and licence/attribution information.','Do not treat government logos, trademarks, third-party rights or personal data as covered merely because the dataset is open.']
 },
 {
  id:'sarawak-etender',name:'Sarawak Government eTender Notices',host:'etendernotice.sarawak.gov.my',reuseClass:'public-facts-only',
  reuseBasis:'Publicly accessible official procurement notices. The site carries a copyright notice, so Borneo Business should index necessary factual fields and link back rather than mirror the site or republish substantial page content.',
  attributionRequired:true,personalDataRisk:'review',crawlMethod:'public-page-polled',official:true,
  rules:['Extract factual fields needed for discovery and analysis.','Keep title/reference/source URL and critical official facts traceable to the source.','Do not copy page layout, branding, images or substantial descriptive text.','Do not bypass login, CAPTCHA, access controls, rate limits or technical restrictions.']
 },
 {
  id:'jkr-sarawak',name:'JKR Sarawak',host:'jkr.sarawak.gov.my',reuseClass:'public-facts-only',
  reuseBasis:'Publicly accessible official tender, quotation and award/result information. Use as a source of factual observations with deep links to the official result.',
  attributionRequired:true,personalDataRisk:'review',crawlMethod:'public-page-polled',official:true,
  rules:['Index factual procurement and award fields only.','Preserve official result/source links.','Avoid republishing complete documents or substantial copyrighted narrative unless a separate reuse licence permits it.','Do not bypass technical or access restrictions.']
 }
]

export const UNKNOWN_SOURCE_RULE:SourceComplianceRule={
 id:'unknown',name:'Unreviewed source',host:'*',reuseClass:'manual-review',
 reuseBasis:'No approved reuse basis has been recorded for this source.',attributionRequired:true,personalDataRisk:'review',crawlMethod:'manual-only',official:false,
 rules:['Do not enable automated ingestion until the source is reviewed.','Record ownership, licence/terms, permitted reuse, crawl method, attribution and personal-data risk.','When in doubt, store only a link and minimal factual metadata until review is complete.']
}

export function sourceComplianceFor(url:string):SourceComplianceRule{
 try{
  const parsed=new URL(url)
  const matches=SOURCE_COMPLIANCE_RULES.filter(rule=>parsed.hostname===rule.host&&(rule.pathPrefix?parsed.pathname.startsWith(rule.pathPrefix):true))
  return matches[0]??UNKNOWN_SOURCE_RULE
 }catch{return UNKNOWN_SOURCE_RULE}
}

export function canAutomateSource(url:string){
 const rule=sourceComplianceFor(url)
 return rule.reuseClass==='open-data'||rule.reuseClass==='public-facts-only'
}
