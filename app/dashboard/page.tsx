import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Role } from "@/lib/types/role"

export default async function DashboardIndexPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  const role = (profile?.role as Role | null) ?? "guest"

  redirect(`/dashboard/${role}`)
}
