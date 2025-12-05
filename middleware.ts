import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { Role } from "@/lib/types/role"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function createMiddlewareClient(request: NextRequest, response: NextResponse) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value
      },
      set(name, value, options) {
        response.cookies.set({ name, value, ...options })
      },
      remove(name, options) {
        response.cookies.set({
          name,
          value: "",
          ...options,
          maxAge: 0,
        })
      },
    },
  })
}

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
  const supabase = createMiddlewareClient(request, supabaseResponse)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isDashboard = pathname.startsWith("/dashboard")
  const isAuthPage = pathname.startsWith("/auth")
  const isListingCreate = pathname.startsWith("/listing/create")

  let role: Role | null = null

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    role = (profile?.role as Role | null) || null
  }

  if (!user && (isDashboard || isListingCreate)) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL(`/dashboard/${role ?? "guest"}`, request.url))
  }

  if (user && isListingCreate && role !== "host") {
    return NextResponse.redirect(new URL(`/dashboard/${role ?? "guest"}`, request.url))
  }

  if (user && isDashboard) {
    const destination = `/dashboard/${role ?? "guest"}`

    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return NextResponse.redirect(new URL(destination, request.url))
    }

    if (pathname.startsWith("/dashboard/guest") && role !== "guest") {
      return NextResponse.redirect(new URL(destination, request.url))
    }

    if (pathname.startsWith("/dashboard/host") && role !== "host") {
      return NextResponse.redirect(new URL(destination, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/listing/:path*"],
}
