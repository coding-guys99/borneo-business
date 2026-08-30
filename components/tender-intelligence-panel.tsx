'use client'

import {useI18n} from '@/components/i18n'
import type {TenderIntelligenceV1} from '@/lib/tender-intelligence'
import styles from './tender-intelligence-panel.module.css'

const copy={
 en:{eyebrow:'SUBSCRIBED INTELLIGENCE',title:'30-Second Tender Brief',subtitle:'A structured reading of the indexed official tender data. Official facts remain separate from platform-derived signals.',coverage:'Extraction',what:'What',where:'Where',buyer:'Buyer',eligibility:'Eligibility',mandatory:'Mandatory',deadline:'Deadline',checklist:'Real Checklist',confirmed:'Confirmed from official source',actions:'Actions detected',verify:'Needs verification',flags:'Red Flags',extracted:'Extracted Tender Requirements',fees:'Fees',submission:'Submission',documents:'Documents',contacts:'Contacts',none:'Not clearly stated in indexed structured fields',official:'Official',derived:'Platform derived',complete:'Complete',partial:'Partial',review:'Needs review',trust:'No requirement is invented. Missing or unclear items are marked for verification against the official notice.'},
 zh:{eyebrow:'订阅情报',title:'30 秒标案摘要',subtitle:'根据已收录官方标案资料做结构化整理；官方事实与平台推导讯号会明确分开。',coverage:'抽取完整度',what:'做什么',where:'地点',buyer:'采购方',eligibility:'资格要求',mandatory:'强制事项',deadline:'截止时间',checklist:'真实准备清单',confirmed:'官方已确认',actions:'需要完成的动作',verify:'还需确认',flags:'风险提醒',extracted:'标案要求抽取',fees:'费用',submission:'提交方式',documents:'文件',contacts:'联络资料',none:'已收录结构化资料未明确说明',official:'官方资料',derived:'平台推导',complete:'完整',partial:'部分',review:'需检查',trust:'平台不会自行补造资格或要求；缺失或不明确的项目会标示为需要回官方公告确认。'},
 ms:{eyebrow:'RISIKAN LANGGANAN',title:'Ringkasan Tender 30 Saat',subtitle:'Bacaan berstruktur daripada data tender rasmi yang diindeks. Fakta rasmi dipisahkan daripada isyarat terbitan platform.',coverage:'Liputan ekstraksi',what:'Skop',where:'Lokasi',buyer:'Pembeli',eligibility:'Kelayakan',mandatory:'Wajib',deadline:'Tarikh tutup',checklist:'Senarai Semak Sebenar',confirmed:'Disahkan daripada sumber rasmi',actions:'Tindakan dikesan',verify:'Perlu disahkan',flags:'Amaran Risiko',extracted:'Keperluan Tender Diekstrak',fees:'Bayaran',submission:'Penghantaran',documents:'Dokumen',contacts:'Hubungan',none:'Tidak dinyatakan dengan jelas dalam medan berstruktur diindeks',official:'Rasmi',derived:'Terbitan platform',complete:'Lengkap',partial:'Separa',review:'Perlu semakan',trust:'Tiada keperluan direka oleh platform. Maklumat yang hilang atau tidak jelas ditanda untuk pengesahan pada notis rasmi.'}
} as const

function coverageLabel(value:TenderIntelligenceV1['coverage'],c:(typeof copy)['en']){return value==='complete'?c.complete:value==='partial'?c.partial:c.review}
function join(values:string[],fallback:string){return values.length?values.join(' · '):fallback}

export default function TenderIntelligencePanel({data}:{data:TenderIntelligenceV1}){
 const {lang}=useI18n();const c=copy[lang] as typeof copy.en
 const groups=[
  [c.eligibility,data.extracted.eligibility],
  [c.fees,data.extracted.fees],
  [c.submission,data.extracted.submission],
  [c.documents,data.extracted.documents],
  [c.contacts,data.extracted.contacts],
 ] as const
 return <section className={styles.panel}>
  <div className={styles.header}><div><div className={styles.eyebrow}>{c.eyebrow}</div><h2>{c.title}</h2><p>{c.subtitle}</p></div><span className={styles.coverage}>{c.coverage}: {coverageLabel(data.coverage,c)}</span></div>
  <div className={styles.brief}><h3>{c.title}</h3><div className={styles.grid}>
   <div className={`${styles.cell} ${styles.wide}`}><span>{c.what}</span><strong>{data.brief.scope||c.none}</strong></div>
   <div className={styles.cell}><span>{c.where}</span><strong>{data.brief.location||c.none}</strong></div>
   <div className={styles.cell}><span>{c.buyer}</span><strong>{data.brief.buyer}</strong></div>
   <div className={styles.cell}><span>{c.eligibility}</span><strong>{join(data.brief.eligibility,c.none)}</strong></div>
   <div className={styles.cell}><span>{c.mandatory}</span><strong>{join(data.brief.mandatory,c.none)}</strong></div>
   <div className={styles.cell}><span>{c.deadline}</span><strong>{data.brief.deadline||c.none}</strong></div>
  </div></div>
  <div className={styles.sections}>
   <div className={styles.section}><h3>{c.checklist}</h3>
    <div className={styles.checkGroup}><strong>{c.confirmed}</strong>{data.checklist.confirmed.length?data.checklist.confirmed.map((x,i)=><div className={styles.check} key={`${x.text}-${i}`}><span className={styles.dot}>✓</span><span>{x.text}</span></div>):<div className={styles.empty}>{c.none}</div>}</div>
    <div className={styles.checkGroup}><strong>{c.actions}</strong>{data.checklist.actions.length?data.checklist.actions.map((x,i)=><div className={styles.check} key={`${x.text}-${i}`}><span className={styles.dot}>!</span><span>{x.text}</span></div>):<div className={styles.empty}>{c.none}</div>}</div>
    <div className={styles.checkGroup}><strong>{c.verify}</strong>{data.checklist.verify.map((x,i)=><div className={styles.check} key={`${x.text}-${i}`}><span className={styles.dot}>?</span><span>{x.text}</span></div>)}</div>
   </div>
   <div className={styles.section}><h3>{c.flags}</h3><div className={styles.list}>{data.redFlags.length?data.redFlags.map((x,i)=><div className={`${styles.flag} ${x.severity==='critical'?styles.flagCritical:x.severity==='warning'?styles.flagWarning:styles.flagInfo}`} key={`${x.code}-${i}`}><strong>{x.title}</strong><p>{x.detail}</p><span className={styles.tag}>{x.evidence==='official'?c.official:c.derived}</span></div>):<div className={styles.empty}>{c.none}</div>}</div></div>
   <div className={styles.section} style={{gridColumn:'1 / -1'}}><h3>{c.extracted}</h3><div className={styles.grid}>{groups.map(([label,values])=><div className={styles.cell} key={label}><span>{label}</span>{values.length?values.slice(0,4).map((x,i)=><strong key={`${x.label}-${i}`}>{x.label}: {x.value}</strong>):<strong>{c.none}</strong>}</div>)}</div></div>
  </div>
  <div className={styles.note}>{c.trust}</div>
 </section>
}
