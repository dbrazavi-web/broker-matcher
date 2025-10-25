import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export function getSupabase() {
  if (typeof window === 'undefined') {
    // Server-side: always create fresh
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  
  // Client-side: reuse instance
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  
  return supabaseInstance
}

// For backwards compatibility
export const supabase = typeof window !== 'undefined' ? getSupabase() : null
