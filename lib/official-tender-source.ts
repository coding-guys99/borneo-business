import {canAutomateSource,sourceComplianceFor} from '@/lib/source-compliance'

export type OfficialSourceField={label:string;value:string}
export type OfficialTenderSnapshot={fields:OfficialSourceField[];content:string[];checkedAt:string|null;sourceName:string;reuseClass:string}

function decodeHtml(value:string){
 const map:Record<string,string>={'&nbsp;':' ','&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}
 return value.replace(/&(nbsp|amp|lt|gt|quot|#39);/gi,m=>map[m.toLowerCase()]??m).replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))
}
function text(value:string){return decodeHtml(value.replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,' ')).replace(/[ \t]+/g,' ').replace(/\s*\n\s*/g,'\n').trim()}
function unique<T>(items:T[],key:(item:T)=>string){const seen=new Set<string>();return items.filter(item=>{const k=key(item);if(seen.has(k))return false;seen.add(k);return true})}

export async function getOfficialTenderSnapshot(url:string):Promise<OfficialTenderSnapshot>{
 const compliance=sourceComplianceFor(url)
 const empty={fields:[],content:[],checkedAt:null,sourceName:compliance.name,reuseClass:compliance.reuseClass}
 if(!canAutomateSource(url))return empty
 try{
  const response=await fetch(url,{headers:{'user-agent':'BorneoBusiness/1.0 public-procurement-index; source-preserving'},next:{revalidate:1800}})
  if(!response.ok)return empty
  const html=await response.text()
  const fields:OfficialSourceField[]=[]
  const content:string[]=[]
  const rows=html.match(/<tr\b[\s\S]*?<\/tr>/gi)??[]
  for(const row of rows){
   const cells=[...row.matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map(m=>text(m[1])).filter(Boolean)
   if(cells.length<2)continue
   const label=cells[0].replace(/\s*:\s*$/,'').trim()
   const value=cells.slice(1).join(' · ').trim()
   if(!label||!value||label===value)continue
   fields.push({label,value})
   if(/description|scope|details|project description|work description|keterangan|butiran|skop/i.test(label)&&value.length>3)content.push(value)
  }
  const cleaned=unique(fields,f=>`${f.label.toLowerCase()}|${f.value}`).slice(0,80)
  return {fields:cleaned,content:unique(content,x=>x).slice(0,8),checkedAt:new Date().toISOString(),sourceName:compliance.name,reuseClass:compliance.reuseClass}
 }catch{return empty}
}
