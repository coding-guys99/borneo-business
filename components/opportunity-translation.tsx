'use client'

import { useState } from 'react'
import { useI18n } from '@/components/i18n'
import { supabase } from '@/lib/browser-supabase'

type Props={opportunityId:string;summary:string;needs:string[];contactText:string;beforeBid:string[]}
type TranslationResult={summary:string;needs:string[];contactText:string;beforeBid:string[]}
type TargetLang='zh'|'ms'

const languageName={en:'English',zh:'中文',ms:'Bahasa Melayu'} as const
const targetToken:Record<TargetLang,string>={zh:'zho_Hant',ms:'zsm_Latn'}
const protectedTerms=[
 'UPKJ','CIDB','MOF','JKR','eTender','Tender','RFQ','RFP','Bumiputera','Sarawak','Malaysia',
 'Grade G1','Grade G2','Grade G3','Grade G4','Grade G5','Grade G6','Grade G7'
]
let translatorPromise:Promise<any>|null=null

function protectTerms(text:string){
 const values:string[]=[]
 let protectedText=text
 const terms=[...protectedTerms].sort((a,b)=>b.length-a.length)
 for(const term of terms){
  const regex=new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'gi')
  protectedText=protectedText.replace(regex,match=>{
   const index=values.push(match)-1
   return `XTERM${index}X`
  })
 }
 protectedText=protectedText.replace(/\b[A-Z]{2,8}\b/g,match=>{
  const index=values.push(match)-1
  return `XTERM${index}X`
 })
 return {text:protectedText,restore:(translated:string)=>translated.replace(/XTERM\s*(\d+)\s*X/gi,(_,n)=>values[Number(n)]??_)}
}

async function sourceHash(value:string){
 const bytes=new TextEncoder().encode(value)
 const digest=await crypto.subtle.digest('SHA-256',bytes)
 return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('')
}

async function getTranslator(onProgress:(value:number|null)=>void){
 if(!translatorPromise){
  translatorPromise=(async()=>{
   const {pipeline,env}=await import('@huggingface/transformers')
   env.allowLocalModels=false;env.allowRemoteModels=true;env.useBrowserCache=true
   return pipeline('translation','Xenova/opus-mt-en-mul',{dtype:'q8',device:'wasm',progress_callback:(info:any)=>{
    if(typeof info?.progress==='number') onProgress(Math.max(0,Math.min(100,Math.round(info.progress))))
    else if(info?.status==='ready') onProgress(100)
   }})
  })().catch(error=>{translatorPromise=null;throw error})
 }
 return translatorPromise
}

async function translateOne(translator:any,text:string,target:TargetLang){
 if(!text.trim()) return text
 const guarded=protectTerms(text)
 const output=await translator(`>>${targetToken[target]}<< ${guarded.text}`,{max_new_tokens:512})
 const first=Array.isArray(output)?output[0]:output
 return guarded.restore(String(first?.translation_text??first?.generated_text??guarded.text).trim())
}

export default function OpportunityTranslation({opportunityId,summary,needs,contactText,beforeBid}:Props){
 const {lang}=useI18n()
 const [translated,setTranslated]=useState<TranslationResult|null>(null)
 const [translatedLang,setTranslatedLang]=useState<'zh'|'ms'|null>(null)
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[showTranslated,setShowTranslated]=useState(false)
 const [progress,setProgress]=useState<number|null>(null),[cacheHit,setCacheHit]=useState(false)
 const labels=lang==='zh'?{translate:'翻譯成',original:'查看原文',translated:'顯示翻譯',working:'翻譯中',checking:'檢查翻譯快取',offline:'目前沒有網路，而且這筆內容尚未載入共用翻譯快取。',failed:'翻譯載入失敗，請稍後再試並保留官方原文。',note:'開源翻譯 · 已翻譯內容會共用快取',cached:'已使用共用翻譯快取',source:'官方標案名稱、來源與專業術語保持原文'}:lang==='ms'?{translate:'Terjemah ke',original:'Lihat asal',translated:'Lihat terjemahan',working:'Menterjemah',checking:'Menyemak cache terjemahan',offline:'Tiada internet dan terjemahan kongsi untuk kandungan ini belum dimuatkan.',failed:'Terjemahan gagal dimuatkan. Cuba lagi kemudian dan rujuk sumber rasmi.',note:'Terjemahan sumber terbuka · hasil terjemahan dikongsi melalui cache',cached:'Menggunakan cache terjemahan kongsi',source:'Tajuk, sumber dan istilah tender rasmi dikekalkan'}:{translate:'Translate to',original:'View original',translated:'View translation',working:'Translating',checking:'Checking translation cache',offline:'You are offline and this translation is not already available in the shared cache.',failed:'Translation could not be loaded. Please try again later and keep the official source as reference.',note:'Open-source translation · translated content is stored in a shared cache',cached:'Using shared translation cache',source:'Official tender title, source and protected terminology remain unchanged'}
 const current=showTranslated&&translated?translated:{summary,needs,contactText,beforeBid}

 async function translate(){
  if(lang==='en'){setShowTranslated(false);setError('');return}
  if(translated&&translatedLang===lang){setShowTranslated(true);return}
  setBusy(true);setError('');setProgress(null);setCacheHit(false)
  try{
   const target=lang as TargetLang
   const hash=await sourceHash(JSON.stringify({summary,needs,contactText,beforeBid,glossary:'v1'}))
   const {data:cached,error:cacheError}=await supabase.from('opportunity_translations').select('summary,needs,contact_text,before_bid').eq('opportunity_id',opportunityId).eq('language',target).eq('source_hash',hash).maybeSingle()
   if(cacheError) console.warn('Translation cache lookup failed',cacheError)
   if(cached){
    const result={summary:String(cached.summary),needs:Array.isArray(cached.needs)?cached.needs.map(String):[],contactText:String(cached.contact_text),beforeBid:Array.isArray(cached.before_bid)?cached.before_bid.map(String):[]}
    setTranslated(result);setTranslatedLang(target);setCacheHit(true);setShowTranslated(true);return
   }
   if(typeof navigator!=='undefined'&&!navigator.onLine) throw new Error('offline')
   const translator=await getTranslator(setProgress)
   const result:TranslationResult={summary:await translateOne(translator,summary,target),needs:[],contactText:await translateOne(translator,contactText,target),beforeBid:[]}
   for(const item of needs) result.needs.push(await translateOne(translator,item,target))
   for(const item of beforeBid) result.beforeBid.push(await translateOne(translator,item,target))
   setTranslated(result);setTranslatedLang(target);setShowTranslated(true)
   const {error:saveError}=await supabase.from('opportunity_translations').insert({opportunity_id:opportunityId,language:target,summary:result.summary,needs:result.needs,contact_text:result.contactText,before_bid:result.beforeBid,provider:'transformersjs-opus-mt-glossary-v1',source_hash:hash})
   if(saveError&&saveError.code!=='23505') console.warn('Translation cache save failed',saveError)
  }catch(err:any){console.error('Translation failed',err);setError(err?.message==='offline'?labels.offline:labels.failed)}finally{setBusy(false);setProgress(null)}
 }
 const buttonText=busy?`${progress===null?labels.checking:labels.working}${progress!==null?` ${progress}%`:'…'}`:showTranslated?labels.original:translated&&translatedLang===lang?labels.translated:`${labels.translate} ${languageName[lang]}`
 return <>
  <div className="translation-bar"><div><strong>{labels.note}</strong><div className="meta">{cacheHit?`${labels.cached} · `:''}{labels.source}</div>{error&&<div className="translation-error">{error}</div>}</div><button className="btn small" disabled={busy||lang==='en'} onClick={showTranslated?()=>setShowTranslated(false):translate}>{buttonText}</button></div>
  <div className="panel detail-panel"><div className="panel-title">Project brief</div><p className="sub tight">{current.summary}</p><p className="meta">This is a simplified interpretation of the public notice title, not a replacement for the tender documents.</p></div>
  <div className="panel"><div className="panel-title">What this project likely needs</div><div className="requirement-list">{current.needs.map(x=><div key={x}>✓ {x}</div>)}</div></div>
  <div className="panel"><div className="panel-title">How to contact / apply</div><p className="sub tight">{current.contactText}</p></div>
  <div className="panel"><div className="panel-title">Before you decide to bid</div><div className="requirement-list">{current.beforeBid.map((x,i)=><div key={`${i}-${x}`}>{i+1}. {x}</div>)}</div></div>
 </>
}
