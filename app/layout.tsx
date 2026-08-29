import './globals.css'

export const metadata = {
  title: 'Borneo Business Intelligence',
  description: 'See where business is happening across Borneo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
