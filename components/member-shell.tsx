'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/browser-supabase'
import WelcomeTour from '@/components/welcome-tour'

export default function MemberShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    async function validate() {
      const { data, error } = await supabase.auth.getUser()
      if (!active) return
      if (error || !data.user) { router.replace(`/signin?next=${encodeURIComponent(pathname)}`); return }
      setReady(true)
    }
    validate()
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'SIGNED_OUT') { setReady(false); router.replace('/signin'); return }
      if (session?.user) setReady(true)
    })
    return () => { active = false; listener.subscription.unsubscribe() }
  }, [pathname, router])

  if (!ready) return <main className="member-loading">Opening your Business Radar…</main>
  return <><WelcomeTour mode="member"/>{children}</>
}
