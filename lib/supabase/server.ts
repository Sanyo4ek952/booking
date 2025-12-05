import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        "x-client-info": "nextjs",
      },
    },
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set(name, value, options)
        } catch {
          // Handle cookie setting errors
        }
      },
      remove(name) {
        try {
          cookieStore.delete(name)
        } catch {
          // Handle cookie removal errors
        }
      },
    },
  })

  return supabase
}
