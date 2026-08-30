import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getOpportunityAwards, getOpportunityById } from '@/lib/data'
import { assessBid, type CompanyProfile } from '@/lib/matching'
import { createServerSupabase } from '@/lib/supabase-server'
import { buyerDisplayName, contextualTerms } from '@/lib/procurement-terms'
import ContextInfoDrawer from '@/components/context-info-drawer'
import OpportunityPipelineAction from '@/components/opportunity-pipeline-action'
import OpportunityTranslation from '@/components/opportunity-translation'
import ReportDataIssue from '@/components/report-data-issue'
import PublicHeader from '@/components/public-header'
import SiteFooter from '@/components/site-footer'

function plainSummary(title:string,buyer:string){const t=title.toLowerCase();if(t.includes('maintenance')||t.includes('penyelenggaraan')||t.includes('repair')||t.includes('baikpulih'))return `A public procurement project from ${buyer} for maintenance, repair or upgrading work described in the official notice.`;if(t.includes('supply')||t.includes('membekal')||t.includes('delivery'))return `A public supply opportunity from ${buyer}. The selected vendor is expected to supply and/or deliver the items described in the official tender documents.`;if(t.includes('construction')||t.includes('pembinaan')||t.includes('membina'))return `A public works project from ${buyer} involving construction or infrastructure work. Contractor eligibility and site requirements must be checked on the official notice.`;if(t.includes('installation')||t.includes('pemasangan'))return `A public project from ${buyer} involving installation work and related supply/services.`;return `A public procurement opportunity issued by ${buyer}. This page simplifies the key information so you can decide whether it is worth opening the full official notice.`}
function likelyNeeds(title:string,industry:string|null){const t=title.toLowerCase(),needs:string[]=[];if(t.includes('maintenance')||t.includes('penyelenggaraan')||t.includes('repair')||t.includes('baikpulih'))needs.push('Relevant maintenance / repair capability');if(t.includes('construction')||t.includes('pembinaan')||t.includes('membina')||t.includes('road')||t.includes('jalan'))needs.push('Qualified contractor / civil works capability');if(t.includes('supply')||t.includes('membekal')||t.includes('delivery'))needs.push('Product supply and delivery capability');if(t.includes('installation')||t.includes('pemasangan'))needs.push('Installation and commissioning capability');if(industry)needs.push(`${industry} experience or related capability`);needs.push('Eligibility, registration and documents stated in the official tender notice');return Array.from(new Set(needs)).slice(0,4)}
function money(value:number|null,currency:string){if(value==null)return 'Not disclosed';try{return new Intl.NumberFormat('en-MY',{style:'currency',currency,maximumFractionDigits:2}).format(value)}catch{return `${currency} ${value.toLocaleString()}`}}
function dateTime(value:string|null){if(!value)return 'Not available';const d=new Date(value);if(Number.isNaN(d.getTime()))return value;return new Intl.DateTimeFormat('en-MY',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kuching'}).format(d)}
function displayAssessment(label:string){if(label==='Strong Fit')return 'Worth considering';if(label==='Consider')return 'Review first';if(label==='Low Fit')return 'Not recommended';return 'Add company details'}

export default async function OpportunityDetailPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params
  const opportunity=await getOpportunityById(id)
  if(!opportunity||opportunity.region!=='Sarawak')notFound()
  const awards=await getOpportunityAwards(id)
  const isOpen=!opportunity.closing_date||opportunity.closing_date>=new Date().toISOString().slice(0,10)
  const hasAward=awards.length>0
  const needs=likelyNeeds(opportunity.title,opportunity.industry)
  const buyerInfo=buyerDisplayName(opportunity.buyer)
  const pageTerms=contextualTerms({buyer:opportunity.buyer,title:opportunity.title,reference:opportunity.reference})

  let company:CompanyProfile|null=null
  try{
    const supabase=await createServerSupabase()
    const {data:{user}}=await supabase.auth.getUser()
    if(user){const {data}=await supabase.from('companies').select('region,capabilities,markets,opportunity_markets,looking_for').eq('owner_id',user.id).order('created_at',{ascending:true}).limit(1).maybeSingle();if(data)company={region:data.region,capabilities:data.capabilities??[],markets:data.markets??[],opportunity_markets:data.opportunity_markets??[],looking_for:data.looking_for??[]}}
  }catch{}

  const assessment=assessBid(opportunity,company)
  const assessmentClass=assessment.label==='Strong Fit'?'assessment-strong':assessment.label==='Low Fit'?'assessment-low':assessment.label==='Profile Required'?'assessment-profile':'assessment-consider'
  const assessmentText=displayAssessment(assessment.label)
  const contactText='Applications, tender documents, site-visit instructions and agency contact details must be taken from the official procurement notice. Borneo Business links you back to the source so you do not act on incomplete information.'
  const beforeBid=['Confirm eligibility / contractor class on the official notice.','Check compulsory site visit or briefing requirements.','Download the official scope and tender documents.','Confirm closing time and submission method.']

  return <><PublicHeader/><main className="section"><div className="container detail-layout"><section>
    <Link className="source back-link" href="/opportunities">← Back to Sarawak Opportunities</Link>
    <div className="eyebrow">PUBLIC PROCUREMENT · {opportunity.opportunity_type.toUpperCase()} · SARAWAK</div>
    <h1 className="detail-title">{opportunity.title}</h1>
    <div className="detail-tags"><span className={`status-pill ${hasAward?'awarded':isOpen?'open':'closed'}`}>{hasAward?'Awarded':isOpen?'Open':'Closed / archive'}</span><span className="tag">{opportunity.industry??'General'}</span><span className="tag">Official source</span></div>

    <div className="decision-card">
      <div className="decision-head"><div><div className="eyebrow">IS THIS WORTH YOUR TIME?</div><h2>Should your company pursue this opportunity?</h2></div><span className={`assessment-label ${assessmentClass}`}>{assessmentText}</span></div>
      <p className="decision-summary">{assessment.summary}</p>
      <div className="assessment-table">{assessment.items.map(item=><div className="assessment-row" key={item.label}><span className={`assessment-mark ${item.status}`}>{item.status==='positive'?'✓':item.status==='negative'?'×':item.status==='warning'?'△':'—'}</span><strong>{item.label}</strong><span>{item.detail}</span></div>)}</div>
      {!company&&<div className="decision-action"><span>Add your company details to make this assessment relevant to your business.</span><Link className="btn" href="/onboarding">Add company details</Link></div>}
      <div className="assessment-method"><strong>How this is decided:</strong> company capabilities, selected markets, project category and closing date. Tender-specific legal eligibility is never assumed.</div>
    </div>

    <div className="evidence-strip"><div><span>SOURCE</span><strong>Official public record</strong></div><div><span>LAST CHECKED</span><strong>{dateTime(opportunity.last_checked_at)}</strong></div><div><span>REFERENCE</span><strong>{opportunity.reference??'Not published'}</strong></div></div>

    <div className="panel"><div className="panel-title">Key project information</div><div className="detail-grid"><div><span>Buyer / agency</span><div className="buyer-abbreviation"><strong>{buyerInfo.display}</strong><ContextInfoDrawer terms={pageTerms}/></div></div><div><span>Reference</span><strong>{opportunity.reference??'—'}</strong></div><div><span>Market</span><strong>Sarawak, Malaysia</strong></div><div><span>Posted</span><strong>{opportunity.posted_date??'—'}</strong></div><div><span>Closing</span><strong>{opportunity.closing_date??'—'}</strong></div><div><span>Procurement type</span><strong>{opportunity.opportunity_type}</strong></div></div></div>

    <details className="detail-disclosure"><summary><span>Eligibility & registration</span><small>What must be confirmed before bidding</small></summary><div className="disclosure-body"><p className="meta">Only requirements explicitly available from the official tender documents should be treated as confirmed. If CIDB, UPKJ, MOF or another abbreviation appears in this page, use the information button beside the buyer name for a quick explanation.</p><a className="btn" href={opportunity.source_url} target="_blank" rel="noreferrer">Check official requirements ↗</a></div></details>

    <details className="detail-disclosure"><summary><span>How to participate</span><small>Practical steps before submission</small></summary><div className="disclosure-body"><ol className="participation-steps"><li><strong>Confirm eligibility.</strong><span>Read the official notice and confirm company registrations, grades, categories and any mandatory briefing.</span></li><li><strong>Obtain the official tender documents.</strong><span>Use the procurement agency's official website or stated document channel.</span></li><li><strong>Review the scope and submission instructions.</strong><span>Check technical requirements, pricing forms, supporting documents, submission method and exact closing time.</span></li><li><strong>Prepare and submit directly to the procuring agency.</strong><span>Borneo Business does not submit tenders on your behalf.</span></li><li><strong>Save this opportunity if you want to follow it.</strong><span>Keep your next step and outcome together in Saved Opportunities.</span></li></ol><a className="btn primary" href={opportunity.source_url} target="_blank" rel="noreferrer">Open official tender record ↗</a></div></details>

    <details className="detail-disclosure"><summary><span>Translation</span><small>Plain-language working translation</small></summary><div className="disclosure-body"><div className="translation-notice"><strong>For understanding only.</strong> Official project titles, references, qualification codes, dates and legal tender documents remain authoritative.</div><OpportunityTranslation opportunityId={opportunity.id} summary={plainSummary(opportunity.title,opportunity.buyer)} needs={needs} contactText={contactText} beforeBid={beforeBid}/></div></details>

    <details className="detail-disclosure"><summary><span>Project timeline</span><small>Published, closing and award status</small></summary><div className="disclosure-body"><div className="procurement-timeline"><div className="timeline-item"><span className="timeline-dot complete"></span><div><strong>Published</strong><span>{opportunity.posted_date??'Date not available'}</span><small>Official tender record</small></div></div><div className="timeline-item"><span className={`timeline-dot ${opportunity.closing_date?'complete':'pending'}`}></span><div><strong>Closing</strong><span>{opportunity.closing_date??'Not available'}</span><small>{isOpen?'Submission window currently open based on indexed closing date.':'Listed closing date has passed.'}</small></div></div>{hasAward?awards.map(a=><div className="timeline-item" key={a.id}><span className="timeline-dot complete"></span><div><strong>Award published</strong><span>{a.award_date??'Date not disclosed'} · {a.awarded_company}</span><small>{money(a.awarded_value,a.currency)}{a.source_url?' · official result source available':''}</small></div></div>):<div className="timeline-item"><span className="timeline-dot pending"></span><div><strong>Award result</strong><span>Not indexed</span><small>No award result is currently linked to this opportunity.</small></div></div>}</div></div></details>

    {hasAward&&<details className="detail-disclosure"><summary><span>Award result</span><small>Published winner and disclosed value</small></summary><div className="disclosure-body"><div className="award-list">{awards.map(a=><div className="award-row" key={a.id}><div><span className="award-label">Successful tenderer</span>{a.award_companies?.slug?<Link className="award-company table-link" href={`/companies/${a.award_companies.slug}`}>{a.awarded_company} →</Link>:<strong className="award-company">{a.awarded_company}</strong>}</div><div><span className="award-label">Award value</span><strong>{money(a.awarded_value,a.currency)}</strong></div><div><span className="award-label">Award date</span><strong>{a.award_date??'Not disclosed'}</strong></div><div><span className="award-label">Award reference</span><strong>{a.award_reference??'Not disclosed'}</strong></div>{a.source_url&&<div className="award-source"><a className="source" href={a.source_url} target="_blank" rel="noreferrer">Open official award source ↗</a></div>}</div>)}</div></div></details>}

    <details className="detail-disclosure"><summary><span>Source & data notes</span><small>Where the information came from</small></summary><div className="disclosure-body"><div className="evidence-grid"><div><span className="evidence-type official">OFFICIAL DATA</span><strong>Title, buyer, reference, dates and procurement type</strong><p>Indexed from the linked public procurement source.</p></div><div><span className="evidence-type analysis">PLATFORM ASSESSMENT</span><strong>Whether the opportunity appears relevant to your company</strong><p>Based on your saved company details and available project information. It does not replace official eligibility checks.</p></div></div><a className="btn primary" href={opportunity.source_url} target="_blank" rel="noreferrer">Open official tender record ↗</a><ReportDataIssue entityId={opportunity.id}/></div></details>
  </section>

  <aside className="detail-aside"><div className="panel sticky-panel"><div className="eyebrow">NEXT STEP</div><h2>{hasAward?'Award published':assessmentText}</h2><p className="meta">{hasAward?'Review the published result and winner history.':assessment.summary}</p>{!hasAward&&<OpportunityPipelineAction opportunityId={opportunity.id}/>}<hr/><a className="btn full primary" href={opportunity.source_url} target="_blank" rel="noreferrer">Open official tender record ↗</a>{company?<Link className="btn full" href="/profile">Review company details</Link>:<Link className="btn full" href="/onboarding">Add company details</Link>}<div className="aside-trust">Formal eligibility and submission requirements always come from the procuring agency's official tender documents.</div></div></aside>
  </div></main><SiteFooter/></>
}
