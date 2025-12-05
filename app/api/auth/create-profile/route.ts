import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { userId, email, role } = await request.json()

    if (!userId || !email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabase
      .from("profiles")
      .insert([{ id: userId, email, role }])
      .select()
      .single()

    if (error) {
      console.error("Error creating user profile:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data }, { status: 201 })
  } catch (error) {
    console.error("Error in create-profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
