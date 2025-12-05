import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Listing } from "@/lib/types/listing"

export async function getListings() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false })

  return {
    data: (data as Listing[] | null) ?? [],
    error,
  }
}

export async function getListingById(id: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("listings").select("*").eq("id", id).single()

  return {
    data: (data as Listing | null) ?? null,
    error,
  }
}
