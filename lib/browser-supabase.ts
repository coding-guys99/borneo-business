'use client'

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = 'https://edpdaxgphxrzvfjquzgp.supabase.co'
const supabasePublishableKey = 'sb_publishable_gZitOhTr8USGqEJFyBvOHQ_VsSM9T1O'

export const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey
)
