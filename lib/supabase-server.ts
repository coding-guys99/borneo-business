import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = 'https://edpdaxgphxrzvfjquzgp.supabase.co'
const supabasePublishableKey = 'sb_publishable_gZitOhTr8USGqEJFyBvOHQ_VsSM9T1O'

export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Middleware refreshes cookies for Server Components.
          }
        },
      },
    }
  )
}
