'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {useI18n} from '@/components/i18n'
import {supabase} from '@/lib/browser-supabase'

const copy={
 en:{saved:'This opportunity is already saved.',success:'Opportunity saved.',saving:'Saving…',save:'Save Opportunity'},
 zh:{saved:'这笔商机已经保存。',success:'商机已保存。',saving:'正在保存…',save:'保存商机'},
 ms:{saved:'Peluang ini telah disimpan.',success:'Peluang disimpan.',saving:'Menyimpan…',save:'Simpan Peluang'}
} as const

export default function OpportunityPipelineAction({opportunityId}:{opportunityId:string}){
 const router=useRouter();const {lang}=useI18n();const c=copy[lang];const [message,setMessage]=useState('');const [busy,setBusy]=useState(false)
 async function save(){setBusy(true);const {data:{user}}=await supabase.auth.getUser();if(!user){router.push(`/signin?next=${encodeURIComponent(`/opportunities/${opportunityId}`)}`);return}
  const {data:existing}=await supabase.from('pipeline_items').select('id').eq('user_id',user.id).eq('opportunity_id',opportunityId).maybeSingle()
  if(existing){setMessage(c.saved);setBusy(false);return}
  const {error}=await supabase.from('pipeline_items').insert({user_id:user.id,opportunity_id:opportunityId,stage:'New',currency:'MYR',verified:false})
  setMessage(error?error.message:c.success);setBusy(false)
 }
 return <div className="action-stack"><button className="btn primary" onClick={save} disabled={busy}>{busy?c.saving:c.save}</button>{message&&<span className="meta">{message}</span>}</div>
}
