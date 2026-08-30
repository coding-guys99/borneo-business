import Link from 'next/link'

export default function SiteFooter(){
 return <footer className="footer formal-footer"><div className="container">
  <div className="footer-grid"><div className="footer-brand"><strong>Borneo Business</strong><p>Business intelligence for opportunities, companies and commercial relationships across Borneo.</p></div>
  <div><strong>Company</strong><Link href="/about">About</Link><Link href="/purpose">Our Purpose</Link><Link href="/trust">Trust Center</Link></div>
  <div><strong>Trust & Data</strong><Link href="/trust/data-sources">Data Sources</Link><Link href="/trust/data-accuracy">Data Accuracy</Link><Link href="/trust/translation">Translation Notice</Link></div>
  <div><strong>Legal</strong><Link href="/legal/terms">Terms of Service</Link><Link href="/legal/privacy">Privacy Policy</Link><Link href="/legal/disclaimer">Disclaimer</Link><Link href="/legal/third-party">Third-Party & IP</Link></div></div>
  <div className="footer-bottom"><span>© 2026 Borneo Business. All rights reserved.</span><span>Independent business intelligence platform. Not affiliated with or endorsed by any government agency.</span></div>
 </div></footer>
}
