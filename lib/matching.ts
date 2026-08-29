import type { Opportunity } from '@/lib/data'

export type CompanyProfile = {
  region: string
  capabilities: string[]
  markets: string[]
  opportunity_markets?: string[]
  looking_for: string[]
}

const capabilityMap: Record<string, string[]> = {
  'AV Integration': ['AV & Broadcast', 'Electronics'],
  Broadcast: ['AV & Broadcast'],
  LED: ['AV & Broadcast', 'Event & Signage'],
  Audio: ['AV & Broadcast'],
  Camera: ['AV & Broadcast'],
  Streaming: ['AV & Broadcast', 'ICT'],
  'Event Production': ['Event & Signage', 'AV & Broadcast'],
  IT: ['ICT', 'Electronics', 'Communications'],
  CCTV: ['ICT', 'Electronics'],
  'Digital Signage': ['Event & Signage', 'AV & Broadcast'],
  Communications: ['Communications', 'ICT'],
  Construction: ['Construction'],
  Facilities: ['Facilities', 'Furniture & Facilities'],
  Automotive: ['Automotive'],
  Healthcare: ['Healthcare'],
}

const keywordMap: Record<string, string[]> = {
  'AV Integration': ['audio', 'visual', 'av ', 'system integration'],
  Broadcast: ['broadcast', 'siaran langsung', 'camera', 'studio', 'television'],
  LED: ['led screen', 'display', 'screen'],
  Audio: ['pa system', 'microphone', 'audio', 'speaker'],
  Camera: ['camera', 'lens'],
  Streaming: ['streaming', 'live broadcast', 'siaran langsung'],
  'Event Production': ['event', 'stage', 'dewan', 'majlis'],
  IT: ['ict', 'computer', 'server', 'network', 'tablet', 'ipad'],
  CCTV: ['cctv', 'surveillance', 'security camera'],
  'Digital Signage': ['digital announcement', 'signage', 'display'],
  Communications: ['walkie talkie', 'communications', 'radio'],
}

export function matchOpportunity(opportunity: Opportunity, company: CompanyProfile) {
  const reasons: string[] = []
  let score = 0
  const industry = opportunity.industry ?? ''
  const title = opportunity.title.toLowerCase()

  const industryMatches = company.capabilities.filter(cap => (capabilityMap[cap] ?? []).includes(industry))
  if (industryMatches.length) {
    score += 45
    reasons.push(`${industryMatches[0]} capability`)
  }

  const keywordMatches = company.capabilities.filter(cap => (keywordMap[cap] ?? []).some(k => title.includes(k)))
  if (keywordMatches.length) {
    score += industryMatches.length ? 15 : 35
    reasons.push(`${keywordMatches[0]} keyword match`)
  }

  const targetMarkets = company.opportunity_markets?.length ? company.opportunity_markets : company.markets
  if (opportunity.region === company.region || targetMarkets.includes(opportunity.region)) {
    score += 25
    reasons.push(`${opportunity.region} opportunity market`)
  }

  const wantsTender = company.looking_for.some(x => ['Tenders', 'Projects', 'Customers'].includes(x))
  if (wantsTender) {
    score += 10
    reasons.push('Matches business goal')
  }

  if (!industryMatches.length && !keywordMatches.length && industry && company.capabilities.includes(industry)) {
    score += 45
    reasons.push(`${industry} capability`)
  }

  return { score: Math.min(score, 100), reasons }
}

export function partnerScore(a: CompanyProfile, b: CompanyProfile) {
  let score = 0
  const reasons: string[] = []
  const sameMarket = a.region === b.region || a.markets.includes(b.region) || b.markets.includes(a.region) || a.markets.some(m => b.markets.includes(m))
  if (sameMarket) { score += 40; reasons.push('Shared market') }
  const overlap = a.capabilities.filter(x => b.capabilities.includes(x))
  if (overlap.length) { score += 20; reasons.push(`Shared ${overlap[0]} capability`) }
  const complementary = b.capabilities.filter(x => !a.capabilities.includes(x))
  if (complementary.length) { score += 30; reasons.push(`Adds ${complementary[0]}`) }
  if (a.looking_for.includes('Partners')) { score += 10; reasons.push('Actively seeking partners') }
  return { score: Math.min(score, 100), reasons }
}
