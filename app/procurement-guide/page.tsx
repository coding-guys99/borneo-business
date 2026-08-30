import Link from 'next/link'

const terms=[
  {term:'CIDB',name:'Construction Industry Development Board Malaysia',zh:'马来西亚建筑工业发展局',text:'建筑工程相关项目常见的注册与承包商资格机构。若标案写明 CIDB 等级或类别，请以官方招标文件要求为准。'},
  {term:'UPKJ',name:'Unit Pendaftaran Kontraktor dan Juruperunding',zh:'砂拉越承包商与顾问注册单位',text:'砂拉越州政府采购常见的承包商、供应商与顾问注册体系。部分州政府项目会指定 UPKJ 类别、等级或注册条件。'},
  {term:'MOF',name:'Ministry of Finance Malaysia',zh:'马来西亚财政部',text:'部分联邦政府采购会要求供应商具备财政部注册或相关代码。是否需要，以该项目官方文件为准。'},
  {term:'JKR',name:'Jabatan Kerja Raya / Public Works Department',zh:'公共工程局',text:'负责大量公共工程与基础设施项目。砂拉越项目中常见 JKR / Public Works Department 作为采购或项目机构。'},
  {term:'RFQ',name:'Request for Quotation',zh:'询价',text:'通常用于要求供应商提交报价及基本资料。流程一般比正式 Tender 简化，但仍要按公告要求提交。'},
  {term:'RFP',name:'Request for Proposal',zh:'征求建议书',text:'采购方希望供应商提交较完整的技术方案、执行方法与商业报价，不只是价格。'},
  {term:'Tender',name:'Formal Tender',zh:'正式招标',text:'较正式的采购程序，通常包含资格条件、文件要求、截止时间及指定提交方式。'},
  {term:'Site Visit',name:'Site Visit / Tender Briefing',zh:'现场勘查／投标说明会',text:'有些项目规定必须参加。若标示 Mandatory / Compulsory，没有参加可能失去投标资格。'},
  {term:'LOA',name:'Letter of Award',zh:'中标通知书',text:'采购方确认授予项目或合约的正式文件之一。实际法律效力与后续要求应以正式文件内容为准。'},
  {term:'Bumiputera',name:'Bumiputera Status / Requirement',zh:'土著资格要求',text:'部分采购会限制或优先特定 Bumiputera 资格。平台只显示公开文件明确写出的要求，不自行推断。'},
]

export default function ProcurementGuidePage(){
  return <main className="section"><div className="container policy-container">
    <div className="eyebrow">PROCUREMENT GUIDE</div>
    <h1>投标与采购术语指南</h1>
    <p className="sub policy-lead">这里解释 Borneo Business 常见的机构简称、采购方式和投标术语。我们会在项目页面保留简称，同时在第一次出现时提供全名和简单说明。</p>
    <div className="policy-notice"><strong>重要：</strong>这是一份帮助理解的指南，不是法律或资格认定。真正能不能投、需要什么注册和文件，一律以采购方最新官方招标文件为准。</div>
    <div className="term-directory">{terms.map(x=><article className="term-entry" id={x.term.toLowerCase()} key={x.term}><div className="term-code">{x.term}</div><div><h2>{x.term} <span>({x.name})</span></h2><strong className="term-zh">{x.zh}</strong><p>{x.text}</p></div></article>)}</div>
    <div className="guide-bottom"><Link className="btn" href="/opportunities">返回商机</Link></div>
  </div></main>
}
