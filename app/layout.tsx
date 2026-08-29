import './globals.css'
import './mobile-enhancements.css'
import { LanguageProvider } from '@/components/i18n'

export const metadata = {
  title: 'Borneo Business Intelligence',
  description: 'See where business is happening across Sarawak.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><LanguageProvider>{children}</LanguageProvider></body></html>
}
