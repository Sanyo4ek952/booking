import { getCurrentRole, getCurrentUser } from "@/lib/auth/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const user = await getCurrentUser()
    const role = await getCurrentRole(user)

    return NextResponse.json({ user, role })
  } catch (error) {
    console.error("/api/auth/me error:", error)
    return NextResponse.json({ user: null, role: null })
  }
}
