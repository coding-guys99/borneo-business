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

export function contextualTerms(input:{buyer:string;title:string;reference?:string|null;extraText?:string}){
  const codes:string[]=[]
  const buyer=buyerDisplayName(input.buyer)
  if(buyer.termCode)codes.push(buyer.termCode)
  const text=`${input.buyer} ${input.title} ${input.reference??''} ${input.extraText??''}`.toUpperCase()
  for(const code of Object.keys(PROCUREMENT_TERMS)){
    if(new RegExp(`(^|[^A-Z0-9])${code}([^A-Z0-9]|$)`,'i').test(text))codes.push(code)
  }
  return Array.from(new Set(codes)).map(code=>PROCUREMENT_TERMS[code]).filter(Boolean)
}
