import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "host") {
      return NextResponse.json({ message: "Только хосты могут создавать объявления" }, { status: 403 })
    }

    const body = await request.json()

    const { data, error } = await supabase.from("listings").insert([
      {
        user_id: user.id,
        title: body.title,
        description: body.description,
        price: body.price,
        address: body.address,
        city: body.city,
        type: body.type,
        guests: body.guests,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        amenities: body.amenities,
        images: body.images,
      },
    ])

    if (error) throw error

    return NextResponse.json({ data, message: "Объявление создано" }, { status: 201 })
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ message: error instanceof Error ? error.message : "Ошибка сервера" }, { status: 500 })
  }
}
