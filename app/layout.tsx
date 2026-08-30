import './globals.css'
import './mobile-enhancements.css'
import { LanguageProvider } from '@/components/i18n'
import PublicHeader from '@/components/public-header'
import SiteFooter from '@/components/site-footer'

export const metadata = {
  title: 'Borneo Business Intelligence',
  description: 'See where business is happening across Sarawak.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><LanguageProvider><div className="site-shell"><PublicHeader/><div className="site-content">{children}</div><SiteFooter/></div></LanguageProvider></body></html>
}
