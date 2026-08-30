import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAwardCompanyBySlug, getAwardHistoryByCompany } from '@/lib/data'

function money(value:number|null,currency:string){if(value==null)return 'Not disclosed';try{return new Intl.NumberFormat('en-MY',{style:'currency',currency,maximumFractionDigits:2}).format(value)}catch{return `${currency} ${value.toLocaleString()}`}}

export default async function AwardCompanyPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const company=await getAwardCompanyBySlug(slug)
  if(!company)notFound()
  const history=await getAwardHistoryByCompany(company.id)
  const tenderCount=history.filter(x=>x.procurement_type==='Tender').length
  const quotationCount=history.filter(x=>x.procurement_type==='Quotation').length
  const buyers=new Set(history.map(x=>x.buyer).filter(Boolean))
  const disclosed=history.filter(x=>x.awarded_value!=null)
  const disclosedTotal=disclosed.reduce((sum,x)=>sum+(x.awarded_value??0),0)

  return <main className="section"><div className="container policy-container">
    <Link className="source back-link" href="/opportunities">← Back to opportunities</Link>
    <div className="eyebrow">Public award history · Sarawak</div>
    <h1 className="detail-title">{company.canonical_name}</h1>
    <p className="lead">Observed public procurement award history collected from official sources. This is an intelligence record, not a claimed or verified company-owned profile.</p>

    <div className="source-trust-note"><strong>Source-backed company history</strong><span>Each record below comes from an official published award/result page. Coverage depends on the public sources currently indexed by Borneo Business and is not a complete legal or financial company history.</span></div>

    <div className="detail-grid panel">
      <div><span>Observed awards</span><strong>{history.length}</strong></div>
      <div><span>Tender awards</span><strong>{tenderCount}</strong></div>
      <div><span>Quotation awards</span><strong>{quotationCount}</strong></div>
      <div><span>Observed buyers</span><strong>{buyers.size}</strong></div>
      <div><span>Value disclosed</span><strong>{disclosed.length?money(disclosedTotal,'MYR'):'Not disclosed in indexed sources'}</strong></div>
      <div><span>Market</span><strong>Sarawak, Malaysia</strong></div>
    </div>

    <div className="panel">
      <div className="panel-title">Award history</div>
      <div className="table-wrap"><div className="table">
        <div className="row head"><div>Date</div><div>Project / award</div><div>Buyer</div><div>Type</div><div>Value</div></div>
        {history.map(a=><div className="row" key={a.id}>
          <div><b>{a.award_date??'—'}</b></div>
          <div>{a.opportunity_id?<Link className="table-link" href={`/opportunities/${a.opportunity_id}`}>{a.tender_title??a.tender_reference??'Award record'}</Link>:<strong>{a.tender_title??a.tender_reference??'Award record'}</strong>}<div className="meta">{a.tender_reference??a.award_reference??'—'}</div>{a.source_url&&<a className="source" href={a.source_url} target="_blank" rel="noreferrer">Official result ↗</a>}</div>
          <div>{a.buyer??'—'}</div>
          <div>{a.procurement_type}</div>
          <div>{money(a.awarded_value,a.currency)}</div>
        </div>)}
      </div></div>
      {!history.length&&<p className="meta">No indexed award history is available for this company yet.</p>}
    </div>
  </div></main>
}
