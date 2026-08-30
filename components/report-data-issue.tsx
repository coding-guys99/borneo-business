'use client'
import {FormEvent,useState} from 'react'
import {supabase} from '@/lib/browser-supabase'

export default function ReportDataIssue({entityId}:{entityId:string}){
 const [open,setOpen]=useState(false),[status,setStatus]=useState(''),[busy,setBusy]=useState(false)
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setStatus('');const fd=new FormData(e.currentTarget);const {error}=await supabase.from('data_reports').insert({entity_type:'opportunity',entity_id:entityId,report_type:String(fd.get('type')),description:String(fd.get('description')),email:String(fd.get('email')||'')||null});setBusy(false);if(error){setStatus('Could not submit the report. Please try again.');return}setStatus('Thank you. Your report has been submitted for review.');e.currentTarget.reset()}
 return <div className="report-issue"><button className="source report-toggle" onClick={()=>setOpen(!open)}>Report incorrect information</button>{open&&<form onSubmit={submit} className="report-form"><label>What is incorrect?<select name="type" required defaultValue=""><option value="" disabled>Select an issue</option><option value="deadline">Deadline</option><option value="buyer">Buyer / organization</option><option value="tender_information">Tender information</option><option value="source_link">Source link</option><option value="translation">Translation</option><option value="other">Other</option></select></label><label>Details<textarea name="description" required minLength={10} rows={4}/></label><label>Email <span className="meta">(optional)</span><input name="email" type="email"/></label><button className="btn small" disabled={busy}>{busy?'Submitting…':'Submit report'}</button>{status&&<p className="meta">{status}</p>}</form>}</div>
}
