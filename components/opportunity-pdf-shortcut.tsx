'use client'

import {useEffect,useState} from 'react'
import {usePathname} from 'next/navigation'
import {supabase} from '@/lib/browser-supabase'
import OfficialPdfButton from '@/components/official-pdf-button'

export default function OpportunityPdfShortcut(){
  const pathname=usePathname()
  const [record,setRecord]=useState<{source_url:string;reference:string|null}|null>(null)
  useEffect(()=>{
    const match=pathname.match(/^\/opportunities\/([^/]+)$/)
    if(!match){setRecord(null);return}
    const id=decodeURIComponent(match[1])
    supabase.from('opportunities').select('source_url,reference').eq('id',id).maybeSingle().then(({data})=>setRecord(data?.source_url?data:null))
  },[pathname])
  if(!record)return null
  return <div className="official-pdf-floating"><strong>Official document</strong><OfficialPdfButton sourceUrl={record.source_url} reference={record.reference}/></div>
}
