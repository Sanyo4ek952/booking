import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Role, UserProfile } from "@/lib/types/role"

export async function getUserRole(userId: string): Promise<Role | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user role:", error)
    return null
  }

  return data?.role || null
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data || null
}

export async function createUserProfile(userId: string, email: string, role: Role): Promise<UserProfile | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        email,
        role,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating user profile:", error)
    return null
  }

  return data || null
}
