export type ProcurementTerm = {
  code:string
  name:string
  localName?:string
  zhName:string
  description:string
}

export const PROCUREMENT_TERMS:Record<string,ProcurementTerm>={
  JKR:{code:'JKR',name:'Public Works Department',localName:'Jabatan Kerja Raya',zhName:'公共工程局',description:'Government public works agency responsible for infrastructure, buildings, roads and related public works procurement.'},
  DID:{code:'DID',name:'Department of Irrigation and Drainage',localName:'Jabatan Pengairan dan Saliran',zhName:'灌溉与排水局',description:'Government agency responsible for drainage, irrigation, flood mitigation and related water infrastructure.'},
  JBALB:{code:'JBALB',name:'Rural Water Supply Department',localName:'Jabatan Bekalan Air Luar Bandar',zhName:'乡区水供局',description:'Sarawak agency responsible for rural water supply development, operations and related procurement.'},
  CIDB:{code:'CIDB',name:'Construction Industry Development Board Malaysia',zhName:'马来西亚建筑工业发展局',description:'Malaysia construction industry regulator. Construction tenders may require a valid CIDB contractor registration, grade and category.'},
  UPKJ:{code:'UPKJ',name:'Unit Pendaftaran Kontraktor dan Juruperunding',zhName:'砂拉越承包商及顾问注册单位',description:'Sarawak contractor and consultant registration unit. Some Sarawak government procurement requires the relevant UPKJ registration, class or category.'},
  MOF:{code:'MOF',name:'Ministry of Finance Malaysia',localName:'Kementerian Kewangan Malaysia',zhName:'马来西亚财政部',description:'Federal Ministry of Finance. Certain government supply and service procurement may require MOF supplier registration.'},
  RFQ:{code:'RFQ',name:'Request for Quotation',zhName:'询价',description:'A procurement request asking suppliers to provide pricing and commercial terms for a defined requirement.'},
  RFP:{code:'RFP',name:'Request for Proposal',zhName:'提案邀请',description:'A procurement request asking suppliers to submit a solution or proposal, usually including technical and commercial sections.'},
  LOA:{code:'LOA',name:'Letter of Award',zhName:'中标通知书',description:'Formal notice issued to the successful bidder confirming an award, subject to the terms stated by the buyer.'},
}

const BUYER_MAP:[RegExp,string,string][]=[
  [/^Public Works Department$/i,'JKR','JKR Sarawak'],
  [/^Department of Irrigation and Drainage$/i,'DID','DID Sarawak'],
  [/^Jabatan Bekalan Air Luar Bandar$/i,'JBALB','JBALB'],
]

export function buyerDisplayName(buyer:string){
  const hit=BUYER_MAP.find(([pattern])=>pattern.test(buyer.trim()))
  return hit?{display:hit[2],termCode:hit[1],fullName:buyer}:{display:buyer,termCode:null,fullName:buyer}
}

export function contextualTerms(input:{buyer:string;title:string;reference?:string|null}){
  const codes:string[]=[]
  const buyer=buyerDisplayName(input.buyer)
  if(buyer.termCode)codes.push(buyer.termCode)
  const text=`${input.title} ${input.reference??''}`.toUpperCase()
  for(const code of Object.keys(PROCUREMENT_TERMS)){
    if(new RegExp(`(^|[^A-Z0-9])${code}([^A-Z0-9]|$)`,'i').test(text))codes.push(code)
  }
  return Array.from(new Set(codes)).map(code=>PROCUREMENT_TERMS[code]).filter(Boolean)
}
