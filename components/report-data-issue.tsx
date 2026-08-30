'use client'
import {FormEvent,useState} from 'react'
import {useI18n} from '@/components/i18n'
import {supabase} from '@/lib/browser-supabase'

const copy={
 en:{toggle:'Report incorrect information',question:'What is incorrect?',select:'Select an issue',deadline:'Deadline',buyer:'Buyer / organization',tender:'Tender information',source:'Source link',translation:'Translation',other:'Other',details:'Details',email:'Email',optional:'(optional)',submitting:'Submitting…',submit:'Submit report',error:'Could not submit the report. Please try again.',success:'Thank you. Your report has been submitted for review.'},
 zh:{toggle:'回报错误信息',question:'哪里有错误？',select:'选择问题类型',deadline:'截止日期',buyer:'采购方／机构',tender:'标案信息',source:'来源链接',translation:'翻译',other:'其他',details:'详细说明',email:'Email',optional:'（选填）',submitting:'正在提交…',submit:'提交回报',error:'无法提交回报，请稍后再试。',success:'谢谢，您的回报已提交审核。'},
 ms:{toggle:'Laporkan maklumat salah',question:'Apakah yang tidak betul?',select:'Pilih isu',deadline:'Tarikh tutup',buyer:'Pembeli / organisasi',tender:'Maklumat tender',source:'Pautan sumber',translation:'Terjemahan',other:'Lain-lain',details:'Butiran',email:'E-mel',optional:'(pilihan)',submitting:'Menghantar…',submit:'Hantar laporan',error:'Laporan tidak dapat dihantar. Sila cuba lagi.',success:'Terima kasih. Laporan anda telah dihantar untuk semakan.'}
} as const

export default function ReportDataIssue({entityId}:{entityId:string}){
 const {lang}=useI18n();const c=copy[lang];const [open,setOpen]=useState(false),[status,setStatus]=useState(''),[busy,setBusy]=useState(false)
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setStatus('');const fd=new FormData(e.currentTarget);const {error}=await supabase.from('data_reports').insert({entity_type:'opportunity',entity_id:entityId,report_type:String(fd.get('type')),description:String(fd.get('description')),email:String(fd.get('email')||'')||null});setBusy(false);if(error){setStatus(c.error);return}setStatus(c.success);e.currentTarget.reset()}
 return <div className="report-issue"><button className="source report-toggle" onClick={()=>setOpen(!open)}>{c.toggle}</button>{open&&<form onSubmit={submit} className="report-form"><label>{c.question}<select name="type" required defaultValue=""><option value="" disabled>{c.select}</option><option value="deadline">{c.deadline}</option><option value="buyer">{c.buyer}</option><option value="tender_information">{c.tender}</option><option value="source_link">{c.source}</option><option value="translation">{c.translation}</option><option value="other">{c.other}</option></select></label><label>{c.details}<textarea name="description" required minLength={10} rows={4}/></label><label>{c.email} <span className="meta">{c.optional}</span><input name="email" type="email"/></label><button className="btn small" disabled={busy}>{busy?c.submitting:c.submit}</button>{status&&<p className="meta">{status}</p>}</form>}</div>
}
