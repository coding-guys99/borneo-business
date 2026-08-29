'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/browser-supabase'

export default function MemberShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    let active = true

    async function validate() {
      const { data, error } = await supabase.auth.getUser()
      if (!active) return
      if (error || !data.user) {
        router.replace(`/signin?next=${encodeURIComponent(pathname)}`)
        return
      }
      setEmail(data.user.email ?? '')
      setReady(true)
    }

    validate()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'SIGNED_OUT') {
        setReady(false)
        router.replace('/signin')
        return
      }
      if (session?.user) {
        setEmail(session.user.email ?? '')
        setReady(true)
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [pathname, router])

  async function signOut() {
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (!ready) return <main className="member-loading">Opening your Business Radar…</main>

  const links = [
    ['/dashboard', 'Radar'],
    ['/pipeline', 'Pipeline'],
    ['/network', 'Network'],
    ['/profile', 'Company Profile'],
    ['/guide', 'Guide'],
  ]

  return <>
    <header className="member-topbar">
      <div className="container member-nav">
        <Link className="brand" href="/dashboard">BORNEO / BUSINESS</Link>
        <nav className="member-links">{links.map(([href, label]) => <Link key={href} className={pathname === href ? 'active' : ''} href={href}>{label}</Link>)}</nav>
        <div className="member-account"><span>{email}</span><button className="btn small" onClick={signOut}>Sign out</button></div>
      </div>
    </header>
    {children}
  </>
}
