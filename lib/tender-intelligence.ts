import type {Opportunity} from '@/lib/data'
import type {OfficialTenderSnapshot,OfficialSourceField} from '@/lib/official-tender-source'

export type IntelligenceEvidence='official'|'platform-derived'
export type IntelligenceItem={label:string;value:string;evidence:IntelligenceEvidence;sourceLabel?:string}
export type ChecklistItem={text:string;evidence:'official'|'verify';sourceLabel?:string}
export type RedFlag={severity:'critical'|'warning'|'info';code:string;title:string;detail:string;evidence:'official'|'platform-derived'}
export type ExtractionCoverage='complete'|'partial'|'needs-review'
export type PursuitGate='closed'|'urgent'|'verify-first'|'review-ready'

export type TenderIntelligenceV1={
 coverage:ExtractionCoverage
 gate:PursuitGate
 nextAction:string
 brief:{scope:string|null;location:string|null;buyer:string;eligibility:string[];mandatory:string[];deadline:string|null}
 extracted:{eligibility:IntelligenceItem[];mandatoryActions:IntelligenceItem[];fees:IntelligenceItem[];submission:IntelligenceItem[];documents:IntelligenceItem[];contacts:IntelligenceItem[]}
 checklist:{confirmed:ChecklistItem[];actions:ChecklistItem[];verify:ChecklistItem[]}
 redFlags:RedFlag[]
}

const P={
 eligibility:/CIDB|UPKJ|MOF|grade|gred|class|kelas|category|kategori|head|sub.?head|bumiputera|registration|pendaftaran|eligib|kelayakan/i,
 site:/site\s*visit|lawatan\s*tapak/i,
 briefing:/briefing|taklimat/i,
 fee:/document\s*fee|tender\s*fee|fee|bayaran|harga\s*dokumen/i,
 submission:/submit|submission|hantar|penghantaran|closing\s*time|waktu\s*tutup|address|alamat|tender\s*box|peti\s*tender|place\s*of/i,
 document:/document|required\s*document|dokumen|form|borang|schedule|jadual|certificate|sijil|copy|salinan/i,
 contact:/contact|telephone|phone|tel\.?|email|e-mail|pegawai|officer/i,
 location:/location|site|lokasi|division|bahagian|district|daerah|place|tempat/i,
 scope:/scope|description|project\s*description|work\s*description|skop|keterangan|butiran|nature\s*of\s*work/i,
 mandatory:/mandatory|compulsory|wajib|dikehendaki|must\s+attend|required\s+to\s+attend/i,
}

function norm(v:string){return v.replace(/\s+/g,' ').trim()}
function uniq<T>(items:T[],key:(x:T)=>string){const seen=new Set<string>();return items.filter(x=>{const k=key(x).toLowerCase();if(seen.has(k))return false;seen.add(k);return true})}
function matches(field:OfficialSourceField,re:RegExp){return re.test(field.label)||re.test(field.value)}
function items(fields:OfficialSourceField[],re:RegExp):IntelligenceItem[]{return uniq(fields.filter(f=>matches(f,re)).map(f=>({label:norm(f.label),value:norm(f.value),evidence:'official' as const,sourceLabel:f.label})),x=>`${x.label}|${x.value}`).slice(0,12)}
function firstValue(fields:OfficialSourceField[],re:RegExp){return fields.find(f=>matches(f,re))?.value?.trim()||null}
function daysUntil(date:string|null){if(!date)return null;const d=new Date(`${date}T12:00:00+08:00`);if(Number.isNaN(d.getTime()))return null;return Math.ceil((d.getTime()-Date.now())/86400000)}
function hasMandatoryLanguage(text:string){return P.mandatory.test(text)}
function concise(values:string[],max=3){return uniq(values.map(norm).filter(Boolean),x=>x).slice(0,max)}

export function extractTenderIntelligence(opportunity:Opportunity,snapshot:OfficialTenderSnapshot):TenderIntelligenceV1{
 const fields=snapshot.fields
 const eligibility=items(fields,P.eligibility)
 const fees=items(fields,P.fee)
 const submission=items(fields,P.submission)
 const documents=items(fields,P.document).filter(x=>!P.fee.test(x.label))
 const contacts=items(fields,P.contact)
 const siteItems=items(fields,P.site)
 const briefingItems=items(fields,P.briefing)
 const mandatoryActions=uniq([...siteItems,...briefingItems].filter(x=>hasMandatoryLanguage(`${x.label} ${x.value}`)||P.site.test(`${x.label} ${x.value}`)||P.briefing.test(`${x.label} ${x.value}`)),x=>`${x.label}|${x.value}`)

 // Never use the tender title as a fake scope summary. Scope must come from an
 // official scope/description field or separately extracted original content.
 const scope=firstValue(fields,P.scope)||snapshot.content[0]?.trim()||null
 const location=firstValue(fields,P.location)
 const deadline=opportunity.closing_date||firstValue(fields,/closing\s*date|tarikh\s*tutup|deadline/i)

 const confirmed:ChecklistItem[]=[]
 for(const x of eligibility.slice(0,6))confirmed.push({text:`${x.label}: ${x.value}`,evidence:'official',sourceLabel:x.sourceLabel})
 for(const x of documents.slice(0,6))confirmed.push({text:`${x.label}: ${x.value}`,evidence:'official',sourceLabel:x.sourceLabel})
 const actions:ChecklistItem[]=mandatoryActions.slice(0,5).map(x=>({text:`${x.label}: ${x.value}`,evidence:'official',sourceLabel:x.sourceLabel}))
 const verify:ChecklistItem[]=[]
 if(!scope)verify.push({text:'The indexed official fields do not clearly state a separate work scope / description.',evidence:'verify'})
 if(!eligibility.length)verify.push({text:'Contractor / supplier eligibility is not clearly structured in the indexed notice.',evidence:'verify'})
 if(!documents.length)verify.push({text:'Required submission documents are not clearly structured in the indexed notice.',evidence:'verify'})
 if(!submission.length)verify.push({text:'Submission method, address or closing-time details need verification in the official notice.',evidence:'verify'})
 if(!siteItems.length&&!briefingItems.length)verify.push({text:'Site visit / briefing requirement is not clearly stated in the indexed structured fields.',evidence:'verify'})

 const redFlags:RedFlag[]=[]
 const deadlineDays=daysUntil(opportunity.closing_date)
 if(deadlineDays!==null&&deadlineDays<0)redFlags.push({severity:'info',code:'closed',title:'Tender closing date has passed',detail:`Closing date: ${opportunity.closing_date}`,evidence:'official'})
 else if(deadlineDays!==null&&deadlineDays<=2)redFlags.push({severity:'critical',code:'deadline-critical',title:'Very little time remains',detail:`Closing in ${deadlineDays} day${deadlineDays===1?'':'s'} (${opportunity.closing_date}).`,evidence:'platform-derived'})
 else if(deadlineDays!==null&&deadlineDays<=7)redFlags.push({severity:'warning',code:'deadline-soon',title:'Closing soon',detail:`Closing in ${deadlineDays} days (${opportunity.closing_date}).`,evidence:'platform-derived'})
 for(const x of siteItems){const txt=`${x.label} ${x.value}`;if(hasMandatoryLanguage(txt))redFlags.push({severity:'critical',code:'mandatory-site-visit',title:'Mandatory site visit detected',detail:`${x.label}: ${x.value}`,evidence:'official'})}
 for(const x of briefingItems){const txt=`${x.label} ${x.value}`;if(hasMandatoryLanguage(txt))redFlags.push({severity:'critical',code:'mandatory-briefing',title:'Mandatory briefing detected',detail:`${x.label}: ${x.value}`,evidence:'official'})}
 if(eligibility.length)redFlags.push({severity:'info',code:'eligibility-present',title:'Registration / eligibility requirements detected',detail:concise(eligibility.map(x=>`${x.label}: ${x.value}`),2).join(' · '),evidence:'official'})
 if(!submission.length)redFlags.push({severity:'warning',code:'submission-unclear',title:'Submission details need verification',detail:'The indexed structured fields do not clearly expose the submission method/address. Check the official notice before preparing a bid.',evidence:'platform-derived'})

 const strongSignals=[Boolean(scope),Boolean(deadline),eligibility.length>0,submission.length>0,documents.length>0]
 const signalCount=strongSignals.filter(Boolean).length
 const coverage:ExtractionCoverage=signalCount>=4?'complete':signalCount>=2?'partial':'needs-review'
 const hasCritical=redFlags.some(x=>x.severity==='critical')
 const gate:PursuitGate=deadlineDays!==null&&deadlineDays<0?'closed':hasCritical?'urgent':(!eligibility.length||!submission.length||!scope)?'verify-first':'review-ready'
 const nextAction=gate==='closed'?'This tender is closed. Review it only for market or award history.':gate==='urgent'?'Resolve the urgent requirement before spending more time preparing the bid.':gate==='verify-first'?'Verify the missing eligibility, scope or submission details in the official notice before committing bid resources.':'Core tender information is available. Review the confirmed requirements and prepare the submission checklist.'

 return {coverage,gate,nextAction,brief:{scope:scope?norm(scope).slice(0,420):null,location:location?norm(location).slice(0,180):null,buyer:opportunity.buyer,eligibility:concise(eligibility.map(x=>`${x.label}: ${x.value}`),4),mandatory:concise(mandatoryActions.map(x=>`${x.label}: ${x.value}`),3),deadline:deadline?norm(deadline):null},extracted:{eligibility,mandatoryActions,fees,submission,documents,contacts},checklist:{confirmed:uniq(confirmed,x=>x.text),actions:uniq(actions,x=>x.text),verify:uniq(verify,x=>x.text)},redFlags:uniq(redFlags,x=>x.code+'|'+x.detail).slice(0,8)}
}
