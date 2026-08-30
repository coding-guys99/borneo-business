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

export type AwardCompany = {
  id: string
  canonical_name: string
  slug: string
  created_at: string
}

export type PlatformMetrics = {
  opportunities_tracked: number
  companies_indexed: number
  verified_deals: number
  verified_business_generated: number
  currency: string
}

const SUPABASE_URL = 'https://edpdaxgphxrzvfjquzgp.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_gZitOhTr8USGqEJFyBvOHQ_VsSM9T1O'
const headers = { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` }

export async function getOpportunities(): Promise<Opportunity[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/opportunities?select=*&order=posted_date.desc.nullslast,closing_date.desc.nullslast`, { headers, cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/opportunities?select=*&id=eq.${encodeURIComponent(id)}&limit=1`, { headers, cache: 'no-store' })
  if (!res.ok) return null
  const rows: Opportunity[] = await res.json()
  return rows[0] ?? null
}

export async function getOpportunityAwards(opportunityId: string): Promise<OpportunityAward[]> {
  const select='*,award_companies(slug,canonical_name)'
  const res = await fetch(`${SUPABASE_URL}/rest/v1/opportunity_awards?select=${encodeURIComponent(select)}&opportunity_id=eq.${encodeURIComponent(opportunityId)}&order=award_date.desc.nullslast,created_at.desc`, { headers, cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function getAwardCompanyBySlug(slug: string): Promise<AwardCompany | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/award_companies?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`, { headers, cache: 'no-store' })
  if (!res.ok) return null
  const rows: AwardCompany[] = await res.json()
  return rows[0] ?? null
}

export async function getAwardHistoryByCompany(companyId: string): Promise<OpportunityAward[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/opportunity_awards?select=*&award_company_id=eq.${encodeURIComponent(companyId)}&order=award_date.desc.nullslast,created_at.desc`, { headers, cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const fallback = { opportunities_tracked: 0, companies_indexed: 0, verified_deals: 0, verified_business_generated: 0, currency: 'MYR' }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/platform_metrics?select=*`, { headers, cache: 'no-store' })
  if (!res.ok) return fallback
  const rows = await res.json()
  return rows[0] ?? fallback
}
