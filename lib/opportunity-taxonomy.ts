import type {Opportunity} from '@/lib/data'

export type OrganisationType='Government'|'GLC / Statutory Body'|'Education'|'Association / Chamber'|'Corporate'|'NGO / Foundation'|'Other'
export type OpportunityKind='Tender'|'RFQ'|'RFP'|'EOI'|'Vendor Registration'|'Contractor Invitation'|'Partnership'|'Project Opportunity'|'Other'

function includesAny(text:string,terms:string[]){return terms.some(x=>text.includes(x))}

export function organisationTypeFor(o:Opportunity):OrganisationType{
 const text=`${o.buyer} ${o.source_type} ${o.source_url}`.toLowerCase()
 if(includesAny(text,['university','universiti','college','kolej','polytechnic','politeknik','school','sekolah']))return 'Education'
 if(includesAny(text,['association','persatuan','chamber','federation','society','council of churches','sports association']))return 'Association / Chamber'
 if(includesAny(text,['foundation','yayasan','ngo','non-government']))return 'NGO / Foundation'
 if(includesAny(text,['sdn bhd','berhad','bhd','corporation','holdings','developer']))return 'Corporate'
 if(includesAny(text,['statutory','authority','board','commission','corporation sarawak','sarawak energy','development authority']))return 'GLC / Statutory Body'
 if(includesAny(text,['government','department','ministry','jkr','jabatan','majlis','council','sarawak.gov.my','etendernotice']))return 'Government'
 return 'Other'
}

export function opportunityKindFor(o:Opportunity):OpportunityKind{
 const raw=(o.opportunity_type||'').toLowerCase()
 const title=o.title.toLowerCase()
 const text=`${raw} ${title}`
 if(/\brfq\b|request for quotation|quotation|sebut harga/.test(text))return 'RFQ'
 if(/\brfp\b|request for proposal/.test(text))return 'RFP'
 if(/\beoi\b|expression of interest/.test(text))return 'EOI'
 if(/vendor registration|supplier registration|pendaftaran vendor/.test(text))return 'Vendor Registration'
 if(/contractor invitation|invitation to contractor/.test(text))return 'Contractor Invitation'
 if(/partnership|strategic partner|rakan strategik/.test(text))return 'Partnership'
 if(/project opportunity|project invitation/.test(text))return 'Project Opportunity'
 if(/tender|quotation/.test(raw)||/tender/.test(title))return 'Tender'
 return 'Other'
}

export function platformCategoryFor(o:Opportunity){return o.industry?.trim()||'Unclassified'}

export function organisationRoleFor(o:Opportunity){
 const type=organisationTypeFor(o)
 return type==='Government'||type==='GLC / Statutory Body'?'Buyer / Issuing Agency':'Organisation'
}
