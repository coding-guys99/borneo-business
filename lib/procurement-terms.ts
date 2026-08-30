export type ProcurementTerm = {
  code:string
  name:string
  localName?:string
  zhName:string
  description:string
  descriptionZh?:string
  descriptionMs?:string
}

export const PROCUREMENT_TERMS:Record<string,ProcurementTerm>={
  JKR:{code:'JKR',name:'Public Works Department',localName:'Jabatan Kerja Raya',zhName:'公共工程局',description:'Government public works agency responsible for infrastructure, buildings, roads and related public works procurement.',descriptionZh:'负责基础设施、政府建筑、道路及相关公共工程采购的政府部门。',descriptionMs:'Agensi kerja raya kerajaan yang mengurus infrastruktur, bangunan, jalan dan perolehan kerja awam berkaitan.'},
  DID:{code:'DID',name:'Department of Irrigation and Drainage',localName:'Jabatan Pengairan dan Saliran',zhName:'灌溉与排水局',description:'Government agency responsible for drainage, irrigation, flood mitigation and related water infrastructure.',descriptionZh:'负责排水、灌溉、防洪及相关水利基础设施的政府部门。',descriptionMs:'Agensi kerajaan yang bertanggungjawab terhadap saliran, pengairan, mitigasi banjir dan infrastruktur air berkaitan.'},
  JBALB:{code:'JBALB',name:'Rural Water Supply Department',localName:'Jabatan Bekalan Air Luar Bandar',zhName:'乡区水供局',description:'Sarawak agency responsible for rural water supply development, operations and related procurement.',descriptionZh:'负责砂拉越乡区供水发展、运营及相关采购的政府部门。',descriptionMs:'Agensi Sarawak yang mengurus pembangunan, operasi dan perolehan bekalan air luar bandar.'},
  FDS:{code:'FDS',name:'Forest Department Sarawak',localName:'Jabatan Hutan Sarawak',zhName:'砂拉越森林局',description:'Sarawak government department responsible for forest administration, regulation and related public functions.',descriptionZh:'负责砂拉越森林行政、监管及相关公共事务的政府部门。',descriptionMs:'Jabatan kerajaan Sarawak yang bertanggungjawab terhadap pentadbiran, kawal selia dan fungsi awam berkaitan hutan.'},
  SFC:{code:'SFC',name:'Sarawak Forestry Corporation',zhName:'砂拉越林业机构',description:'Sarawak statutory body involved in forestry, conservation and protected-area management.',descriptionZh:'参与砂拉越林业、保育及保护区管理的法定机构。',descriptionMs:'Badan berkanun Sarawak yang terlibat dalam perhutanan, pemuliharaan dan pengurusan kawasan terlindung.'},
  LCDA:{code:'LCDA',name:'Land Custody and Development Authority',localName:'Lembaga Pembangunan dan Lindungan Tanah',zhName:'土地保管与发展局',description:'Sarawak statutory authority involved in land development and related projects.',descriptionZh:'参与砂拉越土地发展及相关项目的法定机构。',descriptionMs:'Pihak berkuasa berkanun Sarawak yang terlibat dalam pembangunan tanah dan projek berkaitan.'},
  STIDC:{code:'STIDC',name:'Sarawak Timber Industry Development Corporation',localName:'Perbadanan Kemajuan Perusahaan Kayu Sarawak',zhName:'砂拉越木材工业发展机构',description:'Sarawak statutory body for development and regulation of the timber industry; also known as PUSAKA.',descriptionZh:'负责砂拉越木材工业发展及相关监管的法定机构，也称 PUSAKA。',descriptionMs:'Badan berkanun Sarawak bagi pembangunan dan kawal selia industri perkayuan, juga dikenali sebagai PUSAKA.'},
  SALCRA:{code:'SALCRA',name:'Sarawak Land Consolidation and Rehabilitation Authority',localName:'Lembaga Penyatuan dan Pemulihan Tanah Sarawak',zhName:'砂拉越土地整合与复兴局',description:'Sarawak statutory authority involved in land consolidation, rehabilitation and development.',descriptionZh:'负责土地整合、复兴与发展相关事务的砂拉越法定机构。',descriptionMs:'Pihak berkuasa berkanun Sarawak yang terlibat dalam penyatuan, pemulihan dan pembangunan tanah.'},
  BDA:{code:'BDA',name:'Bintulu Development Authority',localName:'Lembaga Kemajuan Bintulu',zhName:'民都鲁发展局',description:'Statutory authority responsible for development and local-authority functions in Bintulu.',descriptionZh:'负责民都鲁发展及相关地方政府职能的法定机构。',descriptionMs:'Pihak berkuasa berkanun yang bertanggungjawab terhadap pembangunan dan fungsi pihak berkuasa tempatan di Bintulu.'},
  LAKU:{code:'LAKU',name:'Northern Region Water Board',localName:'Lembaga Air Kawasan Utara',zhName:'北部地区水务局',description:'Water authority serving parts of northern Sarawak.',descriptionZh:'为砂拉越北部部分地区提供供水服务的水务机构。',descriptionMs:'Pihak berkuasa air yang memberi perkhidmatan kepada sebahagian kawasan utara Sarawak.'},
  SFS:{code:'SFS',name:'State Financial Secretary Office',localName:'Pejabat Setiausaha Kewangan Negeri',zhName:'砂拉越州财政司办公室',description:'Sarawak state office responsible for state financial administration and related functions.',descriptionZh:'负责砂拉越州财政行政及相关职能的州政府办公室。',descriptionMs:'Pejabat negeri Sarawak yang bertanggungjawab terhadap pentadbiran kewangan negeri dan fungsi berkaitan.'},
  DUN:{code:'DUN',name:'Sarawak State Legislative Assembly',localName:'Dewan Undangan Negeri Sarawak',zhName:'砂拉越州立法议会',description:'The state legislative assembly of Sarawak.',descriptionZh:'砂拉越州的州级立法机构。',descriptionMs:'Dewan perundangan negeri Sarawak.'},
  CIDB:{code:'CIDB',name:'Construction Industry Development Board Malaysia',zhName:'马来西亚建筑工业发展局',description:'Malaysia construction industry regulator. Construction tenders may require a valid CIDB contractor registration, grade and category.',descriptionZh:'马来西亚建筑行业监管机构。建筑类标案可能要求有效的 CIDB 承包商注册、等级及类别。',descriptionMs:'Badan kawal selia industri pembinaan Malaysia. Tender pembinaan mungkin memerlukan pendaftaran kontraktor CIDB, gred dan kategori yang sah.'},
  UPKJ:{code:'UPKJ',name:'Unit Pendaftaran Kontraktor dan Juruperunding',zhName:'砂拉越承包商及顾问注册单位',description:'Sarawak contractor and consultant registration unit. Some Sarawak government procurement requires the relevant UPKJ registration, class or category.',descriptionZh:'砂拉越承包商及顾问注册单位。部分州政府采购会要求相应的 UPKJ 注册、等级或类别。',descriptionMs:'Unit pendaftaran kontraktor dan juruperunding Sarawak. Sesetengah perolehan kerajaan negeri memerlukan pendaftaran, kelas atau kategori UPKJ yang berkaitan.'},
  MOF:{code:'MOF',name:'Ministry of Finance Malaysia',localName:'Kementerian Kewangan Malaysia',zhName:'马来西亚财政部',description:'Federal Ministry of Finance. Certain government supply and service procurement may require MOF supplier registration.',descriptionZh:'马来西亚联邦财政部。部分政府供应与服务采购可能要求 MOF 供应商注册。',descriptionMs:'Kementerian Kewangan Persekutuan. Sesetengah perolehan bekalan dan perkhidmatan kerajaan mungkin memerlukan pendaftaran pembekal MOF.'},
  GRADE:{code:'GRADE',name:'Contractor Registration Grade',localName:'Gred Pendaftaran Kontraktor',zhName:'承包商注册等级',description:'A contractor grade defines the registration level under the relevant authority. The exact grade required for a tender must come from the official notice; Borneo Business does not infer it.',descriptionZh:'承包商注册等级代表公司在相关注册机构下的等级。某笔标案要求哪个等级，只以官方公告明确写出的内容为准，平台不会自行推断。',descriptionMs:'Gred kontraktor menunjukkan tahap pendaftaran di bawah pihak berkuasa berkaitan. Gred yang diperlukan bagi sesuatu tender mesti dinyatakan oleh notis rasmi dan tidak akan diandaikan oleh Borneo Business.'},
  CLASS:{code:'CLASS',name:'Registration Class',localName:'Kelas Pendaftaran',zhName:'注册级别／Class',description:'A registration class is a qualification grouping used by some contractor or procurement registration systems. Its meaning depends on the issuing authority and tender notice.',descriptionZh:'注册 Class 是部分承包商或采购注册制度使用的资格级别。实际含义取决于所属注册机构及该笔标案的官方要求。',descriptionMs:'Kelas pendaftaran ialah kumpulan kelayakan yang digunakan oleh sesetengah sistem pendaftaran kontraktor atau perolehan. Maksud tepat bergantung pada pihak berkuasa dan notis tender.'},
  CATEGORY:{code:'CATEGORY',name:'Registration Category',localName:'Kategori Pendaftaran',zhName:'注册类别／Category',description:'A category identifies the type of work or supply a company is registered to undertake. Tender-specific category requirements must be confirmed from the official source.',descriptionZh:'注册 Category 用来表示公司获注册从事的工程、服务或供应类别。某笔标案需要哪个类别，必须以官方来源为准。',descriptionMs:'Kategori menunjukkan jenis kerja, perkhidmatan atau bekalan yang syarikat didaftarkan untuk laksanakan. Keperluan kategori tender mesti disahkan daripada sumber rasmi.'},
  HEAD:{code:'HEAD',name:'Registration Head',localName:'Kepala / Head Pendaftaran',zhName:'注册 Head／业务大类',description:'Head is a top-level registration work classification used in some procurement systems. A tender may also specify a more detailed sub-head.',descriptionZh:'Head 是部分采购注册制度中的业务大类。标案也可能进一步要求特定 Sub-head。',descriptionMs:'Head ialah klasifikasi kerja peringkat utama dalam sesetengah sistem pendaftaran perolehan. Tender juga boleh menetapkan sub-head yang lebih khusus.'},
  SUBHEAD:{code:'SUB-HEAD',name:'Registration Sub-head',localName:'Sub-head Pendaftaran',zhName:'注册 Sub-head／业务细类',description:'Sub-head is a more specific work classification beneath a registration head. It should only be treated as required when stated by the official tender source.',descriptionZh:'Sub-head 是 Head 下面更细的业务分类。只有官方标案来源明确写出时，才应视为该笔标案的要求。',descriptionMs:'Sub-head ialah klasifikasi kerja yang lebih khusus di bawah sesuatu head. Ia hanya dianggap sebagai syarat apabila dinyatakan oleh sumber tender rasmi.'},
  BUMIPUTERA:{code:'BUMIPUTERA',name:'Bumiputera Status',localName:'Status Bumiputera',zhName:'Bumiputera／土著资格',description:'Some procurement may specify Bumiputera status as an eligibility condition. Treat it as a tender requirement only when the official notice states it.',descriptionZh:'部分采购会把 Bumiputera（土著）资格列为投标条件。只有官方公告明确写出时，才应视为该笔标案的资格要求。',descriptionMs:'Sesetengah perolehan menetapkan status Bumiputera sebagai syarat kelayakan. Ia hanya dianggap sebagai keperluan tender apabila dinyatakan dalam notis rasmi.'},
  RFQ:{code:'RFQ',name:'Request for Quotation',zhName:'询价',description:'A procurement request asking suppliers to provide pricing and commercial terms for a defined requirement.',descriptionZh:'采购方要求供应商针对明确需求提供价格及商业条件的询价程序。',descriptionMs:'Permintaan perolehan yang meminta pembekal memberikan harga dan terma komersial bagi keperluan tertentu.'},
  RFP:{code:'RFP',name:'Request for Proposal',zhName:'提案邀请',description:'A procurement request asking suppliers to submit a solution or proposal, usually including technical and commercial sections.',descriptionZh:'采购方要求供应商提交解决方案或提案的程序，通常包括技术与商业内容。',descriptionMs:'Permintaan perolehan yang meminta pembekal mengemukakan penyelesaian atau cadangan, biasanya merangkumi bahagian teknikal dan komersial.'},
  LOA:{code:'LOA',name:'Letter of Award',zhName:'中标通知书',description:'Formal notice issued to the successful bidder confirming an award, subject to the terms stated by the buyer.',descriptionZh:'采购方向成功投标者发出的正式中标通知，具体以采购方列明的条款为准。',descriptionMs:'Notis rasmi kepada pembida berjaya yang mengesahkan anugerah tertakluk kepada terma pihak pembeli.'},
}

const BUYER_MAP:[RegExp,string,string][]=[
  [/^Public Works Department$/i,'JKR','JKR Sarawak'],
  [/^Department of Irrigation and Drainage$/i,'DID','DID Sarawak'],
  [/^Jabatan Bekalan Air Luar Bandar$/i,'JBALB','JBALB'],
  [/^Forest Department Sarawak$/i,'FDS','FDS'],
  [/^Sarawak Forestry Corporation$/i,'SFC','SFC'],
  [/^Land Custody(?: and| &) Development Authority$/i,'LCDA','LCDA'],
  [/^Sarawak Timber Industry Development Corporation$/i,'STIDC','STIDC / PUSAKA'],
  [/^Sarawak Land Consolidation and Rehabilitation Authority$/i,'SALCRA','SALCRA'],
  [/^Bintulu Development Authority$/i,'BDA','BDA'],
]

export function buyerDisplayName(buyer:string){
  const hit=BUYER_MAP.find(([pattern])=>pattern.test(buyer.trim()))
  return hit?{display:hit[2],termCode:hit[1],fullName:buyer}:{display:buyer,termCode:null,fullName:buyer}
}

function cidbGradeTerm(grade:string):ProcurementTerm{
 const code=grade.toUpperCase()
 return {code,name:`CIDB Contractor Grade ${code}`,localName:`Gred Kontraktor CIDB ${code}`,zhName:`CIDB 承包商等级 ${code}`,description:`${code} is a CIDB contractor registration grade. It indicates the contractor's registered project-value tier. Whether ${code} is required for this tender must be confirmed from the official notice.`,descriptionZh:`${code} 是 CIDB 承包商注册等级，用来表示承包商获注册承接工程的项目金额层级。该笔标案是否要求 ${code}，只以官方公告为准。`,descriptionMs:`${code} ialah gred pendaftaran kontraktor CIDB yang menunjukkan tahap nilai projek yang didaftarkan. Keperluan ${code} bagi tender ini mesti disahkan daripada notis rasmi.`}
}

export function contextualTerms(input:{buyer:string;title:string;reference?:string|null;extraText?:string}){
 const terms:ProcurementTerm[]=[]
 const seen=new Set<string>()
 const add=(term:ProcurementTerm|undefined)=>{if(term&&!seen.has(term.code)){seen.add(term.code);terms.push(term)}}
 const buyer=buyerDisplayName(input.buyer)
 if(buyer.termCode)add(PROCUREMENT_TERMS[buyer.termCode])
 const text=`${input.buyer} ${input.title} ${input.reference??''} ${input.extraText??''}`.toUpperCase()
 for(const code of Object.keys(PROCUREMENT_TERMS)){
  if(new RegExp(`(^|[^A-Z0-9])${code.replace('-','[- ]?')}([^A-Z0-9]|$)`,'i').test(text))add(PROCUREMENT_TERMS[code])
 }
 if(/\bG(?:RADE)?\s*[1-7]\b/i.test(text)||/\bCIDB\b[\s\S]{0,80}\bG[1-7]\b/i.test(text))add(PROCUREMENT_TERMS.GRADE)
 for(const match of text.matchAll(/\bG([1-7])\b/g))add(cidbGradeTerm(`G${match[1]}`))
 if(/\b(?:CLASS|KELAS)\b/i.test(text))add(PROCUREMENT_TERMS.CLASS)
 if(/\b(?:CATEGORY|KATEGORI)\b/i.test(text))add(PROCUREMENT_TERMS.CATEGORY)
 if(/\b(?:SUB[- ]?HEAD|SUBKEPALA)\b/i.test(text))add(PROCUREMENT_TERMS.SUBHEAD)
 if(/\bHEAD\b/i.test(text))add(PROCUREMENT_TERMS.HEAD)
 if(/\bBUMIPUTERA\b/i.test(text))add(PROCUREMENT_TERMS.BUMIPUTERA)
 return terms
}
