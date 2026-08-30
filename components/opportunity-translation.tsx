'use client'

import { useState } from 'react'
import { useI18n } from '@/components/i18n'

type Props={
 summary:string
 needs:string[]
 contactText:string
 beforeBid:string[]
}

type TranslationResult={
 summary:string
 needs:string[]
 contactText:string
 beforeBid:string[]
}

type TargetLang='zh'|'ms'

const languageName={en:'English',zh:'中文',ms:'Bahasa Melayu'} as const
const targetToken:Record<TargetLang,string>={
 zh:'zho_Hant',
 ms:'zsm_Latn'
}

let translatorPromise:Promise<any>|null=null

async function getTranslator(onProgress:(value:number|null)=>void){
 if(!translatorPromise){
  translatorPromise=(async()=>{
   const {pipeline,env}=await import('@huggingface/transformers')
   env.allowLocalModels=false
   env.allowRemoteModels=true
   env.useBrowserCache=true
   return pipeline('translation','Xenova/opus-mt-en-mul',{
    dtype:'q8',
    device:'wasm',
    progress_callback:(info:any)=>{
     if(typeof info?.progress==='number') onProgress(Math.max(0,Math.min(100,Math.round(info.progress))))
     else if(info?.status==='ready') onProgress(100)
    }
   })
  })().catch((error)=>{
   translatorPromise=null
   throw error
  })
 }
 return translatorPromise
}

async function translateOne(translator:any,text:string,target:TargetLang){
 if(!text.trim()) return text
 const input=`>>${targetToken[target]}<< ${text}`
 const output=await translator(input,{max_new_tokens:512})
 const first=Array.isArray(output)?output[0]:output
 return String(first?.translation_text??first?.generated_text??text).trim()
}

export default function OpportunityTranslation({summary,needs,contactText,beforeBid}:Props){
 const {lang}=useI18n()
 const [translated,setTranslated]=useState<TranslationResult|null>(null)
 const [translatedLang,setTranslatedLang]=useState<'zh'|'ms'|null>(null)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const [showTranslated,setShowTranslated]=useState(false)
 const [progress,setProgress]=useState<number|null>(null)

 const labels=lang==='zh'?{
  translate:'翻譯成',original:'查看原文',translated:'顯示翻譯',working:'翻譯中',offline:'目前沒有網路。首次使用需要下載翻譯模型。',failed:'翻譯模型載入失敗，請稍後再試並保留官方原文。',note:'裝置內開源翻譯 · 首次使用會下載模型，之後由瀏覽器快取',source:'官方標案名稱與來源保持原文'
 }:lang==='ms'?{
  translate:'Terjemah ke',original:'Lihat asal',translated:'Lihat terjemahan',working:'Menterjemah',offline:'Tiada sambungan internet. Penggunaan pertama memerlukan muat turun model terjemahan.',failed:'Model terjemahan gagal dimuatkan. Cuba lagi kemudian dan rujuk sumber rasmi.',note:'Terjemahan sumber terbuka pada peranti · model dimuat turun pada penggunaan pertama dan dicache oleh pelayar',source:'Tajuk dan sumber tender rasmi kekal dalam bahasa asal'
 }:{
  translate:'Translate to',original:'View original',translated:'View translation',working:'Translating',offline:'You are offline. The first translation requires an internet connection to download the model.',failed:'The translation model could not be loaded. Please try again later and keep the official source as reference.',note:'Open-source on-device translation · model downloads once and is cached by your browser',source:'Official tender title and source remain unchanged'
 }

 const current=showTranslated&&translated?translated:{summary,needs,contactText,beforeBid}

 async function translate(){
  if(lang==='en'){
   setShowTranslated(false)
   setError('')
   return
  }
  if(translated&&translatedLang===lang){
   setShowTranslated(true)
   return
  }
  if(typeof navigator!=='undefined'&&!navigator.onLine){
   setError(labels.offline)
   return
  }

  setBusy(true)
  setError('')
  setProgress(null)
  try{
   const target=lang as TargetLang
   const translator=await getTranslator(setProgress)
   const result:TranslationResult={
    summary:await translateOne(translator,summary,target),
    needs:[],
    contactText:await translateOne(translator,contactText,target),
    beforeBid:[]
   }
   for(const item of needs) result.needs.push(await translateOne(translator,item,target))
   for(const item of beforeBid) result.beforeBid.push(await translateOne(translator,item,target))
   setTranslated(result)
   setTranslatedLang(target)
   setShowTranslated(true)
  }catch(error){
   console.error('Local translation failed',error)
   setError(labels.failed)
  }finally{
   setBusy(false)
   setProgress(null)
  }
 }

 const buttonText=busy
  ? `${labels.working}${progress!==null?` ${progress}%`:'…'}`
  : showTranslated
   ? labels.original
   : translated&&translatedLang===lang
    ? labels.translated
    : `${labels.translate} ${languageName[lang]}`

 return <>
  <div className="translation-bar">
   <div>
    <strong>{labels.note}</strong>
    <div className="meta">{labels.source}</div>
    {error&&<div className="translation-error">{error}</div>}
   </div>
   <button className="btn small" disabled={busy||lang==='en'} onClick={showTranslated?()=>setShowTranslated(false):translate}>{buttonText}</button>
  </div>
  <div className="panel detail-panel"><div className="panel-title">Project brief</div><p className="sub tight">{current.summary}</p><p className="meta">This is a simplified interpretation of the public notice title, not a replacement for the tender documents.</p></div>
  <div className="panel"><div className="panel-title">What this project likely needs</div><div className="requirement-list">{current.needs.map(x=><div key={x}>✓ {x}</div>)}</div></div>
  <div className="panel"><div className="panel-title">How to contact / apply</div><p className="sub tight">{current.contactText}</p></div>
  <div className="panel"><div className="panel-title">Before you decide to bid</div><div className="requirement-list">{current.beforeBid.map((x,i)=><div key={`${i}-${x}`}>{i+1}. {x}</div>)}</div></div>
 </>
}
