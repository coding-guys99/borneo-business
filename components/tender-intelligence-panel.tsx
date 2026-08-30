'use client'

import {useI18n} from '@/components/i18n'
import type {TenderIntelligenceV1} from '@/lib/tender-intelligence'
import styles from './tender-intelligence-panel.module.css'

const copy={
 en:{eyebrow:'SUBSCRIBED INTELLIGENCE',title:'Bid Snapshot',subtitle:'The information that matters before you spend time preparing a bid.',what:'Work scope',eligibility:'Can I bid?',mandatory:'Must do',deadline:'Deadline',next:'What to do next',checklist:'Bid checklist',confirmed:'Confirmed from official source',actions:'Mandatory / time-sensitive actions',verify:'Still needs verification',flags:'Watch before bidding',details:'Extracted tender requirements',fees:'Fees',submission:'Submission',documents:'Documents',contacts:'Contacts',none:'Not clearly stated in the indexed official fields',official:'Official',derived:'Platform derived',complete:'Good coverage',partial:'Partial coverage',review:'Needs review',closed:'Closed',urgent:'Urgent action',verifyFirst:'Verify first',reviewReady:'Ready for review',trust:'Missing information is shown as missing. Borneo Business does not reuse the tender title as a substitute for an official work scope.'},
 zh:{eyebrow:'订阅情报',title:'投标快览',subtitle:'先看真正会影响你是否继续投入时间准备投标的资料。',what:'实际工作内容',eligibility:'我能不能投',mandatory:'一定要做',deadline:'截止时间',next:'现在该做什么',checklist:'投标准备清单',confirmed:'官方已确认',actions:'强制／有时间压力的动作',verify:'仍需回官方确认',flags:'投标前先注意',details:'已抽取的标案要求',fees:'费用',submission:'提交方式',documents:'文件',contacts:'联络资料',none:'已收录官方结构化资料未明确说明',official:'官方资料',derived:'平台推导',complete:'资料较完整',partial:'资料不完整',review:'需要检查',closed:'已截止',urgent:'有紧急事项',verifyFirst:'先确认条件',reviewReady:'可继续评估',trust:'缺什么就显示缺什么。Borneo Business 不再拿标案标题冒充实际工作内容。'},
 ms:{eyebrow:'RISIKAN LANGGANAN',title:'Ringkasan Bida',subtitle:'Maklumat yang benar-benar penting sebelum anda meluangkan masa menyediakan bida.',what:'Skop kerja sebenar',eligibility:'Bolehkah saya membida?',mandatory:'Wajib dibuat',deadline:'Tarikh tutup',next:'Apa perlu dibuat sekarang',checklist:'Senarai semak bida',confirmed:'Disahkan daripada sumber rasmi',actions:'Tindakan wajib / sensitif masa',verify:'Masih perlu disahkan',flags:'Perkara perlu diperhatikan',details:'Keperluan tender diekstrak',fees:'Bayaran',submission:'Penghantaran',documents:'Dokumen',contacts:'Hubungan',none:'Tidak dinyatakan dengan jelas dalam medan rasmi diindeks',official:'Rasmi',derived:'Terbitan platform',complete:'Liputan baik',partial:'Liputan separa',review:'Perlu semakan',closed:'Ditutup',urgent:'Tindakan segera',verifyFirst:'Sahkan dahulu',reviewReady:'Sedia dinilai',trust:'Maklumat yang tiada ditunjukkan sebagai tiada. Tajuk tender tidak digunakan sebagai pengganti skop kerja rasmi.'}
} as const

function coverageLabel(value:TenderIntelligenceV1['coverage'],c:(typeof copy)['en']){return value==='complete'?c.complete:value==='partial'?c.partial:c.review}
function gateLabel(value:TenderIntelligenceV1['gate'],c:(typeof copy)['en']){return value==='closed'?c.closed:value==='urgent'?c.urgent:value==='verify-first'?c.verifyFirst:c.reviewReady}
function join(values:string[],fallback:string){return values.length?values.join(' · '):fallback}

export default function TenderIntelligencePanel({data}:{data:TenderIntelligenceV1}){
 const {lang}=useI18n();const c=copy[lang] as typeof copy.en
 const groups=[[c.eligibility,data.extracted.eligibility],[c.fees,data.extracted.fees],[c.submission,data.extracted.submission],[c.documents,data.extracted.documents],[c.contacts,data.extracted.contacts]] as const
 return <section className={styles.panel}>
  <div className={styles.header}><div><div className={styles.eyebrow}>{c.eyebrow}</div><h2>{c.title}</h2><p>{c.subtitle}</p></div><div className={styles.headerTags}><span className={styles.gate}>{gateLabel(data.gate,c)}</span><span className={styles.coverage}>{coverageLabel(data.coverage,c)}</span></div></div>
  <div className={styles.snapshot}>
   <div className={`${styles.cell} ${styles.scope}`}><span>{c.what}</span><strong>{data.brief.scope||c.none}</strong></div>
   <div className={styles.cell}><span>{c.eligibility}</span><strong>{join(data.brief.eligibility,c.none)}</strong></div>
   <div className={styles.cell}><span>{c.mandatory}</span><strong>{join(data.brief.mandatory,c.none)}</strong></div>
   <div className={styles.cell}><span>{c.deadline}</span><strong>{data.brief.deadline||c.none}</strong></div>
  </div>
  <div className={styles.next}><span>{c.next}</span><strong>{data.nextAction}</strong></div>
  <div className={styles.sections}>
   <div className={styles.section}><h3>{c.checklist}</h3>
    <div className={styles.checkGroup}><strong>{c.confirmed}</strong>{data.checklist.confirmed.length?data.checklist.confirmed.map((x,i)=><div className={styles.check} key={`${x.text}-${i}`}><span className={styles.dot}>✓</span><span>{x.text}</span></div>):<div className={styles.empty}>{c.none}</div>}</div>
    <div className={styles.checkGroup}><strong>{c.actions}</strong>{data.checklist.actions.length?data.checklist.actions.map((x,i)=><div className={styles.check} key={`${x.text}-${i}`}><span className={styles.dot}>!</span><span>{x.text}</span></div>):<div className={styles.empty}>{c.none}</div>}</div>
    <div className={styles.checkGroup}><strong>{c.verify}</strong>{data.checklist.verify.length?data.checklist.verify.map((x,i)=><div className={styles.check} key={`${x.text}-${i}`}><span className={styles.dot}>?</span><span>{x.text}</span></div>):<div className={styles.empty}>{c.none}</div>}</div>
   </div>
   <div className={styles.section}><h3>{c.flags}</h3><div className={styles.list}>{data.redFlags.length?data.redFlags.map((x,i)=><div className={`${styles.flag} ${x.severity==='critical'?styles.flagCritical:x.severity==='warning'?styles.flagWarning:styles.flagInfo}`} key={`${x.code}-${i}`}><strong>{x.title}</strong><p>{x.detail}</p><span className={styles.tag}>{x.evidence==='official'?c.official:c.derived}</span></div>):<div className={styles.empty}>{c.none}</div>}</div></div>
   <details className={styles.details}><summary>{c.details}</summary><div className={styles.detailGrid}>{groups.map(([label,values])=><div className={styles.cell} key={label}><span>{label}</span>{values.length?values.slice(0,5).map((x,i)=><strong key={`${x.label}-${i}`}>{x.label}: {x.value}</strong>):<strong>{c.none}</strong>}</div>)}</div></details>
  </div>
  <div className={styles.note}>{c.trust}</div>
 </section>
}
