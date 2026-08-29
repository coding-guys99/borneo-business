'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/browser-supabase'

export default function OpportunityPipelineAction({ opportunityId }: { opportunityId: string }){
  const router=useRouter();const [message,setMessage]=useState('');const [busy,setBusy]=useState(false)
  async function save(){setBusy(true);const {data:{user}}=await supabase.auth.getUser();if(!user){router.push(`/signin?next=${encodeURIComponent(`/opportunities/${opportunityId}`)}`);return}
    const {data:existing}=await supabase.from('pipeline_items').select('id').eq('user_id',user.id).eq('opportunity_id',opportunityId).maybeSingle()
    if(existing){setMessage('Already in your pipeline.');setBusy(false);return}
    const {error}=await supabase.from('pipeline_items').insert({user_id:user.id,opportunity_id:opportunityId,stage:'New',currency:'MYR',verified:false})
    setMessage(error?error.message:'Saved to your Pipeline.');setBusy(false)
  }
  return <div className="action-stack"><button className="btn primary" onClick={save} disabled={busy}>{busy?'Saving…':'Save to Pipeline'}</button>{message&&<span className="meta">{message}</span>}</div>
}
