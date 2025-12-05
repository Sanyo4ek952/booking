import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith("/listing/create")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "host") {
      return NextResponse.redirect(new URL("/dashboard/guest", request.url))
    }
  }

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (user && (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/signup")) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    const role = profile?.role || "guest"

    if (profile) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
  }

  if (user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    const role = profile?.role || "guest"
    const pathname = request.nextUrl.pathname

    if (profile && pathname.startsWith("/dashboard/guest") && role !== "guest") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }

    if (profile && pathname.startsWith("/dashboard/host") && role !== "host") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }

    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/listing/:path*"],
}
