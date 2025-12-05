"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Role, UserProfile } from "@/lib/types/role"

interface UseRoleResult {
  user: any | null
  role: Role | null
  profile: UserProfile | null
  isGuest: boolean
  isHost: boolean
  isLoading: boolean
  isError: boolean
}

export function useRole(): UseRoleResult {
  const [role, setRole] = useState<Role | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setUser(null)
          setRole(null)
          setProfile(null)
          setIsLoading(false)
          return
        }

        setUser(user)

        const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          setIsError(true)
        } else if (profileData) {
          setProfile(profileData as UserProfile)
          setRole(profileData.role as Role)
        }
      } catch (error) {
        console.error("Error in useRole:", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  return {
    user,
    role,
    profile,
    isGuest: role === "guest",
    isHost: role === "host",
    isLoading,
    isError,
  }
}
