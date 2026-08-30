const groups=[
  {title:'Getting started',items:[
    ['What is Borneo Business?','Borneo Business organizes public procurement and business information so companies can understand opportunities faster and keep the original source close at hand.'],
    ['Do I need an account to view opportunities?','No. Public opportunities and source information can be viewed without an account. A company profile is useful when you want the platform to compare an opportunity with your business.'],
    ['Why should I add company details?','Your capabilities, markets and business goals help Borneo Business show whether an opportunity appears relevant to your company. Official tender eligibility is still determined by the procuring agency.'],
  ]},
  {title:'Understanding tenders',items:[
    ['What do CIDB, UPKJ, JKR and other abbreviations mean?','When a common abbreviation appears on an opportunity page, use the small information button on that page. It opens a contextual explanation without leaving the tender.'],
    ['Does Borneo Business decide whether I am legally eligible?','No. We help organize the available information, but registration grade, category, briefing attendance and legal eligibility must be confirmed from the official tender documents.'],
    ['How do I participate in a tender?','Open the opportunity, review the participation section, confirm eligibility, obtain the official documents, follow the procuring agency’s submission instructions and submit directly to that agency.'],
  ]},
  {title:'Translation & documents',items:[
    ['Is the translation an official translation?','No. Translation is provided to make the notice easier to understand. The original official notice, reference, dates, qualification codes and tender documents remain authoritative.'],
    ['Can I download the official tender information as PDF?','Where an official PDF is published, Borneo Business can link directly to it. For supported official web notices, an official-source copy can also be prepared for easier reading while preserving the original source link.'],
    ['Why is there sometimes no PDF button?','Some procuring agencies publish the notice only as a web page or require documents to be obtained through a separate process. Borneo Business will not label a generated or incomplete document as an official PDF.'],
  ]},
  {title:'Saved opportunities & results',items:[
    ['What happens when I save an opportunity?','It is added to your Saved Opportunities so you can keep the next step, current status and outcome in one place.'],
    ['Where does award information come from?','Award information is shown only when it can be tied to a published public source. If a value is not published, it is shown as Not disclosed rather than estimated.'],
  ]},
]

export default function QAPage(){return <main className="section"><div className="container policy-container"><div className="eyebrow">Q&A</div><h1>Questions & answers</h1><p className="sub">Quick answers for the things people most often need when using Borneo Business.</p><div className="qa-groups">{groups.map(group=><section key={group.title}><h2>{group.title}</h2>{group.items.map(([q,a])=><details className="qa-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>)}</div></div></main>}
