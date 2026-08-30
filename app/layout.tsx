import './globals.css'
import './mobile-enhancements.css'
import './intelligence.css'
import './context-info.css'
import { LanguageProvider } from '@/components/i18n'
import PublicHeader from '@/components/public-header'
import SiteFooter from '@/components/site-footer'
import OpportunityPdfShortcut from '@/components/opportunity-pdf-shortcut'

export const metadata = {
  title: 'Borneo Business Intelligence',
  description: 'See where business is happening across Sarawak.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><LanguageProvider><div className="site-shell"><PublicHeader/><div className="site-content">{children}</div><SiteFooter/><OpportunityPdfShortcut/></div></LanguageProvider></body></html>
}
