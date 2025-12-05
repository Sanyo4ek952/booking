import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Role, UserProfile } from "@/lib/types/role"
import type { User } from "@supabase/supabase-js"

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Failed to fetch current user:", error)
      return null
    }

    return user ?? null
  } catch (error) {
    console.error("Unexpected error in getCurrentUser:", error)
    return null
  }
}

export async function getCurrentRole(currentUser?: User | null): Promise<Role | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const user = currentUser ?? (await supabase.auth.getUser()).data.user

    if (!user) {
      return null
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Failed to fetch current role:", error)
      return null
    }

    return (profile?.role as Role | null) ?? null
  } catch (error) {
    console.error("Unexpected error in getCurrentRole:", error)
    return null
  }
}

export async function getCurrentProfile(currentUser?: User | null): Promise<UserProfile | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const user = currentUser ?? (await supabase.auth.getUser()).data.user

    if (!user) {
      return null
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Failed to fetch current profile:", error)
      return null
    }

    return (profile as UserProfile | null) ?? null
  } catch (error) {
    console.error("Unexpected error in getCurrentProfile:", error)
    return null
  }
}
