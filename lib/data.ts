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

export type PlatformMetrics = {
  opportunities_tracked: number
  companies_indexed: number
  verified_deals: number
  verified_business_generated: number
  currency: string
}

const SUPABASE_URL = 'https://edpdaxgphxrzvfjquzgp.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_gZitOhTr8USGqEJFyBvOHQ_VsSM9T1O'

const headers = {
  apikey: SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/opportunities?select=*&order=closing_date.desc.nullslast`, {
    headers,
    next: { revalidate: 300 },
  })
  if (!res.ok) return []
  return res.json()
}

export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/platform_metrics?select=*`, {
    headers,
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    return { opportunities_tracked: 0, companies_indexed: 0, verified_deals: 0, verified_business_generated: 0, currency: 'MYR' }
  }
  const rows = await res.json()
  return rows[0] ?? { opportunities_tracked: 0, companies_indexed: 0, verified_deals: 0, verified_business_generated: 0, currency: 'MYR' }
}
