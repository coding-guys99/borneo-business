'use client'

import { useState } from 'react'
import { useI18n } from '@/components/i18n'

declare global {
  interface Window { Translator?: any }
}

type Props={
 summary:string
 needs:string[]
 contactText:string
 beforeBid:string[]
}

const languageName={en:'English',zh:'中文',ms:'Bahasa Melayu'} as const
const targetCode={en:'en',zh:'zh',ms:'ms'} as const

export default function OpportunityTranslation({summary,needs,contactText,beforeBid}:Props){
 const {lang}=useI18n()
 const [translated,setTranslated]=useState<{summary:string;needs:string[];contactText:string;beforeBid:string[]}|null>(null)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const [showTranslated,setShowTranslated]=useState(false)
 const labels=lang==='zh'?{translate:'翻譯成',original:'查看原文',translated:'顯示翻譯',working:'翻譯中…',unsupported:'此瀏覽器目前不支援裝置內建翻譯。請保留原文並使用官方資料。',note:'瀏覽器翻譯 · 官方標案名稱與來源保持原文'}:lang==='ms'?{translate:'Terjemah ke',original:'Lihat asal',translated:'Lihat terjemahan',working:'Menterjemah…',unsupported:'Pelayar ini belum menyokong terjemahan terbina dalam pada peranti. Sila rujuk teks asal dan sumber rasmi.',note:'Terjemahan pelayar · tajuk dan sumber rasmi kekal dalam bahasa asal'}:{translate:'Translate to',original:'View original',translated:'View translation',working:'Translating…',unsupported:'This browser does not currently support built-in on-device translation. Keep the original text and verify the official source.',note:'Browser translation · official title and source stay unchanged'}
 const current=showTranslated&&translated?translated:{summary,needs,contactText,beforeBid}
 async function translate(){
  if(translated){setShowTranslated(true);return}
  setBusy(true);setError('')
  try{
   const Translator=window.Translator
   if(!Translator) throw new Error('unsupported')
   const target=targetCode[lang]
   let source='en'
   if(Translator.availability){
    const availability=await Translator.availability({sourceLanguage:source,targetLanguage:target})
    if(availability==='unavailable') throw new Error('unsupported')
   }
   const translator=await Translator.create({sourceLanguage:source,targetLanguage:target})
   const tx=async(s:string)=>target===source?s:await translator.translate(s)
   const result={summary:await tx(summary),needs:await Promise.all(needs.map(tx)),contactText:await tx(contactText),beforeBid:await Promise.all(beforeBid.map(tx))}
   setTranslated(result);setShowTranslated(true)
  }catch{setError(labels.unsupported)}finally{setBusy(false)}
 }
 return <>
  <div className="translation-bar"><div><strong>{labels.note}</strong>{error&&<div className="translation-error">{error}</div>}</div><button className="btn small" disabled={busy} onClick={showTranslated?()=>setShowTranslated(false):translate}>{busy?labels.working:showTranslated?labels.original:translated?labels.translated:`${labels.translate} ${languageName[lang]}`}</button></div>
  <div className="panel detail-panel"><div className="panel-title">Project brief</div><p className="sub tight">{current.summary}</p><p className="meta">This is a simplified interpretation of the public notice title, not a replacement for the tender documents.</p></div>
  <div className="panel"><div className="panel-title">What this project likely needs</div><div className="requirement-list">{current.needs.map(x=><div key={x}>✓ {x}</div>)}</div></div>
  <div className="panel"><div className="panel-title">How to contact / apply</div><p className="sub tight">{current.contactText}</p></div>
  <div className="panel"><div className="panel-title">Before you decide to bid</div><div className="requirement-list">{current.beforeBid.map((x,i)=><div key={x}>{i+1}. {x}</div>)}</div></div>
 </>
}
