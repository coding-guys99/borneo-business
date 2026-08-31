export type Opportunity = {
  id: string
  reference: string | null
  title: string
  buyer: string
  region: string
  country: string
  opportunity_type: string
  posted_date: string | null
  closing_date: string | null
  source_url: string
  source_type: string
  industry: string | null
  last_checked_at: string | null
}

export type OpportunityAward = {
  id: number
  opportunity_id: string | null
  awarded_company: string
  awarded_value: number | null
  currency: string
  award_date: string | null
  award_reference: string | null
  source_url: string | null
  source_type: string
  award_company_id: string | null
  tender_reference: string | null
  tender_title: string | null
  procurement_type: string
  buyer: string | null
  award_companies?: { slug: string; canonical_name: string } | null
}

export type AwardCompany = { id: string; canonical_name: string; slug: string; created_at: string }
export type BuyerIntelligence = { id:number; slug:string; canonical_name:string; region:string; country:string; open_opportunities:number; total_opportunities:number; awards_published:number; unique_winners:number; latest_award_date:string|null; latest_posted_date:string|null; disclosed_award_value:number }
export type PlatformMetrics = { opportunities_tracked:number; companies_indexed:number; verified_deals:number; verified_business_generated:number; currency:string }
export type SourceRegistry = { id:string; name:string; organisation:string; organisation_type:string; source_type:string; source_url:string; reuse_rule:string; update_frequency:string; automation_enabled:boolean; reliability:string; last_checked_at:string|null; last_success_at:string|null }
export type SourceRefreshLog = { source_id:string; started_at:string; finished_at:string|null; status:'running'|'success'|'failed'; records_scanned:number|null; records_new:number|null; records_updated:number|null; error_message:string|null }
export type OpportunityRefreshStatus = { source:SourceRegistry|null; latest:SourceRefreshLog|null; newToday:number }

const SUPABASE_URL='https://edpdaxgphxrzvfjquzgp.supabase.co'
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_gZitOhTr8USGqEJFyBvOHQ_VsSM9T1O'
const headers={apikey:SUPABASE_PUBLISHABLE_KEY,Authorization:`Bearer ${SUPABASE_PUBLISHABLE_KEY}`}
async function rows<T>(path:string):Promise<T[]>{const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{headers,cache:'no-store'});return r.ok?r.json():[]}

export async function getOpportunities(){return rows<Opportunity>('opportunities?select=*&order=posted_date.desc.nullslast,closing_date.desc.nullslast')}
export async function getOpportunityById(id:string){return (await rows<Opportunity>(`opportunities?select=*&id=eq.${encodeURIComponent(id)}&limit=1`))[0]??null}
export async function getOpportunityAwards(id:string){const s='*,award_companies(slug,canonical_name)';return rows<OpportunityAward>(`opportunity_awards?select=${encodeURIComponent(s)}&opportunity_id=eq.${encodeURIComponent(id)}&order=award_date.desc.nullslast,created_at.desc`)}
export async function getAwardCompanyBySlug(slug:string){return (await rows<AwardCompany>(`award_companies?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`))[0]??null}
export async function getAwardHistoryByCompany(id:string){return rows<OpportunityAward>(`opportunity_awards?select=*&award_company_id=eq.${encodeURIComponent(id)}&order=award_date.desc.nullslast,created_at.desc`)}
export async function getBuyerBySlug(slug:string){return (await rows<BuyerIntelligence>(`buyer_intelligence?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`))[0]??null}
export async function getBuyerByName(name:string){return (await rows<BuyerIntelligence>(`buyer_intelligence?select=*&canonical_name=eq.${encodeURIComponent(name)}&limit=1`))[0]??null}
export async function getBuyerOpportunities(name:string){return rows<Opportunity>(`opportunities?select=*&buyer=eq.${encodeURIComponent(name)}&region=eq.Sarawak&order=posted_date.desc.nullslast`)}
export async function getBuyerAwards(name:string){const s='*,award_companies(slug,canonical_name)';return rows<OpportunityAward>(`opportunity_awards?select=${encodeURIComponent(s)}&buyer=eq.${encodeURIComponent(name)}&order=award_date.desc.nullslast,created_at.desc`)}
export async function getPlatformMetrics():Promise<PlatformMetrics>{const fallback={opportunities_tracked:0,companies_indexed:0,verified_deals:0,verified_business_generated:0,currency:'MYR'};return (await rows<PlatformMetrics>('platform_metrics?select=*'))[0]??fallback}

function kuchingDayStartIso(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuching',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date())
  const value=(type:string)=>parts.find(p=>p.type===type)?.value??''
  return `${value('year')}-${value('month')}-${value('day')}T00:00:00+08:00`
}

export async function getOpportunityRefreshStatus():Promise<OpportunityRefreshStatus>{
  const source=(await rows<SourceRegistry>('source_registry?select=*&id=eq.sarawak-etender&limit=1'))[0]??null
  const latest=(await rows<SourceRefreshLog>('source_refresh_logs?select=source_id,started_at,finished_at,status,records_scanned,records_new,records_updated,error_message&source_id=eq.sarawak-etender&order=finished_at.desc.nullslast&limit=1'))[0]??null
  const start=encodeURIComponent(kuchingDayStartIso())
  const today=await rows<Pick<SourceRefreshLog,'records_new'|'status'>>(`source_refresh_logs?select=records_new,status&source_id=eq.sarawak-etender&finished_at=gte.${start}`)
  const newToday=today.filter(x=>x.status==='success').reduce((sum,x)=>sum+(x.records_new??0),0)
  return {source,latest,newToday}
}
