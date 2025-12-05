"use client"

import { useCallback, useEffect, useState } from "react"
import type { Role } from "@/lib/types/role"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface UseUserResult {
  user: User | null
  role: Role | null
  isLoading: boolean
}

async function fetchUserWithRole() {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user")
    }

    const payload = (await response.json()) as { user: User | null; role: Role | null }

    return payload
  } catch (error) {
    console.error("useUser fetch error:", error)
    return { user: null, role: null }
  }
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadUser = useCallback(async () => {
    setIsLoading(true)
    const payload = await fetchUserWithRole()
    setUser(payload.user)
    setRole(payload.role)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [loadUser, supabase])

  return { user, role, isLoading }
}
