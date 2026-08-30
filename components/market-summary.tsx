'use client'

import {useI18n} from '@/components/i18n'

const copy={
 en:{eyebrow:'Sarawak market',title:'Sarawak opportunity coverage',sub:'The first launch market is Sarawak. Sabah and Brunei remain hidden while Sarawak buyer, project and supplier coverage is strengthened.',records:'Sarawak records indexed',open:'Currently open in our database',buyers:'Public buyers observed',industries:'Industries classified'},
 zh:{eyebrow:'砂拉越市场',title:'砂拉越商机覆盖',sub:'目前第一阶段聚焦砂拉越。Sabah 与 Brunei 暂时不显示，先把砂拉越采购方、项目和供应商资料做扎实。',records:'已收录砂拉越资料',open:'目前开放中的商机',buyers:'已观察到的公开采购方',industries:'已分类行业'},
 ms:{eyebrow:'Pasaran Sarawak',title:'Liputan peluang Sarawak',sub:'Pasaran pelancaran pertama ialah Sarawak. Sabah dan Brunei kekal disembunyikan sementara liputan pembeli, projek dan pembekal Sarawak diperkukuh.',records:'Rekod Sarawak diindeks',open:'Sedang dibuka dalam pangkalan data',buyers:'Pembeli awam diperhatikan',industries:'Industri diklasifikasikan'}
} as const

export default function MarketSummary({records,open,buyers,industries}:{records:number;open:number;buyers:number;industries:number}){const {lang}=useI18n();const c=copy[lang];return <><div className="eyebrow">{c.eyebrow}</div><h1 className="page-title">{c.title}</h1><p className="sub">{c.sub}</p><div className="market-grid"><div className="market-card"><strong>{records}</strong><span>{c.records}</span></div><div className="market-card"><strong>{open}</strong><span>{c.open}</span></div><div className="market-card"><strong>{buyers}</strong><span>{c.buyers}</span></div><div className="market-card"><strong>{industries}</strong><span>{c.industries}</span></div></div></>}
