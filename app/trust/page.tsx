import Link from 'next/link'
import PublicHeader from '@/components/public-header'
import SiteFooter from '@/components/site-footer'

const items=[
 ['/trust/data-sources','Data Sources','Where our opportunity and market information comes from.'],
 ['/trust/data-accuracy','Data Accuracy','How we handle verification, updates and corrections.'],
 ['/trust/translation','Translation Notice','How machine-assisted translation and shared caching work.'],
 ['/legal/privacy','Privacy','How account, company and product-use data is handled.'],
 ['/legal/disclaimer','Disclaimer','Important limits on procurement and business information.'],
 ['/legal/third-party','Third-Party & IP','External services, source ownership and intellectual property.']
]
export default function Trust(){return <><PublicHeader/><main className="section"><div className="container policy-container"><div className="eyebrow">Trust & Legal</div><h1>How Borneo Business handles information</h1><p className="lead policy-lead">Borneo Business is an independent business intelligence platform. We organize public information to make opportunities easier to discover and understand, while keeping the original source authoritative.</p><div className="trust-principles"><div><strong>Independent</strong><span>Not a government agency and not endorsed by one.</span></div><div><strong>Source-led</strong><span>Critical procurement details should be verified at the original source.</span></div><div><strong>Correctable</strong><span>Users can report inaccurate or outdated information for review.</span></div></div><div className="trust-list">{items.map(([href,title,desc])=><Link href={href} key={href}><div><strong>{title}</strong><p>{desc}</p></div><span>View policy →</span></Link>)}</div></div></main><SiteFooter/></>}
